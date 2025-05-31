import { useState, useEffect } from 'react';
import { supabase } from "../lib/supabaseClient";

export function useAvatar(userId?: string) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchAvatar() {
      try {
        if (!userId) {
          setAvatarUrl(null);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }

        const url = data?.avatar_url ? `${data.avatar_url}?t=${Date.now()}` : null;
        setAvatarUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch avatar'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchAvatar();
  }, [userId, refreshTrigger]);

  const refreshAvatar = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { avatarUrl, isLoading, error, refreshAvatar };
} 