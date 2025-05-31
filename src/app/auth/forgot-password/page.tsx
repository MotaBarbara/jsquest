'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Button from '@/src/components/Button';
import { useAuth } from '@/src/contexts/AuthContext';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/src/utils/validations/auth';

export default function ForgotPassword() {
	const [message, setMessage] = useState('');
	const { resetPassword } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	async function handleForgotPassword(data: ResetPasswordFormData) {
		const { error } = await resetPassword(data.email);
		
		if (error) {
			setMessage(error.message);
			return;
		}
		
		setMessage('Please check your email for password reset instructions.');
	}

	return (
		<main className="h-[100vh] min-h-[700px] flex flex-col items-center justify-center p-6">
			<h1 className="pb-8 text-center">Forgot Password</h1>
			<form className="auth-form" onSubmit={handleSubmit(handleForgotPassword)}>
				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						{...register("email")}
						placeholder="Enter your email"
					/>
					<div className="text-[var(--danger)]">
						{errors.email && <p>{errors.email.message}</p>}
					</div>
				</div>

				<Button type="submit">Request new password</Button>
				{message && (
					<p className={message.includes('check your email') ? 'text-[var(--success)]' : 'text-[var(--danger)]'}>
						{message}
					</p>
				)}
			</form>
		</main>
	);
}
