"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Button from "@/src/components/Button";
import { useAuth } from "@/src/contexts/AuthContext";
import Link from "next/link";

import {
  signUpFormSchema,
  type SignUpFormData,
} from "@/src/utils/validations/auth";

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
  });

  async function handleSignUp(data: SignUpFormData) {
    try {
      const { error } = await signUp(data.email, data.password, {
        first_name: data.first_name,
        last_name: data.last_name,
      });

      if (error) {
        throw error;
      }

      router.push("/auth/confirm-email");
    } catch (error) {
      console.error(error);
      toast.error("Error creating account, please try again later.");
    }
  }

  return (
    <main className="h-[100vh] min-h-[700px] flex flex-col items-center justify-center p-6">
      <h1 className="pb-8 text-center">Create Account</h1>
      <form className="auth-form" onSubmit={handleSubmit(handleSignUp)}>
        <div className="!grid !grid-cols-2">
          <div>
            <label htmlFor="fname">First name</label>
            <input id="fname" type="text" {...register("first_name")} />
            <div className="text-[var(--danger)]">
              {errors.first_name && <p>{errors.first_name.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="lname">Last Name</label>
            <input id="lname" type="text" {...register("last_name")} />
            <div className="text-[var(--danger)]">
              {errors.last_name && <p>{errors.last_name.message}</p>}
            </div>
          </div>
        </div>

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
          <Link href="/auth/login">
            <p className="text-[var(--text)] text-center cursor-pointer md:hidden !text-sm">
              Already have an account?{" "}
              <span className="underline underline-offset-3">Login now.</span>
            </p>
          </Link>
      </form>
    </main>
  );
}
