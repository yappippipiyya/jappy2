export function ScheduleSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-5 max-w-2xl mx-auto animate-pulse">
      <div className="space-y-3">
        {/* ヘッダー部分 */}
        <div className="flex items-center gap-2 px-1">
          <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>

        {/* スケジュールカードのスケルトン（2つ分） */}
        <div className="grid gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl"
            >
              <div className="shrink-0 w-12 h-12 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl mr-4" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="h-3 w-8 bg-zinc-100 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
                </div>
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 「全てのバンド練を確認」ボタンスケルトン */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 rounded-full mr-1" />
      </div>
    </div>
  );
}

export function BandsSkeletons() {
  return (
    <>
      <BandsHeaderSkeleton />
      <div className="flex flex-col gap-4 p-5 max-w-2xl mx-auto -mt-2 animate-pulse">
        <BandsSkeleton />
        <BandsSkeleton />
        <BandsSkeleton />
        <BandsSkeleton />
      </div>
    </>
  )
}

function BandsHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 mb-2 animate-pulse">
      {/* 「バンド一覧」タイトルのスケルトン */}
      <div className="h-7 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />

      {/* CreateButton のスケルトン */}
      <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}

function BandsSkeleton() {
  return (
    <div className="flex items-center justify-between p-5 border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl">
      <div className="flex-1 space-y-3">
        {/* バンド名スケルトン */}
        <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />

        {/* メンバースケルトン */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-4 w-48 bg-zinc-100 dark:bg-zinc-800/50 rounded" />
        </div>
      </div>

      {/* 右側アイコン・ボタンスケルトン */}
      <div className="flex items-center gap-4 ml-4">
        <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
        <div className="h-6 w-6 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
}