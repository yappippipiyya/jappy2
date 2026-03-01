"use server";

import { auth } from '@/auth';
import { createAdminClient } from '@/app/lib/supabase'
import { Schedule, FixedSchedule } from "@/app/lib/types"
import { fetchUser } from '@/app/lib/services/user';
import { fetchBands } from '../services/band';

export async function updateSchedule(
  user_id: number,
  schedule: Record<string, (0 | 1)[]>,
  band_id: number,
  comment: string
): Promise<Schedule | null> {

  const session = await auth()
  const email = session?.user?.email || ""
  const user = await fetchUser(null, email)

  if (!user) return null;

  const isOwnSchedule = user.id === user_id;
  const isBandPractice = user_id === 0;

  if (!isOwnSchedule && !isBandPractice) {
    return null;
  }

  if (isBandPractice) {
    const bands = await fetchBands(user.id)
    const isMember = bands.some(b => b.id === band_id)

    if (!isMember) return null
  }

  try {
    const supabase = createAdminClient()

    const { data: scheduleData, error } = await supabase
      .from("schedules")
      .upsert({
        user_id: user_id,
        band_id: band_id,
        schedule: schedule,
        comment: comment,
      },
      { onConflict: "user_id,band_id" }
      ).select()
      .maybeSingle()

    if ( error ) throw (error)

    return scheduleData

  } catch (error) {
    console.error("データベースエラー(updateSchedule):", error)
    return null
  }
}


export async function deleteSchedules(user_id: number): Promise<boolean> {
  try {
    const supabase = createAdminClient()

    const { error, count } = await supabase.from("schedules")
      .delete({ count: 'exact' })
      .eq("user_id", user_id)

    return count !== null && count > 0;

  } catch (error) {
    console.error("データベースエラー(deleteSchedules):", error)
    return false
  }
}


export async function updateFixedSchedule(
  user_id: number,
  fixed_schedule: Record<string, (0 | 1)[]>,
): Promise<FixedSchedule | null> {
  try {
    const supabase = createAdminClient()

    const { data: fixedScheduleData, error } = await supabase
      .from("fixed_schedules")
      .upsert({
        user_id: user_id,
        schedule: fixed_schedule,
      },
      { onConflict: "user_id" }
      ).select()
      .single()

    if (error || !fixedScheduleData) throw (error)

    return fixedScheduleData

  } catch (error) {
    console.error("データベースエラー(updateFixedSchedule):", error)
    return null
  }
}