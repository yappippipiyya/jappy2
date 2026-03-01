"use client";

import { useState } from "react";
import { ModeSwitch } from "./modeSwitch";
import { Table } from "./table";
import { Band, Schedule, User } from "@/app/lib/types"


export function BandContent({ band, schedules, bandUsers }: { band: Band, schedules: Schedule[], bandUsers: User[] }) {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <>
      <ModeSwitch mode={mode} setMode={setMode} />
      <Table mode={mode} band={band} schedules={schedules} bandUsers={bandUsers} />
    </>
  );
}