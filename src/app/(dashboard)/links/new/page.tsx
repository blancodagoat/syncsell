'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Connection {
  id: string;
  channel_type: string;
  shop_domain: string;
}

interface Product {
  id: string;
  title: string;
  sku: string;
  quantity: number;
}

export default function NewLinkPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [sourceConnectionId, setSourceConnectionId] = useState('');
  const [sourceProducts, setSourceProducts] = useState<Product[]>([]);
  const [sourceProductId, setSourceProductId] = useState('');
  const [targetConnectionId, setTargetConnectionId] = useState('');
  const [targetProducts, setTargetProducts] = useState<Product[]>([]);
  const [targetProductIds, setTargetProductIds] = useState<string[]>([]);
  const [syncDirection, setSyncDirection] = useState<'one_way' | 'two_way'>('one_way');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadConnections() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: conns } = await supabase
        .from('channel_connections')
        .select('id, channel_type, shop_domain')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (conns && conns.length >= 2) {
        setConnections(conns);
        setSourceConnectionId(conns[0].id);
        setTargetConnectionId(conns[1].id);
      }
      setLoading(false);
    }
    loadConnections();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      if (!sourceConnectionId) return;
      const { data } = await supabase
        .from('channel_products')
        .select('id, title, sku, quantity')
        .eq('connection_id', sourceConnectionId)
        .order('title');
      setSourceProducts(data || []);
    }
    loadProducts();
  }, [sourceConnectionId]);

  useEffect(() => {
    async function loadProducts() {
      if (!targetConnectionId) return;
      const { data } = await supabase
        .from('channel_products')
        .select('id, title, sku, quantity')
        .eq('connection_id', targetConnectionId)
        .order('title');
      setTargetProducts(data || []);
    }
    loadProducts();
  }, [targetConnectionId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Not authenticated');
      setSaving(false);
      return;
    }

    const { data: link, error: linkError } = await supabase
      .from('product_links')
      .insert({
        user_id: user.id,
        source_connection_id: sourceConnectionId,
        source_product_id: sourceProductId,
        sync_direction: syncDirection,
      })
      .select()
      .single();

    if (linkError) {
      setError(linkError.message);
      setSaving(false);
      return;
    }

    if (targetProductIds.length > 0) {
      const targets = targetProductIds.map(target_product_id => ({
        link_id: link.id,
        target_connection_id: targetConnectionId,
        target_product_id,
      }));

      const { error: targetsError } = await supabase
        .from('link_targets')
        .insert(targets);

      if (targetsError) {
        setError(targetsError.message);
        setSaving(false);
        return;
      }
    }

    router.push('/links');
    router.refresh();
  }

  if (loading) {
    return <div className="p-8 text-center text-neutral-500">Loading...</div>;
  }

  if (connections.length < 2) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Create Link</h1>
        <div className="bg-neutral-100 rounded-lg p-6 text-center">
          <p className="text-neutral-500">You need at least 2 connected channels to create a link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Create Product Link</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <h2 className="font-medium mb-3">Source (Master)</h2>
          <p className="text-sm text-neutral-500 mb-4">
            Changes to quantity in this channel will sync to targets.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Channel
              </label>
              <select
                value={sourceConnectionId}
                onChange={(e) => {
                  setSourceConnectionId(e.target.value);
                  setSourceProductId('');
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {connections.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.channel_type} ({c.shop_domain})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Product
              </label>
              <select
                value={sourceProductId}
                onChange={(e) => setSourceProductId(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Select product...</option>
                {sourceProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} {p.sku ? `(${p.sku})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <h2 className="font-medium mb-3">Targets</h2>
          <p className="text-sm text-neutral-500 mb-4">
            These products will receive quantity updates from the source.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Channel
              </label>
              <select
                value={targetConnectionId}
                onChange={(e) => {
                  setTargetConnectionId(e.target.value);
                  setTargetProductIds([]);
                }}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              >
                {connections.filter(c => c.id !== sourceConnectionId).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.channel_type} ({c.shop_domain})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Products
              </label>
              <select
                multiple
                value={targetProductIds}
                onChange={(e) => setTargetProductIds(Array.from(e.target.selectedOptions, o => o.value))}
                className="w-full px-3 py-2 border rounded-lg text-sm h-24"
              >
                {targetProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} {p.sku ? `(${p.sku})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <h2 className="font-medium mb-3">Sync Direction</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="direction"
                value="one_way"
                checked={syncDirection === 'one_way'}
                onChange={() => setSyncDirection('one_way')}
              />
              <span className="text-sm">One-way (source → targets)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="direction"
                value="two_way"
                checked={syncDirection === 'two_way'}
                onChange={() => setSyncDirection('two_way')}
              />
              <span className="text-sm">Two-way (sync both directions)</span>
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Link'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-neutral-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
