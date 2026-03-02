// =============================================================================
// Data Store - AgentricAI-planner
// Production data layer — initializes state, persists to IndexedDB
// Replaces all hardcoded mock data with a live, persistent store
// Backend Driver: https://github.com/BAMmyers/AgentricAI-IED-ollama.git
// =============================================================================

import type {
  StudentProfile,
  PlannerTask,
  ProgressMetric,
  WeeklyData,
  SkillProgress,
  AIInsight,
  CurriculumFramework,
  HiveAgent,
  BackendDriver,
  HiveStatus
} from '../types';
import { database } from './database';
import { llmService } from './llmService';

// =============================================================================
// Backend Driver Configuration (Production)
// =============================================================================

export const backendDriver: BackendDriver = {
  name: 'AgentricAI-IED-ollama',
  url: 'https://github.com/BAMmyers/AgentricAI-IED-ollama.git',
  repoUrl: 'https://github.com/BAMmyers/AgentricAI-IED-ollama.git',
  description: 'Local LLM inference engine powering all agent intelligence',
  endpoint: 'http://localhost:11434',
  repo: 'BAMmyers/AgentricAI-IED-ollama',
  status: 'connecting',
  lastPing: new Date().toISOString(),
  model: 'llama3.2',
  version: '1.0.0'
};

// =============================================================================
// Hive Agent Definitions (Rigid 2-3 Actions — Expert Specialists)
// =============================================================================

