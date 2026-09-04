'use server'

import { db } from '@/lib/db'
import { companies } from '@/lib/db/schema'
import { companySchema } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/features/notifications/actions'
import { ActionState, zodFieldErrors } from '@/lib/action-result'
import { devLog, devError, friendlyDbError } from '@/lib/dev-log'
import type { Company } from './types'

function revalidateCompanyPaths(id?: string) {
  revalidatePath('/companies')
  revalidatePath('/dashboard')
  if (id) revalidatePath(`/companies/${id}`)
}

export async function createCompanyAction(input: unknown): Promise<ActionState<Company>> {
  try {
    const user = await requireAuth()
    devLog('companies.create', 'payload recebido', {
      name: typeof (input as { name?: unknown })?.name === 'string' ? (input as { name: string }).name : undefined,
    })

    const parsed = companySchema.safeParse(input)
    if (!parsed.success) {
      devLog('companies.create', 'validação Zod falhou', parsed.error.issues)
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const [company] = await db
      .insert(companies)
      .values({
        userId: user.id,
        name: parsed.data.name,
        document: parsed.data.document || null,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        website: parsed.data.website || null,
        address: parsed.data.address ?? null,
        settings: parsed.data.settings ?? null,
      })
      .returning()

    await createNotification(
      user.id,
      company.id,
      'company',
      'Empresa cadastrada',
      `A empresa "${company.name}" foi cadastrada com sucesso.`,
      '/companies',
    )

    revalidateCompanyPaths(company.id)
    return { success: true, data: company }
  } catch (error) {
    devError('companies.create', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getCompaniesAction(): Promise<ActionState<Company[]>> {
  try {
    const user = await requireAuth()

    const userCompanies = await db.query.companies.findMany({
      where: and(eq(companies.userId, user.id), isNull(companies.deletedAt)),
      orderBy: (companies, { desc }) => [desc(companies.createdAt)],
    })

    return { success: true, data: userCompanies }
  } catch (error) {
    devError('companies.list', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getCompanyByIdAction(id: string): Promise<ActionState<Company>> {
  try {
    const user = await requireAuth()

    const company = await db.query.companies.findFirst({
      where: and(eq(companies.id, id), eq(companies.userId, user.id), isNull(companies.deletedAt)),
    })

    if (!company) {
      return { success: false, error: 'Empresa não encontrada.' }
    }

    return { success: true, data: company }
  } catch (error) {
    devError('companies.get', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function updateCompanyAction(id: string, input: unknown): Promise<ActionState<Company>> {
  try {
    const user = await requireAuth()
    devLog('companies.update', 'payload recebido', {
      id,
      name: typeof (input as { name?: unknown })?.name === 'string' ? (input as { name: string }).name : undefined,
    })

    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      return { success: false, error: 'Identificador de empresa inválido.' }
    }

    const parsed = companySchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    // Ownership: a empresa precisa pertencer ao usuário autenticado
    const existing = await db.query.companies.findFirst({
      where: and(eq(companies.id, id), eq(companies.userId, user.id), isNull(companies.deletedAt)),
    })

    if (!existing) {
      return { success: false, error: 'Empresa não encontrada.' }
    }

    const [updated] = await db
      .update(companies)
      .set({
        name: parsed.data.name,
        document: parsed.data.document || null,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        website: parsed.data.website || null,
        address: parsed.data.address ?? null,
        settings: parsed.data.settings ?? null,
        updatedAt: new Date(),
      })
      .where(and(eq(companies.id, id), eq(companies.userId, user.id)))
      .returning()

    revalidateCompanyPaths(id)
    return { success: true, data: updated }
  } catch (error) {
    devError('companies.update', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function deleteCompanyAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()

    const existing = await db.query.companies.findFirst({
      where: and(eq(companies.id, id), eq(companies.userId, user.id), isNull(companies.deletedAt)),
    })

    if (!existing) {
      return { success: false, error: 'Empresa não encontrada.' }
    }

    await db
      .update(companies)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(companies.id, id), eq(companies.userId, user.id)))

    revalidateCompanyPaths()
    return { success: true, data: undefined }
  } catch (error) {
    devError('companies.delete', error)
    return { success: false, error: friendlyDbError(error) }
  }
}
