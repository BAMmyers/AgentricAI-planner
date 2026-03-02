<p align="center">
  <img src="https://img.shields.io/badge/AgentricAI-planner-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6Ii8+PC9zdmc+&logoColor=white" alt="AgentricAI-planner" />
</p>

<h1 align="center">🧠 AgentricAI-planner</h1>

<p align="center">
  <strong>A Fully Autonomous, AI-Driven Adaptive Learning Companion</strong><br/>
  Privacy-first · Agent hive architecture · Built for neurodiverse learners
</p>

<p align="center">
  <a href="https://github.com/BAMmyers/AgentricAI-IED-ollama"><img src="https://img.shields.io/badge/Backend-AgentricAI--IED--ollama-8b5cf6?style=flat-square&logo=github" alt="Backend" /></a>
  <a href="https://github.com/BAMmyers/AgentricAI_Studios"><img src="https://img.shields.io/badge/Part%20of-AgentricAI%20Studios-6366f1?style=flat-square&logo=github" alt="Studios" /></a>
  <img src="https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.1-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-7.2-646cff?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-Ready-10b981?style=flat-square" alt="PWA" />
  <img src="https://img.shields.io/badge/Privacy-By%20Architecture-f59e0b?style=flat-square" alt="Privacy" />
</p>

---

## Table of Contents

