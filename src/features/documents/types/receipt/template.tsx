interface ReceiptTemplateProps {
  data: any
}

export function ReceiptTemplate({ data }: ReceiptTemplateProps) {
  const valor = Number(data?.amount ?? 0)
  const valorExtenso = data?.amountInWords || ''
  const dataFormatada = data?.paymentDate
    ? new Date(data.paymentDate).toLocaleDateString('pt-BR')
    : ''
  const cidade = data?.city || data?.cityDate || ''

  return (
    <div className="p-8 space-y-6 border-t border-b border-slate-200/80">
      <div className="text-center mb-8">
        <div className="inline-block rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-bold">
          {data?.receiptNumber || 'RECIBO'}
        </div>
        <p className="text-slate-500 mt-2">COMPROVANTE DE PAGAMENTO</p>
      </div>

      <div className="text-center mb-8">
        <div className="font-bold text-5xl text-slate-900">
          R$ {valor.toFixed(2).replace('.', ',')}
        </div>
        {valorExtenso && (
          <p className="text-slate-500">({valorExtenso})</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="font-semibold text-slate-600 mb-3">Emissor</h4>
          <p className="text-slate-700">{data?.emissorNome || data?.companyName || data?.company?.name || 'Sua Empresa'}</p>
          <p className="text-slate-500">{data?.emissorCNPJ || data?.companyDocument || data?.company?.document || ''}</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-600 mb-3">Pagador</h4>
          <p className="text-slate-700">{data?.pagadorNome || data?.clientName || data?.client?.name || 'Nome do Cliente'}</p>
          <p className="text-slate-500">{data?.pagadorCPF || data?.clientDocument || data?.client?.document || ''}</p>
        </div>
      </div>

      <div className="border-t border-b border-slate-200/80 py-6 mb-6">
        <h4 className="font-semibold text-slate-600 mb-2">Referente a:</h4>
        <p className="text-slate-500 italic">{data?.reference || 'Pagamento não especificado'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {['PIX', 'Transferência Bancária', 'Dinheiro', 'Cartão de Crédito'].map((m) => (
          <div
            key={m}
            className={`p-3 rounded bg-slate-50/50 text-sm ${
              data?.paymentMethod === m ? 'bg-slate-900 text-white' : 'text-slate-400'
            }`}
          >
            {m}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-slate-500">Data do Pagamento</p>
          <p className="font-bold">{dataFormatada || 'Não informada'}</p>
        </div>
        <div>
          <p className="text-slate-500">Local</p>
          <p className="font-bold">{cidade || 'Não informado'}</p>
        </div>
      </div>

      <div className="mt-8 text-slate-500 text-sm">
        <p>Recebemos de {data?.pagadorNome || data?.clientName || data?.client?.name || 'o pagador'} a quantia de R$ {valor.toFixed(2).replace('.', ',')} referente a: {data?.reference || 'pagamento'}.</p>
        <p>Termo lavrado em via dupla para maior legitimidade jurídica.</p>
      </div>

      <div className="mt-8">
        <p className="text-slate-500">Local e Data: {cidade ? `${cidade}, ` : ''}{dataFormatada || '__/__/____'}</p>
        <p className="text-slate-500">Assinatura do Pagador: _________________________________________________</p>
      </div>
    </div>
  )
}