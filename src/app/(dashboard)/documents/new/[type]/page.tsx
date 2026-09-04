import { getDocument } from '@/lib/document-engine/registry'
import { getClientsAction } from '@/features/clients/actions'
import { getCompaniesAction } from '@/features/companies/actions'
import { getProductsAction } from '@/features/products/actions'
import { getLinkableDocumentsAction } from '@/features/documents/actions'
import { DocumentStudio } from '@/features/documents/components/document-studio'
import { notFound } from 'next/navigation'

export default async function NewDocumentByTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>
  searchParams: Promise<{ linkedTo?: string }>
}) {
  const { type } = await params
  const { linkedTo } = await searchParams

  let docConfig
  try {
    docConfig = getDocument(type)
  } catch {
    notFound()
  }

  const [clientsResult, companiesResult, productsResult, linkableResult] = await Promise.all([
    getClientsAction(),
    getCompaniesAction(),
    getProductsAction(),
    type === 'recibo' ? getLinkableDocumentsAction() : Promise.resolve({ success: true as const, data: [] }),
  ])

  const clients = clientsResult.success ? clientsResult.data : []
  const companies = companiesResult.success ? companiesResult.data : []
  const products = productsResult.success ? productsResult.data : []
  const linkableDocuments = linkableResult.success ? linkableResult.data : []

  // Pré-seleciona o documento de origem quando vier de /documents/[id]?linkedTo=
  const presetSource = linkedTo
    ? linkableDocuments.find((d) => d.id === linkedTo) || null
    : null

  const initialData = presetSource
    ? {
        relatedDocumentIds: presetSource.id,
        clientId: presetSource.clientId || '',
        title: `Recibo — ${presetSource.title}`,
        amount: presetSource.totalAmount / 100,
        reference: `Pagamento referente a ${presetSource.title}`,
      }
    : {}

  return (
    <DocumentStudio
      type={type}
      initialData={initialData}
      clients={clients}
      companies={companies}
      products={products}
      linkableDocuments={linkableDocuments}
    />
  )
}
