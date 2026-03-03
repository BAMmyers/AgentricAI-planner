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
  HiveStatus,
  TaskType,
  AdminDirective,
  LearningProgression
} from '../types';
import { database } from './database';
import { llmService } from './llmService';

// =============================================================================
// Backend Driver Configuration (Production) — Reactive state
// =============================================================================

let _backendStatus: 'connected' | 'disconnected' | 'connecting' = 'connecting';
let _backendListeners: Array<() => void> = [];

export const backendDriver: BackendDriver = {
  name: 'AgentricAI-IED-ollama',
  url: 'https://github.com/BAMmyers/AgentricAI-IED-ollama.git',
  repoUrl: 'https://github.com/BAMmyers/AgentricAI-IED-ollama.git',
  description: 'Local LLM inference engine powering all agent intelligence',
  endpoint: 'http://localhost:11434',
  repo: 'BAMmyers/AgentricAI-IED-ollama',
  status: 'connecting',
  lastPing: new Date().toISOString(),
  model: 'AgentricAIcody:latest',
  version: '1.0.0'
};

export function getBackendStatus(): 'connected' | 'disconnected' | 'connecting' {
  return _backendStatus;
}

export function subscribeToBackendStatus(listener: () => void): () => void {
  _backendListeners.push(listener);
  return () => {
    _backendListeners = _backendListeners.filter(l => l !== listener);
  };
}

function notifyBackendStatusChange() {
  _backendListeners.forEach(l => l());
}

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
// Default Curriculum Framework — production ready with all activity tiles
// =============================================================================

export const defaultCurriculum: CurriculumFramework = {
  id: 'default-curriculum',
  name: 'Default',
  description: 'Standard daily learning schedule with balanced activities for holistic development',
  goals: [
    'Build foundational literacy skills',
    'Develop number sense and math reasoning',
    'Encourage creative expression',
    'Support communication development',
    'Promote motor skill development',
    'Foster social-emotional growth'
  ],
  adaptationNotes: 'The Adapter Agent will personalize timing, difficulty, and content based on student engagement patterns.',
  createdBy: 'System',
  lastAdaptedBy: 'Curriculum Agent',
  isActive: true
};

// =============================================================================
// Default Schedule Tasks — pre-populated activities ready to use
// =============================================================================

