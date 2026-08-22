'use client'

import * as React from 'react'
import { SidebarProvider, useSidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Plus } from 'lucide-react'
import { ArrowLeftRight } from 'lucide-react'

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, toggle } = useSidebar()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Header */}
        <Header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside
            className={`hidden w-64 border-r bg-muted/20 md:block p-4 transition-colors ${isOpen ? '' : 'transform translate-x-full'} lg:static`}
            onClick={toggle}
            aria-label="Open sidebar"
          >
            <nav className="space-y-2 text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-foreground transition-colors">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-7 7v-5a1 1 0 011-1h3v5z" />
                    </svg>
                    <span className="hidden sm:inline">Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="/documents" className="flex items-center gap-3 hover:text-foreground transition-colors">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v20a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    </svg>
                    <span className="hidden sm:inline">Documentos</span>
                  </a>
                </li>
                <li>
                  <a href="/clients" className="flex items-center gap-3 hover:text-foreground transition-colors">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17 21v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h8l2-3h2a2 2 0 012 2v4z" />
                    </svg>
                    <span className="hidden sm:inline">Clientes</span>
                  </a>
                </li>
                <li>
                  <a href="/companies" className="flex items-center gap-3 hover:text-foreground transition-colors">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2v2l2 2M12 20v2l2 2M2 4h20a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v2z" />
                    </svg>
                    <span className="hidden sm:inline">Empresas</span>
                  </a>
                </li>
                <li>
                  <a href="/products" className="flex items-center gap-3 hover:text-foreground transition-colors">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3 12h2l4 4h6l-4 4h2l-5-5h2L3 12z" />
                    </svg>
                    <span className="hidden sm:inline">Produtos</span>
                  </a>
                </li>
                <li>
                  <a href="/templates" className="flex items-center gap-3 hover:text-foreground transition-colors">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3v3l8 8h-2l-5 5V3H12zM2 12h20v2H2v-2zm0 4h20v2H2v-2zm0 4h20v2H2v-2zm-5.5 7.5a1 1 0 011 1h3.093a1 1 0 01.586.894l3.399 5.02a1 1 0 01-.19 1.25l-5.05-1.05a1 1 0 01-.79-.5l-3.687 3.687a1 1 0 01-1.25.198l-5.05-1.05a1 1 0 01-1.232-.69l2.153-5.333z" />
                    </svg>
                    <span className="hidden sm:inline">Templates</span>
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8 overflow-x-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 text-foreground"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3v3l8 8h-2l-5 5V3H12zM2 12h20v2H2v-2zm0 4h20v2H2v-2zm0 4h20v2H2v-2zM2 12h20v2H2V12zm0 4h16v2H2v-2z" />
                </svg>
                <span className="font-semibold tracking-tight">Pastah Workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggle}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                  aria-label="Toggle sidebar"
                >
                  {isOpen ? (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 2l-2 2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-7 7v-5a1 1 0 011-1h3v5z" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 2l-2 2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-7 7v-5a1 1 0 011-1h3v5z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}