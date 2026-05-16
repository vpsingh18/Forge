# Forge — Application Synopsis & Use Cases

## 1. Executive Summary

**Forge** is a role-based gym management platform designed to streamline gym operations for **Owners**, empower **Trainers** to deliver personalized fitness programs, and keep **Members** engaged through gamified workout tracking. The app follows a minimalistic design philosophy — every feature is purposeful, every interaction is fast, and every insight is actionable.

### Target Users
| Role | Who They Are | Primary Need |
|---|---|---|
| **Owner** | Gym founders, managers, franchise operators | Business visibility, revenue control, member retention |
| **Trainer** | Personal trainers, group class instructors | Client management, plan customization, progress tracking |
| **Member** | Gym-goers (regular & PT clients) | Workout tracking, motivation, attendance convenience |

---

## 2. System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        OW["🖥️ Owner Dashboard<br/>(Web App)"]
        TR["📱 Trainer App<br/>(Mobile)"]
        MB["📱 Member App<br/>(Mobile)"]
    end

    subgraph API["API Gateway & Services"]
        AUTH["🔐 Auth Service"]
        USER_SVC["👤 User Service"]
        WORKOUT["🏋️ Workout Service"]
        DIET["🥗 Diet Service"]
        ATTEND["📋 Attendance Service"]
        NOTIFY["🔔 Notification Service"]
        ANALYTICS["📊 Analytics Service"]
        MSG["💬 Messaging Service"]
        GAMIFY["🏆 Gamification Service"]
    end

    subgraph Data["Data Layer"]
        DB[("🗄️ Database")]
        CACHE["⚡ Cache"]
        STORAGE["📁 File Storage<br/>(Photos)"]
    end

    OW --> AUTH
    TR --> AUTH
    MB --> AUTH
    AUTH --> USER_SVC
    OW --> ANALYTICS
    OW --> NOTIFY
    TR --> WORKOUT
    TR --> DIET
    TR --> USER_SVC
    MB --> WORKOUT
    MB --> ATTEND
    MB --> GAMIFY
    MB --> MSG
    TR --> MSG
    WORKOUT --> DB
    DIET --> DB
    ATTEND --> DB
    ANALYTICS --> DB
    GAMIFY --> DB
    MSG --> DB
    USER_SVC --> DB
    USER_SVC --> STORAGE
    ANALYTICS --> CACHE
```

---

## 3. Data Model (Entity Relationship)

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email
        string phone
        enum role "owner|trainer|member"
        string profilePhoto
        date createdAt
    }

    GYM {
        string id PK
        string name
        string ownerId FK
        string address
        string qrSecret
    }

    MEMBERSHIP {
        string id PK
        string memberId FK
        string gymId FK
        enum type "regular|pt"
        date startDate
        date endDate
        enum status "active|expired|pending"
        float amountPaid
    }

    TRAINER_ASSIGNMENT {
        string id PK
        string trainerId FK
        string memberId FK
        string gymId FK
        date assignedDate
    }

    WORKOUT_PLAN {
        string id PK
        string trainerId FK
        string memberId FK
        string name
        json exercises
        date createdAt
    }

    WORKOUT_LOG {
        string id PK
        string memberId FK
        string planId FK
        date logDate
        json completedExercises
        float totalCaloriesBurnt
    }

    DIET_PLAN {
        string id PK
        string trainerId FK
        string memberId FK
        json meals
        float targetCalories
        date createdAt
    }

    ATTENDANCE {
        string id PK
        string memberId FK
        string gymId FK
        datetime checkIn
        datetime checkOut
        enum method "qr|nfc|manual"
    }

    NOTIFICATION {
        string id PK
        string recipientId FK
        string title
        string body
        enum type "renewal|update|challenge"
        boolean read
        date sentAt
    }

    MESSAGE {
        string id PK
        string senderId FK
        string receiverId FK
        string content
        datetime sentAt
    }

    BADGE {
        string id PK
        string memberId FK
        string name
        string icon
        date earnedAt
    }

    CHALLENGE {
        string id PK
        string gymId FK
        string title
        string metric
        date startDate
        date endDate
    }

    PAYMENT {
        string id PK
        string membershipId FK
        float amount
        enum status "paid|pending|overdue"
        date dueDate
        date paidDate
    }

    USER ||--o{ MEMBERSHIP : "has"
    USER ||--o{ TRAINER_ASSIGNMENT : "assigned"
    USER ||--o{ WORKOUT_PLAN : "receives"
    USER ||--o{ WORKOUT_LOG : "logs"
    USER ||--o{ DIET_PLAN : "follows"
    USER ||--o{ ATTENDANCE : "checks in"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ MESSAGE : "sends/receives"
    USER ||--o{ BADGE : "earns"
    GYM ||--o{ MEMBERSHIP : "enrolls"
    GYM ||--o{ ATTENDANCE : "records"
    GYM ||--o{ CHALLENGE : "hosts"
    MEMBERSHIP ||--o{ PAYMENT : "generates"
    WORKOUT_PLAN ||--o{ WORKOUT_LOG : "references"
    TRAINER_ASSIGNMENT }o--|| USER : "trainer"
    TRAINER_ASSIGNMENT }o--|| USER : "member"
```

