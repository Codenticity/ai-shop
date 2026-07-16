import { getAllOrders } from "@/lib/db/queries/orders";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Order ID</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Total</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Date</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900">{order.userName ?? "Guest"}</p>
                  <p className="text-xs text-zinc-400">{order.userEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.status === "paid" ? "bg-green-100 text-green-700" :
                    order.status === "fulfilled" ? "bg-blue-100 text-blue-700" :
                    order.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-zinc-100 text-zinc-600"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  ${(order.totalCents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 transition"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="px-4 py-12 text-center text-zinc-400">
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}