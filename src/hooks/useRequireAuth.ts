"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

export default function useRequireAuth() {
  const { user, loading, session } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (!session?.access_token) {
          router.replace("/auth/login");
        }
        setIsChecking(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, loading, session, router]);

  return {
    loading: loading || isChecking,
    authenticated: !!session?.access_token,
  };
}
