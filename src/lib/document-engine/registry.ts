import { DocumentDefinition } from './types'
import { orcamentoConfig } from '@/features/documents/types/orcamento/config'
import { propostaConfig } from '@/features/documents/types/proposta/config'
import { reciboConfig } from '@/features/documents/types/receipt/config'
import { ordemServicoConfig } from '@/features/documents/types/order-service/config'
import { contratoConfig } from '@/features/documents/types/contract/config'

export const documentRegistry: Record<string, DocumentDefinition> = {
  // Slugs em português
  orcamento: orcamentoConfig,
  proposta: propostaConfig,
  recibo: reciboConfig,
  'ordem-servico': ordemServicoConfig,
  contrato: contratoConfig,

  // Aliases de compatibilidade (inglês)
  quote: orcamentoConfig,
  proposal: propostaConfig,
  receipt: reciboConfig,
  'service-order': ordemServicoConfig,
  contract: contratoConfig,
}

export function registerDocument(type: string, definition: DocumentDefinition) {
  documentRegistry[type] = definition
}

export function getDocument(type: string): DocumentDefinition {
  const doc = documentRegistry[type]
  if (!doc) {
    console.error(`Document type "${type}" not found in registry. Available:`, Object.keys(documentRegistry))
    throw new Error(`Document type "${type}" not found`)
  }
  return doc
}

export function getAllDocuments(): DocumentDefinition[] {
  const seen = new Set<string>()
  return Object.values(documentRegistry).filter((doc) => {
    if (seen.has(doc.id)) return false
    seen.add(doc.id)
    return true
  })
}
