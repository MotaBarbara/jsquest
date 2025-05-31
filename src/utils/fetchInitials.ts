import { supabase } from "../lib/supabaseClient";

export async function FetchInitials(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      return null;
    }

    const { data: userInfoData, error: userInfoError } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", data.user.id)
      .single();

    if (userInfoError || !userInfoData) {
      return null;
    }

    const firstInitial = userInfoData.first_name?.[0] ?? "";
    const lastInitial = userInfoData.last_name?.[0] ?? "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  } catch (err) {
    console.error('Error fetching initials:', err);
    return null;
  }
} 