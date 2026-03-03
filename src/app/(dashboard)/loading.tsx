import { DashboardSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <DashboardSkeleton />
    </div>
  );
}