---

## 4. Use Case Diagrams

### 4.1 Owner Use Cases

```mermaid
graph LR
    OWNER(("👔 Owner"))

    OWNER --> UC1["View Business Dashboard<br/>(KPI, Revenue, Active Members)"]
    OWNER --> UC2["Manage Memberships<br/>(Add, Renew, Expire)"]
    OWNER --> UC3["Manage Trainers<br/>(Add, Remove, View Performance)"]
    OWNER --> UC4["View Payment Analytics<br/>(Revenue, Overdue, Trends)"]
    OWNER --> UC5["Send Push Notifications<br/>(Announcements, Renewals)"]
    OWNER --> UC6["View Class/Slot Utilization"]
    OWNER --> UC7["Manage Facility Info<br/>(Hours, Equipment, Rules)"]
    OWNER --> UC8["Generate Reports<br/>(Monthly, Quarterly)"]
    OWNER --> UC9["Create Fitness Challenges"]

    style OWNER fill:#F59E0B,stroke:#B45309,color:#000
```

### 4.2 Trainer Use Cases

```mermaid
graph LR
    TRAINER(("🏋️ Trainer"))

    TRAINER --> TC1["View Assigned Clients"]
    TRAINER --> TC2["Add/Edit Member Profiles"]
    TRAINER --> TC3["Create Workout Plans<br/>(Exercise, Sets, Reps, Schedule)"]
    TRAINER --> TC4["Create Diet Charts<br/>(PT Members Only)"]
    TRAINER --> TC5["Track Client Progress<br/>(Photos + Measurements,<br/>PT Members Only)"]
    TRAINER --> TC6["View Member Attendance"]
    TRAINER --> TC7["Assign Daily Workouts"]
    TRAINER --> TC8["Message Members"]
    TRAINER --> TC9["View Own Performance Stats"]

    style TRAINER fill:#22C55E,stroke:#15803D,color:#000
```

### 4.3 Member Use Cases

```mermaid
graph LR
    MEMBER(("🙋 Member"))

    MEMBER --> MC1["View Personal Dashboard<br/>(Today's Plan, Streaks, Badges)"]
    MEMBER --> MC2["Log Workout<br/>(Mark Exercises Complete)"]
    MEMBER --> MC3["View Calories Burnt<br/>(Per Exercise Breakdown)"]
    MEMBER --> MC4["View Diet Plan<br/>(PT Members Only)"]
    MEMBER --> MC5["QR Code Check-in"]
    MEMBER --> MC6["View Attendance History"]
    MEMBER --> MC7["Receive Notifications<br/>(Renewals, Trainer Updates)"]
    MEMBER --> MC8["View Leaderboard"]
    MEMBER --> MC9["Participate in Challenges"]
    MEMBER --> MC10["Message Trainer"]

    style MEMBER fill:#3B82F6,stroke:#1D4ED8,color:#FFF
```

---

## 5. Core User Flows

### 5.1 Member Daily Workout Flow

