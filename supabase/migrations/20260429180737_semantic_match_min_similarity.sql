-- Add p_min_similarity threshold to match_solutions_semantic so weak/off-category
-- results don't pad the list when the limit is high (e.g. limit=24).
--
-- Adding a new parameter changes the function signature, so we must DROP and
-- recreate (CREATE OR REPLACE requires identical argument list).

DROP FUNCTION IF EXISTS match_solutions_semantic(extensions.vector(768), text[], int);

CREATE OR REPLACE FUNCTION match_solutions_semantic(
  query_embedding extensions.vector(768),
  p_categories text[],
  p_limit int DEFAULT 6,
  p_min_similarity float DEFAULT 0.5
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
  WITH scored AS (
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
  )
  SELECT * FROM scored
  WHERE scored.relevance_score >= p_min_similarity
  ORDER BY scored.relevance_score DESC
  LIMIT p_limit;
END;
$$;
