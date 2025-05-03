'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { useState } from 'react';
import Button from "@/src/components/button";


export default function ResetPasswordPage() {
	console.log('ResetPasswordPage rendered');
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		console.log('Form submitted');

		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return;
		}
		setError('');
		setLoading(true);

		const { error: updateError } = await supabase.auth.updateUser({ password });

		setLoading(false);
		console.log('Loading state:', loading);

		if (updateError) {
			console.error(updateError);
			setError(updateError.message);
			return;
		}

		router.push('/');
		console.log('Redirecting to home...');
	}

	return (
    <main className="h-[100vh] min-h-[700px] flex flex-col items-center justify-center p-6">
      {error && <p>{error}</p>}
      <h1 className="pb-8 text-center">Reset Password</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}
        <Button type="submit" variant="primary">
          Reset Password
        </Button>
      </form>
    </main>
  );
}
