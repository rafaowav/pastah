import { getDocumentByIdAction, getRelatedDocumentsAction } from '@/features/documents/actions'
import { DocumentDetailClient } from '@/features/documents/components/document-detail-client'
import { notFound } from 'next/navigation'

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getDocumentByIdAction(id)
  if (!result.success) notFound()

  const relatedResult = await getRelatedDocumentsAction(id)
  const related = relatedResult.success ? relatedResult.data : []

  return <DocumentDetailClient document={result.data} related={related} />
}
