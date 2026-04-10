# Dayli AI — Web & YouTube Scraping Cost Summary

**Prepared by:** Dhivya (UX Engineer)
**Date:** April 9, 2026
**Purpose:** Team decision on scraping budget before proceeding

---

## What We're Doing

Scraping assistive technology solutions from external websites and YouTube channels, then inserting them into our Supabase database so Dayli AI can recommend them to users.

---

## How It Works

| Step | Tool | What it does |
|------|------|-------------|
| 1. Fetch web pages | Plain `fetch()` or Firecrawl | Downloads page content |
| 1. Fetch YouTube transcripts | Supadata API | Gets video transcripts |
| 2. Extract solution data | Claude API | Reads content and extracts structured data (title, description, category, etc.) |
| 3. Insert into database | Supabase | Stores solutions for search and matching |

---

## Sites to Scrape

### 1. patient-innovation.com

| | Details |
|---|---|
| **What it is** | Patient & caregiver innovation platform — real stories from people with disabilities |
| **Total solution pages** | ~1,894 |
| **Scraping method** | Plain `fetch()` (free — no Firecrawl credits used) |
| **Data quality** | Excellent — title, description, disability info, what made it work |

### 2. makersmakingchange.com

| | Details |
|---|---|
| **What it is** | Open-source assistive device library — DIY build guides by volunteer makers |
| **Total solution pages** | 402 |
| **Scraping method** | Firecrawl (site is a JavaScript app — plain fetch doesn't work) |
| **Firecrawl credits needed** | 402 of 500 free credits |
| **Data quality** | Excellent — title, description, disability type, cost, build instructions, 3D print specs |

### Combined: ~2,296 assistive technology solutions

---

## Extraction Cost (Claude API)

Claude API reads each scraped page and extracts solution data into our database format.

| Claude Model | Quality | patient-innovation (1,894) | makersmakingchange (402) | Total |
|---|---|---|---|---|
| **Sonnet** | Excellent — better at classifying categories and writing summaries | $28.00 | $6.00 | **~$34.00** |
| **Haiku** | Good — handles structured extraction, may misclassify some edge cases | $7.50 | $1.60 | **~$9.10** |

---

## YouTube Scraping — 5 Channels

| | Details |
|---|---|
| **Estimated videos** | ~100-250 across 5 channels |
| **Transcript method** | Supadata API (free tier = 100 transcripts/month) |
| **Extraction method** | Claude API reads transcript and extracts solution data |

| | 100 videos | 250 videos |
|---|---|---|
| Supadata (transcripts) | $0 (free tier) | $5/month (Basic plan for 300 credits) |
| Claude Sonnet (extraction) | $1.50 | $3.75 |
| Claude Haiku (extraction) | $0.40 | $1.00 |

---

## Total Cost Summary

### Option A: Claude Sonnet (Best Quality)

| Task | Cost |
|---|---|
| patient-innovation.com (1,894 pages, plain fetch) | $28.00 |
| makersmakingchange.com (402 pages, Firecrawl free tier) | $6.00 |
| YouTube (100 videos, free Supadata) | $1.50 |
| Firecrawl | $0 (free tier) |
| **Total** | **~$35.50** |

### Option B: Claude Haiku (Budget-Friendly)

| Task | Cost |
|---|---|
| patient-innovation.com (1,894 pages, plain fetch) | $7.50 |
| makersmakingchange.com (402 pages, Firecrawl free tier) | $1.60 |
| YouTube (100 videos, free Supadata) | $0.40 |
| Firecrawl | $0 (free tier) |
| **Total** | **~$9.50** |

---

## Current Claude API Account Status

| | |
|---|---|
| **Spent this month** | $3.22 |
| **Monthly limit** | $100.00 |
| **Remaining** | ~$96.78 |
| **Resets** | May 1, 2026 |

Both options fit comfortably within the budget. The remaining balance also covers the app's assessment conversations (when users chat with Dayli AI).

---

## Other Costs (Already Covered)

| Tool | Cost | Status |
|---|---|---|
| Firecrawl | Free tier (500 credits) | 402 credits needed for makersmakingchange, ~98 left over |
| Supabase | Free tier / Pro if needed | Already connected |
| Supadata | Free tier (100 credits/month) | Enough for YouTube scraping |
| Vercel | Free hobby tier | Not deployed yet |

---

## Decision Needed From Team

1. **Sonnet ($35.50) or Haiku ($9.50)?** — Sonnet gives better data quality; Haiku is cheaper but may misclassify some solutions.

2. **Proceed with scraping?** — Once approved, Dhivya can run the scripts and ~2,296 solutions will be in the database within a few hours.

3. **Which YouTube channels?** — The team needs to pick 5 channels to scrape (suggested list is in the project docs).
