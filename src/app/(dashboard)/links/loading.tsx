export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-neutral-200 rounded animate-pulse" />
        <div className="h-10 w-28 bg-neutral-200 rounded animate-pulse" />
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-5 w-16 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
                <div className="h-3 w-48 bg-neutral-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-4 bg-neutral-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
                <div className="h-3 w-40 bg-neutral-200 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-neutral-200 rounded animate-pulse" />
                <div className="h-8 w-14 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
