'use client'

import { useState, useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { OrcamentoInput } from './schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Building2, User, FileText, DollarSign, Calculator } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'

interface OrcamentoFieldsProps {
  form: UseFormReturn<OrcamentoInput>
  clients: any[]
  companies: any[]
  products: any[]
}

export function OrcamentoFields({ form, clients, companies, products }: OrcamentoFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const watchedTitle = useWatch({ control: form.control, name: 'title' }) || ''
  const watchedClientId = useWatch({ control: form.control, name: 'clientId' }) || ''
  const watchedCompanyId = useWatch({ control: form.control, name: 'companyId' }) || ''
  const watchedItems = useWatch({ control: form.control, name: 'items' }) || []
  const watchedDescontoTotal = useWatch({ control: form.control, name: 'descontoTotal' }) || 0
  const client = clients.find((c) => c.id === watchedClientId)
  const company = companies.find((c) => c.id === watchedCompanyId)

  useEffect(() => {
    const client = clients.find((c) => c.id === form.getValues('clientId'))
    if (client) {
      form.setValue('clientId', client.id)
    }
  }, [form.getValues('clientId'), clients])

  useEffect(() => {
    const company = companies.find((c) => c.id === form.getValues('companyId'))
    if (company) {
      form.setValue('companyId', company.id)
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

  // Calculate subtotal in real-time
  const calculateSubtotal = (item: any) => {
    const qty = Number(item.quantity || 1)
    const price = Number(item.unitPrice || 0)
    const discount = Number(item.discountPercent || 0)
    const subtotal = qty * price * (1 - discount / 100)
    return subtotal.toFixed(2)
  }

  // Calculate totals
  const subtotal = watchedItems.reduce((acc, item) => {
    return acc + Number(calculateSubtotal(item))
  }, 0)

  const totalDiscount = watchedItems.reduce((acc, item) => {
    const qty = Number(item.quantity || 1)
    const price = Number(item.unitPrice || 0)
    const discount = Number(item.discountPercent || 0)
    acc += qty * price * (discount / 100)
    return acc
  }, 0)

  const total = Math.max(0, subtotal - totalDiscount)

  return (
    <div className="space-y-6">
      {/* Basic Details Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Informações do Orçamento
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-semibold text-foreground">
              Título do Orçamento
            </Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Ex: Orçamento #2026-001 — Projeto Web"
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyId" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> Empresa Emissora
            </Label>
            <select
              id="companyId"
              {...form.register('companyId')}
              className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecione sua empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" /> Cliente
            </Label>
            <select
              id="clientId"
              {...form.register('clientId')}
              className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil" className="text-xs font-semibold text-foreground">
              Validade
            </Label>
            <Input
              id="validUntil"
              {...form.register('validUntil')}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentTerms" className="text-xs font-semibold text-foreground">
              Termos de Pagamento
            </Label>
            <select
              id="paymentTerms"
              {...form.register('paymentTerms')}
              className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecione</option>
              <option value="PIX à vista">PIX à vista</option>
              <option value="50/50">50/50</option>
              <option value="Cartão até 12x">Cartão até 12x</option>
              <option value="Boleto 30 dias">Boleto 30 dias</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryTime" className="text-xs font-semibold text-foreground">
              Tempo de Entrega
            </Label>
            <Input
              id="deliveryTime"
              {...form.register('deliveryTime')}
              placeholder="Ex: 15 dias úteis"
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations" className="text-xs font-semibold text-foreground">
            Observações
          </Label>
<Input
              id="observations"
              {...form.register('observations' as any)}
              placeholder="Condições especiais, observações fiscais..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
            />
</div>

        <div className="space-y-2">
          <Label htmlFor="descontoTotal" className="text-xs font-semibold text-foreground">
            Desconto Total
          </Label>
          <Input
            id="descontoTotal"
            {...form.register('descontoTotal' as any)}
            type="number"
            step="0.01"
            min="0"
            {...form.register('descontoTotal', { valueAsNumber: true })}
            className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent text-right"
          />
        </div>
      </div>

      {/* Items Table Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-muted pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Itens e Serviços</h3>
            <p className="text-xs text-muted-foreground">Discrimine os itens, quantidades e valores unitários</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => append({ productId: '', description: '', quantity: 1, unitPrice: 0, discountPercent: 0 })}
            className="bg-primary hover:bg-primary/80 text-primary-foreground rounded-xl text-xs font-semibold gap-1.5 h-9"
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
              onClick={() => append({ productId: '', description: '', quantity: 1, unitPrice: 0, discountPercent: 0 })}
              className="mt-3 rounded-xl text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Primeiro Item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => {
              const itemQuantity = Number(field.quantity || 1)
              const itemUnitPrice = Number(field.unitPrice || 0)
              const itemDiscount = Number(field.discountPercent || 0)
              const itemSubtotal = itemQuantity * itemUnitPrice * (1 - itemDiscount / 100)

              return (
                <div
                  key={field.id}
                  className="p-4 rounded-2xl bg-muted border border-border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground sm:hidden">Produto / Descrição</span>
                    <select
                      {...form.register(`items.${index}.productId`)}
                      onChange={(e) => handleProductSelect(index, e.target.value)}
                      className="w-full h-10 rounded-xl border border-border bg-card px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
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
                    <span className="text-[11px] font-semibold text-muted-foreground">Valor Unit. (R$)</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      placeholder="0,00"
                      className="h-10 rounded-xl bg-card border-border text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Desc. %</span>
                    <Input
                      type="number"
                      step="any"
                      min="0"
                      max="100"
                      {...form.register(`items.${index}.discountPercent`, { valueAsNumber: true })}
                      placeholder="0%"
                      className="h-10 rounded-xl bg-card border-border text-xs text-center"
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
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-accent"
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
                <span className="font-semibold text-sm">Subtotal</span>
              </div>
              <span>
                <span className="font-medium text-sm">Desconto</span>
                R$ {totalDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="font-heading text-2xl font-bold text-primary-foreground tracking-tight">
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Observations Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border space-y-3">
        <Label htmlFor="observations" className="text-xs font-semibold text-foreground">
          Observações, Prazos e Condições Comerciais
        </Label>
<Input
          id="observations"
          {...form.register('observations' as any)}
          placeholder="Condições de entrega, observações fiscais, etc."
          className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
</div>
    </div>
  )
}