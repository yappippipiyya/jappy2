import { Band, Schedule, User } from "@/app/lib/types";
import { useMemo, useState, useEffect, useRef } from "react";
import { updateSchedule } from "@/app/lib/actions/schedule";


type SaveStatus = "idle" | "saving" | "saved" | "error";


export function Table({ mode, band, schedules, bandUsers }: { mode: "view" | "edit", band: Band, schedules: Schedule[], bandUsers: User[]}) {
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SaveStatus>("idle");
  const isInitialMount = useRef(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToToday = useRef(false);

  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const hideTooltip = () => setTooltip(null);
    window.addEventListener("scroll", hideTooltip, true);
    window.addEventListener("click", hideTooltip);
    window.addEventListener("touchstart", hideTooltip);

    return () => {
      window.removeEventListener("scroll", hideTooltip, true);
      window.removeEventListener("click", hideTooltip);
      window.removeEventListener("touchstart", hideTooltip);
    };
  },[]);

  const handleCellInteraction = (e: React.MouseEvent | React.TouchEvent, text: string) => {
    e.stopPropagation();
    if (!text) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    setTooltip({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
  };

  const saveSchedule = async (currentStates: Record<string, boolean>) => {
    setStatus("saving");

    const newSchedule: Record<string, (0 | 1)[]> = {};
    dateList.forEach(({ key }) => {
      const hoursArray = new Array(24).fill(0);
      hours.forEach(hour => {
        const cellId = `${key}-${hour}`;
        const isChecked = currentStates[cellId] ?? scheduleMatrix[key]?.[hour]?.bandPractice ?? false;
        if (isChecked) hoursArray[hour] = 1;
      });
      newSchedule[key] = hoursArray;
    });

    const result = await updateSchedule(0, newSchedule, band.id, "");

    if (result) {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (Object.keys(checkedStates).length === 0) {
      return;
    }

    setStatus("saving")
    const timer = setTimeout(() => {
      saveSchedule(checkedStates);
    }, 1000);

    return () => clearTimeout(timer);
  }, [checkedStates]);


  const { dateList, hours, scheduleMatrix } = useMemo(() => {
    if (!band.start_date || !band.end_date || !band.start_time || !band.end_time || !schedules) {
      return { dateList: [], hours:[], scheduleMatrix: {} };
    }


    const startHour = Number(band.start_time.slice(0, 2));
    const endHour = Number(band.end_time.slice(0, 2));
    const hoursArray = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

    // 1. スケジュールデータの事前集計
    // scheduleMatrix[dateKey][hour]
    const matrix: Record<string, Record<number, { memberIds: number[], bandPractice: boolean }>> = {};

    schedules.forEach((s) => {
      const isBand = s.user_id === 0;
      const sData = s.schedule as Record<string, number[]>;

      Object.entries(sData).forEach(([dateKey, hourFlags]) => {
        if (!matrix[dateKey]) matrix[dateKey] = {};

        // 対象の時間帯だけを処理
        hoursArray.forEach((hour) => {
          if (hourFlags[hour] === 1) {
            // 初期化
            if (!matrix[dateKey][hour]) {
              matrix[dateKey][hour] = { memberIds:[], bandPractice: false };
            }

            // フラグの振り分け
            if (isBand) {
              matrix[dateKey][hour].bandPractice = true;
            } else if (s.user_id) {
              matrix[dateKey][hour].memberIds.push(s.user_id);
            }
          }
        });
      });
    });

    // 2. 日付リストの生成
    const dList: { key: string; label: string }[] =[];
    const currentDate = new Date(band.start_date);
    const endDate = new Date(band.end_date);
    const dayJP =["日", "月", "火", "水", "木", "金", "土"];

    while (currentDate <= endDate) {
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth() + 1;
      const d = currentDate.getDate();

      const dateKey = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const label = `${m}/${d}\n${dayJP[currentDate.getDay()]}`;

      dList.push({ key: dateKey, label });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      dateList: dList,
      hours: hoursArray,
      scheduleMatrix: matrix
    };
  }, [band, schedules]);


  useEffect(() => {
    if (dateList.length === 0 || hasScrolledToToday.current) return;

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    const todayTh = document.getElementById(`date-th-${todayKey}`);
    const container = scrollContainerRef.current;

    if (todayTh && container) {
      const stickyWidth = 40;
      const scrollPosition = container.scrollLeft + (todayTh.getBoundingClientRect().left - container.getBoundingClientRect().left);

      container.scrollTo({
        left: scrollPosition - stickyWidth,
        behavior: 'smooth'
      });
    }

    hasScrolledToToday.current = true;
  },[dateList]);


  if (dateList.length === 0) return null;

  const userMap = Object.fromEntries(bandUsers.map(b => [b.id, b.name]));

  return (
    <div>
      {/* ステータス */}
      <div className="flex justify-end px-5 h-1">
        {status === "saving" && (
          <span className="text-xs text-blue-500 animate-pulse font-medium">● 保存中...</span>
        )}
        {status === "saved" && (
          <span className="text-xs text-green-500 font-medium">✓ 保存済み</span>
        )}
        {status === "error" && (
          <span className="text-xs text-red-500 font-medium">⚠️ 保存に失敗しました</span>
        )}
      </div>

      {/* テーブル表 */}
      <div
        ref={scrollContainerRef}
        className="m-5 overflow-auto border border-slate-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-black"
      >
        <table className="w-full text-sm text-center border-collapse min-w-max">
          <thead>
            <tr>
              {/* 左上 時刻 */}
              <th className="sticky top-0 left-0 z-30 bg-slate-100 dark:bg-gray-800 border-b border-r border-slate-200 dark:border-zinc-700 p-2 w-6">
                <span className="text-xs font-bold block">時刻</span>
              </th>

              {/* 日付ヘッダー */}
              {dateList.map(({ key, label }) => (
                <th
                  key={key}
                  id={`date-th-${key}`}
                  className="sticky top-0 z-20 bg-slate-100 dark:bg-gray-800 border-b border-r border-slate-200 dark:border-zinc-700 p-2 min-w-11 whitespace-pre-wrap leading-tight text-slate-700 dark:text-zinc-200 font-semibold text-xs"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="group">
                {/* 時刻列 */}
                <td className="sticky left-0 z-10 bg-slate-50 dark:bg-zinc-800 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 border-b border-r border-slate-200 dark:border-zinc-700 p-2 text-slate-600 dark:text-zinc-300 font-semibold text-xs transition-colors">
                  {hour}
                </td>

                {/* 各日付のセル */}
                {dateList.map(({ key }) => {
                  const cellId = `${key}-${hour}`;
                  const cellData = scheduleMatrix[key]?.[hour];
                  const memberIds = cellData?.memberIds ?? [];
                  const memberCount = cellData?.memberIds.length ?? 0;
                  const isPractice = checkedStates[cellId] ?? (cellData?.bandPractice || false);
                  const tooltipText = memberCount > 0
                    ? `${memberCount}人参加可能\n${memberIds.map(id => `・${userMap[id] || "不明"}`).join('\n')}`
                    : "参加可能者なし";

                  const bgColors = [
                    "bg-white dark:bg-zinc-900",
                    "bg-sky-50 dark:bg-sky-950",
                    "bg-sky-100 dark:bg-sky-900",
                    "bg-sky-200 dark:bg-sky-700",
                    "bg-sky-300 dark:bg-sky-500",
                    "bg-sky-400 dark:bg-sky-300",
                    "bg-sky-500 dark:bg-sky-100"
                    ]

                  return (
                    <td
                      key={`${key}-${hour}`}
                      onMouseEnter={(e) => handleCellInteraction(e, tooltipText)}
                      onMouseLeave={handleCellLeave}
                      onClick={(e) => handleCellInteraction(e, tooltipText)}
                      className={`border-b border-r border-slate-200 dark:border-zinc-700 p-2 transition-colors duration-150 ${bgColors[memberCount] || "bg-sky-500 dark:bg-sky-100"} ${
                        isPractice
                          ? "bg-size-[8px_8px] relative font-semibold outline-2 -outline-offset-2 outline-[#00a1ff] bg-[linear-gradient(45deg,#00a1ff_25%,transparent_25%,transparent_50%,#00a1ff_50%,#00a1ff_75%,transparent_75%,transparent)] dark:outline-[#0051ff] dark:bg-[linear-gradient(45deg,#0051ff_25%,transparent_25%,transparent_50%,#0051ff_50%,#0051ff_75%,transparent_75%,transparent)]"
                          : "text-slate-700 dark:text-zinc-300"
                      }`}
                    >
                    {mode === "view" ? (
                      <span>{memberCount > 0 ? memberCount : ""}</span>
                    ) : (
                      <input
                        type="checkbox"
                        checked={isPractice}
                        className="w-4 h-4 cursor-pointer accent-gray-500 dark:accent-gray-700"
                        onChange={(e) => {
                          setCheckedStates(prev => ({
                            ...prev,
                            [cellId]: e.target.checked
                          }));
                        }}
                      />
                    )}
                  </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 text-xs font-medium leading-relaxed text-white bg-slate-800 dark:bg-zinc-700 rounded-md shadow-xl pointer-events-none whitespace-pre-wrap w-max max-w-50"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 8}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-slate-800 dark:border-t-zinc-700" />
        </div>
      )}
    </div>
  );
}