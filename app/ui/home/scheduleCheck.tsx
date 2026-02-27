import Link from "next/link"


export async function ScheduleCheck() {
  return (
    <div className="flex flex-col gap-4 p-6">
        <div className="relative flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-xl hover:shadow-md transition-shadow">
          <div className="mr-4">
            <span className="material-icons text-lg text-yellow-400">music_note</span>
          </div>

          <Link href={`/schedule-check`} className="flex-1">
            <div className="flex flex-col gap-2">

              <h3 className="text-xl font-bold tracking-tight">
                バンド練確認
              </h3>

              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <p className="font-medium">
                  各バンドの練習予定を確認
                </p>
              </div>
            </div>
          </Link>

          <div className="ml-4">
            <span className="material-icons text-lg">chevron_right</span>
          </div>

        </div>
    </div>
  )
}