export function VehicleCardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-24" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="skeleton h-6 w-3/4" />
        <div className="flex items-center gap-3">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-16" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-7 w-28" />
          <div className="skeleton h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-8 w-28" />
        </div>
        <div className="skeleton h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="space-y-px">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="skeleton h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-3 w-1/5" />
            </div>
            <div className="skeleton h-5 w-20 rounded-full" />
            <div className="skeleton h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