export const hiveAgents: HiveAgent[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    fullTitle: 'Orchestrator Agent',
    icon: '🎯',
    role: 'Schedule & Sync Coordinator',
    description: 'Coordinates all agent activity and manages daily schedule flow',
    status: 'awaiting',
    color: 'emerald',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500',
    actions: [
      {
        id: 'orch-1',
        name: 'Schedule Sequencing',
        description: 'Orders daily tasks for optimal learning flow',
        status: 'awaiting',
        cycleCount: 0
      },
      {
        id: 'orch-2',
        name: 'Agent Synchronization',
        description: 'Keeps all agents in sync with current state',
        status: 'awaiting',
        cycleCount: 0
      }
    ],
    processedThisCycle: 0,
    totalProcessed: 0,
    cyclesCompleted: 0,
    uptime: '0%'
  },
  {
    id: 'curriculum',
    name: 'Curriculum',
    fullTitle: 'Curriculum Agent',
    icon: '📚',
    role: 'Lesson Assembly Specialist',
    description: 'Assembles and curates learning content',
    status: 'awaiting',
    color: 'sky',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500',
    actions: [
      {
        id: 'curr-1',
        name: 'Lesson Assembly',
        description: 'Builds complete lessons from content library',
        status: 'awaiting',
        cycleCount: 0
      },
      {
        id: 'curr-2',
        name: 'Content Curation',
        description: 'Selects age and level appropriate materials',
        status: 'awaiting',
        cycleCount: 0
      },
      {
        id: 'curr-3',
        name: 'Prerequisite Mapping',
        description: 'Ensures skills build on prior knowledge',
        status: 'awaiting',
        cycleCount: 0
      }
    ],
    processedThisCycle: 0,
    totalProcessed: 0,
    cyclesCompleted: 0,
    uptime: '0%'
  },
  {
    id: 'analyst',
    name: 'Analyst',
    fullTitle: 'Behavior Analyst Agent',
    icon: '🔍',
    role: 'Behavioral Pattern Specialist',
    description: 'Analyzes interaction patterns and engagement',
    status: 'awaiting',
    color: 'amber',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500',
    actions: [
      {
        id: 'anly-1',
        name: 'Pattern Recognition',
        description: 'Identifies learning and behavior patterns',
        status: 'awaiting',
        cycleCount: 0
      },
      {
        id: 'anly-2',
        name: 'Engagement Scoring',
        description: 'Calculates real-time engagement metrics',
        status: 'awaiting',
        cycleCount: 0
      }
    ],
    processedThisCycle: 0,
    totalProcessed: 0,
    cyclesCompleted: 0,
    uptime: '0%'
  },
  {
    id: 'communicator',
    name: 'Communicator',
    fullTitle: 'Communication Agent',
    icon: '💬',
    role: 'AAC & Language Specialist',
    description: 'Manages AAC symbols and language scaffolding',
    status: 'awaiting',
    color: 'purple',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500',
    actions: [
      {
        id: 'comm-1',
        name: 'Symbol Expansion',
        description: 'Introduces new AAC symbols contextually',
        status: 'awaiting',
        cycleCount: 0
      },
      {
        id: 'comm-2',
        name: 'Sentence Scaffolding',
        description: 'Builds sentence starters and supports',
        status: 'awaiting',
        cycleCount: 0
      }
    ],
    processedThisCycle: 0,
    totalProcessed: 0,
    cyclesCompleted: 0,
    uptime: '0%'
  },
  {
    id: 'adapter',
    name: 'Adapter',
    fullTitle: 'Adaptation Agent',
    icon: '⚙️',
    role: 'Difficulty & Personalization Tuner',
    description: 'Adjusts difficulty and personalizes experience',
    status: 'awaiting',
    color: 'rose',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500',
    actions: [
      {
        id: 'adpt-1',
        name: 'Difficulty Calibration',
        description: 'Adjusts task difficulty based on performance',
        status: 'awaiting',
        cycleCount: 0
      },
      {
        id: 'adpt-2',
        name: 'Theme Personalization',
        description: 'Applies preferred themes and interests',
        status: 'awaiting',
        cycleCount: 0
      },
      {
        id: 'adpt-3',
        name: 'Pacing Control',
        description: 'Adjusts activity timing and transitions',
        status: 'awaiting',
        cycleCount: 0
      }
    ],
    processedThisCycle: 0,
    totalProcessed: 0,
    cyclesCompleted: 0,
    uptime: '0%'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    fullTitle: 'Privacy Guardian Agent',
    icon: '🛡️',
    role: 'Privacy & Encryption Enforcer',
    description: 'Enforces all privacy and data protection. ALWAYS MONITORING.',
    status: 'monitoring',
    color: 'indigo',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500',
    actions: [
      {
        id: 'guard-1',
        name: 'Data Encryption',
        description: 'Encrypts all sensitive interaction data',
        status: 'monitoring',
        cycleCount: 0
      },
      {
        id: 'guard-2',
        name: 'Access Gating',
        description: 'Controls data access between views',
        status: 'monitoring',
        cycleCount: 0
      }
    ],
    processedThisCycle: 0,
    totalProcessed: 0,
    cyclesCompleted: 0,
    uptime: '100%'
  }
];

// =============================================================================
// Data Store Class — manages all application state and persistence
// =============================================================================

class DataStore {
  private _backendStatus: 'connected' | 'disconnected' | 'connecting' = 'connecting';
  private _initialized = false;

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------

  async initialize(): Promise<void> {
    if (this._initialized) return;

    await database.init();
    await this.checkBackendConnection();
    this._initialized = true;
  }

  async checkBackendConnection(): Promise<boolean> {
    try {
      const isConnected = await llmService.checkConnection();
      this._backendStatus = isConnected ? 'connected' : 'disconnected';
      backendDriver.status = this._backendStatus;
      backendDriver.lastPing = new Date().toISOString();
      return isConnected;
    } catch {
      this._backendStatus = 'disconnected';
      backendDriver.status = 'disconnected';
      return false;
    }
  }

  get backendStatus(): 'connected' | 'disconnected' | 'connecting' {
    return this._backendStatus;
  }

  // -------------------------------------------------------------------------
  // Student Profile
  // -------------------------------------------------------------------------

  async getProfile(): Promise<StudentProfile | null> {
    const profile = await database.get<StudentProfile>('profiles', 'active-student');
    return profile || null;
  }

  async saveProfile(profile: StudentProfile): Promise<void> {
    await database.put('profiles', { ...profile, id: 'active-student' });
  }

