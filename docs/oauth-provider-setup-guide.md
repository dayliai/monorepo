# Dayli AI — OAuth Provider Setup Guide

**Date:** April 2026 | **Auth System:** Supabase Auth

---

## Overview

Dayli AI supports three social login providers: **Google**, **Facebook**, and **Apple**. The application code is already fully implemented — the buttons, OAuth flow, and callback handling all work. Each provider just needs to be configured in two places:

1. **The provider's developer console** (Google Cloud, Meta for Developers, Apple Developer)
2. **The Supabase Dashboard** (Authentication → Providers)

**Supabase Callback URL** (same for all providers):
```
https://xmqehnuguvlihvqrojme.supabase.co/auth/v1/callback
```

---

## How the Auth Flow Works

```
User clicks "Continue with Google/Facebook/Apple"
  → Supabase redirects to provider's login page
  → User authenticates with their own account
  → Provider redirects back to Supabase callback URL with auth code
  → Supabase exchanges code for user profile & creates session
  → Supabase redirects to your app's /auth/callback route
  → App exchanges code for session cookie → redirects to /dashboard
```

**Key files in the codebase:**
- `app/auth/sign-in/page.tsx` — Sign-in UI with social buttons (calls `supabase.auth.signInWithOAuth()`)
- `app/auth/callback/route.ts` — Exchanges OAuth code for session, redirects to dashboard
- `lib/supabase/client.ts` — Browser Supabase client
- `lib/supabase/server.ts` — Server Supabase client (used in callback)

---

## Provider 1: Google

### Step 1 — Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one) — name it "Dayli AI" or similar
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. If prompted, configure the **OAuth consent screen** first:
   - User type: **External**
   - App name: **Dayli AI**
   - User support email: your team email
   - Authorized domains: add `dailylivinglabs.com` (your production domain)
   - Developer contact email: your team email
   - Scopes: add `email` and `profile`
6. Back in Credentials, create an **OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Name: "Dayli AI Web"
   - Authorized JavaScript origins: add your app URLs (e.g. `http://localhost:3000`, `https://yourdomain.com`)
   - Authorized redirect URIs: add `https://xmqehnuguvlihvqrojme.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

### Step 2 — Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select the Dayli AI project
3. Navigate to **Authentication → Providers → Google**
4. Toggle **Google enabled** ON
5. Paste the **Client ID** and **Client Secret** from Google Cloud
6. Click **Save**

### Testing

- Click "Continue with Google" on the sign-in page
- You should be redirected to Google's login page
- After authenticating, you'll be redirected back to `/dashboard`

---

## Provider 2: Facebook

### Step 1 — Create a Meta Developer Account

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **Get Started** (top right)
3. Log in with a Facebook account (ideally a shared team/company account)
4. Complete developer registration:
   - Verify your account (phone or credit card)
   - Select role: **Developer**
   - Complete registration

### Step 2 — Create a Facebook App

1. From the Meta for Developers dashboard, click **Create App**
2. Select use case: **Authenticate and request data from users with Facebook Login**
3. Business portfolio: Select **"I don't want to connect a business portfolio yet"** (can add later)
4. App name: **Dayli AI**
5. Complete the app creation wizard

### Step 3 — Configure Facebook Login

1. In your app dashboard, go to **Facebook Login → Settings** (or find it under Products)
2. Add this as a **Valid OAuth Redirect URI**:
   ```
   https://xmqehnuguvlihvqrojme.supabase.co/auth/v1/callback
   ```
3. Save changes

### Step 4 — Get App Credentials

1. Go to **Settings → Basic**
2. Copy the **App ID** (a numeric string like `648293017254`)
3. Copy the **App Secret** (click "Show", may require password)

### Step 5 — Supabase Dashboard

1. Go to Supabase Dashboard → **Authentication → Providers → Facebook**
2. Toggle **Facebook enabled** ON
3. Paste the **App ID** as "Facebook client ID"
4. Paste the **App Secret** as "Facebook secret"
5. Click **Save**

### Step 6 — Set App to Live Mode

> **Important:** By default, Facebook apps are in **Development mode** — only registered test users can log in. To allow all users:

1. In Meta for Developers, go to your app
2. At the top of the page, toggle the app from **Development** to **Live**
3. You may need to provide a Privacy Policy URL and Terms of Service URL
   - Privacy Policy: `https://yourdomain.com/privacy`
   - Terms of Service: `https://yourdomain.com/terms`

### Testing

- Click "Continue with Facebook" on the sign-in page
- You should see Facebook's login/authorization page
- After authenticating, you'll be redirected back to `/dashboard`

---

## Provider 3: Apple

### Prerequisites

