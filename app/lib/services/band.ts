import { createAdminClient } from '@/app/lib/supabase'
import { Database } from '@/database.types'

type Band = Database['public']['Tables']['bands']['Row']
type User = Database['public']['Tables']['users']['Row']


export async function fetchBand(query: { id?: number; token?: string }): Promise<Band | null> {
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

    console.log(bandsData)
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
