import { createAdminClient } from '@/app/lib/supabase'
import { Schedule, FixedSchedule } from "@/app/lib/types"


export async function fetchSchedules(
  user_id: number | null = null,
  band_id: number | null = null
): Promise<Schedule[]> {
  try {
    const supabase = createAdminClient()

    let query = supabase.from("schedules").select("*")

    if (user_id) {
      query = query.eq("user_id", user_id)
    } else if (band_id) {
      query = query.eq("band_id", band_id)
    } else {
      return []
    }

    const { data: scheduleData, error } = await query

    if ( error ) throw error

    return scheduleData;

  } catch (error) {
    console.error("データベースエラー(getSchedules):", error)
    return []
  }
}


export async function fetchFixedSchedules(user_id: number): Promise<FixedSchedule[]> {
  try {
    const supabase = createAdminClient()

    const { data: fixedScheduleData, error } = await supabase
      .from("fixed_schedules")
      .select("*")
      .eq("user_id", user_id)

    if (error || !fixedScheduleData ) throw error

    return fixedScheduleData;

  } catch (error) {
    console.error("データベースエラー(getFixedSchedules):", error)
    return []
  }
}