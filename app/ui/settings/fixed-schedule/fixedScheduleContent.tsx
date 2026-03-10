"use client";

import { User, FixedSchedule } from "@/app/lib/types";
import { Table } from "@/app/ui/settings/fixed-schedule/table/index";
import { useState, useCallback } from "react";

export function FixedScheduleContent({ user, fixedSchedule }: {
  user: User, fixedSchedule: FixedSchedule | null
}) {
  const [localFixedSchedule, setLocalFixedSchedule] = useState<FixedSchedule | null>(fixedSchedule);

  const onFixedScheduleUpdate = useCallback((savedSchedule: FixedSchedule) => {
    setLocalFixedSchedule(savedSchedule);
  }, []);

  return (
    <>
      <Table
        user={user}
        fixedSchedule={localFixedSchedule}
        onScheduleUpdate={onFixedScheduleUpdate}
      />
    </>
  )
}
