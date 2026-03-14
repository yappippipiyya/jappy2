// app/ui/band/bandSkeleton.tsx

export function BandSkeleton() {
  return (
    <div className="animate-pulse">
      <HeaderSkeleton />
      <ModeSwitchSkeleton />
      <TableSkeleton />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center pt-7">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
        <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-full ml-4"></div>
      </div>
      <div className="space-y-2 mb-5 text-center flex flex-col items-center">
        <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      </div>
      <div className="space-y-2 m-5 flex flex-col items-center">
        <div className="h-4 w-80 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-4 w-88 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      </div>
    </div>
  );
}

function ModeSwitchSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center my-7 w-full gap-4">
      <div className="flex flex-col gap-1 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-64">
        <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
        <div className="h-10 w-full"></div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="m-5">
      <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
      <div className="border border-slate-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden">
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