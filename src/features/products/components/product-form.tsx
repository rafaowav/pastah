'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { productSchema, ProductInput } from '../types'
import { createProductAction, updateProductAction } from '../actions'
import { Package, CheckCircle2, DollarSign, Tag, Boxes } from 'lucide-react'

interface ProductFormProps {
  mode: 'create' | 'edit'
  initialData?: ProductInput & { id?: string }
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: '',
      sku: '',
      category: '',
      settings: {},
    },
  })

  async function onSubmit(data: ProductInput) {
    setIsLoading(true)

    try {
      const result = mode === 'create'
        ? await createProductAction(data)
        : await updateProductAction(initialData!.id!, data)

      if (result.success) {
        toast.success(mode === 'create' ? 'Item cadastrado com sucesso!' : 'Item atualizado!')
        router.push('/products')
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
      toast.error('Erro ao salvar item.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Informações do Produto ou Serviço</h3>
            <p className="text-xs text-slate-500">Cadastre a descrição e preço padrão para reutilizar em orçamentos</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Nome do Item / Serviço *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Consultoria Técnica ou Licença Mensal"
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
            <Label htmlFor="description" className="text-xs font-semibold text-slate-700">
              Descrição Detalhada (aparecerá no documento)
            </Label>
            <Input
              id="description"
              placeholder="Ex: Análise de arquitetura, desenvolvimento de protótipo e entrega de relatório"
              disabled={isLoading}
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
              {...form.register('description')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs font-semibold text-slate-700">
                Preço Unitário Padrão (R$) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="1500.00"
                disabled={isLoading}
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
                {...form.register('price')}
              />
              {form.formState.errors.price && (
                <p className="text-xs text-red-600 font-medium">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku" className="text-xs font-semibold text-slate-700">
                Código / SKU
              </Label>
              <Input
                id="sku"
                placeholder="SRV-001"
                disabled={isLoading}
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
                {...form.register('sku')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-semibold text-slate-700">
                Categoria
              </Label>
              <Input
                id="category"
                placeholder="Ex: Consultoria, Design, TI"
                disabled={isLoading}
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
                {...form.register('category')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/products')}
          className="rounded-xl h-11 px-6 font-medium text-xs border-slate-300 hover:bg-slate-50"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-8 font-semibold text-xs shadow-md gap-2"
        >
          {isLoading ? 'Salvando...' : mode === 'create' ? 'Cadastrar Item' : 'Salvar Alterações'}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
