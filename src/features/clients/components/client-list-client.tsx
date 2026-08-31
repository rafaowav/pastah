'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { deleteClientAction } from '@/features/clients/actions'

interface ClientListClientProps {
  initialClients: any[]
}

export function ClientListClient({ initialClients }: ClientListClientProps) {
  const [clients, setClients] = useState<any[]>(initialClients)
  const [search, setSearch] = useState('')

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.document && c.document.includes(search))
  )

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este cliente?')) return

    try {
      const res = await deleteClientAction(id)
      if (res.success) {
        setClients((prev) => prev.filter((c) => c.id !== id))
        toast.success('Cliente excluído com sucesso.')
      } else {
        toast.error(res.error || 'Erro ao excluir.')
      }
    } catch {
      toast.error('Erro ao excluir cliente.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Clientes Cadastrados
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {clients.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie contatos e dados de faturamento para preenchimento automático em documentos.
          </p>
        </div>

        <Link href="/clients/new">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl gap-1.5 h-10 px-5 shadow-sm font-semibold text-xs">
            <Plus className="w-4 h-4" /> Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 card-shadow flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome, e-mail ou documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl bg-slate-50/80 border-slate-200"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 main-container-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading font-bold text-base text-slate-900">Nenhum cliente cadastrado</h3>
            <p className="text-xs text-slate-500">
              {search ? 'Nenhum resultado para a busca.' : 'Cadastre seu primeiro cliente para gerar orçamentos rápidos.'}
            </p>
          </div>
          <Link href="/clients/new" className="inline-block pt-2">
            <Button size="sm" className="bg-slate-900 text-white rounded-xl text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Cadastrar Cliente
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 main-container-shadow card-shadow-hover flex flex-col justify-between space-y-5 group"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors shadow-sm">
                    {client.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-base text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {client.name}
                    </h3>
                    {client.document && (
                      <p className="text-[11px] text-slate-400 font-mono">{client.document}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  {client.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address?.city && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{client.address.city} {client.address.state ? `- ${client.address.state}` : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <Link href={`/clients/${client.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold h-9 border-slate-200 hover:bg-slate-50 gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(client.id)}
                  className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
