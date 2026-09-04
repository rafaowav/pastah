'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Wallet,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { generateDocumentPdfAction } from '@/lib/pdf/actions'
import {
  deleteDocumentAction,
  finalizeDocumentAction,
  markDocumentReceivedAction,
  undoDocumentPaymentAction,
} from '@/features/documents/actions'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  operationalStatusLabel,
  operationalStatusBadgeClass,
  paymentStatusLabel,
  paymentStatusBadgeClass,
  documentTypeLabel,
  formatCentsBRL,
  formatBRL,
} from '@/lib/document-status'
import type { DocumentRow } from '../data'

interface DocumentListClientProps {
  initialDocuments: DocumentRow[]
}

type DocumentListItem = DocumentRow & { client?: { name?: string } }

const typeFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'orcamento', label: 'Orçamentos' },
  { id: 'proposta', label: 'Propostas' },
  { id: 'recibo', label: 'Recibos' },
  { id: 'ordem-servico', label: 'Ordens de Serviço' },
  { id: 'contrato', label: 'Contratos' },
]

export function DocumentListClient({ initialDocuments }: DocumentListClientProps) {
  const [documents, setDocuments] = useState<DocumentListItem[]>(initialDocuments)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)

  const filteredDocs = documents.filter((doc) => {
    const matchesType = selectedType === 'all' || doc.type?.toLowerCase() === selectedType.toLowerCase()
    const matchesSearch =
      doc.title?.toLowerCase().includes(search.toLowerCase()) ||
      doc.type?.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  function replaceDocument(updated: DocumentRow) {
    setDocuments((prev) => prev.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)))
  }

  async function runAction(
    docId: string,
    action: () => Promise<{ success: boolean; error?: string }>,
  ) {
    if (actingId) return
    setActingId(docId)
    try {
      const res = await action()
      if (!res.success) toast.error(res.error || 'Ação não concluída.')
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('[documents-list]', error)
      toast.error('Não foi possível concluir a ação. Tente novamente.')
    } finally {
      setActingId(null)
    }
  }

  async function handleFinalize(doc: DocumentListItem) {
    if (!confirm(`Finalizar "${doc.title}"? O status operacional mudará para Finalizado.`)) return
    await runAction(doc.id, async () => {
      const res = await finalizeDocumentAction(doc.id)
      if (res.success) {
        replaceDocument(res.data)
        toast.success('Documento marcado como finalizado.')
      }
      return res
    })
  }

  async function handleReceive(doc: DocumentListItem) {
    if (!confirm(`Confirmar recebimento de ${formatCentsBRL(doc.totalAmount)} de "${doc.title}"?`)) return
    await runAction(doc.id, async () => {
      const res = await markDocumentReceivedAction(doc.id)
      if (res.success) {
        replaceDocument(res.data)
        toast.success('Recebimento registrado com sucesso.')
      }
      return res
    })
  }

  async function handleUndoPayment(doc: DocumentListItem) {
    if (!confirm('Desfazer o recebimento deste documento? O valor recebido voltará a zero.')) return
    await runAction(doc.id, async () => {
      const res = await undoDocumentPaymentAction(doc.id)
      if (res.success) {
        replaceDocument(res.data)
        toast.success('Recebimento desfeito.')
      }
      return res
    })
  }

  async function handleDelete(docId: string) {
    if (!confirm('Deseja realmente excluir este documento?')) return
    await runAction(docId, async () => {
      const res = await deleteDocumentAction(docId)
      if (res.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId))
        toast.success('Documento excluído com sucesso.')
      }
      return res
    })
  }

  async function handleDownloadPdf(docId: string, title: string) {
    if (downloadingId) return
    setDownloadingId(docId)
    try {
      const res = await generateDocumentPdfAction(docId)
      if (res.success && res.data) {
        const byteCharacters = atob(res.data.base64)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = res.data.filename || `${title}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('PDF baixado com sucesso!')
      } else {
        toast.error(res.error || 'Erro ao gerar PDF.')
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('[documents-list] pdf', err)
      toast.error('Erro na geração do PDF.')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Meus Documentos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-bold">
              {documents.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie, visualize e exporte seus documentos comerciais em alta resolução.
          </p>
        </div>

        <Link href="/documents/new">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl gap-1.5 h-10 px-5 shadow-sm font-semibold text-xs">
            <Plus className="w-4 h-4" /> Novo Documento
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border card-shadow flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {typeFilters.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedType(tab.id)}
              aria-pressed={selectedType === tab.id}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedType === tab.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-transparent text-muted-foreground border-transparent hover:bg-accent hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Filtrar por nome ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Documents Grid / List (Stitch Style) */}
      {filteredDocs.length === 0 ? (
        <div className="bg-card rounded-3xl p-12 text-center border border-dashed border-border main-container-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading font-bold text-base text-foreground">Nenhum documento encontrado</h3>
            <p className="text-xs text-muted-foreground">
              {search || selectedType !== 'all'
                ? 'Tente alterar os filtros ou o termo de busca.'
                : 'Crie seu primeiro orçamento ou proposta para começar a exportar.'}
            </p>
          </div>
          <Link href="/documents/new" className="inline-block pt-2">
            <Button size="sm" className="bg-primary text-primary-foreground rounded-xl text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Criar Primeiro Documento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const isFinancial = typeof doc.totalAmount === 'number' && doc.totalAmount > 0
            const remainingCents = (doc.totalAmount ?? 0) - (doc.receivedAmount ?? 0)
            const fullyPaid = doc.paymentStatus === 'recebido'
            const busy = actingId === doc.id

            return (
              <div
                key={doc.id}
                className="bg-card rounded-3xl p-6 border border-border main-container-shadow card-shadow-hover flex flex-col justify-between space-y-5 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                      {documentTypeLabel(doc.type)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${operationalStatusBadgeClass(doc.status)}`}
                    >
                      {operationalStatusLabel(doc.status)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {doc.title}
                  </h3>

                  {/* Metadata */}
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {isFinancial && (
                      <p className="flex items-center gap-1.5">
                        <span>Financeiro:</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full ${paymentStatusBadgeClass(doc.paymentStatus)}`}
                        >
                          {paymentStatusLabel(doc.paymentStatus)}
                        </span>
                      </p>
                    )}
                    {isFinancial && (
                      <p className="flex items-center gap-1.5">
                        <span>Saldo pendente:</span>
                        <span className="font-medium text-foreground">{formatCentsBRL(remainingCents)}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Total & Actions */}
                <div className="pt-4 border-t border-border flex flex-col gap-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase">Valor Total</span>
                    <span className="font-heading text-lg font-bold text-foreground">
                      {isFinancial ? formatCentsBRL(doc.totalAmount) : formatBRL(0)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPdf(doc.id, doc.title)}
                      disabled={downloadingId === doc.id || busy}
                      className="flex-1 rounded-xl text-xs font-semibold border-border text-foreground hover:bg-accent gap-1.5 h-9"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      {downloadingId === doc.id ? 'Gerando...' : 'PDF'}
                    </Button>

                    {!fullyPaid && isFinancial && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReceive(doc)}
                        disabled={busy}
                        className="rounded-xl text-xs font-semibold border-emerald-300 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 gap-1.5 h-9"
                      >
                        <Wallet className="w-3.5 h-3.5" /> Receber
                      </Button>
                    )}

                    {doc.status !== 'finalizado' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFinalize(doc)}
                        disabled={busy}
                        className="rounded-xl text-xs font-semibold border-border text-foreground hover:bg-accent gap-1.5 h-9"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Finalizar
                      </Button>
                    )}

                    {fullyPaid && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUndoPayment(doc)}
                        disabled={busy}
                        className="rounded-xl text-xs font-semibold border-border text-muted-foreground hover:bg-accent gap-1.5 h-9"
                      >
                        Desfazer recebimento
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                      disabled={busy}
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>

                  <p className="text-[10px] text-muted-foreground text-center">
                    Criado {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
