// app/admin/products/[id]/edit/page.tsx
// Dynamic Server Component — loads the product by ID, pre-fills the form.

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/lib/db/queries/admin";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "@/lib/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  // Bind the product ID to the updateProduct action
  // so the form doesn't need to pass it as a hidden field
  const updateWithId = updateProduct.bind(null, id);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-sm text-zinc-400 hover:text-zinc-600"
        >
          ← Products
        </Link>
        <span className="text-zinc-200">/</span>
        <h1 className="text-2xl font-semibold">Edit product</h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <ProductForm
          action={updateWithId}
          submitLabel="Save changes"
          defaultValues={{
            name: product.name,
            description: product.description,
            price: (product.priceCents / 100).toFixed(2),
            category: product.category,
            brand: product.brand ?? "",
            imageUrl: product.imageUrl ?? "",
            stockQuantity: product.stockQuantity.toString(),
          }}
        />
      </div>
    </div>
  );
}