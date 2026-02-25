"use server";

import { createAdminClient } from '@/app/lib/supabase'
import { Database } from '@/database.types'

type User = Database['public']['Tables']['users']["Row"]


export const userService = {

  async add(
    email: string,
    name: string
  ): Promise<number | null> {

    try {
      const supabase = createAdminClient()

      const { data: userData, error } = await supabase
        .from("users")
        .insert({
          email: email,
          name: name
        })
        .select("id")
        .single()

      if ( error ) throw error;

      return userData.id;

    } catch (error) {
      console.error("データベースエラー(add):", error);
      return null;
    }
  },


  async update(
    user_id: number,
    email: string,
    name: string
  ): Promise<boolean> {

    try {
      const supabase = createAdminClient()

      const { error, data } = await supabase.from("users")
        .update({
          email: email,
          name: name
        })
        .eq("id", user_id)
        .select("id")
        .single()

      if ( error ) throw error;

      return !!data

    } catch (error) {
      console.error("データベースエラー(update):", error)
      return false
    }
  },


  async delete(user_id: number): Promise<boolean> {
    try {
      const supabase = createAdminClient()

      const { error, count } = await supabase.from("users")
        .delete({ count: 'exact' })
        .eq("id", user_id)

      if ( error ) throw error;

      return count !== null && count > 0;

    } catch (error) {
      console.error("データベースエラー(delete):", error);
      return false;
    }
  },


  async fetchUser(
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
}