export default function Loading() {
  return (
    <div>
      <div className="h-8 w-24 bg-neutral-200 rounded animate-pulse mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-neutral-200 rounded animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-24 bg-neutral-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse" />
                <div className="h-9 w-24 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
