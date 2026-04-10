# Dayli AI — Complete Project Context

> This document contains everything a new Claude session needs to understand and continue working on this project. Drop this into any Claude conversation to get full context.

---

## About the User

- **Name:** Dhivya Prabhakaran
- **Program:** MA in Design, Concentration in Interaction Design — University of North Texas
- **Role on team:** UX Engineer (works on both design and technical side)
- **Courses:** Human Centered Interaction Design II + Interaction Maker Lab (both taught by Professor Cassini)
- **Volunteered at:** To Be Like Me (building empathy with people with disabilities)
- **Coding experience:** Learning — needs step-by-step guidance, plain English explanations

---

## Project: Dayli AI

An AI assistant that helps people with disabilities and caregivers discover solutions, tools, and resources for daily living. It acts as a community and knowledge platform connecting users with assistive technologies, services, and solutions.

### Team
| Name | Role |
|------|------|
| Chelsea | Team Lead / Product Owner |
| Abdullah | UX Designer |
| Amber | AI Analyst |
| **Dhivya** | **UX Engineer** |
| Miti | UX Analyst |
| Nida | Co-lead / Product Designer |

### Sponsor
**Mike** — transcripts of discussions in team Google Drive.

### Deliverables
- Working prototype of the next iteration of Dayli AI
- Case study documenting the design process, research, and outcomes
- Weekly team report, individual report, bi-weekly emails to Mike, class presentations

---

## What the Undergrads Built (Original Dayli AI)

**Live app:** https://dayli-ai.lovable.app/

### Key History
1. **Ideation** — Chose "Solutions Finder" concept over Smart Home Interpreter
2. **Database** — Scraped Patient Innovations website (Python + BeautifulSoup → Google Sheets). One-time frozen snapshot. Google Service Account expires every 90 days.
3. **Custom GPT** — Built with OpenAI GPT Builder. Hit 10-result RAG cap. ChatGPT credits ran out.
4. **Lovable Web App** — Switched to Lovable (AI web app builder). Connected to Google Sheets. Hit fetch errors. Used Lovable's built-in AI after ChatGPT credits expired. Credit-based system paid by Cassini.

### User Testing Findings from Undergrads
- Typing was difficult for some users → pivoted to button-based UI
- 10 results felt overwhelming
- Need to narrow/filter results

### Technical Debt Inherited
- Google Sheets is a frozen one-time snapshot — not live
- Service Account likely expired
- No automated pipeline to update database
- No proper vector search
- ChatGPT API credits exhausted

---

## Next Iteration — Tech Stack

| Tool | Purpose | Cost |
|------|---------|------|
| **Next.js** | Frontend framework (replaces Lovable) | Free |
| **Supabase** | Database + Auth + Vector search (replaces Google Sheets) | Pro plan ~$25/mo (professor pays) |
| **Claude API** | AI conversation + needs assessment + moderation | Pay-per-use |
| **Firecrawl** | Automated web scraping pipeline | Free tier available |
| **Supadata** | YouTube transcript ingestion | Free tier available |
| **Vercel** | Deployment | Free hobby tier |
| **Figma Make** | Design to code prototyping | Lead's .edu account |
| **TailwindCSS** | Styling | Free |

---

## Architecture

```
DLL Community (dailylivinglabs.com)    Dayli AI (Next.js frontend)
        ↓ Upload solutions                      ↓ User requests
              Supabase (PostgreSQL + pgvector)
        Solutions DB | User profiles | Embeddings | Auth + RLS
                              ↓
              AI Agent Layer (Edge Functions / API Routes)
        Needs assessment | Solution matching | Pattern recognition
                    ↙           ↓           ↘
          Web scraping    YouTube data    LLM provider
        Firecrawl/Apify  Supadata/SocialKit  Claude API/OpenAI
```

---

## Database Schema

### Original 11 Tables (created in Supabase)
1. `profiles` — user accounts, roles, disability types
2. `challenge_categories` — taxonomy of disability challenges
3. `needs_assessments` — full Claude conversation history + classifications
4. `solution_paths` — personalized ranked results per user session
5. `solutions` — all assistive solutions (community + scraped)
6. `solution_embeddings` — pgvector vectors for smart search
7. `community_ratings` — user ratings and reviews
8. `moderation` — content review queue
9. `scrape_sources` — list of sites/channels to crawl
10. `external_resources` — raw scraped content (web + YouTube)
11. `resource_embeddings` — vectors for scraped content chunks

