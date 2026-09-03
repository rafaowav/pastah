export interface DashboardCompany {
  id: string
  name: string
  document: string | null
}

export interface DashboardClientInfo {
  id: string
  name: string
}

export interface DashboardDocument {
  id: string
  type: string
  title: string
  status: string
  clientId: string | null
  clientName: string | null
  createdAt: Date
  data: Record<string, any>
}

export interface DashboardMetrics {
  estimatedRevenue: number
  realizedRevenue: number
  totalDocuments: number
  activeClients: number
  byStatus: Record<string, number>
  byType: Record<string, number>
  monthlyRevenue: {
    month: string
    orcado: number
    realizado: number
  }[]
}

export interface DashboardData {
  company: DashboardCompany | null
  documents: DashboardDocument[]
  metrics: DashboardMetrics
  hasCompanies: boolean
}
