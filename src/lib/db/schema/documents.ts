import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { companies } from './companies'
import { clients } from './clients'

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').references(() => companies.id),
  clientId: uuid('client_id').references(() => clients.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  status: text('status').notNull().default('draft'),
  data: jsonb('data').$type<Record<string, any>>().notNull(),
  templateId: uuid('template_id'),
  isFavorite: text('is_favorite').default('false'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userIdIdx: index('documents_user_idx').on(table.userId),
  typeIdx: index('documents_type_idx').on(table.type),
  statusIdx: index('documents_status_idx').on(table.status),
  userIdDeletedAtIdx: index('documents_user_deleted_at_idx').on(table.userId, table.deletedAt),
}))
