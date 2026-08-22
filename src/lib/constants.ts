export const APP_NAME = "Pastah"
export const APP_DESCRIPTION = "Workspace de Documentos"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const DOCUMENT_TYPES = [
  "orcamento",
  "proposta",
  "recibo",
  "ordem-servico",
  "contrato",
  "declaracao",
  "autorizacao",
  "procuracao",
] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export const DOCUMENT_STATUS = [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "archived",
] as const

export type DocumentStatus = (typeof DOCUMENT_STATUS)[number]