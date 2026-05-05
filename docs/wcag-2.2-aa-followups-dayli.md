# WCAG 2.2 AA — Dayli App (dayliai.org) — Remaining Work

> Owner: Chelsea
> Last updated: 2026-05-02
> Context: PR #15 covered the first WCAG 2.2 AA pass on the Dayli web app (footer pages, chat input/buttons/live-region, profile modal dialog ARIA + Esc-close, ShareModal, request-form labels, SolutionCard focus). This doc tracks everything still needed to claim full AA conformance on the web app.

Effort tags: **S** = under 1 hr · **M** = 1–4 hrs · **L** = half a day or more.

Check items off as you go (`- [x]`).

---

## P0 — Required for "AA conformant" claim

### 1. Profile modal focus trap (M)

- [ ] Done
- **File:** `apps/web/app/profile/page.tsx` (5 modals: Username, Reset Password, Delete Account, Avatar, Email)
- **Issue:** Esc-close + `role=dialog` shipped in PR #15, but Tab still escapes to the page behind. Fails WCAG 2.4.3 Focus Order.
- **Fix:** Port `useModalA11y` hook from `apps/landing/src/lib/useModalA11y.ts` to the web app's `lib/`. Wire each of the 5 modals.
- **Done when:** Tabbing inside any open modal cycles only inside it; closing returns focus to the trigger.

### 2. Audit & fix `/assessment` (L)

- [ ] Done
- **File:** `apps/web/app/assessment/page.tsx` (multi-step diagnostic)
- **Check for:** Form labels (`htmlFor`+`id`), error announcements (`role=alert`, `aria-describedby`), step progress with proper landmarks, focus management between steps, Back/Next button accessible names, keyboard nav, skip link, single h1.
- **Done when:** A keyboard-only user can complete the full flow; screen reader announces step changes; errors announce on submit.

### 3. Audit & fix `/dashboard` (M)

- [ ] Done
- **File:** `apps/web/app/dashboard/page.tsx`
- **Check for:** Single h1, semantic landmarks, heading hierarchy, all clickable cards have keyboard support + accessible names + focus rings, any modals/menus follow the PR #15 dialog pattern.

### 4. Audit & fix `/collections` (M)

- [ ] Done
- **File:** `apps/web/app/collections/page.tsx`
- **Check for:** Grid keyboard nav, save/unsave button labels (e.g. `aria-label="Remove [solution title] from collection"`), empty-state semantics, focus rings, heading hierarchy.

### 5. Chat — deeper pass (M)

- [ ] Done
- **File:** `apps/web/app/chat/page.tsx`
- **Already done in PR #15:** input label, send/voice button labels, message live region.
- **Still needed:**
  - [ ] Welcome message (~line 567) is a styled `<div>`; should be `<h1>` or `<h2>` (1.3.1 Info & Relationships).
  - [ ] Suggestion chip buttons (~line 720) — add `focus-visible:ring-2 focus-visible:ring-[#4A154B]`.
  - [ ] "Back to Dashboard" button (~line 438) — add focus ring.
  - [ ] Thumbs up/down feedback buttons (~line 646) — verify accessible names + check `bg-green-100 text-green-700` and red equivalents (≥4.5:1).
  - [ ] Verify "Assistant is typing" announcer is heard by NVDA + VoiceOver.

### 6. Mobile community page nav (S)

- [ ] Done
- **File:** `apps/web/app/community/page.tsx`
- **Issue:** Below 768px, About/ADLs/Contribute links are hidden via `hidden md:flex` and there's no hamburger menu — keyboard/touch users on mobile have no nav.
- **Fix:** Mirror the mobile menu pattern from `apps/landing/src/components/Nav.tsx` (button + panel + Esc-close + focus return).

---

## P1 — Real WCAG fails, lower-impact

### 7. Hero badge contrast on web home (S)

- [ ] Done
- **File:** `apps/web/app/page.tsx:64-66`
- **Issue:** `text-[#06b6d4]` on `bg-[#E0F7FA]` is ~2.5:1; fails 4.5:1 for body text (1.4.3 Contrast Minimum).
- **Fix:** Darken text to `text-[#0891b2]` (~4.6:1) or `text-[#0E7490]`, or darken the badge background.

### 8. Theme buttons + Larger Text toggle (S–M)

- [ ] Done
- **File:** `apps/web/app/profile/page.tsx:282-321`
- **Issue:** Theme-selector buttons have no focus ring; Larger Text toggle is 32×56px (passes 24×24 AA but tight).
- **Fix:** Add `focus-visible:ring-2 focus-visible:ring-[#4A154B] focus-visible:ring-offset-2`. Decision needed on toggle size: leave at 32×56 (passes AA) or resize to ≥44×44 (AAA-style guidance).

### 9. CookiesModal toggles + dialog ARIA (S)

- [ ] Done
- **File:** `apps/web/components/CookiesModal.tsx`
- **Issue:** Toggles are `h-5 w-9` (~20×36px) — under the 24×24 AA minimum (2.5.8 Target Size). Modal also missing `role=dialog`/`aria-modal`.
- **Fix:** Increase to `h-6 w-11` minimum; apply ShareModal-style dialog ARIA + focus management.

### 10. Audit untouched components (M total)

