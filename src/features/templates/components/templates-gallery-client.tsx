'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileStack,
  Plus,
  Search,
  Sparkles,
  FileText,
  Trash2,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { deleteTemplateAction } from '@/features/templates/actions'

interface TemplatesGalleryClientProps {
  customTemplates: any[]
}

const defaultPresets = [
  {
    id: 'preset-quote-1',
    name: 'Orçamento Comercial Executivo',
    documentType: 'quote',
    isPreset: true,
    description: 'Diagramação limpa com tabela de itens, cálculo de taxas e condições de pagamento.',
    category: 'Orçamentos',
    color: 'from-blue-500/10 to-indigo-500/10',
  },
  {
    id: 'preset-proposal-1',
    name: 'Proposta Editorial de Serviços',
    documentType: 'quote',
    isPreset: true,
    description: 'Apresentação formal com escopo detalhado, cronograma e valores de investimento.',
    category: 'Propostas',
    color: 'from-slate-500/10 to-zinc-500/10',
  },
  {
    id: 'preset-invoice-1',
    name: 'Fatura / Recibo de Honorários',
    documentType: 'quote',
    isPreset: true,
    description: 'Comprovante com dados bancários, discriminação de serviços e totais.',
    category: 'Faturas',
    color: 'from-emerald-500/10 to-teal-500/10',
  },
]

export function TemplatesGalleryClient({ customTemplates }: TemplatesGalleryClientProps) {
  const [templates, setTemplates] = useState<any[]>(customTemplates)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const allTemplates = [
    ...defaultPresets,
    ...templates.map((t) => ({ ...t, isPreset: false, category: 'Personalizados' })),
  ]

  const filtered = allTemplates.filter((tmpl) => {
    const matchesSearch =
      tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
      (tmpl.description && tmpl.description.toLowerCase().includes(search.toLowerCase())) ||
      tmpl.documentType.toLowerCase().includes(search.toLowerCase())
    const matchesCat = category === 'all' || tmpl.documentType === category || tmpl.category === category
    return matchesSearch && matchesCat
  })

  async function handleDeleteCustom(id: string) {
    if (!confirm('Deseja excluir este template personalizado?')) return

    try {
      const res = await deleteTemplateAction(id)
      if (res.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id))
        toast.success('Template excluído com sucesso.')
      } else {
        toast.error(res.error || 'Erro ao excluir.')
      }
    } catch {
      toast.error('Erro ao excluir template.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Galeria de Templates
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {allTemplates.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Modelos de documentos comerciais com design editorial prontos para uso imediato.
          </p>
        </div>

        <Link href="/templates/new">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl gap-1.5 h-10 px-5 shadow-sm font-semibold text-xs">
            <Plus className="w-4 h-4" /> Criar Template
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 card-shadow flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'Todos os Templates' },
            { id: 'quote', label: 'Orçamentos' },
            { id: 'Personalizados', label: 'Meus Templates' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome do modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl bg-slate-50/80 border-slate-200"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 main-container-shadow card-shadow-hover flex flex-col justify-between space-y-6 group"
          >
            <div>
              {/* Header pill */}
              <div className="flex justify-between items-center mb-4">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold uppercase tracking-wider">
                  {tmpl.documentType}
                </span>
                {tmpl.isPreset ? (
                  <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Oficial Pastah
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400">Personalizado</span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                {tmpl.name}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {tmpl.description || 'Modelo otimizado com diagramação limpa e cálculo de valores.'}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <Link href={`/documents/new/${tmpl.documentType}`} className="flex-1">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold h-10 shadow-sm gap-1.5">
                  Usar Template <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>

              {!tmpl.isPreset && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCustom(tmpl.id)}
                  className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
