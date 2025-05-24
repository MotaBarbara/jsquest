"use client";
interface RankingProps {
  initials: string | null;
  user: string;
  level: string | null;
  score: number | null;
  position: number;
}

export default function RankingRow({
  initials,
  position,
  user,
  level,
  score,
}: RankingProps) {
  return (
    <div className="flex bg-[var(--secondary-background)]  items-center justify-between w-full p-4 m-1">
      <div className="flex items-center gap-4">
        <p className="text-3xl">{position}</p>
        <div className="bg-[var(--primary-color)] rounded-full size-10 flex justify-center items-center">
          {initials}
        </div>
        <div>
          <p>{user}</p>
          <p>Level: {level}</p>
        </div>
      </div>
      <p className="">{score} XP</p>
    </div>
  );
}
