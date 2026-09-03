import { DocumentDefinition } from '@/lib/document-engine/types'
import { contractSchema } from './schema'
import { ContractFields } from './fields'
import { ContractTemplate } from './template'
import { ContractPdf } from './pdf'
import { FileText } from 'lucide-react'

export const contratoConfig: DocumentDefinition = {
  id: 'contrato',
  name: 'Contrato de Prestação de Serviços',
  description: 'Redija contratos de serviços com cláusulas jurídicas, prazos e assinaturas',
  icon: FileText,
  schema: contractSchema,
  fields: ContractFields as any,
  template: ContractTemplate,
  pdf: ContractPdf,
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