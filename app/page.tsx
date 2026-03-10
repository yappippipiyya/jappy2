import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { fetchUser } from "@/app/lib/services/user"
import { fetchBands } from "@/app/lib/services/band"

import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"
import { CreateButton } from "@/app/ui/home/createButton"
import { ScheduleCheck } from "@/app/ui/home/scheduleCheck"
import { Bands } from "@/app/ui/home/bands"
import { BandsSkeletons } from "@/app/ui/skeletons";




export default async function HomePage() {
  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  const bands = await fetchBands(user.id)

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navber />

      <div className="max-w-2xl mx-auto pb-20">

        {/* スケジュールセクション */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <ScheduleCheck bands={bands} />
        </section>

        {/* バンド一覧セクション */}
        <section className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          <div className="flex items-center justify-between px-5">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              バンド一覧
            </h2>
            <CreateButton />
          </div>

          <Suspense fallback={<BandsSkeletons />}>
            <Bands bands={bands} />
          </Suspense>
        </section>
      </div>

      <Footer />
    </main>
  );
}