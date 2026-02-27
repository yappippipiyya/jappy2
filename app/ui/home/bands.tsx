import { fetchBands, fetchBandUsers } from "@/app/lib/services/band"
import Link from "next/link"
import CopyButton from "./CopyButton"


export async function Bands({ userId }: { userId: number }) {
  const bands = await fetchBands(userId)

  const bandsWithUsers = await Promise.all(
    bands.map(async (b) => {
      const users = await fetchBandUsers(b.id)
      return { ...b, users }
    })
  )

  return (
    <div className="flex flex-col gap-4 p-6">
      {bandsWithUsers.map((b) => (
        <div
          key={b.id}
          className="relative flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm rounded-3xl hover:shadow-md transition-shadow"
        >
          <Link href={`/${b.id}/band`} className="flex-1">
            <div className="flex flex-col gap-2">

              {/* バンド名 */}
              <h3 className="text-xl font-bold tracking-tight">
                {b.name}
              </h3>

              {/* メンバーセクション */}
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="material-icons text-lg">groups</span>
                <p className="font-medium">
                  {b.users.map((u) => u.name).join(" ・ ")}
                </p>
              </div>
            </div>
          </Link>

          {/* 右側のコピーボタン（招待用） */}
          <div className="ml-4">
            <CopyButton token={b.token || ""} />
          </div>
        </div>
      ))}
    </div>
  )
}