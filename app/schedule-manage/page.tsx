import { auth } from "@/auth";

import Navber from "@/app/ui/navber"
import Footer from "@/app/ui/footer"

import { ScheduleManageContent } from "@/app/ui/schedule-manage/scheduleManageContent";
import { fetchBands } from "@/app/lib/services/band";
import { fetchSchedules } from "@/app/lib/services/schedule";
import { fetchUser } from "@/app/lib/services/user";


export default async function Page() {
  const session = await auth();
  const userEmail = session?.user?.email || ""
  const user = await fetchUser(null, userEmail)

  if (!user) return

  const [bands, schedules] = await Promise.all([
    fetchBands(user.id, true),
    fetchSchedules(user.id, null)
  ]);

  return (
    <>
      <Navber />

      <div className="-mt-10 pt-10 pb-15 bg-zinc-50 dark:bg-zinc-950">
        <h1 className="m-7 text-center justify-center text-2xl font-bold tracking-tight ">
          スケジュール管理
        </h1>
        <ScheduleManageContent bands={bands} schedules={schedules}/>

      </div>

      <Footer />
    </>
  );
}