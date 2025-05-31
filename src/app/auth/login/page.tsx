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
  const { signIn } = useAuth();

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
            {message && <p>{message}</p>}
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
