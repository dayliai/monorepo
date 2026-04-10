# Set Up Dayli AI Next.js App from Figma Make Prototype

## Project Context

I'm building **Dayli AI**, an AI assistant that helps people with disabilities and caregivers discover solutions, tools, and resources for daily living. My team cannot write code from scratch — we have a working prototype built in Figma Make (React + Vite + react-router) and need to copy it into our existing Next.js project with the necessary conversions.

## Existing Next.js Project

The project already exists at the current working directory with this structure:

```
dayli-ai/
├── app/
│   ├── api/           (empty)
│   ├── assessment/
│   │   └── page.tsx   (placeholder — DELETE this folder)
│   ├── community/     (empty)
│   ├── moderation/    (empty)
│   ├── solutions/
│   │   └── page.tsx   (placeholder — DELETE this folder)
│   ├── globals.css
│   ├── layout.tsx     (default Next.js layout — UPDATE)
│   ├── page.tsx       (default Next.js boilerplate — REPLACE)
│   └── favicon.ico
├── lib/
│   └── supabase.ts    (Supabase client — KEEP as-is)
├── public/            (default svgs — can delete)
├── package.json       (next 16.2.1, react 19.2.4, tailwindcss ^4)
└── node_modules/      (exists)
```

## Step 1: Install missing packages

```bash
npm install lucide-react motion @supabase/supabase-js
```

## Step 2: Save assets

Download these images and save them to `public/images/`:
- Save this as `public/images/dayli-ai-logo-mark.png`: https://images.unsplash.com/photo-placeholder — ACTUALLY, I'll provide the image references in the code below. For now, create placeholder images or use the URLs from the code.

For the prototype, the Figma Make code references these assets via `figma:asset/...` imports. Since we don't have the actual files, convert all asset imports to string paths pointing to `/images/filename.png`. We can replace with real files later.

Create a simple mapping:
- `figma:asset/2154f0a12011cab3bdabca1656c3e96f718f1e59.png` → `/images/dayli-ai-logo-mark.png` (the logo mark)
- `figma:asset/f1354d37f56546632dc32db49d3794f74e3a1308.png` → `/images/dayli-ai-logotype.png` (the text logo)
- `figma:asset/dbfdd24d7e086adb894952b4b87cdf550fcd9843.png` → `/images/dayli-ai-logotype.png` (alternate logotype)
- `figma:asset/e4c89b3dd58c82651d27c102c5b7d3f72ec6058d.png` → `/images/butterfly.png` (butterfly illustration)
- `figma:asset/7a89da858f4f360187de5600874761ca47340148.png` → `/images/butterfly-avatar.png` (butterfly for avatars)
- `figma:asset/6489666b2aa93e15215862062a7594034e6ee868.png` → `/images/adl-example.png` (ADL image)

For now, create simple SVG placeholders for each so the app doesn't break. We'll replace with real images later.

## Step 3: Delete old placeholders

Delete `app/assessment/` and `app/solutions/` folders.

## Step 4: Create the file structure

```
app/
├── components/
│   ├── AuthModal.tsx
│   ├── CollectionTooltip.tsx
│   ├── HeaderProfileMenu.tsx
│   ├── ImageWithFallback.tsx
│   ├── ShareModal.tsx
│   ├── SolutionCard.tsx
│   ├── SolutionModal.tsx
│   └── UserAvatar.tsx
├── contexts/
│   ├── ThemeContext.tsx
│   └── UserContext.tsx
├── data/
│   └── mockSolutions.ts
├── diagnostic/
│   └── page.tsx
├── results/
│   └── page.tsx
├── no-results/
│   └── page.tsx
├── request-form/
│   └── page.tsx
├── request-success/
│   └── page.tsx
├── chat/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
├── account/
│   └── page.tsx
├── daily-living-labs/
│   └── page.tsx
├── auth-success/
│   └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

## Step 5: Conversion rules for EVERY file

When copying the code below into Next.js, apply these changes:

### 5a. Add 'use client' directive
Every file that uses useState, useEffect, useRouter, or any browser API needs `'use client';` as the very first line.

### 5b. Replace react-router with Next.js routing
```typescript
// REMOVE:
import { useNavigate, useLocation } from 'react-router';
const navigate = useNavigate();
const location = useLocation();

