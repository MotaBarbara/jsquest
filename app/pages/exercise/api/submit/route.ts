// app/api/submit/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const formData = await request.formData();

	// Process the form data here
	const form = Object.fromEntries(formData.entries());

	console.log('Form data received:', form);

	// Do something with the form data, like saving it to a database

	// Return a response (you can also return JSON if needed)
	return NextResponse.json({ message: 'Form submitted successfully' });
}
