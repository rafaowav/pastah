'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { featuresConfig } from '@/config/features'
import {
  LayoutDashboard,
  FileText,
  FileStack,
  Users,
  Building2,
  Package,
  Settings,
  Sparkles,
  Plus,
} from 'lucide-react'

// Compatibility context
const SidebarContext = React.createContext<{
  isOpen: boolean
  toggle: () => void
}>({
  isOpen: true,
  toggle: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])
  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return React.useContext(SidebarContext)
}

const navItems = [
  { title: 'Visão geral', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Documentos', href: '/documents', icon: FileText },
  { title: 'Templates', href: '/templates', icon: FileStack },
  { title: 'Clientes', href: '/clients', icon: Users },
  { title: 'Empresas', href: '/companies', icon: Building2 },
  { title: 'Produtos', href: '/products', icon: Package },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 shrink-0 z-30 transition-all duration-300">
      {/* Brand Logo */}
      <Link href="/" className="mb-8 group" title="Pastah Workspace">
        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          <span className="font-heading font-bold text-xl tracking-tighter">P</span>
        </div>
      </Link>

      {/* Quick New Document Action */}
      <div className="mb-6">
        <Link href="/documents/new" title="Novo Documento">
          <button className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </Link>
      </div>

      {/* Navigation Items with Tooltip */}
      <nav className="flex flex-col gap-3 flex-1 w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="w-full flex justify-center group relative"
              title={item.title}
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 relative',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -left-1 w-1 h-5 bg-blue-600 rounded-r-full"></span>
                )}
              </div>

              {/* Floating Tooltip Label */}
              <span className="absolute left-16 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
                {item.title}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions: Settings */}
      <div className="flex flex-col gap-3 mt-auto w-full items-center pt-4 border-t border-slate-100">
        <Link
          href="/settings"
          className="w-full flex justify-center group relative"
          title="Configurações"
        >
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center transition-all',
              pathname === '/settings'
                ? 'bg-slate-900 text-white'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            <Settings className="w-5 h-5" />
          </div>
          <span className="absolute left-16 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
            Configurações
          </span>
        </Link>

        {featuresConfig.ai.enabled && (
          /* AI Assistant Indicator (desabilitado) */
          <button
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 text-white flex items-center justify-center shadow-md hover:opacity-95 transition-opacity text-xs font-bold mt-2 group relative"
            title="Pastah AI Assistant"
          >
            <Sparkles className="w-4 h-4" />
            <span className="absolute left-16 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md">
              Pastah AI
            </span>
          </button>
        )}
      </div>
    </aside>
  )
}