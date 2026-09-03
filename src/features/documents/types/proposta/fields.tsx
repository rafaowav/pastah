'use client'

import { useState, useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { PropostaInput } from './schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Building2, User, FileText, DollarSign, Calculator } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'

interface PropostaFieldsProps {
  form: UseFormReturn<PropostaInput>
  clients: any[]
  companies: any[]
  products: any[]
}

export function PropostaFields({ form, clients, companies, products }: PropostaFieldsProps) {
  const { fields: scopeFields, append: appendScope, remove: removeScope } = useFieldArray({
    control: form.control,
    name: 'scope',
  })

  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
    control: form.control,
    name: 'timeline',
  })

  const { fields: investmentFields, append: appendInvestment, remove: removeInvestment } = useFieldArray({
    control: form.control,
    name: 'investment',
  })

  const watchedTitle = useWatch({ control: form.control, name: 'title' }) || ''
  const watchedClientId = useWatch({ control: form.control, name: 'clientId' }) || ''
  const watchedCompanyId = useWatch({ control: form.control, name: 'companyId' }) || ''

  useEffect(() => {
    const client = clients.find((c) => c.id === form.getValues('clientId'))
    if (client) {
      form.setValue('clientName', client.name)
      form.setValue('clientDocument', client.document || '')
    }
  }, [form.getValues('clientId'), clients])

  useEffect(() => {
    const company = companies.find((c) => c.id === form.getValues('companyId'))
    if (company) {
      form.setValue('companyName', company.name)
      form.setValue('companyDocument', company.document || '')
    }
  }, [form.getValues('companyId'), companies])

  // Calculate total investment
  const totalInvestment = investmentFields.reduce((acc, item) => {
    const amount = Number(item.amount || 0)
    return acc + amount
  }, 0)

  return (
    <div className="space-y-6">
      {/* Basic Details Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-muted pb-3">
          Informações da Proposta
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-semibold text-foreground">
              Título do Projeto
            </Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Ex: Proposta de Desenvolvimento de Sistema Web"
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
              className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900"
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
              className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900"
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
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
            />
          </div>
        </div>
      </div>

      {/* Introduction & Objectives */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Apresentação & Diagnóstico
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="introduction" className="text-xs font-semibold text-foreground">
              Apresentação Executiva
            </Label>
            <Textarea
              id="introduction"
              {...form.register('introduction' as any)}
              rows={4}
              placeholder="Breve descrição sobre a empresa e a oportunidade..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives" className="text-xs font-semibold text-foreground">
              Objetivos do Projeto
            </Label>
            <Textarea
              id="objectives"
              {...form.register('objectives' as any)}
              rows={4}
              placeholder="Objetivos principais e expected outcomes..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Scope Builder */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Escopo & Entregáveis
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span>Adicionar Fase/Entregável</span>
          <Button
            type="button"
            size="sm"
            onClick={() => appendScope({ title: '', description: '', deliverables: '' })}
            className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>

        {scopeFields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted">
            <p className="text-xs text-muted-foreground">Nenhuma fase adicionada ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scopeFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl bg-muted border border-border/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-8">
                  <Input
                    {...form.register(`scope.${index}.title`)}
                    placeholder="Título da fase..."
                    className="h-10 rounded-xl bg-card border-border text-xs"
                  />
                </div>
                <div className="sm:col-span-4">
                  <Input
                    {...form.register(`scope.${index}.description`)}
                    placeholder="Descrição do entregável..."
                    className="h-10 rounded-xl bg-card border-border text-xs"
                  />
                </div>
                <div className="sm:col-span-4">
                  <Input
                    {...form.register(`scope.${index}.deliverables`)}
                    placeholder="Entregáveis..."
                    className="h-10 rounded-xl bg-card border-border text-xs"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeScope(index)}
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Builder */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Cronograma de Execução
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span>Adicionar Fase/Cronograma</span>
          <Button
            type="button"
            size="sm"
            onClick={() => appendTimeline({ phase: '', duration: '', milestone: '' })}
            className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>

        {timelineFields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted">
            <p className="text-xs text-muted-foreground">Nenhuma fase de cronograma adicionada ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {timelineFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl bg-muted border border-border/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-6">
                  <Input
                    {...form.register(`timeline.${index}.phase`)}
                    placeholder="Fase..."
                    className="h-10 rounded-xl bg-card border-border text-xs"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    {...form.register(`timeline.${index}.duration`, { valueAsNumber: true })}
                    placeholder="Duração"
                    className="h-10 rounded-xl bg-card border-border text-xs text-center"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    {...form.register(`timeline.${index}.milestone`)}
                    placeholder="Marcos..."
                    className="h-10 rounded-xl bg-card border-border text-xs text-center"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeline(index)}
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Investment Table */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Investimento & Condições Comerciais
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span>Adicionar Item de Investimento</span>
          <Button
            type="button"
            size="sm"
            onClick={() => appendInvestment({ item: '', amount: 0, condition: '' })}
            className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>

        {investmentFields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted">
            <p className="text-xs text-muted-foreground">Nenhum item de investimento adicionado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {investmentFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl bg-muted border border-border/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-6">
                  <Input
                    {...form.register(`investment.${index}.item`)}
                    placeholder="Item/Serviço..."
                    className="h-10 rounded-xl bg-card border-border text-xs"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register(`investment.${index}.amount`, { valueAsNumber: true })}
                    placeholder="Valor (R$)"
                    className="h-10 rounded-xl bg-card border-border text-xs text-right"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    {...form.register(`investment.${index}.condition`)}
                    placeholder="Condição..."
                    className="h-10 rounded-xl bg-card border-border text-xs"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInvestment(index)}
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-border/80 flex justify-between items-center">
              <span className="font-semibold">Total Investimento</span>
              <span className="font-heading text-2xl font-bold text-foreground">
                R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Terms & Acceptance */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-3">
        <Label htmlFor="terms" className="text-xs font-semibold text-foreground">
          Termos e Condições
        </Label>
        <Textarea
          id="terms"
          {...form.register('terms' as any)}
          rows={4}
          placeholder="Condições de pagamento, garantias, direitos autorais..."
          className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}