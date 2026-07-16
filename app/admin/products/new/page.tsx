// app/admin/products/new/page.tsx
import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/lib/actions/products";

export default function NewProductPage() {
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
        <h1 className="text-2xl font-semibold">Add product</h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <ProductForm action={createProduct} submitLabel="Add product" />
      </div>
    </div>
  );
}