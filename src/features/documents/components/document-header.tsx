/**
 * Componentes de preview A4 compartilhados (padrão visual do Orçamento).
 * Renderizam em HTML/Tailwind dentro da folha branca do DocumentStudio.
 */
import type { ReactNode } from 'react'
import { documentColors } from '@/lib/document-engine/document-theme'

// ---------------------------------------------------------------------------
// Formatação compartilhada
// ---------------------------------------------------------------------------

export function formatDocBRL(value: number): string {
  return (Number.isFinite(value) ? value : 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatDocDate(value: unknown): string {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(String(value))
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR')
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface DocCompany {
  name?: string
  document?: string
  email?: string
  phone?: string
  logo?: string
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  } | null
  [key: string]: unknown
}

export interface DocClient {
  name?: string
  document?: string
  email?: string
  phone?: string
  [key: string]: unknown
}

export interface DocumentHeaderInfo {
  /** Nome do documento em maiúsculas, ex: "Orçamento" */
  title: string
  /** Número do documento, ex: "#ORC-0001" */
  number?: string
  /** Data de emissão */
  issuedAt?: unknown
  /** Validade (quando aplicável) */
  validUntil?: unknown
  /** Rótulo custom para validade (ex: "Validade: 10 dias") */
  validLabel?: string
  /** Status (quando aplicável) */
  status?: string
  /** Linhas extras à direita */
  extraLines?: string[]
}

export interface DocumentHeaderProps {
  company?: DocCompany | null
  info: DocumentHeaderInfo
}

export interface DocumentClientInfoProps {
  client?: DocClient | null
  fallbackName?: string
  title?: string
}

export interface DocumentFooterProps {
  company?: DocCompany | null
  info?: DocumentHeaderInfo
  /** Nota discreta acima da assinatura (ex: "Aprovação do cliente") */
  hint?: string
  /** Nome sob a linha de assinatura */
  signatureName?: string
  /** Assinaturas lado a lado (contrato, OS) */
  signatures?: { label: string; name?: string }[]
  /** Mostra bloco de assinatura simples */
  simpleSignature?: boolean
}

// ---------------------------------------------------------------------------
// Cabeçalho azul-marinho (padrão Orçamento)
// ---------------------------------------------------------------------------

export function DocumentHeader({ company, info }: DocumentHeaderProps) {
  const name = company?.name || 'Sua Empresa'
  const initial = name?.[0]?.toUpperCase() || 'P'
  const address = company?.address
  const addressLine =
    address && (address.city || address.state)
      ? [address.city, address.state].filter(Boolean).join(' - ')
      : null

  return (
    <div
      className="px-10 pt-10 pb-6 text-white"
      style={{ backgroundColor: documentColors.headerBg }}
    >
      <div className="flex justify-between items-start gap-8">
        {/* Empresa (esquerda) */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {company?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={String(company.logo)}
                alt={name}
                className="w-9 h-9 rounded-xl object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-heading font-bold text-sm"
                style={{ backgroundColor: documentColors.headerAccent }}
              >
                {initial}
              </div>
            )}
            <h2 className="font-heading text-xl font-bold truncate">{name}</h2>
          </div>
          <div className="space-y-0.5 text-xs" style={{ color: documentColors.headerMuted }}>
            {company?.document && <p>{/^[\d./-]+$/.test(company.document) ? `CNPJ: ${company.document}` : company.document}</p>}
            {company?.email && <p>{company.email}</p>}
            {company?.phone && <p>{company.phone}</p>}
            {addressLine && <p>{addressLine}</p>}
          </div>
        </div>

        {/* Identificação do documento (direita) */}
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold tracking-tight uppercase">{info.title}</div>
          <div className="mt-1 space-y-0.5 text-xs" style={{ color: documentColors.headerMuted }}>
            {info.number && <p>Nº {String(info.number)}</p>}
            <p>Emissão: {formatDocDate(info.issuedAt ?? new Date())}</p>
            {Boolean(info.validLabel || info.validUntil) && (
              <p>Validade: {info.validLabel ? String(info.validLabel) : formatDocDate(info.validUntil)}</p>
            )}
            {info.status && <p>Status: {String(info.status)}</p>}
            {info.extraLines?.map((line, i) => <p key={i}>{String(line)}</p>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bloco de cliente (card claro sob o cabeçalho)
// ---------------------------------------------------------------------------

export function DocumentClientInfo({ client, fallbackName, title = 'Cliente' }: DocumentClientInfoProps) {
  const name = client?.name || fallbackName || 'Nome do Cliente'
  const details = [client?.document, client?.email, client?.phone].filter(Boolean)

  return (
    <div className="mx-10 mt-8 rounded-2xl border border-slate-200 p-5">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">{title}</div>
      <p className="font-semibold text-slate-900">{name}</p>
      {details.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
          {client?.document && <span>CPF/CNPJ: {client.document}</span>}
          {client?.email && <span>{client.email}</span>}
          {client?.phone && <span>{client.phone}</span>}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Título de seção (corpo, azul-marinho)
// ---------------------------------------------------------------------------

export function DocumentSectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${className}`}
      style={{ color: documentColors.textFaint }}
    >
      {children}
    </div>
  )
}

export function DocumentSectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={`font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4 ${className}`}
    >
      {children}
    </h3>
  )
}

// ---------------------------------------------------------------------------
// Rodapé consistente
// ---------------------------------------------------------------------------

export function DocumentFooter({
  company,
  info,
  hint,
  signatureName,
  signatures,
}: DocumentFooterProps) {
  const issuedAt = formatDocDate(info?.issuedAt ?? new Date())
  const contact = [company?.email, company?.phone].filter(Boolean).join(' • ')

  return (
    <div className="mx-10 mt-10 pb-10">
      {signatures && signatures.length > 0 ? (
        <div className="border-t border-slate-200 pt-8">
          <div className="flex justify-center gap-12">
            {signatures.map((sig, i) => (
              <div key={i} className="text-center" style={{ minWidth: 200 }}>
                <div className="h-px bg-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">{sig.name || '\u00A0'}</p>
                <p className="text-[10px] text-slate-400">{sig.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        signatureName !== undefined && (
          <div className="border-t border-slate-200 pt-8 text-center">
            {hint && <p className="text-xs text-slate-500 mb-8">{hint}</p>}
            <div className="inline-block w-72">
              <div className="h-px bg-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-700">{signatureName}</p>
            </div>
          </div>
        )
      )}

      {/* Linha discreta com dados da empresa */}
      <div className="mt-10 pt-4 border-t border-slate-100 text-center space-y-0.5">
        <p className="text-[10px] text-slate-400">
          {company?.name || 'Sua Empresa'}
          {contact ? ` • ${contact}` : ''}
        </p>
        <p className="text-[10px] text-slate-400">
          {info?.number ? `Doc. ${info.number} • ` : ''}Emitido em {issuedAt}
        </p>
      </div>
    </div>
  )
}
