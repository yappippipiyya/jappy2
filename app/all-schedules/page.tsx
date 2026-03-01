import { auth } from "@/auth";
import Link from "next/link";

import Navber from "@/app/ui/navber";
import Footer from "@/app/ui/footer";

import { fetchUser } from "@/app/lib/services/user";
import { fetchBands } from "@/app/lib/services/band";
import { fetchSchedules } from "@/app/lib/services/schedule";

import { Schedules, EnrichedSchedule } from "@/app/ui/all-schedules/schedules";


export default async function AllSchedulesPage() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const user = await fetchUser(null, session.user.email);
  if (!user) return null;

  const bands = await fetchBands(user.id);

  const bandPracticeSchedules = (await Promise.all(
    bands.map((b) => fetchSchedules(0, b.id))
  )).flat();

  const now = new Date();
  const currentYMD = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  const allSchedules = bandPracticeSchedules.flatMap((entry) => {
    const scheduleData = entry.schedule as Record<string, number[]>;
    const schedules: { bandId: number | null, date: string, startTime: string, endTime: string, sortKey: Date }[] = [];

    Object.entries(scheduleData).forEach(([date, hours]) => {
      let start: number | null = null;

      hours.forEach((isBooked, hour) => {
        if (isBooked === 1 && start === null) {
          start = hour;
        } else if ((isBooked === 0 || hour === 23) && start !== null) {
          const end = isBooked === 1 ? hour + 1 : hour;

          const isFuture = date > currentYMD || (date === currentYMD && end > currentHour);

          if (isFuture) {
            schedules.push({
              bandId: entry.band_id,
              date,
              startTime: `${start.toString().padStart(2, '0')}:00`,
              endTime: `${end.toString().padStart(2, '0')}:00`,
              sortKey: new Date(`${date}T${start.toString().padStart(2, '0')}:00:00`)
            });
          }
          start = null;
        }
      });
    });
    return schedules;
  });

  allSchedules.sort((a, b) => a.sortKey.getTime() - b.sortKey.getTime());

  const enrichedSchedules: EnrichedSchedule[] = allSchedules
    .map(sch => {
      const band = bands.find(b => b.id === sch.bandId);
      return { ...sch, band };
    })
    .filter((item): item is EnrichedSchedule => !!item.band);

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
            <span className="material-icons text-zinc-600 dark:text-zinc-400">arrow_back</span>
          </Link>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            今後のバンド練
          </h1>
        </div>

        {/* スケジュール一覧セクション */}
        <Schedules enrichedSchedules={enrichedSchedules} />

      </div>

      <Footer />
    </main>
  );
}