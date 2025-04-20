'use client';
import { supabase } from '@/app/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FormEvent } from 'react';

interface Exercise {
	id: string;
	level_id: number;
	title: string;
	instruction: string;
	options: string[];
	correct_answers: number[];
	order: number;
}
interface Level {
	title: string;
}

export default function ExercisesOverview() {
	const { exerciseId } = useParams();
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [exercise, setExercise] = useState<Exercise | null>(null);
	const [level, setLevel] = useState<Level | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
	const [nextExercise, setNextExercise] = useState<Exercise | null>(null);

	useEffect(() => {
		async function fetchExercise() {
			if (!exerciseId) return;

			setIsLoading(true);

			const { data: exerciseData, error: exerciseError } = await supabase.from('exercises').select('*').eq('id', exerciseId).single();

			if (exerciseError) {
				setFetchError('Could not fetch the exercises');
				setIsLoading(false);
				return;
			}
			if (exerciseData) {
				// Get next exercise
				setExercise(exerciseData);

				console.log('Current exercise order:', exerciseData.order);
				console.log('Current exercise level_id:', exerciseData.level_id);

				const { data: nextExerciseData, error: nextExerciseError } = await supabase
					.from('exercises')
					.select('*')
					.eq('level_id', exerciseData.level_id)
					.gt('"order"', exerciseData.order)
					.order('"order"', { ascending: true })
					.limit(1);

				if (nextExerciseError) {
					setFetchError('Could not fetch the next exercise');
				}
				if (nextExerciseData && nextExerciseData.length > 0) {
					setNextExercise(nextExerciseData[0]);
				}

				// Get the current level
				const { data: levelData, error: levelError } = await supabase.from('levels').select('*').eq('id', exerciseData.level_id).single();

				if (levelError) {
					setFetchError('Could not fetch the level data');
				}
				if (levelData) {
					setLevel(levelData);
				}
			}
			setIsLoading(false);
		}
		fetchExercise();
	}, [exerciseId]);

	const optionsValue = ['a', 'b', 'c', 'd'];

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const selectedPositions: number[] = [];
		const checkboxes = e.currentTarget.querySelectorAll('input[type="checkbox"]');
		checkboxes.forEach((checkbox, index) => {
			if ((checkbox as HTMLInputElement).checked) {
				selectedPositions.push(index);
			}
		});
		console.log(selectedPositions, exercise?.correct_answers);

		const isAnswerCorrect = JSON.stringify(selectedPositions) === JSON.stringify(exercise?.correct_answers);
		setIsCorrect(isAnswerCorrect);

		const user = await supabase.auth.getUser();
		if (user.data.user) {
			await supabase.from('user_exercises').insert([
				{
					user_id: user.data.user.id,
					exercise_id: exercise?.id,
					is_correct: isAnswerCorrect,
				},
			]);
		}
	}

	useEffect(() => {
		if (isCorrect !== null) {
			console.log(isCorrect ? 'Well Done!' : 'Wrong Answer, try again!');
		}
	}, [isCorrect]);

	if (isLoading) {
		return <p>Loading...</p>;
	}
	if (fetchError) {
		return <p>{fetchError}</p>;
	}
	if (!exercise) {
		return <p>No exercises found</p>;
	}

	return (
		<div>
			{fetchError && <p>{fetchError}</p>}
			{!exercise && <p>No exercise found</p>}

			{exercise && (
				<main>
					<p>
						Level <span>{exercise?.level_id}</span> - <span>{level?.title}</span>
					</p>
					<h1>
						<span>{exercise?.order}. </span>
						{exercise?.title}
					</h1>
					<p>Instructions</p>
					<p>{exercise?.instruction}</p>
					<form onSubmit={onSubmit}>
						{exercise?.options.map((option, index) => (
							<div key={option}>
								<input type='checkbox' name='option' value={option}></input>
								<label htmlFor=''>
									{optionsValue[index]}. {option}
								</label>
							</div>
						))}
						<button type='submit'>Submit</button>
						{isCorrect === false && <p>Wrong Answer, try again!</p>}
						{isCorrect && (
							<div>
								<p>Well Done!</p>
								{nextExercise ? (
									<div>
										<Link href={`/pages/exercise/${nextExercise.id}`}>Next</Link>
									</div>
								) : (
									<div>
										<Link href={`/pages/levels`}>All Level</Link>
									</div>
								)}
							</div>
						)}
					</form>
				</main>
			)}
		</div>
	);
}
