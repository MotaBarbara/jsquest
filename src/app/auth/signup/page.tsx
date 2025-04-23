'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/src/lib/supabaseClient';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const signUpFormSchema = z.object({
	email: z.string().email({ message: 'Enter a valid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type SignUpFormData = z.infer<typeof signUpFormSchema>;

export default function Login() {
	const router = useRouter();
	const [origin, setOrigin] = useState('');

	useEffect(() => {
		setOrigin(window.location.origin);
	}, []);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function handleSignUp(data: SignUpFormData) {
		try {
			await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					emailRedirectTo: `${origin}/auth/success`,
				},
			});
			router.push('/auth/confirm-email');
		} catch (error) {
			console.error(error);
			toast.error('Error logging in, please try again later.');
		}
	}

	return (
		<div>
			<h1>Create Account</h1>
			<form onSubmit={handleSubmit(handleSignUp)}>
				<div>
					<label htmlFor='email'>Email</label>
					<input id='email' type='email' {...register('email')} />
					{errors.email && <p>{errors.email.message}</p>}
				</div>

				<div>
					<label htmlFor='password'>Password</label>
					<input id='password' type='password' {...register('password')} />
					{errors.password && <p>{errors.password.message}</p>}
				</div>

				<button type='submit'>Create Account</button>
			</form>
		</div>
	);
}
