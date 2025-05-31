import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabaseClient";

export function useInitials() {
  const [initials, setInitials] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchInitials() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          setInitials(null);
          return;
        }

        const { data: userInfoData, error: userInfoError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", data.user.id)
          .single();

        if (userInfoError || !userInfoData) {
          setInitials(null);
          return;
        }

        const firstInitial = userInfoData.first_name?.[0] ?? "";
        const lastInitial = userInfoData.last_name?.[0] ?? "";
        setInitials(`${firstInitial}${lastInitial}`.toUpperCase());
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch initials'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitials();
  }, []);

  return { initials, isLoading, error };
} 