"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/src/components/Button";
import { useAuth } from "@/src/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updatePasswordSchema,
  type UpdatePasswordFormData,
} from "@/src/utils/validations/auth";
import { supabase } from "@/src/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword, session } = useAuth();
  const [message, setMessage] = useState("");
  const [initializing, setInitializing] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    async function initSessionFromUrl() {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.slice(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
      setInitializing(false);
    }

    initSessionFromUrl();
  }, []);

  async function handleSubmitForm(data: UpdatePasswordFormData) {
    const { error } = await updatePassword(data.password);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
  }

  if (initializing) return <p>Loading...</p>;
  if (!session) return <p>Invalid or expired session.</p>;

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
