'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function initiateOAuth(
  provider: 'shopify' | 'etsy',
  shopDomain: string
) {
  const state = crypto.randomUUID();

  const cookieStore = await cookies();
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });

  cookieStore.set('oauth_shop_domain', shopDomain, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });

  if (provider === 'shopify') {
    // Enforce *.myshopify.com before interpolating into a redirect URL
    if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shopDomain)) {
      throw new Error('Invalid Shopify shop domain');
    }
    const redirectUri = process.env.SHOPIFY_REDIRECT_URI || 'http://localhost:3000/api/shopify/callback';
    const oauthUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_CLIENT_ID}&scope=read_products,write_products,read_inventory,write_inventory&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    redirect(oauthUrl);
  }

  if (provider === 'etsy') {
    // PKCE: generate code_verifier (43-128 chars, unreserved URI chars)
    const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
    const codeVerifier = base64UrlEncode(verifierBytes);

    // code_challenge = base64url(SHA256(code_verifier))
    const challengeBuffer = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(codeVerifier)
    );
    const codeChallenge = base64UrlEncode(challengeBuffer);

    cookieStore.set('oauth_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    const redirectUri = process.env.ETSY_REDIRECT_URI;
    if (!redirectUri || !redirectUri.startsWith('https://')) {
      throw new Error('ETSY_REDIRECT_URI must be set and start with https:// (Etsy rejects http, even for localhost — use an https tunnel for dev)');
    }
    const scope = 'listings_r listings_w shops_r transactions_r';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.ETSY_API_KEY || '',
      redirect_uri: redirectUri,
      scope,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    const oauthUrl = `https://www.etsy.com/oauth/connect?${params.toString()}`;
    redirect(oauthUrl);
  }
}
