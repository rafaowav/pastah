'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    { id: 'quote', name: 'Orçamento Comercial (Quote)' },
  ]

  const form = useForm<TemplateInput>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData || {
      name: '',
      documentType: 'quote',
      config: {},
      isGlobal: 'false',
    },
  })

  async function onSubmit(data: TemplateInput) {
    setIsLoading(true)

    try {
      const result = mode === 'create'
        ? await createTemplateAction(data)
        : await updateTemplateAction(initialData!.id!, data)

      if (result.success) {
        toast.success(mode === 'create' ? 'Template criado com sucesso!' : 'Template atualizado!')
        router.push('/templates')
        router.refresh()
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`)
            })
          })
        } else {
          toast.error(result.error as string)
        }
      }
    } catch (error) {
      toast.error('Erro ao salvar template.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <FileStack className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Configuração do Modelo</h3>
            <p className="text-xs text-slate-500">Defina o nome e a estrutura do template</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Nome do Template
            </Label>
            <Input
              id="name"
              placeholder="Ex: Orçamento Padrão para Projetos Web"
              disabled={isLoading}
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600 font-medium">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType" className="text-xs font-semibold text-slate-700">
              Tipo de Documento Base
            </Label>
            <select
              id="documentType"
              disabled={isLoading}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
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
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/templates')}
          className="rounded-xl h-11 px-6 font-medium text-xs border-slate-300 hover:bg-slate-50"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-8 font-semibold text-xs shadow-md gap-2"
        >
          {isLoading ? 'Salvando...' : mode === 'create' ? 'Criar Template' : 'Salvar Alterações'}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
