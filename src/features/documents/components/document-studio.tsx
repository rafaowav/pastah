'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getDocument } from '@/lib/document-engine/registry'
import { createDocumentAction, updateDocumentAction } from '../actions'
import { ArrowLeft, CheckCircle2, Download, Save } from 'lucide-react'
import Link from 'next/link'

interface DocumentStudioProps {
  type: string
  initialData?: any
  clients?: any[]
  companies?: any[]
  products?: any[]
}

export function DocumentStudio({ type, initialData, clients, companies, products }: DocumentStudioProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const [scale, setScale] = useState(1)
  const sheetWrapRef = useRef<HTMLDivElement | null>(null)

  const docConfig = getDocument(type)
  const FieldsComponent = docConfig.fields
  const TemplateComponent = docConfig.template

  const form = useForm<any>({
    resolver: zodResolver(docConfig.schema as any),
    defaultValues: initialData || {
      title: '',
      clientId: '',
      companyId: '',
      items: [],
      observations: '',
    },
  })

  const { watch } = form
  const watchedValues = watch()
  const watchedTitle = watchedValues.title || ''

  // Fit the A4 sheet (794px wide) inside its panel by scaling
  useEffect(() => {
    const el = sheetWrapRef.current
    if (!el) return
    const updateScale = () => {
      const width = el.clientWidth
      if (width > 0) {
        setScale(Math.min(1, width / 794))
      }
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Map selected ids to the full company / client objects so templates can render names
  const previewData = useMemo(() => {
    const company = companies?.find((c) => c.id === watchedValues.companyId)
    const client = clients?.find((c) => c.id === watchedValues.clientId)
    return {
      ...watchedValues,
      company: company || { name: '' },
      client: client || { name: '' },
    }
  }, [watchedValues, companies, clients])

  async function handleSave(status: 'draft' | 'final') {
    setIsSaving(true)
    try {
      // Split the type-specific values into the `data` jsonb field
      const { title, clientId, companyId, templateId, isFavorite, ...payload } = watchedValues
      const documentInput = {
        type,
        title: title || docConfig.name,
        companyId: companyId || null,
        clientId: clientId || null,
        status,
        data: payload,
        templateId: templateId || null,
        isFavorite: isFavorite || 'false',
      }

      let result
      if (initialData?.id) {
        result = await updateDocumentAction(initialData.id, documentInput)
      } else {
        result = await createDocumentAction(documentInput)
      }

      if (result.success) {
        toast.success(status === 'final' ? 'Documento emitido com sucesso!' : 'Rascunho salvo com sucesso!')
        router.push('/documents')
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao salvar documento.')
      }
    } catch (error) {
      console.error('Error saving document:', error)
      toast.error('Ocorreu um erro ao salvar o documento.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDownloadPdf() {
    setIsPdfLoading(true)
    try {
      const { generateDocumentPdf } = await import('@/lib/pdf/generator')
      const blob = await generateDocumentPdf(docConfig.id, previewData)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${docConfig.id}-${watchedTitle || 'documento'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('PDF baixado com sucesso!')
    } catch (error) {
      console.error('PDF error:', error)
      toast.error('Erro ao gerar o PDF.')
    } finally {
      setIsPdfLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Top Bar */}
      <div className="border-b border-slate-200/80 backdrop-blur-sm bg-white sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/documents/new">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-600">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{docConfig.name}</span>
              <h1 className="font-heading text-lg font-bold text-slate-900 truncate">
                {watchedTitle || 'Novo documento'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave('draft')}
              disabled={isSaving}
              className="h-9 rounded-xl px-3 text-xs border-slate-300 text-slate-700 hover:bg-slate-50 gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Salvar Rascunho
            </Button>
            <Button
              size="sm"
              onClick={() => handleSave('final')}
              disabled={isSaving}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-9 px-4 font-semibold shadow-sm gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> {isSaving ? 'Salvando...' : 'Emitir Documento'}
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isPdfLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-4 font-semibold shadow-sm gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> {isPdfLoading ? 'Gerando...' : 'Baixar PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Split-Screen Layout */}
      <div className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Form (50%) */}
          <div className="lg:col-span-1 space-y-6 overflow-y-auto lg:max-h-[calc(100vh-140px)] lg:pr-2">
            <FieldsComponent
              form={form}
              clients={clients || []}
              companies={companies || []}
              products={products || []}
            />
          </div>

          {/* Right Column: Live A4 Preview (50%) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-heading font-bold text-lg text-slate-900">
                  Pré-visualização A4
                </h3>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Sincronizado em tempo real
                </span>
              </div>

              {/* A4 Sheet */}
              <div ref={sheetWrapRef} className="w-full rounded-lg">
                <div
                  className="relative rounded-lg shadow-xl ring-1 ring-slate-200 overflow-hidden bg-white mx-auto"
                  style={{ width: 794 * scale, height: 1123 * scale }}
                >
                  <div
                    className="absolute top-0 left-0 origin-top-left bg-white"
                    style={{ width: 794, minHeight: 1123, transform: `scale(${scale})` }}
                  >
                    <TemplateComponent data={previewData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
