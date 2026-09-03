'use server'

import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { companies } from '@/lib/db/schema'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const ACTIVE_COMPANY_COOKIE = 'pastah_active_company'

export async function setActiveCompanyAction(companyId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireAuth()

    // Validate ownership: company must belong to the authenticated user
    const company = await db.query.companies.findFirst({
      where: and(
        eq(companies.id, companyId),
        eq(companies.userId, user.id),
        isNull(companies.deletedAt),
      ),
    })

    if (!company) {
      return { success: false, error: 'Empresa não encontrada ou sem permissão' }
    }

    const cookieStore = await cookies()
    cookieStore.set(ACTIVE_COMPANY_COOKIE, companyId, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/documents')

    return { success: true }
  } catch (error) {
    console.error('Set active company error:', error)
    return { success: false, error: 'Erro ao alterar empresa ativa' }
  }
}

export async function getActiveCompanyIdFromCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const companyId = cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value ?? null
    if (!companyId) return null

    // Validate it still belongs to the user
    const user = await requireAuth()
    const company = await db.query.companies.findFirst({
      where: and(
        eq(companies.id, companyId),
        eq(companies.userId, user.id),
        isNull(companies.deletedAt),
      ),
      columns: { id: true },
    })

    return company?.id ?? null
  } catch {
    return null
  }
}