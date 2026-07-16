// lib/db/queries/products.ts
//
// Plain server-side data access — called directly from async Server
// Components. No API route needed for reads; this is what "server-first
// data flow" means in practice.

import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

export async function getAllProducts(limit = 24) {
  return db.select().from(products).orderBy(desc(products.createdAt)).limit(limit);
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return product ?? null;
}

export async function getProductsByCategory(category: string, limit = 24) {
  return db
    .select()
    .from(products)
    .where(eq(products.category, category))
    .limit(limit);
}

export async function getDistinctCategories() {
  const rows = await db
    .select({ category: products.category })
    .from(products)
    .groupBy(products.category)
    .orderBy(sql`count(*) desc`);
  return rows.map((r) => r.category);
}
