"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

export default function useRequireAuth() {
  const { user, loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      console.log('Auth state in useRequireAuth:', { user, loading, session });
      if (!session) {
        console.log('No session found, redirecting to login');
        router.replace("/auth/login");
      }
    }
  }, [user, loading, session, router]);

  return { loading, authenticated: !!session };
}
