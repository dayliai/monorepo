# Dayli AI — Project Rules

## Design System (non-negotiable)
- **Fonts**: Atkinson Hyperlegible Next (headings, display, accents) + DM Sans (body text and labels) — loaded via Google Fonts
- **Colors** — always use from `@dayli/ui` tokens (`packages/ui/src/tokens.ts`), NEVER hardcode hex. Every token has a light and a dark value; both must meet WCAG 2.2 AA contrast. Main tokens (light / dark):
  - `bg` `#FFFDF7` / `#14213D` — page background
  - `ink` `#14213D` / `#F3F5FA` — headings and body text
  - `muted` `#3E4560` / `#C3CADB` — secondary text
  - `primary` `#6B2BC0` / `#C9B0FF` — links, buttons, interactive
  - `violet` `#3D2C8D` / `#DCCCFF` — hover and active states
  - `yellow` `#F7C948` (both) — focus halo, highlights, skip link
  - `card` `#FFFFFF` / `#22325A`, `soft` `#F6F2E8` / `#1A2948`, `lav` `#F8F5FD` / `#1E2C52` — surfaces
  - `line` `#E4DED0` / `#3A4A70` — borders
  - `navy` `#14213D` / `#0B1428` — footer
  - `err` `#A3141F` / `#FF9DA6` — inline form errors (WCAG 2.2)
  - Pastels `mint`, `pink`, `sky` and loop tints — see tokens.ts
- In `apps/landing`, colors are CSS variables (`--dll-*`) built from `@dayli/ui`; use Tailwind classes like `bg-dll-card`, `text-dll-muted`. Dark mode is `[data-theme="dark"]` on `<html>`.
- `apps/web` (Dayli AI) still uses the old purple palette with hardcoded colors until it is restyled.

## Architecture Rules
- **No Anthropic API calls from the browser** — all AI calls go through Supabase Edge Function at `/functions/v1/chat`
- **Auth-optional** — diagnostic sessions and chat work without login; `user_id` is nullable
- **Error messages** use inline WCAG 2.2 red (the `err` token), never tooltips
- **AuthModal** uses `ReactDOM.createPortal` with `z-[100]`
- **Account modals** use `position: fixed; inset: 0` not `position: absolute`
- **Butterfly logo** always routes to `/`
- **"Dashboard" text** in header is NOT clickable
- **Heart icon** gated behind `isSignedIn`
- **Thumbs up/down** available to ALL users
- **Share icon** visible to ALL users
- **Stop event propagation** on heart/thumbs/share so they don't trigger card tap
- **Sign out** reverts to Light Mode

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v3
- pnpm workspaces monorepo
- Supabase (auth, database, edge functions)
- Framer Motion (web app animations)

## Workspace Packages
- `@dayli/ui` — design tokens (colors, fonts, spacing)
- `@dayli/supabase` — Supabase client, types, agent prompts

## First-Time Setup Detection
On the first message of any new chat, check if this machine is configured:

1. Run `ls node_modules/.pnpm 2>/dev/null && echo "OK" || echo "MISSING"` — if MISSING, dependencies need installing
2. Run `ls apps/landing/.env apps/web/.env 2>/dev/null | wc -l` — if less than 2, .env files need creating
3. Run `node -v 2>/dev/null` — if not v20.x, Node version needs switching

If ANY check fails, tell the user:
> "It looks like this machine needs setup before we can start. Run `bash scripts/setup.sh` — it will check everything and walk you through any missing steps."

If all checks pass, proceed normally with the user's request.

## Deploy Workflow
- **Push to deploy**: `rm -f .git/index.lock && git add --all && git commit -m "message" && git push`
- Always use `rm -f .git/index.lock` before git commands (Claude background processes create lock files)
- Vercel auto-deploys from GitHub within 30 seconds
- Landing page: `monorepo-landing` on Vercel (root: `apps/landing`)
- Web app: `monorepo-web` on Vercel (root: `apps/web`)
- Node 20 required (not 24) — always use `nvm use 20`
- Use `pnpm install --node-linker=hoisted` if dependencies need reinstalling
