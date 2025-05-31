import Link from "next/link";
import { MobileMenuProps } from "@/src/types/props";
import Button from "../Button";

export default function MobileMenu({
  user,
  pathname,
  setMobileMenuOpen,
  signOut,
}: MobileMenuProps) {
  const close = () => setMobileMenuOpen(false);
  return (
    <div className="md:hidden flex flex-col gap-4 bg-[var(--background-color)] px-5 py-4 shadow-md">
      {user ? (
        <>
          <Link
            href="/"
            onClick={close}
            className={
              pathname === "/" ? "font-bold text-[var(--primary-color)]" : ""
            }
          >
            Home
          </Link>
          <Link
            href="/levels"
            onClick={close}
            className={
              pathname === "/levels"
                ? "font-bold text-[var(--primary-color)]"
                : ""
            }
          >
            Levels
          </Link>
          <Link
            href="/ranking"
            onClick={close}
            className={
              pathname === "/ranking"
                ? "font-bold text-[var(--primary-color)]"
                : ""
            }
          >
            Ranking
          </Link>
          <Link
            href="/auth/settings"
            onClick={close}
            className={
              pathname === "/auth/settings"
                ? "font-bold text-[var(--primary-color)]"
                : ""
            }
          >
            Settings
          </Link>
          <button
            onClick={() => {
              signOut();
              close();
            }}
            className="text-[var(--danger)]"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link href="/levels" onClick={close}>
            How It Works
          </Link>
          <Link href="/ranking" onClick={close}>
            Features & Benefits
          </Link>
          {pathname !== "/auth/login" ? (
            <Button href="/auth/login" onClick={close} variant="primary">
              Login
            </Button>
          ) : (
            <Button href="/auth/signup" onClick={close} variant="primary">
              Create account
            </Button>
          )}
        </>
      )}
    </div>
  );
}
