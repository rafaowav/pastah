'use client'

import { useState, useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { contractSchema } from './schema'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

interface ContractFieldsProps {
  form: any
  companies: any[]
  clients: any[]
}

export function ContractFields({ form, companies, clients }: ContractFieldsProps) {
  const watchedClause1 = useWatch({ control: form.control, name: 'clauses.clause1Object' }) || ''
  const watchedClause2 = useWatch({ control: form.control, name: 'clauses.clause2ObligationsContractor' }) || ''
  const watchedClause3 = useWatch({ control: form.control, name: 'clauses.clause3ObligationsClient' }) || ''
  const watchedClause4 = useWatch({ control: form.control, name: 'clauses.clause4Payment' }) || ''
  const watchedClause5 = useWatch({ control: form.control, name: 'clauses.clause5DurationTermination' }) || ''
  const watchedClause6 = useWatch({ control: form.control, name: 'clauses.clause6Jurisdiction' }) || ''
  const contractorRep = form.getValues('contractorRepresentative')
  const clientRep = form.getValues('clientRepresentative')

  useEffect(() => {
    const client = clients.find((c) => c.id === form.getValues('clientId'))
    if (client) {
      ;(form as any).setValue('clientId', client.id)
    }
  }, [form.getValues('clientId'), clients])

  useEffect(() => {
    const company = companies.find((c) => c.id === form.getValues('companyId'))
    if (company) {
      ;(form as any).setValue('companyId', company.id)
    }
  }, [form.getValues('companyId'), companies])

  return (
    <div className="space-y-6">
      {/* Contract Title */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Título do Contrato
        </h3>
        <Input
          {...form.register('contractTitle' as any)}
          placeholder="Ex: CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE SOFTWARE"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
      </div>

      {/* Parties Qualification - Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
            Qualificação da Contratada
          </h3>
<Input
          {...form.register('contractorRepresentative.name' as any)}
          placeholder="Nome da empresa ou pessoa física"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
<Input
          {...form.register('contractorRepresentative.cpf' as any)}
          type="text"
          placeholder="00.000.000/0000-00"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
<Input
          {...form.register('contractorRepresentative.endereco' as any)}
          placeholder="Endereço"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
<Input
          {...form.register('contractorRepresentative.role' as any)}
          placeholder="Função/Cargo"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
        </div>

        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-4">
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
            Qualificação do Contratante
          </h3>
<Input
          {...form.register('clientRepresentative.name' as any)}
          placeholder="Nome do cliente"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
<Input
          {...form.register('clientRepresentative.cpf' as any)}
          type="text"
          placeholder="000.000.000-00"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
<Input
          {...form.register('clientRepresentative.endereco' as any)}
          placeholder="Endereço"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
<Input
          {...form.register('clientRepresentative.role' as any)}
          placeholder="Função/Cargo"
          className="w-full h-11 rounded-xl bg-muted border-border text-sm focus:bg-card"
        />
        </div>
      </div>

      {/* Clauses */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Cláusulas do Contrato
        </h3>

        <div className="space-y-4">
          <div className="bg-card rounded-3xl p-5 sm:p-8 main-container-shadow border border-border/80 space-y-3">
            <h4 className="font-heading font-bold text-lg text-foreground border-b border-border pb-2">
              CLÁUSULA PRIMEIRA - DO OBJETO
            </h4>
            <Textarea
              {...form.register('clauses.clause1Object' as any)}
              rows={3}
              placeholder="Descrição do objeto deste contrato..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card rounded-3xl p-5 sm:p-8 main-container-shadow border border-border/80 space-y-3">
            <h4 className="font-heading font-bold text-lg text-foreground border-b border-border pb-2">
              CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA
            </h4>
            <Textarea
              {...form.register('clauses.clause2ObligationsContractor' as any)}
              rows={3}
              placeholder="Obrigações da empresa contratada..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card rounded-3xl p-5 sm:p-8 main-container-shadow border border-border/80 space-y-3">
            <h4 className="font-heading font-bold text-lg text-foreground border-b border-border pb-2">
              CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATANTE
            </h4>
            <Textarea
              {...form.register('clauses.clause3ObligationsClient' as any)}
              rows={3}
              placeholder="Obrigações do cliente contratante..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card rounded-3xl p-5 sm:p-8 main-container-shadow border border-border/80 space-y-3">
            <h4 className="font-heading font-bold text-lg text-foreground border-b border-border pb-2">
              CLÁUSULA QUARTA - DO PREÇO, PRAZOS E MULTAS
            </h4>
            <Textarea
              {...form.register('clauses.clause4Payment' as any)}
              rows={3}
              placeholder="Preço, prazos de pagamento e multas por atraso..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card rounded-3xl p-5 sm:p-8 main-container-shadow border border-border/80 space-y-3">
            <h4 className="font-heading font-bold text-lg text-foreground border-b border-border pb-2">
              CLÁUSULA QUINTA - VIGÊNCIA E RESCISÃO
            </h4>
            <Textarea
              {...form.register('clauses.clause5DurationTermination' as any)}
              rows={3}
              placeholder="Vigência do contrato e condições de rescisão..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card rounded-3xl p-5 sm:p-8 main-container-shadow border border-border/80 space-y-3">
            <h4 className="font-heading font-bold text-lg text-foreground border-b border-border pb-2">
              CLÁUSULA SEXTA - FORO E COMARCA
            </h4>
            <Textarea
              {...form.register('clauses.clause6Jurisdiction' as any)}
              rows={3}
              placeholder="Foro e comarca eleitos para dirimir dúvidas..."
              className="w-full rounded-2xl border border-border bg-muted p-4 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-slate-900 placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Witnesses Section */}
      {form.getValues('witnesses') && form.getValues('witnesses').length > 0 && (
        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
          <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
            Testemunhas
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {form.getValues('witnesses').map((witness: any, index: number) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-muted border border-border/80"
              >
                <Input
                  {...form.register(`witnesses.${index}.name` as any)}
                  placeholder="Nome da testemunha"
                  className="w-full h-10 rounded-xl bg-card border-border text-xs"
                />
                <Input
                  {...form.register(`witnesses.${index}.cpf` as any)}
                  type="text"
                  placeholder="CPF (opcional)"
                  className="w-full h-10 rounded-xl bg-card border-border text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signature Section */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6 border-t border-border/80">
        <h3 className="font-heading font-bold text-lg text-foreground border-b border-border pb-3">
          Assinaturas
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-sm text-foreground">Contratada</h4>
            <div className="border-t border-b border-border/80 pt-4 pb-4 mb-4">
              <div className="text-xs text-muted-foreground">Assinatura</div>
              <div className="h-6 w-full border-b border-border/80 pb-2 mb-2" />
              <div className="h-6 w-full border-b border-border/80 pb-2 mb-2" />
              <div className="h-6 w-full border-b border-border/80 pb-2" />
            </div>
            <p className="text-xs text-muted-foreground">Assinatura da Contratada</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground">Contratante</h4>
            <div className="border-t border-b border-border/80 pt-4 pb-4 mb-4">
              <div className="text-xs text-muted-foreground">Assinatura</div>
              <div className="h-6 w-full border-b border-border/80 pb-2 mb-2" />
              <div className="h-6 w-full border-b border-border/80 pb-2 mb-2" />
              <div className="h-6 w-full border-b border-border/80 pb-2" />
            </div>
            <p className="text-xs text-muted-foreground">Assinatura do Contratante</p>
          </div>
        </div>
      </div>
    </div>
  )
}