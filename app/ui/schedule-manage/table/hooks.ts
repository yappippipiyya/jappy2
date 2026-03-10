import { useState, useEffect, useMemo, useRef, useCallback, RefObject } from "react";
import { User, Band, Schedule } from "@/app/lib/types";
import { updateSchedule } from "@/app/lib/actions/schedule";
import { SaveStatus, DateListItem, TooltipState } from "@/app/ui/table/types";
import { ScheduleMatrix } from "./types";


// 1. スケジュールデータをマトリクスに変換するフック
export function useScheduleMatrix(selectedBandId: number, bands: Band[], band: Partial<Band>, schedules: Schedule[], user: User) {
  return useMemo(() => {
    let startDateStr = band.start_date;
    let endDateStr = band.end_date;
    let startTimeStr = band.start_time;
    let endTimeStr = band.end_time;

    if (selectedBandId === 0) {
      const validBands = bands.filter(b => b.start_date && b.end_date && b.start_time && b.end_time);
      if (validBands.length === 0) return { dateList: [], hours: [], scheduleMatrix: {} };

      startDateStr = validBands.reduce((min, b) => b.start_date! < min ? b.start_date! : min, validBands[0].start_date!);
      endDateStr = validBands.reduce((max, b) => b.end_date! > max ? b.end_date! : max, validBands[0].end_date!);

      const parseHour = (t: string) => Number(t.slice(0, 2));
      const minStart = Math.min(...validBands.map(b => parseHour(b.start_time!)));
      const maxEnd = Math.max(...validBands.map(b => parseHour(b.end_time!)));

      startTimeStr = `${minStart.toString().padStart(2, "0")}:00`;
      endTimeStr = `${maxEnd.toString().padStart(2, "0")}:00`;
    }

    if (!startDateStr || !endDateStr || !startTimeStr || !endTimeStr || !schedules) {
      return { dateList: [], hours: [], scheduleMatrix: {} };
    }

    const startHour = Number(startTimeStr.slice(0, 2));
    const endHour = Number(endTimeStr.slice(0, 2));
    const hoursArray = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

    // 日付リストの生成
    const dList: DateListItem[] = [];
    const currentDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
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

    // マトリクスの初期化
    const matrix: ScheduleMatrix = {};
    dList.forEach(({ key }) => {
      matrix[key] = {};
      hoursArray.forEach((hour) => {
        matrix[key][hour] = { practiceBandIds: [], isAvailable: false, isDefaultAvailable: false };
      });
    });

    // スケジュールを種類別に抽出
    const userDefault = schedules.find((s) => Number(s.user_id) === user.id && (!s.band_id || Number(s.band_id) === 0));
    const userSpecific = selectedBandId > 0 ? schedules.find((s) => Number(s.user_id) === user.id && Number(s.band_id) === selectedBandId) : null;
    const bandPractices = schedules.filter((s) => Number(s.user_id) === 0 && Number(s.band_id) > 0);

    // 1. デフォルトスケジュールを反映
    if (userDefault) {
      const sData = userDefault.schedule as Record<string, number[]>;
      Object.entries(sData).forEach(([dateKey, flags]) => {
        if (matrix[dateKey]) {
          hoursArray.forEach((hour) => {
            if (flags[hour] === 1) {
              matrix[dateKey][hour].isDefaultAvailable = true;
              if (selectedBandId === 0) {
                matrix[dateKey][hour].isAvailable = true;
              }
            }
          });
        }
      });
    }

    // 2. バンドごとのスケジュールで上書き (デフォルトより優先)
    if (userSpecific) {
      const sData = userSpecific.schedule as Record<string, number[]>;
      Object.entries(sData).forEach(([dateKey, flags]) => {
        if (matrix[dateKey]) {
          hoursArray.forEach((hour) => {
            if (flags[hour] !== undefined) {
              matrix[dateKey][hour].isAvailable = flags[hour] === 1;
            }
          });
        }
      });
    }

    // 3. バンド練習の予定を反映
    bandPractices.forEach((practice) => {
      const bId = Number(practice.band_id);
      const sData = practice.schedule as Record<string, number[]>;
      Object.entries(sData).forEach(([dateKey, flags]) => {
        if (matrix[dateKey]) {
          hoursArray.forEach((hour) => {
            if (flags[hour] === 1) {
              matrix[dateKey][hour].practiceBandIds.push(bId);
            }
          });
        }
      });
    });

    return { dateList: dList, hours: hoursArray, scheduleMatrix: matrix };
  }, [selectedBandId, bands, band, schedules, user.id]);
}

