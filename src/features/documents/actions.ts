'use server'

import { db } from '@/lib/db'
import { documents, documentRelations, companies, clients } from '@/lib/db/schema'
import { documentSchema } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull, inArray, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/features/notifications/actions'
import { ActionState, zodFieldErrors } from '@/lib/action-result'
import { devLog, devError, friendlyDbError } from '@/lib/dev-log'
import {
  reaisToCents,
  normalizeOperationalStatus,
  DOCUMENT_RELATION_TYPES,
  FINANCIAL_SOURCE_TYPES,
} from '@/lib/document-status'
import type { DocumentRow } from './data'

async function getDocumentRow(id: string, userId: string) {
  return db.query.documents.findFirst({
    where: and(eq(documents.id, id), eq(documents.userId, userId), isNull(documents.deletedAt)),
  })
}

/**
 * Valida que companyId (quando informado) pertence ao usuário.
 * Retorna erro seguro quando inválido.
 */
async function assertCompanyOwnership(
  companyId: string | null | undefined,
  userId: string,
): Promise<string | null> {
  if (!companyId) return null
  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, companyId), eq(companies.userId, userId), isNull(companies.deletedAt)),
    columns: { id: true },
  })
  return company ? null : 'Empresa inválida ou não pertence a você.'
}

/**
 * Valida que clientId (quando informado) pertence ao usuário.
 */
async function assertClientOwnership(
  clientId: string | null | undefined,
  userId: string,
): Promise<string | null> {
  if (!clientId) return null
  const client = await db.query.clients.findFirst({
    where: and(eq(clients.id, clientId), eq(clients.userId, userId), isNull(clients.deletedAt)),
    columns: { id: true },
  })
  return client ? null : 'Cliente inválido ou não pertence a você.'
}

/** Extrai o total em centavos do payload tipado (data JSONB ou totalAmount explícito). */
function computeTotalAmountCents(input: {
  totalAmount?: number | null
  data?: Record<string, unknown>
}): number {
    if (typeof input.totalAmount === 'number' && Number.isFinite(input.totalAmount)) {
      return Math.max(0, Math.round(input.totalAmount))
    }
    const data: Record<string, unknown> = input.data ?? {}
    // Recibo usa `amount` (reais); demais usam items com quantity/unitPrice
    if (typeof data.amount !== 'undefined') {
      const raw: unknown = data.amount
      const num = typeof raw === 'string' ? Number(raw) : (raw as number)
      return Number.isFinite(num) ? Math.max(0, reaisToCents(num)) : 0
    }
    const items = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : []
    let total = 0
    for (const item of items) {
      const qty = Number(item?.quantity ?? 1) || 0
      const price = Number(item?.unitPrice ?? 0) || 0
      const discount = Number(item?.discountPercent ?? 0) || 0
      total += qty * price * (1 - discount / 100)
    }
    const descontoTotal = Number(data.descontoTotal ?? 0) || 0
    return Math.max(0, Math.round((total - descontoTotal) * 100))
}

function revalidateDocumentPaths(id?: string) {
  revalidatePath('/documents')
  revalidatePath('/dashboard')
  if (id) revalidatePath(`/documents/${id}`)
}

