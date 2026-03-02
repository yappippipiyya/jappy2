import { createAdminClient } from '@/app/lib/supabase'
import { Schedule, FixedSchedule } from "@/app/lib/types"


export async function fetchSchedules(
  user_id: number | null = null,
  band_id: number | null = null,
  band_ids: number[] | null = null
): Promise<Schedule[]> {
  try {
    const supabase = createAdminClient()

    let query = supabase.from("schedules").select("*")

    const hasUser = user_id !== null && user_id !== undefined;
    const hasBand = band_id !== null && band_id !== undefined;
    const hasBands = band_ids !== null && band_ids !== undefined;


    if (!hasUser && !hasBand && !hasBands) return [];

    if (hasUser) query = query.eq("user_id", user_id);
    if (hasBand) query = query.eq("band_id", band_id);
    if (hasBands) query = query.in("band_id", band_ids);

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