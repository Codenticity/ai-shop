import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

export async function getAllProductsAdmin() {
  return db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));
}

export async function getProductById(id: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return product ?? null;
}