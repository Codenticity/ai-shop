# AI Shop — RAG-powered e-commerce (Next.js, TypeScript, Postgres+pgvector, Claude)

A server-first Next.js 15 App Router app. Server Components fetch data
directly from Postgres; the only client components are the chat widget,
the add-to-cart button, and auth forms — everything else ships zero JS.

## Architecture

```
app/                  → routes (Server Components by default)
  api/                → route handlers ONLY for: chat (external LLM call),
                        checkout (Stripe server call), webhooks (inbound
                        third-party calls), auth (NextAuth plumbing)
  (auth)/, (store)/   → route groups, no effect on URL
components/
  ui/                 → design-system primitives (buttons, cards, inputs)
  store/, chat/       → feature components, server unless marked "use client"
lib/
  db/                 → Drizzle schema, connection, server-only queries
  auth/               → NextAuth config + guards
  ai/                 → embeddings, vector search, filter extraction,
                        recommendation generation (the RAG pipeline)
  actions/            → Server Actions (mutations callable from client
                        components without hand-written API routes)
services/
  stripe/, email/     → external API clients
```

## Request flow: the RAG chat query

1. Browser → `POST /api/chat` with the user's free-text message.
2. `lib/ai/extract-filters.ts` asks Claude to pull hard constraints
   (price ceiling, category) out of the sentence as structured JSON.
3. `lib/ai/search-products.ts` embeds the cleaned query, then runs a
   cosine-similarity search in Postgres via pgvector's HNSW index,
   pre-filtered by the extracted price/category constraints.
4. `lib/ai/recommend.ts` sends the retrieved candidates (and only those)
   to Claude, which writes a grounded recommendation and cites which
   product IDs it picked — it's instructed never to invent a product.
5. Result is persisted to `chat_messages` and returned to the browser as JSON.

For ordinary page loads (home, product detail), there's no API route at
all: the Server Component calls `lib/db/queries/products.ts` directly
during render.

## Windows setup (PowerShell)

### 1. Prerequisites
```powershell
# Node 20+, PostgreSQL 16+ with pgvector. Easiest path: Docker Desktop.
winget install Docker.DockerDesktop
winget install OpenJS.NodeJS.LTS
```

### 2. Start Postgres with pgvector
```powershell
docker run -d --name ai-shop-db `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=ai_shop `
  -p 5432:5432 `
  pgvector/pgvector:pg16
```

### 3. Install dependencies
```powershell
cd ai-shop
npm install
```

### 4. Configure environment
```powershell
Copy-Item .env.example .env.local
notepad .env.local   # fill in ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.

# Generate AUTH_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# paste the output as AUTH_SECRET in .env.local
```

### 5. Set up the database
```powershell
# Enable pgvector + HNSW index
Get-Content .\lib\db\sql\0001_init.sql | docker exec -i ai-shop-db psql -U postgres -d ai_shop

# Generate and apply Drizzle migrations
npm run db:generate
npm run db:migrate

# Seed sample products, then embed them
npm run db:seed
npm run embed:products
```

### 6. Run
```powershell
npm run dev
```
Visit http://localhost:3000 — try the chat widget with:
"waterproof hiking backpack under $120 that fits a 16-inch laptop"

### 7. Stripe webhook (local testing)
```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the printed whsec_... into .env.local as STRIPE_WEBHOOK_SECRET
```

## Why pgvector instead of Pinecone/Qdrant

One database to run, back up, and reason about. At catalog sizes up to
roughly hundreds of thousands of products, an HNSW index in pgvector is
fast enough that a separate vector service adds ops cost without a real
latency win. If you later need multi-region replication or tens of
millions of vectors, swap `lib/ai/search-products.ts` for a Pinecone/Qdrant
client — nothing else in the app needs to change.

## What's intentionally left as a TODO

- Rate limiting on `/api/chat` (add before going live — LLM calls are not free)
- Order fulfillment emails (`services/email/` is stubbed, wire up Resend)
- Admin product CRUD UI (`app/admin/` exists as a route, not yet built out)
- Pagination on the product grid
