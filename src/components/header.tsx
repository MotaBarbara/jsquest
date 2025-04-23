'use client';

import Link from 'next/link';
import Logo from '@/src/assets/js-quest-logo.svg';
import Image from 'next/image';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

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

	useEffect(() => {
		async function fetchUser() {
			const { data: authData } = await supabase.auth.getUser();
			if (!authData.user) {
				setUser(null);
				return;
			}

			setUser({ email: authData.user.email ?? '' });

			const { data: userInfoData } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();

			if (userInfoData) {
				setUserInfo(userInfoData);
				const initials = `${userInfoData.first_name[0]}${userInfoData.last_name[0]}`;
				setInitials(initials);
			}
		}
		fetchUser();
	}, []);

	return (
		<header>
			<nav>
				<Link href='/pages/levels'>
					<Image src={Logo} alt='JS Quest Logo' width={100} height={100} />{' '}
				</Link>
				<div className='flex items-center gap-8'>
					<div className='flex items-center gap-4'>
						<div className='rounded-full size-10 object-cover bg-slate-300 text-slate-900 flex justify-center '>{initials}</div>

						<div className='flex flex-col'>
							<span className='text-slate-400 text-sm font-medium'>
								{userInfo?.first_name} {userInfo?.last_name}
							</span>
							<span className='text-slate-600 text-sm'>{user?.email}</span>
						</div>
					</div>

					<button className='text-red-400 hover:text-red-500 cursor-pointer'>Log out</button>
				</div>
			</nav>
		</header>
	);
}
