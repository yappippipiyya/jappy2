import { NextResponse } from 'next/server';
import { ICalAlarmType, ICalCalendar, ICalCalendarMethod } from 'ical-generator';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { fetchUser } from '@/app/lib/services/user';
import { fetchBands } from '@/app/lib/services/band';
import { fetchSchedules } from '@/app/lib/services/schedule';

import { getRefinedSchedules } from "@/app/ui/all-schedules/hooks";


export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth()
  const email = session?.user?.email || ""

  const user = await fetchUser(null, email)
  if (!user) return redirect("/signup");

  const bands = await fetchBands(user.id);
  const rawSchedules = await fetchSchedules(0, null, bands.map(b => b.id));

  const refinedSchedules = getRefinedSchedules(bands, rawSchedules, false);

  const calendar = new ICalCalendar();

  calendar.method(ICalCalendarMethod.PUBLISH)
  calendar.name('全バンドの練習日程');
  calendar.prodId('-//Jappy//Band Practice Calendar//JP')
  calendar.timezone('Asia/Tokyo');

  const counts: Record<number, string> = {};

  refinedSchedules.forEach(item => {
    const currentCount = counts[item.bandId] ?? 0;
    counts[item.bandId] = currentCount + 1;

    const event = calendar.createEvent({
      start: item.startDateTime,
      end: item.endDateTime,
      summary: item.bandName,
      id: `jappy-band-${item.bandId}-${currentCount}@jappy.local`,
      sequence: Math.floor(Date.now() / 1000),
    });

    const triggerDate = new Date(item.startDateTime);
    triggerDate.setHours(8, 0, 0, 0);

    event.createAlarm({
      type: ICalAlarmType.display,
      trigger: triggerDate,
      description: `今日は${item.bandName}のバンド練があります`
    })
  });

  return new NextResponse(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="all_band_practices.ics"',
    },
  });
}