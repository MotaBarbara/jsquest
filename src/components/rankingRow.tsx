"use client";
import Image from "next/image";

interface RankingProps {
  initials: string | null;
  user: string;
  level: string | null;
  score: number | null;
  position: number;
  currentUser?: boolean;
  avatar: string | null;
}

export default function RankingRow({
  initials,
  position,
  user,
  level,
  score,
  currentUser,
  avatar,
}: RankingProps) {
  return (
    <div
      className={`flex ${
        currentUser
          ? "bg-[var(--secondary-background)]"
          : "bg-[var(--secondary-color)]"
      }   items-center justify-between w-full p-4 m-1`}
    >
      <div className="flex items-center gap-4">
        <p className="text-3xl">{position}</p>
        <div className="bg-[var(--primary-color)] rounded-full size-10 flex justify-center items-center overflow-hidden">
          {avatar ? (
            <Image
              src={avatar}
              alt={user}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            initials
          )}
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
