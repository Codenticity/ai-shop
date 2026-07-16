// components/store/header.tsx
// Pure Server Component — no interactivity, no "use client" needed.

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          AI Shop
        </Link>
        <nav className="flex gap-6 text-sm text-zinc-600">
          <Link href="/cart">Cart</Link>
          <Link href="/account">Account</Link>
        </nav>
      </div>
    </header>
  );
}
