'use server'

import { cookies } from 'next/headers'

export async function login(password: string) {
  const correctPassword = process.env.DASHBOARD_PASSWORD || 'admin123'
  
  if (password === correctPassword) {
    (await cookies()).set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    return { success: true }
  }
  return { success: false, error: 'Invalid password' }
}

export async function logout() {
  (await cookies()).delete('auth')
}
