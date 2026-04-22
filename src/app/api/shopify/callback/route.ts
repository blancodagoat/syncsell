import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { createClient } from '@/lib/supabase/server';

function errorRedirect(request: NextRequest, reason: string) {
  const url = new URL('/channels/connect/shopify', request.url);
  url.searchParams.set('error', reason);
  return NextResponse.redirect(url);
}

function verifyHmac(searchParams: URLSearchParams, clientSecret: string): boolean {
  const providedHmac = searchParams.get('hmac');
  if (!providedHmac) return false;

  // Build sorted query string excluding hmac and signature
  const entries: [string, string][] = [];
  searchParams.forEach((value, key) => {
    if (key !== 'hmac' && key !== 'signature') {
      entries.push([key, value]);
    }
  });
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  const message = entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const computed = crypto
    .createHmac('sha256', clientSecret)
    .update(message)
    .digest('hex');

  // Constant-time compare
  try {
    const a = Buffer.from(computed, 'hex');
    const b = Buffer.from(providedHmac, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');
  const shopParam = searchParams.get('shop');

  const cookieStore = await cookies();
  const stateCookie = cookieStore.get('oauth_state')?.value;
  const shopDomainCookie = cookieStore.get('oauth_shop_domain')?.value;

  // Always clear the short-lived OAuth cookies after this handler, regardless of outcome
  cookieStore.delete('oauth_state');
  cookieStore.delete('oauth_shop_domain');

  if (!code || !stateParam) {
    return errorRedirect(request, 'missing_params');
  }

  if (!stateCookie || stateCookie !== stateParam) {
    return errorRedirect(request, 'invalid_state');
  }

  const shop = shopDomainCookie || shopParam;
  if (!shop) {
    return errorRedirect(request, 'missing_shop');
  }

  // Shop must look like *.myshopify.com for safety
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop)) {
    return errorRedirect(request, 'invalid_shop');
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return errorRedirect(request, 'missing_config');
  }

  // Verify HMAC signature
  if (!verifyHmac(searchParams, clientSecret)) {
    return errorRedirect(request, 'invalid_hmac');
  }

  // Exchange code for access token
  let accessToken: string;
  let grantedScope: string | undefined;
  try {
    const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }).toString(),
    });

    if (!tokenRes.ok) {
      return errorRedirect(request, 'token_exchange_failed');
    }

    const tokenJson = await tokenRes.json();
    accessToken = tokenJson.access_token;
    grantedScope = tokenJson.scope;
    if (!accessToken) {
      return errorRedirect(request, 'no_access_token');
    }
  } catch {
    return errorRedirect(request, 'token_exchange_error');
  }

  // Persist to Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return errorRedirect(request, 'not_authenticated');
  }

  const { error: dbError } = await supabase
    .from('channel_connections')
    .upsert(
      {
        user_id: user.id,
        channel_type: 'shopify',
        shop_domain: shop,
        access_token: accessToken,
        is_active: true,
      },
      { onConflict: 'user_id,channel_type,shop_domain' }
    );

  if (dbError) {
    return errorRedirect(request, 'db_error');
  }

  // Suppress unused-var warning for grantedScope (kept for future logging)
  void grantedScope;

  return NextResponse.redirect(new URL('/channels', request.url));
}
