import { DocumentDefinition } from '@/lib/document-engine/types'
import { quoteSchema } from './schema'
import { QuoteFields } from './fields'
import { QuoteTemplate } from './template'
import { FileText } from 'lucide-react'

export const quoteConfig: DocumentDefinition = {
  id: 'quote',
  name: 'Quote',
  description: 'Create professional quotes for clients',
  icon: FileText,
  schema: quoteSchema,
  fields: QuoteFields as any,
  template: QuoteTemplate,
  actions: {
    canEdit: true,
    canDelete: true,
    canShare: true,
    canExportPdf: true,
  },
  config: {
    requiresClient: true,
    requiresProducts: true,
    requiresCompany: true,
    maxItems: 50,
  },
}
