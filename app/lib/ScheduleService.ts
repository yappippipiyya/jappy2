"use server";

import { createAdminClient } from '@/app/lib/supabase'
import { Database } from '@/database.types'

type Schedule = Database['public']['Tables']['schedules']['Row']
type FixedSchedule = Database['public']['Tables']['fixed_schedules']['Row']


export const scheduleService = {

  async fetchSchedules(
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
  },


  async updateSchedule(
    user_id: number,
    schedule: Record<string, (0 | 1)[]>,
    band_id: number,
    comment: string
  ): Promise<Schedule | null> {
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
  },


  async deleteSchedules(user_id: number): Promise<boolean> {
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
  },
}


export const fixedScheduleService = {

  async fetchFixedSchedules(user_id: number): Promise<FixedSchedule[]> {
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
  },


  async updateFixedSchedule(
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
  },
}