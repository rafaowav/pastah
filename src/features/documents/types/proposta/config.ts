import { DocumentDefinition } from '@/lib/document-engine/types'
import { propostaSchema } from './schema'
import { PropostaFields } from './fields'
import { ProposalTemplate } from './template'
import { PropostaPdf } from './pdf'
import { FileText } from 'lucide-react'

export const propostaConfig: DocumentDefinition = {
  id: 'proposta',
  name: 'Proposta Comercial',
  description: 'Elabore propostas executivas com escopo, cronograma de entregas e investimento',
  icon: FileText,
  schema: propostaSchema,
  fields: PropostaFields as any,
  template: ProposalTemplate,
  pdf: PropostaPdf,
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
    maxItems: 30,
  },
}