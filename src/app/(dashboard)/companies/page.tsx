/**
 * Página de Gestão de Empresas / Perfis Emissores
 * Rota: /companies
 * 
 * Responsabilidade: Configurar dados do emissor (dados fiscais, logo, dados bancários/PIX).
 */
export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Empresas e Emissores</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os perfis emissores dos seus documentos e informações de marca.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Área de gestão de empresas e emissores.
      </div>
    </div>
  );
}
