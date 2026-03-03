import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 60;

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [connectionsResult, linksResult] = await Promise.all([
    supabase
      .from('channel_connections')
      .select('*')
      .eq('user_id', user!.id)
      .eq('is_active', true),
    supabase
      .from('product_links')
      .select('*, link_targets(count)')
      .eq('user_id', user!.id)
      .eq('is_active', true),
  ]);

  const connections = connectionsResult.data;
  const links = linksResult.data;

  if (connectionsResult.error || linksResult.error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          Failed to load dashboard data. Please try again.
        </div>
      </div>
    );
  }

  const linkCount = links?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500 mb-1">Connected Channels</p>
          <p className="text-3xl font-semibold">{connections?.length ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500 mb-1">Linked Products</p>
          <p className="text-3xl font-semibold">{linkCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500 mb-1">Last Sync</p>
          <p className="text-lg font-medium">
            {connections?.[0]?.last_sync_at 
              ? new Date(connections[0].last_sync_at).toLocaleString() 
              : 'Never'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <Link 
            href="/channels" 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
          >
            Connect Channel
          </Link>
          <Link 
            href="/links/new" 
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-sm"
          >
            Create Link
          </Link>
        </div>
      </div>

      {(connections?.length ?? 0) === 0 && (
        <div className="mt-8 bg-primary-50 rounded-lg border border-primary-200 p-6">
          <h3 className="font-medium text-primary-800 mb-2">Get Started</h3>
          <p className="text-sm text-primary-700 mb-4">
            Connect your first channel (Shopify or Etsy) to start syncing inventory.
          </p>
          <Link href="/channels" className="text-primary-600 hover:underline text-sm font-medium">
            Go to Channels →
          </Link>
        </div>
      )}
    </div>
  );
}
