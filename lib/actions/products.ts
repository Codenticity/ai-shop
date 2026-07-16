"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/guards";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceCents = Math.round(
    parseFloat(formData.get("price") as string) * 100
  );
  const category = formData.get("category") as string;
  const brand = (formData.get("brand") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string) || 0;

  await db.insert(products).values({
    slug: slugify(name),
    name,
    description,
    priceCents,
    category,
    brand,
    imageUrl,
    stockQuantity,
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceCents = Math.round(
    parseFloat(formData.get("price") as string) * 100
  );
  const category = formData.get("category") as string;
  const brand = (formData.get("brand") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string) || 0;

  await db
    .update(products)
    .set({
      name,
      slug: slugify(name),
      description,
      priceCents,
      category,
      brand,
      imageUrl,
      stockQuantity,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
}