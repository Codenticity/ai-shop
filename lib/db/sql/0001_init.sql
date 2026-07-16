-- lib/db/sql/0001_init.sql
-- Run this once before the first drizzle-kit migration, or fold it into
-- your migration tooling. Enables pgvector and adds a fast approximate
-- nearest-neighbor index for product embeddings.

CREATE EXTENSION IF NOT EXISTS vector;

-- After drizzle-kit has created the `products` table with its `embedding`
-- vector(1536) column, add an HNSW index for fast cosine-similarity search.
-- HNSW (vs IVFFlat) needs no training step and works well from the first row,
-- which matters for a catalog that's actively growing.
CREATE INDEX IF NOT EXISTS products_embedding_hnsw_idx
  ON products
  USING hnsw (embedding vector_cosine_ops);
