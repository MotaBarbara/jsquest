"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/src/components/Button";
import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  loginFormSchema,
  type LoginFormData,
} from "@/src/utils/validations/auth";

export default function Login() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { signIn, session } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginFormData) {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setMessage("Invalid credentials, please try again");
      return;
    }

    // Wait for the session to be set
    const checkSession = setInterval(() => {
      if (session?.access_token) {
        clearInterval(checkSession);
        router.push("/levels");
      }
    }, 100);

    // Clear interval after 5 seconds to prevent infinite checking
    setTimeout(() => clearInterval(checkSession), 5000);
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
            {message && <p>{message}</p>}
          </div>
        </div>
        <Button type="submit" variant="primary">
          Login
        </Button>
        <div>
          <Link href="/auth/signup">
            <p className="text-[var(--text)] text-center cursor-pointer md:hidden !text-sm">
              New here?{" "}
              <span className="underline underline-offset-3">Sign up now.</span>
            </p>
          </Link>
          <Link href="/auth/forgot-password">
            <p className="text-[var(--text)] underline underline-offset-3 text-center cursor-pointer !text-sm">
              Forgot Password?
            </p>
          </Link>
        </div>
      </form>
    </main>
  );
}
