// app/admin/products/page.tsx
// Server Component — fetches all products and renders the list.
// No client JS needed for the list itself — only the delete button is a client component.

import Link from "next/link";
import { getAllProductsAdmin } from "@/lib/db/queries/admin";
import { DeleteProductButton } from "@/components/admin/delete-button";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition"
        >
          + Add product
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Image</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Category</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Price</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <div className="h-12 w-12 rounded-lg bg-zinc-100 overflow-hidden">
                    {product.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900">{product.name}</p>
                  <p className="text-xs text-zinc-400">{product.slug}</p>
                </td>
                <td className="px-4 py-3 text-zinc-600">{product.category}</td>
                <td className="px-4 py-3 text-zinc-600">
                  ${(product.priceCents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-zinc-600">{product.stockQuantity}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 transition"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={product.id} name={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="px-4 py-12 text-center text-zinc-400">
            No products yet.{" "}
            <Link href="/admin/products/new" className="underline">
              Add your first one.
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}