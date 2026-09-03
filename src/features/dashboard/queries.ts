import { db } from '@/lib/db'
import { documents, clients, companies } from '@/lib/db/schema'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { getActiveCompanyIdFromCookie } from '@/features/companies/active-company'
import {
  DashboardData,
  DashboardDocument,
  DashboardMetrics,
} from './types'

export async function getActiveCompanyId(): Promise<string | null> {
  const user = await requireAuth()
  const rows = await db.query.companies.findMany({
    where: and(eq(companies.userId, user.id), isNull(companies.deletedAt)),
    columns: { id: true },
    orderBy: (companies, { asc }) => [asc(companies.createdAt)],
    limit: 1,
  })
  return rows[0]?.id ?? null
}

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
        estimatedRevenue: 0,
        realizedRevenue: 0,
        totalDocuments: 0,
        activeClients: 0,
        byStatus: {},
        byType: {},
        monthlyRevenue: [],
      },
      hasCompanies,
    }
  }

  // Fetch docs + clients scoped to the company
  const [docRows, clientRows] = await Promise.all([
    db.query.documents.findMany({
      where: and(eq(documents.companyId, companyId), isNull(documents.deletedAt)),
      orderBy: (documents, { desc }) => [desc(documents.createdAt)],
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
    status: doc.status,
    clientId: doc.clientId,
    clientName: doc.clientId ? clientMap.get(doc.clientId) ?? null : null,
    createdAt: doc.createdAt,
    data: doc.data as Record<string, any>,
  }))

  const metrics = computeMetrics(docs, clientRows.length)

  const company = userCompanies.find((c) => c.id === companyId)
  const companyOut = company
    ? { id: company.id, name: company.name, document: company.document ?? null }
    : null

  return { company: companyOut, documents: docs, metrics, hasCompanies }
}

function computeMetrics(docs: DashboardDocument[], activeClients: number): DashboardMetrics {
  const byStatus: Record<string, number> = {}
  const byType: Record<string, number> = {}
  let estimatedRevenue = 0
  let realizedRevenue = 0

  for (const doc of docs) {
    byStatus[doc.status] = (byStatus[doc.status] || 0) + 1
    byType[doc.type] = (byType[doc.type] || 0) + 1

    if (doc.type === 'recibo') {
      realizedRevenue += Number(doc.data?.amount || 0)
    } else if (doc.type === 'orcamento' || doc.type === 'proposta') {
      const items = doc.data?.items || []
      for (const item of items) {
        const qty = Number(item?.quantity || 1)
        const price = Number(item?.unitPrice || 0)
        const discount = Number(item?.discountPercent || 0)
        estimatedRevenue += qty * price * (1 - discount / 100)
      }
      const descontoGeral = Number(doc.data?.descontoTotal || 0)
      if (doc.type === 'orcamento') estimatedRevenue -= descontoGeral
    }
  }

  const now = new Date()
  const monthlyRevenue: DashboardMetrics['monthlyRevenue'] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('pt-BR', { month: 'short' })
    let orcado = 0
    let realizado = 0
    for (const doc of docs) {
      const created = new Date(doc.createdAt)
      if (created.getMonth() !== d.getMonth() || created.getFullYear() !== d.getFullYear()) continue
      if (doc.type === 'recibo') {
        realizado += Number(doc.data?.amount || 0)
      } else if (doc.type === 'orcamento' || doc.type === 'proposta') {
        const items = doc.data?.items || []
        for (const item of items) {
          orcado += Number(item?.quantity || 1) * Number(item?.unitPrice || 0)
        }
      }
    }
    monthlyRevenue.push({ month: label, orcado, realizado })
  }

  return {
    estimatedRevenue,
    realizedRevenue,
    totalDocuments: docs.length,
    activeClients,
    byStatus,
    byType,
    monthlyRevenue,
  }
}