```mermaid
flowchart TD
    A["Member Opens App"] --> B["Dashboard loads:<br/>Today's Workout + Streak"]
    B --> C{"Has workout plan<br/>assigned?"}
    C -- Yes --> D["View Exercise List<br/>with sets, reps, rest"]
    C -- No --> E["Show 'No plan assigned'<br/>+ encourage gym visit"]
    D --> F["Start Workout Session"]
    F --> G["Mark exercises as<br/>completed one by one"]
    G --> H["System calculates<br/>calories burnt per exercise"]
    H --> I["Session Complete<br/>✅ Summary Card"]
    I --> J{"Streak milestone<br/>reached?"}
    J -- Yes --> K["🏅 Badge Unlocked!<br/>+ Animation"]
    J -- No --> L["Update streak counter"]
    K --> L
    L --> M["Leaderboard points<br/>updated"]

    style A fill:#1A1A1A,stroke:#F59E0B,color:#F5F5F5
    style I fill:#22C55E,stroke:#15803D,color:#000
    style K fill:#F59E0B,stroke:#B45309,color:#000
```

### 5.2 Trainer Creating a Workout Plan

```mermaid
flowchart TD
    A["Trainer opens<br/>Client List"] --> B["Select a Client"]
    B --> C["View Client Profile<br/>(Age, Weight, Goal, History)"]
    C --> D["Tap 'Create Workout Plan'"]
    D --> E["Choose workout split<br/>(Push/Pull/Legs, Full Body, etc.)"]
    E --> F["Pick exercises from<br/>categorized library"]
    F --> G["Set: Reps, Sets, Rest,<br/>Tempo per exercise"]
    G --> H["Assign to days<br/>(Mon-Sun schedule)"]
    H --> I["Preview & Save Plan"]
    I --> J["Member receives<br/>push notification"]
    J --> K["Plan appears in<br/>Member Dashboard"]

    style A fill:#1A1A1A,stroke:#22C55E,color:#F5F5F5
    style K fill:#3B82F6,stroke:#1D4ED8,color:#FFF
```

### 5.3 QR Attendance Check-in Flow

```mermaid
flowchart LR
    A["Member arrives<br/>at gym"] --> B["Opens app →<br/>Attendance tab"]
    B --> C["Unique QR code<br/>displayed on screen"]
    C --> D["Staff/Kiosk scans<br/>QR code"]
    D --> E["System records<br/>check-in timestamp"]
    E --> F["Confirmation<br/>shown on phone"]
    F --> G["Attendance streak<br/>updated"]

    style C fill:#F59E0B,stroke:#B45309,color:#000
    style F fill:#22C55E,stroke:#15803D,color:#000
```

### 5.4 Owner Revenue Analytics Flow

```mermaid
flowchart TD
    A["Owner opens<br/>Dashboard"] --> B["KPI cards load:<br/>Revenue, Members, Renewals"]
    B --> C["Tap 'Revenue'<br/>for detailed view"]
    C --> D["Charts shown:<br/>Monthly revenue trend,<br/>Payment breakdown"]
    D --> E["Filter by:<br/>Date range, Plan type,<br/>Payment status"]
    E --> F{"Overdue payments<br/>detected?"}
    F -- Yes --> G["View overdue list<br/>→ Send reminder notification"]
    F -- No --> H["Export report<br/>(if needed)"]

    style A fill:#1A1A1A,stroke:#F59E0B,color:#F5F5F5
    style G fill:#EF4444,stroke:#B91C1C,color:#FFF
```

---

## 6. Module Feature Matrix

| Feature | Owner | Trainer | Member (Regular) | Member (PT) |
|---|:---:|:---:|:---:|:---:|
| Business Dashboard | ✅ | — | — | — |
| Member Directory | ✅ | ✅ (assigned only) | — | — |
| Trainer Directory | ✅ | — | — | — |
| Payment Analytics | ✅ | — | — | — |
| Push Notifications (Send) | ✅ | — | — | — |
| Facility Management | ✅ | — | — | — |
| Workout Plan Builder | — | ✅ | — | — |
| Diet Chart Builder | — | ✅ (PT clients) | — | — |
| Progress Tracker | — | ✅ (PT clients) | — | — |
| Client Attendance View | — | ✅ | — | — |
| Personal Dashboard | — | — | ✅ | ✅ |
| Workout Log | — | — | ✅ | ✅ |
| Calories Burnt Card | — | — | ✅ | ✅ |
| Diet Plan Viewer | — | — | — | ✅ |
| QR Check-in | — | — | ✅ | ✅ |
| Attendance History | — | — | ✅ | ✅ |
| Leaderboard | — | — | ✅ | ✅ |
| Challenges | — | — | ✅ | ✅ |
| Streaks & Badges | — | — | ✅ | ✅ |
| In-App Messaging | — | ✅ | ✅ | ✅ |
| Notifications (Receive) | — | ✅ | ✅ | ✅ |

