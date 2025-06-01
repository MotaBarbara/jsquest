import TruncateText from "@/src/utils/truncateText";
import { ChevronDown, ChevronUp, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserAvatarMenuProps } from "@/src/types/props";

export default function UserAvatarMenu({
  user,
  profile,
  avatarUrl,
  initials,
  openSettings,
  setOpenSettings,
  signOut,
}: UserAvatarMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setOpenSettings(false);
    router.push("/");
  };

  return (
    <div className="relative flex items-center gap-8 w-[35vw] justify-end">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpenSettings(prev => !prev)}
        role="button"
        aria-label="Toggle settings menu"
      >
        {pathname !== "/auth/reset-password" && (
          <>
            <div className="rounded-full size-9.5 object-cover bg-[var(--primary-color)] text-[var(--text)] flex justify-center items-center mb-1">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="User avatar"
                  width={38}
                  height={38}
                  className="rounded-full"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[var(--text)] text-sm font-medium">
                {profile?.first_name} {profile?.last_name}
              </span>
              <span className="text-slate-600 text-xs">
                {TruncateText(user?.email || "")}
              </span>
            </div>
            {openSettings ? <ChevronUp /> : <ChevronDown />}
          </>
        )}
      </div>

      {openSettings && (
        <div className="!flex flex-col justify-between absolute -bottom-11 right-0 bg-[var(--secondary-background)] pb-1 pl-4 pr-5 text-sm gap-2 items-center">
          <Link
            className="text-[var(--secondary-text)] cursor-pointer !flex gap-1.5 items-center"
            href="/auth/settings"
            aria-label="Go to settings"
          >
            <Settings size={16} color="var(--secondary-text)" />
            <p>Settings</p>
          </Link>
          <button
            className="text-[var(--danger)] cursor-pointer !flex gap-1.5 items-center"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut size={16} color="var(--danger)" />
            <p>Log out</p>
          </button>
        </div>
      )}
    </div>
  );
}
