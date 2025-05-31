"use client";
import RankingRow from "@/src/components/RankingRow";
import useRequireAuth from "@/src/hooks/useRequireAuth";
import { useState } from "react";
import { useAvatar } from "@/src/hooks/useAvatar";
import useRaking from "@/src/hooks/userRanking";

function RankingRowWithAvatar({
  id,
  initials,
  first_name,
  highestLevel,
  score,
  position,
  isCurrentUser,
}: {
  id: string;
  initials: string | null;
  first_name: string;
  highestLevel: number | null;
  score: number;
  position: number;
  isCurrentUser: boolean;
}) {
  const { avatarUrl } = useAvatar(id);

  return (
    <RankingRow
      key={id}
      position={position}
      initials={initials}
      user={first_name}
      level={highestLevel !== null ? String(highestLevel) : null}
      score={score}
      currentUser={isCurrentUser}
      avatar={avatarUrl}
    />
  );
}

export default function Ranking() {
  const [page, setPage] = useState(1);
  const { ranking, totalPages, currentUserId } = useRaking(page);
  const { loading } = useRequireAuth();

  if (loading) return <main className="flex items-center">Loading...</main>;

  return (
    <main className="flex flex-col gap-10 items-center">
      <h1>Ranking</h1>
      <div className="w-full">
        {[...ranking]
          .sort((a, b) => b.score - a.score)
          .map(({ id, initials, first_name, highestLevel, score }, index) => (
            <RankingRowWithAvatar
              key={id}
              id={id}
              initials={initials}
              first_name={first_name}
              highestLevel={highestLevel}
              score={score}
              position={(page - 1) * 10 + index + 1}
              isCurrentUser={currentUserId === id}
            />
          ))}
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
