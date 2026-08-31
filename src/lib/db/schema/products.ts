import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { users } from './auth'

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: text('price').notNull(), // store as string to avoid precision issues
  sku: text('sku'),
  category: text('category'),
  settings: jsonb('settings').$type<{
    taxable?: boolean
    stock?: number
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userIdIdx: index('products_user_idx').on(table.userId),
  userIdDeletedAtIdx: index('products_user_deleted_at_idx').on(table.userId, table.deletedAt),
}))
