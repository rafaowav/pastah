'use client'

import { useState, useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { ReceiptInput } from './schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useFieldArray } from 'react-hook-form'
import { Plus, Trash2, User, Building2, DollarSign, Calendar, Zap, CreditCard } from 'lucide-react'

interface ReceiptFieldsProps {
  form: UseFormReturn<ReceiptInput>
  clients: any[]
  companies: any[]
}

export function ReceiptFields({ form, clients, companies }: ReceiptFieldsProps) {
  const watchedReceiptNumber = useWatch({ control: form.control, name: 'receiptNumber' }) || ''
  const watchedAmount = useWatch({ control: form.control, name: 'amount' }) || 0
  const watchedAmountInWords = useWatch({ control: form.control, name: 'amountInWords' }) || ''
  const watchedReference = useWatch({ control: form.control, name: 'reference' }) || ''
  const watchedPaymentDate = useWatch({ control: form.control, name: 'paymentDate' }) || ''
  const watchedPaymentMethod = useWatch({ control: form.control, name: 'paymentMethod' }) || ''
  const client = clients.find((c) => c.id === form.getValues('clientId'))
  const company = companies.find((c) => c.id === form.getValues('companyId'))

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

  const handleAmountChange = (value: number) => {
    form.setValue('amount', value)
    // Auto-generate amount in words if empty
    if (!watchedAmountInWords) {
      const numberToWords = (num: number) => {
        const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']
        const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']
        const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
        const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos']

        if (num === 0) return 'zero reais'
        if (num < 0) return 'negativo'

        let result = ''
        const absNum = Math.abs(num)
        const hundredPart = Math.floor(absNum / 100)
        const remainder = absNum % 100

        if (hundredPart > 0) {
          result += hundreds[hundredPart]
          if (remainder > 0) result += ' e '
        }

        if (remainder < 10) {
          result += units[remainder]
        } else if (remainder < 20) {
          result += teens[remainder - 10]
        } else {
          const tenPart = Math.floor(remainder / 10)
          const unitPart = remainder % 10
          result += tens[tenPart]
          if (unitPart > 0) result += ` ${units[unitPart]}`
        }

        return `${result} reais`
      }
      form.setValue('amountInWords', numberToWords(value))
    }
  }

  return (
    <div className="space-y-6">
      {/* Recipient & Payer Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
            Dados do Emissor
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emissorNome" className="text-xs font-semibold text-foreground">
                Nome
              </Label>
              <Input
                id="emissorNome"
                {...form.register('emissorNome' as any)}
                placeholder="Nome da pessoa ou empresa emissora"
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
              />
            </div>
            <div>
              <Label htmlFor="emissorCNPJ" className="text-xs font-semibold text-foreground">
                CNPJ
              </Label>
              <Input
                id="emissorCNPJ"
                {...form.register('emissorCNPJ' as any)}
                type="text"
                placeholder="00.000.000/0000-00"
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
            Dados do Pagador
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pagadorNome" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" /> Nome
              </Label>
              <Input
                id="pagadorNome"
                {...form.register('pagadorNome' as any)}
                placeholder="Nome quem pagou"
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
              />
            </div>
            <div>
              <Label htmlFor="pagadorCPF" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" /> CPF
              </Label>
              <Input
                id="pagadorCPF"
                {...form.register('pagadorCPF' as any)}
                type="text"
                placeholder="000.000.000-00"
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recibo Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-3xl p-4 main-container-shadow border border-border/80">
          <Label htmlFor="receiptNumber" className="text-xs font-semibold text-foreground">Número do Recibo</Label>
          <Input
            id="receiptNumber"
            {...form.register('receiptNumber' as any)}
            placeholder="#REC-2026-001"
            className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
        </div>

        <div className="bg-card rounded-3xl p-4 main-container-shadow border border-border/80">
          <Label htmlFor="amount" className="text-xs font-semibold text-foreground">Valor (R$)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...form.register('amount', { valueAsNumber: true })}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (!isNaN(val)) {
                handleAmountChange(val)
              }
            }}
            className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card text-right"
          />
        </div>

        <div className="bg-card rounded-3xl p-4 main-container-shadow border border-border/80">
          <Label htmlFor="amountInWords" className="text-xs font-semibold text-foreground">Valor por Extenso</Label>
          <Input
            id="amountInWords"
            {...form.register('amountInWords' as any)}
            placeholder="Digite o valor por extenso (opcional)"
            className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
        </div>

        <div className="bg-card rounded-3xl p-4 main-container-shadow border border-border/80">
          <Label htmlFor="dataPagamento" className="text-xs font-semibold text-foreground">Data do Pagamento</Label>
          <Input
            id="dataPagamento"
            {...form.register('paymentDate' as any)}
            className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
        </div>

        <div className="bg-card rounded-3xl p-4 main-container-shadow border border-border/80">
          <Label htmlFor="meioPagamento" className="text-xs font-semibold text-foreground">Meio de Pagamento</Label>
          <select
            id="meioPagamento"
            {...form.register('paymentMethod' as any)}
            className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Selecione o meio</option>
            <option value="PIX">PIX (Chave: ...)</option>
            <option value="Transferência Bancária">Transferência Bancária</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
          </select>
        </div>
      </div>

      {/* Referente a */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
        <Label htmlFor="referenteA" className="text-xs font-semibold text-foreground">
          Referente a
        </Label>
        <Textarea
          {...form.register('reference' as any)}
          placeholder="Descrição detalhada do que foi pago"
          rows={3}
          className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
        />
      </div>

      {/* City & Date */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-3xl p-4 main-container-shadow border border-border/80">
          <Label htmlFor="cidade" className="text-xs font-semibold text-foreground">Cidade</Label>
          <Input
            id="cidade"
            {...form.register('city' as any)}
            placeholder="Ex: São Paulo"
            className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
        </div>
        <div className="bg-card rounded-3xl p-4 main-container-shadow border border-border/80">
          <Label htmlFor="data" className="text-xs font-semibold text-foreground">Data</Label>
          <Input
            id="data"
            type="date"
            {...form.register('paymentDate' as any)}
            className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
          />
        </div>
      </div>

      {/* Payment Method Stamps */}
      <div className="grid grid-cols-2 gap-2">
        {['PIX', 'Transferência Bancária', 'Dinheiro', 'Cartão de Crédito'].map((m) => (
          <div
            key={m}
            className={`p-2 rounded bg-muted text-xs ${
              watchedPaymentMethod === m ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {m}
          </div>
        ))}
      </div>
    </div>
  )
}