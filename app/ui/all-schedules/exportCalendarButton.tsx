import Link from "next/link";

export function ExportCalendersButton() {
  return (
    <div className="flex justify-center w-full">
      <Link
        href="/all-schedules/all.ics"
        className="group flex items-center w-fit mb-3 justify-center p-3 px-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-lg shadow-zinc-200 dark:shadow-none"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg leading-none">
            calendar_month
          </span>
          <span className="font-bold tracking-tight leading-none">
            カレンダーに出力
          </span>
        </div>
      </Link>
    </div>
  );
}