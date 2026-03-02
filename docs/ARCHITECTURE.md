# AgentricAI-planner Architecture

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       AgentricAI-planner (PWA)                           │
│                                                                          │
│  ┌─────────────────────────┐          ┌─────────────────────────┐        │
│  │   Student Explorer       │          │   Caregiver Studio       │        │
│  │   (Private View)         │          │   (Filtered View)        │        │
│  │                         │          │                         │        │
│  │  ┌───────────────────┐  │          │  ┌───────────────────┐  │        │
│  │  │  Daily Schedule    │  │          │  │  Progress Reports  │  │        │
│  │  │  ┌──┐ ┌──┐ ┌──┐   │  │          │  │  Engagement: 87%   │  │        │
│  │  │  │📖│ │🔢│ │🎨│   │  │          │  │  Completion: 92%   │  │        │
│  │  │  └──┘ └──┘ └──┘   │  │          │  │  Focus: 78%        │  │        │
│  │  └───────────────────┘  │          │  └───────────────────┘  │        │
│  │                         │          │                         │        │
│  │  ┌───────────────────┐  │          │  ┌───────────────────┐  │        │
│  │  │  Activity View     │  │          │  │  AI Insights       │  │        │
│  │  │  (Full Screen)     │  │          │  │  (Agent-Sourced)   │  │        │
│  │  │                   │  │          │  │                   │  │        │
│  │  │  Canvas / Input    │  │          │  │  Breakthroughs     │  │        │
│  │  │  Text-to-Speech    │  │          │  │  Adaptations       │  │        │
│  │  │  AI Feedback       │  │          │  │  Milestones        │  │        │
│  │  └───────────────────┘  │          │  └───────────────────┘  │        │
│  │                         │          │                         │        │
│  │  ┌───────────────────┐  │          │  ┌───────────────────┐  │        │
│  │  │  Hive Indicator    │  │          │  │  Agent Hive View   │  │        │
│  │  │  🟢 6/6 Active     │  │          │  │  Full Dashboard    │  │        │
│  │  └───────────────────┘  │          │  └───────────────────┘  │        │
│  └────────────┬────────────┘          └────────────┬────────────┘        │
│               │                                    │                     │
│               └────────────────┬───────────────────┘                     │
│                                │                                         │
│                    ┌───────────▼───────────┐                             │
│                    │                       │                             │
│                    │     AGENT HIVE        │                             │
│                    │                       │                             │
│                    │  ┌─────────────────┐  │                             │
│                    │  │ 🎯 Orchestrator  │  │                             │
│                    │  │  • Schedule Seq  │  │                             │
│                    │  │  • Agent Sync    │  │                             │
│                    │  └─────────────────┘  │                             │
│                    │  ┌─────────────────┐  │                             │
│                    │  │ 📚 Curriculum    │  │                             │
│                    │  │  • Lesson Asm    │  │                             │
│                    │  │  • Content Cur   │  │                             │
│                    │  │  • Prereq Map    │  │                             │
│                    │  └─────────────────┘  │                             │
│                    │  ┌─────────────────┐  │                             │
│                    │  │ 🔍 Analyst       │  │                             │
│                    │  │  • Pattern Rec   │  │                             │
│                    │  │  • Engage Score  │  │                             │
│                    │  └─────────────────┘  │                             │
│                    │  ┌─────────────────┐  │                             │
│                    │  │ 💬 Communicator  │  │                             │
│                    │  │  • Symbol Exp    │  │                             │
│                    │  │  • Sentence Scf  │  │                             │
│                    │  └─────────────────┘  │                             │
│                    │  ┌─────────────────┐  │                             │
│                    │  │ ⚙️ Adapter       │  │                             │
│                    │  │  • Diff Calib    │  │                             │
│                    │  │  • Theme Pers    │  │                             │
│                    │  │  • Pacing Ctrl   │  │                             │
│                    │  └─────────────────┘  │                             │
│                    │  ┌─────────────────┐  │                             │
│                    │  │ 🛡️ Guardian      │  │                             │
│                    │  │  • Data Encrypt  │  │  ◄── ALWAYS MONITORING     │
│                    │  │  • Access Gate   │  │                             │
│                    │  └─────────────────┘  │                             │
│                    │                       │                             │
│                    └───────────┬───────────┘                             │
│                                │                                         │
│           ┌────────────────────┼────────────────────┐                    │
│           │                    │                    │                    │
│           ▼                    ▼                    ▼                    │
│    ┌────────────┐    ┌──────────────┐    ┌──────────────────┐           │
│    │  IndexedDB   │    │  Data Store  │    │   LLM Service    │           │
│    │  (On-Device) │    │  (Runtime)   │    │   (API Client)   │           │
│    │              │    │              │    │                  │           │
│    │  6 Stores:   │    │  State Mgmt  │    │  generateText()  │           │
│    │  • profiles  │    │  Persistence │    │  generateChat()  │           │
│    │  • sessions  │    │  CRUD Ops    │    │  checkConnection │           │
│    │  • interact  │    │  Agent Defs  │    │  getModels()     │           │
│    │  • curricul  │    │              │    │                  │           │
│    │  • insights  │    │              │    │                  │           │
│    │  • metrics   │    │              │    │                  │           │
│    └────────────┘    └──────────────┘    └────────┬─────────┘           │
│                                                   │                     │
└───────────────────────────────────────────────────┼─────────────────────┘
                                                    │
                                        ┌───────────▼───────────┐
                                        │                       │
                                        │ AgentricAI-IED-ollama │
                                        │  (localhost:11434)     │
                                        │                       │
                                        │  Ollama REST API      │
                                        │  AgentricAIcody:latest│
                                        │                       │
                                        │  POST /api/generate   │
                                        │  POST /api/chat       │
                                        │  GET  /api/tags       │
                                        │                       │
                                        └───────────────────────┘
