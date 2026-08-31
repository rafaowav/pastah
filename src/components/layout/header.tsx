'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  Search,
  Plus,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function Header({ user }: HeaderProps) {
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
    <header className="h-16 px-6 sm:px-8 border-b border-slate-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Buscar documentos, clientes ou faturas..."
            className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200/80 text-sm focus:bg-white transition-all w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <Link href="/documents/new" className="hidden sm:block">
          <Button
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 h-9 font-medium text-xs shadow-sm gap-1.5"
          >
            <Plus className="w-4 h-4" /> Novo Documento
          </Button>
        </Link>

        <button className="w-9 h-9 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200/80"></div>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
            <div className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-50 transition-colors">
              <Avatar className="h-9 w-9 rounded-xl border border-slate-200 shadow-sm">
                <AvatarFallback className="bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name ?? 'Usuário'}</p>
                <p className="text-[11px] text-slate-500 leading-none mt-1">{user?.email ?? ''}</p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 rounded-2xl p-2 card-shadow" align="end">
            <DropdownMenuLabel className="px-2 py-1.5">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="rounded-xl cursor-pointer p-0">
              <Link href="/documents" className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium">
                <FileText className="w-4 h-4 text-slate-500" />
                Meus Documentos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer p-0">
              <Link href="/settings" className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium">
                <Settings className="w-4 h-4 text-slate-500" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="rounded-xl text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2 text-xs font-medium px-2 py-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sair da Conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
