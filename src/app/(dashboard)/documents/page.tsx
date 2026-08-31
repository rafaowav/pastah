import { getDocumentsAction } from '@/features/documents/actions'
import { DocumentListClient } from '@/features/documents/components/document-list-client'

export default async function DocumentsPage() {
  const result = await getDocumentsAction()
  const documents = result.success ? result.data : []

  return <DocumentListClient initialDocuments={documents} />
}