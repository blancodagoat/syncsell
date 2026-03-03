import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: connections } = await supabase
    .from('channel_connections')
    .select('id, channel_type, shop_domain')
    .eq('user_id', user.id)
    .eq('is_active', true);

  let query = supabase
    .from('channel_products')
    .select('*, channel_connection:channel_connections(channel_type, shop_domain)')
    .in('connection_id', connections?.map(c => c.id) ?? []);

  if (params.channel) {
    const conn = connections?.find(c => c.channel_type === params.channel);
    if (conn) {
      query = query.eq('connection_id', conn.id);
    }
  }

  if (params.q) {
    const searchTerm = `%${params.q}%`;
    query = query.or(`title.ilike.${searchTerm},sku.ilike.${searchTerm}`);
  }

  const { data: products, error: queryError } = await query.order('title');

  if (queryError) return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">Failed to load products. Please try again.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button disabled title="Coming soon" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm opacity-50 cursor-not-allowed">
          Sync Products
        </button>
      </div>

      <form method="GET" className="flex gap-2 mb-5">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search by title or SKU..."
          className="border rounded-lg px-3 py-2 text-sm flex-1 max-w-xs"
        />
        <select 
          name="channel" 
          defaultValue={params.channel ?? ''}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All channels</option>
          {connections?.map(c => (
            <option key={c.id} value={c.channel_type}>
              {c.channel_type} ({c.shop_domain})
            </option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm hover:bg-neutral-700">
          Filter
        </button>
      </form>

      {!connections || connections.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
          <p className="text-neutral-500 text-sm mb-4">No channels connected yet.</p>
          <Link href="/channels" className="text-primary-600 hover:underline text-sm">
            Connect a channel first
          </Link>
        </div>
      ) : !products || products.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
          <p className="text-neutral-500 text-sm mb-4">No products found.</p>
          <button disabled className="text-primary-600 opacity-50 cursor-not-allowed text-sm">
            Sync products from your channels
          </button>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Product</th>
                <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">SKU</th>
                <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Channel</th>
                <th className="text-right text-sm font-medium text-neutral-600 px-4 py-3">Qty</th>
                <th className="text-right text-sm font-medium text-neutral-600 px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900 truncate max-w-xs">
                      {product.title}
                    </p>
                    {product.listing_url && (
                      <a 
                        href={product.listing_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:underline"
                      >
                        View →
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 text-sm">
                    {product.sku ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs font-medium capitalize">
                      {product.channel_connection?.channel_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-600">
                    {product.price_cents 
                      ? `$${(product.price_cents / 100).toFixed(2)}` 
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
