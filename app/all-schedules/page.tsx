import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { fetchUser } from "@/app/lib/services/user";

import Navber from "@/app/ui/navbar";
import Footer from "@/app/ui/footer";
import { Schedules } from "@/app/ui/all-schedules/schedules";
import { AllSchedulesSkeleton } from "@/app/ui/all-schedules/scheduleSkeleton";


export const metadata = {
  title: '今後のバンド練'
}

export default async function AllSchedulesPage() {
  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  return (
    <main className="min-h-screen pb-20 bg-zinc-50 dark:bg-zinc-950">
      <Navber />

      <Suspense fallback={<AllSchedulesSkeleton />}>
        <div className="max-w-2xl mx-auto pt-4 px-5">

          {/* ヘッダーセクション */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">arrow_back</span>
            </Link>
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              今後のバンド練
            </h1>
          </div>

          {/* スケジュール一覧セクション */}
          <Schedules user={user} />

        </div>
      </Suspense>

      <Footer />
    </main>
  );
}