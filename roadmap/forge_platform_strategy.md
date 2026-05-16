# Forge — Platform Strategy: Web vs. Mobile Split

## The Question

> Should the **Owner module** be a web application while the **Trainer and Member modules** are mobile applications?

---

## TL;DR Verdict: **Yes — This Split Is Recommended** ✅

The Owner's workflow is **analytical and desk-based** (dashboards, reports, spreadsheets). Trainers and Members operate **on the gym floor** with their phones. Matching the platform to the usage context is the single most impactful UX decision for Forge.

---

## 1. Behavioral Justification

| Role | When They Use Forge | Where They Are | Primary Actions | Best Platform |
|---|---|---|---|---|
| **Owner** | Morning review, end-of-day reports, monthly planning | Office / desk / laptop | View charts, manage lists, export reports, compose notifications | 🖥️ **Web** |
| **Trainer** | Between sessions, on the gym floor, during client meetings | Walking around, standing | Quick client lookup, assign workout, log measurements, snap progress photos | 📱 **Mobile** |
| **Member** | At the gym, before/after workouts, on commute | Gym floor, locker room, home | QR check-in, log exercises, view plan, check leaderboard, chat trainer | 📱 **Mobile** |

> [!IMPORTANT]
> The Owner rarely needs the app in their pocket. Trainers and Members **always** need it in their pocket. Building mobile-first for the wrong role wastes resources; building web-only for the gym floor kills adoption.

---

## 2. Comparative Study

### Option A: Everything as a Web App (Unified SPA)

| ✅ Pros | ❌ Cons |
|---|---|
| Single codebase, one deployment | No push notifications without workarounds (PWA has limits) |
| Faster initial development | No camera/NFC/QR native access |
| No app store approvals needed | Poor gym-floor UX on mobile browser |
| Easier to update (no app updates) | No offline capability |
| Lower cost for MVP | Members unlikely to bookmark a web app |
| | Can't leverage device sensors (accelerometer, etc.) |
| | No home screen presence = low retention |

### Option B: Everything as a Mobile App

| ✅ Pros | ❌ Cons |
|---|---|
| Great gym-floor experience | Owner dashboards are cramped on mobile screens |
| Native push notifications | Reviewing large tables/reports is painful |
| Camera, QR, NFC access | Owner doesn't need an app — they need a dashboard |
| Offline capability | Higher development cost |
| Home screen presence | App store review cycles slow down releases |
| | Desktop experience entirely lost |

### Option C: Owner = Web, Trainer/Member = Mobile (Recommended ✅)

| ✅ Pros | ❌ Cons |
|---|---|
| Each role gets the ideal platform | Two codebases to maintain |
| Owner gets full-width dashboards and charts | Shared backend required |
| Trainer/Member get native camera, QR, push | Slightly higher initial cost than web-only |
| Mobile presence drives member retention | Need app store approvals for mobile |
| Can share 60-70% of business logic | |
| Scales naturally to multi-branch | |
| Better perceived quality | |

---

## 3. Hybrid Architecture

```mermaid
graph LR
    subgraph Web["🖥️ Web (React SPA)"]
        OD["Owner Dashboard"]
        OA["Owner Analytics"]
        OM["Owner Management"]
    end

    subgraph Mobile["📱 Mobile (React Native)"]
        TD["Trainer Dashboard"]
        TW["Workout Builder"]
        MD["Member Dashboard"]
        MQ["QR Check-in"]
        ML["Workout Log"]
    end

    subgraph Shared["🔗 Shared Layer"]
        API["REST / GraphQL API"]
        AUTH["Auth (JWT)"]
        BL["Business Logic"]
    end

    subgraph Backend["☁️ Backend"]
        SRV["Node.js / Express"]
        DB[("PostgreSQL")]
        WS["WebSocket<br/>(Chat + Notifications)"]
    end

    Web --> API
    Mobile --> API
    API --> AUTH
    AUTH --> BL
    BL --> SRV
    SRV --> DB
    SRV --> WS
    WS --> Mobile
```

---

## 4. Phased Implementation Roadmap

