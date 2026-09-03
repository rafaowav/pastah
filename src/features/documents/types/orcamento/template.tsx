interface OrcamentoTemplateProps {
  data: any
}

function formatBRL(value: number): string {
  return (value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(value: any): string {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR')
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

  const issueDate = new Date()

  return (
    <div className="bg-white text-slate-900">
      {/* Executive Header */}
      <div className="px-10 pt-10 pb-6 bg-slate-900 text-white">
        <div className="flex justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center font-heading font-bold text-sm">
                {data?.company?.name?.[0]?.toUpperCase() || 'P'}
              </div>
              <h2 className="font-heading text-xl font-bold">
                {data?.company?.name || 'Sua Empresa'}
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              {data?.company?.document ? `CNPJ: ${data.company.document}` : ''}
            </p>
            {data?.company?.email && (
              <p className="text-xs text-slate-300">{data.company.email}</p>
            )}
            {data?.company?.phone && (
              <p className="text-xs text-slate-300">{data.company.phone}</p>
            )}
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-bold tracking-tight uppercase">Orçamento</div>
            <div className="mt-1 space-y-0.5 text-xs text-slate-300">
              <p>Nº {data?.orcamentoNumber || '#ORC-0001'}</p>
              <p>Emissão: {formatDate(issueDate)}</p>
              <p>Validade: {formatDate(data?.validUntil)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Block */}
      <div className="mx-10 mt-8 rounded-2xl border border-slate-200 p-5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Cliente
        </div>
        <p className="font-semibold text-slate-900">{data?.client?.name || data?.clientName || 'Nome do Cliente'}</p>
        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
          {data?.client?.document && <span>CPF/CNPJ: {data.client.document}</span>}
          {data?.client?.email && <span>{data.client.email}</span>}
          {data?.client?.phone && <span>{data.client.phone}</span>}
        </div>
      </div>

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
                    <td className="text-right py-3 pr-2 text-slate-600">{formatBRL(price)}</td>
                    <td className="text-right py-3 pr-2 text-rose-500">
                      {discount > 0 ? `${discount}%` : '—'}
                    </td>
                    <td className="text-right py-3 font-semibold text-slate-900">{formatBRL(subtotalItem)}</td>
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
            <span>{formatBRL(subtotal)}</span>
          </div>
          {(itemDiscountTotal > 0 || descontoGeral > 0) && (
            <div className="flex justify-between text-slate-600">
              <span>Desconto</span>
              <span className="text-rose-500">- {formatBRL(itemDiscountTotal + descontoGeral)}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-t-2 border-slate-900 pt-3 mt-2">
            <span className="font-bold uppercase text-xs">Valor Total (R$)</span>
            <span className="font-heading text-xl font-bold">{formatBRL(total)}</span>
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
          <p className="text-sm font-medium text-slate-800">{formatDate(data?.validUntil)}</p>
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

      {/* Formal Footer */}
      <div className="mx-10 mt-10 pb-10">
        <div className="border-t border-slate-200 pt-8 text-center">
          <p className="text-xs text-slate-500 mb-8">Aprovação do cliente — assinatura abaixo</p>
          <div className="inline-block w-72">
            <div className="h-px bg-slate-300 mb-2"></div>
            <p className="text-xs font-semibold text-slate-700">
              {data?.client?.name || data?.clientName || 'Nome do Cliente'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}