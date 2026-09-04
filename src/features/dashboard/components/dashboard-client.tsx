'use client'

import Link from 'next/link'
import {
  Plus,
  ArrowRight,
  TrendingUp,
  Users,
  FileText,
  Clipboard,
  FileSignature,
  Wallet,
  Building2,
  Eye,
  CheckCircle2,
  Hourglass,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  MonthlyRevenueChart,
  TypeDistributionChart,
  StatusBadge,
  PaymentStatusBadge,
} from '@/features/documents/components/dashboard-charts'
import { DashboardData } from '../types'
import { formatCentsBRL, documentTypeLabel } from '@/lib/document-status'

interface DashboardClientProps {
  data: DashboardData
  user: { name?: string | null; email?: string | null }
}

const quickActions = [
  { href: '/documents/new/orcamento', label: 'Novo Orçamento', icon: FileText },
  { href: '/documents/new/proposta', label: 'Nova Proposta', icon: TrendingUp },
  { href: '/documents/new/recibo', label: 'Novo Recibo', icon: Wallet },
  { href: '/documents/new/ordem-servico', label: 'Nova Ordem de Serviço', icon: Clipboard },
  { href: '/documents/new/contrato', label: 'Novo Contrato', icon: FileSignature },
  { href: '/clients/new', label: 'Novo Cliente', icon: Users },
]

export function DashboardClient({ data, user }: DashboardClientProps) {
  const { company, documents, metrics, hasCompanies } = data
  const firstName = user?.name?.split(' ')[0] || 'Usuário'
  const recentDocs = documents.slice(0, 6)

  const typeDistribution = Object.entries(metrics.byType).map(([type, count]) => ({ type, count }))
  const statusSummary = [
    { key: 'rascunho', label: 'Rascunhos' },
    { key: 'enviado', label: 'Enviados' },
    { key: 'aprovado', label: 'Aprovados' },
    { key: 'finalizado', label: 'Finalizados' },
    { key: 'arquivado', label: 'Arquivados' },
  ]

  if (!hasCompanies) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-card border border-border flex items-center justify-center shadow-sm">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Comece cadastrando sua empresa
          </h1>
          <p className="text-sm text-muted-foreground">
            Para acompanhar faturamento, documentos e clientes, cadastre sua empresa primeiro.
          </p>
        </div>
        <Link href="/companies/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl gap-1.5 h-11 px-6 shadow-sm font-semibold text-xs">
            <Plus className="w-4 h-4" /> Cadastrar minha empresa
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Visão geral{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe os resultados e documentos da sua empresa.
          </p>
          {company && (
            <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> {company.name}
              {company.document ? ` • ${company.document}` : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/documents/new">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl gap-1.5 h-10 px-4 shadow-sm">
              <Plus className="w-4 h-4" /> Criar Documento
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-3xl p-6 main-container-shadow border border-border">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Faturamento Estimado
              </span>
              <h2 className="font-heading text-2xl font-bold text-card-foreground mt-1">
                {formatCentsBRL(metrics.estimatedRevenueCents)}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Orçamentos e propostas não arquivados/recusados
          </p>
        </div>

        <div className="bg-card rounded-3xl p-6 main-container-shadow border border-border">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Faturamento Recebido
              </span>
              <h2 className="font-heading text-2xl font-bold text-card-foreground mt-1">
                {formatCentsBRL(metrics.receivedRevenueCents)}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Soma de recebimentos (totais e parciais) • Taxa de recebimento:{' '}
            <span className="font-semibold text-foreground">{metrics.receivableRate}%</span>
          </p>
        </div>

        <div className="bg-card rounded-3xl p-6 main-container-shadow border border-border">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Total Pendente
              </span>
              <h2 className="font-heading text-2xl font-bold text-card-foreground mt-1">
                {formatCentsBRL(metrics.pendingAmountCents)}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
              <Hourglass className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Parcialmente recebido: {formatCentsBRL(metrics.partiallyReceivedAmountCents)}
          </p>
        </div>

        <div className="bg-card rounded-3xl p-6 main-container-shadow border border-border">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Documentos
              </span>
              <h2 className="font-heading text-2xl font-bold text-card-foreground mt-1">
                {metrics.totalDocuments}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div className="space-y-1">
            {statusSummary.map((s) => (
              <div key={s.key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-semibold text-card-foreground">{metrics.byStatus[s.key] || 0}</span>
              </div>
            ))}
            <div className="flex justify-between text-xs pt-1 border-t border-border">
              <span className="text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Finalizados
              </span>
              <span className="font-semibold text-card-foreground">{metrics.finalizedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Análise</span>
              <h2 className="font-heading text-xl font-bold text-card-foreground mt-0.5">
                Evolução Mensal: Estimado × Recebido × Pendente
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">Últimos 6 meses</span>
          </div>
          <MonthlyRevenueChart data={metrics.monthlyRevenue} />
        </div>

        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Composição</span>
              <h2 className="font-heading text-xl font-bold text-card-foreground mt-0.5">Por Tipo de Documento</h2>
            </div>
          </div>
          <TypeDistributionChart data={typeDistribution} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border main-container-shadow space-y-4">
        <div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Atalhos</span>
          <h3 className="font-heading font-bold text-base text-card-foreground mt-0.5">Ações Rápidas</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted hover:bg-accent border border-border transition-colors group text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm mb-1">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-foreground">{action.label}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Documents */}
      <section className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Atividades Recentes</span>
            <h2 className="font-heading text-xl font-bold text-card-foreground mt-0.5">Documentos Recentes</h2>
          </div>
          <Link href="/documents" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDocs.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-muted">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-foreground text-base">Nenhum documento criado ainda</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Crie seu primeiro orçamento, recibo ou contrato em segundos usando nossos modelos.
            </p>
            <Link href="/documents/new" className="inline-block mt-4">
              <Button size="sm" className="bg-primary text-primary-foreground rounded-xl text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Criar Documento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-4">Documento</th>
                  <th className="pb-3 pr-4">Tipo</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Financeiro</th>
                  <th className="pb-3 pr-4 text-right">Valor</th>
                  <th className="pb-3 pr-4 text-right">Data</th>
                  <th className="pb-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentDocs.map((doc) => {
                  return (
                    <tr key={doc.id} className="hover:bg-accent/50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{doc.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {doc.clientName ? `Cliente: ${doc.clientName}` : 'Sem cliente vinculado'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          {documentTypeLabel(doc.type)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={doc.status} />
                      </td>
                      <td className="py-3 pr-4">
                        <PaymentStatusBadge status={doc.paymentStatus} />
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-foreground whitespace-nowrap">
                        {formatCentsBRL(doc.totalAmountCents)}
                      </td>
                      <td className="py-3 pr-4 text-right text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true, locale: ptBR })}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/documents/${doc.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-accent">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/documents/new/${doc.type}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-accent">
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
