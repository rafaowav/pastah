interface OrderServiceTemplateProps {
  data: any
}

const statusMap: Record<string, string> = {
  'Aberta': 'bg-green-100 text-green-800',
  'Em Análise': 'bg-yellow-100 text-yellow-800',
  'Aguardando Peças': 'bg-blue-100 text-blue-800',
  'Concluída': 'bg-purple-100 text-purple-800',
  'Entregue': 'bg-emerald-100 text-emerald-800',
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

  return (
    <>
      <div className="p-8 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ORDEM DE SERVIÇO</h1>
          <p className="text-slate-500">#{data?.osNumber || ''}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-slate-500">Cliente</h3>
            <p className="font-bold">{data?.client?.name || data?.clientName || 'Nome do Cliente'}</p>
            <p className="text-slate-500">{data?.client?.phone || data?.client?.email || ''}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-500">Técnico</h3>
            <p>{data?.technician || 'Não designado'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-slate-500">Equipamento</h3>
            <p>{data?.equipment?.name || ''}</p>
            <p className="text-slate-500">
              {data?.equipment?.brand || ''} {data?.equipment?.model || ''}
              {data?.equipment?.serialNumber ? `Nº Série: ${data.equipment.serialNumber}` : ''}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-500">Status</h3>
            <span className={`px-3 py-1 rounded text-xs font-medium ${statusMap[statusKey] || 'text-slate-500'}`}>
              {statusKey}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            Defeito Reportado
          </h3>
          <p className="text-slate-600 line-clamp-4">{data?.reportedProblem || ''}</p>
        </div>

        <div className="bg-white rounded-3xl p-6">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            Diagnóstico Técnico
          </h3>
          <p className="text-slate-600 line-clamp-4">{data?.technicalDiagnosis || 'Aguardando análise'}</p>
        </div>

        <div className="bg-white rounded-3xl p-6">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            Peças e Materiais Utilizados
          </h3>
          {parts.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Peça/Material</th>
                  <th className="text-right py-2">Qtd</th>
                  <th className="text-right py-2">Valor Unit.</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((item: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{item.partName}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">R$ {Number(item.unitPrice || 0).toFixed(2)}</td>
                    <td className="text-right">R$ {(item.total || item.quantity * item.unitPrice || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="text-right font-bold py-4">
                    Total Peças: R$ {partsTotal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p className="text-slate-500 text-center py-8">Nenhuma peça adicionada</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-slate-500">Mão de Obra</h3>
            {services.length > 0 ? (
              services.map((s: any, i: number) => (
                <p key={i} className="text-sm text-slate-600">
                  {s.description}: {s.hours}h x R$ {Number(s.laborRate || 0).toFixed(2)}
                </p>
              ))
            ) : (
              <p className="text-slate-500">Nenhum serviço adicionado</p>
            )}
            <p className="font-bold text-right">Total: R$ {servicesTotal.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-500">Total Geral</h3>
            <p className="font-bold text-2xl text-right">R$ {overallTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200/80">
        <h3 className="font-semibold text-slate-700">Termo de Retirada e Garantia</h3>
        <p className="text-slate-500">
          O cliente declara ter recebido o equipamento/serviço em perfeito estado. A garantia cobre{' '}
          {data?.warrantyTerms || '30 dias'} a contar da data de conclusão.
        </p>
        <p className="text-slate-400 mt-4">
          _______________________________ cliente _______________________________ técnico
        </p>
      </div>
    </>
  )
}
