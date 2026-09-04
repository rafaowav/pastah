import { db } from '@/lib/db'
import { documents, clients, companies } from '@/lib/db/schema'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull, desc } from 'drizzle-orm'
import { getActiveCompanyIdFromCookie } from '@/features/companies/active-company'
import {
  DashboardData,
  DashboardDocument,
  DashboardMetrics,
} from './types'
import { normalizeOperationalStatus } from '@/lib/document-status'

export async function getDashboardData(): Promise<DashboardData> {
  const user = await requireAuth()

  const userCompanies = await db.query.companies.findMany({
    where: and(eq(companies.userId, user.id), isNull(companies.deletedAt)),
    orderBy: (companies, { asc }) => [asc(companies.createdAt)],
  })

  const hasCompanies = userCompanies.length > 0

  // Prefer the cookie-selected company; fall back to the first registered
  const cookieCompanyId = await getActiveCompanyIdFromCookie()
  const companyId =
    cookieCompanyId && userCompanies.some((c) => c.id === cookieCompanyId)
      ? cookieCompanyId
      : (userCompanies[0]?.id ?? null)

  if (!companyId) {
    return {
      company: null,
      documents: [],
      metrics: {
        estimatedRevenueCents: 0,
        receivedRevenueCents: 0,
        pendingAmountCents: 0,
        partiallyReceivedAmountCents: 0,
        receivableRate: 0,
        finalizedCount: 0,
        totalDocuments: 0,
        activeClients: 0,
        byStatus: {},
        byPaymentStatus: {},
        byType: {},
        monthlyRevenue: [],
      },
      hasCompanies,
    }
  }

  // Fetch docs + clients scoped to the active company
  const [docRows, clientRows] = await Promise.all([
    db.query.documents.findMany({
      where: and(eq(documents.companyId, companyId), isNull(documents.deletedAt)),
      orderBy: [desc(documents.createdAt)],
    }),
    db.query.clients.findMany({
      where: and(eq(clients.userId, user.id), isNull(clients.deletedAt)),
    }),
  ])

  const clientMap = new Map<string, string>()
  for (const c of clientRows) {
    clientMap.set(c.id, c.name)
  }

  const docs: DashboardDocument[] = docRows.map((doc) => ({
    id: doc.id,
    type: doc.type,
    title: doc.title,
    status: normalizeOperationalStatus(doc.status),
    paymentStatus: doc.paymentStatus,
    clientId: doc.clientId,
    clientName: doc.clientId ? clientMap.get(doc.clientId) ?? null : null,
    createdAt: doc.createdAt,
    totalAmountCents: doc.totalAmount,
    receivedAmountCents: doc.receivedAmount,
    data: doc.data as Record<string, unknown>,
  }))

  const metrics = computeMetrics(docs, clientRows.length)

  const company = userCompanies.find((c) => c.id === companyId)
  const companyOut = company
    ? { id: company.id, name: company.name, document: company.document ?? null }
    : null

  return { company: companyOut, documents: docs, metrics, hasCompanies }
}

/**
 * Regras do dashboard (exibidas na interface):
 * - Faturamento estimado: totalAmount de orçamentos e propostas NÃO arquivados
 *   e NÃO recusados.
 * - Faturamento recebido: receivedAmount de documentos com paymentStatus
 *   `recebido` ou `parcialmente_recebido`.
 */
function computeMetrics(docs: DashboardDocument[], activeClients: number): DashboardMetrics {
  const byStatus: Record<string, number> = {}
  const byPaymentStatus: Record<string, number> = {}
  const byType: Record<string, number> = {}
  let estimatedRevenueCents = 0
  let receivedRevenueCents = 0
  let pendingAmountCents = 0
  let partiallyReceivedAmountCents = 0
  let finalizedCount = 0

  for (const doc of docs) {
    byStatus[doc.status] = (byStatus[doc.status] || 0) + 1
    byPaymentStatus[doc.paymentStatus] = (byPaymentStatus[doc.paymentStatus] || 0) + 1
    byType[doc.type] = (byType[doc.type] || 0) + 1

    if (doc.status === 'finalizado') finalizedCount++

    const isFinancialSource = doc.type === 'orcamento' || doc.type === 'proposta'
    if (isFinancialSource && doc.status !== 'arquivado' && doc.status !== 'recusado') {
      estimatedRevenueCents += doc.totalAmountCents
    }

    if (doc.paymentStatus === 'recebido' || doc.paymentStatus === 'parcialmente_recebido') {
      receivedRevenueCents += doc.receivedAmountCents
    }
    if (doc.paymentStatus === 'parcialmente_recebido') {
      partiallyReceivedAmountCents += doc.totalAmountCents - doc.receivedAmountCents
    }
    if (
      doc.paymentStatus === 'pendente' &&
      isFinancialSource &&
      doc.status !== 'arquivado' &&
      doc.status !== 'recusado'
    ) {
      pendingAmountCents += doc.totalAmountCents
    }
  }

  // Mensal (últimos 6 meses): estimado vs recebido vs pendente
  const now = new Date()
  const monthlyRevenue: DashboardMetrics['monthlyRevenue'] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('pt-BR', { month: 'short' })
    let orcado = 0
    let recebido = 0
    for (const doc of docs) {
      const created = new Date(doc.createdAt)
      if (created.getMonth() !== d.getMonth() || created.getFullYear() !== d.getFullYear()) continue
      const isFinancialSource = doc.type === 'orcamento' || doc.type === 'proposta'
      if (isFinancialSource && doc.status !== 'arquivado' && doc.status !== 'recusado') {
        orcado += doc.totalAmountCents
      }
      if (doc.paymentStatus === 'recebido' || doc.paymentStatus === 'parcialmente_recebido') {
        recebido += doc.receivedAmountCents
      }
    }
    monthlyRevenue.push({
      month: label,
      orcadoCents: orcado,
      recebidoCents: recebido,
      pendenteCents: Math.max(0, orcado - recebido),
    })
  }

  const receivableRate =
    estimatedRevenueCents > 0
      ? Math.round((receivedRevenueCents / estimatedRevenueCents) * 100)
      : 0

  return {
    estimatedRevenueCents,
    receivedRevenueCents,
    pendingAmountCents,
    partiallyReceivedAmountCents,
    receivableRate,
    finalizedCount,
    totalDocuments: docs.length,
    activeClients,
    byStatus,
    byPaymentStatus,
    byType,
    monthlyRevenue,
  }
}
