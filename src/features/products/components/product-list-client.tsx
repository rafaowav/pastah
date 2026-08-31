'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Plus,
  Search,
  Tag,
  Pencil,
  Trash2,
  DollarSign,
  Boxes,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { deleteProductAction } from '@/features/products/actions'

interface ProductListClientProps {
  initialProducts: any[]
}

export function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [products, setProducts] = useState<any[]>(initialProducts)
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este item?')) return

    try {
      const res = await deleteProductAction(id)
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success('Produto excluído com sucesso.')
      } else {
        toast.error(res.error || 'Erro ao excluir.')
      }
    } catch {
      toast.error('Erro ao excluir produto.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Catálogo de Produtos & Serviços
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {products.length}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Cadastre itens, serviços e valores pré-definidos para agilizar a criação de orçamentos e propostas.
          </p>
        </div>

        <Link href="/products/new">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl gap-1.5 h-10 px-5 shadow-sm font-semibold text-xs">
            <Plus className="w-4 h-4" /> Novo Item
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 card-shadow flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome, categoria ou código SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl bg-slate-50/80 border-slate-200"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 main-container-shadow space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-heading font-bold text-base text-slate-900">Nenhum item cadastrado</h3>
            <p className="text-xs text-slate-500">
              {search ? 'Nenhum resultado para a busca.' : 'Cadastre seus serviços ou produtos para preenchimento com 1 clique.'}
            </p>
          </div>
          <Link href="/products/new" className="inline-block pt-2">
            <Button size="sm" className="bg-slate-900 text-white rounded-xl text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Primeiro Item
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const priceNumber = Number(product.price || 0)

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 main-container-shadow card-shadow-hover flex flex-col justify-between space-y-5 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {product.category || 'Geral'}
                    </span>
                    {product.sku && (
                      <span className="text-[11px] font-mono text-slate-400">SKU: {product.sku}</span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Preço Base</span>
                    <span className="font-heading text-xl font-bold text-slate-900">
                      R$ {priceNumber.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold h-9 border-slate-200 hover:bg-slate-50 gap-1.5">
                        <Pencil className="w-3.5 h-3.5" /> Editar
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
