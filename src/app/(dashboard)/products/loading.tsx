import { TableSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-32 bg-neutral-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-neutral-200 rounded animate-pulse" />
      </div>

      <div className="flex gap-2 mb-5">
        <div className="h-10 w-64 bg-neutral-200 rounded animate-pulse" />
        <div className="h-10 w-36 bg-neutral-200 rounded animate-pulse" />
        <div className="h-10 w-20 bg-neutral-200 rounded animate-pulse" />
      </div>

      <TableSkeleton rows={8} />
    </div>
  );
}
