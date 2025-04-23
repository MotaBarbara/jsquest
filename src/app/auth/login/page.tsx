'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/src/lib/supabaseClient';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const loginFormSchema = z.object({
	email: z.string().email({ message: 'Enter a valid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function Login() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function handleLogin(data: LoginFormData) {
		try {
			await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			});
			toast.success('Login successful!');
			router.push('/');
		} catch (error) {
			console.error(error);
			toast.error('Error logging in, please try again later.');
		}
	}

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit(handleLogin)}>
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
				<Link href='/auth/forgot-password'>
					<p className='text-blue-600 hover:text-blue-800'>Forgot Password?</p>
				</Link>

				<button type='submit'>Login</button>
			</form>
		</div>
	);
}
