"use client";

import { Band, Schedule } from "@/app/lib/types";

import { SelectMenu } from "@/app/ui/schedule-manage/selectMenu";

import { useState } from "react";


export function ScheduleManageContent({ bands, schedules }: {
  bands: Band[], schedules: Schedule[]
}) {
  const [selectedBandId, setSelectedBandId] = useState(0)

  const bandNameMap: Record<number, string> = Object.fromEntries(bands.map(b => [b.id, b.name || ""]));
  bandNameMap[0] = "デフォルト"

  return (
    <>
        <SelectMenu selectedBandId={selectedBandId} setSelectedBandId={setSelectedBandId} bandNameMap={bandNameMap}/>
        {/* <ActionButtons />
        <Table /> */}
    </>
  )
}