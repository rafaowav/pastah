import {
  DocumentHeader,
  DocumentFooter,
} from '@/features/documents/components/document-header'
import type { DocCompany } from '@/features/documents/components/document-header'
import { documentColors } from '@/lib/document-engine/document-theme'

interface ContractTemplateProps {
  data: any
}

const clauseLabels = [
  'Cláusula Primeira — Do Objeto',
  'Cláusula Segunda — Das Obrigações da Contratada',
  'Cláusula Terceira — Das Obrigações do Contratante',
  'Cláusula Quarta — Do Preço, Condições de Pagamento e Multa por Atraso',
  'Cláusula Quinta — Vigência e Rescisão',
  'Cláusula Sexta — Do Foro de Eleição',
]

const clauseKeys = [
  'clause1Object',
  'clause2ObligationsContractor',
  'clause3ObligationsClient',
  'clause4Payment',
  'clause5DurationTermination',
  'clause6Jurisdiction',
]

export function ContractTemplate({ data }: ContractTemplateProps) {
  const contractor = data?.contractorRepresentative || {}
  const clientRep = data?.clientRepresentative || {}
  const clauses = data?.clauses || {}
  const witnesses = data?.witnesses || []

  const company: DocCompany | null = data?.company ?? null

  return (
    <div className="bg-white text-slate-900">
      <DocumentHeader
        company={company}
        info={{
          title: 'Contrato',
          number: data?.contractNumber || undefined,
          issuedAt: new Date(),
          extraLines: data?.contractTitle ? [data.contractTitle] : [],
        }}
      />

      {/* Qualificação das partes */}
      <div className="mx-10 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Contratada
          </div>
          <p className="font-semibold text-slate-900">{contractor.name || company?.name || 'Não informado'}</p>
          <div className="mt-1 space-y-0.5 text-xs text-slate-500">
            {(contractor.cpf || company?.document) && <span className="block">CPF/CNPJ: {contractor.cpf || company?.document}</span>}
            {contractor.role && <span className="block">Representante: {contractor.role}</span>}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Contratante
          </div>
          <p className="font-semibold text-slate-900">
            {clientRep.name || data?.client?.name || 'Nome do Cliente'}
          </p>
          <div className="mt-1 space-y-0.5 text-xs text-slate-500">
            {(clientRep.cpf || data?.client?.document) && (
              <span className="block">CPF/CNPJ: {clientRep.cpf || data?.client?.document}</span>
            )}
            {clientRep.role && <span className="block">Representante: {clientRep.role}</span>}
          </div>
        </div>
      </div>

      {/* Cláusulas */}
      {clauseKeys.some((k) => clauses[k]) && (
        <div className="mx-10 mt-8">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Cláusulas Contratuais
          </h3>
          <div className="space-y-6">
            {clauseKeys.map((key, index) => {
              const text = clauses[key]
              if (!text) return null
              return (
                <div key={key}>
                  <h4
                    className="text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: documentColors.headerBg }}
                  >
                    {clauseLabels[index]}
                  </h4>
                  <p className="text-sm text-slate-600 text-justify leading-relaxed">{text}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Testemunhas */}
      {witnesses.length > 0 && (
        <div className="mx-10 mt-8">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Testemunhas
          </div>
          <ul className="text-sm text-slate-600 space-y-1">
            {witnesses.map((w: any, i: number) => (
              <li key={i}>
                • {w.name}
                {w.cpf ? ` — CPF: ${w.cpf}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      <DocumentFooter
        company={company}
        info={{
          title: 'Contrato',
          number: data?.contractNumber || undefined,
          issuedAt: new Date(),
        }}
        signatures={[
          {
            label: 'Contratada',
            name: contractor.name || company?.name || '',
          },
          {
            label: 'Contratante',
            name: clientRep.name || data?.client?.name || '',
          },
        ]}
      />
    </div>
  )
}
