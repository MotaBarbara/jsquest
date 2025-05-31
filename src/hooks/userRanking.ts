import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { UserRankingProps } from "../types/props";

export default function useRaking(page: number) {
  const [ranking, setRanking] = useState<UserRankingProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    async function fetchRankings() {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        return;
      }
      setCurrentUserId(currentUser.user.id);

      const { data: allUsers, error } = await supabase
        .from("profiles")
        .select("*");

      if (error || !allUsers) {
        console.error("Failed to fetch users", error);
        return;
      }

      const allRankings = await Promise.all(
        allUsers.map(async user => {
          const initials = (
            (user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")
          ).toUpperCase();

          const { data: fetchLevels } = await supabase
            .from("user_exercises")
            .select("exercise_order")
            .eq("user_id", user.id)
            .eq("is_correct", true);

          const totalScore = fetchLevels
            ? fetchLevels
                .map(item => Number(item.exercise_order))
                .filter(n => !isNaN(n))
                .reduce((acc, cur) => acc + cur, 0)
            : 0;

          const { data: levels } = await supabase
            .from("user_exercises")
            .select("level")
            .eq("user_id", user.id)
            .not("level", "is", null)
            .order("level", { ascending: false });

          const highestLevel = levels?.[0]?.level ?? null;

          return {
            id: user.id,
            first_name: user.first_name,
            initials,
            highestLevel,
            score: totalScore ?? 0,
          };
        }),
      );
      const sortedRankings = allRankings.sort((a, b) => b.score - a.score);
      setTotalPages(Math.ceil(sortedRankings.length / 10));

      const paginatedRankings = sortedRankings.slice(
        (page - 1) * 10,
        page * 10,
      );
      setRanking(paginatedRankings);
    }
    fetchRankings();
  }, [page]);
  return { ranking, totalPages, currentUserId };
}
