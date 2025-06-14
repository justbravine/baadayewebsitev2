import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  console.log('API route /api/apply called');
  
  try {
    const data = await request.json();
    console.log('Received application data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'location', 'loanAmount', 'loanDuration'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Add timestamp
    const applicationData = {
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'applications'), applicationData);

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        applicationId: docRef.id 
      },
      { status: 201 }
    );
  } catch (err) {
    const error = err as Error;
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 