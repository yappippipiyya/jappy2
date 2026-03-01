import { useState, useEffect, useMemo, useRef, RefObject } from "react";
import { Band, Schedule } from "@/app/lib/types";
import { updateSchedule } from "@/app/lib/actions/schedule";
import { SaveStatus, ScheduleMatrix, DateListItem, TooltipState } from "./types";


// 1. スケジュールデータをマトリクスに変換するフック
export function useScheduleMatrix(band: Band, schedules: Schedule[]) {
  return useMemo(() => {
    if (!band.start_date || !band.end_date || !band.start_time || !band.end_time || !schedules) {
      return { dateList: [], hours:[], scheduleMatrix: {} };
    }

    const startHour = Number(band.start_time.slice(0, 2));
    const endHour = Number(band.end_time.slice(0, 2));
    const hoursArray = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

    const matrix: ScheduleMatrix = {};
    schedules.forEach((s) => {
      const isBand = s.user_id === 0;
      const sData = s.schedule as Record<string, number[]>;

      Object.entries(sData).forEach(([dateKey, hourFlags]) => {
        if (!matrix[dateKey]) matrix[dateKey] = {};

        hoursArray.forEach((hour) => {
          if (hourFlags[hour] === 1) {
            if (!matrix[dateKey][hour]) {
              matrix[dateKey][hour] = { memberIds:[], bandPractice: false };
            }
            if (isBand) {
              matrix[dateKey][hour].bandPractice = true;
            } else if (s.user_id) {
              matrix[dateKey][hour].memberIds.push(s.user_id);
            }
          }
        });
      });
    });

    const dList: DateListItem[] =[];
    const currentDate = new Date(band.start_date);
    const endDate = new Date(band.end_date);
    const dayJP = ["日", "月", "火", "水", "木", "金", "土"];

    while (currentDate <= endDate) {
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth() + 1;
      const d = currentDate.getDate();

      const dateKey = `${y}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
      const label = `${m}/${d}\n${dayJP[currentDate.getDay()]}`;

      dList.push({ key: dateKey, label });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { dateList: dList, hours: hoursArray, scheduleMatrix: matrix };
  }, [band, schedules]);
}

// 2. 自動保存を管理するフック
export function useScheduleSave(band: Band, dateList: DateListItem[], hours: number[], scheduleMatrix: ScheduleMatrix) {
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SaveStatus>("idle");

  const saveSchedule = async (currentStates: Record<string, boolean>) => {
    setStatus("saving");

    const newSchedule: Record<string, (0 | 1)[]> = {};
    dateList.forEach(({ key }) => {
      const hoursArray = new Array(24).fill(0);
      hours.forEach((hour) => {
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
    if (Object.keys(checkedStates).length === 0) return;

    setStatus("saving");
    const timer = setTimeout(() => saveSchedule(checkedStates), 1000);
    return () => clearTimeout(timer);
  }, [checkedStates]);

  return { checkedStates, setCheckedStates, status };
}

// 3. ツールチップの表示状態を管理するフック
export function useTableTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    if (!tooltip) return;

    const hideTooltip = (e: Event) => {
      if (e.type === "scroll") {
        setTooltip(null);
        return;
      }

      const target = e.target as HTMLElement;

      if (target && (target.closest("td") || target.closest("#table-tooltip"))) {
        return;
      }

      setTooltip(null);
    };

    window.addEventListener("scroll", hideTooltip, true);
    window.addEventListener("click", hideTooltip);
    window.addEventListener("touchstart", hideTooltip);

    return () => {
      window.removeEventListener("scroll", hideTooltip, true);
      window.removeEventListener("click", hideTooltip);
      window.removeEventListener("touchstart", hideTooltip);
    };
  }, [tooltip]);

  const handleInteract = (e: React.MouseEvent | React.TouchEvent, text: string) => {
    if (e.type === "touchstart") {
      isTouch.current = true;
    }

    if (!text) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleLeave = () => {
    if (isTouch.current) {
      setTimeout(() => { isTouch.current = false; }, 500);
      return;
    }
    setTooltip(null);
  };

  return { tooltip, handleInteract, handleLeave };
}

// 4. 初回描画時に本日の日付にスクロールするフック
export function useTableScroll(dateList: DateListItem[], scrollContainerRef: RefObject<HTMLDivElement | null>) {
  const hasScrolledToToday = useRef(false);

  useEffect(() => {
    if (dateList.length === 0 || hasScrolledToToday.current) return;

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

    const todayTh = document.getElementById(`date-th-${todayKey}`);
    const container = scrollContainerRef.current;

    if (todayTh && container) {
      const stickyWidth = 40;
      const scrollPosition = container.scrollLeft + (todayTh.getBoundingClientRect().left - container.getBoundingClientRect().left);

      container.scrollTo({
        left: scrollPosition - stickyWidth,
        behavior: "smooth",
      });
    }

    hasScrolledToToday.current = true;
  }, [dateList, scrollContainerRef]);
}