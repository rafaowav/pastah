import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { users } from './auth'

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  document: text('document'),
  email: text('email'),
  phone: text('phone'),
  website: text('website'),
  address: jsonb('address').$type<{
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }>(),
  settings: jsonb('settings').$type<{
    logo?: string
    primaryColor?: string
    secondaryColor?: string
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userIdIdx: index('companies_user_idx').on(table.userId),
  userIdDeletedAtIdx: index('companies_user_deleted_at_idx').on(table.userId, table.deletedAt),
}))