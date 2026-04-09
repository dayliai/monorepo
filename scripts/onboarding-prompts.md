# Dayli AI — Claude Code Starter Prompts

Share these with new team members. They paste one into a Claude Code chat to get started.

---

## First Time Setup (paste this on a new machine)

```
I'm setting up the Dayli AI project for the first time on this machine. Please check if everything is configured:

1. Check if Node.js v20 is installed (run node -v)
2. Check if pnpm is installed (run pnpm -v)  
3. Check if node_modules exists (ls node_modules/vite)
4. Check if .env files exist (ls apps/landing/.env apps/web/.env)
5. Check git remote and identity (git remote -v && git config user.email)

For anything that's missing, walk me through fixing it step by step. Wait for me to confirm each step before moving to the next. If everything passes, tell me I'm ready to go.

The setup script is at scripts/setup.sh and the visual guide is at Ideation/setup-guide.html if we need them.
```

---

## Daily Living Labs Landing (paste this to work on the landing page)

```
I'm working on the Daily Living Labs landing page at apps/landing in the Dayli AI monorepo. The site is live at https://monorepo-landing-psi.vercel.app. Check the memory files and CLAUDE.md for project context, design system, and deployment workflow. I want to continue iterating on the design and content.
```

---

## Dayli AI Web App (paste this to work on the web app)

```
I'm working on the main Dayli AI web app at apps/web in the Dayli AI monorepo. It's deployed on Vercel as monorepo-web. The app has 11 routes (landing, diagnostic, results, chat, dashboard, account, etc.) wired to Supabase. Check the memory files and CLAUDE.md for project context, design system, and deployment workflow. I want to continue building out the app.
```

---

## Quick Reference

| What | Command |
|------|---------|
| Start landing page dev server | `pnpm dev:landing` |
| Start web app dev server | `pnpm dev:web` |
| Push changes live | `git add --all && git commit -m "message" && git push` |
| Run setup check | `bash scripts/setup.sh` |
| Open visual setup guide | `open Ideation/setup-guide.html` |
