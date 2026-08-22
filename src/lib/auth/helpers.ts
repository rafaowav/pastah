import { auth } from './index'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  return session?.user ?? null
})

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/')
  }
}