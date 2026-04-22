import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

function errorRedirect(request: NextRequest, reason: string) {
  const url = new URL('/channels/connect/etsy', request.url);
  url.searchParams.set('error', reason);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get('oauth_state')?.value;
  const shopDomainCookie = cookieStore.get('oauth_shop_domain')?.value;
  const codeVerifierCookie = cookieStore.get('oauth_code_verifier')?.value;

  // Always clear OAuth cookies after this handler
  cookieStore.delete('oauth_state');
  cookieStore.delete('oauth_shop_domain');
  cookieStore.delete('oauth_code_verifier');

  if (!code || !stateParam) {
    return errorRedirect(request, 'missing_params');
  }
  if (!stateCookie || stateCookie !== stateParam) {
    return errorRedirect(request, 'invalid_state');
  }
  if (!codeVerifierCookie) {
    return errorRedirect(request, 'missing_verifier');
  }

  const clientId = process.env.ETSY_API_KEY;
  if (!clientId) {
    return errorRedirect(request, 'missing_config');
  }

  const redirectUri = process.env.ETSY_REDIRECT_URI;
  if (!redirectUri || !redirectUri.startsWith('https://')) {
    return errorRedirect(request, 'missing_config');
  }

  // Exchange code for access token (Etsy PKCE; no client secret needed)
  let accessToken: string;
  let refreshToken: string | undefined;
  let expiresIn: number | undefined;
  try {
    const tokenRes = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        code_verifier: codeVerifierCookie,
      }).toString(),
    });

    if (!tokenRes.ok) {
      return errorRedirect(request, 'token_exchange_failed');
    }

    const tokenJson = await tokenRes.json();
    accessToken = tokenJson.access_token;
    refreshToken = tokenJson.refresh_token;
    expiresIn = tokenJson.expires_in;
    if (!accessToken) {
      return errorRedirect(request, 'no_access_token');
    }
  } catch {
    return errorRedirect(request, 'token_exchange_error');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return errorRedirect(request, 'not_authenticated');
  }

  const expiresAt = expiresIn
    ? new Date(Date.now() + expiresIn * 1000).toISOString()
    : null;

  const { error: dbError } = await supabase
    .from('channel_connections')
    .upsert(
      {
        user_id: user.id,
        channel_type: 'etsy',
        shop_domain: shopDomainCookie || null,
        access_token: accessToken,
        refresh_token: refreshToken ?? null,
        token_expires_at: expiresAt,
        is_active: true,
      },
      { onConflict: 'user_id,channel_type,shop_domain' }
    );

  if (dbError) {
    return errorRedirect(request, 'db_error');
  }

  return NextResponse.redirect(new URL('/channels', request.url));
}
