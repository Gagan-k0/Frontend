# WhatBoutMe LMS — UI/UX Design Brief

> **Version:** 1.0  
> **Date:** September 29, 2026  
> **Verified Against:** PRD v1.2, TRD v1.2, APP_FLOW v1.0, ARCHITECTURE v1.1

---

## 1. Executive Design Vision

The WhatBoutMe LMS must feel **premium, authoritative, yet highly accessible**. It is not just a course platform; it is a premium certification environment. The design must minimize cognitive load, allowing the learner to focus entirely on the video and text content. 

**Core Principles:**
- **Clarity over Cleverness:** Progression paths must be blindly obvious.
- **Focus Mode:** Once inside a Step, the UI must fade away. Distractions are minimized.
- **Premium Aesthetics:** Utilize subtle glassmorphism, refined typography, and smooth micro-interactions to create a $1000+ course feel.

---

## 2. Design System & Tokens (Tailwind CSS Base)

### 2.1 Color Palette
- **Primary Brand (Action):** `Deep Royal Blue` (#1E3A8A) — Used for primary buttons, active states, and Step 1 unlocks.
- **Secondary Brand (Accent):** `Warm Gold` (#D97706) — Used for certifications, confetti, and achievement badges.
- **Background (App):** `Off-White/Pearl` (#F8FAFC) — Reduces eye strain for long reading sessions compared to pure white.
- **Background (Focus Mode):** `Dark Slate` (#0F172A) — Used for the video player theater mode.
- **State Colors:** 
  - Success: `Emerald` (#10B981)
  - Error/Lock: `Rose` (#E11D48)
  - Disabled: `Slate 300` (#CBD5E1)

### 2.2 Typography
- **Headings (Display):** `Outfit` or `Plus Jakarta Sans` — Geometric, modern, instills authority.
- **Body Text:** `Inter` or `Roboto` — Highly legible, specifically chosen for long-form PDF reading and quiz taking.
- **Base Size:** `16px` for optimal readability. 
- **Line Height:** `1.6` for lesson content to prevent text wall fatigue.

---

## 3. Core Component Library

1. **The "Step Card" (Dashboard):**
   - *Locked State:* Gray background, low opacity text, prominent padlock icon, no hover effect.
   - *Unlocked State:* White card, soft drop shadow, Primary Blue title, hover translates `Y` up by `-2px` with a smooth `ease-in-out` 200ms transition.
   - *Completed State:* Faded border, Green checkmark badge, "Review" button.

2. **Progress Indicators:**
   - Circular SVG progress rings for overall course completion (e.g., 45% with a primary colored arc).
   - Linear progress bars inside Quizzes to show `Question 3 of 10`.

3. **Skeleton Loaders:**
   - Do not use generic spinners. Use pulsing skeleton shapes that mimic the content loading (e.g., a pulsing gray rectangle where the Mux Video will appear). This reduces perceived latency.

4. **Modals & Overlays:**
   - Used heavily for the Quiz UI and the Agreement Signature Canvas. Must use a `backdrop-blur-sm` effect (glassmorphism) to keep the user grounded in the app while demanding immediate attention.

---

## 4. UI Flow & Screen Guidelines (Mapped to APP_FLOW)

### 4.1 Public Marketing Pages (`/`, `/programs`)
- **Vibe:** Conversion-heavy, dynamic.
- **Elements:** Large hero sections, social proof (testimonial carousels), sticky header with "Enroll Now" CTA.
- **Animation:** Scroll-triggered fade-ups (using Framer Motion) to make the page feel alive.

### 4.2 Onboarding: The E-Signature Screen
- **Vibe:** Legal, serious, but frictionless.
- **Elements:** A massive, clean white canvas area for the signature. A "Clear" button and a "Sign & Continue" button. Must work flawlessly with mobile touch screens (no accidental scrolling while signing).

### 4.3 Learner Focus Mode (`/portal/programs/1/step/2`)
- **Vibe:** Deep concentration.
- **Elements:** 
  - Collapsible sidebar. When the video plays, the sidebar auto-collapses.
  - Video player takes up 80% of the viewport width on desktop.
  - Next/Previous lesson buttons are large and sticky at the bottom of the screen.

### 4.4 Quiz Interface
- **Vibe:** Testing environment.
- **Elements:** One question per screen. Large touch-targets for multiple-choice options (entire row is clickable, not just the radio button). A countdown timer anchored to the top right.

---

## 5. Accessibility (a11y) & Edge Case UI (Mapped to TRD)

1. **High Contrast:** All text over backgrounds must meet WCAG 2.1 AA contrast ratio (4.5:1).
2. **Keyboard Navigation:** Crucial for Quizzes and Admin panel. The user must be able to TAB through quiz options and hit ENTER to submit. Focus rings (`ring-2 ring-blue-500`) must be highly visible when using the keyboard.
3. **Empty States:** If a user has no active batches, do not show a blank screen. Show a beautifully illustrated "Empty State" with a CTA to browse programs.
4. **Error States (TRD mapping):** 
   - If `checkUnlockStatus()` fails, show a friendly 403 screen: "Oops! You need to finish the previous step first" with a clear "Go Back" button. Do not show generic 400/500 errors.
5. **Responsive Design:** 
   - **Mobile (Base):** Stacked UI, hamburger menu, sticky bottom navigation bars for lesson progression.
   - **Tablet (md):** Two-column layouts for dashboard.
   - **Desktop (lg+):** Sidebar navigation, expansive data tables for Admin.

---

## 6. Feedback & Micro-Interactions

- **Success States:** When a user passes the 11th step or final exam, trigger a lightweight confetti animation (react-confetti). Positive reinforcement drives completion rates.
- **Haptic Feedback (Mobile):** Utilize browser vibration API (if permitted) when a user submits a quiz or signs the agreement to provide physical validation.
- **Save States:** When an admin is editing a course in "Roweena's Studio," show a subtle "Saving..." to "Saved!" indicator in the top right, utilizing debounced auto-saves.
