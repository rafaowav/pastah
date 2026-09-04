import {
  DocumentHeader,
  DocumentClientInfo,
  DocumentFooter,
  formatDocBRL,
  formatDocDate,
} from '@/features/documents/components/document-header'
import type { DocCompany, DocClient } from '@/features/documents/components/document-header'

interface ProposalTemplateProps {
  data: any
}

export function ProposalTemplate({ data }: ProposalTemplateProps) {
  const totalInvestment =
    data.investment?.reduce((acc: number, item: any) => acc + Number(item.amount || 0), 0) || 0

  const company: DocCompany | null = data?.company ?? null
  const client: DocClient | null = data?.client ?? null

  const headerInfo = {
    title: 'Proposta Comercial',
    number: data?.proposalNumber || undefined,
    issuedAt: new Date(),
    validUntil: data?.validUntil,
    extraLines: data?.title ? [data.title] : [],
  }

  return (
    <div className="bg-white text-slate-900">
      <DocumentHeader company={company} info={headerInfo} />

      <DocumentClientInfo client={client} fallbackName={data?.clientName} />

      <div className="mx-10 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Apresentação
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.introduction || '—'}</p>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Objetivos
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.objectives || '—'}</p>
        </div>
      </div>

      {/* Escopo */}
      {data.scope && data.scope.length > 0 && (
        <div className="mx-10 mt-8">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Escopo Detalhado
          </h3>
          <div className="space-y-4">
            {data.scope.map((scope: any, i: number) => (
              <div key={i} className="border-l-2 border-slate-200 pl-4">
                <p className="text-sm font-semibold text-slate-800">
                  {i + 1}. {scope.title}
                </p>
                <p className="text-sm text-slate-600">{scope.description}</p>
                {scope.deliverables && (
                  <p className="text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                      Entregáveis:{' '}
                    </span>
                    {scope.deliverables}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cronograma */}
      {data.timeline && data.timeline.length > 0 && (
        <div className="mx-10 mt-8">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Cronograma Estimado
          </h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              {data.timeline.map((t: any, i: number) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2.5 pr-4 font-medium text-slate-800">{t.phase}</td>
                  <td className="py-2.5 pr-4 text-slate-600">{t.duration}</td>
                  <td className="py-2.5 text-right text-slate-500">{t.milestone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Investimento */}
      {data.investment && data.investment.length > 0 && (
        <div className="mx-10 mt-8">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Investimento
          </h3>
          <table className="w-full text-sm border-collapse">
            <tbody>
              {data.investment.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-600">{item.item}</td>
                  {item.condition && <td className="py-2.5 text-slate-500">{item.condition}</td>}
                  <td className="py-2.5 text-right font-semibold text-slate-900">
                    {formatDocBRL(Number(item.amount || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <div className="w-72">
              <div className="flex justify-between items-center border-t-2 border-slate-900 pt-3">
                <span className="font-bold uppercase text-xs">Investimento Total</span>
                <span className="font-heading text-xl font-bold">{formatDocBRL(totalInvestment)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Termos */}
      {data.terms && (
        <div className="mx-10 mt-8">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Termos e Condições
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.terms}</p>
          <p className="text-xs text-slate-400 mt-2">
            Validade: 30 dias a partir da data de emissão
          </p>
        </div>
      )}

      <DocumentFooter
        company={company}
        info={headerInfo}
        hint="Aceite da proposta — assinatura do cliente abaixo"
        signatureName={client?.name || data?.clientName || 'Nome do Cliente'}
      />
    </div>
  )
}
