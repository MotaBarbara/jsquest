'use client';
import { supabase } from '@/src/lib/supabaseClient';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
	id: number;
	level_id: number;
	title: string;
	order: number;
}

export default function ExercisesOverview() {
	const { levelId } = useParams();
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [exercises, setExercises] = useState<Exercise[] | null>(null);
	const [highestCompletedOrder, setHighestCompletedOrder] = useState<number>(0);

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
	}, [levelId]);

	return (
		<main>
			<p>
				Level <span>{levelId}</span>
			</p>
			<h1></h1>
			{fetchError && <p>{fetchError}</p>}
			{exercises && exercises.length === 0 && <p>No exercises found</p>}
			{exercises &&
				exercises.map(exercise => {
					const firstOfLevel = [101, 201, 301, 401, 501, 601, 701, 801, 901, 1001, 1101, 1201];
					const isUnlocked = firstOfLevel.includes(exercise.order) || exercise.order <= highestCompletedOrder + 1;

					return isUnlocked ? (
						<Link href={`/exercise/${exercise.id}`} key={exercise.id}>
							<div>
								<div>
									<p>
										Exercise <span>{exercise.order}</span>
									</p>
									<h2>{exercise.title}</h2>
								</div>
								<CircleCheck />
							</div>
						</Link>
					) : (
						<div key={exercise.id}>
							<div>
								<p>
									Exercise <span>{exercise.order}</span>
								</p>
								<h2>{exercise.title}</h2>
							</div>
							<CircleCheck />
						</div>
					);
				})}
		</main>
	);
}