```mermaid
gantt
    title Forge Development Roadmap
    dateFormat YYYY-MM-DD
    axisFormat %b %Y

    section Phase 1 — Web MVP
    Project Setup & Design System          :p1a, 2026-03-05, 7d
    Auth + Onboarding (all roles, web)     :p1b, after p1a, 5d
    Owner Dashboard + Analytics            :p1c, after p1b, 10d
    Trainer Module (web prototype)         :p1d, after p1b, 10d
    Member Module (web prototype)          :p1e, after p1b, 10d
    Gamification + Leaderboard             :p1f, after p1e, 5d
    Testing + Polish                       :p1g, after p1f, 5d

    section Phase 2 — Mobile Apps
    React Native project setup             :p2a, after p1g, 5d
    Trainer App (native)                   :p2b, after p2a, 15d
    Member App (native + QR)               :p2c, after p2a, 15d
    Push Notifications integration         :p2d, after p2c, 5d
    App Store submission                   :p2e, after p2d, 7d

    section Phase 3 — Advanced
    AI Recommendation Engine               :p3a, after p2e, 10d
    Body Composition Tracking              :p3b, after p3a, 10d
    NFC Attendance                         :p3c, after p3b, 5d
    Wearable Integration                   :p3d, after p3c, 10d
```

### Phase Breakdown

| Phase | Duration | Deliverables |
|---|---|---|
| **Phase 1: Web MVP** | ~6 weeks | Full Owner dashboard, functional Trainer & Member modules in web (usable immediately; serves as prototype for mobile) |
| **Phase 2: Mobile Apps** | ~6 weeks | Native Trainer & Member apps with camera, QR, push notifications. Owner continues on web. |
| **Phase 3: Advanced** | ~5 weeks | AI engine, body composition, NFC, wearables |

> [!TIP]
> **Phase 1 doubles as a prototype.** By building all three modules as a web app first, you validate every user flow before investing in native mobile. The Owner module stays as web permanently; Trainer & Member modules graduate to native apps in Phase 2.

---

## 5. Tech Stack Mapping

| Layer | Owner (Web) | Trainer (Mobile) | Member (Mobile) | Shared |
|---|---|---|---|---|
| **Framework** | React (Vite) | React Native | React Native | — |
| **UI Library** | Custom CSS | React Native Paper | React Native Paper | Design tokens |
| **Navigation** | React Router | React Navigation | React Navigation | — |
| **State** | Context + useReducer | Context + useReducer | Context + useReducer | Same patterns |
| **API Client** | Fetch / Axios | Fetch / Axios | Fetch / Axios | Same service layer |
| **Charts** | Recharts | Victory Native | Victory Native | — |
| **Camera** | — | react-native-camera | react-native-camera | — |
| **QR/NFC** | — | react-native-qrcode | react-native-qrcode | — |
| **Push** | — | Firebase FCM | Firebase FCM | — |
| **Backend** | Node.js + Express | ← same | ← same | PostgreSQL, Redis |

### Code Sharing Strategy

```mermaid
pie title Code Sharing Breakdown
    "Shared Business Logic" : 35
    "Shared API Layer" : 20
    "Shared Types/Models" : 10
    "Web-Specific UI" : 15
    "Mobile-Specific UI" : 20
```

~65% of non-UI code is shared across platforms via a common `packages/shared` module.

---

## 6. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Mobile development delays | Medium | High | Phase 1 web app covers all roles as fallback |
| App store rejection | Low | Medium | Follow guidelines strictly; no restricted APIs |
| Code drift between web & mobile | Medium | Medium | Shared package for business logic, types, API |
| Owner wants mobile access | Low | Low | PWA wrapper or responsive web as bridge |
| Trainer prefers web on tablet | Low | Low | React Native works on tablets natively |

---

## 7. Cost Comparison (Estimated)

| Approach | Dev Time | Relative Cost | User Satisfaction |
|---|---|---|---|
| **Web Only** | 6-8 weeks | 💰 Low | ⭐⭐⭐ (Owners happy, others limited) |
| **Mobile Only** | 10-14 weeks | 💰💰💰 High | ⭐⭐⭐ (Trainers/Members happy, Owner cramped) |
| **Hybrid Split** ✅ | 12-16 weeks | 💰💰 Medium | ⭐⭐⭐⭐⭐ (Everyone gets ideal platform) |

> [!NOTE]
> The hybrid approach costs ~30% more than web-only but delivers significantly better UX for Trainers and Members — who are 90% of your daily active users.

---

## 8. Recommendation Summary

```mermaid
graph TD
    A["Start with Phase 1:<br/>Web MVP for ALL roles"] --> B{"Validate flows<br/>& get user feedback"}
    B --> C["Phase 2: Build native<br/>Trainer + Member apps"]
    C --> D["Owner stays on Web<br/>(full dashboard power)"]
    C --> E["Trainer/Member graduate<br/>to mobile (native power)"]
    D --> F["🎯 Each role gets<br/>their ideal platform"]
    E --> F

    style A fill:#1A1A1A,stroke:#F59E0B,color:#F5F5F5
    style F fill:#22C55E,stroke:#15803D,color:#000
```

**Build web first for speed. Migrate Trainer/Member to mobile for quality. Keep Owner on web forever.** This is the most cost-effective path that maximizes user satisfaction across all three roles.
