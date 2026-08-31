'use client'

import { UseFormReturn, useWatch } from 'react-hook-form'
import { QuoteInput } from './schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Building2, User, FileText, DollarSign, Calculator } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'

interface QuoteFieldsProps {
  form: UseFormReturn<QuoteInput>
  clients: any[]
  companies: any[]
  products: any[]
}

export function QuoteFields({ form, clients, companies, products }: QuoteFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  // Watch items for live calculation
  const watchedItems = useWatch({
    control: form.control,
    name: 'items',
  }) || []

  const totalCalculated = watchedItems.reduce((acc, item) => {
    const qty = Number(item?.quantity || 0)
    const price = Number(item?.unitPrice || 0)
    return acc + qty * price
  }, 0)

  function handleProductSelect(index: number, productId: string) {
    const product = products.find((p) => p.id === productId)
    if (product) {
      form.setValue(`items.${index}.productId`, product.id)
      form.setValue(`items.${index}.description`, product.description || product.name)
      form.setValue(`items.${index}.unitPrice`, Number(product.price || 0))
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
          Informações Básicas do Orçamento
        </h3>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-semibold text-slate-700">
            Título do Orçamento
          </Label>
          <Input
            id="title"
            {...form.register('title')}
            placeholder="Ex: Orçamento #2026-001 — Projeto Web"
            className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
          />
          {form.formState.errors.title && (
            <p className="text-xs text-red-600 font-medium">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Cliente Destinatário
            </Label>
            <select
              id="clientId"
              {...form.register('clientId')}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Selecione um cliente cadastrado</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.email ? `(${client.email})` : ''}
                </option>
              ))}
            </select>
            {form.formState.errors.clientId && (
              <p className="text-xs text-red-600 font-medium">{form.formState.errors.clientId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Empresa Emissora
            </Label>
            <select
              id="companyId"
              {...form.register('companyId')}
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Selecione sua empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {form.formState.errors.companyId && (
              <p className="text-xs text-red-600 font-medium">{form.formState.errors.companyId.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Itens e Serviços</h3>
            <p className="text-xs text-slate-500">Discrimine os itens, quantidades e valores unitários</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => append({ productId: '', description: '', quantity: 1, unitPrice: 0 })}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" /> Adicionar Item
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-xs text-slate-500">Nenhum item adicionado ainda.</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ productId: '', description: '', quantity: 1, unitPrice: 0 })}
              className="mt-3 rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Primeiro Item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => {
              const itemQuantity = Number(watchedItems[index]?.quantity || 1)
              const itemUnitPrice = Number(watchedItems[index]?.unitPrice || 0)
              const itemSubtotal = itemQuantity * itemUnitPrice

              return (
                <div
                  key={field.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 sm:hidden">Produto / Descrição</span>
                    <select
                      {...form.register(`items.${index}.productId`)}
                      onChange={(e) => handleProductSelect(index, e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">Item Personalizado</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (R$ {Number(product.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                    <Input
                      {...form.register(`items.${index}.description`)}
                      placeholder="Descrição do item ou serviço..."
                      className="h-9 rounded-xl bg-white border-slate-200 text-xs mt-1"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500">Qtd</span>
                    <Input
                      type="number"
                      step="any"
                      min="1"
                      {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="Qtd"
                      className="h-10 rounded-xl bg-white border-slate-200 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500">Valor Unitário (R$)</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      placeholder="0,00"
                      className="h-10 rounded-xl bg-white border-slate-200 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1 text-right">
                    <span className="text-[11px] font-semibold text-slate-500 block">Subtotal</span>
                    <span className="font-heading font-bold text-sm text-slate-900 block pt-1.5">
                      R$ {itemSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}

            {/* Total Footer */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-sm">Valor Total do Orçamento</span>
              </div>
              <span className="font-heading text-2xl font-bold text-white tracking-tight">
                R$ {totalCalculated.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Observations Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-3">
        <Label htmlFor="observations" className="text-xs font-semibold text-slate-700">
          Observações, Prazos e Condições Comerciais
        </Label>
        <textarea
          id="observations"
          {...form.register('observations')}
          rows={4}
          placeholder="Ex: Prazo de entrega: 15 dias úteis. Condições de pagamento: 50% de entrada e 50% na conclusão."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-slate-400"
        />
      </div>
    </div>
  )
}