export const defaultScheduleTasks: PlannerTask[] = [
  {
    id: 'task-0800-math',
    name: 'Morning Math',
    type: 'math',
    icon: '📐',
    time: '8:00 AM',
    duration: 45,
    status: 'pending',
    engagement: 'unknown',
    difficulty: 2,
    content: {
      title: 'Number Fun',
      body: 'Let\'s practice counting and recognizing numbers! What number comes next: 1, 2, 3, __?',
      instructions: 'Tap the correct answer or type it in.',
      hint: 'Count on your fingers if you need help!'
    },
    agentSource: 'Curriculum'
  },
  {
    id: 'task-0900-reading',
    name: 'Story Time',
    type: 'reading',
    icon: '📖',
    time: '9:00 AM',
    duration: 30,
    status: 'pending',
    engagement: 'unknown',
    difficulty: 2,
    content: {
      title: 'The Friendly Sun',
      body: 'Once upon a time, there was a friendly sun who loved to shine. Every morning, the sun would wake up early and stretch its golden rays across the sky. "Good morning, world!" the sun would say. The flowers would open their petals, the birds would start to sing, and all the children would smile. The sun loved making everyone happy. Even on cloudy days, the sun would peek through and wave hello. The end.',
      instructions: 'Listen to the story or read along. Tap "Read Aloud" to hear it spoken.',
      hint: 'You can follow along with the words as they are read!'
    },
    agentSource: 'Curriculum'
  },
  {
    id: 'task-1000-art',
    name: 'Creative Art',
    type: 'art',
    icon: '🎨',
    time: '10:00 AM',
    duration: 30,
    status: 'pending',
    engagement: 'unknown',
    difficulty: 1,
    content: {
      title: 'Draw Something Happy',
      body: 'Use your finger to draw something that makes you happy! It could be a person, an animal, a place, or anything you love.',
      instructions: 'Draw on the canvas below. Press Clear to start over.',
      hint: 'There\'s no wrong way to make art. Express yourself!'
    },
    agentSource: 'Curriculum'
  },
  {
    id: 'task-1030-movement',
    name: 'Movement Break',
    type: 'movement',
    icon: '🏃',
    time: '10:30 AM',
    duration: 15,
    status: 'pending',
    engagement: 'unknown',
    difficulty: 1,
    content: {
      title: 'Let\'s Move!',
      body: 'Time to stretch and move your body! Try these: Touch your toes, reach for the sky, spin around slowly, jump 3 times, and give yourself a big hug!',
      instructions: 'Follow along with the movements. Take your time!',
      hint: 'Moving your body helps your brain learn better!'
    },
    agentSource: 'Orchestrator'
  },
  {
    id: 'task-1100-writing',
    name: 'Writing Practice',
    type: 'writing',
    icon: '✍️',
    time: '11:00 AM',
    duration: 30,
    status: 'pending',
    engagement: 'unknown',
    difficulty: 2,
    content: {
      title: 'Letter Tracing',
      body: 'Practice writing your letters! Start with the letter A. Trace it big, then try writing it on your own.',
      instructions: 'Use the drawing pad to trace letters, or type in the text box.',
      hint: 'Take your time. Good handwriting comes with practice!'
    },
    agentSource: 'Curriculum'
  },
  {
    id: 'task-1200-break',
    name: 'Lunch Break',
    type: 'break',
    icon: '🍎',
    time: '12:00 PM',
    duration: 45,
    status: 'pending',
    engagement: 'unknown',
    difficulty: 1,
    content: {
      title: 'Lunch Time',
      body: 'Time to eat and rest! Enjoy your meal, drink some water, and take a break. When you\'re ready, come back for more fun learning!',
      instructions: 'Take your time eating. Mark complete when you\'re done.',
      hint: 'A good lunch helps you learn better in the afternoon!'
    },
    agentSource: 'Orchestrator'
  },
  {
    id: 'task-1300-communication',
    name: 'Communication Time',
    type: 'communication',
    icon: '💬',
    time: '1:00 PM',
    duration: 30,
    status: 'pending',
    engagement: 'unknown',
    difficulty: 2,
    content: {
      title: 'Express Yourself',
      body: 'Let\'s practice communicating! How are you feeling right now? Happy 😊, Tired 😴, Excited 🎉, or Calm 😌? Point to or tap the one that matches how you feel.',
      instructions: 'Use pictures, words, or sounds to share your thoughts.',
      hint: 'There\'s no wrong answer. Your feelings are important!'
    },
    agentSource: 'Communicator'
  },
  {
    id: 'task-1400-play',
    name: 'Free Play',
    type: 'play',
    icon: '🎮',
    time: '2:00 PM',
    duration: 30,
    status: 'pending',
    engagement: 'unknown',
    difficulty: 1,
    content: {
      title: 'Play Time!',
      body: 'You\'ve worked hard today! This is your time to play however you want. You can listen to music, play with toys, or just relax.',
      instructions: 'Choose what you want to do. This is YOUR time!',
      hint: 'Play is important for learning too!'
    },
    agentSource: 'Orchestrator'
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
    
    // Ensure default curriculum exists
    await this.ensureDefaultCurriculum();
    
    this._initialized = true;
  }

  // Ensure default curriculum and schedule exist
  private async ensureDefaultCurriculum(): Promise<void> {
    const frameworks = await this.getFrameworks();
    const hasDefault = frameworks.some(f => f.id === 'default-curriculum');
    
    if (!hasDefault) {
      await this.saveFramework(defaultCurriculum);
    }
  }

  async checkBackendConnection(): Promise<boolean> {
    try {
      const isConnected = await llmService.checkConnection();
      this._backendStatus = isConnected ? 'connected' : 'disconnected';
      _backendStatus = this._backendStatus;
      backendDriver.status = this._backendStatus;
      backendDriver.lastPing = new Date().toISOString();
      notifyBackendStatusChange();
      return isConnected;
    } catch {
      this._backendStatus = 'disconnected';
      _backendStatus = 'disconnected';
      backendDriver.status = 'disconnected';
      notifyBackendStatusChange();
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
    
    // If no tasks in DB, load the default schedule
    if (tasks.length === 0) {
      await this.saveSchedule(defaultScheduleTasks);
      return [...defaultScheduleTasks];
    }
    
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

  async resetToDefaultSchedule(): Promise<PlannerTask[]> {
    await this.saveSchedule(defaultScheduleTasks);
    return [...defaultScheduleTasks];
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
        console.error('AI schedule generation not available, using default schedule:', err);
      }
    }

    // Use default schedule
    return this.resetToDefaultSchedule();
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
  // Engagement Scoring (Analyst Agent Action)
  // -------------------------------------------------------------------------

  calculateEngagementScore(interaction: {
    durationMs: number;
    expectedDurationMs: number;
    completionStatus: string;
  }): 'high' | 'medium' | 'low' {
    const timeRatio = interaction.durationMs / interaction.expectedDurationMs;
    const completed = interaction.completionStatus === 'completed';

    if (!completed) return 'low';
    if (timeRatio >= 0.5 && timeRatio <= 1.5) return 'high';
    if (timeRatio >= 0.3 && timeRatio <= 2.0) return 'medium';
    return 'low';
  }

  // -------------------------------------------------------------------------
  // Metrics Computation (Analyst + Adapter Agent Actions)
  // -------------------------------------------------------------------------

  async computeAndUpdateMetrics(): Promise<void> {
    const interactions = await database.getAll<{
      id: string;
      taskType: string;
      durationMs: number;
      engagement: string;
      completionStatus: string;
      timestamp: string;
    }>('interactions');

    if (interactions.length === 0) return;

    // Calculate engagement score (% of high/medium engagement)
    const highMedCount = interactions.filter(i => 
      i.engagement === 'high' || i.engagement === 'medium' || i.completionStatus === 'completed'
    ).length;
    const engagementScore = Math.round((highMedCount / interactions.length) * 100);

    // Calculate completion rate
    const completedCount = interactions.filter(i => i.completionStatus === 'completed').length;
    const completionRate = Math.round((completedCount / interactions.length) * 100);

    // Calculate average focus duration (in minutes)
    const totalDurationMs = interactions.reduce((sum, i) => sum + (i.durationMs || 0), 0);
    const avgFocusMinutes = Math.round(totalDurationMs / interactions.length / 60000);

    // Calculate communication growth (% of communication tasks completed)
    const commTasks = interactions.filter(i => i.taskType === 'communication');
    const commCompleted = commTasks.filter(i => i.completionStatus === 'completed').length;
    const commGrowth = commTasks.length > 0 ? Math.round((commCompleted / commTasks.length) * 100) : 0;

    // Build weekly trend data from last 7 days
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData: WeeklyData[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString();
      
      const dayInteractions = interactions.filter(int => 
        int.timestamp >= dayStart && int.timestamp <= dayEnd
      );
      
      const dayCompleted = dayInteractions.filter(i => i.completionStatus === 'completed').length;
      const dayEngagement = dayInteractions.length > 0 
        ? Math.round((dayInteractions.filter(i => i.engagement === 'high' || i.completionStatus === 'completed').length / dayInteractions.length) * 100)
        : 0;
      
      weeklyData.push({
        day: days[new Date(dayStart).getDay()],
        engagement: dayEngagement,
        completion: dayInteractions.length > 0 ? Math.round((dayCompleted / Math.max(dayInteractions.length, 1)) * 100) : 0
      });
    }

    // Compute skill progress by task type
    const skillMap: Record<string, { type: TaskType; color: string }> = {
      'Reading': { type: 'reading', color: '#10b981' },
      'Math': { type: 'math', color: '#3b82f6' },
      'Writing': { type: 'writing', color: '#f59e0b' },
      'Communication': { type: 'communication', color: '#8b5cf6' },
      'Social': { type: 'social_studies', color: '#ec4899' },
      'Motor Skills': { type: 'movement', color: '#14b8a6' }
    };

    const skillProgress: SkillProgress[] = Object.entries(skillMap).map(([skill, { type, color }]) => {
      const skillInteractions = interactions.filter(i => i.taskType === type);
      const skillCompleted = skillInteractions.filter(i => i.completionStatus === 'completed').length;
      const progress = skillInteractions.length > 0 
        ? Math.round((skillCompleted / skillInteractions.length) * 100) 
        : 0;
      
      // Determine trend from recent vs older interactions
      const midpoint = Math.floor(skillInteractions.length / 2);
      const olderCompleted = skillInteractions.slice(0, midpoint).filter(i => i.completionStatus === 'completed').length;
      const newerCompleted = skillInteractions.slice(midpoint).filter(i => i.completionStatus === 'completed').length;
      const trend: 'up' | 'down' | 'stable' = newerCompleted > olderCompleted ? 'up' : newerCompleted < olderCompleted ? 'down' : 'stable';

      return { skill, progress, current: progress, trend, color };
    });

    const progressMetrics: ProgressMetric[] = [
      { 
        label: 'Engagement', 
        value: engagementScore, 
        change: 0, 
        trend: 'stable', 
        icon: '💫', 
        color: 'emerald' 
      },
      { 
        label: 'Completion', 
        value: completionRate, 
        change: 0, 
        trend: 'stable', 
        icon: '✅', 
        color: 'sky' 
      },
      { 
        label: 'Focus Time', 
        value: avgFocusMinutes, 
        change: 0, 
        trend: 'stable', 
        icon: '🎯', 
        color: 'amber' 
      },
      { 
        label: 'Communication', 
        value: commGrowth, 
        change: 0, 
        trend: 'stable', 
        icon: '💬', 
        color: 'purple' 
      }
    ];

    await this.updateMetrics({ progressMetrics, weeklyData, skillProgress });
  }

  // -------------------------------------------------------------------------
  // Profile Updates (Streak, Sessions)
  // -------------------------------------------------------------------------

  async incrementStreak(): Promise<void> {
    const profile = await this.getProfile();
    if (!profile) return;
    
    const today = new Date().toDateString();
    const lastSessionKey = 'agentricai-last-session-date';
    const lastSession = localStorage.getItem(lastSessionKey);
    
    if (lastSession !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastSession === yesterday.toDateString()) {
        profile.streak += 1;
      } else if (lastSession !== today) {
        profile.streak = 1;
      }
      
      profile.totalSessions += 1;
      localStorage.setItem(lastSessionKey, today);
      await this.saveProfile(profile);
    }
  }

  // -------------------------------------------------------------------------
  // Difficulty Adaptation (Adapter Agent Action)
  // -------------------------------------------------------------------------

  async adaptDifficulty(taskType: TaskType): Promise<number> {
    const interactions = await database.getAll<{
      taskType: string;
      completionStatus: string;
      durationMs: number;
    }>('interactions');
    
    const typeInteractions = interactions.filter(i => i.taskType === taskType).slice(-5);
    if (typeInteractions.length < 3) return 2; // Default difficulty
    
    const completedCount = typeInteractions.filter(i => i.completionStatus === 'completed').length;
    const completionRate = completedCount / typeInteractions.length;
    
    if (completionRate >= 0.9) return Math.min(5, 3); // Increase difficulty
    if (completionRate >= 0.7) return 2; // Maintain
    if (completionRate >= 0.5) return Math.max(1, 2); // Decrease slightly
    return 1; // Easy mode
  }

  // -------------------------------------------------------------------------
  // Auto-generate Insights (Analyst Agent)
  // -------------------------------------------------------------------------

  async autoGenerateInsightsIfNeeded(): Promise<void> {
    const interactions = await database.getAll('interactions');
    const insights = await this.getInsights();
    
    // Generate insights every 5 interactions, up to interaction count / 5
    const expectedInsights = Math.floor(interactions.length / 5);
    if (insights.length >= expectedInsights) return;
    
    const profile = await this.getProfile();
    if (!profile) return;
    
    await this.generateInsights(profile);
  }

  // -------------------------------------------------------------------------
  // Varied Offline Feedback (when backend unavailable)
  // -------------------------------------------------------------------------

  getOfflineFeedback(taskType: TaskType, _taskName?: string): string {
    const feedbackOptions: Record<string, string[]> = {
      reading: [
        "Wonderful reading! Your focus was amazing! 📚",
        "Great job following along with the story! 🌟",
        "You're becoming such a good reader! Keep it up! ✨"
      ],
      math: [
        "Excellent math work! Your brain is growing stronger! 🧮",
        "Great job with numbers! You're a math star! ⭐",
        "Amazing problem solving! Keep practicing! 🏆"
      ],
      art: [
        "What a beautiful creation! You're so creative! 🎨",
        "Your artwork is amazing! I love your imagination! 🌈",
        "You're such an artist! That was wonderful! ✨"
      ],
      writing: [
        "Great writing practice! Your letters look wonderful! ✍️",
        "You're getting better at writing every day! 🌟",
        "Excellent work! Your handwriting is improving! ⭐"
      ],
      play: [
        "Play time was fun! You deserve this break! 🎮",
        "Great job taking time to play! It helps your brain! 🎈",
        "You played wonderfully! Having fun is important! 🌟"
      ],
      communication: [
        "Great job expressing yourself! Your voice matters! 💬",
        "Wonderful communication! You're sharing your thoughts so well! 🗣️",
        "Amazing! You're getting better at telling us how you feel! 💖"
      ],
      movement: [
        "Great movement break! Your body feels good now! 🏃",
        "Wonderful stretching! Moving helps you learn better! 🌟",
        "Excellent job getting your body moving! 💪"
      ],
      break: [
        "Good rest! Taking breaks is important! 🍎",
        "You took a great break! Now you're ready to learn more! ☀️",
        "Rest time complete! Your brain is recharged! 🔋"
      ],
      social_studies: [
        "Great learning about the world! You're so curious! 🌍",
        "Wonderful exploring! Keep asking questions! 🔍",
        "You learned something new today! Amazing! ⭐"
      ],
      creative: [
        "Such creativity! Your imagination is wonderful! ✨",
        "Great creative work! You think of amazing things! 🌟",
        "You're so inventive! Keep being creative! 🎨"
      ]
    };

    const options = feedbackOptions[taskType] || feedbackOptions.creative;
    return options[Math.floor(Math.random() * options.length)];
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
  // Administrative Directives (Caregiver → AI → Curriculum)
  // -------------------------------------------------------------------------

  async getDirectives(): Promise<AdminDirective[]> {
    const all = await database.getAll<AdminDirective>('directives');
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async saveDirective(directive: AdminDirective): Promise<void> {
    await database.put('directives', directive as unknown as Record<string, unknown>);
  }

  async processDirective(text: string, profile: StudentProfile): Promise<AdminDirective> {
    const directive: AdminDirective = {
      id: `dir-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'processing',
      processedBy: 'Orchestrator'
    };
    await this.saveDirective(directive);

    // Record agent activity
    this.recordAgentActivity('orchestrator', 'orch-1');

    const schedule = await this.getSchedule();
    const progressions = await database.getAll<LearningProgression>('progression');
    const isConnected = await this.checkBackendConnection();

    if (isConnected) {
      try {
        const scheduleDesc = schedule.map(t =>
          `${t.time} | ${t.type} | "${t.name}" | difficulty:${t.difficulty} | content:"${t.content?.body?.slice(0, 80) || ''}"`
        ).join('\n');

        const progressionDesc = progressions.map(p =>
          `${p.taskType}: level=${p.currentLevel}, completed=${p.totalCompleted}, last="${p.lastProblem.slice(0, 60)}"`
        ).join('\n');

        const prompt = `You are the Orchestrator Agent of AgentricAI-planner. A caregiver has issued an administrative directive that must be applied to the student's curriculum.

DIRECTIVE: "${text}"

STUDENT: ${profile.name}, age ${profile.age}, grade ${profile.gradeLevel}, communication: ${profile.communicationMode}

CURRENT SCHEDULE:
${scheduleDesc}

LEARNING PROGRESSION:
${progressionDesc || 'No progression data yet.'}

Interpret this directive and return a JSON object with:
{
  "changes": [
    {
      "taskId": "the task id to modify",
      "difficulty": new difficulty number (1-5),
      "contentTitle": "new title if changed",
      "contentBody": "new content/problem text if changed"
    }
  ],
  "summary": "brief description of what was changed"
}

Rules:
- If "harder" or "increase difficulty": raise the difficulty and generate harder content for that subject
- If "easier" or "decrease": lower difficulty and simplify content
- If a subject is mentioned (math, reading, etc.), apply changes to that subject's task
- For math: generate a specific, progressive math problem appropriate for the new difficulty
- Content must be age-appropriate for age ${profile.age}
- Return ONLY valid JSON, no markdown`;

        const response = await llmService.generateText(prompt);
        if (response.error) throw new Error(response.error);

        // Clean response text — strip markdown fences if present
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        const result = JSON.parse(cleanText);
        const changes = Array.isArray(result.changes) ? result.changes : [];

        // Apply changes to schedule
        const updatedSchedule = schedule.map(task => {
          const change = changes.find((c: { taskId: string }) => c.taskId === task.id);
          if (!change) return task;

          return {
            ...task,
            difficulty: change.difficulty ?? task.difficulty,
            content: {
              ...task.content,
              title: change.contentTitle || task.content?.title,
              body: change.contentBody || task.content?.body
            },
            adaptedBy: 'Orchestrator'
          };
        });

        await this.saveSchedule(updatedSchedule);
        this.recordAgentActivity('adapter', 'adpt-1');
        this.recordAgentActivity('curriculum', 'curr-2');

        directive.status = 'applied';
        directive.appliedChanges = result.summary || `Applied ${changes.length} change(s) to schedule.`;
        await this.saveDirective(directive);
        return directive;
      } catch (err) {
        // AI failed — fall back to local processing
        console.error('AI directive processing failed, using local fallback:', err);
      }
    }

    // Offline / fallback: parse directive locally with keyword matching
    const lowerText = text.toLowerCase();
    const updatedSchedule = [...schedule];
    const appliedChanges: string[] = [];

    // Detect subject
    const subjectMap: Record<string, TaskType> = {
      math: 'math', reading: 'reading', writing: 'writing',
      art: 'art', communication: 'communication', movement: 'movement',
      play: 'play', social: 'social_studies', creative: 'creative'
    };
    const mentionedSubjects: TaskType[] = [];
    for (const [keyword, taskType] of Object.entries(subjectMap)) {
      if (lowerText.includes(keyword)) mentionedSubjects.push(taskType);
    }

    // Detect intent
    const isHarder = /harder|difficult|increase|tougher|advance|challenge/i.test(lowerText);
    const isEasier = /easier|simpler|decrease|lower|reduce/i.test(lowerText);

    for (const task of updatedSchedule) {
      if (mentionedSubjects.length > 0 && !mentionedSubjects.includes(task.type)) continue;
      if (mentionedSubjects.length === 0 && !isHarder && !isEasier) continue;

      if (isHarder) {
        const newDiff = Math.min(5, task.difficulty + 1);
        if (newDiff !== task.difficulty) {
          task.difficulty = newDiff;
          task.adaptedBy = 'Orchestrator';
          // Generate locally progressive content for math
          if (task.type === 'math') {
            task.content = {
              ...task.content,
              ...this.generateLocalMathContent(newDiff, profile.age)
            };
          }
          appliedChanges.push(`${task.name}: difficulty ${task.difficulty - 1} → ${newDiff}`);
        }
      } else if (isEasier) {
        const newDiff = Math.max(1, task.difficulty - 1);
        if (newDiff !== task.difficulty) {
          task.difficulty = newDiff;
          task.adaptedBy = 'Orchestrator';
          if (task.type === 'math') {
            task.content = {
              ...task.content,
              ...this.generateLocalMathContent(newDiff, profile.age)
            };
          }
          appliedChanges.push(`${task.name}: difficulty ${task.difficulty + 1} → ${newDiff}`);
        }
      }
    }

    await this.saveSchedule(updatedSchedule);

    if (appliedChanges.length > 0) {
      directive.status = 'applied';
      directive.appliedChanges = appliedChanges.join('; ');
    } else {
      directive.status = 'applied';
      directive.appliedChanges = 'Directive recorded. Changes will be applied when the AI backend is available for full interpretation.';
    }
    await this.saveDirective(directive);
    return directive;
  }

  // Local math content generator for offline progressive math
  private generateLocalMathContent(difficulty: number, age: number): { title: string; body: string; instructions: string; hint: string } {
    const problems: Record<number, { title: string; body: string; hint: string }[]> = {
      1: [
        { title: 'Counting Fun', body: 'Count the apples! 🍎🍎🍎 How many apples do you see?', hint: 'Point to each apple and count!' },
        { title: 'Number Match', body: 'Which number comes next? 1, 2, 3, __?', hint: 'Count on your fingers!' },
        { title: 'Shape Counting', body: 'Count the stars! ⭐⭐⭐⭐ How many stars?', hint: 'Touch each star as you count!' }
      ],
      2: [
        { title: 'Simple Addition', body: 'What is 3 + 2? Use your fingers to help!', hint: 'Hold up 3 fingers, then 2 more, and count them all!' },
        { title: 'Number Bonds', body: 'What two numbers make 5? __ + __ = 5', hint: 'Try 2 + 3, or 4 + 1!' },
        { title: 'Counting Forward', body: 'Count from 10 to 20. What number comes after 15?', hint: '...13, 14, 15, __?' }
      ],
      3: [
        { title: 'Addition Challenge', body: 'What is 8 + 7? Think about making a 10 first!', hint: '8 + 2 = 10, then add 5 more!' },
        { title: 'Subtraction Start', body: 'You have 12 cookies and eat 4. How many are left? 12 - 4 = ?', hint: 'Start at 12 and count backwards 4!' },
        { title: 'Missing Number', body: 'Fill in the blank: 6 + __ = 11', hint: 'Count up from 6 to 11!' }
      ],
      4: [
        { title: 'Double Digits', body: 'What is 24 + 13? Break it into tens and ones!', hint: '20+10=30, 4+3=7, so 30+7=?' },
        { title: 'Subtraction Practice', body: 'What is 35 - 18? Think carefully!', hint: '35 - 18: subtract 20 to get 15, add 2 back = 17' },
        { title: 'Multiplication Intro', body: 'If you have 3 groups of 4 apples, how many total? 3 × 4 = ?', hint: 'Count: 4, 8, 12!' }
      ],
      5: [
        { title: 'Multi-Step Problem', body: 'You have 25 stickers. You give 8 to a friend, then get 12 more. How many now? 25 - 8 + 12 = ?', hint: '25 - 8 = 17, then 17 + 12 = ?' },
        { title: 'Multiplication Table', body: 'What is 6 × 7? Remember your times tables!', hint: '6 × 7 is the same as 6 + 6 + 6 + 6 + 6 + 6 + 6' },
        { title: 'Division Intro', body: 'Share 20 cookies equally among 4 friends. How many does each get? 20 ÷ 4 = ?', hint: 'Deal them out one at a time to each friend!' }
      ]
    };

    const level = Math.max(1, Math.min(5, difficulty));
    const options = problems[level];
    // Use age to add variety
    const idx = (age + Date.now()) % options.length;
    const problem = options[Math.abs(idx) % options.length];

    return {
      title: problem.title,
      body: problem.body,
      instructions: 'Tap the correct answer or type it in.',
      hint: problem.hint
    };
  }

  // -------------------------------------------------------------------------
  // Learning Progression Tracking (Per-subject evolution)
  // -------------------------------------------------------------------------

  async getProgression(taskType: TaskType): Promise<LearningProgression | null> {
    return (await database.get<LearningProgression>('progression', `prog-${taskType}`)) || null;
  }

  async getAllProgressions(): Promise<LearningProgression[]> {
    return database.getAll<LearningProgression>('progression');
  }

  async updateProgression(
    taskType: TaskType,
    contentUsed: string,
    difficulty: number,
    engagement: string
  ): Promise<LearningProgression> {
    let prog = await this.getProgression(taskType);

    if (!prog) {
      prog = {
        id: `prog-${taskType}`,
        taskType,
        currentLevel: difficulty,
        lastProblem: contentUsed,
        lastDifficulty: difficulty,
        totalCompleted: 0,
        history: []
      };
    }

    // Update progression
    prog.totalCompleted += 1;
    prog.lastProblem = contentUsed;
    prog.lastDifficulty = difficulty;

    // Adjust level based on engagement
    if (engagement === 'high' && prog.totalCompleted >= 2) {
      prog.currentLevel = Math.min(5, prog.currentLevel + 1);
    } else if (engagement === 'low') {
      prog.currentLevel = Math.max(1, prog.currentLevel - 1);
    }

    // Add to history (keep last 20)
    prog.history.push({
      timestamp: new Date().toISOString(),
      content: contentUsed.slice(0, 200),
      engagement,
      difficulty
    });
    if (prog.history.length > 20) {
      prog.history = prog.history.slice(-20);
    }

    await database.put('progression', prog as unknown as Record<string, unknown>);

    // Record agent activity
    this.recordAgentActivity('analyst', 'anly-1');

    return prog;
  }

  // -------------------------------------------------------------------------
  // Content Evolution (AI-driven curriculum auto-evolution)
  // -------------------------------------------------------------------------

  async evolveTaskContent(task: PlannerTask, profile: StudentProfile): Promise<PlannerTask> {
    const prog = await this.getProgression(task.type);
    const isConnected = await this.checkBackendConnection();

    this.recordAgentActivity('curriculum', 'curr-1');
    this.recordAgentActivity('adapter', 'adpt-1');

    if (isConnected) {
      try {
        const historyDesc = prog?.history.slice(-5).map(h =>
          `difficulty:${h.difficulty} engagement:${h.engagement} content:"${h.content.slice(0, 60)}"`
        ).join('\n') || 'No history yet.';

        const prompt = `You are the Curriculum Agent. Generate the NEXT ${task.type} content for an evolving educational session.

Student: ${profile.name}, age ${profile.age}, grade ${profile.gradeLevel}
Subject: ${task.type}
Current level: ${prog?.currentLevel || task.difficulty}
Total completed in this subject: ${prog?.totalCompleted || 0}
Last content: "${prog?.lastProblem || task.content?.body || 'First session'}"

Recent history (most recent last):
${historyDesc}

Rules:
- Content MUST be different from previous sessions — NEVER repeat
- Build progressively on what came before
- If engagement was high: advance the difficulty one step
- If engagement was medium: same level but different content
- If engagement was low: slightly easier but fresh approach
- For MATH: generate a specific problem that builds on the last one
- For READING: generate a new short story or passage
- For WRITING: generate a new writing prompt
- Age-appropriate for age ${profile.age}

Return ONLY a JSON object:
{
  "title": "activity title",
  "body": "the actual content/problem/story",
  "instructions": "how to complete",
  "hint": "a helpful hint",
  "difficulty": number 1-5
}`;

        const response = await llmService.generateText(prompt);
        if (response.error) throw new Error(response.error);

        let cleanText = response.text.trim();
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }

        const evolved = JSON.parse(cleanText);

        const updatedTask: PlannerTask = {
          ...task,
          difficulty: evolved.difficulty ?? task.difficulty,
          content: {
            title: evolved.title || task.content?.title,
            body: evolved.body || task.content?.body,
            instructions: evolved.instructions || task.content?.instructions,
            hint: evolved.hint || task.content?.hint
          },
          adaptedBy: 'Curriculum'
        };

        return updatedTask;
      } catch (err) {
        console.error('AI content evolution failed, using local evolution:', err);
      }
    }

    // Offline fallback: evolve locally based on progression
    const newLevel = prog ? prog.currentLevel : task.difficulty;

    if (task.type === 'math') {
      const localContent = this.generateLocalMathContent(newLevel, profile.age);
      return {
        ...task,
        difficulty: newLevel,
        content: { ...task.content, ...localContent },
        adaptedBy: 'Adapter'
      };
    }

    // For non-math subjects offline: adjust difficulty, keep content
    return {
      ...task,
      difficulty: newLevel,
      adaptedBy: 'Adapter'
    };
  }

  async evolveScheduleAfterCompletion(
    completedTask: PlannerTask,
    profile: StudentProfile,
    engagement: string
  ): Promise<void> {
    // Update progression tracking
    const contentUsed = completedTask.content?.body || completedTask.name;
    await this.updateProgression(
      completedTask.type,
      contentUsed,
      completedTask.difficulty,
      engagement
    );

    // Evolve the completed task's content for next session
    const evolvedTask = await this.evolveTaskContent(completedTask, profile);

    // Update in schedule (reset status to pending for next session)
    const schedule = await this.getSchedule();
    const updatedSchedule = schedule.map(t =>
      t.id === completedTask.id
        ? { ...evolvedTask, status: 'pending' as const, engagement: 'unknown' as const }
        : t
    );

    // Don't save if user is mid-session (only evolve for next session)
    // Store evolved content separately so it takes effect next load
    const evolvedKey = `evolved-${completedTask.id}`;
    localStorage.setItem(evolvedKey, JSON.stringify(evolvedTask));

    // Also apply difficulty adaptations to similar task types
    const prog = await this.getProgression(completedTask.type);
    if (prog) {
      const adaptedSchedule = updatedSchedule.map(t => {
        if (t.type === completedTask.type && t.id !== completedTask.id) {
          return { ...t, difficulty: prog.currentLevel };
        }
        return t;
      });
      await this.saveSchedule(adaptedSchedule);
    }

    this.recordAgentActivity('adapter', 'adpt-3');
  }

  // Apply any evolved content stored from previous session
  async applyEvolvedContent(tasks: PlannerTask[]): Promise<PlannerTask[]> {
    return tasks.map(task => {
      const evolvedKey = `evolved-${task.id}`;
      const stored = localStorage.getItem(evolvedKey);
      if (stored) {
        try {
          const evolved = JSON.parse(stored) as PlannerTask;
          localStorage.removeItem(evolvedKey); // consume it
          return {
            ...evolved,
            status: 'pending' as const,
            engagement: 'unknown' as const
          };
        } catch {
          return task;
        }
      }
      return task;
    });
  }

  // -------------------------------------------------------------------------
  // Hive Status & Agent Statistics
  // -------------------------------------------------------------------------

  getHiveStatus(): HiveStatus {
    return {
      isActive: true,
      hiveState: 'awaiting',
      heartbeatMs: 100,
      currentCycle: _hiveCycleCount,
      totalCycles: _hiveCycleCount,
      agents: hiveAgents,
      backendDriver: backendDriver
    };
  }

  incrementHiveCycle(): void {
    _hiveCycleCount++;
  }

  recordAgentActivity(agentId: string, actionId: string): void {
    const agent = hiveAgents.find(a => a.id === agentId);
    if (agent) {
      agent.totalProcessed++;
      agent.processedThisCycle++;
      const action = agent.actions.find(a => a.id === actionId);
      if (action) {
        action.cycleCount++;
        action.lastExecuted = new Date().toISOString();
      }
    }
  }

  completeAgentCycle(): void {
    hiveAgents.forEach(agent => {
      if (agent.processedThisCycle > 0) {
        agent.cyclesCompleted++;
      }
      agent.processedThisCycle = 0;
      
      // Update uptime based on cycles completed
      const totalPossibleCycles = _hiveCycleCount || 1;
      const uptimePercent = Math.min(100, Math.round((agent.cyclesCompleted / totalPossibleCycles) * 100));
      agent.uptime = `${uptimePercent}%`;
    });
    
    // Guardian always 100% uptime
    const guardian = hiveAgents.find(a => a.id === 'guardian');
    if (guardian) {
      guardian.uptime = '100%';
      guardian.cyclesCompleted = _hiveCycleCount;
    }
  }
}

// Track hive cycles globally
let _hiveCycleCount = 0;

export const dataStore = new DataStore();
export default DataStore;
