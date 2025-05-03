'use client';
import { supabase } from '@/src/lib/supabaseClient';
import { CircleCheck, LockKeyhole, CircleArrowRight } from "lucide-react";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
	id: number;
	level_id: number;
	title: string;
	order: number;
}
interface Level {
  title: string;
}

export default function ExercisesOverview() {
	const { levelId } = useParams();
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [exercises, setExercises] = useState<Exercise[] | null>(null);
	const [highestCompletedOrder, setHighestCompletedOrder] = useState<number>(0);
	const [levels, setLevels] = useState<Level[] | null>(null);


	useEffect(() => {
		async function fetchExercises() {
			// get all exercises
			const { data, error } = await supabase.from('exercises').select('*').eq('level_id', levelId).order('order', { ascending: true });

			if (error || !data) {
				setFetchError('Could not fetch the exercises');
				setExercises(null);
			}
			setExercises(data);

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

			// exercise w/ highest order
			const completedExercises = data?.filter(ex => completedIds.includes(ex.id));
			const highestOrder = completedExercises?.reduce((max, ex) => (ex.order > max ? ex.order : max), 0);

			setHighestCompletedOrder(highestOrder);
		}
		fetchExercises();

		async function fetchLevels() {
			const { data, error } = await supabase
        .from("levels")
        .select("title")
        .eq("id", levelId);
				if (error) {
					setFetchError("Could not fetch the levels");
					return;
				}
				if (!data || data.length === 0) {
					setFetchError("No levels found");
					return;
				}
				setLevels(data);
		}
		fetchLevels();
	}, [levelId]);
	
	const currentLevelTitle = levels?.[0]?.title;
	
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
            const firstOfLevel = [
              101, 201, 301, 401, 501, 601, 701, 801, 901, 1001, 1101, 1201,
            ];

            const isUnlocked =
              firstOfLevel.includes(exercise.order) ||
              exercise.order <= highestCompletedOrder;
            const nextExercise =
              !firstOfLevel.includes(exercise.order) &&
              exercise.order === highestCompletedOrder + 1;
            const isLocked = !isUnlocked && !nextExercise;

            const order = exercise.order
            const currentExercise = order.toString().slice(2);

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
