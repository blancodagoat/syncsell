'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ConnectEtsyPage() {
  const [apiKey, setApiKey] = useState('');
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // TODO: API key should be stored via a server-side API route with encryption,
    // not directly from the client. This is a known security issue.
    if (apiKey.trim().length < 10 || apiKey.trim().length > 256) {
      setError('API key must be between 10 and 256 characters');
      setLoading(false);
      return;
    }

    if (shopName.trim().length < 2) {
      setError('Shop name must be at least 2 characters');
      setLoading(false);
      return;
    }

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
        channel_type: 'etsy',
        shop_domain: shopName.trim(),
        access_token: apiKey.trim(),
      });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push('/channels');
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Connect Etsy</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Link your Etsy shop to sync inventory.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="shop" className="block text-sm font-medium text-neutral-700 mb-1">
            Shop Name
          </label>
          <input
            id="shop"
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="yourshopname"
            required
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-neutral-700 mb-1">
            Etsy API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Etsy API key"
            required
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Get your API key from{' '}
            <a 
              href="https://www.etsy.com/developers/your-apps" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              Etsy Developer Portal
            </a>
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
          {loading ? 'Connecting...' : 'Connect Etsy'}
        </button>
      </form>
    </div>
  );
}