- [ ] Done
- **Folder:** `apps/web/components/`
  - [ ] `AuthButton.tsx` — sign-in modal backdrop has no accessible name; verify focus management.
  - [ ] `CollectionTooltip.tsx` — keyboard-accessible? Hover-only tooltips fail.
  - [ ] `SolutionMap.tsx` — keyboard nav, marker accessible names, text alternative for the visual map.
  - [ ] `SolutionModal.tsx` — apply ShareModal-style dialog pattern (`role=dialog`, `aria-modal`, `aria-labelledby`, focus mgmt, Esc).

### 11. `/auth/sign-in` and `/auth/success` (S)

- [ ] Done
- **Files:** `apps/web/app/auth/sign-in/page.tsx`, `apps/web/app/auth/success/page.tsx`
- **Check for:** Labels on email/password fields, `autoComplete="email"`/`current-password`, error announcements via `role=alert`, focus management on the modal-style sign-in card.

### 12. Quick passes on small pages (S each)

- [ ] `apps/web/app/no-results/page.tsx` — heading semantics, keyboard nav of any CTAs
- [ ] `apps/web/app/daily-living-labs/page.tsx` — same
- [ ] `apps/web/app/request-success/page.tsx` — verify focus lands somewhere meaningful after redirect

### 13. Community tab focus contrast (S)

- [ ] Done
- **File:** `apps/web/app/community/page.tsx:174` (the tab buttons)
- **Check:** `focus-visible:outline-2 focus-visible:outline-[#461F65]` — verify the outline has ≥3:1 contrast against the active tab background.

---

## P2 — Architectural cleanup (optional, separate PRs)

### 14. Migrate web app to design tokens (M)

- [ ] Done
- The web app uses literal hex (`text-[#461F65]`) instead of design tokens (`text-dayli-deep`). Adds drift risk.
- **Fix:** Add the dayli colors to `apps/web`'s Tailwind config and replace literals.

---

## Manual testing — required before claiming conformance

### 15. Screen reader walkthroughs

Pick the **top 5 flows**: sign in, find a solution, save a solution, chat with Dayli AI, update profile. Walk each one with each:

- [ ] VoiceOver on macOS Safari
- [ ] VoiceOver on iOS Safari
- [ ] NVDA on Windows (free download)
- [ ] JAWS on Windows (if available)

**Done when:** A non-sighted user can complete each flow without getting stuck.

### 16. Keyboard-only walkthrough

- [ ] Done
- Unplug the mouse. Tab through every public route. Confirm: tab order is logical, focus is always visible, no keyboard traps, every interactive element is reachable, Esc closes overlays.

### 17. Zoom test

- [ ] Done
- Cmd-+ to 200%, then 400%. Layout shouldn't break, text shouldn't get clipped, no horizontal scroll appears on the body.

### 18. Forced-colors / high-contrast mode

- [ ] Done
- Turn on macOS "Increase contrast" and Windows "High contrast mode." Confirm everything is still readable.

### 19. Reduced motion

- [ ] Done
- Turn on macOS "Reduce motion" — confirm Framer Motion animations stop or shorten across the web app.

### 20. Real mobile devices

- [ ] iPhone Safari
- [ ] Android Chrome

Touch target sizes, mobile menu, modal behavior on small screens.

### 21. Automated sweep

- [ ] Run **Lighthouse** on every public route
- [ ] Run **axe DevTools** on every public route

Catches the cheap stuff (alt text, label associations, contrast). Won't catch screen-reader UX issues — manual SR testing is still required.

---

## Process — keep it from regressing

### 22. Add `eslint-plugin-jsx-a11y` to web app (S)

- [ ] Done
- Install + enable the recommended ruleset on `apps/web`. Catches missing alt, button-without-name, click-handler-without-keyboard at PR time.

### 23. Add axe to CI (M)

- [ ] Done
- Run `@axe-core/cli` or Playwright + axe against the deployed preview URLs as a CI step. Fail the build on new AA violations.

### 24. PR template a11y checklist (S)

- [ ] Done
- Add to `.github/pull_request_template.md`: skip link, focus visible, keyboard tested, alt text on new images, semantic landmarks.

### 25. Third-party audit (commissioned, separate)

- [ ] Done
- The accessibility statement says "we plan to commission a third-party audit in the future." If you want a credible AA-conformance claim, do this. Vendors: Deque, TPGi, Level Access. Budget ~$5–15K and 2–3 weeks.

---

## Estimated total

- **P0 code:** ~1.5–2 days
- **P1 code:** ~1 day
- **Manual testing:** ~half a day
- **Process setup:** ~half a day
- **Third-party audit:** separate procurement timeline

**~3 working days of code + half a day of testing** gets the Dayli App to legitimate AA conformance, before any third-party validation.

---

## How to use this doc

- Tackle items roughly top-down (P0 → P1 → P2 → Testing → Process).
- After each PR, update this file: check off the box, and update the accessibility statement at `apps/web/app/accessibility/page.tsx` to move that area from "Known Limitations" to "What's Conformant Today."
- Each numbered item is sized to be one PR (or a small handful of related PRs). Don't bundle all of P0 into a single mega-PR — landing them incrementally is easier to review and revert.
