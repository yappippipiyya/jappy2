"use client";

import { User, Schedule } from "@/app/lib/types";
import { updateSchedule } from "@/app/lib/actions/schedule";
import { useState } from "react";

export function ActionButtons({ user, selectedBandId, bandNameMap, schedules, onScheduleUpdate }: {
  user: User, selectedBandId: number, bandNameMap: Record<number, string>, schedules: Schedule[], onScheduleUpdate: (s: Schedule) => void
}) {
  const isDefault = selectedBandId === 0
  const [applying, setApplying] = useState(false)

  const handleApplyDefault = async () => {
    if (isDefault || applying) return;

    const defaultSchedule = schedules.find(
      (s) => Number(s.user_id) === user.id && (!s.band_id || Number(s.band_id) === 0)
    );

    if (!defaultSchedule || !defaultSchedule.schedule) {
      alert("デフォルトスケジュールが見つかりません");
      return;
    }

    const confirmed = confirm(
      `デフォルトのスケジュールを「${bandNameMap[selectedBandId]}」に適用しますか？\n現在の設定は上書きされます。`
    );
    if (!confirmed) return;

    setApplying(true);
    try {
      const result = await updateSchedule(
        user.id,
        defaultSchedule.schedule as Record<string, (0 | 1)[]>,
        selectedBandId,
        ""
      );
      if (result) {
        onScheduleUpdate(result);
      } else {
        alert("適用に失敗しました");
      }
    } catch {
      alert("適用中にエラーが発生しました");
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <div className="flex mx-5 gap-2">
        <button
          onClick={handleApplyDefault}
          disabled={isDefault || applying}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDefault || applying
            ? "bg-gray-200 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500 cursor-not-allowed"
            : "bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
            }`}
        >
          {applying ? "適用中..." : "デフォルトを適用"}
        </button>
        <button>
          <span className="material-icons">more_horiz</span>
        </button>
      </div>
    </>
  )
}