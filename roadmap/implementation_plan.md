# Forge — Implementation Plan

A hybrid-platform gym management application: **Owner dashboard on web**, **Trainer & Member apps on mobile** — with a shared design system and business logic.

---

## 1. Product Vision & Differentiation

Forge is designed to **feel light and intentional** — unlike bloated, enterprise-style gym software. Every screen serves a purpose, every animation gives feedback, and every metric provides an actionable insight. The core differentiators:

| Differentiator | What It Means |
|---|---|
| **Platform-Matched UX** | Owner gets full-width dashboards on web; Trainers & Members get native mobile with camera, QR, and push notifications |
| **QR Attendance** | Frictionless check-in via a unique per-member QR code scanned at the gym entrance |
| **Gamified Engagement** | Streaks, badges, leaderboards, and monthly fitness challenges keep members coming back |
| **Trainer Marketplace** | Members can browse, compare, and book sessions with trainers — turning each trainer into a micro-brand |
| **Hybrid Architecture** | Shared business logic across web and mobile; Owner stays on web permanently, Trainer/Member graduate to native apps |

---

## 2. Core Features & MVP Scope

### 2.1 Phase 1 — Web MVP (All Roles)

> [!IMPORTANT]
> Phase 1 builds **all three modules as a web app** to validate every user flow before investing in native mobile. The Owner module stays web permanently; Trainer & Member modules serve as functional prototypes.

#### Authentication & Onboarding
- Role-based sign-up/login (Owner, Trainer, Member)
- Quick 3-step animated onboarding per role

#### Owner Module (Web — permanent home)
- Dashboard: active members, revenue, upcoming renewals, class utilization (charts)
- Member & Trainer directory with search/filter
- Payment & renewal analytics
- Push notification composer (mock)

#### Trainer Module (Web — prototype for Phase 2 mobile)
- Client list with profile cards
- Workout plan builder (exercise picker, sets/reps, schedule)
- Diet chart builder (meal plan grid) — *PT members only*
- Progress tracker (photo timeline + measurements log) — *PT members only*

#### Member Module (Web — prototype for Phase 2 mobile)
- Personal dashboard: today's workout, diet plan, streak counter, badges
- Workout log (mark exercises done)
- Calories burnt per exercise card (displays estimated calories for each logged exercise)
- Diet plan viewer — *PT members only*
- Attendance history + QR code for check-in
- Notification feed (renewals, trainer updates)

#### Novel Features (MVP-light versions)
- **Community Leaderboard**: Points from workouts logged, streaks, challenges
- **In-App Messaging**: Simple chat between trainer and member

### 2.2 Phase 2 — Native Mobile (Trainer & Member)

Trainer and Member modules graduate from web prototype to native mobile apps:

- **React Native apps** for iOS and Android
- Native camera access for progress photos
- Native QR code scanning for attendance
- Push notifications via Firebase FCM
- Offline-capable workout logging
- Bottom tab navigation optimized for one-handed use
- Owner module **remains on web** (no mobile port needed)

### 2.3 Phase 3 — Advanced Features

- AI Recommendation Engine — rule-based suggestions based on profile (age, weight, goal), displayed as "Forge AI Suggests"
- Body Composition Timeline — photo upload + manual measurements on a visual timeline
- Real ML-based recommendation engine (upgrade from rule-based)
- NFC attendance scanning
- Video exercise library with form tips
- Wearable device integration (Apple Watch, Fitbit)
- Owner financial forecasting / churn prediction
- Multi-branch gym management
- White-label / SaaS mode

---

## 3. Monetization Strategies

| Strategy | Description |
|---|---|
| **Freemium SaaS** | Free for 1 trainer + 25 members; paid tiers for larger gyms |
| **Trainer Marketplace Commission** | 10-15% commission on trainer session bookings |
| **Premium Analytics** | Advanced dashboards (churn prediction, revenue forecasting) for owners on Pro plan |
| **In-App Purchases** | Members buy premium workout programs, specialized diet plans |
| **Affiliate Marketing** | Supplement, gear, and equipment recommendations with affiliate links |
| **White-Label Licensing** | Gyms pay for branded versions of the app |

---

