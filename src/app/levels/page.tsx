'use client';
import { supabase } from '@/src/lib/supabaseClient';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Level {
	id: number;
	title: string;
	isUnlocked?: boolean;
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

			// exercise w/ highest order
			exercisesData?.filter(ex => completedIds.includes(ex.id));

			const unlockedLevels = data.map(level => {
				if (level.id === 0) return true;

				const previousLevelExercises = exercisesData?.filter(ex => ex.level_id === level.id - 1);
				const allPrevCompleted = previousLevelExercises?.every(ex => completedIds.includes(ex.id));

				return allPrevCompleted;
			});

			const updatedLevels = data.map((level, index) => ({
				...level,
				isUnlocked: unlockedLevels[index],
			}));

			setLevels(updatedLevels);
		}
		fetchLevels();
	}, []);

	return (
		<main>
			{fetchError && <p>{fetchError}</p>}
			{levels && levels.length === 0 && <p>No levels found</p>}
			{levels &&
				levels.map(level => {
					const isUnlocked = level.isUnlocked;

					return isUnlocked ? (
						<Link href={`/exercises/${level.id}`} key={level.id}>
							<div>
								<p>
									Level <span>{level.id}</span>
								</p>
								<h2>{level.title}</h2>
							</div>
							<CircleCheck />
						</Link>
					) : (
						<div key={level.id}>
							<div>
								<p>
									Level <span>{level.id}</span>
								</p>
								<h2>{level.title}</h2>
							</div>
							<CircleCheck />
						</div>
					);
				})}
		</main>
	);
}
