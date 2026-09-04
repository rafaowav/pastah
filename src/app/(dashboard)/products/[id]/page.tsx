import { getProductByIdAction } from '@/features/products/actions'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/features/products/components/product-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getProductByIdAction(id)
  
  if (!result.success) {
    notFound()
  }
  
  const product = result.data
  const formData = {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    price: product.price ?? '',
    sku: product.sku ?? '',
    category: product.category ?? '',
    settings: product.settings ?? {},
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Edição de Item</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Editar Item: {product.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Atualize o valor ou descrição do item no catálogo.
          </p>
        </div>
      </div>

      <ProductForm mode="edit" initialData={formData} />
    </div>
  )
}