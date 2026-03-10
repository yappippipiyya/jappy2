"use server";

import { auth } from '@/auth';

import { createAdminClient } from '@/app/lib/supabase'
import { fetchUser } from '@/app/lib/services/user';


export async function createAccount(name: string): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email || "";

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

    if (error) throw error;

    return true

  } catch (error) {
    console.error("データベースエラー(add):", error);
    return false;
  }
}


export async function updateAccount(name: string): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email || "";
  const user = await fetchUser(null, email);

  if (!user) return false;

  try {
    const supabase = createAdminClient()

    const { error, data } = await supabase.from("users")
      .update({
        name: name
      })
      .eq("id", user.id)
      .select("id")
      .single()

    if (error) throw error;

    return true

  } catch (error) {
    console.error("データベースエラー(update):", error)
    return false
  }
}


export async function deleteAccount(): Promise<boolean> {
  const session = await auth();
  const email = session?.user?.email || "";
  const user = await fetchUser(null, email);

  if (!user) return false;

  try {
    const supabase = createAdminClient()

    const { error, count } = await supabase.from("users")
      .delete({ count: 'exact' })
      .eq("id", user.id)

    if (error) throw error;

    return count !== null && count > 0;

  } catch (error) {
    console.error("データベースエラー(delete):", error);
    return false;
  }
}