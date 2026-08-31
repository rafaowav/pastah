import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { users } from './auth'

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  documentType: text('document_type').notNull(),
  name: text('name').notNull(),
  config: jsonb('config').$type<Record<string, any>>().notNull(),
  isGlobal: text('is_global').default('false'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userIdIdx: index('templates_user_idx').on(table.userId),
  typeIdx: index('templates_type_idx').on(table.documentType),
  userIdDeletedAtIdx: index('templates_user_deleted_at_idx').on(table.userId, table.deletedAt),
}))
