"use client";

import { useState } from "react";
import { ModeSwitch } from "./modeSwitch";
import { Table } from "./table/index";
import { PracticeList } from "./practiceList";
import { MemberComments } from "./memberComments";
import { Band, Schedule, User } from "@/app/lib/types"


export function BandContent({ band, schedules, bandUsers }: { band: Band, schedules: Schedule[], bandUsers: User[] }) {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <div>
      <ModeSwitch mode={mode} setMode={setMode} />
      <Table mode={mode} band={band} schedules={schedules} bandUsers={bandUsers} />
      <PracticeList band={band} schedules={schedules} />
      <MemberComments band={band} schedules={schedules} bandUsers={bandUsers} />
    </div>
  );
}