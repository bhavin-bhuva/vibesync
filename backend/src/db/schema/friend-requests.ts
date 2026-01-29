import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const friendRequests = pgTable('friend_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  receiverId: uuid('receiver_id').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type FriendRequest = typeof friendRequests.$inferSelect;
export type NewFriendRequest = typeof friendRequests.$inferInsert;
