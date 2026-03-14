import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { fetchUser } from "@/app/lib/services/user";
import { fetchBands } from "@/app/lib/services/band";
import { fetchSchedules, fetchFixedSchedules } from "@/app/lib/services/schedule";

import { ScheduleManageContent } from "@/app/ui/schedule-manage/scheduleManageContent";
import { ScheduleManageSkeleton } from "@/app/ui/schedule-manage/scheduleManageSkeleton";


export const metadata = {
  title: '予定管理'
}

export default async function Page() {
  const session = await auth();
  const userEmail = session?.user?.email || ""
  const user = await fetchUser(null, userEmail)

  if (!user) return redirect("/signup");

  const bands = await fetchBands(user.id, true)
  const bandIds = bands.map((b) => b.id)

  const [userSchedules, bandSchedules, fixedSchedules] = await Promise.all([
    fetchSchedules(user.id, null),
    fetchSchedules(null, null, bandIds),
    fetchFixedSchedules(user.id),
  ]);

  const schedules = [...userSchedules, ...bandSchedules]

  return (
    <Suspense fallback={<ScheduleManageSkeleton />}>
      <h1 className="m-7 text-center justify-center text-2xl font-bold tracking-tight ">
        スケジュール管理
      </h1>
      <ScheduleManageContent user={user} bands={bands} schedules={schedules} fixedSchedules={fixedSchedules} />
    </Suspense>
  );
}