'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Setting up auth state listener...')
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user')
      setUser(user)
      setLoading(false)
    })

    return () => {
      console.log('Cleaning up auth state listener...')
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in...')
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Sign in successful:', userCredential.user.email)
      if (!userCredential.user) {
        throw new Error('No user found after sign in')
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('Sign in error:', error.code, error.message)
      } else {
        console.error('Sign in error:', error)
      }
      throw error
    }
  }

  const signOut = async () => {
    console.log('Attempting to sign out...')
    try {
      await firebaseSignOut(auth)
      console.log('Sign out successful')
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('Sign out error:', error.code, error.message)
      } else {
        console.error('Sign out error:', error)
      }
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
