import Link from "next/link"
import { fetchSchedules } from "@/app/lib/services/schedule"
import { fetchBand } from "@/app/lib/services/band"
import { Band } from "@/app/lib/types"


export async function ScheduleCheck({ bands }: { bands: Band[] }) {
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

  const nextSchedule = allSchedules[0] || null;
  const nextNextSchedule = allSchedules[1] || null;

  const nextScheduleBand = await fetchBand(nextSchedule.bandId)
  const nextNextScheduleBand = await fetchBand(nextNextSchedule.bandId)

return (
  <div className="flex flex-col gap-3 p-5 max-w-2xl mx-auto">

    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 px-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
        </span>
        今後のスケジュール
      </h2>

      <div className="grid gap-3">
        {[
          { schedule: nextSchedule, band: nextScheduleBand, label: "NEXT" },
          { schedule: nextNextSchedule, band: nextNextScheduleBand, label: "LATER" }
        ].map((item, index) => (
          item.schedule && item.band && (
            <div key={index} className="group relative flex items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl hover:border-yellow-200 dark:hover:border-yellow-900/30">
              <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20 rounded-xl mr-4">
                <span className="material-icons text-yellow-600 dark:text-yellow-500">event</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 tracking-wider">
                    {item.label}
                  </span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {item.schedule.date}
                  </p>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {item.band.name}
                </h3>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {item.schedule.startTime} <span className="text-zinc-300 dark:text-zinc-700">~</span> {item.schedule.endTime}
                </p>
              </div>
            </div>
          )
        ))}
      </div>
    </div>

    {/* 全確認ボタン */}
    <Link
      href="/schedule-check"
      className="group flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-200 dark:shadow-none"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center p-2 rounded-lg">
          <span className="material-icons text-lg leading-none">calendar_month</span>
        </div>

        <span className="font-bold tracking-tight leading-none mb-0.5">
          全てのバンド練を確認
        </span>
      </div>
      <span className="material-icons text-zinc-300 dark:text-zinc-700 mr-1">chevron_right</span>
    </Link>
  </div>
);
}