// app/(store)/account/page.tsx
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-500">Logged in as</p>
        <p className="font-medium mt-1">{session.user.email}</p>
      </div>
    </div>
  );
}