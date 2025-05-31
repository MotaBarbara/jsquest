"use client";
import Image from "next/image";
import { useState } from "react";
import { RankingProps } from "../types/props";

export default function RankingRow({
  initials,
  position,
  user,
  level,
  score,
  currentUser,
  avatar,
}: RankingProps) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div
      className={`flex ${
        currentUser
          ? "bg-[var(--primary-color)]"
          : "bg-[var(--secondary-background)]"
      } items-center justify-between w-full p-4 m-1`}
      role="row"
    >
      <div className="flex items-center gap-4">
        <p className="text-3xl" aria-label={`Position ${position}`}>
          {position}
        </p>
        <div
          className="bg-[var(--secondary-color)] rounded-full size-10 flex justify-center items-center overflow-hidden"
          role="img"
          aria-label={`${user}'s avatar`}
        >
          {avatar ? (
            <>
              {imageLoading && (
                <div className="animate-pulse bg-gray-200 w-full h-full" />
              )}
              <Image
                src={avatar}
                alt={`${user}'s avatar`}
                width={40}
                height={40}
                className={`object-cover w-full h-full ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
              />
            </>
          ) : (
            <span aria-label={`${user}'s initials`}>{initials}</span>
          )}
        </div>
        <div>
          <p>{user}</p>
          <p>Level: {level}</p>
        </div>
      </div>
      <p aria-label={`${score} XP`}>{score} XP</p>
    </div>
  );
}
