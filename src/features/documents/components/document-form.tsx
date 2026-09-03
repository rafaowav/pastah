'use client'

import { useState } from 'react'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getDocument } from '@/lib/document-engine/registry'
import { createDocumentAction } from '../actions'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

interface DocumentFormProps {
  mode: 'create' | 'edit'
  type: string
  clients: any[]
  companies: any[]
  products: any[]
  initialData?: any
}

export function DocumentForm({ mode, type, clients, companies, products, initialData }: DocumentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const docConfig = getDocument(type)
  const FieldsComponent = docConfig.fields

  const form = useForm<FieldValues>({
    resolver: zodResolver(docConfig.schema as any),
    defaultValues: initialData || {
      title: '',
      clientId: '',
      companyId: '',
      items: [],
      observations: '',
    },
  })

  async function onSubmit(data: FieldValues) {
    setIsLoading(true)

    try {
      const result = await createDocumentAction({ type, ...data })

      if (result.success) {
        toast.success('Documento salvo com sucesso!')
        router.push('/documents')
        router.refresh()
      } else {
        toast.error(result.error || 'Erro ao salvar documento.')
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao salvar o documento.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldsComponent form={form as any} clients={clients} companies={companies} products={products} />

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/documents')}
          className="rounded-xl h-11 px-6 font-medium text-xs border-border hover:bg-accent"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-8 font-semibold text-xs shadow-md gap-2"
        >
          {isLoading ? (
            'Salvando Documento...'
          ) : (
            <>
              {mode === 'create' ? 'Salvar e Gerar Documento' : 'Salvar Alterações'}
              <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
