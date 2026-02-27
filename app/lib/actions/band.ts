"use server";

import { nanoid } from 'nanoid';
import { createAdminClient } from '@/app/lib/supabase'
import { Band } from "@/app/lib/types"


const generateToken = () => nanoid(16);


export async function createBand(
  name: string,
  start_date: string,
  end_date: string,
  start_time: string,
  end_time: string,
  creator_user_id: number
): Promise<{ id: number; token: string } | null> {
  const token = generateToken();

  try {
    const supabase = createAdminClient()

    const { data: bandData, error: bandError } = await supabase
      .from("bands")
      .insert({
        name,
        creator_user_id,
        token,
        start_date,
        end_date,
        start_time,
        end_time,
      })
      .select()
      .single();

    if (bandError || !bandData) throw bandError;

    const { error: memberError } = await supabase
      .from("band_user")
      .insert({
        user_id: creator_user_id,
        band_id: bandData.id,
      });

    if (memberError) {
      await supabase.from("bands").delete().eq("id", bandData.id);
      throw memberError;
    }

    return { id: bandData.id, token };
  } catch (error) {
    console.error("データベースエラー(create):", error);
    return null;
  }
}


export async function updateBand(
  band_id: number,
  updates: Partial<Pick<Band, "name" | "start_date" | "end_date" | "start_time" | "end_time">>
): Promise<boolean> {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("bands")
      .update(updates)
      .eq("id", band_id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("データベースエラー(updateBand):", error);
    return false;
  }
}


export async function updateBandArchiveStatus(band_id: number, archived: boolean): Promise<boolean> {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("bands")
      .update({ archived })
      .eq("id", band_id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("データベースエラー(updateArchiveStatus):", error);
    return false;
  }
}


export async function addBandMember(user_id: number, band_id: number): Promise<boolean | null> {
  try {
    const supabase = createAdminClient()

    const { error: memberError } = await supabase.from("band_user").insert({
      user_id: user_id,
      band_id: band_id
    });

    if (memberError) throw memberError;

    return true;
  } catch (error) {
    console.error("データベースエラー(addMember):", error);
    return null;
  }
}


export async function removeBandMember(user_id: number, band_id: number): Promise<boolean> {
  if (band_id === 0) return false;

  try {
    const supabase = createAdminClient()

    await supabase.from("band_user").delete().match({ user_id, band_id });
    await supabase.from("schedules").delete().match({ user_id, band_id });
    return true;
  } catch (error) {
    console.error("データベースエラー(removeMember):", error);
    return false;
  }
}

export async function deleteBand(band_id: number): Promise<boolean> {
  try {
    const supabase = createAdminClient()

    await supabase.from("schedules").delete().eq("band_id", band_id)
    await supabase.from("band_user").delete().eq("band_id", band_id)
    await supabase.from("bands").delete().eq("id", band_id)
    return true
  } catch (error) {
    console.error("データベースエラー(deleteBand):", error)
    return false
  }
}