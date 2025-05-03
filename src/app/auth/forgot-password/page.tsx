'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Button from '@/src/components/button';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	async function handleForgotPassword(e: React.FormEvent) {
		e.preventDefault();

		setMessage('');
		setError('');

		const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'http://localhost:3000/auth/reset-password' });

		if (error) {
			setError(error.message);
		} else {
			setMessage('Please check your email for password reset instructions.');
		}
	}

	return (
    <main className="h-[100vh] min-h-[700px] flex flex-col items-center justify-center p-6">
      <h1 className="pb-8 text-center">Forgot Password</h1>
      <form className="auth-form" onSubmit={handleForgotPassword}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <Button type="submit">Request new password</Button>
        {message && <p className="text-[var(--success)]">{message}</p>}
        {error && <p className="text-[var(--danger)]">{error}</p>}
      </form>
    </main>
  );
}
