export function AllSchedulesSkeleton() {
  return (
    <div className="max-w-2xl mx-auto pb-20 pt-8 px-5 animate-pulse">
      {/* ヘッダーセクションのスケルトン */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>

      {/* スケジュール一覧のスケルトン */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
          >
            {/* 日付アイコンのスケルトン */}
            <div className="shrink-0 w-16 h-16 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl mr-4 flex flex-col items-center justify-center gap-1">
              <div className="h-2 w-8 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-5 w-6 bg-zinc-300 dark:bg-zinc-700 rounded" />
              <div className="h-2 w-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>

            {/* 詳細情報のスケルトン */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
              </div>
              <div className="h-5 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}