## 4. Growth Hooks & Engagement

- **Streaks & Badges**: Daily workout streak, "Iron Week" (7 days), "Forge Master" (30 days)
- **Monthly Challenges**: Owner creates gym-wide challenges (e.g., "Most Workouts in March")
- **Referral Bonuses**: Members earn badge + points for referring friends
- **Progress Sharing**: Members can share body-comp timelines to social media (watermarked with Forge branding)
- **Trainer Spotlight**: Top-rated trainers featured on the community board
- **Smart Nudges**: "You're 1 workout away from your streak!" push notification

---

## 5. Tech Stack

### Phase 1 — Web MVP (All Roles)

| Layer | Choice | Why |
|---|---|---|
| **Build Tool** | Vite | Fastest HMR, excellent DX |
| **UI** | React 18 | Component model, huge ecosystem |
| **Routing** | React Router v6 | Standard, declarative routing |
| **Styling** | Vanilla CSS + CSS Variables | Full control, no framework overhead, shared design tokens |
| **Charts** | Recharts | Lightweight, React-native charting (Owner dashboards) |
| **Icons** | Lucide React | Clean, minimal icon set |
| **Animations** | CSS transitions + Framer Motion (light) | Smooth micro-interactions |
| **State** | React Context + useReducer | Simple, no external dependency for MVP |
| **Mock Data** | JSON files + Context providers | Simulates backend; easy to swap for real API later |

### Phase 2 — Mobile Apps (Trainer & Member)

| Layer | Choice | Why |
|---|---|---|
| **Framework** | React Native (Expo) | Cross-platform iOS + Android, shared JS knowledge |
| **Navigation** | React Navigation v6 | Standard mobile navigation (stack, tabs, drawer) |
| **UI Components** | React Native Paper | Material Design components, dark theme support |
| **Charts** | Victory Native | Lightweight charting for mobile |
| **Camera** | expo-camera | Progress photos, document scanning |
| **QR/Barcode** | expo-barcode-scanner | QR check-in scanning |
| **Push Notifications** | Firebase FCM + expo-notifications | Reliable cross-platform push |
| **State** | Same Context + useReducer patterns | Consistency with web codebase |
| **Offline** | AsyncStorage + sync queue | Workout logs work without connectivity |

### Shared Across Platforms

| Layer | Choice | Why |
|---|---|---|
| **Business Logic** | `packages/shared/` (TypeScript) | Calorie formulas, validators, data transforms — used by both web and mobile |
| **API Client** | Fetch / Axios wrapper | Same service layer, same request patterns |
| **Design Tokens** | JSON token file | Colors, spacing, typography shared between CSS variables and React Native StyleSheet |
| **Types / Models** | TypeScript interfaces | Single source of truth for data shapes |

> [!NOTE]
> Phase 1 is **frontend-only** with mock data. The architecture is designed so swapping mock data providers for real API calls is a one-line change per module. ~65% of non-UI code will be shared across web and mobile.

---

## 6. UI/UX Design Language

### Design Principles
- **Dark-first theme** with a warm accent palette (amber/orange on charcoal)
- **Card-based layouts** — every data unit lives in a softly elevated card
- **Generous whitespace** — the app should breathe
- **Mono + Sans pairing** — `Inter` for UI, `JetBrains Mono` for data/numbers
- **Micro-animations** — smooth page transitions, card hover lifts, progress bar fills, badge unlocks
- **Platform-adaptive**: full sidebar nav on web, bottom tab nav on mobile

### Color Palette (Shared Design Tokens)
| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0F0F0F` | App background |
| `--bg-card` | `#1A1A1A` | Card surfaces |
| `--bg-card-hover` | `#242424` | Card hover state (web) / pressed state (mobile) |
| `--accent` | `#F59E0B` | Primary accent (amber) |
| `--accent-glow` | `#F59E0B33` | Glow effects |
| `--text-primary` | `#F5F5F5` | Main text |
| `--text-secondary` | `#A3A3A3` | Secondary text |
| `--success` | `#22C55E` | Positive metrics |
| `--danger` | `#EF4444` | Alerts, overdue |
| `--gradient-hero` | `linear-gradient(135deg, #F59E0B, #EF4444)` | Hero elements |

