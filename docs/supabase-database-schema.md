# Dayli AI — Supabase Database Schema

**Version:** v4 | **Database:** Supabase (PostgreSQL + pgvector) | **Date:** April 2026

---

## Overview

Dayli AI uses Supabase as its backend, providing:
- **PostgreSQL** database with Row Level Security (RLS)
- **pgvector** extension for AI-powered semantic search
- **Supabase Auth** for user authentication (Email, Google, Facebook, Apple)
- **Three client tiers:** Browser (anon key), Server SSR, and Admin (service role)

---

## Architecture Diagram

```
auth.users (Supabase Auth)
  ├── profiles (1:1) — auto-created on signup via trigger
  ├── solution_likes (1:N) — bookmarked/favorited solutions
  ├── collections (1:N) — user-created solution groups
  │     └── collection_items (1:N) → solutions
  ├── community_ratings (1:N) → solutions
  ├── solution_pathways (1:N) — solution journey tracking
  ├── needs_assessments (1:N) — AI assessment output
  └── diagnostic_sessions (1:N) — legacy tree-based assessment
        └── diagnostic_results (1:N)

solutions (core catalog)
  ├── solution_embeddings (1:1) — pgvector 1536-dim embeddings
  ├── community_ratings (1:N)
  └── solution_results (N:1 via internal_id) — search result cache
        └── solution_tags (1:N) → filter_options

diagnostic_prompts
  └── diagnostic_paths (N:N self-referencing decision tree)

assessment_sessions (standalone, keyed by session_id)
```

---

## Tables

### 1. profiles

Auto-created when a user signs up. Linked 1:1 to `auth.users`.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, FK → auth.users(id), CASCADE delete |
| display_name | text | Defaults to email prefix on signup |
| avatar_url | text | Profile image URL |
| role | text | Default 'user' |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto-updated via trigger |

**RLS:** Users can only view/update their own profile.
**Triggers:** `on_auth_user_created` (auto-create), `on_profile_updated` (auto-update timestamp)

---

### 2. solutions

Core catalog of assistive solutions — products, techniques, and resources for ADLs. Originally named `internal_solutions`.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | Solution name |
| description | text | What it is and how it helps |
| source_type | text | 'web', 'community', 'youtube' |
| adl_category | text | bathing, dressing, eating, mobility, toileting, transferring, communication, memory |
| disability_tags | text[] | e.g. ['arthritis', 'wheelchair', 'stroke'] |
| price_tier | text | 'free', '$', '$$', '$$$' |
| is_diy | boolean | DIY solution flag |
| what_made_it_work | text | Real-world testimonial |
| cover_image_url | text | Thumbnail image |
| source_url | text | Original source link |
| is_active | boolean | Default true, soft-delete |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

**RLS:** Anyone can read active solutions.

---

### 3. solution_embeddings

pgvector embeddings (1536-dim, OpenAI text-embedding-ada-002) for semantic search.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| solution_id | uuid | FK → solutions(id), UNIQUE, CASCADE |
| embedding | vector(1536) | The vector embedding |
| chunk_text | text | Text that was embedded |
| created_at | timestamptz | Auto |

---

### 4. community_ratings

User ratings (1–5 stars) with optional reviews. One rating per user per solution.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| solution_id | uuid | FK → solutions(id), CASCADE |
| user_id | uuid | FK → auth.users(id), CASCADE |
| rating | int | 1–5, CHECK constraint |
| review_text | text | Optional |
| created_at / updated_at | timestamptz | Auto |

**Unique:** (user_id, solution_id)

---

### 5. solution_likes

User bookmarks/favorites on solutions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users(id), CASCADE |
| solution_id | text | Solution ID (stored as text) |
| created_at | timestamptz | Auto |

**Unique:** (user_id, solution_id)

---

### 6. collections

User-created named groups for organizing saved solutions.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users(id), CASCADE |
| name | text | Default 'Collection' |
| color | text | red, orange, yellow, green, teal, blue, purple, pink |
| created_at / updated_at | timestamptz | Auto |

---

### 7. collection_items

Junction table linking solutions to collections.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| collection_id | uuid | FK → collections(id) |
| solution_id | text | Solution ID |

---

### 8. solution_pathways

Tracks a user's ordered list of solutions to try, with progress tracking.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users(id), CASCADE |
| session_id | text | Optional link to assessment session |
| title | text | e.g. "Bathing Independence Plan" |
| solutions | jsonb | Array of {solution_id, step, note, completed} |
| status | text | 'active', 'completed', 'archived' |
| created_at / updated_at | timestamptz | Auto |

---

### 9. assessment_sessions

Full AI chat conversation history for needs assessments.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| session_id | text | UNIQUE, client-generated |
| messages | jsonb | Array of {role, content} |
| extracted_categories | text[] | ADL categories from AI |
| extracted_keywords | text[] | Conditions/needs from AI |
| adl_focus | text | Primary ADL area |
| role | text | 'self' or 'caregiver' |
| completed | boolean | Default false |
| user_id | uuid | Optional, added in migration 007 |
| created_at / updated_at | timestamptz | Auto |

---

### 10. needs_assessments

Structured output of a completed assessment, used for solution matching.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users(id), SET NULL |
| session_id | text | Links to assessment_sessions |
| role | text | 'self' or 'caregiver' |
| categories | text[] | Finalized ADL categories |
| keywords | text[] | Finalized condition keywords |
| adl_focus | text | Primary ADL area |
| severity_hints | jsonb | e.g. {"mobility": "severe"} |
| created_at | timestamptz | Auto |

