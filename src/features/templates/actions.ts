'use server'

import { db } from '@/lib/db'
import { templates } from '@/lib/db/schema'
import { templateSchema } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { ActionState, zodFieldErrors } from '@/lib/action-result'
import { devLog, devError, friendlyDbError, extractName } from '@/lib/dev-log'
import type { Template } from './types'

function revalidateTemplatePaths(id?: string) {
  revalidatePath('/templates')
  if (id) revalidatePath(`/templates/${id}`)
}

export async function createTemplateAction(input: unknown): Promise<ActionState<Template>> {
  try {
    const user = await requireAuth()
    devLog('templates.create', 'payload recebido', { name: extractName(input) })

    const parsed = templateSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const [template] = await db
      .insert(templates)
      .values({
        userId: user.id,
        documentType: parsed.data.documentType,
        name: parsed.data.name,
        config: parsed.data.config ?? {},
        isGlobal: parsed.data.isGlobal || 'false',
      })
      .returning()

    revalidateTemplatePaths(template.id)
    return { success: true, data: template }
  } catch (error) {
    devError('templates.create', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getTemplatesAction(): Promise<ActionState<Template[]>> {
  try {
    const user = await requireAuth()
    const rows = await db.query.templates.findMany({
      where: and(eq(templates.userId, user.id), isNull(templates.deletedAt)),
      orderBy: (templates, { desc }) => [desc(templates.createdAt)],
    })
    return { success: true, data: rows }
  } catch (error) {
    devError('templates.list', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getTemplateByIdAction(id: string): Promise<ActionState<Template>> {
  try {
    const user = await requireAuth()
    const template = await db.query.templates.findFirst({
      where: and(eq(templates.id, id), eq(templates.userId, user.id), isNull(templates.deletedAt)),
    })
    if (!template) return { success: false, error: 'Template não encontrado.' }
    return { success: true, data: template }
  } catch (error) {
    devError('templates.get', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function updateTemplateAction(id: string, input: unknown): Promise<ActionState<Template>> {
  try {
    const user = await requireAuth()
    devLog('templates.update', 'payload recebido', { id, name: extractName(input) })

    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      return { success: false, error: 'Identificador de template inválido.' }
    }

    const parsed = templateSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const existing = await db.query.templates.findFirst({
      where: and(eq(templates.id, id), eq(templates.userId, user.id), isNull(templates.deletedAt)),
    })
    if (!existing) return { success: false, error: 'Template não encontrado.' }

    const [updated] = await db
      .update(templates)
      .set({
        documentType: parsed.data.documentType,
        name: parsed.data.name,
        config: parsed.data.config ?? {},
        isGlobal: parsed.data.isGlobal || 'false',
        updatedAt: new Date(),
      })
      .where(and(eq(templates.id, id), eq(templates.userId, user.id)))
      .returning()

    revalidateTemplatePaths(id)
    return { success: true, data: updated }
  } catch (error) {
    devError('templates.update', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function deleteTemplateAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()
    const existing = await db.query.templates.findFirst({
      where: and(eq(templates.id, id), eq(templates.userId, user.id), isNull(templates.deletedAt)),
    })
    if (!existing) return { success: false, error: 'Template não encontrado.' }

    await db
      .update(templates)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(templates.id, id), eq(templates.userId, user.id)))

    revalidateTemplatePaths()
    return { success: true, data: undefined }
  } catch (error) {
    devError('templates.delete', error)
    return { success: false, error: friendlyDbError(error) }
  }
}
