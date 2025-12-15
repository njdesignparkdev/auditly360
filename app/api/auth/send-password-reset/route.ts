import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const getSiteUrl = (req: NextRequest) =>
  process.env.NEXT_PUBLIC_SITE_URL ||
  `${req.nextUrl.protocol}//${req.nextUrl.host}` ||
  'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch user profile for personalization
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('first_name, last_name, email')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Generate Supabase recovery link
    const redirectTo = `${getSiteUrl(request)}/auth/callback?next=/reset-password`;
    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo },
    });

    const actionLink =
      (data as any)?.properties?.action_link as string | undefined;

    if (linkError || !actionLink) {
      console.error('Generate link error:', linkError, 'response:', data);
      return NextResponse.json(
        {
          success: false,
          error:
            linkError?.message ||
            'Unable to generate password reset link. Check service role key and redirect URL.',
          details: data || null,
        },
        { status: 500 }
      );
    }

    // Send email via existing send-email endpoint using DB templates
    const sendResponse = await fetch(`${getSiteUrl(request)}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateType: 'password-reset',
        to: email,
        firstName: profile?.first_name || 'there',
        resetUrl: actionLink,
      }),
    });

    if (!sendResponse.ok) {
      const err = await sendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: err.error || 'Failed to send reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Reset email sent' });
  } catch (error) {
    console.error('Password reset API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

