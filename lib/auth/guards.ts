// lib/auth/guards.ts
//
// Call these from Server Components / Server Actions / Route Handlers that
// need to assert who's calling. Middleware (below) blocks unauthenticated
// requests at the edge for route groups; these guards are the second,
// authoritative check inside server logic (defense in depth — middleware
// can be misconfigured, this can't be bypassed).

import { auth } from "@/lib/auth/config";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if ((user as { role?: string }).role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
