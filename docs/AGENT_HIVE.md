# Agent Hive System — Detailed Specification

## Design Philosophy

The Agent Hive is **not** a collection of general-purpose assistants. Each agent is a **rigid specialist** — an expert in a narrow domain with exactly 2-3 actions. No more. No less. The agents operate **simultaneously** like cells in a biological hive, each playing its part in a larger organism.

The hive is not a pipeline. It is a **parallel execution environment** where every agent is always at its station, always ready. When a workflow executes, they all engage at once. When the workflow completes, they return to awaiting the next stimulation.

**Exception:** The Guardian agent never awaits. It monitors. Always.

---

## Agent State Machine

```
                    ┌─────────────────────────┐
                    │                         │
                    │  APPLICATION LOADS       │
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │                         │
              ┌─────│  5 Agents → AWAITING    │
              │     │  Guardian → MONITORING  │
              │     │                         │
              │     └────────────┬────────────┘
              │                  │
              │     User clicks  │
              │     activity     │
              │     tile         │
              │                  │
              │     ┌────────────▼────────────┐
              │     │                         │
              │     │  5 Agents → ENGAGED     │
              │     │  Guardian → MONITORING  │
              │     │                         │
              │     └────────────┬────────────┘
              │                  │
              │     Task         │
              │     completes    │
              │                  │
              └──────────────────┘
```

### State Definitions

| State | Code | Color | Meaning | Applies To |
|-------|------|-------|---------|------------|
| **Awaiting** | `awaiting` | 🟡 Amber | Active at station, ready for user stimulation | Orchestrator, Curriculum, Analyst, Communicator, Adapter |
| **Engaged** | `engaged` | 🟢 Green | Actively processing a workflow task | Orchestrator, Curriculum, Analyst, Communicator, Adapter |
| **Monitoring** | `monitoring` | 🔵 Blue | Always watching, always protecting | Guardian ONLY |
| **Processing** | `processing` | 🟢 Green (pulse) | Brief computation burst | Any agent (transient) |
| **Error** | `error` | 🔴 Red | Something went wrong | Any agent (requires attention) |

### State Transition Rules

1. **Awaiting → Engaged:** User clicks an activity tile in Student Explorer mode
2. **Engaged → Awaiting:** Task completes (user clicks "I'm Finished!" and feedback cycle ends)
3. **Monitoring → Monitoring:** Guardian NEVER changes state. This is immutable.
4. **Any → Error:** An agent encounters an unrecoverable error
5. **Error → Awaiting:** Error is resolved (application restart or recovery)

---

## Agent Specifications

### 🎯 Orchestrator Agent

**Role:** Schedule & Sync Coordinator
**Purpose:** The Orchestrator is the conductor of the hive. It sequences the daily schedule and keeps all other agents synchronized with the current application state.

| # | Action | Input | Output | Frequency |
|---|--------|-------|--------|-----------|
| 1 | **Schedule Sequencing** | Student profile, time of day, prior performance | Ordered daily task list | Once per session, on schedule generation |
| 2 | **Agent Synchronization** | Current task state, user action events | Sync signals to all agents | Every state transition |

