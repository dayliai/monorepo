# Dayli AI

A web app connecting people with disabilities to practical daily living solutions.

## Structure

- `apps/landing` — Daily Living Labs public page
- `apps/web` — Main Dayli AI application
- `packages/ui` — Shared design tokens
- `packages/supabase` — Supabase client, types, and AI agent prompts
- `supabase/` — Database migrations and Edge Functions

## Development

```bash
pnpm install
pnpm dev:landing   # Start the landing app
pnpm dev:web       # Start the web app
```
