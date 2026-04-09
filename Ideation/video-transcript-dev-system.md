# Dayli AI Development System — Video Transcript

**Duration target: 3-4 minutes**

---

## INTRO (15 sec)
*[Show: Dayli AI logo, then split screen of landing page + web app]*

"This is how we build, iterate, and ship Dayli AI — using Claude Code as our development engine connected to GitHub, Vercel, Figma, and Supabase. Here's how the system works and why it matters for our team."

---

## THE ARCHITECTURE (30 sec)
*[Show: Simple diagram — Claude Code in center, arrows to GitHub, Vercel, Figma, Supabase]*

"Everything runs through Claude Code. It writes and edits our codebase, which lives in a single monorepo with two apps — the Daily Living Labs landing page and the main Dayli AI web app. When we push code to GitHub, Vercel automatically deploys it live within 30 seconds. Supabase handles our database, authentication, and AI chat functions. And Figma is where we design before we build."

---

## SETUP: THREE ONBOARDING CHATS (45 sec)
*[Show: Each chat being initiated in Claude Code]*

"To get a new team member up and running, there are three setup chats:

**One — Connect Claude to GitHub.** This links the monorepo so Claude can commit and we can push changes that auto-deploy through Vercel.

*[Show: git push → Vercel dashboard showing deploy]*

**Two — Connect Claude to Figma using MCP.** This lets Claude read designs directly from Figma and even write components back into Figma files — so design and code stay in sync.

*[Show: Figma file with components, Claude reading design context]*

**Three — Connect Claude to Supabase.** This wires up our database, migrations, and edge functions. Claude can query tables, update schemas, and manage seed data.

*[Show: Supabase dashboard with tables]*

Once these three connections are established, the system is ready."

---

## DAY-TO-DAY: TWO WORKING CHATS (60 sec)
*[Show: Terminal with two separate Claude Code sessions]*

"For daily work, we use two dedicated chats — one per app.

**The Daily Living Labs chat** handles the landing page. You describe what you want to change — update the hero copy, redesign the ADL section, adjust spacing — and Claude makes the edits. You push to git, Vercel deploys, and the live site updates.

*[Show: Making a copy change → git push → live site reflecting change]*

**The Dayli AI chat** handles the main web app — the diagnostic tool, results page, chat interface, dashboard, all eleven screens. Same workflow: describe the change, Claude builds it, push, it's live.

*[Show: Navigating through web app screens]*

Each chat has persistent memory. It knows the project structure, the design system, the deployment workflow, and your preferences. You don't re-explain context between sessions."

---

## WHY THIS APPROACH (45 sec)
*[Show: Side-by-side — traditional dev workflow vs this system]*

"Three reasons we built it this way.

**Speed.** A design change goes from idea to live in under two minutes. No build pipeline to babysit, no staging environment to maintain.

**Accessibility for non-engineers.** You don't need to know React or Tailwind to ship changes. Describe what you want in plain language, review the result, push it live.

**Scalability for future teams.** The monorepo structure, shared design tokens, and Supabase backend mean a new developer — or a new Claude chat — can pick up any part of the system without breaking the rest. The memory files carry forward project decisions so nothing gets lost between sessions."

---

## CLOSING (15 sec)
*[Show: Live landing page → live web app → GitHub repo]*

"That's the system. Three setup chats to connect the tools, two working chats to build and ship, and a workflow that lets anyone on the team iterate at the speed of conversation."

---

## PRODUCTION NOTES

| Section | Screen Recording Needed |
|---------|------------------------|
| Intro | Landing page live site, web app live site |
| Architecture | Diagram (create in FigJam or slides) |
| Setup Chat 1 | Terminal showing git push, Vercel deploy dashboard |
| Setup Chat 2 | Figma file, Claude reading/writing to Figma via MCP |
| Setup Chat 3 | Supabase SQL editor, tables view |
| Working Chat - DLL | Claude Code making an edit, git push, live site update |
| Working Chat - Dayli | Web app screens, navigating routes |
| Why This Approach | Split screen comparisons or simple text cards |
| Closing | Quick montage of all live surfaces |
