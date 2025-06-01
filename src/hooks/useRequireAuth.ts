"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

export default function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      console.log('Auth state in useRequireAuth:', { user, loading });
      if (!user) {
        console.log('No user found, redirecting to login');
        router.replace("/auth/login");
      }
    }
  }, [user, loading, router]);

  return { loading, authenticated: !!user };
}
