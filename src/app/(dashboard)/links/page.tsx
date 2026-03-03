import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface LinkTarget {
  target_product: { title: string | null; sku: string | null; quantity: number | null };
  target_connection: { channel_type: string | null; shop_domain: string | null };
}

export const revalidate = 30;

export default async function LinksPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: links } = await supabase
    .from('product_links')
    .select(`
      *,
      source_product:channel_products!source_product_id(title, sku, quantity),
      source_connection:channel_connections!source_connection_id(channel_type, shop_domain),
      link_targets(
        target_product:channel_products!target_product_id(title, sku, quantity),
        target_connection:channel_connections!target_connection_id(channel_type, shop_domain)
      )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const { data: connections } = await supabase
    .from('channel_connections')
    .select('id, channel_type, shop_domain')
    .eq('user_id', user.id)
    .eq('is_active', true);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Product Links</h1>
        {connections && connections.length >= 2 && (
          <Link
            href="/links/new"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            Create Link
          </Link>
        )}
      </div>

      {!connections || connections.length < 2 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
          <p className="text-neutral-500 text-sm mb-4">
            You need at least 2 connected channels to create product links.
          </p>
          <Link href="/channels" className="text-primary-600 hover:underline text-sm">
            Connect another channel
          </Link>
        </div>
      ) : !links || links.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-8 text-center">
          <p className="text-neutral-500 text-sm mb-4">No product links yet.</p>
          <Link href="/links/new" className="text-primary-600 hover:underline text-sm">
            Create your first link
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => {
            const source = link.source_product;
            const targets = link.link_targets || [];
            return (
              <div key={link.id} className="bg-white border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    link.sync_direction === 'two_way' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {link.sync_direction === 'two_way' ? 'Two-way' : 'One-way'}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Source: {link.source_connection?.channel_type}
                  </span>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-medium">{source?.title ?? 'Unknown'}</p>
                    <p className="text-sm text-neutral-500">SKU: {source?.sku ?? '—'} · Qty: {source?.quantity ?? 0}</p>
                  </div>
                  
                  <span className="text-neutral-400">→</span>
                  
                  <div className="flex-1 min-w-[200px]">
                    {targets.length > 0 ? (
                      targets.map((t: LinkTarget, i: number) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium">{t.target_product?.title ?? 'Unknown'}</span>
                          <span className="text-neutral-500">
                            {' '}({t.target_connection?.channel_type}) · Qty: {t.target_product?.quantity ?? 0}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500">No targets linked</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border rounded hover:bg-neutral-50">
                      Sync Now
                    </button>
                    <button className="px-3 py-1 text-sm text-neutral-500 hover:text-neutral-700">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
