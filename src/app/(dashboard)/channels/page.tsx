import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const revalidate = 60;

const CHANNELS = [
  { 
    type: 'shopify', 
    name: 'Shopify', 
    description: 'Connect your Shopify store via OAuth',
    icon: '🛒',
  },
  { 
    type: 'etsy', 
    name: 'Etsy', 
    description: 'Connect your Etsy shop using API key',
    icon: '🏪',
  },
];

export default async function ChannelsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: connections } = await supabase
    .from('channel_connections')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true);

  const connectedTypes = new Set(connections?.map(c => c.channel_type) ?? []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Channels</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {CHANNELS.map(channel => {
          const isConnected = connectedTypes.has(channel.type);
          return (
            <div key={channel.type} className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{channel.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{channel.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{channel.description}</p>
                  {isConnected ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                      <button className="text-sm text-neutral-500 hover:text-neutral-700">
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={`/channels/connect/${channel.type}`}
                      className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                    >
                      Connect
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {connections && connections.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-4">Connected Channels</h2>
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Channel</th>
                  <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Store</th>
                  <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Last Sync</th>
                  <th className="text-left text-sm font-medium text-neutral-600 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {connections.map(conn => (
                  <tr key={conn.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3 font-medium capitalize">{conn.channel_type}</td>
                    <td className="px-4 py-3 text-neutral-600">{conn.shop_domain ?? '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {conn.last_sync_at 
                        ? new Date(conn.last_sync_at).toLocaleString() 
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
