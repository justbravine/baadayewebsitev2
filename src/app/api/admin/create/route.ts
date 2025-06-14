import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    return NextResponse.json(
      { message: `Admin user created successfully: ${userCredential.user.email}` },
      { status: 201 }
    );
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: `Error creating admin user: ${error.message}` },
      { status: 500 }
    );
  }
} 