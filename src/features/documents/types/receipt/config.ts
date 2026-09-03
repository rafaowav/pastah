import { DocumentDefinition } from '@/lib/document-engine/types'
import { receiptSchema } from './schema'
import { ReceiptFields } from './fields'
import { ReceiptTemplate } from './template'
import { ReceiptPdf } from './pdf'
import { DollarSign } from 'lucide-react'

export const reciboConfig: DocumentDefinition = {
  id: 'recibo',
  name: 'Recibo de Pagamento',
  description: 'Emita recibos e comprovantes de pagamento formais com valor por extenso',
  icon: DollarSign,
  schema: receiptSchema,
  fields: ReceiptFields as any,
  template: ReceiptTemplate,
  pdf: ReceiptPdf,
  actions: {
    canEdit: true,
    canDelete: true,
    canShare: true,
    canExportPdf: true,
  },
  config: {
    requiresClient: true,
    requiresProducts: false,
    requiresCompany: true,
    maxItems: 1,
  },
}