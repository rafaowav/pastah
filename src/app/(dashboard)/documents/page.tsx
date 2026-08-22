/**
 * Página de Documentos
 * Rota: /documents
 */
export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 sm:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Documentos</h1>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors">
            Novo Documento
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cartão de documento exemplo */}
          <div className="rounded-lg border border-border bg-card p-6 hover:transition-colors hover:border-primary">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="h-5 w-5 text-foreground"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14 2H6a2 2 0 00-2 2v20a2 2 0 002 2h12a2 2 0 002-2V8z" />
              </svg>
              <span>Novo Orçamento</span>
            </div>
            <p className="text-sm text-muted-foreground">Crie e envie orçamentos profissionais em minutos.</p>
            <div className="mt-3 flex items-center justify-between">
              <small className="text-xs text-muted-foreground">Há 2 horas</small>
              <span className="text-xs font-medium">R$ 2.500,00</span>
            </div>
          </div>

          {/* Cartão de documento exemplo 2 */}
          <div className="rounded-lg border border-border bg-card p-6 hover:transition-colors hover:border-primary">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="h-5 w-5 text-foreground"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14 2H6a2 2 0 00-2 2v20a2 2 0 002 2h12a2 2 0 002-2V8z" />
              </svg>
              <span>Proposta Comercial</span>
            </div>
            <p className="text-sm text-muted-foreground">Apresente propostas detalhadas para seus clientes.</p>
            <div className="mt-3 flex items-center justify-between">
              <small className="text-xs text-muted-foreground">Há ontem</small>
              <span className="text-xs font-medium">R$ 5.000,00</span>
            </div>
          </div>

          {/* Cartão de documento exemplo 3 */}
          <div className="rounded-lg border border-border bg-card p-6 hover:transition-colors hover:border-primary">
            <div className="flex items-center gap-3 mb-3">
              <svg
                className="h-5 w-5 text-foreground"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14 2H6a2 2 0 00-2 2v20a2 2 0 002 2h12a2 2 0 002-2V8z" />
              </svg>
              <span>Recibo</span>
            </div>
            <p className="text-sm text-muted-foreground">Emitiu recibo de pagamento recebido.</p>
            <div className="mt-3 flex items-center justify-between">
              <small className="text-xs text-muted-foreground">Há 3 dias</small>
              <span className="text-xs font-medium">R$ 350,00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}