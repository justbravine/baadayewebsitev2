import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

// This should be moved to environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// This should be moved to a database in production
const ADMIN_CREDENTIALS = {
  email: 'admin@baadaye.com',
  password: 'admin123' // This should be hashed in production
}

export async function POST(request: Request) {
  console.log('Login request received')
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Login attempt:', { email, password })
    console.log('Expected credentials:', ADMIN_CREDENTIALS)

    // Validate credentials
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      console.log('Invalid credentials')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Credentials valid, generating token')

    // Generate JWT token
    const token = sign(
      { email: ADMIN_CREDENTIALS.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: 'lax', // Changed to 'lax' for better compatibility
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/', // Ensure cookie is available for all paths
    })

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    console.log('Login successful, cookie set')
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}