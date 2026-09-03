interface ProposalTemplateProps {
  data: any
}

export function ProposalTemplate({ data }: ProposalTemplateProps) {
  const totalInvestment = data.investment?.reduce(
    (acc: number, item: any) => acc + Number(item.amount || 0),
    0
  ) || 0

  return (
    <div className="p-8 space-y-6">
      {/* Cover Header */}
      <div className="text-center border-b border-slate-200/80 pb-8">
        <h1 className="text-4xl font-bold tracking-tighter">PROPOSTA COMERCIAL</h1>
        <p className="text-slate-500 mt-2">{data.title}</p>
      </div>

      {/* Project Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-slate-500 mb-2">Apresentação Executiva</h3>
          <p className="text-slate-600">{data.introduction}</p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-500 mb-2">Objetivos</h3>
          <p className="text-slate-600">{data.objectives}</p>
        </div>
      </div>

      {/* Escopo - numbered sections */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-lg text-slate-900 mb-4">Escopo Detalhado</h3>
        <ol className="list-decimal list-inside space-y-2 text-slate-600">
          {data.scope?.map((scope: any, i: number) => (
            <li key={i}>
              <strong>{scope.title}</strong>: {scope.description} — {scope.deliverables}
            </li>
          ))}
        </ol>
      </div>

      {/* Cronograma */}
      {data.timeline && data.timeline.length > 0 && (
        <div className="bg-white rounded-3xl p-6 main-container-shadow border border-slate-200/80">
          <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            Cronograma Estimado
          </h3>
          <p className="text-slate-500">
            {data.timeline.map((t: any, i: number) => (
              <p key={i}>
                <strong>{t.phase}</strong> — {t.duration}{' '}{t.milestone ? `(${t.milestone})` : ''}
              </p>
            ))}
          </p>
        </div>
      )}

      {/* Investimento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="font-semibold">Investimento</h3>
          <p>{data.investment?.map((item: any) => `${item.item}: R$ ${item.amount.toFixed(2)}`).join(' | ') || 'Não informado'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Total</h3>
          <p className="font-bold text-xl">R$ {totalInvestment.toFixed(2)}</p>
        </div>
      </div>

      {/* Termos de Aceite */}
      <div className="pt-8 border-t border-slate-200/80">
        <h3 className="font-semibold text-slate-700">Aceite e Condições</h3>
        <p className="text-slate-500">{data.terms}</p>
        <p className="text-slate-400 text-sm">Validade: 30 dias a partir da data de emissão</p>
      </div>
    </div>
  )
}