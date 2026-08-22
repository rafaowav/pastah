/**
 * Página de Templates
 * Rota: /templates
 * 
 * Responsabilidade: Modelos reutilizáveis de documentos com layouts e textos padrão.
 */
export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie e personalize modelos de documentos recorrentes.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Área de templates de documentos.
      </div>
    </div>
  );
}
