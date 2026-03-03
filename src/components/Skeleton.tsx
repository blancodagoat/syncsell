'use client';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
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
          {[...Array(rows)].map((_, i) => (
            <tr key={i} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3">
                <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-8 bg-neutral-200 rounded animate-pulse ml-auto" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-12 bg-neutral-200 rounded animate-pulse ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-3/4 bg-neutral-200 rounded" />
        <div className="h-4 w-1/2 bg-neutral-200 rounded" />
        <div className="h-4 w-5/6 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse mb-2" />
            <div className="h-8 w-12 bg-neutral-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
