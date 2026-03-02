# Changelog

All notable changes to AgentricAI-planner are documented in this file.

---

## [1.0.1] — Default Curriculum

### Added
- **Default Curriculum Framework** — 8 pre-configured activity blocks ready to use immediately
- **Default Schedule Tasks** — Fully populated activities with content, instructions, and hints:
  - 📐 Morning Math (8:00 AM) — Number recognition and counting
  - 📖 Story Time (9:00 AM) — Read-aloud with TTS
  - 🎨 Creative Art (10:00 AM) — Free drawing
  - 🏃 Movement Break (10:30 AM) — Guided stretching
  - ✍️ Writing Practice (11:00 AM) — Letter tracing
  - 🍎 Lunch Break (12:00 PM) — Mealtime routine
  - 💬 Communication Time (1:00 PM) — AAC and expression
  - 🎮 Free Play (2:00 PM) — Choice-based reward time
- **Edit Framework button** — Caregivers can customize curriculum frameworks
- **Activity Blocks Preview** — Visual grid showing all 8 blocks in curriculum view
- **Auto-initialization** — Default curriculum saved to IndexedDB on first run

### Changed
- Student Explorer always loads with activities (no empty state)
- `generateSchedule()` falls back to Default if backend unavailable
- "Create Framework" renamed to "Add Custom Framework"
- Simplified student greeting (always ready to begin)

### Fixed
- Removed unnecessary "no schedule" warning
- Schedule now auto-populates on first database initialization
- All interactive tiles (cards) activated and functional

---

## [1.0.0] — Production Release

### Architecture
- **Agent Hive System** — 6 rigid specialist agents operating simultaneously
  - 🎯 Orchestrator (2 actions): Schedule Sequencing, Agent Synchronization
  - 📚 Curriculum (3 actions): Lesson Assembly, Content Curation, Prerequisite Mapping
  - 🔍 Analyst (2 actions): Pattern Recognition, Engagement Scoring
  - 💬 Communicator (2 actions): Symbol Expansion, Sentence Scaffolding
  - ⚙️ Adapter (3 actions): Difficulty Calibration, Theme Personalization, Pacing Control
  - 🛡️ Guardian (2 actions): Data Encryption, Access Gating — ALWAYS MONITORING
- **Hive state management** — Agents await stimulation, engage on task execution, return to awaiting on completion. Guardian never leaves monitoring state.
- **AgentricAI-IED-ollama integration** — Local LLM inference via Ollama REST API at localhost:11434
- **Privacy by architecture** — All data encrypted on-device via IndexedDB, no external transmission

### Student Explorer Mode
- Personalized daily schedule with horizontally-scrolling activity cards
- 6 activity types: Reading (text-to-speech), Math (number input), Art (canvas), Writing (canvas + text), Play (AI music), Social Studies
- Touch-optimized activity cards with engagement color coding and difficulty indicators
- Full-screen activity modals with completion animations
- AI-generated feedback after each task via AgentricAI-IED-ollama
- Real-time hive status indicator showing engaged agent count
- Daily progress tracking

### Caregiver Studio Mode
- 4-tab dashboard: Overview, AI Insights, Curriculum, Agent Hive
- Progress metrics with Recharts visualizations (engagement, completion, focus, communication)
- Weekly engagement trends (area chart) and skill progress (bar chart)
- AI-generated insights attributed to specific agents
- Curriculum framework management (create, edit, archive, delete)
- Full agent hive visualization with expandable agent cells and data flow diagram
- Backend driver status card with GitHub link

### Profile System
- 3-step onboarding wizard for caregiver setup
- Student identity (name, avatar, age)
- Learning configuration (grade level, learning style)
- Communication setup (verbal/AAC/mixed, communication level)
- Privacy notice during setup

### Services
- **LLM Service** — Production HTTP client for AgentricAI-IED-ollama with AbortController, timeout handling, and connection health checks
- **Database Service** — IndexedDB abstraction with 6 object stores (profiles, sessions, interactions, curriculum, insights, metrics)
- **Data Store** — Runtime state management with persistence, agent definitions, schedule generation, interaction recording, insight generation, metrics computation

### Infrastructure
- React 19 + TypeScript 5.9 + Vite 7
- Tailwind CSS 4 with custom theme (planner, explorer, studio palettes)
- Single-file build output via vite-plugin-singlefile
- PWA-ready with AAC meta tags (viewport lock, apple-mobile-web-app-capable)
- Comprehensive documentation (README, Architecture, Agent Hive, Privacy, Deployment, API Reference, Contributing)
