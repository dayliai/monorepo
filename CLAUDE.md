# Dayli AI — Project Rules

## Design System (non-negotiable)
- **Fonts**: Fraunces (headings) + DM Sans (body/UI) — loaded via Google Fonts
- **Colors** — always use from `@dayli/ui` tokens, NEVER hardcode hex:
  - Deep Purple `#461F65` — headings, dark backgrounds
  - Vibrant Purple `#9230E3` — CTAs, buttons, interactive
  - Light Purple `#DBB0FF` — icons, accents
  - Pale Purple `#F1E1FF` — card backgrounds, hover states
  - Cyan `#1FEEEA` — accent highlights
  - Error Red `#B91C1C` — inline form errors (WCAG 2.2)
  - BG Main `#F6F0FC` — page background

## Architecture Rules
- **No Anthropic API calls from the browser** — all AI calls go through Supabase Edge Function at `/functions/v1/chat`
- **Auth-optional** — diagnostic sessions and chat work without login; `user_id` is nullable
- **Error messages** use inline WCAG 2.2 red (`#B91C1C`), never tooltips
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