---

## 7. Gamification System

```mermaid
graph TD
    subgraph Triggers["🎯 Point Triggers"]
        T1["Log a workout → +10 pts"]
        T2["Check-in at gym → +5 pts"]
        T3["Complete weekly plan → +50 pts"]
        T4["Win a challenge → +100 pts"]
        T5["Refer a friend → +75 pts"]
    end

    subgraph Badges["🏅 Badge Milestones"]
        B1["🔥 First Flame — 3-day streak"]
        B2["⚡ Iron Week — 7-day streak"]
        B3["💪 Forge Master — 30-day streak"]
        B4["🏆 Champion — Win a challenge"]
        B5["👑 Century — 100 workouts logged"]
    end

    subgraph Rewards["🎁 Rewards"]
        R1["Leaderboard rank"]
        R2["Profile badge display"]
        R3["Trainer spotlight feature"]
    end

    Triggers --> |"accumulates"| Rewards
    Triggers --> |"unlocks"| Badges
```

---

## 8. Notification System Map

```mermaid
flowchart LR
    subgraph Sources["Notification Sources"]
        S1["Membership expiring<br/>(7d, 3d, 1d before)"]
        S2["New workout plan<br/>assigned by trainer"]
        S3["Owner broadcast<br/>(announcement)"]
        S4["Challenge starting/ending"]
        S5["Badge unlocked"]
        S6["Streak at risk<br/>(missed a day)"]
        S7["New message<br/>from trainer"]
    end

    subgraph Delivery["Delivery Channel"]
        D1["📱 Push Notification"]
        D2["🔔 In-App Feed"]
    end

    S1 --> D1
    S1 --> D2
    S2 --> D1
    S2 --> D2
    S3 --> D1
    S3 --> D2
    S4 --> D2
    S5 --> D1
    S5 --> D2
    S6 --> D1
    S7 --> D1
    S7 --> D2
```

---

## 9. Calorie Estimation Logic

The **Calories Burnt** card uses the standard **MET (Metabolic Equivalent of Task)** formula:

> **Calories = MET × Weight (kg) × Duration (hours)**

| Exercise | MET Value | Example (75 kg, 30 min) |
|---|:---:|:---:|
| Bench Press | 6.0 | 225 kcal |
| Squats | 5.5 | 206 kcal |
| Deadlifts | 6.0 | 225 kcal |
| Running (treadmill) | 9.8 | 368 kcal |
| Cycling (stationary) | 7.0 | 263 kcal |
| Yoga | 3.0 | 113 kcal |
| Jump Rope | 12.3 | 461 kcal |
| Plank (static) | 3.8 | 143 kcal |

This is calculated automatically per exercise when a member logs their workout, and summed into a daily total on the dashboard.

---

## 10. Deployment Topology (Future State)

```mermaid
graph TB
    subgraph Mobile["Mobile Apps"]
        IOS["📱 iOS App<br/>(React Native)"]
        AND["📱 Android App<br/>(React Native)"]
    end

    subgraph Web["Web Application"]
        OWNER_WEB["🖥️ Owner Dashboard<br/>(React SPA)"]
    end

    subgraph Cloud["Cloud Infrastructure"]
        LB["Load Balancer"]
        API1["API Server 1"]
        API2["API Server 2"]
        WS["WebSocket Server<br/>(Messaging)"]
        DB[("PostgreSQL")]
        REDIS["Redis Cache"]
        S3["Object Storage<br/>(Photos, Media)"]
        PUSH["Push Notification<br/>Service"]
    end

    IOS --> LB
    AND --> LB
    OWNER_WEB --> LB
    LB --> API1
    LB --> API2
    LB --> WS
    API1 --> DB
    API2 --> DB
    API1 --> REDIS
    API2 --> REDIS
    API1 --> S3
    API1 --> PUSH
    WS --> REDIS
```
