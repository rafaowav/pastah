import {
  DocumentHeader,
  DocumentClientInfo,
  DocumentFooter,
  formatDocBRL,
  formatDocDate,
} from '@/features/documents/components/document-header'
import type { DocCompany, DocClient } from '@/features/documents/components/document-header'

interface OrcamentoTemplateProps {
  data: any
}

export function OrcamentoTemplate({ data }: OrcamentoTemplateProps) {
  const items = data?.items || []

  const subtotal = items.reduce((acc: number, item: any) => {
    const qty = Number(item.quantity || 1)
    const price = Number(item.unitPrice || 0)
    const discount = Number(item.discountPercent || 0)
    return acc + qty * price * (1 - discount / 100)
  }, 0)

  const itemDiscountTotal = items.reduce((acc: number, item: any) => {
    const qty = Number(item.quantity || 1)
    const price = Number(item.unitPrice || 0)
    const discount = Number(item.discountPercent || 0)
    return acc + qty * price * (discount / 100)
  }, 0)

  const descontoGeral = Number(data?.descontoTotal || 0)
  const total = Math.max(0, subtotal - descontoGeral)

  const company: DocCompany | null = data?.company ?? null
  const client: DocClient | null = data?.client ?? null

  return (
    <div className="bg-white text-slate-900">
      <DocumentHeader
        company={company}
        info={{
          title: 'Orçamento',
          number: data?.orcamentoNumber || '#ORC-0001',
          issuedAt: new Date(),
          validUntil: data?.validUntil,
        }}
      />

      <DocumentClientInfo client={client} fallbackName={data?.clientName} />

      {/* Items Table */}
      <div className="mx-10 mt-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
              <th className="text-left py-3 pr-2 font-semibold">Item / Descrição</th>
              <th className="text-right py-3 pr-2 font-semibold w-14">Qtd</th>
              <th className="text-right py-3 pr-2 font-semibold w-28">Valor Unit. (R$)</th>
              <th className="text-right py-3 pr-2 font-semibold w-20">Desconto</th>
              <th className="text-right py-3 font-semibold w-32">Subtotal (R$)</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Nenhum item adicionado
                </td>
              </tr>
            ) : (
              items.map((item: any, i: number) => {
                const qty = Number(item.quantity || 1)
                const price = Number(item.unitPrice || 0)
                const discount = Number(item.discountPercent || 0)
                const subtotalItem = qty * price * (1 - discount / 100)
                return (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-3 pr-2">
                      <p className="font-medium text-slate-800">{item.description || 'Item'}</p>
                      {item.productId && <p className="text-[11px] text-slate-400">Produto cadastrado</p>}
                    </td>
                    <td className="text-right py-3 pr-2 text-slate-600">{qty}</td>
                    <td className="text-right py-3 pr-2 text-slate-600">{formatDocBRL(price)}</td>
                    <td className="text-right py-3 pr-2 text-rose-500">
                      {discount > 0 ? `${discount}%` : '—'}
                    </td>
                    <td className="text-right py-3 font-semibold text-slate-900">{formatDocBRL(subtotalItem)}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="mx-10 mt-8 flex justify-end">
        <div className="w-72 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatDocBRL(subtotal)}</span>
          </div>
          {(itemDiscountTotal > 0 || descontoGeral > 0) && (
            <div className="flex justify-between text-slate-600">
              <span>Desconto</span>
              <span className="text-rose-500">- {formatDocBRL(itemDiscountTotal + descontoGeral)}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-t-2 border-slate-900 pt-3 mt-2">
            <span className="font-bold uppercase text-xs">Valor Total (R$)</span>
            <span className="font-heading text-xl font-bold">{formatDocBRL(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment / Delivery Info */}
      <div className="mx-10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Forma de Pagamento
          </div>
          <p className="text-sm font-medium text-slate-800">{data?.paymentTerms || 'Não especificado'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Prazo de Execução
          </div>
          <p className="text-sm font-medium text-slate-800">{data?.deliveryTime || 'A combinar'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Validade da Proposta
          </div>
          <p className="text-sm font-medium text-slate-800">{formatDocDate(data?.validUntil)}</p>
        </div>
      </div>

      {/* Observations */}
      {data?.observations && (
        <div className="mx-10 mt-8">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Observações
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.observations}</p>
        </div>
      )}

      <DocumentFooter
        company={company}
        info={{
          title: 'Orçamento',
          number: data?.orcamentoNumber || '#ORC-0001',
          issuedAt: new Date(),
        }}
        hint="Aprovação do cliente — assinatura abaixo"
        signatureName={client?.name || data?.clientName || 'Nome do Cliente'}
      />
    </div>
  )
}