---

## 7. Project Structure

### Phase 1 — Web MVP (Monorepo-ready)

```
d:\Forge Gym Management Application\
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── forge-logo.svg
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # Router + layout
│   ├── index.css                   # Global styles + design tokens
│   │
│   ├── components/                 # Shared UI components (web)
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── StatCard.jsx
│   │   ├── Badge.jsx
│   │   ├── QRCode.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── Modal.jsx
│   │   └── ChatBubble.jsx
│   │
│   ├── layouts/
│   │   └── DashboardLayout.jsx     # Sidebar + content shell
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Onboarding.jsx
│   │   │
│   │   ├── owner/                  # 🖥️ Permanent web home
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── Members.jsx
│   │   │   ├── Trainers.jsx
│   │   │   ├── Revenue.jsx
│   │   │   └── Notifications.jsx
│   │   │
│   │   ├── trainer/                # 📱 Web prototype → Mobile in Phase 2
│   │   │   ├── TrainerDashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── WorkoutBuilder.jsx
│   │   │   ├── DietBuilder.jsx
│   │   │   └── ProgressTracker.jsx
│   │   │
│   │   └── member/                 # 📱 Web prototype → Mobile in Phase 2
│   │       ├── MemberDashboard.jsx
│   │       ├── WorkoutLog.jsx
│   │       ├── CaloriesBurnt.jsx
│   │       ├── DietPlan.jsx        # PT members only
│   │       ├── Attendance.jsx
│   │       ├── Leaderboard.jsx
│   │       └── Messages.jsx
│   │
│   ├── data/                       # Mock data (JSON-like)
│   │   ├── members.js
│   │   ├── trainers.js
│   │   ├── workouts.js
│   │   ├── diets.js
│   │   └── analytics.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AppContext.jsx
│   │
│   └── utils/
│       └── helpers.js              # Calorie formulas, formatters
```

### Phase 2 — Monorepo After Mobile Addition

```
d:\Forge Gym Management Application\
├── packages/
│   ├── shared/                     # 🔗 Shared business logic
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── models/             # TypeScript interfaces
│   │   │   ├── services/           # API client layer
│   │   │   ├── utils/              # Calorie formulas, validators
│   │   │   └── constants/          # Design tokens as JSON
│   │   └── tsconfig.json
│   │
│   ├── web/                        # 🖥️ Owner Dashboard (React + Vite)
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── package.json
│   │   └── src/                    # Owner pages, components, styles
│   │
│   └── mobile/                     # 📱 Trainer + Member App (React Native)
│       ├── app.json
│       ├── package.json
│       ├── App.tsx
│       └── src/
│           ├── screens/
│           │   ├── trainer/        # Trainer screens
│           │   └── member/         # Member screens
│           ├── components/         # Mobile-specific components
│           ├── navigation/         # Stack + Tab navigators
│           └── theme/              # React Native StyleSheet from tokens
│
├── package.json                    # Monorepo root (workspaces)
└── README.md
```

---

## 8. Proposed Changes — Phase 1 (Current Build)

### Project Initialization
#### [NEW] [package.json](file:///d:/Forge%20Gym%20Management%20Application/package.json)
Initialize via `npx create-vite@latest ./ --template react`. Adds Recharts and Lucide React as dependencies.

#### [NEW] [vite.config.js](file:///d:/Forge%20Gym%20Management%20Application/vite.config.js)
Standard Vite React config.

#### [NEW] [index.html](file:///d:/Forge%20Gym%20Management%20Application/index.html)
Entry HTML with Inter + JetBrains Mono font imports, meta tags, dark background.

---

### Design System & Global Styles
#### [NEW] [index.css](file:///d:/Forge%20Gym%20Management%20Application/src/index.css)
All CSS custom properties (color palette, spacing, typography, shadows), base resets, card styles, button variants, animation keyframes, responsive breakpoints. These tokens are designed to map directly to React Native StyleSheet values in Phase 2.

---

### Shared Components
#### [NEW] All files in `src/components/`
`Sidebar`, `TopBar`, `StatCard`, `Badge`, `QRCode`, `ProgressRing`, `Modal`, `ChatBubble` — reusable across all three role modules during Phase 1. In Phase 2, mobile-specific versions will be created in `packages/mobile/src/components/`.

