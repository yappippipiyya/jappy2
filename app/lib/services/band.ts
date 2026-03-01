import { createAdminClient } from '@/app/lib/supabase'
import { Band, User } from "@/app/lib/types"


export async function fetchBand(id: number | null = null, token: string | null = null): Promise<Band | null> {
  try {
    const supabase = createAdminClient()

    let request = supabase.from("bands").select("*");

    if (id) {
      request = request.eq("id", id);
    } else if (token) {
      request = request.eq("token", token);
    } else {
      return null;
    }

    const { data, error } = await request.single();

    if (error) throw error;

    return data;

  } catch (error) {
    console.error("データベースエラー(getBand):", error);
    return null;
  }
}


export async function fetchBands(user_id: number): Promise<Band[]> {
  try {
    const supabase = createAdminClient()

    const { data: bandsData, error } = await supabase
      .from("bands")
      .select("*, band_user!inner(user_id)")
      .eq("band_user.user_id", user_id)
      .order("archived", { ascending: true, nullsFirst: true })
      .order("end_date", { ascending: false, nullsFirst: false });

    if (error) throw error;

    return bandsData;

  } catch (error) {
    console.error("データベースエラー(getBands):", error);
    return [];
  }
}

export async function fetchBandUsers(band_id: number): Promise<User[]> {
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
