'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { initiateOAuth } from '@/app/actions/oauth';

export default function ConnectEtsyPage() {
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const shop = shopName.trim();
    if (shop.length < 2) {
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

    await initiateOAuth('etsy', shop);
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

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Redirecting to Etsy...' : 'Connect with Etsy'}
        </button>
      </form>
    </div>
  );
}
