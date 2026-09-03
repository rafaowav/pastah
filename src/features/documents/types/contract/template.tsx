interface ContractTemplateProps {
  data: any
}

const clauseLabels = [
  'CLÁUSULA PRIMEIRA - DO OBJETO',
  'CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA',
  'CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATANTE',
  'CLÁUSULA QUARTA - DO PREÇO, CONDIÇÕES DE PAGAMENTO E MULTA POR ATRASO',
  'CLÁUSULA QUINTA - VIGÊNCIA E RESCISÃO',
  'CLÁUSULA SEXTA - DO FORO DE ELEIÇÃO',
]

export function ContractTemplate({ data }: ContractTemplateProps) {
  return (
    <div className="p-8 space-y-6">
      {/* Contract Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{data.contractTitle}</h1>
        <p className="text-slate-500">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</p>
      </div>

      {/* Qualification Section - Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-slate-600 mb-2">Contratada</h3>
          <p>{data.contractorRepresentative?.nome || 'Não informado'}</p>
          <p className="text-slate-500">{data.contractorRepresentative?.cnpj || 'CPF/CNPJ não informado'}</p>
          <p className="text-slate-500">{data.contractorRepresentative?.endereco || 'Endereço não informado'}</p>
          <p className="text-slate-500">{data.contractorRepresentative?.role || 'Representante não informado'}</p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-600 mb-2">Contratante</h3>
          <p>{data.clientRepresentative?.nome || 'Não informado'}</p>
          <p className="text-slate-500">{data.clientRepresentative?.cpf || 'CPF/CNPJ não informado'}</p>
          <p className="text-slate-500">{data.clientRepresentative?.endereco || 'Endereço não informado'}</p>
          <p className="text-slate-500">{data.clientRepresentative?.role || 'Representante não informado'}</p>
        </div>
      </div>

      {/* Clauses */}
      {data.clauses && Object.keys(data.clauses).length > 0 && (
        <div>
          {Object.entries(data.clauses).map(([key, clauseText], index) => (
            <div key={index} className="bg-white rounded-3xl p-6 main-container-shadow border border-slate-200/80 space-y-4">
              <h3 className="font-heading font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                {clauseLabels[index]}
              </h3>
              <p className="text-slate-600">{String(clauseText || 'Não informado')}</p>
            </div>
          ))}</div>
        )}
      )

      {/* Signature Section */}
      <div className="pt-8 border-t border-slate-200/80">
        <h3 className="font-semibold text-slate-700">Assinaturas</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-sm text-slate-700">Contratante</h4>
            <div className="border-t border-b border-slate-200/80 pt-4 pb-4 mb-4">
              <div className="text-xs text-slate-500">Assinatura</div>
              <div className="h-6 w-full border-b border-slate-200/80 pb-2 mb-2" />
              <div className="h-6 w-full border-b border-slate-200/80 pb-2 mb-2" />
              <div className="h-6 w-full border-b border-slate-200/80 pb-2" />
            </div>
            <p className="text-xs text-slate-500">Assinatura do Contratante</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-slate-700">Contratada</h4>
            <div className="border-t border-b border-slate-200/80 pt-4 pb-4 mb-4">
              <div className="text-xs text-slate-500">Assinatura</div>
              <div className="h-6 w-full border-b border-slate-200/80 pb-2 mb-2" />
              <div className="h-6 w-full border-b border-slate-200/80 pb-2 mb-2" />
              <div className="h-6 w-full border-b border-slate-200/80 pb-2" />
            </div>
            <p className="text-xs text-slate-500">Assinatura da Contratada</p>
          </div>
        </div>
      </div>
    </div>
  )
}