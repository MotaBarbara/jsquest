"use client";
import { CircleCheck, LockKeyhole, CircleArrowRight } from "lucide-react";
import Link from "next/link";
import useExercisesOverview from "@/src/hooks/useExercisesOverview";
import useRequireAuth from "@/src/hooks/useRequireAuth";

export default function ExercisesOverview() {
  const {
    exercises,
    highestCompletedOrder,
    fetchError,
    currentLevelTitle,
    levelId,
  } = useExercisesOverview();
  const { loading } = useRequireAuth();

  if (loading) return <main className="flex items-center">Loading...</main>;

  return (
    <main className="p-6 m-auto h-[100vh] min-h-[700px] pt-[4.625rem]">
      <p>
        Level <span>{levelId}</span>
      </p>
      <h1>{currentLevelTitle}</h1>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(420px,_1fr))] gap-2.5 max-w-7xl mt-12">
        {fetchError && <p>{fetchError}</p>}
        {exercises && exercises.length === 0 && <p>No exercises found</p>}
        {exercises &&
          exercises.map(exercise => {
            const currentExercise = exercise.order % 100;
            const isFirstOfLevel = exercise.order % 100 === 1;

            const isUnlocked =
              isFirstOfLevel || exercise.order <= highestCompletedOrder;
            const nextExercise =
              !isFirstOfLevel && exercise.order === highestCompletedOrder + 1;
            const isLocked = !isUnlocked && !nextExercise;

            const exerciseStructure = (
              <div className="w-full">
                <p className="text-sm mb-2 text-[var(--secondary-text)]">
                  Exercise <span>{currentExercise}</span>
                </p>
                <h2>{exercise.title}</h2>
              </div>
            );

            if (isUnlocked) {
              return (
                <Link
                  href={`/exercise/${exercise.id}`}
                  key={exercise.id}
                  className="bg-[var(--secondary-color)] px-8 py-10 flex gap-6 h-full items-start"
                >
                  {exerciseStructure}
                  <CircleCheck size={40} strokeWidth={1.5} />
                </Link>
              );
            }
            if (nextExercise) {
              return (
                <Link
                  href={`/exercise/${exercise.id}`}
                  key={exercise.id}
                  className="bg-[var(--primary-color)] px-8 py-10 flex gap-6 h-full items-start"
                >
                  {exerciseStructure}
                  <CircleArrowRight size={40} strokeWidth={1.5} />
                </Link>
              );
            }
            if (isLocked) {
              return (
                <div
                  key={exercise.id}
                  className="bg-[var(--secondary-background)] px-8 py-10 flex gap-6 h-full cursor-not-allowed"
                >
                  {exerciseStructure}
                  <LockKeyhole size={40} strokeWidth={1.5} />
                </div>
              );
            }
          })}
      </div>
    </main>
  );
}