// REPLACE WITH:
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
const router = useRouter();
const searchParams = useSearchParams();
const pathname = usePathname();

// Then change all calls:
// navigate('/path')        → router.push('/path')
// navigate(-1)             → router.back()
// navigate('/path', { replace: true }) → router.replace('/path')
// navigate('/chat', { state: { initialPrompt: x } }) → router.push(`/chat?prompt=${encodeURIComponent(x)}`)
// location.state?.initialPrompt → searchParams.get('prompt')
// location.search → searchParams.toString()
// new URLSearchParams(location.search).get('error') → searchParams.get('error')
```

### 5c. Replace Figma asset imports with local paths
```typescript
// REMOVE:
import imgImageDayliAiLogoMark from "figma:asset/2154f0a12011cab3bdabca1656c3e96f718f1e59.png";

// REPLACE WITH:
const imgImageDayliAiLogoMark = "/images/dayli-ai-logo-mark.png";
```

### 5d. Replace ImageWithFallback
Keep the ImageWithFallback component but remove the `figma:` import path references. It's just a regular React component.

### 5e. Remove react-router Outlet
The Root.tsx component uses `<Outlet />` from react-router. In Next.js, the layout.tsx handles this with `{children}`. Don't create a Root component — put the providers in layout.tsx instead.

## Step 6: Update layout.tsx

Wrap children with UserProvider and ThemeProvider. Update metadata to "Dayli AI".

## Step 7: Known bugs to fix
- Auth state inconsistency: user appears logged in but still sees "Sign In" button. Make sure HeaderProfileMenu checks `isSignedIn` consistently.
- The `AuthModal` uses `createPortal(... , document.body)` — this needs a check for `typeof document !== 'undefined'` since Next.js has server-side rendering.

## Important rules
- Add `'use client';` to every interactive component
- Do NOT change any visual styles — keep all Tailwind classes exactly as they are
- Do NOT connect to Supabase yet — keep using mock data
- Do NOT delete `lib/supabase.ts`
- Work one screen at a time, test after each
- Priority order: Landing → Diagnostic → Results → Chat → everything else

---

# SOURCE CODE FROM FIGMA MAKE

Below is every source file from the Figma Make prototype. Copy each one into the correct location, applying the conversion rules above.

---

## FILE: app/contexts/UserContext.tsx

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';

export type AvatarState = {
  type: 'none' | 'upload' | 'preset';
  url?: string;
  presetId?: string;
};

export type CollectionColor = 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink';

export type Collection = {
  id: string;
  name: string;
  color: CollectionColor;
  solutionIds: string[];
};

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  avatar: AvatarState;
  setAvatar: (avatar: AvatarState) => void;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  collections: Collection[];
  addCollection: (name: string, color: CollectionColor) => void;
  updateCollection: (id: string, name: string, color: CollectionColor) => void;
  deleteCollection: (id: string) => void;
  addSolutionToCollection: (collectionId: string, solutionId: string) => void;
  removeSolutionFromCollection: (collectionId: string, solutionId: string) => void;
  likedSolutionIds: string[];
  toggleLikeSolution: (solutionId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState('Jane Doe');
  const [email, setEmail] = useState('jane.doe@email.com');
  const [avatar, setAvatar] = useState<AvatarState>({ type: 'none' });
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [likedSolutionIds, setLikedSolutionIds] = useState<string[]>([]);

  const [collections, setCollections] = useState<Collection[]>([
    { id: 'default', name: 'Collection', color: 'purple', solutionIds: [] }
  ]);

  const signIn = useCallback(() => setIsSignedIn(true), []);
  const signOut = useCallback(() => {
    setIsSignedIn(false);
    setAvatar({ type: 'none' });
    setCollections([{ id: 'default', name: 'Collection', color: 'purple', solutionIds: [] }]);
  }, []);

  const addCollection = (name: string, color: CollectionColor) => {
    setCollections(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name, color, solutionIds: [] }]);
  };

  const updateCollection = (id: string, name: string, color: CollectionColor) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, name, color } : c));
  };

  const deleteCollection = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  const addSolutionToCollection = (collectionId: string, solutionId: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId && !c.solutionIds.includes(solutionId)) {
        return { ...c, solutionIds: [...c.solutionIds, solutionId] };
      }
      return c;
    }));
  };

  const removeSolutionFromCollection = (collectionId: string, solutionId: string) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        return { ...c, solutionIds: c.solutionIds.filter(id => id !== solutionId) };
      }
      return c;
    }));
  };

  const toggleLikeSolution = (solutionId: string) => {
    setLikedSolutionIds(prev =>
      prev.includes(solutionId)
        ? prev.filter(id => id !== solutionId)
        : [...prev, solutionId]
    );
  };

  return (
    <UserContext.Provider value={{
      username, setUsername, email, setEmail,
      avatar, setAvatar, isSignedIn, signIn, signOut,
      collections, addCollection, updateCollection, deleteCollection,
      addSolutionToCollection, removeSolutionFromCollection,
      likedSolutionIds, toggleLikeSolution
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
```

