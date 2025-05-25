import { supabase } from "../lib/supabaseClient";

export async function FetchAvatar() {
  const { data: currentUser } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", currentUser?.user?.id)
    .single();

  return data?.avatar_url ?? null;
}
