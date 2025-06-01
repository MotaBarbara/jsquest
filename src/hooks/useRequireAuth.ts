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
      console.log('Auth state in useRequireAuth:', { user, loading, session });
      
      // Add a small delay to ensure session is properly initialized
      const timer = setTimeout(() => {
        if (!session?.access_token) {
          console.log('No valid session found, redirecting to login');
          router.replace("/auth/login");
        }
        setIsChecking(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, loading, session, router]);

  // Return loading state that includes both the auth loading and our checking state
  return { loading: loading || isChecking, authenticated: !!session?.access_token };
}
