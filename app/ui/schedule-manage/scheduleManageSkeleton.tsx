export function ScheduleManageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-center m-7">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
      </div>

      <SelectMenuSkeleton />
      <ActionButtonsSkeleton />
      <GuideInfoSkeleton />
      <TableSkeleton />
    </div>
  );
}

function SelectMenuSkeleton() {
  return (
    <div className="flex items-center justify-center my-5">
      <div className="h-11 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800"></div>
    </div>
  );
}

function ActionButtonsSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-2 mx-5">
      <div className="h-10 w-44 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
      <div className="h-10 w-56 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
    </div>
  );
}

function GuideInfoSkeleton() {
  return (
    <div className="mx-5 mb-4">
      <div className="flex items-start gap-3 px-4 py-3 mt-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="w-5 h-5 mt-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0"></div>
        <div className="flex flex-col gap-2 w-full pt-1">
          <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-3 w-64 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-3 w-56 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="m-5">
      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
      <div className="overflow-hidden border border-slate-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900">
        <div className="flex bg-slate-100 dark:bg-gray-800 border-b border-slate-200 dark:border-zinc-700 h-10">
          <div className="w-12 border-r border-slate-200 dark:border-zinc-700"></div>
          {[...Array(7)].map((_, i) => (
            <div key={`th-${i}`} className="flex-1 border-r border-slate-200 dark:border-zinc-700 last:border-0"></div>
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={`tr-${i}`} className="flex h-10 border-b border-slate-200 dark:border-zinc-700 last:border-0 bg-white dark:bg-black">
            <div className="w-12 bg-slate-50 dark:bg-zinc-800 border-r border-slate-200 dark:border-zinc-700"></div>
            {[...Array(7)].map((_, j) => (
              <div key={`td-${j}`} className="flex-1 border-r border-slate-200 dark:border-zinc-700 last:border-0"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
