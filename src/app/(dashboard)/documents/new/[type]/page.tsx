import { getDocument } from '@/lib/document-engine/registry'
import { getClientsAction } from '@/features/clients/actions'
import { getCompaniesAction } from '@/features/companies/actions'
import { getProductsAction } from '@/features/products/actions'
import { DocumentStudio } from '@/features/documents/components/document-studio'
import { notFound } from 'next/navigation'

export default async function NewDocumentByTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params

  let docConfig
  try {
    docConfig = getDocument(type)
  } catch {
    notFound()
  }

  const [clientsResult, companiesResult, productsResult] = await Promise.all([
    getClientsAction(),
    getCompaniesAction(),
    getProductsAction(),
  ])

  const clients = clientsResult.success ? clientsResult.data : []
  const companies = companiesResult.success ? companiesResult.data : []
  const products = productsResult.success ? productsResult.data : []

  return (
    <DocumentStudio
      type={type}
      initialData={{}}
      clients={clients}
      companies={companies}
      products={products}
    />
  )
}