---

### Layouts
#### [NEW] [DashboardLayout.jsx](file:///d:/Forge%20Gym%20Management%20Application/src/layouts/DashboardLayout.jsx)
Sidebar + TopBar + scrollable content area. Collapses sidebar to bottom nav on mobile viewport (Phase 1 responsive fallback; replaced by native tab nav in Phase 2).

---

### Pages — Auth
#### [NEW] [Login.jsx](file:///d:/Forge%20Gym%20Management%20Application/src/pages/Login.jsx)
Dark-themed login with role selector tabs, animated transitions. In Phase 2, Member/Trainer login moves to the mobile app.

#### [NEW] [Onboarding.jsx](file:///d:/Forge%20Gym%20Management%20Application/src/pages/Onboarding.jsx)
3-step onboarding wizard with progress dots and slide animations.

---

### Pages — Owner Module (🖥️ Web — Permanent)
#### [NEW] All files in `src/pages/owner/`
`OwnerDashboard` (KPI cards + charts), `Members` (searchable directory), `Trainers` (performance cards), `Revenue` (payment analytics), `Notifications` (composer UI). These pages stay in the web app permanently.

---

### Pages — Trainer Module (📱 Web Prototype → Mobile in Phase 2)
#### [NEW] All files in `src/pages/trainer/`
`TrainerDashboard` (client overview), `Clients` (profile cards), `WorkoutBuilder` (drag-style exercise picker), `DietBuilder` (meal plan grid, PT members only), `ProgressTracker` (photo timeline + measurements, PT members only). These serve as functional prototypes; the UI logic and data flows will be re-implemented as React Native screens in Phase 2.

---

### Pages — Member Module (📱 Web Prototype → Mobile in Phase 2)
#### [NEW] All files in `src/pages/member/`
`MemberDashboard` (today's plan + streaks + badges), `WorkoutLog` (checkbox exercise list), `CaloriesBurnt` (estimated calories per exercise card), `DietPlan` (meal cards, PT members only), `Attendance` (QR code + history), `Leaderboard` (ranked member list), `Messages` (chat with trainer). These serve as functional prototypes for Phase 2 migration.

---

### Data & Context
#### [NEW] All files in `src/data/` and `src/context/`
Mock data sets for members, trainers, workouts, diets, analytics. Auth and App context providers. In Phase 2, mock data layers are replaced with API service calls from `packages/shared/`.

---

### Utilities
#### [NEW] [helpers.js](file:///d:/Forge%20Gym%20Management%20Application/src/utils/helpers.js)
Shared utility functions: date formatting, calorie estimation formulas (MET-based), data transformers. In Phase 2, these move to `packages/shared/src/utils/`.

---

## 9. Verification Plan

### Phase 1 — Web MVP (Browser-based)

1. **Start dev server**: `npm run dev` in the project root
2. **Login Flow**: Navigate to localhost, verify login page renders, select each role, confirm redirect to correct dashboard
3. **Owner Dashboard**: Verify KPI cards display data, charts render, member/trainer lists are populated
4. **Trainer Module**: Verify client list, workout builder interactions, diet builder grid, progress photo timeline
5. **Member Module**: Verify dashboard streaks/badges, workout log checkboxes, calories burnt card, QR code renders, leaderboard ranks, message bubbles
6. **Responsive**: Resize browser to mobile width, verify sidebar collapses to bottom nav, cards stack vertically (validates mobile-readiness for Phase 2)
7. **Animations**: Verify page transitions, card hover effects, and progress ring animations are smooth

### Phase 2 — Mobile Apps (Device/Emulator)
- Run Trainer app on iOS simulator + Android emulator
- Run Member app on iOS simulator + Android emulator
- Verify native QR scanning works
- Verify push notifications are received
- Verify offline workout logging syncs when back online
- Verify camera captures progress photos

### Manual Verification (User)
- Visually review the design and provide feedback on color palette, spacing, and overall feel
- Test Owner dashboard on desktop browser
- Test Trainer/Member apps on real physical devices
