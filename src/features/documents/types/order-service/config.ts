import { DocumentDefinition } from '@/lib/document-engine/types'
import { orderServiceSchema } from './schema'
import { OrderServiceFields } from './fields'
import { OrderServiceTemplate } from './template'
import { OrderServicePdf } from './pdf'
import { Clipboard } from 'lucide-react'

export const ordemServicoConfig: DocumentDefinition = {
  id: 'ordem-servico',
  name: 'Ordem de Serviço',
  description: 'Gere ordens de serviço técnicas com diagnóstico, peças, mão de obra e laudo',
  icon: Clipboard,
  schema: orderServiceSchema,
  fields: OrderServiceFields as any,
  template: OrderServiceTemplate,
  pdf: OrderServicePdf,
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