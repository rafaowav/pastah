export interface DashboardCompany {
  id: string
  name: string
  document: string | null
}

export interface DashboardDocument {
  id: string
  type: string
  title: string
  status: string
  paymentStatus: string
  clientId: string | null
  clientName: string | null
  createdAt: Date
  totalAmountCents: number
  receivedAmountCents: number
  data: Record<string, unknown>
}

export interface DashboardMetrics {
  /** Soma de totalAmount de orçamentos/propostas não arquivados e não recusados (centavos) */
  estimatedRevenueCents: number
  /** Soma de receivedAmount de documentos recebidos/parcialmente recebidos (centavos) */
  receivedRevenueCents: number
  /** Soma pendente de orçamentos/propostas com pagamento pendente (centavos) */
  pendingAmountCents: number
  /** Saldo restante de documentos parcialmente recebidos (centavos) */
  partiallyReceivedAmountCents: number
  /** received / estimated em % (0-100) */
  receivableRate: number
  finalizedCount: number
  totalDocuments: number
  activeClients: number
  byStatus: Record<string, number>
  byPaymentStatus: Record<string, number>
  byType: Record<string, number>
  monthlyRevenue: {
    month: string
    orcadoCents: number
    recebidoCents: number
    pendenteCents: number
  }[]
}

export interface DashboardData {
  company: DashboardCompany | null
  documents: DashboardDocument[]
  metrics: DashboardMetrics
  hasCompanies: boolean
}