```

## Component Dependency Graph

```
App.tsx
├── ProfileSetup.tsx          (first-run only)
├── LandingPage.tsx           (dual-portal entry)
├── StudentMode.tsx           (private learning experience)
│   ├── ActivityCard.tsx      (task tiles)
│   └── ActivityView.tsx      (full-screen activity modal)
│       └── llmService.ts     (AI feedback, music generation)
└── CaregiverMode.tsx         (filtered caregiver dashboard)
    └── AgentHive.tsx          (agent visualization)

Services (shared):
├── llmService.ts             (AgentricAI-IED-ollama API client)
├── database.ts               (IndexedDB abstraction)
└── dataStore.ts              (runtime state + persistence)
```

## Data Flow Patterns

### Pattern 1: Student Task Execution

```
User clicks ActivityCard
        │
        ▼
StudentMode.activateHive()
        │
        ├──→ Sets all 5 agents to 'engaged'
        ├──→ Guardian remains 'monitoring'
        │
        ▼
ActivityView renders full-screen modal
        │
        ├──→ Reading: Web Speech API (text-to-speech)
        ├──→ Math: Number input with validation
        ├──→ Art: Canvas API (touch + mouse drawing)
        ├──→ Writing: Canvas + textarea split view
        ├──→ Play: llmService.generateText() for music
        ├──→ Social Studies: Content display
        │
        ▼
User clicks "I'm Finished!"
        │
        ├──→ dataStore.recordInteraction() — saves to IndexedDB
        ├──→ dataStore.updateTask() — marks task complete
        ├──→ llmService.generateText() — AI feedback prompt
        │
        ▼
ActivityView shows feedback
        │
        ▼
User clicks "Continue"
        │
        ├──→ StudentMode.deactivateHive()
        ├──→ All agents return to 'awaiting'
        ├──→ Guardian remains 'monitoring'
        │
        ▼
Schedule updates, next task ready
```

### Pattern 2: Caregiver Data Access

```
Caregiver enters Studio Mode
        │
        ▼
CaregiverMode loads from dataStore
        │
        ├──→ dataStore.getProfile() — student summary (filtered)
        ├──→ dataStore.getMetrics() — aggregated progress data
        ├──→ dataStore.getInsights() — AI-generated summaries
        ├──→ dataStore.getFrameworks() — curriculum frameworks
        │
        ▼
