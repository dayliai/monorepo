# Dayli AI — Implementation Log

**Project:** Dayli AI (grad school capstone)
**Stack:** Next.js 16 · Supabase · Claude API (claude-opus-4-6) · Tailwind CSS v4 · TypeScript
**Completed:** 2026-04-01

---

## 1. What We Built

A full-stack AI-powered adaptive daily living tool with three screens:

| Screen | Route | Purpose |
|--------|-------|---------|
| Landing | `/` | Entry point → directs users to assessment |
| Assessment Chat | `/assessment` | Socratic AI conversation to identify ADL challenges |
| Solutions | `/solutions` | Personalized product/technique recommendations |

---

## 2. Supabase Database (Live Project: `xmqehnuguvlihvqrojme`)

### Existing Tables (found via MCP inspection)
The live database had **19 tables** — the `schema.sql` file was outdated. Key tables actually in use:

| Table | Key Columns |
|-------|-------------|
| `internal_solutions` | `id`, `title`, `description`, `source_type` (NOT `resource_type`), `categories[]`, `adl_focus`, `price_range`, `what_made_it_work`, `created_at` |
| `diagnostic_prompts` | `id`, `step` (NOT `step_order`), `prompt_text`, `category` |
| `solution_feedback` | `id`, `solution_id`, `session_id`, `is_helpful`, `created_at` |

> **Note:** `schema.sql` column names (`resource_type`, `step_order`) did not match live DB. Always query `list_tables` with `verbose: true` before writing SQL against this project.

### Migration Applied: `enable_pgvector_and_embeddings`

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Embeddings table (for future semantic search)
CREATE TABLE IF NOT EXISTS solution_embeddings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  solution_id uuid REFERENCES internal_solutions(id) ON DELETE CASCADE,
  embedding extensions.vector(1536),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX solution_embeddings_idx
  ON solution_embeddings USING ivfflat (embedding extensions.vector_cosine_ops)
  WITH (lists = 10);

-- Assessment session storage
CREATE TABLE IF NOT EXISTS assessment_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text UNIQUE NOT NULL,
  messages jsonb DEFAULT '[]',
  extracted_categories text[] DEFAULT '{}',
  extracted_keywords text[] DEFAULT '{}',
  adl_focus text,
  role text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Relevance matching function (category + keyword scoring)
