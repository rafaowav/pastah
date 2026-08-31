import { getTemplatesAction } from '@/features/templates/actions'
import { TemplatesGalleryClient } from '@/features/templates/components/templates-gallery-client'

export default async function TemplatesPage() {
  const result = await getTemplatesAction()
  const templates = result.success ? result.data : []

  return <TemplatesGalleryClient customTemplates={templates} />
}
