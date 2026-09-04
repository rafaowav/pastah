import { pgTable, uuid, text, timestamp, jsonb, index, numeric, uniqueIndex, integer } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { companies } from './companies'
import { clients } from './clients'

/**
 * Valores monetários são armazenados em centavos (integer) para evitar
 * problemas de precisão com ponto flutuante. Ex: R$ 1.234,56 => 123456
 */
export const DOCUMENT_OPERATIONAL_STATUSES = [
  'rascunho',
  'enviado',
  'aprovado',
  'recusado',
  'finalizado',
  'arquivado',
] as const

export const DOCUMENT_PAYMENT_STATUSES = [
  'pendente',
  'parcialmente_recebido',
  'recebido',
  'cancelado',
] as const

export type DocumentOperationalStatus = (typeof DOCUMENT_OPERATIONAL_STATUSES)[number]
export type DocumentPaymentStatus = (typeof DOCUMENT_PAYMENT_STATUSES)[number]

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').references(() => companies.id),
  clientId: uuid('client_id').references(() => clients.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  status: text('status').notNull().default('rascunho'),
  data: jsonb('data').$type<Record<string, any>>().notNull(),
  templateId: uuid('template_id'),
  isFavorite: text('is_favorite').default('false'),
  // Campos financeiros (centavos)
  totalAmount: integer('total_amount').notNull().default(0),
  receivedAmount: integer('received_amount').notNull().default(0),
  paymentStatus: text('payment_status').notNull().default('pendente'),
  receivedAt: timestamp('received_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userIdIdx: index('documents_user_idx').on(table.userId),
  typeIdx: index('documents_type_idx').on(table.type),
  statusIdx: index('documents_status_idx').on(table.status),
  paymentStatusIdx: index('documents_payment_status_idx').on(table.paymentStatus),
  userIdDeletedAtIdx: index('documents_user_deleted_at_idx').on(table.userId, table.deletedAt),
  companyIdDeletedAtIdx: index('documents_company_deleted_at_idx').on(table.companyId, table.deletedAt),
}))

export const documentRelations = pgTable('document_relations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceDocumentId: uuid('source_document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  targetDocumentId: uuid('target_document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  relationType: text('relation_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  sourceIdx: index('document_relations_source_idx').on(table.sourceDocumentId),
  targetIdx: index('document_relations_target_idx').on(table.targetDocumentId),
  sourceTargetIdx: uniqueIndex('document_relations_source_target_unique').on(
    table.sourceDocumentId,
    table.targetDocumentId,
    table.relationType,
  ),
}))

export const DOCUMENT_RELATION_TYPES = [
  'recibo_de',
  'gerado_a_partir_de',
  'vinculado_a',
  'substitui',
] as const

export type DocumentRelationType = (typeof DOCUMENT_RELATION_TYPES)[number]