- An [Apple Developer Program](https://developer.apple.com/programs/) membership ($99/year)
- Access to the Apple Developer portal

### Step 1 — Register an App ID

1. Go to [Apple Developer → Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
2. Click **Identifiers → + (plus button)**
3. Select **App IDs** → Continue
4. Select **App** → Continue
5. Fill in:
   - Description: "Dayli AI"
   - Bundle ID: `com.dailylivinglabs.dayliAI` (or your preferred identifier)
6. Under Capabilities, check **Sign in with Apple**
7. Click **Continue → Register**

### Step 2 — Create a Services ID

1. Go to **Identifiers → + (plus button)**
2. Select **Services IDs** → Continue
3. Fill in:
   - Description: "Dayli AI Web"
   - Identifier: `com.dailylivinglabs.dayliAI.web` (must be different from App ID)
4. Click **Continue → Register**
5. Click on the newly created Services ID
6. Check **Sign in with Apple** → click **Configure**
7. In the configuration:
   - Primary App ID: select the App ID you created in Step 1
   - Web Domain: `xmqehnuguvlihvqrojme.supabase.co`
   - Return URLs: `https://xmqehnuguvlihvqrojme.supabase.co/auth/v1/callback`
8. Click **Save → Continue → Save**

### Step 3 — Create a Key

1. Go to **Keys → + (plus button)**
2. Key Name: "Dayli AI Sign In"
3. Check **Sign in with Apple** → click **Configure**
4. Select the Primary App ID from Step 1
5. Click **Save → Continue → Register**
6. **Download the key file** (.p8) — you can only download this once!
7. Note the **Key ID** shown on the confirmation page

### Step 4 — Gather Your Credentials

You need four values:
| Value | Where to find it |
|-------|-------------------|
| **Services ID** | The identifier from Step 2 (e.g. `com.dailylivinglabs.dayliAI.web`) |
| **Team ID** | Apple Developer portal → top right → view your Team ID (10-character string) |
| **Key ID** | From Step 3 when you created the key |
| **Private Key** | Contents of the .p8 file you downloaded |

### Step 5 — Supabase Dashboard

1. Go to Supabase Dashboard → **Authentication → Providers → Apple**
2. Toggle **Apple enabled** ON
3. Paste:
   - **Services ID** (not the App ID bundle identifier)
   - **Team ID**
   - **Key ID**
   - **Private Key** (the full contents of the .p8 file, including the `-----BEGIN PRIVATE KEY-----` header)
4. Click **Save**

### Testing

- Click "Continue with Apple" on the sign-in page
- You should see Apple's sign-in page
- After authenticating, you'll be redirected back to `/dashboard`

---

## Troubleshooting

### "OAuth error" or redirect fails
- Verify the callback URL is exactly: `https://xmqehnuguvlihvqrojme.supabase.co/auth/v1/callback`
- Check the provider is toggled ON in Supabase Dashboard
- Ensure credentials are correct (no extra spaces when pasting)

### Facebook: "App not set up" error
- The app is still in Development mode — switch to Live mode (see Provider 2, Step 6)

### Google: "redirect_uri_mismatch" error
- The Supabase callback URL is not in your authorized redirect URIs in Google Cloud Console
- Add it under Credentials → your OAuth client → Authorized redirect URIs

### Apple: "invalid_client" error
- Make sure you're using the **Services ID** (not the App ID) in Supabase
- Verify the private key includes the full PEM header/footer
- Check that the Key is associated with the correct App ID

### User exists with different provider
- By default, Supabase will not merge accounts. If a user signs up with email and later tries Google with the same email, they may get an error.
- To handle this, enable **"Allow linking identities with the same email"** in Supabase Dashboard → Authentication → General settings

### Testing in development (localhost)
- Google: add `http://localhost:3000` to authorized JavaScript origins
- Facebook: in Development mode, add yourself as a test user under Roles → Test Users
- Apple: Sign in with Apple requires HTTPS — use a tunnel like ngrok for local testing

---

## Checklist

- [ ] **Google:** OAuth client created in Google Cloud Console
- [ ] **Google:** Callback URL added to authorized redirect URIs
- [ ] **Google:** Client ID + Secret added in Supabase Dashboard
- [ ] **Google:** Provider toggled ON in Supabase
- [ ] **Facebook:** Developer account created at developers.facebook.com
- [ ] **Facebook:** App created with "Facebook Login" use case
- [ ] **Facebook:** Callback URL added as Valid OAuth Redirect URI
- [ ] **Facebook:** App ID + Secret added in Supabase Dashboard
- [ ] **Facebook:** Provider toggled ON in Supabase
- [ ] **Facebook:** App switched from Development to Live mode
- [ ] **Apple:** Apple Developer Program membership active
- [ ] **Apple:** App ID registered with Sign in with Apple capability
- [ ] **Apple:** Services ID created and configured with callback URL
- [ ] **Apple:** Key created and .p8 file downloaded
- [ ] **Apple:** Services ID + Team ID + Key ID + Private Key added in Supabase
- [ ] **Apple:** Provider toggled ON in Supabase
- [ ] **All providers:** Test sign-in flow end-to-end

---

*Generated for the Dayli AI project — April 2026*
