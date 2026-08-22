/**
 * Página de Configurações
 * Rota: /settings
 * 
 * Responsabilidade: Configurações de conta, preferências do workspace, assinatura e preferências de notificação.
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie preferências da conta, membros da equipe e integrações.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        Área de configurações da conta e workspace.
      </div>
    </div>
  );
}