### Missing Tables (identified from prototype analysis)
These features exist in the Figma Make prototype but have no database tables yet:
- **`collections`** + **`collection_solutions`** — named, color-coded folders for saving solutions
- **`saved_solutions`** (likes) — heart/like button on every solution card
- **`solution_requests`** — expert request form when no results found
- **`chat_sessions`** + **`chat_messages`** — chat history (sidebar shows "Recent")

### Solutions Table — Required Columns (from prototype filters)
Make sure `solutions` has: `sourceType` (web/youtube/community), `category`, `isDIY` (boolean), `priceLevel` (0-3), `matchRating`, `helpfulCount`, `dateAdded`, `imageUrl`

---

## Feature Roadmap

**NOW — Core Experience:** Guided Needs Assessment, Smart Follow-Up Questions, Challenge-to-Pattern Mapping, Solution Pathways, Results Filters

**NOW — Personalization:** Activity-Based Learning, Needs History, Solution Collections, Profile Building

**NOW — Community:** Share a Solution, Ask the Community, Solution Ratings, Safety & Moderation

**NEXT:** Trust filters, solution match scores, pathway visualization, personalized defaults, "People Like You" recommendations

**LATER:** "What If" Explorer, Needs Over Time, My Solution Journey, Verified Expert Program, Care Team Workspace

---

## Figma Make Prototype

**URL:** https://www.figma.com/make/1VOU8FjzGIZ3VGF7p9ae1B/Design-mobile-AI-chat-screen

### Screens in the Prototype
| Screen | Route | Description |
|--------|-------|-------------|
| Landing | `/` | Hero with two CTAs: "Start Diagnostic Tool" and "Chat with Dayli AI". Trust signals, DLL section, contact form |
| Diagnostic | `/diagnostic` | 4-step guided assessment: who, care status, challenge categories, specific challenges. Animated loading screen |
| Results | `/results` | Solution cards with filters (source, category, DIY, price) and sort options. Fetch error state |
| No Results | `/no-results` | Fallback with "Submit a Solution Request" CTA |
| Solution Request Form | `/request-form` | Diagnostic profile attached + additional context + email notification |
| Solution Request Success | `/request-success` | Confirmation screen |
| Chat | `/chat` | AI conversation with sidebar, suggestion chips, resource cards, solution detail cards, save/share/rate |
| Dashboard | `/dashboard` | Liked solutions, collections, quick chat input, diagnostic CTA |
| Account | `/account` | Avatar management, username/email edit, accessibility themes, delete account |
| Auth Success | `/auth-success` | Auto-redirects to dashboard after 2 seconds |
| Daily Living Labs | `/daily-living-labs` | Info page about DLL with ADL categories |

### Known Bugs in Prototype
- Auth state inconsistency: logged-in user still sees "Sign In" button
- These bugs should be fixed during Next.js conversion, not in Figma Make

### Design Tokens
- Primary purple: `#4A154B`
- Accent cyan: `#06b6d4`
- Dark text: `#121928`
- Gray text: `#6a7282`
- Light purple bg: `#F3E8F4`
- Light cyan bg: `#E0F7FA`
- Page bg: `#fdfafb`
- Border radius: `rounded-[24px]` (cards), `rounded-full` (buttons)
- Serif font for headings, sans-serif for body

---

## Current State of Next.js Project

**Location:** `/Users/dhivash/Dhivya/Dayli_Local/dayli-ai/`

### What Exists
- Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
- `lib/supabase.ts` — Supabase client (browser + admin) configured
- Git repo with 1 commit ("Initial commit from Create Next App")
- `PROMPT_FOR_CLAUDE.md` — Full prompt with instructions + shared component source code for browser Claude
- `figma-make-source/` folder started (for original source files)

### What's Installed
- next: 16.2.1, react: 19.2.4, tailwindcss: ^4

### What Needs Installing
```bash
npm install lucide-react motion @supabase/supabase-js @radix-ui/react-tooltip
```

### What Needs to Be Done (in order)
1. Install missing packages
2. Create placeholder images in `public/images/`
3. Delete `app/assessment/` and `app/solutions/` placeholder folders
4. Copy shared components (contexts, data, components) from Figma Make source
5. Copy each screen, converting react-router → Next.js routing
6. Update `layout.tsx` with providers and Dayli AI branding
7. Test locally with `npm run dev`
8. Connect to Supabase (replace mock data with real queries)
9. Add Claude API for chat
10. Deploy on Vercel