CREATE OR REPLACE FUNCTION match_solutions(
  p_categories text[],
  p_keywords text[],
  p_limit int DEFAULT 20
) RETURNS TABLE (
  id uuid, title text, description text, source_type text,
  categories text[], adl_focus text, price_range text,
  what_made_it_work text, created_at timestamptz, relevance_score float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id, s.title, s.description, s.source_type,
    s.categories, s.adl_focus, s.price_range,
    s.what_made_it_work, s.created_at,
    (
      COALESCE(array_length(ARRAY(
        SELECT unnest(s.categories)
        INTERSECT SELECT unnest(p_categories)
      ), 1), 0)::float / GREATEST(array_length(p_categories, 1), 1)
      +
      COALESCE(array_length(ARRAY(
        SELECT unnest(s.categories)
        INTERSECT SELECT unnest(p_keywords)
      ), 1), 0)::float / GREATEST(array_length(p_keywords, 1), 1) * 0.5
    ) AS relevance_score
  FROM internal_solutions s
  ORDER BY relevance_score DESC, s.created_at DESC
  LIMIT p_limit;
END;
$$;
```

---

## 3. API Routes Built

### `POST /api/assessment`
**File:** `app/api/assessment/route.ts`

Runs a Socratic Claude conversation to understand the user's ADL challenges.

**Flow:**
1. Receives `{ messages, sessionId? }` from client
2. Calls Claude `claude-opus-4-6` with a system prompt guiding 3–5 focused questions
3. Claude appends `ASSESSMENT_COMPLETE: { "role": "...", "categories": [...], "keywords": [...], "adlFocus": "..." }` when done
4. Route strips that JSON from the user-visible reply
5. Upserts conversation to `assessment_sessions` table
6. Returns `{ reply, done, sessionId, categories?, keywords?, adlFocus? }`

**Env var:** `DAYLI_ANTHROPIC_KEY` (NOT `ANTHROPIC_API_KEY` — that's reserved by Claude Code CLI)

---

### `POST /api/match`
**File:** `app/api/match/route.ts`

Returns relevant solutions based on assessment output.

**Flow:**
1. Receives `{ categories, keywords, sessionId?, limit? }`
2. Calls Supabase RPC `match_solutions(p_categories, p_keywords, p_limit)`
3. Falls back to all solutions ordered by `created_at DESC` if RPC returns empty
4. Returns `{ solutions: [...], total: N }`

---

### `POST /api/feedback`
**File:** `app/api/feedback/route.ts`

Records thumbs up/down on a solution card.

**Input:** `{ solutionId, isHelpful: boolean, sessionId? }`
**Writes to:** `solution_feedback` table

---

## 4. Frontend Pages Built

### Landing Page — `/`
**File:** `app/page.tsx`

- Sparkles icon in cyan circle
- Serif "Dayli AI" heading
- "Get My Solutions" CTA → `/assessment`
- Brand colors: `#4A154B` purple, `#06b6d4` cyan

---

### Assessment Chat — `/assessment`
**File:** `app/assessment/page.tsx`

Matches Figma Make ChatScreen design.

**Key features:**
- Auto-starts conversation on mount (Claude sends first message)
- Desktop sidebar: Assessment Chat + Recent nav items
- Mobile: overlay sidebar with backdrop blur
- Chat bubbles: user = `bg-[#4A154B]` purple right-aligned, AI = white left-aligned
- Typing indicator: 3 bouncing gray dots
- Suggestion chips on first message: "Help with bathing safely", "Eating with tremors", "Mobility challenges"
- Input bar: rounded-full, Sparkles icon, ArrowUp send, Mic when empty
- Focus ring: `ring-[#F3E8F4]` with `border-[#4A154B]`
- On `done=true`: waits 2.5s then navigates to `/solutions?categories=...&keywords=...&adlFocus=...&sessionId=...`

---

### Solutions — `/solutions`
**File:** `app/solutions/page.tsx`

Matches Figma Make ResultsScreen + SolutionCard design.

**Key features:**
- Reads URL params: `categories`, `keywords`, `adlFocus`, `sessionId`
- Calls `/api/match` on mount
- "We found X solutions for you" header with ADL focus subtitle
- Sort: Most Relevant / Newest
- Filter panel: Category / Price Range / Type dropdowns + "Clear all"
- Loading: 6 animated skeleton cards
- Grid: `cols-1 → cols-2 → cols-3 → cols-4` responsive
- **SolutionCard:**
  - Gradient header with ADL emoji (dynamically chosen by category)
  - Match badge showing `relevance_score × 100%`
  - Purple category tag + price tag + source type tag (cyan)
  - Serif title, 2-line-clamp description
  - `what_made_it_work` in italic if present
  - ThumbsUp / ThumbsDown feedback buttons → `/api/feedback`
- Wrapped in `<Suspense>` for `useSearchParams` (required by Next.js App Router)

---

## 5. Design System (from Figma Make)

| Token | Value |
|-------|-------|
| Primary purple | `#4A154B` |
| Cyan accent | `#06b6d4` |
| Dark text | `#121928` |
| Gray text | `#6a7282` |
| Light purple bg | `#F3E8F4` |
| Light cyan bg | `#E0F7FA` |
| Border radius (cards) | `rounded-[24px]` |
| Border radius (buttons) | `rounded-full` |
| Font (headings) | `font-serif` |
| Font (body) | `font-sans` |

---

## 6. Package Dependencies Added

```json
"lucide-react": "^1.7.0"
```

Icons used: `ArrowUp`, `ArrowLeft`, `ArrowRight`, `Sparkles`, `Mic`, `X`, `MessageSquare`, `Clock`, `ThumbsUp`, `ThumbsDown`, `SlidersHorizontal`, `ChevronDown`, `Filter`

---

## 7. Environment Variables Required

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xmqehnuguvlihvqrojme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
DAYLI_ANTHROPIC_KEY=<your Claude API key>
```

> Use `DAYLI_ANTHROPIC_KEY` (not `ANTHROPIC_API_KEY`) to avoid conflict with Claude Code CLI.

---

## 8. How to Run Locally

```bash
cd dayli-ai
npm install
# Create .env.local with vars above
npm run dev
# Open http://localhost:3000
```

**Full user flow:**
1. `/` → click "Get My Solutions"
2. `/assessment` → chat with AI (3–5 questions about ADL challenges)
3. AI detects completion → redirects to `/solutions`
4. `/solutions` → browse matched products, thumbs up/down to give feedback

---

## 9. Architecture Summary

```
Browser
  │
  ├── /                    ← Landing (Next.js page)
  ├── /assessment          ← Chat UI (Next.js page, 'use client')
  │     └── POST /api/assessment  ← Claude claude-opus-4-6 (Socratic)
  │           └── assessment_sessions (Supabase)
  │
  └── /solutions           ← Results UI (Next.js page, 'use client')
        ├── POST /api/match       ← match_solutions RPC (Supabase)
        │     └── internal_solutions (Supabase)
        └── POST /api/feedback    ← solution_feedback (Supabase)

Infrastructure:
  Supabase (xmqehnuguvlihvqrojme)
    ├── PostgreSQL + pgvector (extensions schema)
    ├── internal_solutions   ← product/technique catalog
    ├── assessment_sessions  ← conversation history
    ├── solution_feedback    ← thumbs up/down
    └── solution_embeddings  ← vector index (future semantic search)

  Claude API
    └── claude-opus-4-6 (assessment conversations)
```

---

## 10. What's Left (Future Work)

- [ ] Populate `internal_solutions` with real ADL product/technique data
- [ ] Add auth (Supabase Auth) so users can save sessions and revisit
- [ ] Semantic search using `solution_embeddings` (needs embedding pipeline via OpenAI or Voyage AI)
- [ ] Mic/speech-to-text input (currently shows mic icon but not wired)
- [ ] "Recent sessions" sidebar nav (currently shows but not wired)
- [ ] Deploy to Vercel with custom domain (dayli.something)
- [ ] Admin panel to add/edit solutions without SQL
