import { DocumentDefinition } from './types'

export const documentRegistry: Record<string, DocumentDefinition> = {}

export function registerDocument(type: string, definition: DocumentDefinition) {
  documentRegistry[type] = definition
}

export function getDocument(type: string): DocumentDefinition {
  const doc = documentRegistry[type]
  if (!doc) throw new Error(`Document type "${type}" not found`)
  return doc
}

export function getAllDocuments(): DocumentDefinition[] {
  return Object.values(documentRegistry)
}
