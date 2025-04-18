'use client';
import { supabase } from '@/app/lib/supabaseClient';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Level {
	id: number;
	title: string;
}

export default function LevelsOverview() {
	const [fetchError, setFetchError] = useState<string | null>(null);
	const [levels, setLevels] = useState<Level[] | null>(null);

	useEffect(() => {
		async function fetchLevels() {
			const { data, error } = await supabase.from('levels').select();
			console.log('DATA:', data);
			console.log('ERROR:', error);
			if (error) {
				setFetchError('Could not fetch the levels');
				setLevels(null);
			}
			if (data) {
				setLevels(data);
				setFetchError(null);
			}
		}
		fetchLevels();
	}, []);

	return (
		<main>
			{fetchError && <p>{fetchError}</p>}
			{levels && levels.length === 0 && <p>No levels found</p>}
			{levels &&
				levels.map(level => (
					<Link href={`/pages/exercises/${level.id}`} key={level.id}>
						<div>
							<p>
								Level <span>{level.id}</span>
							</p>
							<h2>{level.title}</h2>
						</div>
						<CircleCheck />
					</Link>
				))}
		</main>
	);
}
