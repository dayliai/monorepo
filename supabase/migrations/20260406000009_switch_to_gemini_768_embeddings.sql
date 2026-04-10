-- Switch from OpenAI 1536-dim to Gemini 768-dim embeddings (free tier)
-- This clears existing embeddings since dimensions are changing

-- 1. Clear existing embeddings (they're 1536-dim, incompatible with 768)
TRUNCATE solution_embeddings;

-- 2. Drop the old index
DROP INDEX IF EXISTS solution_embeddings_embedding_idx;

-- 3. Alter the column to 768 dimensions
ALTER TABLE solution_embeddings
  ALTER COLUMN embedding TYPE extensions.vector(768);

-- 4. Recreate the index for 768-dim vectors
CREATE INDEX solution_embeddings_embedding_idx
  ON solution_embeddings USING ivfflat (embedding extensions.vector_cosine_ops)
  WITH (lists = 100);

-- 5. Update match_solutions_semantic() to accept 768-dim vectors
CREATE OR REPLACE FUNCTION match_solutions_semantic(
  query_embedding extensions.vector(768),
  p_categories text[],
  p_limit int DEFAULT 6
) RETURNS TABLE (
  id uuid, title text, description text, source_type text,
  adl_category text, disability_tags text[], price_tier text,
  is_diy boolean, what_made_it_work text, cover_image_url text,
  source_url text, created_at timestamptz, relevance_score float
) LANGUAGE plpgsql
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id, s.title, s.description, s.source_type,
    s.adl_category, s.disability_tags, s.price_tier,
    s.is_diy, s.what_made_it_work, s.cover_image_url,
    s.source_url, s.created_at,
    (
      (1 - (se.embedding <=> query_embedding)) * 0.7
      +
      CASE WHEN s.adl_category = ANY(p_categories) THEN 0.3 ELSE 0 END
    )::float AS relevance_score
  FROM all_solutions s
  INNER JOIN solution_embeddings se ON se.solution_id = s.id
  WHERE s.is_active = true
  ORDER BY relevance_score DESC
  LIMIT p_limit;
END;
$$;
