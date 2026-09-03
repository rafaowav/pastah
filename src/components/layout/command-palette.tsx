'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, FileText, Users, Building2, ArrowRight, Loader2 } from 'lucide-react'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { getDocumentsAction } from '@/features/documents/actions'
import { getClientsAction } from '@/features/clients/actions'
import { getCompaniesAction } from '@/features/companies/actions'

interface SearchResult {
  type: 'document' | 'client' | 'company'
  id: string
  title: string
  subtitle: string
  href: string
  icon: typeof FileText
}

interface SearchResult {
  type: 'document' | 'client' | 'company'
  id: string
  title: string
  subtitle: string
  href: string
  icon: typeof FileText
}

const quickActions = [
  { label: 'Criar Novo Orçamento', href: '/documents/new/orcamento', icon: Plus },
  { label: 'Criar Nova Proposta', href: '/documents/new/proposta', icon: Plus },
  { label: 'Emitir Novo Recibo', href: '/documents/new/recibo', icon: Plus },
  { label: 'Criar Ordem de Serviço', href: '/documents/new/ordem-servico', icon: Plus },
  { label: 'Criar Novo Contrato', href: '/documents/new/contrato', icon: Plus },
  { label: 'Cadastrar Novo Cliente', href: '/clients/new', icon: Users },
  { label: 'Cadastrar Nova Empresa', href: '/companies/new', icon: Building2 },
]

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Fetch search results
  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([])
      return
    }

    const q = query.toLowerCase().trim()
    let cancelled = false

    async function fetchResults() {
      setLoading(true)
      try {
        const [docsRes, clientsRes, companiesRes] = await Promise.all([
          getDocumentsAction(),
          getClientsAction(),
          getCompaniesAction(),
        ])

        if (cancelled) return

        const items: SearchResult[] = []

        if (docsRes.success) {
          for (const doc of docsRes.data) {
            const title = (doc.title || '').toLowerCase()
            const docType = (doc.type || '').toLowerCase()
            if (!title.includes(q) && !docType.includes(q)) continue
            items.push({
              type: 'document',
              id: doc.id,
              title: doc.title,
              subtitle: doc.type || 'Documento',
              href: `/documents?search=${encodeURIComponent(doc.title)}`,
              icon: FileText,
            })
          }
        }

        if (clientsRes.success) {
          for (const client of clientsRes.data) {
            const name = (client.name || '').toLowerCase()
            const email = (client.email || '').toLowerCase()
            const doc = (client.document || '').toLowerCase()
            if (!name.includes(q) && !email.includes(q) && !doc.includes(q)) continue
            items.push({
              type: 'client',
              id: client.id,
              title: client.name,
              subtitle: client.email || client.document || '',
              href: `/clients/${client.id}`,
              icon: Users,
            })
          }
        }

        if (companiesRes.success) {
          for (const company of companiesRes.data) {
            const name = (company.name || '').toLowerCase()
            if (!name.includes(q)) continue
            items.push({
              type: 'company',
              id: company.id,
              title: company.name,
              subtitle: company.document || company.email || '',
              href: `/companies/${company.id}`,
              icon: Building2,
            })
          }
        }

        setResults(items)
      } catch {
        if (!cancelled) setResults([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchResults()
    return () => { cancelled = true }
  }, [open, query])

  function handleSelect(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery('')
      setResults([])
    }
  }

  // Keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K'

  return (
    <>
      {/* Search trigger button in the header */}
      <button
        onClick={() => setOpen(true)}
        className="group relative flex items-center gap-2 w-full h-10 rounded-xl bg-muted border border-border hover:border-border hover:bg-accent transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <Search className="w-4 h-4 text-muted-foreground ml-3.5 shrink-0" />
        <span className="text-sm text-muted-foreground flex-1 truncate">
          Buscar documentos, clientes, empresas...
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 mr-3 text-[11px] font-medium text-muted-foreground bg-card border border-border px-1.5 py-0.5 rounded-md">
          {shortcutLabel}
        </kbd>
      </button>

      {/* Dialog overlay — using raw base-ui Dialog for the overlay */}
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup className="fixed top-[15%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl bg-popover shadow-xl ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 overflow-hidden">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Buscar documentos, clientes, empresas..."
                value={query}
                onValueChange={setQuery}
                autoFocus
              />

              <CommandList>
                <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Buscando...
                    </div>
                  ) : (
                    'Nenhum resultado encontrado.'
                  )}
                </CommandEmpty>

                {/* Quick Actions — shown when no query or empty */}
                {!query.trim() && (
                  <CommandGroup heading="Ações Rápidas">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <CommandItem
                          key={action.href}
                          onSelect={() => handleSelect(action.href)}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                            <Icon className="w-3.5 h-3.5 text-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                )}

                {/* Search Results */}
                {query.trim() && results.length > 0 && (
                  <>
                    <CommandGroup heading="Documentos">
                      {results.filter((r) => r.type === 'document').map((item) => {
                        const Icon = item.icon
                        return (
                          <CommandItem
                            key={item.id}
                            onSelect={() => handleSelect(item.href)}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>

                    <CommandGroup heading="Clientes">
                      {results.filter((r) => r.type === 'client').map((item) => {
                        const Icon = item.icon
                        return (
                          <CommandItem
                            key={item.id}
                            onSelect={() => handleSelect(item.href)}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>

                    <CommandGroup heading="Empresas">
                      {results.filter((r) => r.type === 'company').map((item) => {
                        const Icon = item.icon
                        return (
                          <CommandItem
                            key={item.id}
                            onSelect={() => handleSelect(item.href)}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  )
}