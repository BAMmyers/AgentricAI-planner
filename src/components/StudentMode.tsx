// =============================================================================
// Student Explorer Mode - AgentricAI-planner
// Private, adaptive daily schedule — all interactions encrypted locally
// Backend: AgentricAI-IED-ollama
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import type { PlannerTask, StudentProfile, HiveAgent, HiveState, AgentStatus } from '../types';
import { hiveAgents as hiveAgentDefs } from '../services/dataStore';
import { dataStore } from '../services/dataStore';
import { llmService } from '../services/llmService';
import ActivityCard from './ActivityCard';
import ActivityView from './ActivityView';

interface StudentModeProps {
  profile: StudentProfile;
  onBack: () => void;
}

export default function StudentMode({ profile, onBack }: StudentModeProps) {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [activeTask, setActiveTask] = useState<PlannerTask | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [taskStartTime, setTaskStartTime] = useState<string | null>(null);

  // Hive state
  const [hiveState, setHiveState] = useState<HiveState>('awaiting');
  const [agents, setAgents] = useState<HiveAgent[]>(
    hiveAgentDefs.map(a => ({ ...a }))
  );

  // Load schedule on mount — apply any evolved content from previous session
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const schedule = await dataStore.getSchedule();
      // Apply evolved content from previous session (content evolution takes effect here)
      const evolvedSchedule = await dataStore.applyEvolvedContent(schedule);
      // If content was evolved, persist the updated schedule
      const hasEvolved = evolvedSchedule.some((t, i) =>
        t.content?.body !== schedule[i]?.content?.body || t.difficulty !== schedule[i]?.difficulty
      );
      if (hasEvolved) {
        await dataStore.saveSchedule(evolvedSchedule);
      }
      setTasks(evolvedSchedule);
      setIsLoading(false);
    };
    load();
  }, [profile]);

  // Calculate progress
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Activate hive
  const activateHive = useCallback((_taskType: string) => {
    setHiveState('executing');
    setAgents(prev => prev.map(agent => {
      if (agent.id === 'guardian') return agent;
      return {
        ...agent,
        status: 'engaged' as AgentStatus,
        actions: agent.actions.map(action => ({
          ...action,
          status: 'engaged' as AgentStatus,
          cycleCount: action.cycleCount + 1
        }))
      };
    }));
  }, []);

  // Return to awaiting
  const returnToAwaiting = useCallback(() => {
    setHiveState('awaiting');
    setAgents(prev => prev.map(agent => {
      if (agent.id === 'guardian') return agent;
      return {
        ...agent,
        status: 'awaiting' as AgentStatus,
        actions: agent.actions.map(action => ({
          ...action,
          status: 'awaiting' as AgentStatus
        }))
      };
    }));
  }, []);

  // Start task
  const handleStartTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === 'completed') return;

    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'current' as const } : t
    ));

    activateHive(task.type);
    setActiveTask(task);
    setFeedback(null);
    setTaskStartTime(new Date().toISOString());
  };

  // Complete task
  const handleCompleteTask = async () => {
    if (!activeTask) return;

    setIsFeedbackLoading(true);
    setHiveState('completing');

    const endTime = new Date().toISOString();
    const durationMs = taskStartTime
      ? new Date(endTime).getTime() - new Date(taskStartTime).getTime()
      : 0;

    // Calculate engagement score via Analyst agent
    const expectedDurationMs = activeTask.duration * 60 * 1000;
    const engagementLevel = dataStore.calculateEngagementScore({
      durationMs,
      expectedDurationMs,
      completionStatus: 'completed'
    });

    // Record agent activity (Analyst: Engagement Scoring)
    dataStore.recordAgentActivity('analyst', 'anly-2');

    // Record interaction with computed engagement
    await dataStore.recordInteraction({
      taskId: activeTask.id,
      taskType: activeTask.type,
      startTime: taskStartTime || endTime,
      endTime,
      durationMs,
      engagement: engagementLevel,
      completionStatus: 'completed'
    });

    // Record agent activity (Guardian: Data Encryption)
    dataStore.recordAgentActivity('guardian', 'guard-1');

    // Generate feedback via IED-ollama
    const prompt = `You are a supportive educational AI companion for a child named ${profile.name}. They just completed a "${activeTask.name}" activity (${activeTask.type}).
Give brief, encouraging feedback in 1-2 sentences. Be warm, positive, and age-appropriate for age ${profile.age}.
Focus on effort and growth. Communication mode: ${profile.communicationMode}.`;

    const response = await llmService.generateText(prompt);

    if (response.error) {
      // Use varied offline feedback instead of hardcoded message
      setFeedback(dataStore.getOfflineFeedback(activeTask.type));
    } else {
      setFeedback(response.text);
    }

    setIsFeedbackLoading(false);

    // Update task with computed engagement
    const updatedTasks = tasks.map(t =>
      t.id === activeTask.id ? { ...t, status: 'completed' as const, engagement: engagementLevel } : t
    );
    setTasks(updatedTasks);

    // Persist updated schedule (use updatedTasks, not stale closure)
    await dataStore.saveSchedule(updatedTasks);

    // Compute and update metrics (Analyst + Adapter agents)
    dataStore.recordAgentActivity('analyst', 'anly-1');
    await dataStore.computeAndUpdateMetrics();

    // Adapt difficulty for this task type (Adapter agent)
    dataStore.recordAgentActivity('adapter', 'adpt-1');
    await dataStore.adaptDifficulty(activeTask.type);

    // Evolve content for next session (Curriculum + Adapter agents)
    // This generates new, progressive content so the curriculum never stagnates
    await dataStore.evolveScheduleAfterCompletion(activeTask, profile, engagementLevel);

    // Auto-generate insights if threshold reached
    await dataStore.autoGenerateInsightsIfNeeded();

    // Complete the hive cycle
    dataStore.incrementHiveCycle();
    dataStore.completeAgentCycle();

    // Increment streak on first completion of the day
    await dataStore.incrementStreak();
  };

  // Close activity view
  const handleCloseActivity = () => {
    setActiveTask(null);
    setFeedback(null);
    setTaskStartTime(null);
    returnToAwaiting();
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const hiveDisplay = {
    awaiting: { color: 'bg-amber-400', pulse: false, label: 'Hive Ready' },
    executing: { color: 'bg-green-400', pulse: true, label: 'Hive Active' },
    completing: { color: 'bg-blue-400', pulse: true, label: 'Completing...' }
  }[hiveState];

  const engagedCount = agents.filter(a => a.status === 'engaged').length;
  const monitoringCount = agents.filter(a => a.status === 'monitoring').length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">{profile.avatar}</div>
          <h2 className="text-2xl font-bold mb-2">Preparing your schedule...</h2>
          <p className="text-neutral-400">The hive is assembling your activities</p>
          <div className="flex justify-center gap-2 mt-6">
            {agents.map(a => (
              <span key={a.id} className="text-xl">{a.icon}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-sm border-b border-neutral-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Exit</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-full">
              <div className={`w-2.5 h-2.5 rounded-full ${hiveDisplay?.color || 'bg-gray-400'} ${hiveDisplay?.pulse ? 'animate-pulse' : ''}`} />
              <span className="text-xs text-gray-300">{hiveDisplay?.label || 'Hive Ready'}</span>
              {hiveState === 'executing' && (
                <span className="text-xs text-green-400">• {engagedCount} Engaged</span>
              )}
              <span className="text-xs text-blue-400">• {monitoringCount} Monitoring</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full border border-orange-500/30">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-bold text-orange-400">{profile.streak}</span>
            </div>

            <div className="text-3xl">{profile.avatar}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {getGreeting()}, <span className="text-indigo-400">{profile.name}</span>! 👋
          </h1>
          <p className="text-gray-400">
            {hiveState === 'awaiting'
              ? "Your learning companions are ready! Tap an activity to begin."
              : "You're doing great! Keep going!"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Today's Progress</span>
            <span className="text-sm font-bold text-indigo-400">{completedCount}/{totalCount} Complete</span>
          </div>
          <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Activity Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📅</span>
            <span>Today's Schedule</span>
            {hiveState === 'awaiting' && (
              <span className="text-sm font-normal text-amber-400 ml-2">— Tap to begin</span>
            )}
          </h2>

          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {tasks.map((task) => (
                <ActivityCard
                  key={task.id}
                  task={task}
                  onStartTask={handleStartTask}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Agent Status */}
        <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Your Learning Companions</h3>
          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${agent.bgColor} border ${agent.borderColor}`}
              >
                <span>{agent.icon}</span>
                <span className="text-white">{agent.name}</span>
                <span className={`w-2 h-2 rounded-full ${
                  agent.status === 'engaged' ? 'bg-green-400 animate-pulse' :
                  agent.status === 'awaiting' ? 'bg-amber-400' :
                  agent.status === 'monitoring' ? 'bg-blue-400' : 'bg-gray-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Activity View Modal */}
      {activeTask && (
        <ActivityView
          activity={activeTask}
          onComplete={handleCompleteTask}
          onClose={handleCloseActivity}
          feedback={feedback}
          isFeedbackLoading={isFeedbackLoading}
        />
      )}
    </div>
  );
}
