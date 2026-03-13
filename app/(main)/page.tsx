import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { fetchUser } from "@/app/lib/services/user"
import { fetchBands } from "@/app/lib/services/band"

import { CreateButton } from "@/app/ui/home/createButton"
import { ScheduleCheck } from "@/app/ui/home/scheduleCheck"
import { Bands } from "@/app/ui/home/bands"
import { ScheduleSkeleton, BandsSkeletons } from "@/app/ui/home/skeletons";


export const metadata = {
  title: 'ホーム'
}

export default async function HomePage() {
  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  const allBands = await fetchBands(user.id)
  const notArchivedBands = allBands.filter(b => !b.archived)

  return (
    <>
      <div className="max-w-2xl mx-auto">

        {/* スケジュールセクション */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <Suspense fallback={<ScheduleSkeleton />}>
            <ScheduleCheck bands={notArchivedBands} />
          </Suspense>
        </section>

        {/* バンド一覧セクション */}
        <section className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          <Suspense fallback={<BandsSkeletons />}>
            <div className="flex items-center justify-between px-5">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                バンド一覧
              </h2>
              <CreateButton />
            </div>

            <Bands bands={allBands} />
          </Suspense>
        </section>

      </div>
    </>
  );
}