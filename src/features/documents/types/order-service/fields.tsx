'use client'

import { useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { OrderServiceInput } from './schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Building2, User, Calculator, Clipboard } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'

interface OrderServiceFieldsProps {
  form: UseFormReturn<OrderServiceInput>
  clients: any[]
  companies: any[]
  products: any[]
}

const STATUS_OPTIONS = ['Aberta', 'Em Análise', 'Aguardando Peças', 'Concluída', 'Entregue']

export function OrderServiceFields({ form, clients, companies }: OrderServiceFieldsProps) {
  const { fields: partsFields, append: appendParts, remove: removeParts } = useFieldArray({
    control: form.control,
    name: 'parts',
  })

  const { fields: servicesFields, append: appendServices, remove: removeServices } = useFieldArray({
    control: form.control,
    name: 'services',
  })

  const watchedStatus = useWatch({ control: form.control, name: 'status' }) || 'Aberta'

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

  const partsTotal = partsFields.reduce((acc, field) => {
    const total = Number(field.total || field.quantity * field.unitPrice || 0)
    return acc + total
  }, 0)

  const servicesTotal = servicesFields.reduce((acc, field) => {
    const total = Number(field.total || 0)
    return acc + total
  }, 0)

  const overallTotal = partsTotal + servicesTotal

  return (
    <div className="space-y-6">
      {/* Company & Client */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Empresa e Cliente
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="osNumber" className="text-xs font-semibold text-foreground">
              Número da OS
            </Label>
            <Input
              id="osNumber"
              {...form.register('osNumber')}
              placeholder="OS-2026-001"
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technician" className="text-xs font-semibold text-foreground">
              Técnico Responsável
            </Label>
            <Input
              id="technician"
              {...form.register('technician')}
              placeholder="Ex: João Silva"
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryDate" className="text-xs font-semibold text-foreground">
              Data de Entrada
            </Label>
            <Input
              id="entryDate"
              type="date"
              {...form.register('entryDate')}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
            />
          </div>
        </div>
      </div>

      {/* Equipment Details */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Equipamento / Veículo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...form.register('equipment.name')}
            placeholder="Ex: Ar-condicionado, Carro, Computador"
            className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
          <Input
            {...form.register('equipment.brand')}
            placeholder="Marca"
            className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
          <Input
            {...form.register('equipment.model')}
            placeholder="Modelo"
            className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
          <Input
            {...form.register('equipment.serialNumber')}
            placeholder="Número de Série"
            className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
        </div>
        <Textarea
          {...form.register('equipment.conditionNotes')}
          rows={2}
          placeholder="Observações sobre estado do equipamento..."
          className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
        />
      </div>

      {/* Problem & Diagnosis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
            Defeito Reportado
          </h3>
          <Textarea
            {...form.register('reportedProblem')}
            rows={3}
            placeholder="Descreva o problema ou solicitação do cliente..."
            className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
          />
        </div>
        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
            Diagnóstico Técnico
          </h3>
          <Textarea
            {...form.register('technicalDiagnosis')}
            rows={3}
            placeholder="Laudo técnico e diagnóstico encontrado..."
            className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Peças e Materiais</h3>
            <p className="text-xs text-muted-foreground">Adicione as peças utilizadas no reparo</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => appendParts({ partName: '', quantity: 1, unitPrice: 0, total: 0 })}
            className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" /> Adicionar Peça
          </Button>
        </div>

        {partsFields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted">
            <p className="text-xs text-muted-foreground">Nenhuma peça adicionada ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {partsFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl bg-muted border border-border/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-5 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">Peça / Material</span>
                  <Input
                    {...form.register(`parts.${index}.partName`)}
                    placeholder="Nome da peça..."
                    className="h-10 rounded-xl bg-card border-border text-xs"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">Qtd</span>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    {...form.register(`parts.${index}.quantity`, { valueAsNumber: true })}
                    className="h-10 rounded-xl bg-card border-border text-xs text-center"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">Valor Unit. (R$)</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register(`parts.${index}.unitPrice`, { valueAsNumber: true })}
                    className="h-10 rounded-xl bg-card border-border text-xs text-right"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground block">Subtotal</span>
                  <span className="font-bold text-sm text-foreground block pt-1.5">
                    R$ {(Number(field.quantity || 0) * Number(field.unitPrice || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeParts(index)}
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border/80 flex justify-between items-center">
              <span className="font-semibold text-sm">Total Peças e Materiais</span>
              <span className="font-heading text-xl font-bold">
                R$ {partsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Labor Table */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Mão de Obra / Serviços</h3>
            <p className="text-xs text-muted-foreground">Descreva os serviços e horas executadas</p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => appendServices({ description: '', hours: 0, laborRate: 0, total: 0 })}
            className="bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" /> Adicionar Serviço
          </Button>
        </div>

        {servicesFields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted">
            <p className="text-xs text-muted-foreground">Nenhum serviço adicionado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {servicesFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl bg-muted border border-border/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-6 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">Descrição do Serviço</span>
                  <Input
                    {...form.register(`services.${index}.description`)}
                    placeholder="Ex: Troca de compressor"
                    className="h-10 rounded-xl bg-card border-border text-xs"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">Horas</span>
                  <Input
                    type="number"
                    step="0.25"
                    min="0"
                    {...form.register(`services.${index}.hours`, { valueAsNumber: true })}
                    className="h-10 rounded-xl bg-card border-border text-xs text-center"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">R$ / hora</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register(`services.${index}.laborRate`, { valueAsNumber: true })}
                    className="h-10 rounded-xl bg-card border-border text-xs text-right"
                  />
                </div>
                <div className="sm:col-span-1 space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground block">Total</span>
                  <span className="font-bold text-sm text-foreground block pt-1.5 text-right">
                    R$ {(Number(field.hours || 0) * Number(field.laborRate || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeServices(index)}
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border/80 flex justify-between items-center">
              <span className="font-semibold text-sm">Total Mão de Obra</span>
              <span className="font-heading text-xl font-bold">
                R$ {servicesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        {/* Overall Total */}
        <div className="flex justify-between items-center mt-4 p-4 rounded-2xl bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">Total Geral da OS</span>
          </div>
          <span className="font-heading text-2xl font-bold">
            R$ {overallTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Status da OS
        </h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={watchedStatus === s ? 'default' : 'outline'}
              className="h-9 rounded-xl text-xs font-semibold"
              onClick={() => form.setValue('status', s as any)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Warranty Terms */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Termos de Garantia
        </h3>
        <Textarea
          {...form.register('warrantyTerms')}
          rows={3}
          placeholder="Termos e condições da garantia..."
          className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}
