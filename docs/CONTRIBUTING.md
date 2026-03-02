# Contributing to AgentricAI-planner

## The Mission

This project exists to serve children with unique learning needs — beginning with non-verbal autism. Every contribution must advance this mission. The following guidelines are non-negotiable constraints of the architecture.

---

## Non-Negotiable Constraints

### 1. Privacy is Absolute

**No contribution may introduce:**
- External data transmission of any kind
- Third-party analytics, tracking, or telemetry
- Server-side data storage or processing
- Remote logging or error reporting services
- Advertisement or monetization tracking
- Social media integrations
- CDN dependencies (the build is a single file)

**All data stays on the device.** The only network communication permitted is to the local AgentricAI-IED-ollama instance.

### 2. Agent Rigidity

Each agent has exactly **2-3 actions**. Do not add actions to an agent. Do not create new agents. The hive has 6 members and each is a rigid specialist.

| Agent | Actions | Max |
|-------|---------|-----|
| Orchestrator | Schedule Sequencing, Agent Synchronization | 2 |
| Curriculum | Lesson Assembly, Content Curation, Prerequisite Mapping | 3 |
| Analyst | Pattern Recognition, Engagement Scoring | 2 |
| Communicator | Symbol Expansion, Sentence Scaffolding | 2 |
| Adapter | Difficulty Calibration, Theme Personalization, Pacing Control | 3 |
| Guardian | Data Encryption, Access Gating | 2 |

If you believe an agent needs a new capability, it must replace an existing action or be delegated to the appropriate agent that already covers that domain.

### 3. Guardian Immutability

The Guardian agent must **always** be in `monitoring` state. No code path may set Guardian's status to `awaiting`, `engaged`, `processing`, or `error`. This is enforced at multiple levels:

- `activateHive()` skips Guardian
- `deactivateHive()` skips Guardian
- UI always renders Guardian with blue (monitoring) indicator
- Type system reserves `monitoring` for Guardian only

### 4. AAC Compatibility

All UI must remain touch-friendly and accessible:
- Minimum touch target: 44×44 pixels (Apple HIG guideline)
- No hover-only interactions (touch devices don't have hover)
- No small text or dense UI in Student Explorer mode
- Canvas interactions must support both mouse and touch events
- No keyboard-only interactions in Student mode

### 5. Local-First Storage

All data storage must use IndexedDB via the database service. No localStorage, no sessionStorage, no cookies, no external databases.

### 6. Backend Agnostic

The LLM service must work with any Ollama-compatible endpoint. Do not hardcode model-specific prompts or API formats.

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/BAMmyers/AgentricAI-planner.git
cd AgentricAI-planner

# Install dependencies
npm install

# Start development server
npm run dev

# Start AgentricAI-IED-ollama (separate terminal)
# See: https://github.com/BAMmyers/AgentricAI-IED-ollama
ollama serve
```

---

## Code Standards

### TypeScript
- Strict mode enabled
- All types defined in `src/types.ts`
- No `any` types except in database generic methods
- Interface over type alias for object shapes

### React
- Functional components only
- React hooks for state management
- No class components
- No external state management libraries (Redux, MobX, etc.)

### Styling
- Tailwind CSS classes only
- Use the `cn()` utility for conditional classes
- Custom theme colors defined in `src/index.css`
- No inline styles except for dynamic values (e.g., canvas dimensions)

### File Organization
```
src/
├── components/    ← React components (one per file)
├── services/      ← Data and API services
├── utils/         ← Utility functions
└── types.ts       ← All TypeScript type definitions
```

---

## Commit Messages

Use conventional commit format:

```
feat: add new activity type for music creation
fix: resolve canvas touch event on iPad Safari
docs: update agent hive specification
refactor: simplify data store initialization
```

Prefixes:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `refactor:` — Code restructuring
- `style:` — Formatting, no logic change
- `test:` — Adding tests
- `chore:` — Build, deps, config

---

## Pull Request Process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Ensure `npm run build` passes with zero errors
5. Verify on a touch device (or browser dev tools touch simulation)
6. Submit PR with clear description of changes

### PR Checklist

- [ ] No external data transmission introduced
- [ ] No new agent actions beyond the 2-3 limit
- [ ] Guardian remains in monitoring state at all times
- [ ] All UI elements are touch-accessible (44×44 min)
- [ ] All data stored in IndexedDB only
- [ ] `npm run build` passes with zero errors
- [ ] Tested in Student Explorer mode
- [ ] Tested in Caregiver Studio mode

---

## Questions?

Open an issue on the [GitHub repository](https://github.com/BAMmyers/AgentricAI-planner/issues) or reach out to [@BAMmyers](https://github.com/BAMmyers).
