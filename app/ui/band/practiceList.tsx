"use client";

import { Band, Schedule } from "@/app/lib/types";


export function PracticeList({ band, schedules }: { band: Band; schedules: Schedule[] }) {
  if (band.archived) return null;

  const bandPractices = schedules.filter(
    (s) => Number(s.user_id) === 0 && Number(s.band_id) === band.id
  );

  if (bandPractices.length === 0) return null;

  const practiceSchedule = bandPractices[0].schedule as Record<string, number[]>;
  if (!practiceSchedule) return null;

  const blocks: { dateKey: string; startHour: number; endHour: number }[] = [];

  const sortedDates = Object.keys(practiceSchedule).sort();

  sortedDates.forEach((dateKey) => {
    const hours = practiceSchedule[dateKey];
    let startHour: number | null = null;

    for (let hour = 0; hour < 24; hour++) {
      if (hours[hour] === 1) {
        if (startHour === null) {
          startHour = hour;
        }
      } else {
        if (startHour !== null) {
          blocks.push({ dateKey, startHour, endHour: hour });
          startHour = null;
        }
      }
    }
    if (startHour !== null) {
      blocks.push({ dateKey, startHour, endHour: 24 });
    }
  });

  if (blocks.length === 0) return null;

  const dayJP = ["日", "月", "火", "水", "木", "金", "土"];
  const formattedLines = blocks.map((block) => {
    const d = new Date(block.dateKey);
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const day = dayJP[d.getDay()];

    const startStr = `${block.startHour.toString().padStart(2, "0")}:00`;
    const endStr = `${block.endHour.toString().padStart(2, "0")}:00`;

    return `${month}月${date}日(${day}) ${startStr}～${endStr}`;
  });

  const headerText = `${band.name}のバンド練`;
  const fullText = [headerText, ...formattedLines].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText).then(() => {
      alert("コピーしました");
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="mx-auto max-w-4xl mt-12 px-5">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 pb-6 pt-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <span className="material-icons text-[20px] text-zinc-500">event_available</span>
            {headerText}
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <span className="material-icons text-[16px]">content_copy</span>
          </button>
        </div>

        <ul className="space-y-2 ml-1 text-zinc-600 dark:text-zinc-400">
          {formattedLines.map((line, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500/50"></div>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
