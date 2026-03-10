import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { User, FixedSchedule } from "@/app/lib/types";
import { updateFixedSchedule } from "@/app/lib/actions/schedule";
import { SaveStatus } from "@/app/ui/table/types";
import { FixedScheduleMatrix, DayOfWeekItem } from "./types";


// 1. スケジュールデータをマトリクスに変換するフック
export function useFixedScheduleMatrix(fixedSchedule: FixedSchedule | null) {
  return useMemo(() => {
    const dList: DayOfWeekItem[] = [
      { key: "0", label: "日" },
      { key: "1", label: "月" },
      { key: "2", label: "火" },
      { key: "3", label: "水" },
      { key: "4", label: "木" },
      { key: "5", label: "金" },
      { key: "6", label: "土" },
    ];

    const hoursArray = Array.from({ length: 24 }, (_, i) => i);

    const matrix: FixedScheduleMatrix = {};
    dList.forEach(({ key }) => {
      matrix[key] = {};
      hoursArray.forEach((hour) => {
        matrix[key][hour] = { isAvailable: false };
      });
    });

    if (fixedSchedule && fixedSchedule.schedule) {
      const sData = fixedSchedule.schedule as Record<string, number[]>;
      Object.entries(sData).forEach(([dayKey, flags]) => {
        if (matrix[dayKey] && Array.isArray(flags)) {
          hoursArray.forEach((hour) => {
            if (flags[hour] === 1) {
              matrix[dayKey][hour].isAvailable = true;
            }
          });
        }
      });
    }

    return { dayList: dList, hours: hoursArray, scheduleMatrix: matrix };
  }, [fixedSchedule]);
}

// 2. 自動保存を管理するフック
export function useFixedScheduleSave(user: User, dayList: DayOfWeekItem[], hours: number[], scheduleMatrix: FixedScheduleMatrix, onSaved?: (schedule: FixedSchedule) => void) {
  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SaveStatus>("idle");

  const saveSchedule = useCallback(async (currentStates: Record<string, boolean>) => {
    setStatus("saving");

    const newSchedule: Record<string, (0 | 1)[]> = {};
    dayList.forEach(({ key }) => {
      const hoursArray = new Array(24).fill(0);
      hours.forEach((hour) => {
        const cellId = `${key}-${hour}`;
        const isChecked = currentStates[cellId] ?? scheduleMatrix[key]?.[hour]?.isAvailable ?? false;
        if (isChecked) hoursArray[hour] = 1;
      });
      newSchedule[key] = hoursArray;
    });

    const result = await updateFixedSchedule(newSchedule);

    if (result) {
      onSaved?.(result);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
    }
  }, [user.id, dayList, hours, scheduleMatrix, onSaved]);

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
