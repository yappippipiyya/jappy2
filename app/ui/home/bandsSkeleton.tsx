

export async function BandsSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5 max-w-2xl mx-auto -mt-3">
      <div className="group relative flex items-center justify-between p-5 border h-25 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl">
        <div className="flex flex-col gap-3">
          {/* バンド名 */}
          <div className="rounded-md flex h-5 w-30 bg-zinc-900/20 dark:bg-zinc-100/20">
          </div>

          {/* メンバーセクション */}
          <div className="rounded-md flex items-center h-5 w-60 bg-zinc-500/20 dark:bg-zinc-400/20">
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 rounded-md h-7 w-7 bg-zinc-900/20 dark:bg-zinc-100/20">
        </div>
      </div>
    </div>
  )
}