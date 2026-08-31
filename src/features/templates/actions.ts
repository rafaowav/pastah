'use server'

import { db } from '@/lib/db'
import { templates } from '@/lib/db/schema'
import { templateSchema } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type ActionState<T> = 
  | { success: true; data: T }
  | { success: false; error: string; errors?: Record<string, string[]> }

export async function createTemplateAction(input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = templateSchema.safeParse(input)
    
    if (!parsed.success) {
      return { success: false, error: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const [template] = await db.insert(templates).values({
      userId: user.id,
      ...parsed.data,
      config: parsed.data.config || {},
      isGlobal: parsed.data.isGlobal || 'false',
    }).returning()

    revalidatePath('/templates')
    return { success: true, data: template }
  } catch (error) {
    console.error('Create template error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function getTemplatesAction(): Promise<ActionState<any[]>> {
  try {
    const user = await requireAuth()
    const userTemplates = await db.query.templates.findMany({
      where: and(eq(templates.userId, user.id), isNull(templates.deletedAt)),
      orderBy: (templates, { desc }) => [desc(templates.createdAt)],
    })
    return { success: true, data: userTemplates }
  } catch (error) {
    console.error('Get templates error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function getTemplateByIdAction(id: string): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const template = await db.query.templates.findFirst({
      where: and(eq(templates.id, id), eq(templates.userId, user.id), isNull(templates.deletedAt)),
    })
    if (!template) return { success: false, error: 'Template not found' }
    return { success: true, data: template }
  } catch (error) {
    console.error('Get template error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function updateTemplateAction(id: string, input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = templateSchema.safeParse(input)
    
    if (!parsed.success) {
      return { success: false, error: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const existing = await db.query.templates.findFirst({
      where: and(eq(templates.id, id), eq(templates.userId, user.id), isNull(templates.deletedAt)),
    })

    if (!existing) return { success: false, error: 'Template not found' }

    const [updated] = await db.update(templates)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(templates.id, id), eq(templates.userId, user.id)))
      .returning()

    revalidatePath('/templates')
    revalidatePath(`/templates/${id}`)
    return { success: true, data: updated }
  } catch (error) {
    console.error('Update template error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function deleteTemplateAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()
    const existing = await db.query.templates.findFirst({
      where: and(eq(templates.id, id), eq(templates.userId, user.id), isNull(templates.deletedAt)),
    })

    if (!existing) return { success: false, error: 'Template not found' }

    await db.update(templates)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(templates.id, id), eq(templates.userId, user.id)))

    revalidatePath('/templates')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Delete template error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}
