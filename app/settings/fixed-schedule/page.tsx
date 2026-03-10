import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"

import { FixedScheduleContent } from "@/app/ui/settings/fixed-schedule/fixedScheduleContent";
import { fetchFixedSchedules } from "@/app/lib/services/schedule";
import { fetchUser } from "@/app/lib/services/user";


export default async function Page() {
  const session = await auth();
  const userEmail = session?.user?.email || ""
  const user = await fetchUser(null, userEmail)

  if (!user) return redirect("/signup");

  const fixedSchedules = await fetchFixedSchedules(user.id)
  const fixedSchedule = fixedSchedules.length > 0 ? fixedSchedules[0] : null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navber />

      <div className="max-w-2xl mx-auto pb-20 pt-8 px-5">

        {/* ヘッダーセクション */}
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">arrow_back</span>
          </Link>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            固定スケジュール
          </h1>
        </div>

        <div className="flex items-start gap-3 px-4 py-3 my-6 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50">
          <span className="material-symbols-outlined text-sky-500 dark:text-sky-400 text-[20px] mt-0.5 shrink-0">info</span>
          <div className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed">
            <p>曜日ごとの固定スケジュールを設定します。</p>
            <p>固定スケジュールは<span className="font-bold">予定管理</span>から適用できます。</p>
          </div>
        </div>

        <FixedScheduleContent user={user} fixedSchedule={fixedSchedule} />

      </div>

      <Footer />
    </main>
  );
}