---

## FILE: app/contexts/ThemeContext.tsx

```tsx
import React, { createContext, useContext, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'grayscale';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  largeText: boolean;
  setLargeText: (large: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [largeText, setLargeText] = useState(false);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, largeText, setLargeText }}>
      <div
        className={`
          min-h-screen w-full transition-all duration-300
          ${theme === 'dark' ? 'theme-dark bg-[#111]' : ''}
          ${theme === 'high-contrast' ? 'theme-high-contrast' : ''}
          ${theme === 'grayscale' ? 'theme-grayscale' : ''}
          ${largeText ? 'theme-large-text' : ''}
        `}
      >
        <style>{`
          .theme-dark {
            filter: invert(1) hue-rotate(180deg);
          }
          .theme-dark img,
          .theme-dark video,
          .theme-dark svg {
            filter: invert(1) hue-rotate(180deg);
          }
          .theme-high-contrast {
            filter: contrast(1.4) saturate(1.2);
          }
          .theme-grayscale {
            filter: grayscale(1);
          }
          .theme-large-text {
            zoom: 1.08;
          }
          @-moz-document url-prefix() {
            .theme-large-text {
              transform: scale(1.08);
              transform-origin: top center;
            }
          }
        `}</style>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

---

## FILE: app/data/mockSolutions.ts

```ts
export type Solution = {
  id: string;
  title: string;
  description: string;
  sourceType: 'web' | 'youtube' | 'community';
  sourceName: string;
  imageUrl: string;
  tags: string[];
  matchRating: number;
  matchReason: string;
  category: string;
  isDIY: boolean;
  priceLevel: 0 | 1 | 2 | 3;
  helpfulCount: number;
  dateAdded: string;
};

