'use client'

import * as React from 'react'
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar'
import Link from 'next/link'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen, toggle } = useSidebar()

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`hidden w-64 border-r bg-muted/20 md:block p-4 transition-colors`}
        aria-label="Sidebar"
      >
        <nav className="space-y-2 text-sm text-muted-foreground">
          <ul className="space-y-1">
            <li>
              <Link href="/" className="flex items-center gap-3 hover:text-foreground transition-colors">
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/documents" className="flex items-center gap-3 hover:text-foreground transition-colors">
                <span className="hidden sm:inline">Documentos</span>
              </Link>
            </li>
            <li>
              <Link href="/clients" className="flex items-center gap-3 hover:text-foreground transition-colors">
                <span className="hidden sm:inline">Clientes</span>
              </Link>
            </li>
            <li>
              <Link href="/companies" className="flex items-center gap-3 hover:text-foreground transition-colors">
                <span className="hidden sm:inline">Empresas</span>
              </Link>
            </li>
            <li>
              <Link href="/products" className="flex items-center gap-3 hover:text-foreground transition-colors">
                <span className="hidden sm:inline">Produtos</span>
              </Link>
            </li>
            <li>
              <Link href="/templates" className="flex items-center gap-3 hover:text-foreground transition-colors">
                <span className="hidden sm:inline">Templates</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-tight">Pastah Workspace</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle sidebar"
            >
              {isOpen ? '←' : '→'}
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}