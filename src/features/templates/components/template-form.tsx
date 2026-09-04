'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { templateSchema, TemplateInput } from '../types'
import { createTemplateAction, updateTemplateAction } from '../actions'
import { ArrowRight, CheckCircle2, FileStack } from 'lucide-react'

interface TemplateFormProps {
  mode: 'create' | 'edit'
  initialData?: TemplateInput & { id?: string }
}

export function TemplateForm({ mode, initialData }: TemplateFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const documentTypes = [
    { id: 'orcamento', name: 'Orçamento Comercial (orcamento)' },
    { id: 'proposta', name: 'Proposta Comercial (proposta)' },
    { id: 'recibo', name: 'Recibo de Pagamento (recibo)' },
    { id: 'ordem-servico', name: 'Ordem de Serviço (ordem-servico)' },
    { id: 'contrato', name: 'Contrato de Prestação de Serviços (contrato)' },
  ]

  const defaultConfig = initialData?.config || {}
  const form = useForm<TemplateInput>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData || {
      name: '',
      documentType: 'orcamento',
      config: {
        observations: '',
        paymentTerms: '',
        validUntil: '',
      },
      isGlobal: 'false',
    },
  })

  async function onSubmit(data: TemplateInput) {
    setIsLoading(true)

    try {
      // Build config from the form state
      const config = {
        ...(data.config || {}),
        observations: form.getValues('config')?.observations || '',
        paymentTerms: form.getValues('config')?.paymentTerms || '',
        validUntil: form.getValues('config')?.validUntil || '',
      }

      const payload: TemplateInput = {
        ...data,
        config,
      }

      const result = mode === 'create'
        ? await createTemplateAction(payload)
        : await updateTemplateAction(initialData!.id!, payload)

      if (result.success) {
        toast.success(mode === 'create' ? 'Template criado com sucesso!' : 'Template atualizado!')
        router.push('/templates')
        router.refresh()
      } else {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`)
            })
          })
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[template-form] erro inesperado:', error)
      }
      toast.error('Não foi possível salvar o template. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-muted pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <FileStack className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Configuração do Modelo</h3>
            <p className="text-xs text-muted-foreground">Defina o nome e a estrutura do template</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground">
              Nome do Template
            </Label>
            <Input
              id="name"
              placeholder="Ex: Orçamento Padrão para Projetos Web"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600 font-medium">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType" className="text-xs font-semibold text-foreground">
              Tipo de Documento Base
            </Label>
            <select
              id="documentType"
              disabled={isLoading}
              className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              {...form.register('documentType')}
            >
              {documentTypes.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
            {form.formState.errors.documentType && (
              <p className="text-xs text-red-600 font-medium">
                {form.formState.errors.documentType.message}
              </p>
            )}
          </div>

          {/* Default Data */}
          <div className="pt-2 border-t border-muted">
            <h4 className="font-heading font-bold text-sm text-foreground mb-4">
              Dados Padrão do Documento
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">
                  Observações Padrão
                </Label>
                <Textarea
                  disabled={isLoading}
                  rows={3}
                  placeholder="Ex: Condições gerais, chave PIX, instruções..."
                  className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                  {...form.register('config.observations')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">
                    Condições de Pagamento Padrão
                  </Label>
                  <Input
                    disabled={isLoading}
                    placeholder="Ex: PIX à vista, 50/50..."
                    className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
                    {...form.register('config.paymentTerms')}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground">
                    Validade Padrão (dias)
                  </Label>
                  <Input
                    disabled={isLoading}
                    placeholder="Ex: 30"
                    className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
                    {...form.register('config.validUntil')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/templates')}
          className="rounded-xl h-11 px-6 font-medium text-xs border-border hover:bg-accent"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-8 font-semibold text-xs shadow-md gap-2"
        >
          {isLoading ? 'Salvando...' : mode === 'create' ? 'Criar Template' : 'Salvar Alterações'}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
