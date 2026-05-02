-- Add a `metrics` JSONB column to chat_analytics_reports for the structured
-- analyses that don't need an LLM: funnel, drop-off-turn distribution, persona
-- split, coverage gaps, and period-over-period deltas.
--
-- Stored shape:
--   {
--     "funnel":            { "started": int, "completed": int, "linked": int, "engaged": int, "stages": [...] },
--     "drop_off_turns":    [{ "bucket": "1-2", "count": int }, ...],
--     "persona_split":     { "myself": {...}, "caregiver": {...}, "family": {...} } | null,
--     "coverage_gaps":     [{ "theme": str, "mentions": int, "solutions_in_category": int }, ...],
--     "previous_period":   { "period_start": iso, "period_end": iso, "deltas": {...} } | null
--   }

alter table chat_analytics_reports
  add column metrics jsonb;
