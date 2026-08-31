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
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
          Configurações
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Gerencie seu perfil, preferências do workspace e integrações.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Perfil do Usuário</h3>
              <p className="text-xs text-slate-500">Informações da sua conta no Pastah</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">Nome de Exibição</Label>
              <Input
                defaultValue={user?.name || ''}
                readOnly
                className="h-11 rounded-xl bg-slate-50/70 border-slate-200 text-sm font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">E-mail Cadastrado</Label>
              <Input
                type="email"
                defaultValue={user?.email || ''}
                readOnly
                className="h-11 rounded-xl bg-slate-50/70 border-slate-200 text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sua conta está ativa com plano ilimitado do Pastah Workspace.</span>
          </div>
        </div>

        {/* Design System & Aesthetics Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Design System & Diagramação</h3>
              <p className="text-xs text-slate-500">Padrões visuais aplicados aos documentos gerados</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900">Tema Ativo</p>
                <p className="text-slate-400">Pastah Editorial — Minimalismo com tipografia Manrope & Hanken Grotesk</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                Ativo
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-semibold text-slate-900">Motor de PDF</p>
                <p className="text-slate-400">Renderizador vetorial de alta definição para documentos comerciais</p>
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
