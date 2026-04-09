# Dayli AI

A web app connecting people with disabilities to practical daily living solutions.

## Getting Started (New to this project?)

### 1. Clone the repo
```bash
git clone https://github.com/dayliai/monorepo.git
cd monorepo
```

### 2. Run the setup script
```bash
bash scripts/setup.sh
```
This checks your machine for everything it needs (Node.js, pnpm, dependencies, credentials, git identity) and walks you through fixing anything that's missing.

### 3. Need more detail?
Open the visual setup guide in your browser for step-by-step explanations:
```bash
open Ideation/setup-guide.html
```

### 4. Start building
Open Claude Code in this directory and type:
```
/setup
```
Claude will check your machine step by step and walk you through fixing anything that's missing. No technical knowledge needed — just follow the prompts.

**For the landing page:**
```
pnpm dev:landing   # localhost:3000
```

**For the web app:**
```
pnpm dev:web       # localhost:3001
```

**To deploy changes:**
```bash
git add --all && git commit -m "your message" && git push
```
Vercel auto-deploys from GitHub within 30 seconds.

## Structure

```
dayli/
  apps/landing/     Daily Living Labs public page
  apps/web/         Main Dayli AI application (11 screens)
  packages/ui/      Shared design tokens (colors, fonts)
  packages/supabase/ Supabase client, types, AI prompts
  supabase/         Database migrations + Edge Functions
  scripts/          Setup and utility scripts
  Ideation/         Prototypes and design explorations
```

## How We Work

This project uses **Claude Code** as the development engine. There are two dedicated chats — one for each app. Describe changes in plain language, Claude edits the code, you push to git, Vercel deploys.

See `CLAUDE.md` for project rules and `Ideation/video-transcript-dev-system.md` for a full walkthrough of the system.
