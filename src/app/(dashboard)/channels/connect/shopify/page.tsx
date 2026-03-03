'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { initiateOAuth } from '@/app/actions/oauth';

export default function ConnectShopifyPage() {
  const [shopDomain, setShopDomain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const domain = shopDomain.toLowerCase().replace(/[^a-z0-9.-]/g, '').replace(/^https?:\/\//, '');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('channel_connections')
      .insert({
        user_id: user.id,
        channel_type: 'shopify',
        shop_domain: domain,
        access_token: 'pending_oauth',
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    await initiateOAuth('shopify', domain, '');
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Connect Shopify</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Enter your Shopify store domain to connect.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="shop" className="block text-sm font-medium text-neutral-700 mb-1">
            Store Domain
          </label>
          <input
            id="shop"
            type="text"
            value={shopDomain}
            onChange={(e) => setShopDomain(e.target.value)}
            placeholder="mystore.myshopify.com"
            required
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Example: mystore.myshopify.com
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Connecting...' : 'Connect Shopify'}
        </button>
      </form>
    </div>
  );
}
