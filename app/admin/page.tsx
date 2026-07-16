import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/admin/products" className="rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-300 transition">
          <p className="text-sm text-zinc-500">Products</p>
          <p className="mt-1 text-lg font-medium">Manage catalog</p>
        </Link>
        <Link href="/admin/orders" className="rounded-xl border border-zinc-200 bg-white p-6 hover:border-zinc-300 transition">
          <p className="text-sm text-zinc-500">Orders</p>
          <p className="mt-1 text-lg font-medium">View orders</p>
        </Link>
      </div>
    </div>
  );
}