import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/db/queries/orders";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="text-sm text-zinc-400 hover:text-zinc-600"
        >
          ← Orders
        </Link>
        <span className="text-zinc-200">/</span>
        <h1 className="text-2xl font-semibold">Order detail</h1>
      </div>

      {/* Order summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Order ID</p>
          <p className="mt-1 font-mono text-sm">{order.id.slice(0, 8)}...</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Status</p>
          <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            order.status === "paid" ? "bg-green-100 text-green-700" :
            order.status === "fulfilled" ? "bg-blue-100 text-blue-700" :
            order.status === "cancelled" ? "bg-red-100 text-red-700" :
            "bg-zinc-100 text-zinc-600"
          }`}>
            {order.status}
          </span>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="mt-1 font-medium">${(order.totalCents / 100).toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Date</p>
          <p className="mt-1 text-sm">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Customer */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-medium text-zinc-700">Customer</h2>
        <p className="font-medium">{order.userName ?? "Guest"}</p>
        <p className="text-sm text-zinc-500">{order.userEmail}</p>
      </div>

      {/* Order items */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-sm font-medium text-zinc-700">Items</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Product</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Quantity</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Unit price</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.productImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.productImage}
                        alt={item.productName ?? ""}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    )}
                    <p className="font-medium">{item.productName}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">{item.quantity}</td>
                <td className="px-4 py-3 text-zinc-600">
                  ${(item.unitPriceCents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 font-medium">
                  ${((item.unitPriceCents * item.quantity) / 100).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}