import {
  pgTable,
  varchar,
  decimal,
  timestamp,
  pgEnum,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';

// Enums
export const currencyEnum = pgEnum('currency', ['USD', 'EUR', 'GBP']);
export const frequencyEnum = pgEnum('frequency', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);
export const categoryEnum = pgEnum('category', [
  'sports',
  'news',
  'entertainment',
  'lifestyle',
  'technology',
  'finance',
  'politics',
  'other',
]);
export const statusEnum = pgEnum('status', ['active', 'cancelled', 'expired']);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    currency: currencyEnum('currency').default('USD').notNull(),
    frequency: frequencyEnum('frequency').notNull(),
    category: categoryEnum('category').notNull(),
    paymentMethod: varchar('payment_method', { length: 100 }).notNull(),
    status: statusEnum('status').default('active').notNull(),
    startDate: timestamp('start_date').notNull(),
    renewalDate: timestamp('renewal_date'),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
  }),
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

// Types for insert and select
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
