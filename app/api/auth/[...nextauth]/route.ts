// app/api/auth/[...nextauth]/route.ts
// Required adapter route for NextAuth — the auth() helper used elsewhere
// calls into this under the hood. Not business logic, just plumbing.
import { handlers } from "@/lib/auth/config";
export const { GET, POST } = handlers;
