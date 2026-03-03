'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DashboardNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const nav = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/channels', label: 'Channels' },
    { href: '/products', label: 'Products' },
    { href: '/links', label: 'Links' },
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <nav className="flex gap-6">
          <Link href="/dashboard" className="font-semibold text-primary-600">
            Inventory Sync
          </Link>
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm ${
                pathname === href ? 'text-neutral-900 font-medium' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
