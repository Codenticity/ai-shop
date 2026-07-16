// app/layout.tsx
// Root layout is a Server Component (no "use client") — it renders once on
// the server per navigation, not re-hydrated as interactive JS unless a
// child opts in.

import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/store/header";

export const metadata: Metadata = {
  title: "AI Shop — Smarter shopping, plain language",
  description: "Describe what you need in plain English. We'll find it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
