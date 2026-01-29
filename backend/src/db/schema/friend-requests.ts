import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const friendRequests = pgTable('friend_requests', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').notNull().references(() => users.id),
  receiverId: integer('receiver_id').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type FriendRequest = typeof friendRequests.$inferSelect;
export type NewFriendRequest = typeof friendRequests.$inferInsert;
