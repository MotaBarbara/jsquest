'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/src/components/Button';
import { useAuth } from '@/src/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updatePasswordSchema,
  type UpdatePasswordFormData,
} from "@/src/utils/validations/auth";

export default function ResetPasswordPage() {
	console.log('ResetPasswordPage rendered');
	const router = useRouter();
	const { updatePassword } = useAuth();
	const [message, setMessage] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdatePasswordFormData>({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	async function handleSubmitForm(data: UpdatePasswordFormData) {
		const { error } = await updatePassword(data.password);
		
		if (error) {
			setMessage(error.message);
			return;
		}

		router.push('/');
	}

	return (
		<main className="h-[100vh] min-h-[700px] flex flex-col items-center justify-center p-6">
			{message && <p className="text-[var(--danger)]">{message}</p>}
			<h1 className="pb-8 text-center">Reset Password</h1>
			<form className="auth-form" onSubmit={handleSubmit(handleSubmitForm)}>
				<div>
					<label htmlFor="password">New Password</label>
					<input
						type="password"
						id="password"
						{...register("password")}
						required
					/>
					<div className="text-[var(--danger)]">
						{errors.password && <p>{errors.password.message}</p>}
					</div>
				</div>
				<div>
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						{...register("confirmPassword")}
						required
					/>
					<div className="text-[var(--danger)]">
						{errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
					</div>
				</div>

				<Button type="submit" variant="primary">
					Reset Password
				</Button>
			</form>
		</main>
	);
}

