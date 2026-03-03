import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardNav userEmail={user.email!} />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
