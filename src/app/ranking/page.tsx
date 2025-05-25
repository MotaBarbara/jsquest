"use client";
import RankingRow from "@/src/components/rankingRow";
import { supabase } from "@/src/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Pagination } from "@/src/lib/pagination";
// import Pagination from "@/app/ui/invoices/pagination";

type UserRanking = {
  id: string;
  first_name: string;
  initials: string | null;
  highestLevel: number | null;
  score: number;
};

export default function Ranking() {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    async function fetchRankings() {
      // get current user
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        return;
      }
      setCurrentUserId(currentUser.user.id);

      // get pagination and all users id and first_name
      const { data: profiles, totalPages } = await Pagination(page);
      setTotalPages(totalPages);

      if (!profiles) {
        console.error("No data existing");
        return;
      }
      const rankingData = await Promise.all(
        profiles.map(async user => {
          // get initials
          const initials = (
            (user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "")
          ).toUpperCase();

          // get score
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

          // get level
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
      setRanking(rankingData);
    }
    fetchRankings();
  }, [page]);

  return (
    <main className="flex flex-col gap-10 items-center">
      <h1>Ranking</h1>
      <div className="w-full">
        {[...ranking]
          .sort((a, b) => b.score - a.score)
          .map(({ id, initials, first_name, highestLevel, score }, index) =>
            currentUserId === id ? (
              <RankingRow
                key={id}
                position={(page - 1) * 10 + index + 1}
                initials={initials}
                user={first_name}
                level={highestLevel !== null ? String(highestLevel) : null}
                score={score}
              />
            ) : (
              <RankingRow
                key={id}
                position={(page - 1) * 10 + index + 1}
                initials={initials}
                user={first_name}
                level={highestLevel !== null ? String(highestLevel) : null}
                score={score}
                currentUser={true}
              />
            ),
          )}
      </div>
      <div className="mt-5 flex gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </main>
  );
}