Dashboard renders filtered, AI-summarized data
        │
        ├──→ Overview: Charts and metrics (no raw interaction data)
        ├──→ Insights: Agent-attributed observations
        ├──→ Curriculum: Framework management
        ├──→ Agent Hive: Agent status and data flow
        │
        ▼
Caregiver NEVER sees:
  ✗ Raw interaction timestamps
  ✗ Individual button presses
  ✗ Canvas drawings
  ✗ Typing content
  ✗ Real-time student screen
```

### Pattern 3: Schedule Generation

```
dataStore.generateSchedule(profile)
        │
        ▼
Builds prompt with student profile data:
  • Name, age, grade level
  • Learning style
  • Communication mode & level
        │
        ▼
llmService.generateText(prompt)
        │
        ▼
POST http://localhost:11434/api/generate
  {
    model: "AgentricAIcody:latest",
    prompt: "Generate a daily schedule...",
    stream: false
  }
        │
        ▼
AgentricAI-IED-ollama processes request
        │
        ▼
Response parsed into PlannerTask[] objects
        │
        ▼
dataStore.saveSchedule(tasks)
        │
        ▼
database.put('sessions', tasks)
        │
        ▼
IndexedDB stores encrypted on-device
```

## IndexedDB Schema

```
AgentricAI-planner (IndexedDB Database)
│
├── profiles (Object Store)
│   └── Key: id (string)
│   └── Value: {
│         id, name, avatar, age, gradeLevel,
│         learningStyle, communicationMode,
│         communicationLevel, createdAt, updatedAt
│       }
│
├── sessions (Object Store)
│   └── Key: id (string)
│   └── Value: {
│         id, name, type, icon, status, engagement,
│         difficulty, time, duration, content: {
│           title, body
│         }
│       }
│
├── interactions (Object Store)
│   └── Key: id (string)
│   └── Value: {
│         id, taskId, taskType, startedAt, completedAt,
│         duration, engagementLevel, metadata
│       }
│
├── curriculum (Object Store)
│   └── Key: id (string)
│   └── Value: {
│         id, name, description, goals[], status,
│         aiAdaptationNotes, createdAt, updatedAt
│       }
│
├── insights (Object Store)
│   └── Key: id (string)
│   └── Value: {
│         id, type, title, description, agentSource,
│         impactScore, createdAt
│       }
│
└── metrics (Object Store)
    └── Key: id (string)
    └── Value: {
          progressMetrics: { engagement, completion, focus, communication },
          weeklyData: [{ day, engagement, tasks }],
          skillProgress: [{ skill, current, target }]
        }
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    TRUST BOUNDARY                            │
│                                                             │
│  ┌───────────────┐                                          │
│  │ 🛡️ Guardian    │ ◄── Always MONITORING                   │
│  │               │                                          │
│  │  Action 1:    │     ┌──────────────────────────┐         │
│  │  Data         │────►│  ALL writes to IndexedDB  │         │
│  │  Encryption   │     │  pass through Guardian    │         │
│  │               │     └──────────────────────────┘         │
│  │  Action 2:    │     ┌──────────────────────────┐         │
│  │  Access       │────►│  Student view ≠ Caregiver │         │
│  │  Gating       │     │  view. Data is filtered.  │         │
│  │               │     └──────────────────────────┘         │
│  └───────────────┘                                          │
│                                                             │
│  What Guardian enforces:                                     │
│  ✓ All interaction data encrypted before IndexedDB write     │
│  ✓ Caregiver view receives AI-filtered summaries only        │
│  ✓ No raw student data leaves the device                     │
│  ✓ No external network requests for data storage             │
│  ✓ Profile data only accessible after initial setup          │
│                                                             │
│  What Guardian does NOT do:                                  │
│  ✗ Does not transmit data externally                         │
│  ✗ Does not log to remote servers                            │
│  ✗ Does not share data with third parties                    │
│  ✗ Does not allow advertisement tracking                     │
│  ✗ Never enters idle/awaiting state                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