  async createProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const profile: StudentProfile = {
      id: 'active-student',
      name: data.name || '',
      avatar: data.avatar || '🧒',
      age: data.age || 0,
      gradeLevel: data.gradeLevel || '',
      learningStyle: data.learningStyle || '',
      communicationMode: data.communicationMode || 'aac',
      communicationLevel: data.communicationLevel || '',
      streak: 0,
      totalSessions: 0,
      createdAt: new Date().toISOString()
    };
    await this.saveProfile(profile);
    return profile;
  }

  // -------------------------------------------------------------------------
  // Daily Schedule / Tasks
  // -------------------------------------------------------------------------

  async getSchedule(): Promise<PlannerTask[]> {
    const tasks = await database.getAll<PlannerTask>('sessions');
    return tasks.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }

  async saveSchedule(tasks: PlannerTask[]): Promise<void> {
    await database.clear('sessions');
    for (const task of tasks) {
      await database.put('sessions', task as unknown as Record<string, unknown>);
    }
  }

  async updateTask(taskId: string, updates: Partial<PlannerTask>): Promise<void> {
    const tasks = await this.getSchedule();
    const updated = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
    await this.saveSchedule(updated);
  }

  async generateSchedule(profile: StudentProfile): Promise<PlannerTask[]> {
    const isConnected = await this.checkBackendConnection();

    if (isConnected) {
      try {
        const prompt = `You are the Orchestrator Agent of AgentricAI-planner. Generate a daily learning schedule for:
Name: ${profile.name}
Age: ${profile.age}
Grade: ${profile.gradeLevel}
Learning Style: ${profile.learningStyle}
Communication Mode: ${profile.communicationMode}
Communication Level: ${profile.communicationLevel}

Return a JSON array of tasks. Each task must have:
- id (string, unique)
- name (string, activity name)
- type (one of: reading, math, art, writing, play, social_studies, communication, movement, break, creative)
- icon (single emoji)
- time (string, time like "8:00 AM")
- duration (number, minutes)
- status ("pending")
- engagement ("unknown")
- difficulty (number 1-5)
- content (object with "title" and "body" strings)
- agentSource (which agent created it)

Generate 6-8 age-appropriate activities. Return ONLY valid JSON, no markdown.`;

        const response = await llmService.generateText(prompt);
        if (response.error) throw new Error(response.error);

        const parsed = JSON.parse(response.text);
        const tasks: PlannerTask[] = Array.isArray(parsed) ? parsed : [];

        if (tasks.length > 0) {
          await this.saveSchedule(tasks);
          return tasks;
        }
      } catch (err) {
        console.error('Schedule generation failed, backend may need configuration:', err);
      }
    }

    // No schedule available — return empty (UI will show onboarding)
    return [];
  }

  // -------------------------------------------------------------------------
  // Interactions (Private — encrypted on-device)
  // -------------------------------------------------------------------------

  async recordInteraction(data: {
    taskId: string;
    taskType: string;
    startTime: string;
    endTime: string;
    durationMs: number;
    engagement: string;
    completionStatus: string;
    inputData?: Record<string, unknown>;
  }): Promise<void> {
    const interaction = {
      id: `interaction-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date().toISOString(),
      ...data
    };
    await database.put('interactions', interaction);
  }

  async getInteractionCount(): Promise<number> {
    const all = await database.getAll('interactions');
    return all.length;
  }

  // -------------------------------------------------------------------------
  // AI Insights (Generated by agents, stored locally)
  // -------------------------------------------------------------------------

  async getInsights(): Promise<AIInsight[]> {
    return database.getAll<AIInsight>('insights');
  }

  async addInsight(insight: AIInsight): Promise<void> {
    await database.put('insights', insight as unknown as Record<string, unknown>);
  }

  async generateInsights(profile: StudentProfile): Promise<AIInsight[]> {
    const interactions = await database.getAll('interactions');
    if (interactions.length === 0) return [];

    const isConnected = await this.checkBackendConnection();
    if (!isConnected) return await this.getInsights();

    try {
      const prompt = `You are the Analyst Agent of AgentricAI-planner. Based on ${interactions.length} recorded interactions for student "${profile.name}" (age ${profile.age}, ${profile.communicationMode} communication), generate AI insights.

Return a JSON array of insights. Each insight must have:
- id (unique string)
- type (one of: breakthrough, adaptation, milestone, pattern, recommendation)
- title (string)
- description (string)
- timestamp (ISO date string)
- agentSource (which agent: Analyst, Adapter, Orchestrator, Communicator, Curriculum)
- actionTaken (optional string, what was done)
- impactScore (optional number 1-100)

Generate 2-4 relevant insights based on the interaction count. Return ONLY valid JSON.`;

      const response = await llmService.generateText(prompt);
      if (response.error) throw new Error(response.error);

      const parsed = JSON.parse(response.text);
      const insights: AIInsight[] = Array.isArray(parsed) ? parsed : [];

      for (const insight of insights) {
        await this.addInsight(insight);
      }
      return insights;
    } catch {
      return await this.getInsights();
    }
  }

  // -------------------------------------------------------------------------
  // Progress Metrics (Computed from interactions)
  // -------------------------------------------------------------------------

  async getMetrics(): Promise<{
    progressMetrics: ProgressMetric[];
    weeklyData: WeeklyData[];
    skillProgress: SkillProgress[];
  }> {
    const stored = await database.get<Record<string, unknown>>('metrics', 'current-metrics');

    if (stored) {
      return stored as unknown as {
        progressMetrics: ProgressMetric[];
        weeklyData: WeeklyData[];
        skillProgress: SkillProgress[];
      };
    }

    // No metrics yet — return empty state
    return {
      progressMetrics: [
        { label: 'Engagement', value: 0, change: 0, trend: 'stable', icon: '💫', color: 'emerald' },
        { label: 'Completion', value: 0, change: 0, trend: 'stable', icon: '✅', color: 'sky' },
        { label: 'Focus Time', value: 0, change: 0, trend: 'stable', icon: '🎯', color: 'amber' },
        { label: 'Communication', value: 0, change: 0, trend: 'stable', icon: '💬', color: 'purple' }
      ],
      weeklyData: [],
      skillProgress: [
        { skill: 'Reading', progress: 0, current: 0, trend: 'stable', color: '#10b981' },
        { skill: 'Math', progress: 0, current: 0, trend: 'stable', color: '#3b82f6' },
        { skill: 'Writing', progress: 0, current: 0, trend: 'stable', color: '#f59e0b' },
        { skill: 'Communication', progress: 0, current: 0, trend: 'stable', color: '#8b5cf6' },
        { skill: 'Social', progress: 0, current: 0, trend: 'stable', color: '#ec4899' },
        { skill: 'Motor Skills', progress: 0, current: 0, trend: 'stable', color: '#14b8a6' }
      ]
    };
  }

  async updateMetrics(metrics: {
    progressMetrics: ProgressMetric[];
    weeklyData: WeeklyData[];
    skillProgress: SkillProgress[];
  }): Promise<void> {
    await database.put('metrics', { id: 'current-metrics', ...metrics } as unknown as Record<string, unknown>);
  }

  // -------------------------------------------------------------------------
  // Curriculum Frameworks
  // -------------------------------------------------------------------------

  async getFrameworks(): Promise<CurriculumFramework[]> {
    return database.getAll<CurriculumFramework>('curriculum');
  }

  async saveFramework(framework: CurriculumFramework): Promise<void> {
    await database.put('curriculum', framework as unknown as Record<string, unknown>);
  }

  async deleteFramework(id: string): Promise<void> {
    await database.delete('curriculum', id);
  }

  // -------------------------------------------------------------------------
  // Hive Status
  // -------------------------------------------------------------------------

  getHiveStatus(): HiveStatus {
    return {
      isActive: true,
      hiveState: 'awaiting',
      heartbeatMs: 100,
      currentCycle: 0,
      totalCycles: 0,
      agents: hiveAgents,
      backendDriver: backendDriver
    };
  }
}

export const dataStore = new DataStore();
export default DataStore;
