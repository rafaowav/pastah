import {
  DocumentHeader,
  DocumentFooter,
  formatDocDate,
} from '@/features/documents/components/document-header'
import type { DocCompany, DocClient } from '@/features/documents/components/document-header'
import { documentColors } from '@/lib/document-engine/document-theme'

interface ReceiptTemplateProps {
  data: any
}

export function ReceiptTemplate({ data }: ReceiptTemplateProps) {
  const valor = Number(data?.amount ?? 0)
  const valorExtenso = data?.amountInWords || ''
  const dataFormatada = data?.paymentDate ? formatDocDate(data.paymentDate) : ''
  const cidade = data?.city || data?.cityDate || ''

  const emissor = data?.emissorNome || data?.companyName || data?.company?.name || 'Sua Empresa'
  const emissorDoc = data?.emissorCNPJ || data?.companyDocument || data?.company?.document || ''
  const pagador = data?.pagadorNome || data?.clientName || data?.client?.name || 'Nome do Cliente'
  const pagadorDoc = data?.pagadorCPF || data?.clientDocument || data?.client?.document || ''

  const company: DocCompany | null = data?.company ?? null
  const client: DocClient | null = data?.client ?? null

  const headerInfo = {
    title: 'Recibo de Pagamento',
    number: data?.receiptNumber || 'RECIBO',
    issuedAt: data?.paymentDate || new Date(),
    extraLines: data?.paymentMethod ? [data.paymentMethod] : [],
  }

  return (
    <div className="bg-white text-slate-900">
      <DocumentHeader company={company} info={headerInfo} />

      {/* Valor recebido em destaque (box claro, corpo branco) */}
      <div className="mx-10 mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Valor Recebido
        </div>
        <div className="font-heading font-bold text-5xl" style={{ color: documentColors.headerBg }}>
          {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
        {valorExtenso && <p className="text-slate-500 mt-2 text-sm">({valorExtenso})</p>}
      </div>

      {/* Emissor e Pagador */}
      <div className="mx-10 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Emissor
          </div>
          <p className="font-semibold text-slate-900">{emissor}</p>
          {emissorDoc && <p className="text-xs text-slate-500 mt-0.5">{emissorDoc}</p>}
        </div>
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Pagador
          </div>
          <p className="font-semibold text-slate-900">{pagador}</p>
          {pagadorDoc && <p className="text-xs text-slate-500 mt-0.5">{pagadorDoc}</p>}
        </div>
      </div>

      {/* Referente a */}
      <div className="mx-10 mt-8">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Referente a
        </div>
        <p className="text-sm text-slate-600 italic border-l-2 border-slate-200 pl-4">
          {data?.reference || 'Pagamento não especificado'}
        </p>
      </div>

      {/* Detalhes */}
      <div className="mx-10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Forma de Pagamento
          </div>
          <p className="text-sm font-medium text-slate-800">{data?.paymentMethod || 'Não informada'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Data do Pagamento
          </div>
          <p className="text-sm font-medium text-slate-800">{dataFormatada || 'Não informada'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Local
          </div>
          <p className="text-sm font-medium text-slate-800">{cidade || 'Não informado'}</p>
        </div>
      </div>

      {/* Declaração legal */}
      <div className="mx-10 mt-8 text-sm text-slate-600 space-y-2">
        <p>
          Recebemos de <span className="font-semibold text-slate-800">{pagador}</span> a quantia de{' '}
          <span className="font-semibold text-slate-800">
            {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>{' '}
          referente a: {data?.reference || 'pagamento'}.
        </p>
        <p className="text-xs text-slate-400">
          Termo lavrado em via dupla para maior legitimidade jurídica.
        </p>
      </div>

      <DocumentFooter
        company={company}
        info={headerInfo}
        signatures={[
          {
            label: 'Assinatura do Emitidor',
            name: emissor,
          },
          {
            label: 'Local e Data',
            name: cidade ? `${cidade}, ${dataFormatada || '__/__/____'}` : dataFormatada || '__/__/____',
          },
        ]}
      />
    </div>
  )
}
