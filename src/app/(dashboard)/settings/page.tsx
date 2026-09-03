import { getCurrentUser } from '@/lib/auth/helpers'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, Shield, Palette, Sparkles, CheckCircle2 } from 'lucide-react'

export default async function SettingsPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Workspace & Conta</span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-0.5">
          Configurações
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gerencie seu perfil, preferências do workspace e integrações.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Perfil do Usuário</h3>
              <p className="text-xs text-muted-foreground">Informações da sua conta no Pastah</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Nome de Exibição</Label>
              <Input
                defaultValue={user?.name || ''}
                readOnly
                className="h-11 rounded-xl bg-muted border-border text-sm font-medium text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">E-mail Cadastrado</Label>
              <Input
                type="email"
                defaultValue={user?.email || ''}
                readOnly
                className="h-11 rounded-xl bg-muted border-border text-sm font-medium text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-3.5 rounded-xl border border-border">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sua conta está ativa com plano ilimitado do Pastah Workspace.</span>
          </div>
        </div>

        {/* Design System & Aesthetics Card */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Design System & Diagramação</h3>
              <p className="text-xs text-muted-foreground">Padrões visuais aplicados aos documentos gerados</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex justify-between items-center p-3 rounded-xl bg-muted border border-border">
              <div>
                <p className="font-semibold text-foreground">Tema Ativo</p>
                <p className="text-muted-foreground">Pastah Editorial — Minimalismo com tipografia Manrope & Hanken Grotesk</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                Ativo
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-muted border border-border">
              <div>
                <p className="font-semibold text-foreground">Motor de PDF</p>
                <p className="text-muted-foreground">Renderizador vetorial de alta definição para documentos comerciais</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Conectado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
