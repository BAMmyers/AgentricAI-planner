// =============================================================================
// AgentricAI-planner Types
// Backend Driver: AgentricAI-IED-ollama
// =============================================================================

export type AppView = 'landing' | 'student' | 'caregiver';

// -----------------------------------------------------------------------------
// Task & Activity Types (Student Explorer Mode)
// -----------------------------------------------------------------------------

export type TaskType = 
  | 'reading' 
  | 'math' 
  | 'art' 
  | 'writing' 
  | 'play' 
  | 'social_studies'
  | 'communication'
  | 'movement'
  | 'break'
  | 'creative';

export type TaskStatus = 'pending' | 'current' | 'completed' | 'skipped';
export type EngagementLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface TaskContent {
  title?: string;
  body?: string;
  instructions?: string;
  hint?: string;
}

export interface PlannerTask {
  id: string;
  name: string;
  type: TaskType;
  icon: string;
  time: string;
  duration: number;
  status: TaskStatus;
  engagement: EngagementLevel;
  difficulty: number;
  content?: TaskContent;
  agentSource: string;
  adaptedBy?: string;
}

export type ScheduleItem = PlannerTask;

// -----------------------------------------------------------------------------
// Student Profile
// -----------------------------------------------------------------------------

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gradeLevel: string;
  learningStyle: string;
  communicationMode: 'verbal' | 'aac' | 'mixed';
  communicationLevel: string;
  streak: number;
  totalSessions: number;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Hive Agent System
// -----------------------------------------------------------------------------

// Agent States:
// - 'awaiting'   = Active at station, ready for stimulation (default state)
// - 'engaged'    = Actively processing a workflow task
// - 'monitoring' = Passively observing (Guardian's default - always watching)
// - 'processing' = Brief computation burst
// - 'error'      = Something went wrong
export type AgentStatus = 'awaiting' | 'engaged' | 'monitoring' | 'processing' | 'error';
// Hive States:
// - 'awaiting'   = All agents ready at stations, waiting for user stimulation
// - 'executing'  = User clicked activity, agents are engaged
// - 'completing' = Task finishing, returning to awaiting
export type HiveState = 'awaiting' | 'executing' | 'completing';

export interface AgentAction {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  lastExecuted?: string;
  lastResult?: string;
  cycleCount: number;
}

export interface HiveAgent {
  id: string;
  name: string;
  fullTitle: string;
  icon: string;
  role: string;
  description: string;
  status: AgentStatus;
  color: string;
  bgColor: string;
  borderColor: string;
  actions: AgentAction[];
  processedThisCycle: number;
  totalProcessed: number;
  cyclesCompleted: number;
  uptime: string;
}

export interface BackendDriver {
  name: string;
  url: string;
  repoUrl: string;
  description: string;
  endpoint: string;
  repo: string;
  status: 'connected' | 'disconnected' | 'connecting';
  lastPing: string;
  model: string;
  version: string;
}

export interface HiveStatus {
  isActive: boolean;
  hiveState: HiveState;
  heartbeatMs: number;
  currentCycle: number;
  totalCycles: number;
  agents: HiveAgent[];
  backendDriver: BackendDriver;
}

// -----------------------------------------------------------------------------
// AI Insights & Progress
// -----------------------------------------------------------------------------

export type InsightType = 'breakthrough' | 'adaptation' | 'milestone' | 'pattern' | 'recommendation';

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  timestamp: string;
  agentSource: string;
  actionTaken?: string;
  impactScore?: number;
}

export interface ProgressMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

export interface WeeklyData {
  day: string;
  engagement: number;
  completion: number;
}

export interface SkillProgress {
  skill: string;
  progress: number;
  current: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface ProgressMetrics {
  engagementScore: number;
  completionRate: number;
  focusDuration: number;
  communicationGrowth: number;
  weeklyTrend: WeeklyData[];
  skillProgress: SkillProgress[];
}

// -----------------------------------------------------------------------------
// Curriculum Framework
// -----------------------------------------------------------------------------

export interface CurriculumFramework {
  id: string;
  name: string;
  description: string;
  goals: string[];
  adaptationNotes: string;
  createdBy: string;
  lastAdaptedBy: string;
  isActive: boolean;
}

// -----------------------------------------------------------------------------
// LLM Service Types
// -----------------------------------------------------------------------------

export interface LLMResponse {
  text: string;
  error?: string;
  model?: string;
  tokensUsed?: number;
}

export interface LLMServiceConfig {
  baseUrl: string;
  model: string;
  timeout: number;
}
