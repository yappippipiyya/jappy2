import { createAdminClient } from '@/app/lib/supabase'
import { User } from "@/app/lib/types"


export async function fetchUser(
  user_id: number | null,
  email: string | null
): Promise<User | null> {
  try {
    const supabase = createAdminClient()

    let query = supabase.from("users").select("*")

    if (user_id) {
      query = query.eq("id", user_id)
    } else if (email) {
      query = query.eq("email", email)
    } else {
      return null
    }

    const { data: userData, error } = await query.maybeSingle()

    if ( error ) throw error;

    return userData;

  } catch (error) {
    console.error("データベースエラー(get_user):", error)
    return null
  }
}