### Key Conversion Rules (Figma Make → Next.js)
```
// Routing
useNavigate()           → useRouter() from 'next/navigation'
navigate('/path')       → router.push('/path')
navigate(-1)            → router.back()
useLocation()           → useSearchParams() + usePathname()
location.state?.x       → searchParams.get('x')
<Outlet />              → {children} in layout.tsx

// Assets
import img from "figma:asset/hash.png"  → const img = "/images/name.png"

// Components
ImageWithFallback       → keep as-is (it's a regular React component)
createPortal            → add SSR guard: typeof document !== 'undefined'

// Required
'use client';           → add to top of every interactive component
```

---

## .env.local Template

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
FIRECRAWL_API_KEY=fc-...
SUPADATA_API_KEY=sd-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Tool Accounts & Access

| Tool | Who Owns Account | How Team Accesses |
|------|-----------------|-------------------|
| Supabase | Dhivya's email | Invited as Admin |
| Anthropic | Dhivya's email | Share API key via Google Doc |
| Firecrawl | Dhivya's email | Share API key via Google Doc |
| Supadata | Dhivya's email | Share API key via Google Doc |
| Vercel | Dhivya's email | Invite as team members |
| GitHub | Everyone's own | Collaborators on shared repo |
| Figma | Lead's .edu account | File shared with everyone |

---

## Document Sources

### Google Drive
- **Team folder:** https://drive.google.com/drive/u/2/folders/12CAk6RsVWWCnWUOEQk3vVNb9BUiiYLQa
- **Dhivya's folder:** https://drive.google.com/drive/u/2/folders/1VqIZnquaUtOVKDxjrRUpI2jzZ4yENYjz

### Local Files (already read)
- `/Users/dhivash/Documents/Undergrad_Discussion1.docx` — Full transcript with undergrad team
- `/Users/dhivash/Dhivya/Dayli_Local/Dayli AI Project Context.docx` — Project overview
- `/Users/dhivash/Dhivya/Dayli_Local/First Email Update to Mike.docx` — Feature roadmap, architecture, sprint plan
- `/Users/dhivash/Dhivya/Dayli_Local/Dayli_AI_Team_Credentials.docx` — Team credentials
- `/Users/dhivash/Dhivya/Dayli_Local/Initial Tables.jpg` — Screenshot of Supabase tables

### Key Files in Project
- `/Users/dhivash/Dhivya/Dayli_Local/dayli-ai/PROMPT_FOR_CLAUDE.md` — Full prompt with all Figma Make source code + conversion instructions for browser Claude
- `/Users/dhivash/Dhivya/Dayli_Local/dayli-ai/lib/supabase.ts` — Supabase connection file

---

## Key Technical Concepts (Plain English)

| Concept | Plain English |
|---------|--------------|
| **RAG** | Fetch relevant data chunks before generating an AI answer |
| **pgvector** | Supabase extension that stores and searches AI vectors |
| **Embeddings** | Mathematical number representation of text meaning |
| **Cosine similarity** | How the system measures how close two meanings are |
| **Edge Function** | Small backend code that runs on Supabase's server |
| **RLS** | Row Level Security — users can only see their own data |
| **Cron job** | Scheduled task that runs automatically at set times |
| **Seed data** | Starter data pre-loaded into database for testing |

---

## Usability Testing (April 1, 2026)

Usability testing was conducted in class using the Figma Make prototype. The test focused on the diagnostic flow (`/diagnostic` route). Prepared questions covered:
- Pre-task context (prior experience finding assistive tools)
- Task-based observation (diagnostic flow, results review, chat interaction, no-results path)
- Accessibility-specific questions (text size, button targets, progress bar clarity)
- Post-task reflection (confidence, confusion points, willingness to use)

Bugs found during testing:
- Auth state shows "Sign In" even when logged in
- These are to be fixed in Next.js code, not in Figma Make prototype

---

## How to Work with Dhivya

- She cannot write code from scratch — guide step by step
- Explain technical concepts in plain English before using jargon
- The team copies code from Figma Make and adapts it
- Don't add features beyond what's asked
- Don't assume prior coding knowledge
- When helping with presentations or reports, keep it simple and structured
