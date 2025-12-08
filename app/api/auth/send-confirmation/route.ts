import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const getSiteUrl = (req: NextRequest) =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  `${req.nextUrl.protocol}//${req.nextUrl.host}` ||
  'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName = 'there', lastName = '' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const redirectTo = `${getSiteUrl(request)}/auth/callback`;

    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      options: { redirectTo },
    });

    const actionLink =
      data?.action_link ||
      (data as any)?.properties?.action_link;

    if (linkError || !actionLink) {
      console.error('Generate confirmation link error:', linkError, 'response:', data);
      return NextResponse.json(
        {
          success: false,
          error: linkError?.message || 'Unable to generate confirmation link',
          details: data || null,
        },
        { status: 500 }
      );
    }

    const sendResponse = await fetch(`${getSiteUrl(request)}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateType: 'confirmation',
        to: email,
        firstName,
        lastName,
        confirmationUrl: actionLink,
      }),
    });

    if (!sendResponse.ok) {
      const err = await sendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: err.error || 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Confirmation email sent' });
  } catch (error) {
    console.error('Confirmation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

