-- Fix solution matching: ensure match_solutions_semantic is version-controlled
-- and applies a category boost so off-category solutions stop drowning relevant ones.
--
-- Background: /api/match was calling match_solutions_vector, a dashboard-only
-- function that ignored p_categories and returned top-K by raw cosine similarity.
-- That let off-category solutions (e.g. "Tube Opener" for bathing queries,
-- "Parking Pass Hanger" for dressing queries) outrank in-category ones.

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

-- Note: the legacy match_solutions_vector function is left in place (dormant).
-- The code change in apps/web/app/api/match/route.ts now calls
-- match_solutions_semantic exclusively, so the old function becomes unused.
-- Leaving it intact preserves an instant rollback path: revert the code
-- change and traffic returns to match_solutions_vector untouched.
