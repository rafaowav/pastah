import {
  DOCUMENT_OPERATIONAL_STATUSES,
  DOCUMENT_PAYMENT_STATUSES,
  DocumentOperationalStatus,
  DocumentPaymentStatus,
} from '@/lib/db/schema/documents'

// ---------------------------------------------------------------------------
// Status operacional
// ---------------------------------------------------------------------------

export const OPERATIONAL_STATUS_LABELS: Record<DocumentOperationalStatus, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
  finalizado: 'Finalizado',
  arquivado: 'Arquivado',
}

export const OPERATIONAL_STATUS_BADGE_CLASSES: Record<DocumentOperationalStatus, string> = {
  rascunho:
    'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300 border border-slate-200 dark:border-slate-500/30',
  enviado:
    'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30',
  aprovado:
    'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30',
  recusado:
    'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300 border border-red-200 dark:border-red-500/30',
  finalizado:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30',
  arquivado:
    'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30',
}

// ---------------------------------------------------------------------------
// Status financeiro
// ---------------------------------------------------------------------------

export const PAYMENT_STATUS_LABELS: Record<DocumentPaymentStatus, string> = {
  pendente: 'Pendente',
  parcialmente_recebido: 'Parcialmente recebido',
  recebido: 'Recebido',
  cancelado: 'Cancelado',
}

export const PAYMENT_STATUS_BADGE_CLASSES: Record<DocumentPaymentStatus, string> = {
  pendente:
    'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30',
  parcialmente_recebido:
    'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30',
  recebido:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30',
  cancelado:
    'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300 border border-slate-200 dark:border-slate-500/30',
}

// ---------------------------------------------------------------------------
// Tipos de documento
// ---------------------------------------------------------------------------

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  orcamento: 'Orçamento',
  proposta: 'Proposta',
  recibo: 'Recibo',
  'ordem-servico': 'Ordem de Serviço',
  contrato: 'Contrato',
}

// ---------------------------------------------------------------------------
// Relações
// ---------------------------------------------------------------------------

export const DOCUMENT_RELATION_TYPE_LABELS: Record<string, string> = {
  recibo_de: 'Recibo de',
  gerado_a_partir_de: 'Gerado a partir de',
  vinculado_a: 'Vinculado a',
  substitui: 'Substitui',
}

/** Tipos de relação entre documentos (espelha documentRelations) */
export const DOCUMENT_RELATION_TYPES = [
  'recibo_de',
  'gerado_a_partir_de',
  'vinculado_a',
  'substitui',
] as const

/** Tipos de documento que podem gerar pagamento (recibo vinculado) */
export const FINANCIAL_SOURCE_TYPES = ['orcamento', 'proposta', 'ordem-servico'] as const

// ---------------------------------------------------------------------------
// Helpers seguros
// ---------------------------------------------------------------------------

export function isOperationalStatus(value: unknown): value is DocumentOperationalStatus {
  return (
    typeof value === 'string' &&
    (DOCUMENT_OPERATIONAL_STATUSES as readonly string[]).includes(value)
  )
}

export function isPaymentStatus(value: unknown): value is DocumentPaymentStatus {
  return (
    typeof value === 'string' &&
    (DOCUMENT_PAYMENT_STATUSES as readonly string[]).includes(value)
  )
}

export function operationalStatusLabel(status: string): string {
  return isOperationalStatus(status) ? OPERATIONAL_STATUS_LABELS[status] : status
}

export function paymentStatusLabel(status: string): string {
  return isPaymentStatus(status) ? PAYMENT_STATUS_LABELS[status] : status
}

export function operationalStatusBadgeClass(status: string): string {
  return isOperationalStatus(status)
    ? OPERATIONAL_STATUS_BADGE_CLASSES[status]
    : OPERATIONAL_STATUS_BADGE_CLASSES.rascunho
}

export function paymentStatusBadgeClass(status: string): string {
  return isPaymentStatus(status)
    ? PAYMENT_STATUS_BADGE_CLASSES[status]
    : PAYMENT_STATUS_BADGE_CLASSES.pendente
}

export function documentTypeLabel(type: string): string {
  return DOCUMENT_TYPE_LABELS[type] ?? type
}

/**
 * Migra status legados (draft/sent/accepted/final...) para os novos valores
 * em português. Usado ao ler registros antigos e no save.
 */
export function normalizeOperationalStatus(value: string | null | undefined): DocumentOperationalStatus {
  switch (value) {
    case 'draft':
    case '':
    case null:
    case undefined:
      return 'rascunho'
    case 'sent':
      return 'enviado'
    case 'accepted':
      return 'aprovado'
    case 'rejected':
      return 'recusado'
    case 'final':
    case 'published':
      return 'finalizado'
    case 'archived':
      return 'arquivado'
    default:
      return isOperationalStatus(value) ? value : 'rascunho'
  }
}

// ---------------------------------------------------------------------------
// Dinheiro — centavos (integer) para evitar imprecisão de float
// ---------------------------------------------------------------------------

/** Converte um valor em reais (number/string) para centavos (integer). */
export function reaisToCents(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  const num = typeof value === 'string' ? Number(value.replace(',', '.')) : value
  if (!Number.isFinite(num)) return 0
  return Math.round(num * 100)
}

/** Converte centavos (integer) para reais (number) para exibição. */
export function centsToReais(cents: number | null | undefined): number {
  if (cents === null || cents === undefined || !Number.isFinite(cents)) return 0
  return cents / 100
}

/** Formata centavos em BRL. */
export function formatCentsBRL(cents: number | null | undefined): string {
  return centsToReais(cents).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/** Formata reais em BRL. */
export function formatBRL(value: number): string {
  return (Number.isFinite(value) ? value : 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
