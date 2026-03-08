"use client";

import { useState } from "react";
import { toast } from "sonner";

import { User, Schedule, FixedSchedule } from "@/app/lib/types";
import { updateSchedule } from "@/app/lib/actions/schedule";
import { useAlert } from "@/app/ui/CustomAlert"


export function ActionButtons({ user, selectedBandId, bandNameMap, schedules, fixedSchedules, onScheduleUpdate }: {
  user: User, selectedBandId: number, bandNameMap: Record<number, string>, schedules: Schedule[], fixedSchedules: FixedSchedule[], onScheduleUpdate: (s: Schedule) => void
}) {
  const isDefault = selectedBandId === 0
  const [applying, setApplying] = useState(false)
  const [removingOther, setRemovingOther] = useState(false)

  const [showFixedUI, setShowFixedUI] = useState(false)
  const [fixedStartDate, setFixedStartDate] = useState("")
  const [fixedEndDate, setFixedEndDate] = useState("")
  const [applyingFixed, setApplyingFixed] = useState(false)

  const { fire } = useAlert();

  // --- デフォルトを適用 ---
  const handleApplyDefault = async () => {
    if (isDefault || applying) return;

    const defaultSchedule = schedules.find(
      (s) => Number(s.user_id) === user.id && (!s.band_id || Number(s.band_id) === 0)
    );

    if (!defaultSchedule || !defaultSchedule.schedule) {
      toast.error("デフォルトスケジュールが見つかりません");
      return;
    }

    const result = await fire({
      title: `デフォルトのスケジュールを「${bandNameMap[selectedBandId]}」に適用しますか？現在の設定は上書きされます。`,
      confirmText: "適用する",
      cancelText: "キャンセル",
    });

    if (!result.isConfirmed) return;

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
        toast.success("デフォルトを適用しました。")
      } else {
        toast.error("適用に失敗しました。")
      }
    } catch {
      toast.error("適用に失敗しました。")
    } finally {
      setApplying(false);
    }
  };

  // --- 他のバンド練のチェックを外す  ---
  const handleRemoveOtherBandPractice = async () => {
    if (isDefault || removingOther) return;

    const currentBandSchedule = schedules.find(
      (s) => Number(s.user_id) === user.id && Number(s.band_id) === selectedBandId
    );

    const defaultSchedule = schedules.find(
      (s) => Number(s.user_id) === user.id && (!s.band_id || Number(s.band_id) === 0)
    );

    const baseScheduleData = (currentBandSchedule?.schedule || defaultSchedule?.schedule) as Record<string, number[]> | undefined;

    if (!baseScheduleData) {
      toast.info("スケジュールデータが見つかりません");
      return;
    }

    const otherBandPractices = schedules.filter(
      (s) => Number(s.user_id) === 0 && Number(s.band_id) > 0 && Number(s.band_id) !== selectedBandId
    );

    if (otherBandPractices.length === 0) {
      toast.info("他のバンド練の予定はありません");
      return;
    }

    const otherPracticeSlots: Record<string, Set<number>> = {};
    otherBandPractices.forEach((practice) => {
      const sData = practice.schedule as Record<string, number[]>;
      Object.entries(sData).forEach(([dateKey, flags]) => {
        if (!otherPracticeSlots[dateKey]) otherPracticeSlots[dateKey] = new Set();
        flags.forEach((flag, hour) => {
          if (flag === 1) otherPracticeSlots[dateKey].add(hour);
        });
      });
    });

    const result = await fire({
      title: `「${bandNameMap[selectedBandId]}」のスケジュールから、他のバンド練が入っている時間帯のチェックを外しますか？`,
      confirmText: "外す",
      cancelText: "キャンセル",
    });

    if (!result.isConfirmed) return;

    setRemovingOther(true);
    try {
      const newSchedule: Record<string, (0 | 1)[]> = {};
      Object.entries(baseScheduleData).forEach(([dateKey, flags]) => {
        newSchedule[dateKey] = flags.map((flag, hour) => {
          if (otherPracticeSlots[dateKey]?.has(hour)) return 0;
          return (flag === 1 ? 1 : 0) as 0 | 1;
        }) as (0 | 1)[];
      });

      const result = await updateSchedule(user.id, newSchedule, selectedBandId, "");
      if (result) {
        onScheduleUpdate(result);
      } else {
        toast.error("更新に失敗しました");
      }
    } catch {
      toast.error("更新中にエラーが発生しました");
    } finally {
      setRemovingOther(false);
    }
  };

  // --- 固定スケジュールを適用  ---
  const handleApplyFixedSchedule = async () => {
    if (!isDefault || applyingFixed) return;

    if (!fixedStartDate || !fixedEndDate) {
      toast.info("開始日と終了日を選択してください");
      return;
    }
    if (fixedStartDate > fixedEndDate) {
      toast.info("開始日は終了日より前に設定してください");
      return;
    }

    const fixedSchedule = fixedSchedules[0];
    if (!fixedSchedule || !fixedSchedule.schedule) {
      toast.warning("固定スケジュールが登録されていません");
      return;
    }

    const fixedData = fixedSchedule.schedule as Record<string, number[]>;

    const defaultSchedule = schedules.find(
      (s) => Number(s.user_id) === user.id && (!s.band_id || Number(s.band_id) === 0)
    );
    const currentData = (defaultSchedule?.schedule || {}) as Record<string, number[]>;

    const confirmed = confirm(
      `固定スケジュールを ${fixedStartDate} 〜 ${fixedEndDate} のデフォルトスケジュールに適用しますか？\n対象期間のスケジュールは上書きされます。`
    );
    if (!confirmed) return;

    setApplyingFixed(true);
    try {
      const newSchedule: Record<string, (0 | 1)[]> = { ...currentData } as Record<string, (0 | 1)[]>;

      const current = new Date(fixedStartDate);
      const end = new Date(fixedEndDate);
      while (current <= end) {
        const y = current.getFullYear();
        const m = (current.getMonth() + 1).toString().padStart(2, "0");
        const d = current.getDate().toString().padStart(2, "0");
        const dateKey = `${y}-${m}-${d}`;
        const dayOfWeek = current.getDay().toString();

        if (fixedData[dayOfWeek]) {
          newSchedule[dateKey] = fixedData[dayOfWeek].map(v => (v === 1 ? 1 : 0)) as (0 | 1)[];
        }

        current.setDate(current.getDate() + 1);
      }

      const result = await updateSchedule(user.id, newSchedule, 0, "");
      if (result) {
        onScheduleUpdate(result);
        setShowFixedUI(false);
        setFixedStartDate("");
        setFixedEndDate("");
      } else {
        toast.error("適用に失敗しました");
      }
    } catch {
      toast.error("適用中にエラーが発生しました");
    } finally {
      setApplyingFixed(false);
    }
  };

  const btnBase = "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all";
  const btnDisabled = "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed";

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mx-5">
        {/* デフォルトを適用 - バンド選択時のみ */}
        {!isDefault && (
          <button
            onClick={handleApplyDefault}
            disabled={applying}
            className={`${btnBase} ${applying
              ? btnDisabled
              : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-sky-400 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 hover:shadow-sm cursor-pointer"
              }`}
          >
            <span className="material-icons text-[18px]">auto_fix_high</span>
            {applying ? "適用中..." : "デフォルトを適用"}
          </button>
        )}

        {/* 他のバンド練のチェックを外す - バンド選択時のみ */}
        {!isDefault && (
          <button
            onClick={handleRemoveOtherBandPractice}
            disabled={removingOther}
            className={`${btnBase} ${removingOther
              ? btnDisabled
              : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-sm cursor-pointer"
              }`}
          >
            <span className="material-icons text-[18px]">event_busy</span>
            {removingOther ? "処理中..." : "他のバンド練のチェックを外す"}
          </button>
        )}

        {/* 固定スケジュールを適用 - デフォルト選択時のみ */}
        {isDefault && (
          <button
            onClick={() => setShowFixedUI(!showFixedUI)}
            className={`${btnBase} ${showFixedUI
              ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 shadow-sm cursor-pointer"
              : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm cursor-pointer"
              }`}
          >
            <span className="material-icons text-[18px]">event_repeat</span>
            固定スケジュールを適用
          </button>
        )}
      </div>

      {/* 固定スケジュール適用の期間選択UI */}
      {isDefault && showFixedUI && (
        <div className="mx-5 mt-3 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-4">
            適用する期間を選択してください
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">開始日</span>
              <input
                type="date"
                value={fixedStartDate}
                onChange={(e) => setFixedStartDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">終了日</span>
              <input
                type="date"
                value={fixedEndDate}
                onChange={(e) => setFixedEndDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
              />
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleApplyFixedSchedule}
                disabled={applyingFixed || !fixedStartDate || !fixedEndDate}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${applyingFixed || !fixedStartDate || !fixedEndDate
                  ? btnDisabled
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow cursor-pointer"
                  }`}
              >
                <span className="material-icons text-[16px]">check</span>
                {applyingFixed ? "適用中..." : "適用"}
              </button>
              <button
                onClick={() => { setShowFixedUI(false); setFixedStartDate(""); setFixedEndDate(""); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                <span className="material-icons text-[16px]">close</span>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}