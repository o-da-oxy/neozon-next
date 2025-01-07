import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  primaryKey,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const createTable = pgTableCreator((name) => `t3_${name}`);

export const users = createTable(
  'users',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
    email: varchar('email', { length: 256 }).notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (users) => ({
    emailIndex: index('email_idx').on(users.email),
  }),
);

export const orderStatus = pgEnum('order_status', ['in_cart', 'placed', 'shipped', 'delivered']);

export const carts = createTable(
  'carts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull(),
    quantity: integer('quantity').notNull().default(1),
    status: orderStatus('status').notNull().default('in_cart'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
  },
  (cart) => ({
    pk: primaryKey(cart.userId, cart.productId),
  }),
);

export const orders = createTable('orders', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  status: orderStatus('status').notNull().default('placed'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
});
