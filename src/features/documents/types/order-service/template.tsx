import {
  DocumentHeader,
  DocumentClientInfo,
  DocumentFooter,
  formatDocBRL,
} from '@/features/documents/components/document-header'
import type { DocCompany, DocClient } from '@/features/documents/components/document-header'

interface OrderServiceTemplateProps {
  data: any
}

export function OrderServiceTemplate({ data }: OrderServiceTemplateProps) {
  const services = data?.services ?? []
  const parts = data?.parts ?? []

  const partsTotal = parts.reduce(
    (acc: number, item: any) => acc + Number(item.total || item.quantity * item.unitPrice || 0),
    0
  )

  const servicesTotal = services.reduce(
    (acc: number, item: any) => acc + Number(item.total || item.hours * item.laborRate || 0),
    0
  )

  const overallTotal = partsTotal + servicesTotal
  const statusKey = data?.status || 'Aberta'

  const company: DocCompany | null = data?.company ?? null
  const client: DocClient | null = data?.client ?? null

  return (
    <div className="bg-white text-slate-900">
      <DocumentHeader
        company={company}
        info={{
          title: 'Ordem de Serviço',
          number: data?.osNumber || '',
          issuedAt: data?.entryDate || new Date(),
          validUntil: data?.expectedDate,
          status: statusKey,
        }}
      />

      <DocumentClientInfo client={client} fallbackName={data?.clientName} />

      {/* Técnico e Equipamento */}
      <div className="mx-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Técnico Responsável
          </div>
          <p className="text-sm font-medium text-slate-800">{data?.technician || 'Não designado'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Equipamento
          </div>
          <p className="text-sm font-medium text-slate-800">{data?.equipment?.name || '—'}</p>
          <p className="text-xs text-slate-500">
            {[data?.equipment?.brand, data?.equipment?.model].filter(Boolean).join(' • ')}
            {data?.equipment?.serialNumber ? ` • Nº Série: ${data.equipment.serialNumber}` : ''}
          </p>
        </div>
      </div>

      {/* Defeito e diagnóstico */}
      <div className="mx-10 mt-8 space-y-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Defeito Reportado
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data?.reportedProblem || '—'}</p>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Diagnóstico Técnico
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">
            {data?.technicalDiagnosis || 'Aguardando análise'}
          </p>
        </div>
      </div>

      {/* Peças — tabela técnica com cabeçalho escuro */}
      {parts.length > 0 && (
        <div className="mx-10 mt-8">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Peças e Materiais Utilizados
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#0f172a' }} className="text-white text-[10px] uppercase tracking-wider">
                <th className="text-left py-2.5 px-3 font-semibold rounded-l-lg">Peça/Material</th>
                <th className="text-right py-2.5 px-3 font-semibold">Qtd</th>
                <th className="text-right py-2.5 px-3 font-semibold">Valor Unit.</th>
                <th className="text-right py-2.5 px-3 font-semibold rounded-r-lg">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2.5 px-3 text-slate-800">{item.partName || '—'}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{item.quantity ?? 0}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{formatDocBRL(Number(item.unitPrice || 0))}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                    {formatDocBRL(Number(item.total || item.quantity * item.unitPrice || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-3">
            <div className="w-64 flex justify-between text-sm">
              <span className="text-slate-600">Total Peças</span>
              <span className="font-semibold text-slate-900">{formatDocBRL(partsTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mão de obra */}
      {services.length > 0 && (
        <div className="mx-10 mt-8">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Mão de Obra
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#0f172a' }} className="text-white text-[10px] uppercase tracking-wider">
                <th className="text-left py-2.5 px-3 font-semibold rounded-l-lg">Serviço</th>
                <th className="text-right py-2.5 px-3 font-semibold">Horas</th>
                <th className="text-right py-2.5 px-3 font-semibold">R$/h</th>
                <th className="text-right py-2.5 px-3 font-semibold rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item: any, i: number) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2.5 px-3 text-slate-800">{item.description || '—'}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{item.hours ?? 0}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{formatDocBRL(Number(item.laborRate || 0))}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                    {formatDocBRL(Number(item.total || item.hours * item.laborRate || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-3">
            <div className="w-64 flex justify-between text-sm">
              <span className="text-slate-600">Total Mão de Obra</span>
              <span className="font-semibold text-slate-900">{formatDocBRL(servicesTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Total geral */}
      <div className="mx-10 mt-8 flex justify-end">
        <div className="w-72">
          <div className="flex justify-between items-center border-t-2 border-slate-900 pt-3">
            <span className="font-bold uppercase text-xs">Total Geral (R$)</span>
            <span className="font-heading text-xl font-bold">{formatDocBRL(overallTotal)}</span>
          </div>
        </div>
      </div>

      {/* Garantia */}
      <div className="mx-10 mt-8">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Termo de Retirada e Garantia
        </div>
        <p className="text-sm text-slate-600">
          O cliente declara ter recebido o equipamento/serviço em perfeito estado. A garantia cobre{' '}
          {data?.warrantyTerms || '30 dias'} a contar da data de conclusão.
        </p>
      </div>

      <DocumentFooter
        company={company}
        info={{
          title: 'Ordem de Serviço',
          number: data?.osNumber || '',
          issuedAt: data?.entryDate || new Date(),
        }}
        signatures={[
          { label: 'Cliente', name: client?.name || data?.clientName || '' },
          { label: 'Técnico Responsável', name: data?.technician || '' },
        ]}
      />
    </div>
  )
}