---

### 11. challenge_categories

Reference table for the 8 ADL categories. Pre-seeded, read-only.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | UNIQUE — bathing, dressing, eating, mobility, toileting, transferring, communication, memory |
| label | text | Human-readable name |
| description | text | What this category covers |
| icon_emoji | text | UI emoji |
| sort_order | int | Display order |

---

### 12. solution_feedback

Quick thumbs-up/thumbs-down feedback on solutions (anonymous allowed).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| solution_id | text | Solution that received feedback |
| is_helpful | boolean | true = thumbs up |
| session_id | text | Optional assessment context |
| user_id | uuid | Optional, added in migration 006 |
| created_at | timestamptz | Auto |

---

### 13–16. Diagnostic Tree Tables (Legacy)

The older tree-based assessment system:

- **diagnostic_sessions** — tracks user's path through the tree
- **diagnostic_prompts** — defines question nodes (with options, input types)
- **diagnostic_paths** — edges connecting prompts based on selected options
- **diagnostic_results** — matched criteria output from completed sessions

---

### 17–19. Search & Filter Tables

- **solution_results** — cached search results (internal + external sources) with relevance scores
- **solution_tags** — junction table applying filter tags to results
- **filter_options** — reference table for all filter groups (price, source_type, adl_category)

---

## SQL Functions

### match_solutions(p_categories, p_keywords, p_limit)

Keyword-based matching. Scores by ADL category match (1.0 weight) + disability tag overlap (0.5 weight). Searches both curated solutions and approved community submissions via the `all_solutions` view.

### match_solutions_semantic(query_embedding, p_categories, p_limit)

AI-powered hybrid search. Combines pgvector cosine similarity (70% weight) + ADL category match (30% weight). Default limit: 6 results.

---

## Views

### all_solutions

Unified view that combines two sources into a single searchable interface. Both `match_solutions` functions query this view instead of the `solutions` table directly.

**Definition:**
```sql
-- Source 1: Curated solutions
SELECT id, title, description, source_type, adl_category, disability_tags,
       price_tier, is_diy, what_made_it_work, cover_image_url, source_url,
       is_active, created_at, updated_at,
       'curated' AS origin
FROM solutions

UNION ALL

-- Source 2: Approved community submissions
SELECT id, title, description, 'community' AS source_type, adl_category,
       COALESCE(tags, '{}') AS disability_tags, pricing AS price_tier,
       false AS is_diy, what_made_it_work, photos[1] AS cover_image_url,
       website_url AS source_url, true AS is_active, created_at,
       created_at AS updated_at,
       'community_submission' AS origin
FROM community_submissions
WHERE status = 'approved'
```

| Virtual Column | Source (curated) | Source (community) |
|----------------|------------------|--------------------|
| origin | `'curated'` | `'community_submission'` |
| disability_tags | solutions.disability_tags | community_submissions.tags |
| price_tier | solutions.price_tier | community_submissions.pricing |
| cover_image_url | solutions.cover_image_url | community_submissions.photos[1] |
| source_url | solutions.source_url | community_submissions.website_url |

**Access:** `SELECT` granted to `anon` and `authenticated` roles.

**Note:** Community submissions without embeddings won't appear in semantic search (`match_solutions_semantic`) but will appear in keyword search (`match_solutions`).

---

### community_submissions (referenced by all_solutions view)

Table for user-submitted solutions awaiting moderation. Only rows with `status = 'approved'` appear in the `all_solutions` view.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | Solution name |
| description | text | What it is and how it helps |
| adl_category | text | ADL area |
| tags | text[] | Disability/condition tags |
| pricing | text | Cost indicator |
| what_made_it_work | text | Personal story/testimonial |
| photos | text[] | Array of image URLs (first used as cover) |
| website_url | text | External link |
| status | text | 'pending', 'approved', 'rejected' |
| created_at | timestamptz | Auto |

**Note:** This table was created directly in Supabase (no migration file in the codebase).

---

## Row Level Security (RLS) Summary

| Table | Read | Write |
|-------|------|-------|
| profiles | Own only | Own only |
| solutions | Public (active only) | Admin only |
| solution_embeddings | Public | Admin only |
| community_ratings | Public | Own only |
| solution_likes | Own only | Own only |
| collections | Own only | Own only |
| collection_items | Via parent collection | Via parent collection |
| solution_pathways | Own only | Own only |
| assessment_sessions | Open | Open |
| needs_assessments | Own only | Open insert |
| challenge_categories | Public | None |
| solution_feedback | Public | Open insert |
| diagnostic_* | Own sessions | Own sessions |
| solution_results | Public | Open insert |
| filter_options | Public | None |

---

## Supabase Client Configuration

| Client | Location | Purpose |
|--------|----------|---------|
| Browser (anon) | `lib/supabase/client.ts` | Client-side, respects RLS |
| Server SSR | `lib/supabase/server.ts` | Server components, cookie-managed sessions |
| Admin | `lib/supabase.ts` | API routes only, bypasses RLS |

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Public anonymous key (safe for browser)
- `SUPABASE_SERVICE_ROLE_KEY` — Admin key (server-only, never expose to browser)

---

*Generated for the Dayli AI project — April 2026*
