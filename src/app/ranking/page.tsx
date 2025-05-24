"use client";
import RankingRow from "@/src/components/rankingRow";
import { supabase } from "@/src/lib/supabaseClient";
import { useEffect, useState } from "react";

type UserRanking = {
  id: string;
  first_name: string;
  initials: string | null;
  highestLevel: number | null;
  score: number;
};

export default function Ranking() {
  const [ranking, setRanking] = useState<UserRanking[]>([]);

  useEffect(() => {
    async function fetchRankings() {
      // Get all users id and first_name
      const { data: userInfoData, error: userInfoError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name");

      if (userInfoError || !userInfoData) {
        console.error("Error fetching users:", userInfoError);
        return;
      }
      const rankingData = await Promise.all(
        userInfoData.map(async user => {
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
          // .limit(1);

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
  }, []);

  return (
    <main className="flex flex-col gap-10 items-center">
      <h1>Ranking</h1>
      <div className="w-full">
        {[...ranking]
          .sort((a, b) => b.score - a.score)
          .map(({ id, initials, first_name, highestLevel, score }, index) => (
            <RankingRow
              key={id}
              position={index + 1}
              initials={initials}
              user={first_name}
              level={highestLevel !== null ? String(highestLevel) : null}
              score={score}
            />
          ))}
      </div>
    </main>
  );
}
