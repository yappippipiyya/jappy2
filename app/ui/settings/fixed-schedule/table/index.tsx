"use client";

import { useState, Fragment } from "react";
import { FixedSchedule, User } from "@/app/lib/types";
import { useFixedScheduleMatrix, useFixedScheduleSave } from "./hooks";
import { TableStatus } from "@/app/ui/table/status";
import { TableCell } from "./TableCell";


export function Table({ user, fixedSchedule, onScheduleUpdate }: { user: User; fixedSchedule: FixedSchedule | null; onScheduleUpdate: (s: FixedSchedule) => void }) {
  const [isMorningExpanded, setIsMorningExpanded] = useState(false);
  const [isNightExpanded, setIsNightExpanded] = useState(false);

  const { dayList, hours, scheduleMatrix } = useFixedScheduleMatrix(fixedSchedule);
  const { checkedStates, setCheckedStates, status } = useFixedScheduleSave(user, dayList, hours, scheduleMatrix, onScheduleUpdate);

  const displayedHours = hours.filter(hour => {
    if (hour >= 0 && hour <= 7 && !isMorningExpanded) return false;
    if (hour >= 20 && hour <= 23 && !isNightExpanded) return false;
    return true;
  });

  const toggleColumn = (dayKey: string) => {
    const allSelected = displayedHours.every(hour => {
      const cellId = `${dayKey}-${hour}`;
      return checkedStates[cellId] ?? (scheduleMatrix[dayKey]?.[hour]?.isAvailable || false);
    });

    const newState = !allSelected;

    setCheckedStates(prev => {
      const next = { ...prev };
      displayedHours.forEach(hour => {
        const cellId = `${dayKey}-${hour}`;
        next[cellId] = newState;
      });
      return next;
    });
  };

  const toggleRow = (hour: number) => {
    const allSelected = dayList.every(({ key }) => {
      const cellId = `${key}-${hour}`;
      return checkedStates[cellId] ?? (scheduleMatrix[key]?.[hour]?.isAvailable || false);
    });

    const newState = !allSelected;

    setCheckedStates(prev => {
      const next = { ...prev };
      dayList.forEach(({ key }) => {
        const cellId = `${key}-${hour}`;
        next[cellId] = newState;
      });
      return next;
    });
  };

  if (dayList.length === 0) return null;

  return (
    <div>
      <TableStatus status={status} />

      <div className="my-5 overflow-auto border border-slate-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-black">
        <table className="w-full text-sm text-center border-collapse min-w-max">
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-30 bg-slate-100 dark:bg-gray-800 border-b border-r border-slate-200 dark:border-zinc-700 p-2 w-6">
                <span className="text-xs font-bold block">時刻</span>
              </th>
              {dayList.map(({ key, label }) => {
                const colorMap: Record<string, string> = {
                  "土": "text-blue-500",
                  "日": "text-red-500",
                };
                const textColor = colorMap[label] ?? "text-slate-700 dark:text-zinc-200";
                return (
                  <th
                    key={key}
                    className={`sticky top-0 z-20 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-b border-r border-slate-200 dark:border-zinc-700 p-2 min-w-11 whitespace-pre-wrap leading-tight font-semibold text-xs cursor-pointer transition-colors ${textColor}`}
                    onClick={() => toggleColumn(key)}
                  >
                    {label}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {!isMorningExpanded && (
              <tr>
                <td colSpan={dayList.length + 1} className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 p-0">
                  <button
                    onClick={() => setIsMorningExpanded(true)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    0時〜7時を表示
                  </button>
                </td>
              </tr>
            )}

            {displayedHours.map((hour) => (
              <Fragment key={hour}>
                <tr className="group">
                  <td
                    className="sticky left-0 z-10 bg-slate-50 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 border-b border-r border-slate-200 dark:border-zinc-700 p-2 text-slate-600 dark:text-zinc-300 font-semibold text-xs cursor-pointer transition-colors"
                    onClick={() => toggleRow(hour)}
                  >
                    {hour}
                  </td>
                  {dayList.map(({ key }) => {
                    const cellId = `${key}-${hour}`;
                    return (
                      <TableCell
                        key={cellId}
                        cellId={cellId}
                        isAvailable={checkedStates[cellId] ?? (scheduleMatrix[key]?.[hour]?.isAvailable || false)}
                        onCheckChange={(id, checked) => setCheckedStates((prev) => ({ ...prev, [id]: checked }))}
                      />
                    );
                  })}
                </tr>
                {hour === 7 && isMorningExpanded && (
                  <tr>
                    <td colSpan={dayList.length + 1} className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 p-0 text-center">
                      <button
                        onClick={() => setIsMorningExpanded(false)}
                        className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">expand_less</span>
                        0時〜7時を隠す
                      </button>
                    </td>
                  </tr>
                )}
                {hour === 19 && isNightExpanded && (
                  <tr>
                    <td colSpan={dayList.length + 1} className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 p-0 text-center">
                      <button
                        onClick={() => setIsNightExpanded(false)}
                        className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">expand_less</span>
                        20時〜23時を隠す
                      </button>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {!isNightExpanded && (
              <tr>
                <td colSpan={dayList.length + 1} className="bg-slate-50 dark:bg-zinc-800 p-0 border-t border-slate-200 dark:border-zinc-700">
                  <button
                    onClick={() => setIsNightExpanded(true)}
                    className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    20時〜23時を表示
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