// 2. 自動保存を管理するフック
export function useScheduleSave(user: User, bandId: number, dateList: DateListItem[], hours: number[], scheduleMatrix: ScheduleMatrix, onSaved?: (schedule: Schedule) => void) {
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    setCheckedStates({});
  }, [bandId]);

  const saveSchedule = useCallback(async (currentStates: Record<string, boolean>) => {
    setStatus("saving");

    const newSchedule: Record<string, (0 | 1)[]> = {};
    dateList.forEach(({ key }) => {
      const hoursArray = new Array(24).fill(0);
      hours.forEach((hour) => {
        const cellId = `${key}-${hour}`;
        const isChecked = currentStates[cellId] ?? scheduleMatrix[key]?.[hour]?.isAvailable ?? false;
        if (isChecked) hoursArray[hour] = 1;
      });
      newSchedule[key] = hoursArray;
    });

    const result = await updateSchedule(user.id, newSchedule, bandId, "");

    if (result) {
      onSaved?.(result);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
    }
  }, [user.id, bandId, dateList, hours, scheduleMatrix, onSaved]);

  const saveRef = useRef(saveSchedule);
  useEffect(() => {
    saveRef.current = saveSchedule;
  }, [saveSchedule]);

  useEffect(() => {
    if (Object.keys(checkedStates).length === 0) return;

    setStatus("saving");
    const timer = setTimeout(() => saveRef.current(checkedStates), 1000);
    return () => clearTimeout(timer);
  }, [checkedStates]);

  return { checkedStates, setCheckedStates, status };
}

// 3. ツールチップフック
export function useTableTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    if (!tooltip) return;
    const hideTooltip = (e: Event) => {
      if (e.type === "scroll") { setTooltip(null); return; }
      const target = e.target as HTMLElement;
      if (target && (target.closest("td") || target.closest("#table-tooltip"))) return;
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
    if (e.type === "touchstart") isTouch.current = true;
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

// 4. 本日の日付にスクロールするフック
export function useTableScroll(dateList: DateListItem[], scrollContainerRef: RefObject<HTMLDivElement | null>, selectedBandId: number) {
  const prevBandId = useRef(selectedBandId);
  const hasScrolledInitially = useRef(false);

  useEffect(() => {
    const bandChanged = prevBandId.current !== selectedBandId;
    prevBandId.current = selectedBandId;

    if (dateList.length === 0) return;
    if (!bandChanged && hasScrolledInitially.current) return;

    // バンド切替時は少し遅延させてDOMの更新を待つ
    const delay = bandChanged ? 30 : 0;
    const behavior = bandChanged ? "auto" : "smooth";
    const timer = setTimeout(() => {
      const today = new Date();
      const todayKey = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
      const todayTh = document.getElementById(`date-th-${todayKey}`);
      const container = scrollContainerRef.current;
      if (todayTh && container) {
        const stickyWidth = 40;
        const scrollPosition = container.scrollLeft + (todayTh.getBoundingClientRect().left - container.getBoundingClientRect().left);
        container.scrollTo({ left: scrollPosition - stickyWidth, behavior: behavior });
      }
      hasScrolledInitially.current = true;
    }, delay);

    return () => clearTimeout(timer);
  }, [dateList, scrollContainerRef, selectedBandId]);
}