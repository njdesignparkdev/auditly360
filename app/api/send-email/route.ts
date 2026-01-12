import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '@/lib/supabase';

type TemplateType =
  | 'welcome'
  | 'confirmation'
  | 'password-reset'
  | 'plan-expiry'
  | 'plan-update'
  | 'plan-downgrade'
  | string;

interface IncomingBody {
  type?: TemplateType;
  templateType?: TemplateType;
  templateId?: string;
  email?: string;
  to?: string;
  subject?: string;
  html?: string;
  text?: string;
  firstName?: string;
  lastName?: string;
  confirmationUrl?: string;
  resetUrl?: string;
  planName?: string;
  expiryDate?: string;
  dashboardUrl?: string;
  oldPlanName?: string;
  newPlanName?: string;
  effectiveDate?: string;
  variables?: Record<string, string>;
}

const BRAND_COLOR = '#FF4B01';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.eu.mailgun.org',
  port: parseInt(process.env.MAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME || '',
    pass: process.env.MAIL_PASSWORD || '',
  },
  tls: { rejectUnauthorized: false },
});

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const applyVariables = (content: string, vars: Record<string, string>) => {
  return Object.entries(vars).reduce((acc, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return acc.replace(regex, value);
  }, content);
};

async function fetchTemplate({
  templateId,
  templateType,
}: {
  templateId?: string;
  templateType?: string;
}) {
  if (!templateId && !templateType) return null;

  let query = supabaseAdmin
    .from('email_templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1);

  if (templateId) {
    query = query.eq('id', templateId);
  } else if (templateType) {
    query = query.eq('template_type', templateType);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error('Template fetch error:', error);
    return null;
  }
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IncomingBody;
    const {
      type,
      templateType,
      templateId,
      email,
      to,
      subject,
      html,
      text,
      firstName,
      lastName,
      confirmationUrl,
      resetUrl,
      planName,
      expiryDate,
      dashboardUrl,
      oldPlanName,
      newPlanName,
      effectiveDate,
      variables = {},
    } = body;

    const recipient = email || to;
    if (!recipient) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Custom content path
    if (subject && html) {
      const mail = await transporter.sendMail({
        from: {
          name: process.env.MAIL_FROM_NAME || 'Auditly',
          address: process.env.MAIL_FROM_ADDRESS || 'no-reply@auditly.com',
        },
        to: recipient,
        subject,
        html,
        text: text || stripHtml(html),
      });
      return NextResponse.json({ success: true, id: mail.messageId });
    }

    // DB template path
    const resolvedType = templateType || type;
    const template = await fetchTemplate({
      templateId,
      templateType: resolvedType,
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Template not found or inactive' },
        { status: 404 }
      );
    }

    // Build variable bag from known fields + supplied variables
    const baseVars: Record<string, string> = {
      firstName: firstName || '',
      lastName: lastName || '',
      confirmationUrl: confirmationUrl || '',
      resetUrl: resetUrl || '',
      planName: planName || '',
      expiryDate: expiryDate || '',
      dashboardUrl:
        dashboardUrl ||
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`,
      oldPlanName: oldPlanName || '',
      newPlanName: newPlanName || '',
      effectiveDate: effectiveDate || '',
      email: recipient,
      brandColor: BRAND_COLOR,
    };

    const mergedVars = { ...baseVars, ...variables };

    const subjectFilled = applyVariables(template.subject, mergedVars);
    const htmlFilled = applyVariables(template.html_content, mergedVars);
    const textFilled = template.text_content
      ? applyVariables(template.text_content, mergedVars)
      : stripHtml(htmlFilled);

    const mail = await transporter.sendMail({
      from: {
        name: process.env.MAIL_FROM_NAME || 'Auditly',
        address: process.env.MAIL_FROM_ADDRESS || 'no-reply@auditly.com',
      },
      to: recipient,
      subject: subjectFilled,
      html: htmlFilled,
      text: textFilled,
    });

    return NextResponse.json({ success: true, id: mail.messageId });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
