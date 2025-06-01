"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

export default function useRequireAuth() {
  const { user, loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.replace("/auth/login");
      }
    }
  }, [user, loading, session, router]);

  return { loading, authenticated: !!session };
}
