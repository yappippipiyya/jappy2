import { Database } from '@/database.types'

export type Band = Database['public']['Tables']['bands']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Schedule = Database['public']['Tables']['schedules']['Row']
export type FixedSchedule = Database['public']['Tables']['fixed_schedules']['Row']