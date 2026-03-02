# API Reference

## Services

AgentricAI-planner has three core services that manage data persistence, runtime state, and LLM communication.

---

## LLM Service

**File:** `src/services/llmService.ts`
**Purpose:** HTTP client for AgentricAI-IED-ollama

### Configuration

```typescript
interface LLMServiceConfig {
  baseUrl: string;   // Default: 'http://localhost:11434'
  model: string;     // Default: 'AgentricAIcody:latest'
  timeout: number;   // Default: 30000 (30 seconds)
}
```

### Methods

#### `generateText(prompt: string): Promise<LLMResponse>`

Generates text completion using the Ollama `/api/generate` endpoint.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `prompt` | `string` | The prompt to send to the LLM |

**Returns:**
```typescript
interface LLMResponse {
  text: string;        // Generated text (empty string on error)
  error: string | null; // Error message if request failed
}
```

**Usage:**
```typescript
import { llmService } from './services/llmService';

const response = await llmService.generateText(
  'Generate a daily schedule for a 7-year-old learner...'
);

if (response.error) {
  console.error('LLM error:', response.error);
} else {
  console.log('Generated:', response.text);
}
```

---

#### `generateChat(messages: ChatMessage[]): Promise<LLMResponse>`

Generates chat completion using the Ollama `/api/chat` endpoint.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `messages` | `ChatMessage[]` | Array of chat messages |

```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

**Returns:** `LLMResponse` (same as `generateText`)

**Usage:**
```typescript
const response = await llmService.generateChat([
  { role: 'system', content: 'You are an educational AI assistant.' },
  { role: 'user', content: 'How is the student progressing in reading?' }
]);
```

---

#### `checkConnection(): Promise<boolean>`

Tests connectivity to the AgentricAI-IED-ollama backend.

**Returns:** `boolean` — `true` if backend is reachable, `false` otherwise.

**Usage:**
```typescript
const isConnected = await llmService.checkConnection();
if (!isConnected) {
  // Show offline indicator
}
```

---

#### `getModels(): Promise<string[]>`

Retrieves list of available models from the backend.

**Returns:** `string[]` — Array of model names (e.g., `['AgentricAIcody:latest']`)

**Usage:**
```typescript
const models = await llmService.getModels();
console.log('Available models:', models);
```

---

#### `getEndpoint(): string`

Returns the current base URL.

#### `getModel(): string`

Returns the current model name.

#### `setModel(model: string): void`

Changes the active model.

---

## Database Service

**File:** `src/services/database.ts`
**Purpose:** IndexedDB abstraction layer with 6 object stores

### Initialization

#### `init(): Promise<void>`

Initializes the IndexedDB database and creates all object stores if they don't exist.

**Object Stores Created:**
| Store Name | Key Path | Contents |
|-----------|----------|----------|
| `profiles` | `id` | Student profiles |
| `sessions` | `id` | Daily schedule tasks |
| `interactions` | `id` | Raw interaction records |
| `curriculum` | `id` | Curriculum frameworks |
| `insights` | `id` | AI-generated insights |
| `metrics` | `id` | Progress metrics |

**Usage:**
```typescript
import { database } from './services/database';
await database.init();
```

---

### CRUD Operations

#### `put(storeName: string, data: any): Promise<void>`

Creates or updates a record in the specified store.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `storeName` | `string` | Name of the object store |
| `data` | `any` | Data object (must contain `id` field) |

**Usage:**
```typescript
await database.put('profiles', {
  id: 'student-001',
  name: 'Alex',
  age: 7,
  gradeLevel: '2nd'
});
```

---

#### `get<T>(storeName: string, id: string): Promise<T | undefined>`

Retrieves a single record by ID.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `storeName` | `string` | Name of the object store |
| `id` | `string` | Record ID to retrieve |

**Returns:** The record of type `T`, or `undefined` if not found.

**Usage:**
```typescript
const profile = await database.get<StudentProfile>('profiles', 'student-001');
```

---

#### `getAll<T>(storeName: string): Promise<T[]>`

Retrieves all records from a store.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `storeName` | `string` | Name of the object store |

**Returns:** Array of all records in the store.

**Usage:**
```typescript
const allInsights = await database.getAll<AIInsight>('insights');
```

---

#### `delete(storeName: string, id: string): Promise<void>`

Deletes a single record by ID.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `storeName` | `string` | Name of the object store |
| `id` | `string` | Record ID to delete |

---

#### `clear(storeName: string): Promise<void>`

Removes all records from a store.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `storeName` | `string` | Name of the object store to clear |

---

## Data Store

**File:** `src/services/dataStore.ts`
**Purpose:** Runtime data layer, business logic, agent definitions, persistence orchestration

### Initialization

#### `initialize(): Promise<void>`

Initializes the database and loads persisted data into runtime state.

**Must be called before any other dataStore method.**

---

#### `checkBackendConnection(): Promise<boolean>`

Tests connection to AgentricAI-IED-ollama and updates internal backend status.

---

### Student Profile

#### `getProfile(): Promise<StudentProfile | null>`

Retrieves the student profile from IndexedDB.

**Returns:** `StudentProfile` or `null` if no profile exists (first-run).

---

#### `saveProfile(profile: StudentProfile): Promise<void>`

Saves/updates the student profile.

---

#### `createProfile(data: ProfileSetupData): Promise<StudentProfile>`

Creates a new student profile from the onboarding wizard data. Generates a unique ID and timestamps.

**Parameters:**
```typescript
interface ProfileSetupData {
  name: string;
  avatar: string;
  age: number;
  gradeLevel: string;
  learningStyle: string;
  communicationMode: 'verbal' | 'aac' | 'mixed';
  communicationLevel: string;
}
```

---

### Schedule Management

#### `getSchedule(): Promise<PlannerTask[]>`

Retrieves the current daily schedule from IndexedDB.

---

#### `saveSchedule(tasks: PlannerTask[]): Promise<void>`

Persists the daily schedule.

---

#### `updateTask(taskId: string, updates: Partial<PlannerTask>): Promise<void>`

Updates a specific task in the schedule (e.g., marking as completed).

---

#### `generateSchedule(profile: StudentProfile): Promise<PlannerTask[]>`

Generates a new daily schedule via AgentricAI-IED-ollama. The prompt includes the student's name, age, grade level, learning style, and communication mode.

**Returns:** Array of `PlannerTask` objects parsed from the LLM response.

---

### Interaction Recording

#### `recordInteraction(data: InteractionData): Promise<void>`

Records a task interaction to IndexedDB. This data is private — accessible only to the AI agents.

**Parameters:**
```typescript
interface InteractionData {
  taskId: string;
  taskType: string;
  startedAt: string;
  completedAt: string;
  duration: number;
  engagementLevel: string;
}
```

---

#### `getInteractionCount(): Promise<number>`

Returns the total number of recorded interactions.

---

### AI Insights

#### `getInsights(): Promise<AIInsight[]>`

Retrieves all AI-generated insights.

---

#### `addInsight(insight: AIInsight): Promise<void>`

Adds a new insight.

---

#### `generateInsights(profile: StudentProfile): Promise<AIInsight[]>`

Generates new insights via AgentricAI-IED-ollama based on the student profile and interaction history.

---

### Progress Metrics

#### `getMetrics(): Promise<MetricsData>`

Retrieves aggregated progress metrics.

**Returns:**
```typescript
interface MetricsData {
  progressMetrics: {
    engagement: number;
    completion: number;
    focus: number;
    communication: number;
  };
  weeklyData: Array<{
    day: string;
    engagement: number;
    tasks: number;
  }>;
  skillProgress: Array<{
    skill: string;
    current: number;
    target: number;
  }>;
}
```

---

#### `updateMetrics(metrics: MetricsData): Promise<void>`

Updates the stored metrics.

---

### Curriculum Frameworks

#### `getFrameworks(): Promise<CurriculumFramework[]>`

Retrieves all curriculum frameworks.

---

#### `saveFramework(framework: CurriculumFramework): Promise<void>`

Creates or updates a curriculum framework.

---

#### `deleteFramework(id: string): Promise<void>`

Deletes a curriculum framework by ID.

---

### Hive Status

#### `getHiveStatus(): HiveStatus`

Returns the current hive status including all agent definitions, backend driver config, and execution state.

**Returns:**
```typescript
interface HiveStatus {
  agents: HiveAgent[];
  backendDriver: BackendDriver;
  hiveState: 'awaiting' | 'executing' | 'completing';
}
```

---

## Type Definitions

**File:** `src/types.ts`

### Core Types

```typescript
// Task presented in the student's daily schedule
interface PlannerTask {
  id: string;
  name: string;
  type: TaskType;
  icon: string;
  status: 'pending' | 'current' | 'completed';
  engagement: 'high' | 'medium' | 'low';
  difficulty: number;        // 1-5
  time: string;              // Display time (e.g., "9:00 AM")
  duration: number;          // Minutes
  content?: {
    title: string;
    body: string;
  };
}

