import { DocumentDefinition } from '@/lib/document-engine/types'
import { orcamentoSchema } from './schema'
import { OrcamentoFields } from './fields'
import { OrcamentoTemplate } from './template'
import { OrcamentoPdf } from './pdf'
import { DollarSign } from 'lucide-react'

export const orcamentoConfig: DocumentDefinition = {
  id: 'orcamento',
  name: 'Orçamento',
  description: 'Crie orçamentos comerciais detalhados com tabela de itens e cálculo automático',
  icon: DollarSign,
  schema: orcamentoSchema,
  fields: OrcamentoFields as any,
  template: OrcamentoTemplate,
  pdf: OrcamentoPdf,
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