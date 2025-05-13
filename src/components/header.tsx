'use client';

import Link from 'next/link';
import Logo from '@/src/assets/js-quest-logo.svg';
import Image from 'next/image';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';
import Button from './button';
import { usePathname } from "next/navigation";


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
	const [initials, setInitials] = useState<string>('');
	const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
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

			setUser({ email: authData.user.email ?? '' });

			const { data: userInfoData } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();

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
     <header className="fixed w-full">
       <nav className="flex justify-between items-center py-4 px-12 m-auto max-w-[80rem]">
         <Link href="/pages/levels">
           <Image src={Logo} alt="JS Quest Logo" width={100} height={100} />{" "}
         </Link>
         {!loading && user && (
           <div className="relative flex items-center gap-8">
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
                       {user?.email}
                     </span>
                   </div>
                   {!showSettings && <ChevronDown />}
                   {showSettings && <ChevronUp />}
                 </>
               )}
             </div>

             {openSettings && (
               <div className="!flex justify-between absolute -bottom-11 right-0 bg-[var(--secondary-background)] py-2 pl-4 pr-5 text-sm gap-2 items-center">
                 <Link
                   className="text-[var(--danger)] cursor-pointer !flex gap-1.5"
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
           <div className="flex">
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
       </nav>
     </header>
   ); 
}
