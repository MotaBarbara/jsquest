'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/src/lib/supabaseClient';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from "@/src/components/button";


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
    <main className="h-[100vh] min-h-[700px] flex flex-col items-center justify-center p-6">
      <h1 className="pb-8 text-center">Create Account</h1>
      <form className="auth-form" onSubmit={handleSubmit(handleSignUp)}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register("email")} />
					<div className="text-[var(--danger)]">
						{errors.email && <p>{errors.email.message}</p>}
					</div>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password")} />
					<div className="text-[var(--danger)]">
						{errors.password && <p>{errors.password.message}</p>}
					</div>
        </div>
        <Button type="submit" variant="primary">
          Create Account
        </Button>
      </form>
    </main>
  );
}
