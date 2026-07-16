// lib/ai/embed-products.ts
//
// Run with: npm run embed:products
// Backfills/refreshes embeddings for every product. Call this after seeding
// or whenever product content changes in bulk (e.g. a catalog import).

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateEmbedding, productToEmbeddingText } from "@/lib/ai/embeddings";

async function main() {
  const allProducts = await db.select().from(products);
  console.log(`Embedding ${allProducts.length} products...`);

  for (const product of allProducts) {
    const text = productToEmbeddingText(product);
    const embedding = await generateEmbedding(text);

    await db
      .update(products)
      .set({ embedding, updatedAt: new Date() })
      .where(eq(products.id, product.id));

    console.log(`  ✓ ${product.name}`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
