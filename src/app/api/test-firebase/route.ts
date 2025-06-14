import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Test successful',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Firebase connection successful',
      docId: docRef.id 
    });
  } catch (err) {
    const error = err as Error;
    console.error('Firebase test error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to Firebase' },
      { status: 500 }
    );
  }
} 