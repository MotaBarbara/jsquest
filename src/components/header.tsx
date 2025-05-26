"use client";

import Link from "next/link";
import Logo from "@/src/assets/js-quest-logo.svg";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Button from "./button";
import { usePathname } from "next/navigation";
import TruncateText from "../utils/truncateText";

interface User {
  email: string;
}
interface UserInfo {
  first_name: string;
  last_name: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [initials, setInitials] = useState<string>("");
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setUser(null);
        setLoading(false);
        setUserInfo(null);
        setInitials("");
        return;
      }

      setUser({ email: authData.user.email ?? "" });

      const { data: userInfoData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userInfoData) {
        setUserInfo(userInfoData);
        const initials = `${userInfoData.first_name[0]}${userInfoData.last_name[0]}`;
        setInitials(initials);
      }
      setLoading(false);
    }
    fetchUser();

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email ?? "" });
        fetchUser();
        setOpenSettings(false);
      } else {
        setUser(null);
      }
    });
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
    } else {
      setUser(null);
      setUserInfo(null);
      setInitials("");
      setLoading(false);
    }
  }

  useEffect(() => {
    setShowSettings(openSettings);
  }, [openSettings]);

  return (
    <header className="fixed w-full z-10">
      <nav className="flex justify-between items-center py-4 px-5 md:px-12 m-auto max-w-[80rem] bg-[var(--background-color)]">
        <Link
          href={user ? "/levels" : "/"}
          className={user ? "w-[35vw]" : "w-[175px]"}
        >
          <Image src={Logo} alt="JS Quest Logo" width={100} height={100} />{" "}
        </Link>

        <div className="hidden md:flex">
          {user ? (
            <div className="flex gap-8">
              <Link href="/">Home</Link>
              <Link href="/levels">Levels</Link>
              <Link href="/ranking">Ranking</Link>
            </div>
          ) : (
            <div className="flex gap-8">
              <Link href="/levels">How It Works</Link>
              <Link href="/ranking">Features & Benefits</Link>
            </div>
          )}
        </div>

        <div className="hidden md:flex">
          {!loading && user && (
            <div className="relative flex items-center gap-8 w-[35vw] justify-end">
              <div
                className="flex items-center gap-2"
                onClick={() => {
                  setOpenSettings(prev => !prev);
                }}
              >
                {pathname !== "/auth/reset-password" && (
                  <>
                    <div className="rounded-full size-9.5 object-cover bg-[var(--primary-color)] text-[var(--text)] flex justify-center items-center pt-1 mb-1">
                      {initials}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[var(--text)] text-sm font-medium">
                        {userInfo?.first_name} {userInfo?.last_name}
                      </span>
                      <span className="text-slate-600 text-xs">
                        {TruncateText(user?.email || "")}
                      </span>
                    </div>
                    {!showSettings && <ChevronDown />}
                    {showSettings && <ChevronUp />}
                  </>
                )}
              </div>

              {openSettings && (
                <div className="!flex flex-col justify-between absolute -bottom-11 right-0 bg-[var(--secondary-background)] py-2 pl-4 pr-5 text-sm gap-2 items-center">
                  <Link
                    className="text-[var(--secondary-text)] cursor-pointer !flex gap-1.5 items-center"
                    href="/auth/settings"
                  >
                    <Settings size={16} color="var(--secondary-text)" />
                    <p>Settings</p>
                  </Link>
                  <Link
                    className="text-[var(--danger)] cursor-pointer !flex gap-1.5 items-center"
                    href="/"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <LogOut size={16} color="var(--danger)" />
                    <p>Log out</p>
                  </Link>
                </div>
              )}
            </div>
          )}

          {!loading && !user && (
            <div className="flex items-end w-[175px]">
              {pathname !== "/auth/login" && (
                <Button variant="primary" href="/auth/login">
                  Login
                </Button>
              )}
              {pathname === "/auth/login" && (
                <Button variant="primary" href="/auth/signup">
                  Create account
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(prev => !prev)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-4 bg-[var(--background-color)] px-5 py-4 shadow-md">
            {user ? (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={pathname === "/" ? "font-bold" : ""}
                >
                  Home
                </Link>
                <Link
                  href="/levels"
                  onClick={() => setMobileMenuOpen(false)}
                  className={pathname === "/levels" ? "font-bold" : ""}
                >
                  Levels
                </Link>
                <Link
                  href="/ranking"
                  onClick={() => setMobileMenuOpen(false)}
                  className={pathname === "/ranking" ? "font-bold" : ""}
                >
                  Ranking
                </Link>
                <Link
                  href="/auth/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex gap-1 items-center text-sm"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex gap-1 items-center text-sm text-[var(--danger)]"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/levels"
                  onClick={() => setMobileMenuOpen(false)}
                  className={pathname === "/levels" ? "font-bold" : ""}
                >
                  How It Works
                </Link>
                <Link
                  href="/ranking"
                  onClick={() => setMobileMenuOpen(false)}
                  className={pathname === "/ranking" ? "font-bold" : ""}
                >
                  Features & Benefits
                </Link>
                {pathname !== "/auth/login" && (
                  <Button
                    href="/auth/login"
                    variant="primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                )}
                {pathname === "/auth/login" && (
                  <Button
                    href="/auth/signup"
                    variant="primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create account
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
