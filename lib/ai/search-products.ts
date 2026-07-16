import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { generateEmbedding } from "@/lib/ai/embeddings";
import type { Product, ProductSearchResult } from "@/lib/types";

export async function searchProductsByQuery(
  query: string,
  limit = 8
): Promise<ProductSearchResult[]> {
  const queryEmbedding = await generateEmbedding(query, "search_query");
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const rows = await db
    .select({
      product: products,
      distance: sql<number>`embedding <=> ${vectorLiteral}::vector`,
    })
    .from(products)
    .where(sql`embedding IS NOT NULL`)
    .orderBy(sql`embedding <=> ${vectorLiteral}::vector`)
    .limit(limit);

  return rows.map((row) => ({
    product: row.product as unknown as Product,
    similarity: 1 - row.distance,
  }));
}

export async function searchProductsWithFilters(
  query: string,
  filters: { maxPriceCents?: number; category?: string },
  limit = 8
): Promise<ProductSearchResult[]> {
  const queryEmbedding = await generateEmbedding(query, "search_query");
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const conditions = [sql`embedding IS NOT NULL`];

  if (filters.maxPriceCents) {
    conditions.push(sql`price_cents <= ${filters.maxPriceCents}`);
  }

  if (filters.category) {
    conditions.push(sql`category ILIKE ${"%" + filters.category + "%"}`);
  }

  const rows = await db
    .select({
      product: products,
      distance: sql<number>`embedding <=> ${vectorLiteral}::vector`,
    })
    .from(products)
    .where(sql.join(conditions, sql` AND `))
    .orderBy(sql`embedding <=> ${vectorLiteral}::vector`)
    .limit(limit);

  return rows.map((row) => ({
    product: row.product as unknown as Product,
    similarity: 1 - row.distance,
  }));
}
