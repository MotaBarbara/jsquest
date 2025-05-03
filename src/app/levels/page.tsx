'use client';
import { supabase } from '@/src/lib/supabaseClient';
import { CircleCheck, LockKeyhole } from "lucide-react";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Level {
	id: number;
	title: string;
	isCompleted?: boolean;
	percentageDone?: number;
	inProgress?: number;
}

interface CircularProgressbarProps {
  percentageDone: number;
}

export default function LevelsOverview() {
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [levels, setLevels] = useState<Level[] | null>(null);

	useEffect(() => {
		async function fetchLevels() {
			const { data, error } = await supabase.from('levels').select();

			if (error) {
				setFetchError('Could not fetch the levels');
				return;
			}
			if (!data || data.length === 0) {
				setFetchError('No levels found');
				return;
			}
			setLevels(data);

			// get all exercises
			const { data: exercisesData, error: exercisesError } = await supabase.from('exercises').select('*').order('order', { ascending: true });

			if (exercisesError || !exercisesData) {
				setFetchError('Could not fetch the exercises');
			}

			// only the next exercise should be clickable
			// get current user
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			// get the completed exercises
			const { data: userCompletedExercises, error: userCompletedError } = await supabase.from('user_exercises').select('exercise_id').eq('user_id', user.id).eq('is_correct', true);

			if (userCompletedError || !userCompletedExercises) {
				setFetchError('Could not fetch completed exercises');
				return;
			}

			const completedIds = userCompletedExercises.map(e => e.exercise_id);
			const uniqueIds = [...new Set(completedIds)].length;

			
			const inProgressLevel = Math.floor(uniqueIds / 10);
			const exercisesDonePerLevel = uniqueIds - 10 * inProgressLevel;

			const percentageDone = exercisesDonePerLevel * 10

			const updatedLevels = data.map(level => {
  			const isCompleted = level.id <= inProgressLevel - 1;
				const inProgress = level.id === inProgressLevel;
				
  		return {
        ...level,
        isCompleted,
				inProgress,
				percentageDone
      };
		});
			
			setLevels(updatedLevels);
			
		}
		fetchLevels();
	}, []);


	return (
    <main className="h-[100vh] min-h-[700px] grid grid-cols-[repeat(auto-fit,_minmax(370px,_1fr))] gap-2.5 max-w-7xl m-auto text-center">
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