export async function createDocumentAction(input: unknown): Promise<ActionState<DocumentRow>> {
  try {
    const user = await requireAuth()
    const rawInput = (typeof input === 'object' && input !== null ? input : {}) as {
      type?: unknown
      title?: unknown
    }
    devLog('documents.create', 'payload recebido', {
      type: typeof rawInput.type === 'string' ? rawInput.type : undefined,
      title: typeof rawInput.title === 'string' ? rawInput.title : undefined,
    })

    const parsed = documentSchema.safeParse(input)
    if (!parsed.success) {
      devLog('documents.create', 'validação Zod falhou', parsed.error.issues)
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const { relatedDocumentIds, relationType, ...payload } = parsed.data

    const companyError = await assertCompanyOwnership(payload.companyId, user.id)
    if (companyError) return { success: false, error: companyError }

    const clientError = await assertClientOwnership(payload.clientId, user.id)
    if (clientError) return { success: false, error: clientError }

    const status = normalizeOperationalStatus(payload.status)
    const totalAmountCents = computeTotalAmountCents(payload)

    const [document] = await db
      .insert(documents)
      .values({
        userId: user.id,
        companyId: payload.companyId || null,
        clientId: payload.clientId || null,
        type: payload.type,
        title: payload.title,
        status,
        data: payload.data,
        templateId: payload.templateId || null,
        isFavorite: payload.isFavorite || 'false',
        totalAmount: totalAmountCents,
        receivedAmount: 0,
        paymentStatus: 'pendente',
        receivedAt: null,
        completedAt: null,
      })
      .returning()

    // Vínculos com documentos de origem (ex: recibo de um orçamento)
    if (relatedDocumentIds && relatedDocumentIds.length > 0) {
      const targetIds = relatedDocumentIds.filter((tid) => tid !== document.id)
      if (targetIds.length > 0) {
        const targets = await db.query.documents.findMany({
          where: and(
            inArray(documents.id, targetIds),
            eq(documents.userId, user.id),
            isNull(documents.deletedAt),
          ),
          columns: { id: true },
        })
        if (targets.length !== targetIds.length) {
          return {
            success: false,
            error: 'Algum documento relacionado não foi encontrado ou não pertence a você.',
          }
        }
        const relation = (relationType ?? 'recibo_de') as string
        if (!(DOCUMENT_RELATION_TYPES as readonly string[]).includes(relation)) {
          return { success: false, error: 'Tipo de relação inválido.' }
        }
        await db.insert(documentRelations).values(
          targetIds.map((targetDocumentId) => ({
            sourceDocumentId: document.id,
            targetDocumentId,
            relationType: relation,
          })),
        )

        // Regra financeira: um recibo vinculado marca a origem como recebida
        if (payload.type === 'recibo' && relation === 'recibo_de' && totalAmountCents > 0) {
          for (const target of targets) {
            const origin = await getDocumentRow(target.id, user.id)
            if (!origin || origin.paymentStatus === 'recebido') continue
            await db
              .update(documents)
              .set({
                receivedAmount: origin.totalAmount,
                paymentStatus: 'recebido',
                receivedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(documents.id, origin.id))
          }
        }
      }
    }

    await createNotification(
      user.id,
      payload.companyId || null,
      'document',
      `${payload.type === 'orcamento' ? 'Orçamento' : payload.type === 'proposta' ? 'Proposta' : 'Documento'} criado`,
      `O documento "${payload.title}" foi criado.`,
      '/documents',
    )

    revalidateDocumentPaths(document.id)
    return { success: true, data: document as DocumentRow }
  } catch (error) {
    devError('documents.create', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getDocumentsAction(): Promise<ActionState<DocumentRow[]>> {
  try {
    const user = await requireAuth()
    const rows = await db.query.documents.findMany({
      where: and(eq(documents.userId, user.id), isNull(documents.deletedAt)),
      orderBy: (documents, { desc }) => [desc(documents.createdAt)],
    })
    return { success: true, data: rows as DocumentRow[] }
  } catch (error) {
    devError('documents.list', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getDocumentByIdAction(id: string): Promise<ActionState<DocumentRow>> {
  try {
    const user = await requireAuth()
    const row = await getDocumentRow(id, user.id)
    if (!row) return { success: false, error: 'Documento não encontrado.' }
    return { success: true, data: row as DocumentRow }
  } catch (error) {
    devError('documents.get', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function updateDocumentAction(
  id: string,
  input: unknown,
): Promise<ActionState<DocumentRow>> {
  try {
    const user = await requireAuth()
    devLog('documents.update', 'payload recebido', {
      id,
      title: typeof (input as { title?: unknown })?.title === 'string' ? (input as { title: string }).title : undefined,
    })

    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      return { success: false, error: 'Identificador de documento inválido.' }
    }

    const parsed = documentSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const existing = await getDocumentRow(id, user.id)
    if (!existing) return { success: false, error: 'Documento não encontrado.' }

    const { relatedDocumentIds: _relatedDocumentIds, relationType: _relationType, ...payload } = parsed.data

    const companyError = await assertCompanyOwnership(payload.companyId, user.id)
    if (companyError) return { success: false, error: companyError }

    const clientError = await assertClientOwnership(payload.clientId, user.id)
    if (clientError) return { success: false, error: clientError }

    const totalAmountCents = computeTotalAmountCents(payload)

    const [updated] = await db
      .update(documents)
      .set({
        companyId: payload.companyId || null,
        clientId: payload.clientId || null,
        type: payload.type,
        title: payload.title,
        status: normalizeOperationalStatus(payload.status),
        data: payload.data,
        templateId: payload.templateId || null,
        isFavorite: payload.isFavorite || 'false',
        totalAmount: totalAmountCents,
        updatedAt: new Date(),
      })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))
      .returning()

    revalidateDocumentPaths(id)
    return { success: true, data: updated as DocumentRow }
  } catch (error) {
    devError('documents.update', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function deleteDocumentAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()

    const existing = await getDocumentRow(id, user.id)
    if (!existing) return { success: false, error: 'Documento não encontrado.' }

    await db
      .update(documents)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))

    revalidateDocumentPaths()
    return { success: true, data: undefined }
  } catch (error) {
    devError('documents.delete', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

// ---------------------------------------------------------------------------
// Status operacional & financeiro
// ---------------------------------------------------------------------------

export async function finalizeDocumentAction(id: string): Promise<ActionState<DocumentRow>> {
  try {
    const user = await requireAuth()
    const existing = await getDocumentRow(id, user.id)
    if (!existing) return { success: false, error: 'Documento não encontrado.' }

    const [updated] = await db
      .update(documents)
      .set({ status: 'finalizado', completedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))
      .returning()

    revalidateDocumentPaths(id)
    return { success: true, data: updated as DocumentRow }
  } catch (error) {
    devError('documents.finalize', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function markDocumentReceivedAction(
  id: string,
  options?: { finalize?: boolean },
): Promise<ActionState<DocumentRow>> {
  try {
    const user = await requireAuth()
    const existing = await getDocumentRow(id, user.id)
    if (!existing) return { success: false, error: 'Documento não encontrado.' }

    if (existing.paymentStatus === 'cancelado') {
      return {
        success: false,
        error: 'Documento com pagamento cancelado não pode ser marcado como recebido.',
      }
    }

    const [updated] = await db
      .update(documents)
      .set({
        paymentStatus: 'recebido',
        receivedAmount: existing.totalAmount,
        receivedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))
      .returning()

    // Regra explícita e opt-in: só finaliza quando chamador pedir
    if (options?.finalize) {
      await db
        .update(documents)
        .set({ status: 'finalizado', completedAt: new Date(), updatedAt: new Date() })
        .where(and(eq(documents.id, id), eq(documents.userId, user.id)))
    }

    revalidateDocumentPaths(id)
    const finalRow = await getDocumentRow(id, user.id)
    return { success: true, data: (finalRow ?? updated) as DocumentRow }
  } catch (error) {
    devError('documents.receive', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function registerPartialPaymentAction(
  id: string,
  input: {
    amount: number
    receivedAt?: string
    paymentMethod?: string
    notes?: string
  },
): Promise<ActionState<DocumentRow>> {
  try {
    const user = await requireAuth()

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      return { success: false, error: 'Valor recebido deve ser maior que zero.', fieldErrors: { amount: ['Valor recebido deve ser maior que zero.'] } }
    }

    const existing = await getDocumentRow(id, user.id)
    if (!existing) return { success: false, error: 'Documento não encontrado.' }

    if (existing.paymentStatus === 'cancelado') {
      return { success: false, error: 'Documento com pagamento cancelado não aceita recebimentos.' }
    }

    const remaining = existing.totalAmount - existing.receivedAmount
    const amountCents = Math.round(input.amount * 100)
    if (amountCents > remaining) {
      return {
        success: false,
        error: `Valor ultrapassa o saldo pendente (${(remaining / 100).toFixed(2)}).`,
        fieldErrors: { amount: [`Valor ultrapassa o saldo pendente de R$ ${(remaining / 100).toFixed(2)}.`] },
      }
    }

    const newReceived = existing.receivedAmount + amountCents
    const fullyPaid = newReceived >= existing.totalAmount

    const receivedAt = input.receivedAt ? new Date(input.receivedAt) : new Date()
    if (Number.isNaN(receivedAt.getTime())) {
      return { success: false, error: 'Data de recebimento inválida.' }
    }

    // Observações e forma de pagamento são registradas no JSONB `data`
    const data = { ...(existing.data ?? {}) }
    const payments = Array.isArray(data.payments) ? [...data.payments] : []
    payments.push({
      amount: amountCents / 100,
      receivedAt: receivedAt.toISOString(),
      paymentMethod: input.paymentMethod || null,
      notes: input.notes || null,
    })
    data.payments = payments
    if (input.paymentMethod && !data.paymentMethod) data.paymentMethod = input.paymentMethod

    const [updated] = await db
      .update(documents)
      .set({
        receivedAmount: newReceived,
        paymentStatus: fullyPaid ? 'recebido' : 'parcialmente_recebido',
        receivedAt: fullyPaid ? receivedAt : existing.receivedAt,
        data,
        updatedAt: new Date(),
      })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))
      .returning()

    revalidateDocumentPaths(id)
    return { success: true, data: updated as DocumentRow }
  } catch (error) {
    devError('documents.partial', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function undoDocumentPaymentAction(id: string): Promise<ActionState<DocumentRow>> {
  try {
    const user = await requireAuth()
    const existing = await getDocumentRow(id, user.id)
    if (!existing) return { success: false, error: 'Documento não encontrado.' }

    if (existing.receivedAmount === 0) {
      return { success: false, error: 'Nenhum recebimento para desfazer.' }
    }

    const data = { ...(existing.data ?? {}) }
    delete data.payments

    const [updated] = await db
      .update(documents)
      .set({
        receivedAmount: 0,
        paymentStatus: 'pendente',
        receivedAt: null,
        data,
        updatedAt: new Date(),
      })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))
      .returning()

    revalidateDocumentPaths(id)
    return { success: true, data: updated as DocumentRow }
  } catch (error) {
    devError('documents.undo-payment', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function updateDocumentStatusAction(
  id: string,
  status: string,
): Promise<ActionState<DocumentRow>> {
  try {
    const user = await requireAuth()
    const normalized = normalizeOperationalStatus(status)
    if (normalized !== status) {
      // Se chegou um valor fora do enum, normalizeOperationalStatus degrada
      // para rascunho — nesse caso rejeitamos valores realmente inválidos.
      const valid = [
        'rascunho', 'enviado', 'aprovado', 'recusado', 'finalizado', 'arquivado',
      ]
      if (!valid.includes(status)) {
        return { success: false, error: 'Status inválido.' }
      }
    }

    const existing = await getDocumentRow(id, user.id)
    if (!existing) return { success: false, error: 'Documento não encontrado.' }

    const [updated] = await db
      .update(documents)
      .set({
        status: normalized,
        completedAt: normalized === 'finalizado' ? new Date() : existing.completedAt,
        updatedAt: new Date(),
      })
      .where(and(eq(documents.id, id), eq(documents.userId, user.id)))
      .returning()

    revalidateDocumentPaths(id)
    return { success: true, data: updated as DocumentRow }
  } catch (error) {
    devError('documents.status', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

// ---------------------------------------------------------------------------
// Documentos relacionados
// ---------------------------------------------------------------------------

export interface RelatedDocumentItem {
  relationId: string
  relationType: string
  direction: 'source' | 'target'
  document: {
    id: string
    type: string
    title: string
    status: string
    totalAmount: number
  }
}

export async function getRelatedDocumentsAction(
  documentId: string,
): Promise<ActionState<RelatedDocumentItem[]>> {
  try {
    const user = await requireAuth()
    const doc = await getDocumentRow(documentId, user.id)
    if (!doc) return { success: false, error: 'Documento não encontrado.' }

    const relations = await db.query.documentRelations.findMany({
      where: or(
        eq(documentRelations.sourceDocumentId, documentId),
        eq(documentRelations.targetDocumentId, documentId),
      ),
    })

    if (relations.length === 0) return { success: true, data: [] }

    const otherIds = relations.map((r) =>
      r.sourceDocumentId === documentId ? r.targetDocumentId : r.sourceDocumentId,
    )
    const others = await db.query.documents.findMany({
      where: and(inArray(documents.id, otherIds), eq(documents.userId, user.id), isNull(documents.deletedAt)),
    })

    const items: RelatedDocumentItem[] = relations
      .map((r) => {
        const isSource = r.sourceDocumentId === documentId
        const other = others.find((o) => o.id === (isSource ? r.targetDocumentId : r.sourceDocumentId))
        if (!other) return null
        return {
          relationId: r.id,
          relationType: r.relationType,
          direction: isSource ? ('source' as const) : ('target' as const),
          document: {
            id: other.id,
            type: other.type,
            title: other.title,
            status: other.status,
            totalAmount: other.totalAmount,
          },
        }
      })
      .filter((x): x is RelatedDocumentItem => x !== null)

    return { success: true, data: items }
  } catch (error) {
    devError('documents.related', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getLinkableDocumentsAction(): Promise<
  ActionState<{ id: string; type: string; title: string; totalAmount: number; clientId: string | null }[]>
> {
  try {
    const user = await requireAuth()
    const rows = await db.query.documents.findMany({
      where: and(
        eq(documents.userId, user.id),
        isNull(documents.deletedAt),
        inArray(documents.type, [...FINANCIAL_SOURCE_TYPES]),
      ),
      columns: { id: true, type: true, title: true, totalAmount: true, clientId: true },
      orderBy: (documents, { desc }) => [desc(documents.createdAt)],
      limit: 100,
    })
    return { success: true, data: rows }
  } catch (error) {
    devError('documents.linkable', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function createDocumentRelationAction(
  sourceDocumentId: string,
  targetDocumentId: string,
  relationType: string,
): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()

    if (!(DOCUMENT_RELATION_TYPES as readonly string[]).includes(relationType)) {
      return { success: false, error: 'Tipo de relação inválido.' }
    }
    if (sourceDocumentId === targetDocumentId) {
      return { success: false, error: 'Um documento não pode se relacionar consigo mesmo.' }
    }

    const [source, target] = await Promise.all([
      getDocumentRow(sourceDocumentId, user.id),
      getDocumentRow(targetDocumentId, user.id),
    ])
    if (!source || !target) {
      return { success: false, error: 'Documento de origem ou destino não encontrado.' }
    }

    const duplicate = await db.query.documentRelations.findFirst({
      where: and(
        eq(documentRelations.sourceDocumentId, sourceDocumentId),
        eq(documentRelations.targetDocumentId, targetDocumentId),
        eq(documentRelations.relationType, relationType),
      ),
    })
    if (duplicate) {
      return { success: false, error: 'Esta relação já existe.' }
    }

    await db.insert(documentRelations).values({
      sourceDocumentId,
      targetDocumentId,
      relationType,
    })

    revalidateDocumentPaths(sourceDocumentId)
    revalidateDocumentPaths(targetDocumentId)
    return { success: true, data: undefined }
  } catch (error) {
    devError('documents.relation', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

// ---------------------------------------------------------------------------
// Métricas do dashboard (mantida por compatibilidade; queries.ts é a fonte)
// ---------------------------------------------------------------------------

export async function getDashboardMetricsAction(): Promise<ActionState<{
  total: number
  byStatus: Record<string, number>
  byType: Record<string, number>
  estimatedRevenue: number
  realizedRevenue: number
  monthlyRevenue: { month: string; receita: number; realizado: number }[]
}>> {
  try {
    const user = await requireAuth()
    const rows = await db.query.documents.findMany({
      where: and(eq(documents.userId, user.id), isNull(documents.deletedAt)),
    })

    const byStatus = rows.reduce<Record<string, number>>((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1
      return acc
    }, {})
    const byType = rows.reduce<Record<string, number>>((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1
      return acc
    }, {})

    const estimatedRevenue = rows
      .filter((d) => d.type === 'orcamento' || d.type === 'proposta')
      .reduce((sum, d) => sum + d.totalAmount / 100, 0)

    const realizedRevenue = rows
      .filter((d) => d.paymentStatus === 'recebido' || d.paymentStatus === 'parcialmente_recebido')
      .reduce((sum, d) => sum + d.receivedAmount / 100, 0)

    return {
      success: true,
      data: { total: rows.length, byStatus, byType, estimatedRevenue, realizedRevenue, monthlyRevenue: [] },
    }
  } catch (error) {
    devError('documents.metrics', error)
    return { success: false, error: friendlyDbError(error) }
  }
}
