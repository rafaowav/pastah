/**
 * Página inicial do Dashboard
 * Rota: /
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 sm:p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Bem-vindo ao Pastah</h1>
        <p className="text-lg text-muted-foreground">
          Crie documentos profissionais em poucos minutos. Gerencie seus clientes,
          empresas, produtos e templates em um só lugar.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <div className="rounded-lg bg-card p-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 100 24 12 12 0 100-24zM2 6l8 8 8-8M2 14l8 8 8-8M2 18l8 8 8-8M2 22l8 8 8-8M2 26l8 8 8-8M26 6l-8 8-8 8M26 22l-8 8-8-8M26 18l-8 8-8-8M26 14l-8 8-8-8M26 10l-8 8-8-8M12 2a10 10 0 110 20 10 10 0 110-20z" />
                </svg>
              </div>
              <h3 className="mt-3 text-xs font-medium text-muted-foreground">100+</h3>
              <p className="mt-1 text-sm text-muted-foreground">Documentos criados</p>
            </div>
          </div>
          <div>
            <div className="rounded-lg bg-card p-4">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 12s-2 4.5-2 9.5 2 9.5 2-9.5S10 12 8 12zM14.5 13a1 1 0 100-2 1 1 0 000 2zM19.5 13a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </div>
              <h3 className="mt-3 text-xs font-medium text-muted-foreground">50+</h3>
              <p className="mt-1 text-sm text-muted-foreground">Clientes</p>
            </div>
          </div>
          <div>
            <div className="rounded-lg bg-card p-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 100 24 12 12 0 100-24zM2 6l8 8 8-8M2 14l8 8 8-8M2 18l8 8 8-8M2 22l8 8 8-8M26 6l-8 8-8 8M26 22l-8 8-8-8M26 18l-8 8-8-8M26 14l-8 8-8-8M12 2a10 10 0 110 20 10 10 0 110-20z" />
                </svg>
              </div>
              <h3 className="mt-3 text-xs font-medium text-muted-foreground">500+</h3>
              <p className="mt-1 text-sm text-muted-foreground">Documentos</p>
            </div>
          </div>
          <div>
            <div className="rounded-lg bg-card p-4">
              <div className="h-12 w-12 rounded-lg bg-muted/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v3l8 8h-2l-5 5V3H12zM2 12h20v2H2v-2zm0 4h20v2H2v-2zm0 4h20v2H2v-2zm0 4h16v2H2v-2z" />
                </svg>
              </div>
              <h3 className="mt-3 text-xs font-medium text-muted-foreground">10+</h3>
              <p className="mt-1 text-sm text-muted-foreground">Templates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}