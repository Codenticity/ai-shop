import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-52 border-r border-zinc-200 bg-white px-4 py-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Admin
        </p>
        <nav className="flex flex-col gap-1">
          <Link href="/admin" className="rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
            Dashboard
          </Link>
          <Link href="/admin/products" className="rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
            Products
          </Link>
          <Link href="/admin/orders" className="rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
            Orders
          </Link>
        </nav>
      </aside>
      <div className="flex-1 bg-zinc-50 px-8 py-8">{children}</div>
    </div>
  );
}