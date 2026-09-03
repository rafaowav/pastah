import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core'
import { users } from './auth'
import { companies } from './companies'

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyId: uuid('company_id').references(() => companies.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // welcome | company | client | document
  title: text('title').notNull(),
  message: text('message').notNull(),
  href: text('href'),
  readAt: timestamp('read_at', { mode: 'date' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('notifications_user_idx').on(table.userId),
  userReadIdx: index('notifications_user_read_idx').on(table.userId, table.readAt),
}))

export type NotificationRow = typeof notifications.$inferSelect
