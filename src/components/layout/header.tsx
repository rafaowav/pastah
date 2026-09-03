'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import {
  Search,
  Plus,
  Bell,
  BellOff,
  Settings,
  LogOut,
  FileText,
  CheckCheck,
  Check,
  Building2,
  Moon,
  Sun,
  Monitor,
  User,
  Users,
  Clipboard,
  FileSignature,
  Wallet,
  TrendingUp,
  PlusCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CommandPalette } from './command-palette'
import { NotificationsBell } from './notifications-bell'
import { ThemeToggle } from '@/components/theme-toggle'
import { setActiveCompanyAction } from '@/features/companies/active-company'

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  }
  companies?: any[]
  activeCompany?: any
}

const docQuickActions = [
  { label: 'Orçamento Comercial', href: '/documents/new/orcamento', icon: TrendingUp },
  { label: 'Proposta Comercial', href: '/documents/new/proposta', icon: FileText },
  { label: 'Recibo de Pagamento', href: '/documents/new/recibo', icon: Wallet },
  { label: 'Ordem de Serviço', href: '/documents/new/ordem-servico', icon: Clipboard },
  { label: 'Contrato de Prestação de Serviços', href: '/documents/new/contrato', icon: FileSignature },
]

export function Header({ user, companies = [], activeCompany }: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  async function handleCompanyChange(companyId: string) {
    const res = await setActiveCompanyAction(companyId)
    if (res.success) {
      router.refresh()
    }
  }

  function handleSignOut() {
    signOut({ callbackUrl: '/login' })
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <header className="relative h-16 px-4 sm:px-6 border-b border-border bg-background/95 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
      {/* Left: Search - Command Palette */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <CommandPalette />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Company Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden sm:flex items-center gap-1.5 h-9 px-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="max-w-28 truncate">
              {activeCompany?.name || companies[0]?.name || 'Nenhuma empresa'}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-2xl p-2 card-shadow" align="end">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Empresas
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {companies.length === 0 ? (
              <div className="px-2 py-3 space-y-2">
                <p className="text-xs text-muted-foreground text-center">
                  Nenhuma empresa cadastrada
                </p>
                <Button
                  size="sm"
                  onClick={() => router.push('/companies/new')}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/80 rounded-xl text-xs h-8"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Cadastrar empresa
                </Button>
              </div>
            ) : (
              <>
                <div className="px-2 pb-1">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {activeCompany?.name || companies[0]?.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {activeCompany?.document || companies[0]?.document || ''}
                  </p>
                </div>
                {companies.map((company) => (
                  <DropdownMenuItem
                    key={company.id}
                    onClick={() => handleCompanyChange(company.id)}
                    className={`rounded-xl cursor-pointer text-xs font-medium ${
                      (activeCompany?.id || companies[0]?.id) === company.id
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    {company.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            {companies.length > 0 && (
              <>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => router.push('/companies/new')}
                  className="rounded-xl cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  Adicionar Nova Empresa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-5 w-px bg-border hidden sm:block" />

        {/* New Document Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="sm"
                className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3 h-9 font-medium text-xs shadow-sm gap-1.5"
              />
            }
          >
            <Plus className="w-4 h-4" /> Novo Documento
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-2xl p-2 card-shadow" align="end">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Criar Documento
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {docQuickActions.map((action) => {
              const Icon = action.icon
              return (
                <DropdownMenuItem
                  key={action.href}
                  onClick={() => router.push(action.href)}
                  className="rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 w-full px-1 py-0.5">
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{action.label}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => router.push('/documents/new')}
              className="rounded-xl cursor-pointer text-xs font-medium text-blue-600"
            >
              <Plus className="w-4 h-4" />
              Ver todos os modelos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile: direct link */}
        <Link
          href="/documents/new"
          className="sm:hidden bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-3 h-9 inline-flex items-center justify-center font-medium text-xs shadow-sm gap-1.5"
        >
          <Plus className="w-4 h-4" />
        </Link>

        {/* Notifications */}
        <NotificationsBell />

        {/* Theme Toggle (desktop quick action) */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        <div className="h-5 w-px bg-border" />

        {/* User Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <div className="flex items-center gap-2.5 p-1 rounded-full hover:bg-accent transition-colors">
              <Avatar className="h-9 w-9 rounded-xl border border-border shadow-sm">
                <AvatarFallback className="bg-muted text-foreground font-semibold text-xs rounded-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-foreground leading-none">{user?.name ?? 'Usuário'}</p>
                <p className="text-[11px] text-muted-foreground leading-none mt-1">{user?.email ?? ''}</p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 rounded-2xl p-2 card-shadow" align="end">
            <DropdownMenuLabel className="px-2 py-1.5">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="rounded-xl cursor-pointer"
            >
              <div className="flex items-center gap-2 w-full px-1 py-0.5 text-xs font-medium">
                <User className="w-4 h-4 text-muted-foreground" />
                Perfil / Minha Conta
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push('/companies')}
              className="rounded-xl cursor-pointer"
            >
              <div className="flex items-center gap-2 w-full px-1 py-0.5 text-xs font-medium">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Configurações da Empresa
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className="rounded-xl cursor-pointer"
            >
              <div className="flex items-center gap-2 w-full px-1 py-0.5 text-xs font-medium">
                <Sun className="w-4 h-4 text-amber-500" />
                Tema claro
                {theme === 'light' && <Check className="w-3.5 h-3.5 ml-auto text-blue-600" />}
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className="rounded-xl cursor-pointer"
            >
              <div className="flex items-center gap-2 w-full px-1 py-0.5 text-xs font-medium">
                <Moon className="w-4 h-4 text-amber-400" />
                Tema escuro
                {theme === 'dark' && <Check className="w-3.5 h-3.5 ml-auto text-blue-600" />}
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setTheme('system')}
              className="rounded-xl cursor-pointer"
            >
              <div className="flex items-center gap-2 w-full px-1 py-0.5 text-xs font-medium">
                <Monitor className="w-4 h-4 text-slate-500" />
                Usar tema do sistema
                {theme === 'system' && <Check className="w-3.5 h-3.5 ml-auto text-blue-600" />}
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="rounded-xl text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <div className="flex items-center gap-2 w-full px-1 py-0.5 text-xs font-medium">
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}