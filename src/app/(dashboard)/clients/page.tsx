/**
 * Página de Gestão de Clientes
 * Rota: /clients
 * 
 * Responsabilidade: Listar, criar e editar clientes (pessoas físicas e jurídicas).
 */
export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie sua base de clientes e seus dados de faturamento.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Área de gestão de clientes.
      </div>
    </div>
  );
}
