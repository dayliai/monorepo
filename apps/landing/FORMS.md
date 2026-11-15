# Partner and Connect forms: email setup

The Partner (`/partner`) and Connect (`/connect`) forms send to one server
function, `apps/landing/api/contact.ts`, which emails each message with
[Resend](https://resend.com). Until it's set up, the forms show:
"Thanks for your interest! Our form isn't accepting messages yet. Please check back soon."
So merging before setup doesn't break anything.

## 1. Vercel environment variables

In the Vercel project for the landing site (`monorepo-landing`):
**Settings → Environment Variables**, add these three for **Production** and
**Preview**, then redeploy:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | API key from Resend (**API Keys → Create**, permission "Sending access") |
| `CONTACT_TO_EMAIL` | `dailylivinglabs@gmail.com` (comma-separate for more than one) |
| `CONTACT_FROM_EMAIL` | `Daily Living Labs website <website@forms.dailylivinglabs.com>` |

Never prefix these with `VITE_`, and never commit them. They're read only by
the server function, not the browser.

**Check in Vercel:** the project's **Root Directory** should be `apps/landing`
(the function must be in `<Root Directory>/api/`). If the Root Directory is the
repo root instead, the function would need to move to `/api/contact.ts` at the
top of the repo.

## 2. Verify a sending subdomain in Resend

Use a **subdomain** just for the website's mail, so the main domain's existing
email (Gmail/Workspace MX, SPF, DMARC) is untouched.

1. Resend → **Domains → Add domain** → enter `forms.dailylivinglabs.com`.
2. Resend shows a few DNS records. They all live **under the subdomain**, for example:
   - `TXT  resend._domainkey.forms` (DKIM)
   - `MX   send.forms` and `TXT send.forms` (SPF for Resend's bounce address)
   Use the exact names and values Resend shows.
3. Add **only those records** at the DNS provider for `dailylivinglabs.com`.
   **Don't edit or delete** the existing root records: `@` MX, the root SPF
   `TXT v=spf1 …`, or `_dmarc`. The new records have different names, so they
   don't conflict.
4. Click **Verify** in Resend. It can take a few minutes to a few hours.
5. Set `CONTACT_FROM_EMAIL` to an address at that subdomain, e.g.
   `Daily Living Labs website <website@forms.dailylivinglabs.com>`.
   The mailbox doesn't need to exist: replies go to the visitor (Reply-To).

## 3. Test before the domain is verified

Resend lets any account send from `onboarding@resend.dev` **only to the email
address that owns the Resend account**. So, for a first test:

- `CONTACT_FROM_EMAIL=Daily Living Labs website <onboarding@resend.dev>`
- `CONTACT_TO_EMAIL=` the email you signed up to Resend with

Then switch both to the real values once the subdomain is verified.

## 4. Test on your computer (no Vercel login needed)

`pnpm dev` runs the same function locally at `/api/contact`.

1. In `apps/landing/`, create **`.env.local`** (git-ignored) with:
   ```
   RESEND_API_KEY=re_...
   CONTACT_TO_EMAIL=your-resend-account-email@example.com
   CONTACT_FROM_EMAIL=Daily Living Labs website <onboarding@resend.dev>
   ```
2. Restart the dev server: `pnpm --filter @dayli/landing dev`
3. Open http://localhost:3000/connect, wait a few seconds, fill in the form, and send.
   You should see the success message, and the email should arrive.
4. Without `.env.local`, the forms show the "not accepting messages yet" note.

`vite preview` (the production build) doesn't include the function, so it
shows the "not accepting messages yet" note there too.

## How it works

- **Email:** subject `[DLL website] Partner form: <organization>` or
  `[DLL website] Connect form: <name>`, with every field in the body.
  Submitted text is escaped. Reply-To is the visitor's email.
- **Validation (server):** required fields, a valid email, and length limits
  (names 120, organization 200, email 254, description 2,000, message 5,000).
- **Spam:** a hidden "website" field and a 3-second minimum fill time.
  Failing submissions get a normal "ok" but no email is sent.
- **Errors:** if Resend rejects the email, the visitor sees an error and keeps
  what they typed; the reason is in the Vercel function logs (`[contact]`).
