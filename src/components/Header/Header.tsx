"use client";

import Link from "next/link";
import Logo from "@/src/assets/js-quest-logo.svg";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "../Button";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { useInitials } from "@/src/hooks/useInitials";
import { useAvatar } from "@/src/hooks/useAvatar";
import NavLink from "./NavLink";
import UserAvatarMenu from "./UserAvatarMenu";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const { user, profile, signOut, loading } = useAuth();
  const { initials } = useInitials();
  const { avatarUrl } = useAvatar(user?.id);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || "";

  console.log({ user, loading, profile });

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
          <div className="flex gap-8">
            {user ? (
              <>
                <NavLink href="/" label="Home" />
                <NavLink href="/levels" label="Challenges" />
                <NavLink href="/ranking" label="Ranking" />
              </>
            ) : (
              <>
                <NavLink href="#how-it-works" label="How It Works" />
                <NavLink href="#functionalities" label="Features & Benefits" />
              </>
            )}
          </div>
        </div>

        <div className="hidden md:flex">
          {!loading && user && (
            <UserAvatarMenu
              user={user}
              profile={profile}
              avatarUrl={avatarUrl}
              initials={initials}
              openSettings={openSettings}
              setOpenSettings={setOpenSettings}
              signOut={signOut}
            />
          )}

          {!loading && !user && (
            <div className="flex items-end w-[175px]">
              {pathname !== "/auth/login" ? (
                <Button variant="primary" href="/auth/login">
                  Login
                </Button>
              ) : (
                <Button variant="primary" href="/auth/signup">
                  Create account
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <MobileMenu
            user={user}
            pathname={pathname}
            setMobileMenuOpen={setMobileMenuOpen}
            signOut={signOut}
          />
        )}
      </nav>
    </header>
  );
}
