"use server";

import { createAdminClient } from '@/app/lib/supabase'


export async function addUser(
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
}


export async function updateUser(
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
}


export async function deleteUser(user_id: number): Promise<boolean> {
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
}