- [The Vision](#the-vision)
- [Architecture Overview](#architecture-overview)
- [Agent Hive System](#agent-hive-system)
- [The Dual-View Experience](#the-dual-view-experience)
- [Privacy by Architecture](#privacy-by-architecture)
- [Backend Driver: AgentricAI-IED-ollama](#backend-driver-agentricai-ied-ollama)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Data Flow](#data-flow)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## The Vision

AgentricAI-planner is the core engine of a profound and ambitious mission: to create a **fully autonomous, AI-driven educational ecosystem** for children with unique learning needs — beginning with non-verbal autism.

This is not merely a tool. It is a dedicated, patient, and insightful digital companion that mathematically and directionally guides the user to enhance their educational and emotional well-being. The system is designed to operate with almost no direct human intervention in the day-to-day learning process.

The pushing force behind this creation is a deep-seated need to bridge the gap for children on the autism spectrum, providing them with a learning platform that truly **understands and adapts to them**.

### Core Principles

| Principle | Implementation |
|-----------|---------------|
| **Hyper-Adaptive** | Curriculum evolves in real-time based on every interaction |
| **Privacy-First** | All data encrypted on-device via IndexedDB — never transmitted externally |
| **Autonomous** | AI agents operate independently, no manual curriculum adjustments needed |
| **Accessible** | PWA built for iPad/Galaxy tablets — the devices AAC learners already use |
| **Co-Evolutionary** | The AI and student grow together in a symbiotic relationship |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    AgentricAI-planner (PWA)                       │
│                                                                  │
│  ┌───────────────────┐              ┌───────────────────┐        │
│  │  Student Explorer  │              │  Caregiver Studio  │        │
│  │    (Private)       │              │   (Filtered View)  │        │
│  │                   │              │                   │        │
│  │  - Daily Schedule │              │  - Progress Reports│        │
│  │  - Activity Cards │              │  - Curriculum Mgmt │        │
│  │  - Activity View  │              │  - AI Insights     │        │
│  │  - AI Feedback    │              │  - Agent Hive      │        │
│  └────────┬──────────┘              └────────┬──────────┘        │
│           │                                  │                   │
│           └──────────────┬───────────────────┘                   │
│                          │                                       │
│              ┌───────────▼───────────┐                           │
│              │     Agent Hive        │                           │
│              │   (6 Specialists)     │                           │
│              │                       │                           │
│              │  🎯 Orchestrator      │                           │
│              │  📚 Curriculum        │                           │
│              │  🔍 Analyst           │                           │
│              │  💬 Communicator      │                           │
│              │  ⚙️ Adapter           │                           │
│              │  🛡️ Guardian (Always) │                           │
│              └───────────┬───────────┘                           │
│                          │                                       │
│    ┌─────────────────────┼─────────────────────┐                 │
│    │                     │                     │                 │
│    ▼                     ▼                     ▼                 │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────┐        │
│  │ IndexedDB │    │  Data Store  │    │   LLM Service    │        │
│  │ (Local)   │    │  (Runtime)   │    │   (API Client)   │        │
│  └──────────┘    └──────────────┘    └────────┬─────────┘        │
│                                               │                  │
└───────────────────────────────────────────────┼──────────────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │ AgentricAI-IED-ollama │
                                    │   (localhost:11434)   │
                                    │                       │
                                    │  Local LLM Inference  │
                                    │  llama3.2 / custom    │
                                    └───────────────────────┘
```

---

## Agent Hive System

The heart of AgentricAI-planner is a **hive of 6 specialist agents**. Each agent has a rigid set of **2-3 expert actions** — no more, no less. They are not generalists. Each is a master of its narrow domain, and all operate simultaneously like cells in a hive.

### Agent State Model

Agents transition through three states based on user activity:

```
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │   AWAITING ──── user clicks activity ───→ ENGAGED    │
  │      ▲                                      │        │
  │      │                                      │        │
  │      └──── task completes ──────────────────┘        │
  │                                                      │
  │   MONITORING ──── Guardian only (never changes) ──── │
  │                                                      │
  └──────────────────────────────────────────────────────┘
```

| State | Visual | Meaning |
|-------|--------|---------|
| `awaiting` | 🟡 Amber | Active at station, ready for user stimulation |
| `engaged` | 🟢 Green | Actively processing a workflow task |
| `monitoring` | 🔵 Blue | Always watching, always protecting (Guardian only) |
| `processing` | 🟢 Green (pulse) | Brief computation burst |
| `error` | 🔴 Red | Something went wrong |

### The 6 Agents

#### 🎯 Orchestrator Agent
**Role:** Schedule & Sync Coordinator

| # | Action | Description |
|---|--------|-------------|
| 1 | **Schedule Sequencing** | Orders daily tasks for optimal learning flow |
| 2 | **Agent Synchronization** | Keeps all agents in sync with current state |

#### 📚 Curriculum Agent
**Role:** Lesson Assembly Specialist

| # | Action | Description |
|---|--------|-------------|
| 1 | **Lesson Assembly** | Builds complete lessons from content library |
| 2 | **Content Curation** | Selects age and level appropriate materials |
| 3 | **Prerequisite Mapping** | Ensures skills build on prior knowledge |

#### 🔍 Analyst Agent
**Role:** Behavioral Pattern Specialist

| # | Action | Description |
|---|--------|-------------|
| 1 | **Pattern Recognition** | Identifies learning and behavior patterns |
| 2 | **Engagement Scoring** | Calculates real-time engagement metrics |

#### 💬 Communicator Agent
**Role:** AAC & Language Specialist

| # | Action | Description |
|---|--------|-------------|
| 1 | **Symbol Expansion** | Introduces new AAC symbols contextually |
| 2 | **Sentence Scaffolding** | Builds sentence starters and supports |

#### ⚙️ Adapter Agent
**Role:** Difficulty & Personalization Tuner

| # | Action | Description |
|---|--------|-------------|
| 1 | **Difficulty Calibration** | Adjusts task difficulty based on performance |
| 2 | **Theme Personalization** | Applies preferred themes and interests |
| 3 | **Pacing Control** | Adjusts activity timing and transitions |

#### 🛡️ Guardian Agent
**Role:** Privacy & Encryption Enforcer — **ALWAYS MONITORING**

| # | Action | Description |
|---|--------|-------------|
| 1 | **Data Encryption** | Encrypts all sensitive interaction data |
| 2 | **Access Gating** | Controls data access between views |

> ⚠️ **The Guardian agent never leaves the `monitoring` state.** Security never sleeps. The child is always protected behind this wall.

### Hive Workflow Lifecycle

```
1. Application loads → All agents enter AWAITING state
                      → Guardian enters MONITORING state (always)

2. Student clicks an activity tile
   → Orchestrator: ENGAGED (synchronizes agents)
   → Curriculum:   ENGAGED (serves content)
   → Communicator: ENGAGED (scaffolds language)
   → Adapter:      ENGAGED (calibrates difficulty)
   → Analyst:      ENGAGED (begins scoring engagement)
   → Guardian:     MONITORING (encrypts all writes)

3. Student completes the activity
   → All agents return to AWAITING
   → Guardian remains MONITORING
   → Analyst records interaction metrics
   → Data persisted to encrypted IndexedDB

4. Hive returns to AWAITING → ready for next stimulation
```

---

## The Dual-View Experience

AgentricAI-planner enforces a **revolutionary privacy model** through two completely separate interfaces.

### 🎒 Student Explorer Mode (Private)

The student **only ever** interacts with Explorer mode — a clean, engaging, and non-intimidating daily schedule. This is their adaptive, AI-driven world.

**Features:**
- **Personalized greeting** with avatar and streak counter
- **Daily schedule** presented as horizontally-scrolling activity cards
- **Activity types:** Reading, Math, Art, Writing, Play, Social Studies, Communication, Movement, Break, Creative
- **Touch-optimized** activity cards with engagement color coding and difficulty stars
- **Full-screen activity modals** for immersive learning:
  - 📖 **Reading** — Text display with text-to-speech (Web Speech API)
  - 🔢 **Math** — Number input with large touch targets
  - 🎨 **Art** — Full canvas sketchpad (mouse + touch support)
  - ✍️ **Writing** — Split view with canvas sketchpad and text input
  - 🎮 **Play** — AI-generated music descriptions via LLM
  - 🌍 **Social Studies** — Content display
- **AI-generated feedback** after each activity completion
- **Hive status indicator** showing agent states in real-time
- **Progress bar** tracking daily completion

**Privacy guarantee:** Every interaction — every choice, every success, every hesitation — is processed exclusively by the onboard AI and encrypted locally. No external transmission. No outside observation.

### 📊 Caregiver Studio Mode (Filtered View)

The caregiver uses Studio mode for **high-level oversight only**. They never see the student's active screen or direct interactions.

**Tabs:**

| Tab | Purpose |
|-----|---------|
| **Overview** | Student summary, progress metrics (engagement, completion, focus, communication), weekly engagement charts (Recharts), skill progress bars |
| **AI Insights** | Agent-generated insights categorized as breakthroughs, adaptations, milestones, patterns, and recommendations — each attributed to the specific agent that produced it |
| **Curriculum** | Framework creation and management with AI adaptation notes — set goals, the agents do the rest |
| **Agent Hive** | Full hive visualization with expandable agent cells, per-action status indicators, data flow diagram, and backend driver status |

**Privacy guarantee:** The caregiver receives **AI-generated progress reports** — the AI acts as the trusted filter, translating raw private interaction data into high-level summaries of benchmarks reached, skills developed, and goals achieved.

---

## Privacy by Architecture

Privacy is not enforced by policy. It is enforced by **architecture**.

```
┌─────────────────────────────────────────────────────────┐
│                     ON-DEVICE ONLY                       │
│                                                         │
│   Student Interactions                                   │
│         │                                               │
│         ▼                                               │
│   ┌─────────────┐    ┌──────────────┐                   │
│   │ 🛡️ Guardian  │───→│  IndexedDB   │                   │
│   │  Encrypts    │    │  (Encrypted) │                   │
│   │  every write │    │              │                   │
│   └─────────────┘    │  Stores:     │                   │
│                      │  - Profiles  │                   │
│                      │  - Sessions  │                   │
│                      │  - Metrics   │                   │
│                      │  - Insights  │                   │
│                      │  - Curriculum│                   │
│                      │  - Interact. │                   │
│                      └──────────────┘                   │
│                                                         │
│   ✗ No external servers                                 │
│   ✗ No data transmission                                │
│   ✗ No third-party analytics                            │
│   ✗ No advertising                                      │
│   ✗ No financial obligation                             │
│                                                         │
│   ✓ All data on device                                  │
│   ✓ Guardian agent always monitoring                    │
│   ✓ Caregiver sees AI-filtered summaries only           │
│   ✓ Student interactions are completely private          │
└─────────────────────────────────────────────────────────┘
```

### IndexedDB Schema

| Store | Key | Contents |
|-------|-----|----------|
| `profiles` | `id` | Student profile (name, avatar, age, grade, learning style, communication mode/level) |
| `sessions` | `id` | Daily schedule tasks (type, content, status, engagement, difficulty) |
| `interactions` | `id` | Raw interaction records (task ID, duration, engagement, timestamps) |
| `curriculum` | `id` | Curriculum frameworks (goals, adaptation notes, active status) |
| `insights` | `id` | AI-generated insights (type, description, agent source, impact score) |
| `metrics` | `id` | Progress metrics (engagement, completion, focus, communication, weekly trends, skill progress) |

---

## Backend Driver: AgentricAI-IED-ollama

All AI intelligence is powered by **[AgentricAI-IED-ollama](https://github.com/BAMmyers/AgentricAI-IED-ollama)** — a local LLM inference engine running on the same device or local network.

**Repository:** [github.com/BAMmyers/AgentricAI-IED-ollama](https://github.com/BAMmyers/AgentricAI-IED-ollama.git)

### Connection Details

| Parameter | Value |
|-----------|-------|
| Endpoint | `http://localhost:11434` |
| Default Model | `llama3.2` |
| Timeout | `30000ms` |
| Protocol | Ollama REST API |

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/generate` | `POST` | Text generation (schedule, feedback, insights, music descriptions) |
| `/api/chat` | `POST` | Conversational interactions |
| `/api/tags` | `GET` | Connection health check and model listing |

### What the Backend Powers

| Feature | Agent | API Used |
|---------|-------|----------|
| **Daily schedule generation** | Orchestrator + Curriculum | `/api/generate` |
| **Activity feedback** | Analyst | `/api/generate` |
| **Progress insights** | Analyst + Adapter | `/api/generate` |
| **Music descriptions** (Play activity) | Communicator | `/api/generate` |
| **Content curation** | Curriculum | `/api/generate` |

### Offline Behavior

When AgentricAI-IED-ollama is not running:
- The application operates in **local-only mode** using persisted data from IndexedDB
- Previously generated schedules, insights, and metrics remain available
- New AI-generated content (schedules, feedback, insights) will display appropriate connection status messaging
- The UI clearly indicates backend status with visual indicators

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.3 | UI framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.2.4 | Build tooling |
| **Tailwind CSS** | 4.1.17 | Styling |
| **Recharts** | 3.7.0 | Data visualization (progress charts) |
| **Lucide React** | 0.576.0 | Icon library |
| **clsx + tailwind-merge** | 2.1.1 / 3.4.0 | Conditional class merging |
| **IndexedDB** | Native | On-device encrypted storage |
| **Web Speech API** | Native | Text-to-speech for reading activities |
| **Canvas API** | Native | Drawing/sketchpad for art and writing |
| **Ollama REST API** | External | LLM inference via AgentricAI-IED-ollama |

---

## Project Structure

```
AgentricAI-planner/
├── index.html                          # PWA entry point (AAC meta tags)
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite + Tailwind + SingleFile plugin
│
├── src/
│   ├── main.tsx                        # React DOM entry point
│   ├── App.tsx                         # Root component — initialization, routing, state
│   ├── index.css                       # Tailwind imports, custom theme, animations
│   ├── types.ts                        # Complete TypeScript type definitions
│   │
│   ├── components/
│   │   ├── LandingPage.tsx             # Dual-portal entry (Student / Caregiver)
│   │   ├── ProfileSetup.tsx            # First-time student onboarding (3-step wizard)
│   │   ├── StudentMode.tsx             # Explorer mode — schedule, hive state, task flow
│   │   ├── CaregiverMode.tsx           # Studio mode — metrics, insights, curriculum, hive
│   │   ├── ActivityCard.tsx            # Schedule task card (touch-optimized, AAC-ready)
│   │   ├── ActivityView.tsx            # Full-screen activity modal (6 activity types)
│   │   └── AgentHive.tsx               # Hive visualization (agents, data flow, backend)
│   │
│   ├── services/
│   │   ├── llmService.ts              # AgentricAI-IED-ollama API client
│   │   ├── database.ts                # IndexedDB service (6 object stores)
│   │   └── dataStore.ts               # Runtime data layer — agent definitions, persistence
│   │
│   └── utils/
│       └── cn.ts                       # clsx + tailwind-merge utility
│
└── README.md                           # This file
```

### File Descriptions

#### Core Application

| File | Lines | Purpose |
|------|-------|---------|
| `App.tsx` | Entry point. Initializes IndexedDB and backend connection. Routes between Landing, Student, and Caregiver views. Manages profile state. Shows loading screen during initialization and ProfileSetup for first-time users. |
| `types.ts` | Complete type system. Defines `PlannerTask`, `StudentProfile`, `HiveAgent`, `AgentAction`, `BackendDriver`, `HiveStatus`, `AIInsight`, `ProgressMetric`, `CurriculumFramework`, and all union types for statuses. |
| `index.css` | Tailwind 4 import with custom theme colors (planner palette, explorer palette, studio palette). Custom animations: `float`, `pulse-glow`, `slide-up`, `fade-in`, `shimmer`. Scrollbar styling. |

#### Components

| Component | Purpose |
|-----------|---------|
| `LandingPage.tsx` | Hero section, feature cards (Privacy, Hive, AAC), dual-portal buttons, hive preview grid, backend driver status card, connection health check. |
| `ProfileSetup.tsx` | 3-step caregiver onboarding wizard: (1) Identity — name, avatar, age. (2) Learning — grade level, learning style. (3) Communication — mode (verbal/AAC/mixed), level. Privacy notice on final step. |
| `StudentMode.tsx` | Core student experience. Loads schedule from dataStore (or generates via backend). Manages hive state transitions (awaiting → engaged → awaiting). Handles task start, completion, interaction recording, and AI feedback generation. Displays activity cards in horizontal scroll, progress bar, agent status chips. |
| `CaregiverMode.tsx` | 4-tab caregiver dashboard. Overview (metrics cards, Recharts area/bar charts). AI Insights (categorized, agent-attributed). Curriculum (framework CRUD). Agent Hive (delegates to AgentHive component). |
| `ActivityCard.tsx` | Individual task card. Color-coded engagement borders (green/cyan/fuchsia). Difficulty stars. Glow animation for current task. Completion overlay with animated checkmark. Touch-optimized sizing (48×64 units). |
| `ActivityView.tsx` | Full-screen modal for active tasks. 6 activity renderers: Reading (text-to-speech), Math (number input), Art (canvas sketchpad), Writing (canvas + textarea split), Play (LLM music generation), Social Studies (content). Feedback display with loading state. |
| `AgentHive.tsx` | Agent hive dashboard. Status header with awaiting/engaged/monitoring counts. Expandable agent cards with per-action status indicators. Agent stats (processed, cycles, uptime). Data flow diagram. Backend driver card with connection status and repo link. Guardian always-monitoring notice. |

#### Services

| Service | Purpose |
|---------|---------|
| `llmService.ts` | HTTP client for AgentricAI-IED-ollama. Methods: `generateText()`, `generateChat()`, `checkConnection()`, `getModels()`. Configurable base URL, model, and timeout. AbortController for request cancellation. |
| `database.ts` | IndexedDB abstraction layer. 6 object stores: `profiles`, `sessions`, `interactions`, `curriculum`, `insights`, `metrics`. Methods: `init()`, `put()`, `get()`, `getAll()`, `delete()`, `clear()`. Auto-creates stores on version upgrade. |
| `dataStore.ts` | Runtime data layer and business logic. Manages backend driver config, hive agent definitions (all 6 agents with rigid actions), profile CRUD, schedule generation/persistence, interaction recording, insight generation, metric computation, curriculum framework management. Single source of truth for agent state. |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **AgentricAI-IED-ollama** running at `localhost:11434` (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/BAMmyers/AgentricAI-planner.git
cd AgentricAI-planner

# Install dependencies
npm install

# Start the backend (in a separate terminal)
# See: https://github.com/BAMmyers/AgentricAI-IED-ollama
# Ensure Ollama is running with a model (e.g., llama3.2)

# Start the development server
npm run dev
```

### First Run

1. Open the application in your browser (default: `http://localhost:5173`)
2. The **ProfileSetup** wizard will appear for first-time configuration
3. A caregiver completes the 3-step student profile:
   - **Step 1:** Student name, avatar, and age
   - **Step 2:** Grade level and primary learning style
   - **Step 3:** Communication mode (Verbal / AAC / Mixed) and communication level
4. The profile is encrypted and saved to local IndexedDB
5. The **Landing Page** appears with dual-portal access

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |

---

## Configuration

### LLM Service Configuration

The LLM service connects to AgentricAI-IED-ollama. Configuration is defined in `src/services/llmService.ts`:

```typescript
const DEFAULT_CONFIG: LLMServiceConfig = {
  baseUrl: 'http://localhost:11434',  // Ollama endpoint
  model: 'llama3.2',                  // Default model
  timeout: 30000                       // 30 second timeout
};
```

To change the model at runtime:
```typescript
import { llmService } from './services/llmService';
llmService.setModel('mistral');
```

### Custom Theme

Theme colors are defined in `src/index.css` under the `@theme` directive:

| Palette | Purpose | Colors |
|---------|---------|--------|
| `planner-*` | Base application palette | 50–900 slate scale |
| `explorer-*` | Student Explorer mode | Indigo, violet, amber, emerald |
| `studio-*` | Caregiver Studio mode | Sky blue scale |

---

## Deployment

### PWA Deployment (Recommended for Tablets)

AgentricAI-planner is built as a **Progressive Web App** for deployment on AAC devices:

```bash
# Build for production
npm run build

# The dist/ directory contains the complete PWA
# Deploy to any static hosting (Netlify, Vercel, Cloudflare Pages, self-hosted)
```

The `index.html` includes AAC-optimized meta tags:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### Target Devices

| Device | Status | Notes |
|--------|--------|-------|
| **Apple iPad** | Primary target | Most common AAC device |
| **Samsung Galaxy Tab** | Primary target | Android AAC alternative |
| **Desktop browsers** | Supported | Full development and caregiver use |
| **iPhone / Android phone** | Supported | Responsive layout |

### Build Output

The Vite build uses `vite-plugin-singlefile` to produce a **single HTML file** in `dist/index.html`. This makes deployment and offline use trivial — the entire application is self-contained.

---

## Data Flow

### Closed-Loop Learning Cycle

```
  ┌──────────────────────────────────────────────┐
  │                                              │
  │  1. FRAMEWORK CREATION                       │
  │     Caregiver sets goals in Studio Mode      │
  │              │                               │
  │              ▼                               │
  │  2. AI ASSESSMENT & PERSONALIZATION          │
  │     Orchestrator + Curriculum agents          │
  │     process framework + student profile       │
  │              │                               │
  │              ▼                               │
  │  3. CURRICULUM PRESENTATION                  │
  │     Orchestrator generates Daily Schedule     │
  │     via AgentricAI-IED-ollama                │
  │              │                               │
  │              ▼                               │
  │  4. STUDENT INTERACTION (Private)            │
  │     Student engages with activities           │
  │     All metrics captured locally              │
  │     🛡️ Guardian encrypts every write          │
  │              │                               │
  │              ▼                               │
  │  5. DATA RE-ASSESSMENT & EVOLUTION           │
  │     Analyst scores engagement                 │
  │     Adapter adjusts difficulty                │
  │     Communicator evolves AAC symbols          │
  │              │                               │
  │              └─────────── loops back to 2 ───┘
  │
  │  Caregiver sees: AI-filtered progress reports
  │  Caregiver does NOT see: raw interaction data
  │
  └──────────────────────────────────────────────┘
```

### Agent Data Flow During Workflow Execution

```
AgentricAI-IED-ollama
        │
        ▼
  🎯 Orchestrator  ──→  📚 Curriculum  ──→  💬 Communicator
        │                                        │
        │                                        ▼
        │                                   👤 Student
        │                                        │
        │                                        ▼
        │                                   🔍 Analyst  ──→  ⚙️ Adapter ──↻
        │
        └── 🛡️ Guardian encrypts every write ── ALWAYS MONITORING
```

---

## API Reference

### LLM Service (`src/services/llmService.ts`)

```typescript
// Generate text completion
const response = await llmService.generateText(prompt: string): Promise<LLMResponse>

// Generate chat completion
const response = await llmService.generateChat(messages: {role: string, content: string}[]): Promise<LLMResponse>

// Check backend connection
const isConnected = await llmService.checkConnection(): Promise<boolean>

// List available models
const models = await llmService.getModels(): Promise<string[]>

// Get/set configuration
llmService.getEndpoint(): string
llmService.getModel(): string
llmService.setModel(model: string): void
```

### Database Service (`src/services/database.ts`)

```typescript
// Initialize IndexedDB
await database.init(): Promise<void>

// CRUD operations
await database.put(storeName, data): Promise<void>
await database.get<T>(storeName, id): Promise<T | undefined>
await database.getAll<T>(storeName): Promise<T[]>
await database.delete(storeName, id): Promise<void>
await database.clear(storeName): Promise<void>
```

### Data Store (`src/services/dataStore.ts`)

```typescript
// Initialization
await dataStore.initialize(): Promise<void>
await dataStore.checkBackendConnection(): Promise<boolean>

// Student Profile
await dataStore.getProfile(): Promise<StudentProfile | null>
await dataStore.saveProfile(profile): Promise<void>
await dataStore.createProfile(data): Promise<StudentProfile>

// Schedule
await dataStore.getSchedule(): Promise<PlannerTask[]>
await dataStore.saveSchedule(tasks): Promise<void>
await dataStore.updateTask(taskId, updates): Promise<void>
await dataStore.generateSchedule(profile): Promise<PlannerTask[]>

// Interactions (Private)
await dataStore.recordInteraction(data): Promise<void>
await dataStore.getInteractionCount(): Promise<number>

// AI Insights
await dataStore.getInsights(): Promise<AIInsight[]>
await dataStore.addInsight(insight): Promise<void>
await dataStore.generateInsights(profile): Promise<AIInsight[]>

// Progress Metrics
await dataStore.getMetrics(): Promise<{progressMetrics, weeklyData, skillProgress}>
await dataStore.updateMetrics(metrics): Promise<void>

// Curriculum Frameworks
await dataStore.getFrameworks(): Promise<CurriculumFramework[]>
await dataStore.saveFramework(framework): Promise<void>
await dataStore.deleteFramework(id): Promise<void>

// Hive Status
dataStore.getHiveStatus(): HiveStatus
```

---

## Relationship to AgentricAI Studios

AgentricAI-planner is the **second portal** of the [AgentricAI Studios](https://github.com/BAMmyers/AgentricAI_Studios) ecosystem:

```
AgentricAI Studios (Parent)
├── AgentricAI-IED-ollama    ← Backend LLM inference engine
├── AgentricAI-planner       ← This project (student-facing adaptive learning)
└── Studio Components        ← Shared component library
```

The planner was originally conceived as the student-facing adaptive learning portal, while the Studios repository provides the creator/teacher framework. Together with AgentricAI-IED-ollama as the inference backbone, they form a complete autonomous educational ecosystem.

---

## Contributing

This project exists to serve children with unique learning needs. Contributions that advance the mission of accessible, private, adaptive education are welcome.

### Guidelines

1. **Privacy first** — Never introduce external data transmission, analytics, or tracking
2. **Agent rigidity** — Each agent maintains exactly 2-3 actions. Do not add actions.
3. **Guardian immutability** — The Guardian agent must always be in `monitoring` state
4. **AAC compatibility** — All UI must remain touch-friendly with large tap targets
5. **Local-first** — All data storage must remain on-device via IndexedDB
6. **Backend agnostic** — The LLM service should work with any Ollama-compatible endpoint

---

## License

This project is part of [AgentricAI Studios](https://github.com/BAMmyers/AgentricAI_Studios) by [@BAMmyers](https://github.com/BAMmyers).

---

<p align="center">
  <strong>Built with purpose. Built with love.</strong><br/>
  <em>For every child who deserves a learning companion that truly understands them.</em>
</p>

<p align="center">
  🧠 AgentricAI-planner · 🛡️ Privacy by Architecture · 🐝 Agent Hive · 📱 AAC-Ready
</p>
