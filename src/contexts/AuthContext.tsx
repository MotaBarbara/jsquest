"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { Session, User } from "@supabase/supabase-js";
import { ProfileProps } from "../types/props";
import { AuthContextTypeProps } from "../types/props";

const AuthContext = createContext<AuthContextTypeProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileProps | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [pendingAuthEvent, setPendingAuthEvent] = useState<{
    event: string;
    session: Session | null;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        setIsInitializing(true);

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (mounted) {
          if (currentSession?.access_token) {
            setSession(currentSession);
            setUser(currentSession.user);
            if (currentSession.user) {
              await fetchProfile(currentSession.user.id);
            }
          }
          setLoading(false);
          setIsInitialized(true);
          setIsInitializing(false);

          if (pendingAuthEvent) {
            handleAuthStateChange(
              pendingAuthEvent.event,
              pendingAuthEvent.session,
            );
            setPendingAuthEvent(null);
          }
        }
      } catch (error) {
        console.error("[AuthContext] Error initializing auth:", error);
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
          setIsInitializing(false);
        }
      }
    }

    function handleAuthStateChange(
      event: string,
      currentSession: Session | null,
    ) {
      if (currentSession?.access_token) {
        setSession(currentSession);
        setUser(currentSession.user);
        if (currentSession.user) {
          fetchProfile(currentSession.user.id);
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (mounted) {
        if (isInitializing) {
          setPendingAuthEvent({ event, session: currentSession });
        } else {
          handleAuthStateChange(event, currentSession);
        }
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isInitializing && pendingAuthEvent) {
      handleAuthStateChange(pendingAuthEvent.event, pendingAuthEvent.session);
      setPendingAuthEvent(null);
    }

    function handleAuthStateChange(
      event: string,
      currentSession: Session | null,
    ) {
      if (currentSession?.access_token) {
        setSession(currentSession);
        setUser(currentSession.user);
        if (currentSession.user) {
          fetchProfile(currentSession.user.id);
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    }
  }, [isInitializing, pendingAuthEvent]);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  async function signUp(
    email: string,
    password: string,
    userData: { first_name: string; last_name: string },
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/success`,
      },
    });

    if (data.user?.id) {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
        },
      ]);
    }

    return { error };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  }

  async function updateProfile(data: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string | null;
  }) {
    if (!user) return { error: new Error("No user found") };

    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id);

    if (!error) {
      setProfile(prev => (prev ? { ...prev, ...data } : null));
    }

    return { error };
  }

  async function uploadAvatar(file: File) {
    if (!user) return { url: null, error: new Error("No user found") };

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/avatar.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError };
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  }

  const value = {
    user,
    session,
    loading: loading || !isInitialized || isInitializing,
    profile,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
