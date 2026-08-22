/**
 * Página de Produtos e Serviços
 * Rota: /products
 * 
 * Responsabilidade: Catálogo de itens e serviços predefinidos para inserção rápida em documentos.
 */
export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Produtos e Serviços</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre itens frequentes para agilizar o preenchimento de propostas e orçamentos.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Área de catálogo de produtos e serviços.
      </div>
    </div>
  );
}
