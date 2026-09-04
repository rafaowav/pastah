'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getDocument } from '@/lib/document-engine/registry'
import { createDocumentAction, updateDocumentAction } from '../actions'
import { ArrowLeft, CheckCircle2, Download, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface DocumentStudioProps {
  type: string
  initialData?: any
  clients?: any[]
  companies?: any[]
  products?: any[]
  linkableDocuments?: { id: string; type: string; title: string; totalAmount: number; clientId: string | null }[]
}

export function DocumentStudio({
  type,
  initialData,
  clients,
  companies,
  products,
  linkableDocuments,
}: DocumentStudioProps) {
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

  const handleSave = useCallback(
    async (status: 'rascunho' | 'enviado') => {
      if (isSaving) return
      setIsSaving(true)
      try {
        // Split the type-specific values into the `data` jsonb field
        const values = { ...watchedValues }
        const documentInput = {
          type,
          title: values.title || docConfig.name,
          companyId: values.companyId || null,
          clientId: values.clientId || null,
          status,
          data: values,
          templateId: values.templateId || null,
          isFavorite: values.isFavorite || 'false',
          // Vínculo com documento de origem (recibo de orçamento/OS/proposta)
          relatedDocumentIds: values.relatedDocumentIds ? [values.relatedDocumentIds] : undefined,
          relationType: type === 'recibo' ? 'recibo_de' : 'gerado_a_partir_de',
        }

        const result = initialData?.id
          ? await updateDocumentAction(initialData.id, documentInput)
          : await createDocumentAction(documentInput)

        if (result.success) {
          toast.success(
            status === 'enviado' ? 'Documento emitido com sucesso!' : 'Rascunho salvo com sucesso!',
          )
          router.push('/documents')
          router.refresh()
        } else {
          // Erros de campo vindos do servidor (Zod/DB)
          if (result.fieldErrors) {
            for (const [field, messages] of Object.entries(result.fieldErrors)) {
              if (messages[0]) form.setError(field as never, { message: messages[0] })
              toast.error(`${field}: ${messages[0] ?? 'inválido'}`)
            }
          } else {
            toast.error(result.error || 'Não foi possível salvar o documento.')
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[document-studio] erro ao salvar:', error)
        }
        toast.error('Não foi possível salvar o documento. Tente novamente.')
      } finally {
        setIsSaving(false)
      }
    },
    [isSaving, watchedValues, type, docConfig, initialData, router, form],
  )

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
      if (process.env.NODE_ENV === 'development') {
        console.error('[document-studio] erro no PDF:', error)
      }
      toast.error('Erro ao gerar o PDF.')
    } finally {
      setIsPdfLoading(false)
    }
  }

  const canLinkDocuments = type === 'recibo' && !!linkableDocuments?.length

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border backdrop-blur-sm bg-card sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/documents/new">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-accent text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{docConfig.name}</span>
              <h1 className="font-heading text-lg font-bold text-foreground truncate">
                {watchedTitle || 'Novo documento'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave('rascunho')}
              disabled={isSaving}
              className="h-9 rounded-xl px-3 text-xs border-border text-foreground hover:bg-accent gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Salvar Rascunho
            </Button>
            <Button
              size="sm"
              onClick={() => handleSave('enviado')}
              disabled={isSaving}
              aria-busy={isSaving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-9 px-4 font-semibold shadow-sm gap-1.5"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {isSaving ? 'Salvando...' : 'Emitir Documento'}
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
            {canLinkDocuments && <RelatedDocumentPicker form={form} linkableDocuments={linkableDocuments!} />}
            <FieldsComponent
              form={form}
              clients={clients || []}
              companies={companies || []}
              products={products || []}
            />
          </div>

          {/* Right Column: Live A4 Preview (50%) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border sticky lg:top-24">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="font-heading font-bold text-lg text-foreground">
                  Pré-visualização A4
                </h3>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Sincronizado em tempo real
                </span>
              </div>

              {/* A4 Sheet — mantido com fundo branco/texto escuro (documento impresso) */}
              <div ref={sheetWrapRef} className="w-full rounded-lg">
                <div
                  className="relative rounded-lg shadow-xl ring-1 ring-border overflow-hidden bg-white mx-auto"
                  style={{ width: 794 * scale, height: 1123 * scale }}
                >
                  <div
                    className="absolute top-0 left-0 origin-top-left bg-white text-slate-900"
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

/**
 * Seletor de documento de origem (orçamento/OS/proposta) exibido na criação
 * de recibos. Preenche cliente/valor/referência a partir do documento escolhido.
 */
function RelatedDocumentPicker({
  form,
  linkableDocuments,
}: {
  form: any
  linkableDocuments: { id: string; type: string; title: string; totalAmount: number; clientId: string | null }[]
}) {
  const selectedId = form.watch('relatedDocumentIds')
  const selected = linkableDocuments.find((d) => d.id === selectedId)

  function handleChange(id: string) {
    form.setValue('relatedDocumentIds', id || undefined)
    const doc = linkableDocuments.find((d) => d.id === id)
    if (doc) {
      // Pré-preenche dados editáveis a partir do documento de origem
      if (doc.clientId) form.setValue('clientId', doc.clientId)
      if (!form.getValues('title')) {
        form.setValue('title', `Recibo — ${doc.title}`)
      }
      if (doc.totalAmount > 0) {
        form.setValue('amount', doc.totalAmount / 100)
      }
      if (!form.getValues('reference')) {
        form.setValue('reference', `Pagamento referente a ${doc.title}`)
      }
    }
  }

  return (
    <div className="bg-card rounded-3xl p-6 main-container-shadow border border-border space-y-3">
      <h3 className="font-heading font-bold text-base text-foreground">Vincular a documento</h3>
      <p className="text-xs text-muted-foreground">
        Opcional: selecione o orçamento, proposta ou ordem de serviço que este recibo quita.
        Cliente e valor serão preenchidos automaticamente (editáveis).
      </p>
      <select
        value={selectedId || ''}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
      >
        <option value="">Sem vínculo</option>
        {linkableDocuments.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.title} — R$ {(doc.totalAmount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </option>
        ))}
      </select>
    </div>
  )
}
