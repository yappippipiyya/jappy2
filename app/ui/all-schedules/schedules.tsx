import { Band } from "@/app/lib/types";


export interface ScheduleItem {
  bandId: number | null;
  date: string;
  startTime: string;
  endTime: string;
  sortKey: Date;
}

export type EnrichedSchedule = ScheduleItem & { band: Band };

export function Schedules({ enrichedSchedules }: { enrichedSchedules: EnrichedSchedule[] }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {enrichedSchedules.length > 0 ? (
        enrichedSchedules.map((item, index) => {

          const dateObj = new Date(item.date);
          const month = dateObj.getMonth() + 1;
          const day = dateObj.getDate();
          const dayOfWeek =["日", "月", "火", "水", "木", "金", "土"][dateObj.getDay()];

          return (
            <div
              key={index}
              className="group flex items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl hover:border-yellow-200 dark:hover:border-yellow-900/30 transition-colors"
            >
              {/* 日付アイコン */}
              <div className="shrink-0 w-16 h-16 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl mr-4">
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-0.5">
                  {month}月
                </span>
                <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-none">
                  {day}
                </span>
                <span className={`text-[10px] font-bold mt-1 ${dayOfWeek === '日' ? 'text-red-500' : dayOfWeek === '土' ? 'text-blue-500' : 'text-zinc-400'}`}>
                  {dayOfWeek}
                </span>
              </div>

              {/* 詳細情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-icons text-[14px] text-zinc-400">schedule</span>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {item.startTime} <span className="text-zinc-300 dark:text-zinc-700 px-0.5">-</span> {item.endTime}
                  </p>
                </div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 truncate">
                  {item.band?.name}
                </h3>
              </div>
            </div>
          );
        })
      ) : (
        /* スケジュールがない時の表示 */
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl">
          <div className="w-16 h-16 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-full mb-4">
            <span className="material-icons text-3xl text-zinc-400">event_busy</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            予定されているバンド練はありません
          </p>
        </div>
      )}
    </div>
  )
}