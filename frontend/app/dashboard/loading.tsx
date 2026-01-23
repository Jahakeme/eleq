export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo placeholder */}
            <div className="h-6 w-16 bg-muted rounded animate-pulse" />
            {/* Right side placeholders */}
            <div className="flex items-center gap-3">
              <div className="size-9 bg-muted rounded-full animate-pulse" />
              <div className="size-9 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        {/* User profile skeleton */}
        <div className="mb-8 flex items-center gap-4">
          <div className="size-16 bg-muted rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Search skeleton */}
        <div className="mb-8 lg:mb-12">
          <div className="max-w-xl mx-auto h-12 bg-muted rounded-full animate-pulse" />
        </div>

        {/* Filters row skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 lg:mb-14">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-20 bg-muted rounded-full animate-pulse"
              />
            ))}
          </div>
          <div className="h-10 w-40 bg-muted rounded-full animate-pulse" />
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-4/3 bg-muted rounded-xl mb-4" />
              <div className="space-y-2 px-1">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
