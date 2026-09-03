'use server'

import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { documentSchema } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/features/notifications/actions'

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

    await createNotification(
      user.id,
      parsed.data.companyId || null,
      'document',
      `${parsed.data.type === 'orcamento' ? 'Orçamento' : parsed.data.type === 'proposta' ? 'Proposta' : 'Documento'} criado`,
      `O documento "${parsed.data.title || 'Sem título'}" foi criado.`,
      '/documents',
    )

    revalidatePath('/documents')
    return { success: true, data: document }
  } catch (error) {
    console.error('Create document error:', error)
    return { success: false, error: 'Ocorreu um erro' }
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

export async function getDashboardMetricsAction(): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const docQuery = await db.query.documents.findMany({
      where: and(eq(documents.userId, user.id), isNull(documents.deletedAt)),
    })
    const total = docQuery.length
    const byStatus = docQuery.reduce<Record<string, number>>((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byType = docQuery.reduce<Record<string, number>>((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Faturamento estimado: soma de todos os itens de orçamento/proposta
    const estimatedRevenue = docQuery
      .filter((d) => d.type === 'orcamento' || d.type === 'proposta')
      .reduce((sum, doc) => {
        const items = (doc.data as any)?.items || []
        const itemsTotal = items.reduce((acc: number, item: any) => {
          return acc + (Number(item.quantity || 1) * Number(item.unitPrice || 0))
        }, 0)
        return sum + itemsTotal
      }, 0)

    // Faturamento realizado: soma dos recibos
    const realizedRevenue = docQuery
      .filter((d) => d.type === 'recibo')
      .reduce((sum, doc) => {
        return sum + Number((doc.data as any)?.amount || 0)
      }, 0)

    // Evolução mensal (últimos 6 meses)
    const now = new Date()
    const monthlyRevenue: { month: string; receita: number; realizado: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      const monthDocs = docQuery.filter((doc) => {
        const created = new Date(doc.createdAt)
        return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear()
      })
      const receita = monthDocs
        .filter((d) => d.type === 'orcamento' || d.type === 'proposta')
        .reduce((sum, doc) => {
          const items = (doc.data as any)?.items || []
          return sum + items.reduce((acc: number, item: any) => acc + (Number(item.quantity || 1) * Number(item.unitPrice || 0)), 0)
        }, 0)
      const realizado = monthDocs
        .filter((d) => d.type === 'recibo')
        .reduce((sum, doc) => sum + Number((doc.data as any)?.amount || 0), 0)
      monthlyRevenue.push({ month: monthLabel, receita, realizado })
    }

    return {
      success: true,
      data: {
        total,
        byStatus,
        byType,
        estimatedRevenue,
        realizedRevenue,
        monthlyRevenue,
      },
    }
  } catch (error) {
    console.error('Get dashboard metrics error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}