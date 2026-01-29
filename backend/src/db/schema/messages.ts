import { pgTable, uuid, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';
import { conversations } from './conversations';

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .references(() => conversations.id, { onDelete: 'cascade' })
    .notNull(),
  senderId: uuid('sender_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  messageType: varchar('message_type', { length: 50 }).default('text').notNull(), // text, image, file, etc.
  isRead: boolean('is_read').default(false).notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
