'use server'

import { db } from '@/lib/db'
import { companies } from '@/lib/db/schema'
import { companySchema, CompanyInput } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/features/notifications/actions'

export type ActionState<T> = 
  | { success: true; data: T }
  | { success: false; error: string; errors?: Record<string, string[]> }

export async function createCompanyAction(input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = companySchema.safeParse(input)
    
    if (!parsed.success) {
      return { 
        success: false, 
        error: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors 
      }
    }

    const [company] = await db.insert(companies).values({
      userId: user.id,
      ...parsed.data,
    }).returning()

    await createNotification(
      user.id,
      company.id,
      'company',
      'Empresa cadastrada',
      `A empresa "${company.name}" foi cadastrada com sucesso.`,
      '/companies',
    )

    revalidatePath('/companies')
    return { success: true, data: company }
  } catch (error) {
    console.error('Create company error:', error)
    return { 
      success: false, 
      error: 'Ocorreu um erro' 
    }
  }
}

export async function getCompaniesAction(): Promise<ActionState<any[]>> {
  try {
    const user = await requireAuth()

    const userCompanies = await db.query.companies.findMany({
      where: and(
        eq(companies.userId, user.id),
        isNull(companies.deletedAt)
      ),
      orderBy: (companies, { desc }) => [desc(companies.createdAt)],
    })

    return { success: true, data: userCompanies }
  } catch (error) {
    console.error('Get companies error:', error)
    return { 
      success: false, 
      error: 'Something went wrong' 
    }
  }
}

export async function getCompanyByIdAction(id: string): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()

    const company = await db.query.companies.findFirst({
      where: and(
        eq(companies.id, id),
        eq(companies.userId, user.id),
        isNull(companies.deletedAt)
      ),
    })

    if (!company) {
      return { 
        success: false, 
        error: 'Company not found' 
      }
    }

    return { success: true, data: company }
  } catch (error) {
    console.error('Get company error:', error)
    return { 
      success: false, 
      error: 'Something went wrong' 
    }
  }
}

export async function updateCompanyAction(id: string, input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()

    const parsed = companySchema.safeParse(input)
    
    if (!parsed.success) {
      return { 
        success: false, 
        error: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors 
      }
    }

    const existing = await db.query.companies.findFirst({
      where: and(
        eq(companies.id, id),
        eq(companies.userId, user.id),
        isNull(companies.deletedAt)
      ),
    })

    if (!existing) {
      return { 
        success: false, 
        error: 'Company not found' 
      }
    }

    const [updated] = await db.update(companies)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(and(
        eq(companies.id, id),
        eq(companies.userId, user.id)
      ))
      .returning()

    revalidatePath('/companies')
    revalidatePath(`/companies/${id}`)

    return { success: true, data: updated }
  } catch (error) {
    console.error('Update company error:', error)
    return { 
      success: false, 
      error: 'Something went wrong' 
    }
  }
}

export async function deleteCompanyAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()

    const existing = await db.query.companies.findFirst({
      where: and(
        eq(companies.id, id),
        eq(companies.userId, user.id),
        isNull(companies.deletedAt)
      ),
    })

    if (!existing) {
      return { 
        success: false, 
        error: 'Company not found' 
      }
    }

    await db.update(companies)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(
        eq(companies.id, id),
        eq(companies.userId, user.id)
      ))

    revalidatePath('/companies')

    return { success: true, data: undefined }
  } catch (error) {
    console.error('Delete company error:', error)
    return { 
      success: false, 
      error: 'Something went wrong' 
    }
  }
}