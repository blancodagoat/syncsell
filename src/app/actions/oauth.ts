'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function initiateOAuth(
  provider: 'shopify' | 'etsy',
  shopDomain: string,
  accessToken: string
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
    const redirectUri = process.env.SHOPIFY_REDIRECT_URI || 'http://localhost:3000/api/shopify/callback';
    const oauthUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_CLIENT_ID}&scope=read_products,write_products,read_inventory,write_inventory&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    redirect(oauthUrl);
  }
}
