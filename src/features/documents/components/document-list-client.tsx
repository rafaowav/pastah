'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Pencil,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { generateDocumentPdfAction } from '@/lib/pdf/actions'
import { deleteDocumentAction } from '@/features/documents/actions'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DocumentListClientProps {
  initialDocuments: any[]
}

const typeFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'quote', label: 'Orçamentos' },
  { id: 'proposal', label: 'Propostas' },
  { id: 'invoice', label: 'Faturas' },
  { id: 'contract', label: 'Contratos' },
]

export function DocumentListClient({ initialDocuments }: DocumentListClientProps) {
  const [documents, setDocuments] = useState<any[]>(initialDocuments)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const filteredDocs = documents.filter((doc) => {
    const matchesType = selectedType === 'all' || doc.type?.toLowerCase() === selectedType.toLowerCase()
    const matchesSearch =
      doc.title?.toLowerCase().includes(search.toLowerCase()) ||
      doc.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.type?.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  async function handleDownloadPdf(docId: string, title: string) {
    setDownloadingId(docId)
    toast.info('Gerando PDF diagramado...')

    try {
      const res = await generateDocumentPdfAction(docId)
      if (res.success && res.data) {
        // Create download link from base64
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
      toast.error('Erro na geração do PDF.')
    } finally {
      setDownloadingId(null)
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm('Deseja realmente excluir este documento?')) return

    try {
      const res = await deleteDocumentAction(docId)
      if (res.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId))
        toast.success('Documento excluído com sucesso.')
      } else {
        toast.error(res.error || 'Erro ao excluir.')
      }
    } catch (err) {
      toast.error('Erro ao excluir documento.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Meus Documentos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {documents.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie, visualize e exporte seus documentos comerciais em alta resolução.
          </p>
        </div>

        <Link href="/documents/new">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl gap-1.5 h-10 px-5 shadow-sm font-semibold text-xs">
            <Plus className="w-4 h-4" /> Novo Documento
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 card-shadow flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {typeFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedType === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Filtrar por nome ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-slate-50/80 border-slate-200"
          />
        </div>
      </div>

      {/* Documents Grid / List (Stitch Style) */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 main-container-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading font-bold text-base text-slate-900">Nenhum documento encontrado</h3>
            <p className="text-xs text-slate-500">
              {search || selectedType !== 'all'
                ? 'Tente alterar os filtros ou o termo de busca.'
                : 'Crie seu primeiro orçamento ou proposta para começar a exportar.'}
            </p>
          </div>
          <Link href="/documents/new" className="inline-block pt-2">
            <Button size="sm" className="bg-slate-900 text-white rounded-xl text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Criar Primeiro Documento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => {
            const items = doc.data?.items || []
            const totalValue = items.reduce(
              (acc: number, item: any) => acc + (Number(item.quantity || 1) * Number(item.unitPrice || 0)),
              0
            )

            return (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 main-container-shadow card-shadow-hover flex flex-col justify-between space-y-5 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold uppercase tracking-wider">
                      {doc.type}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        doc.status === 'published' || doc.status === 'final'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {doc.status === 'draft' ? 'Rascunho' : doc.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {doc.title}
                  </h3>

                  {/* Client & Metadata */}
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5">
                      <span className="text-slate-400">Cliente:</span>
                      <span className="font-medium text-slate-700">{doc.client?.name || 'Não especificado'}</span>
                    </p>
                    {items.length > 0 && (
                      <p className="flex items-center gap-1.5">
                        <span className="text-slate-400">Itens:</span>
                        <span className="font-medium text-slate-700">{items.length} discriminados</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Total & Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Calculado</span>
                    <span className="font-heading text-lg font-bold text-slate-900">
                      R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPdf(doc.id, doc.title)}
                      disabled={downloadingId === doc.id}
                      className="flex-1 rounded-xl text-xs font-semibold border-slate-200 hover:bg-slate-50 gap-1.5 h-9"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      {downloadingId === doc.id ? 'Gerando...' : 'Baixar PDF'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                      className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center">
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
