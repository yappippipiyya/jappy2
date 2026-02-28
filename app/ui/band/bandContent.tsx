// @/app/ui/band/BandContent.tsx
"use client";

import { useState } from "react";
import { ModeSwitch } from "./modeSwitch";
import { Table } from "./table";
import { Band, Schedule } from "@/app/lib/types"


export function BandContent({ band, schedules }: { band: Band, schedules: Schedule[] }) {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <>
      <ModeSwitch mode={mode} setMode={setMode} />
      <Table mode={mode} band={band} schedules={schedules} />
    </>
  );
}