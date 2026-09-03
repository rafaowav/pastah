'use client'

import { useState, useEffect } from 'react'
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

  // Watch form values for real-time preview
  const watchedTitle = useWatch({ control: form.control, name: 'title' }) || ''
  const watchedClientId = useWatch({ control: form.control, name: 'clientId' }) || ''
  const watchedCompanyId = useWatch({ control: form.control, name: 'companyId' }) || ''
  const watchedItems = useWatch({ control: form.control, name: 'items' }) || []
  const watchedObservations = useWatch({ control: form.control, name: 'observations' }) || ''
  const client = clients.find((c) => c.id === watchedClientId)
  const company = companies.find((c) => c.id === watchedCompanyId)

  // Calculate total from watched items
  const total = watchedItems.reduce((acc, item) => {
    const qty = Number(item?.quantity || 0)
    const price = Number(item?.unitPrice || 0)
    return acc + qty * price
  }, 0)

  // Watch items for live calculation
  const totalCalculated = watchedItems.reduce((acc, item) => {
    const qty = Number(item?.quantity || 0)
    const price = Number(item?.unitPrice || 0)
    return acc + qty * price
  }, 0)

  // Auto-fill client data when clientId changes
  useEffect(() => {
    const client = clients.find((c) => c.id === form.getValues('clientId'))
    if (client) {
      form.setValue('clientDocument', client.document || '')
      form.setValue('clientName', client.name)
      form.setValue('clientEmail', client.email || '')
      form.setValue('clientPhone', client.phone || '')
    }
  }, [form.getValues('clientId'), clients])

  // Auto-fill company data when companyId changes
  useEffect(() => {
    const company = companies.find((c) => c.id === form.getValues('companyId'))
    if (company) {
      form.setValue('companyDocument', company.document || '')
      form.setValue('companyName', company.name)
      form.setValue('companyEmail', company.email || '')
      form.setValue('companyPhone', company.phone || '')
      form.setValue('companyWebsite', company.website || '')
    }
  }, [form.getValues('companyId'), companies])

  function handleProductSelect(index: number, productId: string) {
    const product = products.find((p) => p.id === productId)
    if (product) {
      form.setValue(`items.${index}.productId`, product.id)
      form.setValue(`items.${index}.description`, product.description || product.name)
      form.setValue(`items.${index}.unitPrice`, Number(product.price || 0))
    }
  }

  // Handle client select to auto-fill
  const handleClientSelect = (value: string) => {
    form.setValue('clientId', value)
    const client = clients.find((c) => c.id === value)
    if (client) {
      form.setValue('clientDocument', client.document || '')
      form.setValue('clientName', client.name)
      form.setValue('clientEmail', client.email || '')
      form.setValue('clientPhone', client.phone || '')
    }
  }

  // Handle company select to auto-fill
  const handleCompanySelect = (value: string) => {
    form.setValue('companyId', value)
    const company = companies.find((c) => c.id === value)
    if (company) {
      form.setValue('companyDocument', company.document || '')
      form.setValue('companyName', company.name)
      form.setValue('companyEmail', company.email || '')
      form.setValue('companyPhone', company.phone || '')
      form.setValue('companyWebsite', company.website || '')
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Details Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Informações Básicas do Orçamento
        </h3>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs font-semibold text-foreground">
            Título do Orçamento
          </Label>
          <Input
            id="title"
            {...form.register('title')}
            placeholder="Ex: Orçamento #2026-001 — Projeto Web"
            className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
          {form.formState.errors.title && (
            <p className="text-xs text-red-600 font-medium">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" /> Cliente Destinatário
            </Label>
            <select
              id="clientId"
              {...form.register('clientId')}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900"
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
            {form.getValues('clientId') && (
              <div className="mt-2 p-3 bg-muted rounded border border-border/50 text-xs">
                <div className="font-medium text-foreground">{form.getValues('clientName')}</div>
                <div className="text-muted-foreground">{form.getValues('clientDocument') || 'CPF não informado'}</div>
                <div className="text-muted-foreground">{form.getValues('clientEmail') || 'Sem e-mail'}</div>
                <div className="text-muted-foreground">{form.getValues('clientPhone') || 'Sem telefone'}</div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> Empresa Emissora
            </Label>
            <select
              id="companyId"
              {...form.register('companyId')}
              onChange={(e) => handleCompanySelect(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900"
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
            {form.getValues('companyId') && (
              <div className="mt-2 p-3 bg-muted rounded border border-border/50 text-xs">
                <div className="font-medium text-foreground">{form.getValues('companyName')}</div>
                <div className="text-muted-foreground">{form.getValues('companyDocument') || 'CNPJ não informado'}</div>
                <div className="text-muted-foreground">{form.getValues('companyEmail') || 'Sem e-mail'}</div>
                <div className="text-muted-foreground">{form.getValues('companyPhone') || 'Sem telefone'}</div>
                <div className="text-muted-foreground">{form.getValues('companyWebsite') || 'Sem website'}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Itens e Serviços</h3>
            <p className="text-xs text-muted-foreground">Discrimine os itens, quantidades e valores unitários</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => append({ productId: '', description: '', quantity: 1, unitPrice: 0 })}
            className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" /> Adicionar Item
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted">
            <p className="text-xs text-muted-foreground">Nenhum item adicionado ainda.</p>
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
                  className="p-4 rounded-2xl bg-muted border border-border/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground sm:hidden">Produto / Descrição</span>
                    <select
                      {...form.register(`items.${index}.productId`)}
                      onChange={(e) => handleProductSelect(index, e.target.value)}
                      className="w-full h-10 rounded-xl border border-border bg-card px-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                      className="h-9 rounded-xl bg-card border-border text-xs mt-1"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Qtd</span>
                    <Input
                      type="number"
                      step="any"
                      min="1"
                      {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="Qtd"
                      className="h-10 rounded-xl bg-card border-border text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Valor Unitário (R$)</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      placeholder="0,00"
                      className="h-10 rounded-xl bg-card border-border text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1 text-right">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Subtotal</span>
                    <span className="font-heading font-bold text-sm text-foreground block pt-1.5">
                      R$ {itemSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}

            {/* Total Footer */}
            <div className="p-5 rounded-2xl bg-primary text-primary-foreground flex justify-between items-center mt-4">
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
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-3">
        <Label htmlFor="observations" className="text-xs font-semibold text-foreground">
          Observações, Prazos e Condições Comerciais
        </Label>
        <textarea
          id="observations"
          {...form.register('observations')}
          rows={4}
          placeholder="Ex: Prazo de entrega: 15 dias úteis. Condições de pagamento: 50% de entrada e 50% na conclusão."
          className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
        />
      </div>

      {/* A4 Preview Sheet */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6 border-t border-border/80">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Pré-visualização A4
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-foreground">Tipo</p>
            <p className="font-medium text-foreground text-blue-600 uppercase text-xs tracking-wider">{'ORÇAMENTO'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Título</p>
            <p className="font-medium text-foreground">{watchedTitle || 'Digite um título'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold text-foreground">Cliente</p>
            <p className="font-medium text-foreground">{client?.name || 'Selecione um cliente'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Empresa</p>
            <p className="font-medium text-foreground">{company?.name || 'Selecione uma empresa'}</p>
          </div>
        </div>

        {watchedItems.length > 0 && (
          <div className="border-t border-border/80 pt-6 mb-6">
            <h4 className="font-semibold text-sm text-muted-foreground mb-4">Itens</h4>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left">Descrição</th>
                  <th className="py-2 text-right">Qtd</th>
                  <th className="py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {watchedItems.map((item: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 text-left">{item.description || ''}</td>
                    <td className="py-2 text-right">{item.quantity || 1}</td>
                    <td className="py-2 text-right">R$ {Number(item.unitPrice || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right font-bold py-2">Total:</td>
                <td className="text-right font-bold">R$ {total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </div>
        )}

        {watchedObservations && (
          <p className="text-muted-foreground italic text-sm">{watchedObservations}</p>
        )}
      </div>
    </div>
  )
}
