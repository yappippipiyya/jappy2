"use server";

import { nanoid } from 'nanoid';
import { createAdminClient } from '@/app/lib/supabase'
import { Database } from '@/database.types'

type Band = Database['public']['Tables']['bands']['Row']
type User = Database['public']['Tables']['users']['Row']


const generateToken = () => nanoid(16);


export const bandService = {
  async create(
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
  },


  async updateBand(
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
  },


  async updateArchiveStatus(band_id: number, archived: boolean): Promise<boolean> {
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
  },


  async addMember(user_id: number, band_id: number): Promise<boolean | null> {
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
  },


  async removeMember(user_id: number, band_id: number): Promise<boolean> {
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
  },

  async deleteBand(band_id: number): Promise<boolean> {
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
  },


  async getBand(query: { id?: number; token?: string }): Promise<Band | null> {
    try {
      const supabase = createAdminClient()

      let request = supabase.from("bands").select("*");

      if (query.id) request = request.eq("id", query.id);
      else if (query.token) request = request.eq("token", query.token);
      else return null;

      const { data, error } = await request.single();
      if (error) throw error;
      return data as Band;
    } catch (error) {
      console.error("データベースエラー(getBand):", error);
      return null;
    }
  },


  async getBands(user_id: number): Promise<Band[]> {
    try {
      const supabase = createAdminClient()

      const { data: bandsData, error } = await supabase
        .from("bands")
        .select("*, band_user!inner(user_id)")
        .eq("band_user.user_id", user_id)
        .order("archived", { ascending: true })
        .order("end_date", { ascending: false });

      if (error) throw error;

      return bandsData;

    } catch (error) {
      console.error("データベースエラー(getBands):", error);
      return [];
    }
  },

  async getUsers(band_id: number): Promise<User[]> {
    try {
      const supabase = createAdminClient()

      const { data: userData, error } = await supabase
        .from("users")
        .select("*, band_user!inner(band_id)")
        .eq("band_user.band_id", band_id)

      if ( error || !userData ) throw error;

      return userData;
    } catch (error) {
      console.error("データベースエラー(getUsers):", error)
      return []
    }
  }
};