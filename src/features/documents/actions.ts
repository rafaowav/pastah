'use server'

import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { documentSchema } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type ActionState<T> = 
  | { success: true; data: T }
  | { success: false; error: string; errors?: Record<string, string[]> }

export async function createDocumentAction(input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = documentSchema.safeParse(input)
    
    if (!parsed.success) {
      return { success: false, error: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const [document] = await db.insert(documents).values({
      userId: user.id,
      ...parsed.data,
      status: parsed.data.status || 'draft',
      isFavorite: parsed.data.isFavorite || 'false',
    }).returning()

    revalidatePath('/documents')
    return { success: true, data: document }
  } catch (error) {
    console.error('Create document error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function getDocumentsAction(): Promise<ActionState<any[]>> {
  try {
    const user = await requireAuth()
    const userDocuments = await db.query.documents.findMany({
      where: and(eq(documents.userId, user.id), isNull(documents.deletedAt)),
      orderBy: (documents, { desc }) => [desc(documents.createdAt)],
    })
    return { success: true, data: userDocuments }
  } catch (error) {
    console.error('Get documents error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function getDocumentByIdAction(id: string): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const document = await db.query.documents.findFirst({
      where: and(eq(documents.id, id), eq(documents.userId, user.id), isNull(documents.deletedAt)),
    })
    if (!document) return { success: false, error: 'Document not found' }
    return { success: true, data: document }
  } catch (error) {
    console.error('Get document error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function updateDocumentAction(id: string, input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = documentSchema.safeParse(input)
    
    if (!parsed.success) {
      return { success: false, error: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const existing = await db.query.documents.findFirst({
      where: and(eq(documents.id, id), eq(documents.userId, user.id), isNull(documents.deletedAt)),
    })

    if (!existing) return { success: false, error: 'Document not found' }

    const [updated] = await db.update(documents)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))
      .returning()

    revalidatePath('/documents')
    revalidatePath(`/documents/${id}`)
    return { success: true, data: updated }
  } catch (error) {
    console.error('Update document error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function deleteDocumentAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()
    const existing = await db.query.documents.findFirst({
      where: and(eq(documents.id, id), eq(documents.userId, user.id), isNull(documents.deletedAt)),
    })

    if (!existing) return { success: false, error: 'Document not found' }

    await db.update(documents)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))

    revalidatePath('/documents')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Delete document error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}
