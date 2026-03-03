"use client";

import { Band, User, Schedule, FixedSchedule } from "@/app/lib/types";

import { SelectMenu } from "@/app/ui/schedule-manage/selectMenu";
import { ActionButtons } from "@/app/ui/schedule-manage/actionButtons";
import { GuideInfo } from "@/app/ui/schedule-manage/guideInfo";
import { Table } from "@/app/ui/schedule-manage/table/index";
import { CommentBox } from "@/app/ui/schedule-manage/commentBox";

import { useState, useMemo, useCallback } from "react";


export function ScheduleManageContent({ user, bands, schedules, fixedSchedules }: {
  user: User, bands: Band[], schedules: Schedule[], fixedSchedules: FixedSchedule[]
}) {
  const [selectedBandId, setSelectedBandId] = useState(0)
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(schedules)

  const bandNameMap: Record<number, string> = Object.fromEntries(bands.map(b => [b.id, b.name || ""]));
  bandNameMap[0] = "デフォルト"

  const band = bands.find((b) => b.id === selectedBandId) || {}

  const bandMap = useMemo(() => {
    return bands.reduce((acc, b) => {
      acc[b.id] = b.name || "不明";
      return acc;
    }, {} as Record<number, string>);
  }, [bands]);

  const onScheduleUpdate = useCallback((savedSchedule: Schedule) => {
    setLocalSchedules(prev => {
      const idx = prev.findIndex(
        s => Number(s.user_id) === Number(savedSchedule.user_id) && Number(s.band_id) === Number(savedSchedule.band_id)
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedSchedule;
        return next;
      }
      return [...prev, savedSchedule];
    });
  }, []);

  return (
    <>
      <SelectMenu selectedBandId={selectedBandId} setSelectedBandId={setSelectedBandId} bandNameMap={bandNameMap} />
      <ActionButtons user={user} selectedBandId={selectedBandId} bandNameMap={bandNameMap} schedules={localSchedules} fixedSchedules={fixedSchedules} onScheduleUpdate={onScheduleUpdate} />
      <GuideInfo selectedBandId={selectedBandId} />
      <Table user={user} selectedBandId={selectedBandId} band={band} bands={bands} schedules={localSchedules} bandMap={bandMap} onScheduleUpdate={onScheduleUpdate} />
      <CommentBox user={user} selectedBandId={selectedBandId} schedules={localSchedules} onScheduleUpdate={onScheduleUpdate} />
    </>
  )
}