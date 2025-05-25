import { supabase } from "./supabaseClient";

const ITEMS_PER_PAGE = 10;

export async function Pagination(page: number) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .range(from, to);

  if (error) throw error;

  const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

  return { data, totalPages };
}
