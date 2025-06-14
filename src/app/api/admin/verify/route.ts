import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: Request) {
  console.log('Verify request received')
  try {
    const cookieStore = await cookies()
    const token = await cookieStore.get('adminToken')
    console.log('Token from cookie:', token ? 'exists' : 'not found')

    if (!token) {
      console.log('No token provided')
      const response = NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }

    try {
      const decoded = verify(token.value, JWT_SECRET) as { email: string; role: string }
      console.log('Token verified successfully')
      const response = NextResponse.json({ 
        valid: true,
        user: {
          email: decoded.email,
          role: decoded.role
        }
      })
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    } catch (error) {
      console.log('Token verification failed:', error)
      const response = NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }
  } catch (error) {
    console.error('Token verification error:', error)
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }
} 