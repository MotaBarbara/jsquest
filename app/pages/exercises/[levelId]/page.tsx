'use client';
import { supabase } from '@/app/lib/supabaseClient';
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

	useEffect(() => {
		const fetchExercises = async () => {
			console.log('Fetching exercises for levelId:', levelId);
			const { data, error } = await supabase.from('exercises').select().eq('level_id', levelId);

			console.log('Fetched data:', data);
			console.log('Fetch error:', error);
			if (error) {
				setFetchError('Could not fetch the exercises');
				setExercises(null);
			}
			if (data) {
				setExercises(data);
				setFetchError(null);
			}
		};
		if (levelId) {
			fetchExercises();
		}
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
				exercises.map(exercise => (
					<Link href={`/pages/exercise/${exercise.id}`} key={exercise.id}>
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
				))}
		</main>
	);
}
