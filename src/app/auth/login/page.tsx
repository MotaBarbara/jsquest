'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/src/lib/supabaseClient';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from "@/src/components/button";


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
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.error(error.message || "Invalid credentials");
      return;
    }

    toast.success("Login successful!");
    router.push("/levels");
	}

	return (
    <main className="h-[100vh] min-h-[700px] flex flex-col items-center justify-center p-6">
      <h1 className="pb-8 text-center">Login</h1>
      <form className="auth-form" onSubmit={handleSubmit(handleLogin)}>
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
          Login
        </Button>
        <Link href="/auth/forgot-password">
          <p className="text-[var(--text)] underline underline-offset-3 text-center cursor-pointer">
            Forgot Password?
          </p>
        </Link>
      </form>
    </main>
  );
}
