"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Schedule, User } from "@/app/lib/types";
import { updateSchedule } from "@/app/lib/actions/schedule";

export function CommentBox({ user, selectedBandId, schedules, onScheduleUpdate }: {
  user: User, selectedBandId: number, schedules: Schedule[], onScheduleUpdate: (s: Schedule) => void
}) {
  const isDefault = selectedBandId === 0;
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const schedule = schedules.find(
      (s) => Number(s.user_id) === user.id && Number(s.band_id) === selectedBandId
    );
    setComment(schedule?.comment || "");
    initializedRef.current = true;
  }, [selectedBandId, schedules, user.id]);

  const saveComment = useCallback(async (newComment: string) => {
    const schedule = schedules.find(
      (s) => Number(s.user_id) === user.id && Number(s.band_id) === selectedBandId
    );
    if (!schedule?.schedule) return;

    setSaving(true);
    try {
      const result = await updateSchedule(
        user.id,
        schedule.schedule as Record<string, (0 | 1)[]>,
        selectedBandId,
        newComment
      );
      if (result) {
        onScheduleUpdate(result);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  }, [user.id, selectedBandId, schedules, onScheduleUpdate]);

  const handleChange = (value: string) => {
    setComment(value);
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => saveComment(value), 1500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (isDefault) return null;

  return (
    <div className="mx-5 mb-5">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <span className="material-icons text-[18px]">edit_note</span>
            備考・コメント
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500 h-4">
            {saving && <span className="text-blue-500 animate-pulse">● 保存中...</span>}
            {saved && <span className="text-green-500">✓ 保存済み</span>}
          </div>
        </div>
        <textarea
          value={comment}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="バンドメンバーへのメモ等を入力..."
          rows={3}
          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-colors"
        />
      </div>
    </div>
  );
}
