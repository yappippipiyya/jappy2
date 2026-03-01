import { useMemo, useRef } from "react";
import { Band, Schedule, User } from "@/app/lib/types";
import { useScheduleMatrix, useScheduleSave, useTableTooltip, useTableScroll } from "./hooks";
import { TableStatus } from "./TableStatus";
import { TableTooltip } from "./TableTooltip";
import { TableCell } from "./TableCell";


export function Table({ mode, band, schedules, bandUsers }: { mode: "view" | "edit"; band: Band; schedules: Schedule[]; bandUsers: User[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // カスタムフックの呼び出し
  const { dateList, hours, scheduleMatrix } = useScheduleMatrix(band, schedules);
  const { checkedStates, setCheckedStates, status } = useScheduleSave(band, dateList, hours, scheduleMatrix);
  const { tooltip, handleInteract, handleLeave } = useTableTooltip();
  useTableScroll(dateList, scrollContainerRef);

  // ユーザーIDから名前を引くマップ
  const userMap = useMemo(() => {
    return bandUsers.reduce((acc, b) => {
      acc[b.id] = b.name || "不明";
      return acc;
    }, {} as Record<number, string>);
  }, [bandUsers]);

  if (dateList.length === 0) return null;

  return (
    <div>
      <TableStatus status={status} />

      <div ref={scrollContainerRef} className="m-5 overflow-auto border border-slate-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-black">
        <table className="w-full text-sm text-center border-collapse min-w-max">
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-30 bg-slate-100 dark:bg-gray-800 border-b border-r border-slate-200 dark:border-zinc-700 p-2 w-6">
                <span className="text-xs font-bold block">時刻</span>
              </th>
              {dateList.map(({ key, label }) => (
                <th key={key} id={`date-th-${key}`} className="sticky top-0 z-20 bg-slate-100 dark:bg-gray-800 border-b border-r border-slate-200 dark:border-zinc-700 p-2 min-w-11 whitespace-pre-wrap leading-tight text-slate-700 dark:text-zinc-200 font-semibold text-xs">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="group">
                <td className="sticky left-0 z-10 bg-slate-50 dark:bg-zinc-800 border-b border-r border-slate-200 dark:border-zinc-700 p-2 text-slate-600 dark:text-zinc-300 font-semibold text-xs transition-colors">
                  {hour}
                </td>
                {dateList.map(({ key }) => {
                  const cellId = `${key}-${hour}`;
                  return (
                    <TableCell
                      key={cellId}
                      mode={mode}
                      cellId={cellId}
                      cellData={scheduleMatrix[key]?.[hour]}
                      isPractice={checkedStates[cellId] ?? (scheduleMatrix[key]?.[hour]?.bandPractice || false)}
                      userMap={userMap}
                      onCheckChange={(id, checked) => setCheckedStates((prev) => ({ ...prev, [id]: checked }))}
                      onInteract={handleInteract}
                      onLeave={handleLeave}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TableTooltip tooltip={tooltip} />
    </div>
  );
}