**Constraints:**
- Does NOT create content (that is Curriculum's job)
- Does NOT analyze behavior (that is Analyst's job)
- Does NOT modify difficulty (that is Adapter's job)
- ONLY orders and synchronizes

**When Awaiting:** Standing by with current schedule state, ready to trigger sync on next user action
**When Engaged:** Actively dispatching task context to all other agents, coordinating the workflow

---

### 📚 Curriculum Agent

**Role:** Lesson Assembly Specialist
**Purpose:** The Curriculum agent is the content expert. It assembles lessons, curates materials, and ensures prerequisite knowledge is mapped correctly.

| # | Action | Input | Output | Frequency |
|---|--------|-------|--------|-----------|
| 1 | **Lesson Assembly** | Task type, difficulty level, student interests | Complete lesson with content body | Per task |
| 2 | **Content Curation** | Grade level, learning style, communication mode | Filtered content library | Per schedule generation |
| 3 | **Prerequisite Mapping** | Skill tree, completed tasks, mastery levels | Prerequisite dependency graph | Per curriculum update |

**Constraints:**
- Does NOT decide task order (that is Orchestrator's job)
- Does NOT adjust difficulty (that is Adapter's job)
- ONLY builds and curates content

**When Awaiting:** Content library indexed, ready to assemble next lesson on demand
**When Engaged:** Pulling content, assembling lesson structure, mapping prerequisites

---

### 🔍 Analyst Agent

**Role:** Behavioral Pattern Specialist
**Purpose:** The Analyst observes and quantifies. It identifies patterns in how the student interacts and assigns engagement scores that drive the entire adaptation engine.

| # | Action | Input | Output | Frequency |
|---|--------|-------|--------|-----------|
| 1 | **Pattern Recognition** | Interaction history, timing data, completion rates | Behavioral pattern reports | After each task completion |
| 2 | **Engagement Scoring** | Time on task, interaction speed, completion quality | Engagement score (0-100) | Real-time during task |

**Constraints:**
- Does NOT change what the student sees (that is Adapter's job)
- Does NOT generate content (that is Curriculum's job)
- ONLY observes and scores

**When Awaiting:** Holding current behavioral model, ready to begin scoring on next task start
**When Engaged:** Recording interaction timestamps, calculating engagement, detecting patterns

---

### 💬 Communicator Agent

**Role:** AAC & Language Specialist
**Purpose:** The Communicator is the language bridge. For non-verbal learners using AAC devices, this agent expands their symbol vocabulary and scaffolds sentence construction.

| # | Action | Input | Output | Frequency |
|---|--------|-------|--------|-----------|
| 1 | **Symbol Expansion** | Current symbol set, task context, mastery level | New symbols introduced contextually | Per task (when communication type) |
| 2 | **Sentence Scaffolding** | Communication level, current vocabulary | Sentence starters, templates, supports | Per interaction |

**Constraints:**
- Does NOT analyze behavior (that is Analyst's job)
- Does NOT decide when to introduce new symbols (that is Adapter's job based on Analyst's data)
- ONLY provides the linguistic building blocks

**When Awaiting:** Symbol library loaded, sentence templates ready, waiting for task context
**When Engaged:** Selecting appropriate symbols, generating scaffolding for current activity

---

### ⚙️ Adapter Agent

**Role:** Difficulty & Personalization Tuner
**Purpose:** The Adapter is the real-time tuner. It takes the Analyst's scores and adjusts difficulty, themes, and pacing to keep the student in their optimal learning zone.

| # | Action | Input | Output | Frequency |
|---|--------|-------|--------|-----------|
| 1 | **Difficulty Calibration** | Engagement scores, completion rates, error frequency | Adjusted difficulty level (1-5) | After each task |
| 2 | **Theme Personalization** | Student interests, preferred content types | Theme configuration | Per session |
| 3 | **Pacing Control** | Time-on-task data, fatigue indicators, break patterns | Adjusted activity durations and break scheduling | Real-time |

**Constraints:**
- Does NOT create content (that is Curriculum's job)
- Does NOT observe behavior (that is Analyst's job)
- ONLY adjusts parameters based on other agents' outputs

**When Awaiting:** Current calibration settings loaded, ready to adjust on next data input
**When Engaged:** Processing Analyst's engagement scores, recalibrating difficulty, updating pacing

---

### 🛡️ Guardian Agent

**Role:** Privacy & Encryption Enforcer — **ALWAYS MONITORING**
**Purpose:** The Guardian is the wall between the child and the outside world. Every byte of data that touches storage passes through the Guardian's encryption. Every request for data is gated by the Guardian's access control.

| # | Action | Input | Output | Frequency |
|---|--------|-------|--------|-----------|
| 1 | **Data Encryption** | Raw interaction data, profile updates, any write operation | Encrypted data blob | EVERY write to IndexedDB |
| 2 | **Access Gating** | Data request, requester identity (student view / caregiver view) | Filtered or denied data | EVERY read from storage |

**Constraints:**
- NEVER enters `awaiting` or `engaged` state — ALWAYS `monitoring`
- Does NOT analyze data (that is Analyst's job)
- Does NOT decide what data to collect (that is each agent's responsibility)
- ONLY encrypts writes and gates reads

**When Monitoring (always):** Intercepting every IndexedDB write to encrypt, validating every read request against access rules, ensuring no data leaves the device

---

## Hive Execution Model

### Simultaneous Operation

All 6 agents run simultaneously. They do not wait for each other in sequence. The hive operates as a parallel system:

```
Time ─────────────────────────────────────────────────────────►

🎯 Orchestrator  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓░░░░░░
📚 Curriculum    ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓░░░░░░
🔍 Analyst       ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓░░░░░░
💬 Communicator  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓░░░░░░
⚙️ Adapter       ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓░░░░░░
🛡️ Guardian      ████████████████████████████████████████████████

Legend: ▓ = ENGAGED  ░ = AWAITING  █ = MONITORING (always)
```

### Communication Pattern

Agents do not communicate directly with each other. They communicate through the **Data Store**, which acts as the shared memory:

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Agent A  │────►│  Data   │◄────│ Agent B  │
│          │     │  Store  │     │          │
└─────────┘     └─────────┘     └─────────┘
                     │
                     ▼
                ┌─────────┐
                │ IndexedDB│
                │ (via     │
                │ Guardian)│
                └─────────┘
```

Each agent reads from and writes to the Data Store. The Guardian intercepts all writes to IndexedDB for encryption and all reads for access gating.

---

## Integration with AgentricAI-IED-ollama

The Agent Hive leverages **AgentricAI-IED-ollama** (`localhost:11434`) as its inference engine. The following agents make LLM calls:

| Agent | Uses LLM For | API Endpoint |
|-------|-------------|--------------|
| **Orchestrator** | Schedule generation prompts | `/api/generate` |
| **Curriculum** | Lesson content generation | `/api/generate` |
| **Analyst** | Insight generation from behavioral data | `/api/generate` |
| **Communicator** | Sentence scaffolding, symbol descriptions | `/api/generate` |
| **Adapter** | Difficulty calibration reasoning | `/api/generate` |
| **Guardian** | Never. Guardian does not make external calls. | None |

> **Important:** The Guardian agent NEVER makes external network requests. It operates entirely on-device. All LLM calls from other agents are to the local AgentricAI-IED-ollama instance — the data never leaves the local network.