type TaskType = 'reading' | 'math' | 'art' | 'writing' | 'play'
  | 'social_studies' | 'communication' | 'movement' | 'break' | 'creative';

// Student profile created during onboarding
interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gradeLevel: string;
  learningStyle: string;
  communicationMode: 'verbal' | 'aac' | 'mixed';
  communicationLevel: string;
  createdAt: string;
  updatedAt: string;
}

// Agent in the hive
interface HiveAgent {
  id: string;
  name: string;
  icon: string;
  role: string;
  status: AgentStatus;
  actions: AgentAction[];
  stats: {
    processed: number;
    uptime: string;
  };
}

type AgentStatus = 'awaiting' | 'engaged' | 'monitoring' | 'processing' | 'error';

// Individual agent action (2-3 per agent, rigid)
interface AgentAction {
  name: string;
  description: string;
  status: 'ready' | 'running' | 'complete';
}

// Backend driver configuration
interface BackendDriver {
  name: string;
  endpoint: string;
  model: string;
  status: 'connected' | 'disconnected' | 'checking';
  repoUrl: string;
}

// AI-generated insight
interface AIInsight {
  id: string;
  type: 'breakthrough' | 'adaptation' | 'milestone' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  agentSource: string;
  impactScore: number;
  createdAt: string;
}

// Curriculum framework
interface CurriculumFramework {
  id: string;
  name: string;
  description: string;
  goals: string[];
  status: 'active' | 'draft' | 'archived';
  aiAdaptationNotes: string;
  createdAt: string;
  updatedAt: string;
}

// Overall hive execution state
interface HiveStatus {
  agents: HiveAgent[];
  backendDriver: BackendDriver;
  hiveState: 'awaiting' | 'executing' | 'completing';
}
```
