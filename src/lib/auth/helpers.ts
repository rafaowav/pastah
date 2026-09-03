import { auth } from './index'
import { redirect } from 'next/navigation'

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  image?: string | null
}

export const getCurrentUser = async (): Promise<AuthenticatedUser | null> => {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return null
  }
  return {
    id: session.user.id,
    name: session.user.name ?? 'User',
    email: session.user.email,
    image: session.user.image ?? null,
  }
}

export async function requireAuth(): Promise<AuthenticatedUser> {
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
