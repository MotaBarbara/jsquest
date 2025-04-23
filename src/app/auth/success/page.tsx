import Link from 'next/link';

export default function AccountCreatedPage() {
	return (
		<div>
			<h1>Signup Successful</h1>
			<Link href='/'>
				<button>Start your Journey</button>
			</Link>
		</div>
	);
}
