"use client";
import { CircleCheck, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbarProps } from "@/src/types/props";
import useLevels from "@/src/hooks/useLevels";
import useRequireAuth from "@/src/hooks/useRequireAuth";

export default function LevelsOverview() {
  const { levels, fetchError } = useLevels();
  const { loading } = useRequireAuth();

  if (loading) return <main className="flex items-center">Loading...</main>;

  return (
    <main className="h-[100vh] min-h-[700px] grid grid-cols-[repeat(auto-fit,_minmax(370px,_1fr))] gap-2.5 max-w-7xl m-auto">
      {fetchError && <p>{fetchError}</p>}
      {levels && levels.length === 0 && <p>No levels found</p>}
      {levels &&
        levels.map(level => {
          const isCompleted = level.isCompleted;
          const inProgress = level.inProgress;
          const percentageDone = level.percentageDone;
          const levelStructure = (
            <div className="w-full">
              <p className="text-sm mb-2 text-[var(--secondary-text)]">
                Level <span>{level.id}</span>
              </p>
              <h2>{level.title}</h2>
            </div>
          );

          const ProgressCircle = ({
            percentageDone = 0,
          }: CircularProgressbarProps) => {
            return (
              <div className="w-12 h-12 ">
                <CircularProgressbar
                  value={percentageDone}
                  text={`${percentageDone}%`}
                  strokeWidth={8}
                  styles={buildStyles({
                    textColor: "var(--text)",
                    pathColor: "var(--text)",
                    trailColor: "var(--unavailable-text)",
                    textSize: "24px",
                  })}
                />
              </div>
            );
          };

          if (isCompleted) {
            return (
              <Link
                key={level.id}
                href={`/exercises/${level.id}`}
                className="bg-[var(--secondary-color)] px-8 py-10 flex gap-6 h-full"
              >
                {levelStructure}
                <CircleCheck size={40} strokeWidth={1.5} />
              </Link>
            );
          }

          if (inProgress) {
            return (
              <Link
                key={level.id}
                href={`/exercises/${level.id}`}
                className="bg-[var(--primary-color)] px-8 py-10 flex gap-6 h-full items-start"
              >
                {levelStructure}
                <ProgressCircle percentageDone={percentageDone ?? 0} />
              </Link>
            );
          }

          return (
            <div
              key={level.id}
              className="bg-[var(--secondary-background)] px-8 py-10 flex gap-6 h-full cursor-not-allowed"
            >
              {levelStructure}
              <LockKeyhole size={40} strokeWidth={1.5} />
            </div>
          );
        })}
    </main>
  );
}
