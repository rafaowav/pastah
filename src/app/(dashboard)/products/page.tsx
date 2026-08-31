import { getProductsAction } from '@/features/products/actions'
import { ProductListClient } from '@/features/products/components/product-list-client'

export default async function ProductsPage() {
  const result = await getProductsAction()
  const products = result.success ? result.data : []

  return <ProductListClient initialProducts={products} />
}
