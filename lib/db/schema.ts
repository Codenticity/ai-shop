// lib/db/schema.ts
//
// Drizzle ORM schema. We use pgvector (a Postgres extension) instead of a
// separate vector database like Pinecone/Qdrant — for a catalog of a few
// thousand to a few hundred thousand products, pgvector with an HNSW index
// is plenty fast, and it means ONE database to operate instead of two.
// If you outgrow this (millions of products, need for a dedicated vector
// service), swap the vector columns/queries here for a Pinecone/Qdrant client
// — the rest of the app doesn't need to change.

import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  uuid,
  jsonb,
  vector,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["customer", "admin"]);
export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
]);
export const chatRole = pgEnum("chat_role", ["user", "assistant"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }),
  role: userRole("role").notNull().default("customer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  category: varchar("category", { length: 100 }).notNull(),
  brand: varchar("brand", { length: 100 }),
  imageUrl: text("image_url"),
  attributes: jsonb("attributes").$type<Record<string, unknown>>().default({}),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  // text-embedding-3-small has 1536 dimensions. The embedding is generated
  // from name + description + key attributes (see lib/ai/embed-products.ts)
  // and re-generated whenever product content changes.
  embedding: vector("embedding", { dimensions: 1024 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  status: orderStatus("status").notNull().default("pending"),
  totalCents: integer("total_cents").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

// Chat history is persisted per-user so the assistant has conversational
// memory across sessions and so recommendations can be audited.
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  role: chatRole("role").notNull(),
  content: text("content").notNull(),
  recommendedProductIds: jsonb("recommended_product_ids").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));
