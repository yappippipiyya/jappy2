import { fetchBandsUsers } from "@/app/lib/services/band"
import Link from "next/link"
import CopyButton from "./copyButton"
import { Band } from "@/app/lib/types"


export async function Bands({ bands }: { bands: Band[] }) {
  const bandIds = bands.map((b) => b.id);

  const allUsers = await fetchBandsUsers(bandIds);

  const bandsWithUsers = bands.map((b) => {
    const users = allUsers.filter((user: any) =>
      user.band_user.some((bu: any) => bu.band_id === b.id)
    );
    return { ...b, users };
  });

  return (
    <div className="flex flex-col gap-4 p-5 max-w-2xl mx-auto -mt-2">
      {bandsWithUsers.length > 0 ? (
        bandsWithUsers.map((b) => {
          const cardStyles = b.archived
            ? "bg-zinc-200 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 opacity-70"
            : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm"

          return (
            <div
              key={b.id}
              className={`group relative flex items-center justify-between p-5 border ${cardStyles} rounded-2xl transition-all hover:scale-[1.01] hover:shadow-md`}
            >
              <Link href={`/band/${b.token}`} className="flex-1 min-w-0">
                <div className="flex flex-col gap-1.5">
                  {/* バンド名 */}
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-bold tracking-tight truncate ${b.archived ? "text-zinc-500" : "text-zinc-900 dark:text-zinc-100"}`}>
                      {b.name}
                    </h3>
                    {b.archived && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-300 dark:bg-zinc-800 text-zinc-500">
                        ARCHIVED
                      </span>
                    )}
                  </div>

                  {/* メンバーセクション */}
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="material-symbols-outlined text-base">groups</span>
                    <p className="font-medium truncate">
                      {b.users.map((u) => u.name).join(" ・ ")}
                    </p>
                  </div>
                </div>
              </Link>

              {/* コピーボタン（招待用） */}
              <div className="flex items-center gap-2 ml-4">
                {!b.archived && (
                  <div className="transition-transform group-hover:scale-110">
                    <CopyButton token={b.token || ""} />
                  </div>
                )}
                <span className="material-symbols-outlined text-zinc-300 dark:text-zinc-700">chevron_right</span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl">
          <div className="w-16 h-16 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-full mb-4">
            <span className="material-symbols-outlined text-3xl text-zinc-400">event_busy</span>
          </div>
          <div className="font-bold m-2">
            参加しているバンドがありません。
          </div>
          <div className="text-zinc-500 dark:text-zinc-400">
            <p>まずはバンドに参加しましょう。</p>
            <p>バンドを作成するか、バンドマスターに依頼してください。</p>
          </div>
        </div>
      )}
    </div>
  )
}