export const MOCK_SOLUTIONS: Solution[] = [
  {
    id: 'sol-1',
    title: 'Weighted Adaptive Utensils for Hand Tremors',
    description: 'These weighted utensils are specifically designed to counteract hand tremors, making eating easier and more dignified. They feature wide, non-slip grips and a durable stainless steel construction.',
    sourceType: 'web',
    sourceName: 'Disability Living Store',
    imageUrl: 'https://images.unsplash.com/photo-1540487800723-f47a69acdf68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tags: ['Hand Dexterity', 'Eating'],
    matchRating: 95,
    matchReason: 'Based on your diagnostic tool input indicating challenges with "Using eating utensils" and "Hand Dexterity".',
    category: 'Hand Dexterity',
    isDIY: false,
    priceLevel: 2,
    helpfulCount: 342,
    dateAdded: '2023-10-01T10:00:00Z'
  },
  {
    id: 'sol-2',
    title: 'How to use a button hook and zipper pull',
    description: 'A step-by-step video guide demonstrating techniques to easily button shirts and pull zippers using specialized, inexpensive adaptive tools.',
    sourceType: 'youtube',
    sourceName: 'Occupational Therapy Hacks',
    imageUrl: 'https://images.unsplash.com/photo-1620663554524-757c73e9865a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tags: ['Dexterity', 'Dressing'],
    matchRating: 88,
    matchReason: 'Directly addresses your selected challenge: "Buttoning clothes or tying shoes".',
    category: 'Hand Dexterity',
    isDIY: false,
    priceLevel: 1,
    helpfulCount: 521,
    dateAdded: '2023-11-15T12:00:00Z'
  },
  {
    id: 'sol-3',
    title: 'Voice-Activated Smart Home Setup Guide',
    description: 'Learn how to completely automate your living space using affordable voice assistants.',
    sourceType: 'web',
    sourceName: 'Tech Accessibility Hub',
    imageUrl: 'https://images.unsplash.com/photo-1562851529-c370841f6536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tags: ['Vision', 'Mobility'],
    matchRating: 75,
    matchReason: 'Helps with general mobility challenges by reducing the need to physically interact with switches.',
    category: 'Mobility & Movement',
    isDIY: true,
    priceLevel: 3,
    helpfulCount: 204,
    dateAdded: '2023-09-20T08:00:00Z'
  },
  {
    id: 'sol-4',
    title: 'Local Caregiver Support Meetup (Virtual)',
    description: 'Join our weekly virtual support group where caregivers share experiences, valuable resources, and emotional support.',
    sourceType: 'community',
    sourceName: 'Dayli Caregiver Network',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tags: ['Caregiver', 'Support Group'],
    matchRating: 60,
    matchReason: 'A generalized resource for community support based on your profile.',
    category: 'Memory & Cognitive',
    isDIY: false,
    priceLevel: 0,
    helpfulCount: 89,
    dateAdded: '2024-01-05T14:30:00Z'
  }
];
```

---

## FILE: app/components/ImageWithFallback.tsx

```tsx
import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
```

---

## REMAINING SCREEN FILES

The following are the screen components. Each one needs `'use client';` at the top and the routing/asset conversions described above applied.

I'm providing them as-is from the Figma Make prototype. **You must apply the conversion rules (Step 5) to each one.**

---

## FILE: DiagnosticScreen → app/diagnostic/page.tsx
### Conversion notes: Uses `useNavigate`, `figma:asset` imports, and `AuthModal`/`HeaderProfileMenu` components.

```tsx
// ORIGINAL SOURCE — apply all conversion rules from Step 5
PASTE_DIAGNOSTIC_SCREEN_CODE_HERE
```

Since this prompt is very long, here's how to proceed:

**For each remaining screen, I'll list the file and what needs converting. Use the conversion rules from Step 5 to transform each one.**

### Screens to create (in priority order):

1. **app/page.tsx** (Landing) — Source: `LandingScreen.tsx`
   - Has `useNavigate` → convert to `router.push`
   - Has 2 `figma:asset` imports (logo mark, logotype, butterfly)

2. **app/diagnostic/page.tsx** — Source: `DiagnosticScreen.tsx`
   - Has `useNavigate` → convert to `router.push`
   - Has 2 `figma:asset` imports
   - Uses `sessionStorage` for diagnostic data (keep as-is for now)
   - Uses `AuthModal` and `HeaderProfileMenu` components

3. **app/results/page.tsx** — Source: `ResultsScreen.tsx`
   - Has `useNavigate`, `useLocation` → convert
   - `new URLSearchParams(location.search).get('error')` → `searchParams.get('error')`
   - Uses `SolutionCard`, `SolutionModal`, `HeaderProfileMenu`

4. **app/chat/page.tsx** — Source: `ChatScreen.tsx`
   - Has `useNavigate`, `useLocation` → convert
   - `location.state?.initialPrompt` → `searchParams.get('prompt')`
   - Has `figma:asset` imports
   - Uses `ImageWithFallback`, `AuthModal`, `UserAvatar`, `HeaderProfileMenu`, `ShareModal`, `CollectionTooltip`

5. **app/no-results/page.tsx** — Source: `NoResultsScreen.tsx`
   - Has `useNavigate` → convert

6. **app/request-form/page.tsx** — Source: `SolutionRequestFormScreen.tsx`
   - Has `useNavigate` → convert
   - Uses `sessionStorage` (keep as-is)

7. **app/request-success/page.tsx** — Source: `SolutionRequestSuccessScreen.tsx`
   - Has `useNavigate` → convert
   - Has `figma:asset` import (butterfly)

8. **app/dashboard/page.tsx** — Source: `DashboardScreen.tsx`
   - Has `useNavigate` → convert
   - Has `figma:asset` import
   - Uses `SolutionCard`, `SolutionModal`, `HeaderProfileMenu`

9. **app/account/page.tsx** — Source: `AccountManagementScreen.tsx`
   - Has `useNavigate` → convert
   - Has `figma:asset` import
   - Uses `useTheme`, `useUser`, `UserAvatar`, Tooltip components
   - NOTE: This file uses `@radix-ui` Tooltip components. You'll need to install: `npm install @radix-ui/react-tooltip`

10. **app/auth-success/page.tsx** — Source: `AuthSuccessScreen.tsx`
    - Has `useNavigate` → convert
    - Has `figma:asset` import

11. **app/daily-living-labs/page.tsx** — Source: `DailyLivingLabsScreen.tsx`
    - Has `useNavigate` → convert
    - Has `figma:asset` imports
    - `navigate('/chat', { state: { initialQuery: text } })` → `router.push('/chat?prompt=' + encodeURIComponent(text))`

### Shared components to create:

12. **app/components/HeaderProfileMenu.tsx** — Uses `useNavigate`, `useUser`, `useTheme`, `UserAvatar`, `AuthModal`
13. **app/components/UserAvatar.tsx** — Has `figma:asset` import for butterfly
14. **app/components/AuthModal.tsx** — Has `useNavigate`, `figma:asset`, uses `createPortal` (needs SSR guard)
15. **app/components/SolutionCard.tsx** — Uses `ImageWithFallback`, `useUser`, `ShareModal`, `CollectionTooltip`
16. **app/components/SolutionModal.tsx** — Uses `ImageWithFallback`
17. **app/components/ShareModal.tsx** — Uses `ImageWithFallback`
18. **app/components/CollectionTooltip.tsx** — Uses `useUser`

---

# HERE IS THE ACTUAL SOURCE CODE FOR EACH FILE

Please apply the conversion rules to each. I'm providing the original Figma Make code for every file.

## DiagnosticScreen.tsx (→ app/diagnostic/page.tsx)

IMPORTANT: This is the ORIGINAL code. You must:
1. Add `'use client';` at top
2. Replace `useNavigate` with `useRouter` from `next/navigation`
3. Replace `navigate(...)` with `router.push(...)`
4. Replace `figma:asset` imports with string paths
5. Update component imports to use `@/app/components/...` paths

---

Due to the extreme length, I'm going to provide the source code for each screen as separate attached files.

**HERE IS THE APPROACH:**
1. Start with the shared files first (contexts, data, components)
2. Then do pages in priority order
3. For each file, read the original source I provide, apply the 5 conversion rules, and write it

**START NOW. Work through each file one at a time. After each file, confirm what you created before moving to the next.**
