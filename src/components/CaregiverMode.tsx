// =============================================================================
// Caregiver Studio Mode - AgentricAI-planner
// AI-generated progress reports, curriculum management, admin directives
// Privacy enforced — NO raw student data shown
// Backend: AgentricAI-IED-ollama
// =============================================================================

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type {
  AppView,
  StudentProfile,
  ProgressMetric,
  WeeklyData,
  SkillProgress,
  AIInsight,
  InsightType,
  CurriculumFramework,
  TaskType,
  AdminDirective
} from '../types';
import { dataStore, defaultScheduleTasks } from '../services/dataStore';
import AgentHive from './AgentHive';

// Schedule block for editing
interface ScheduleBlock {
  id: string;
  time: string;
  endTime: string;
  name: string;
  type: TaskType;
  icon: string;
  difficulty: number;
  detail: string;
}

// Convert default tasks to schedule blocks
function tasksToBlocks(): ScheduleBlock[] {
  return defaultScheduleTasks.map((task, idx) => {
    const startHour = 8 + idx;
    const endHour = startHour + 1;
    return {
      id: task.id,
      time: `${startHour.toString().padStart(2, '0')}:00`,
      endTime: `${endHour.toString().padStart(2, '0')}:00`,
      name: task.name,
      type: task.type,
      icon: task.icon,
      difficulty: task.difficulty,
      detail: task.content?.body || ''
    };
  });
}

interface CaregiverModeProps {
  profile: StudentProfile;
  onNavigate: (view: AppView) => void;
}

type TabType = 'overview' | 'insights' | 'curriculum' | 'hive';

const CaregiverMode: React.FC<CaregiverModeProps> = ({ profile, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Live data from store
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [frameworks, setFrameworks] = useState<CurriculumFramework[]>([]);
  const [interactionCount, setInteractionCount] = useState(0);

  // Directive state
  const [directiveText, setDirectiveText] = useState('');
  const [directives, setDirectives] = useState<AdminDirective[]>([]);
  const [isProcessingDirective, setIsProcessingDirective] = useState(false);

  // Editing state
  const [editingFramework, setEditingFramework] = useState<CurriculumFramework | null>(null);
  const [editBlocks, setEditBlocks] = useState<ScheduleBlock[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFrameworkName, setNewFrameworkName] = useState('');
  const [newFrameworkDesc, setNewFrameworkDesc] = useState('');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const metrics = await dataStore.getMetrics();
        setProgressMetrics(metrics.progressMetrics);
        setWeeklyData(metrics.weeklyData);
        setSkillProgress(metrics.skillProgress);

        const insights = await dataStore.getInsights();
        setAiInsights(insights);

        const fw = await dataStore.getFrameworks();
        setFrameworks(fw);

        const count = await dataStore.getInteractionCount();
        setInteractionCount(count);

        const dirs = await dataStore.getDirectives();
        setDirectives(dirs);
      } catch (err) {
        console.error('Failed to load caregiver data:', err);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Process directive
  const handleSubmitDirective = async () => {
    if (!directiveText.trim() || isProcessingDirective) return;

    setIsProcessingDirective(true);
    try {
      const result = await dataStore.processDirective(directiveText.trim(), profile);
      setDirectives(prev => [result, ...prev]);
      setDirectiveText('');
    } catch (err) {
      console.error('Directive processing failed:', err);
      const errorDirective: AdminDirective = {
        id: `dir-error-${Date.now()}`,
        text: directiveText.trim(),
        timestamp: new Date().toISOString(),
        status: 'error',
        errorMessage: 'Failed to process directive. Check backend connection.',
        processedBy: 'System'
      };
      setDirectives(prev => [errorDirective, ...prev]);
    }
    setIsProcessingDirective(false);
  };

  const handleDirectiveKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitDirective();
    }
  };

  // Generate fresh insights
  const handleGenerateInsights = async () => {
    setIsLoading(true);
    const insights = await dataStore.generateInsights(profile);
    setAiInsights(insights);
    setIsLoading(false);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'insights', label: 'AI Insights', icon: '💡' },
    { id: 'curriculum', label: 'Curriculum', icon: '📚' },
    { id: 'hive', label: 'Agent Hive', icon: '🐝' }
  ];

  const renderDirectiveBox = () => (
    <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/40 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">📋</span>
        <h3 className="font-bold text-indigo-300">Administrative Directive</h3>
        <span className="text-xs px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400">
          AI-Processed
        </span>
      </div>
      <p className="text-sm text-indigo-200/60 mb-4">
        Type a directive to adjust {profile.name}'s curriculum. The AI will interpret and apply changes automatically.
        Examples: "make math problems harder", "focus more on reading", "add a creative activity"
      </p>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={directiveText}
            onChange={(e) => setDirectiveText(e.target.value)}
            onKeyDown={handleDirectiveKeyDown}
            disabled={isProcessingDirective}
            placeholder='e.g., "Make math problems a bit harder" or "Add more communication practice"'
            className="w-full px-4 py-3 bg-neutral-900/80 border border-indigo-500/30 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
          />
          {isProcessingDirective && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-400 border-t-transparent" />
            </div>
          )}
        </div>
        <button
          onClick={handleSubmitDirective}
          disabled={!directiveText.trim() || isProcessingDirective}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
        >
          {isProcessingDirective ? 'Processing...' : 'Apply →'}
        </button>
      </div>

      {/* Directive History */}
      {directives.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold text-indigo-300/60 uppercase tracking-wider">Recent Directives</h4>
          {directives.slice(0, 5).map((dir) => (
            <div
              key={dir.id}
              className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                dir.status === 'applied'
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : dir.status === 'error'
                  ? 'bg-red-500/10 border border-red-500/20'
                  : dir.status === 'processing'
                  ? 'bg-amber-500/10 border border-amber-500/20'
                  : 'bg-neutral-800/50 border border-neutral-700'
              }`}
            >
              <span className="text-lg mt-0.5">
                {dir.status === 'applied' ? '✅' : dir.status === 'error' ? '❌' : dir.status === 'processing' ? '⏳' : '📝'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">"{dir.text}"</p>
                {dir.appliedChanges && (
                  <p className="text-emerald-300/80 text-xs mt-1">{dir.appliedChanges}</p>
                )}
                {dir.errorMessage && (
                  <p className="text-red-300/80 text-xs mt-1">{dir.errorMessage}</p>
                )}
                <p className="text-neutral-500 text-xs mt-1">
                  {new Date(dir.timestamp).toLocaleString()} • via {dir.processedBy} Agent
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 bg-indigo-500/5 border border-indigo-500/15 rounded-lg p-2">
        <p className="text-xs text-indigo-300/50 flex items-center gap-2">
          <span>⚡</span>
          <span>
            Directives are processed by the Orchestrator Agent via AgentricAI-IED-ollama.
            The curriculum evolves automatically — you don't need to rewrite the entire framework.
          </span>
        </p>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Admin Directive Box — TOP OF OVERVIEW */}
      {renderDirectiveBox()}

      {/* Student summary */}
      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">{profile.avatar}</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-neutral-400">
              {profile.gradeLevel} • {profile.communicationLevel || profile.communicationMode}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-3xl font-bold text-emerald-400">🔥 {profile.streak}</p>
            <p className="text-sm text-neutral-400">Day Streak</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-neutral-400">
          <span>Total Sessions: {profile.totalSessions}</span>
          <span>•</span>
          <span>Interactions Recorded: {interactionCount}</span>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 mt-4">
          <p className="text-xs text-indigo-300 flex items-center gap-2">
            <span>🛡️</span>
            <span>Privacy Protected: You see AI-generated summaries only. Raw interaction data is encrypted in IndexedDB and never leaves the device.</span>
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {progressMetrics.map((metric: ProgressMetric, i: number) => (
          <div key={i} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span className="text-sm text-neutral-400">{metric.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">
                {metric.value > 0 ? `${metric.value}%` : '—'}
              </span>
              {metric.change !== 0 && (
                <span className={`text-sm ${metric.trend === 'up' ? 'text-emerald-400' : metric.trend === 'down' ? 'text-red-400' : 'text-neutral-400'}`}>
                  {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {Math.abs(metric.change)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts — only show if there is data */}
      {weeklyData.length > 0 && (
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Engagement Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="engagement" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Engagement" />
              <Area type="monotone" dataKey="completion" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Completion" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Skill Progress */}
      {skillProgress.some((s: SkillProgress) => s.progress > 0) ? (
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Skill Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={skillProgress} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
              <YAxis dataKey="skill" type="category" stroke="#9ca3af" width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {skillProgress.map((skill: SkillProgress, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-neutral-300">{skill.skill}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: skill.color }}>{skill.current}%</span>
                  <span className={`text-xs ${skill.trend === 'up' ? 'text-emerald-400' : skill.trend === 'down' ? 'text-red-400' : 'text-neutral-400'}`}>
                    {skill.trend === 'up' ? '↑' : skill.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8 text-center">
          <span className="text-4xl mb-4 block">📈</span>
          <h3 className="text-lg font-semibold text-white mb-2">No Progress Data Yet</h3>
          <p className="text-sm text-neutral-400">
            Skill progress will appear here as {profile.name} completes activities in Explorer mode.
            The Analyst agent tracks all engagement patterns.
          </p>
        </div>
      )}
    </div>
  );

  const renderInsights = () => {
    const insightColors: Record<InsightType, string> = {
      breakthrough: 'border-emerald-500 bg-emerald-500/10',
      adaptation: 'border-amber-500 bg-amber-500/10',
      milestone: 'border-purple-500 bg-purple-500/10',
      pattern: 'border-sky-500 bg-sky-500/10',
      recommendation: 'border-rose-500 bg-rose-500/10'
    };

    const insightIcons: Record<InsightType, string> = {
      breakthrough: '🚀',
      adaptation: '⚙️',
      milestone: '🏆',
      pattern: '🔍',
      recommendation: '💡'
    };

    return (
      <div className="space-y-6">
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
          <h3 className="font-semibold text-indigo-300 mb-2">🛡️ AI-Generated Insights</h3>
          <p className="text-sm text-indigo-200/70">
            These insights are generated by the Agent Hive analyzing encrypted interaction data.
            You see interpretations and recommendations — never raw student data.
          </p>
        </div>

        {aiInsights.length === 0 ? (
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8 text-center">
            <span className="text-4xl mb-4 block">💡</span>
            <h3 className="text-lg font-semibold text-white mb-2">No Insights Yet</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Insights are generated as {profile.name} interacts with activities.
              Connect AgentricAI-IED-ollama for AI-powered analysis.
            </p>
            {interactionCount > 0 && (
              <button
                onClick={handleGenerateInsights}
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? 'Generating...' : 'Generate Insights from Interactions'}
              </button>
            )}
          </div>
        ) : (
          aiInsights.map((insight: AIInsight) => (
            <div
              key={insight.id}
              className={`border rounded-xl p-5 ${insightColors[insight.type] || 'border-neutral-700 bg-neutral-800/50'}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{insightIcons[insight.type] || '💡'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-neutral-700 rounded-full text-neutral-300">
                      via {insight.agentSource} Agent
                    </span>
                  </div>
                  <p className="text-neutral-300 text-sm mb-3">{insight.description}</p>
                  {insight.actionTaken && (
                    <p className="text-xs text-neutral-400">
                      <span className="font-semibold">Action Taken:</span> {insight.actionTaken}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500 mt-2">
                    {new Date(insight.timestamp).toLocaleString()}
                  </p>
                </div>
                {insight.impactScore && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">{insight.impactScore}</p>
                    <p className="text-xs text-neutral-400">Impact</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // Type options for activity selection
  const activityTypes: { type: TaskType; icon: string; label: string }[] = [
    { type: 'math', icon: '📐', label: 'Math' },
    { type: 'reading', icon: '📖', label: 'Reading' },
    { type: 'art', icon: '🎨', label: 'Art' },
    { type: 'writing', icon: '✍️', label: 'Writing' },
    { type: 'movement', icon: '🏃', label: 'Movement' },
    { type: 'break', icon: '🍎', label: 'Break' },
    { type: 'communication', icon: '💬', label: 'Communication' },
    { type: 'play', icon: '🎮', label: 'Play' },
    { type: 'social_studies', icon: '🌍', label: 'Social Studies' },
    { type: 'creative', icon: '✨', label: 'Creative' }
  ];

  const handleEditFramework = (framework: CurriculumFramework) => {
    setEditingFramework(framework);
    setEditBlocks(tasksToBlocks());
  };

  const handleCloseEdit = () => {
    setEditingFramework(null);
    setEditBlocks([]);
    setIsCreatingNew(false);
    setNewFrameworkName('');
    setNewFrameworkDesc('');
  };

  const handleSaveFramework = async () => {
    if (editingFramework) {
      const updated: CurriculumFramework = {
        ...editingFramework,
        lastAdaptedBy: 'Caregiver'
      };
      await dataStore.saveFramework(updated);

      const updatedTasks = editBlocks.map((block, idx) => ({
        id: block.id || `task-${Date.now()}-${idx}`,
        name: block.name,
        type: block.type,
        icon: block.icon,
        time: formatTime12h(block.time),
        duration: 30,
        status: 'pending' as const,
        engagement: 'unknown' as const,
        difficulty: block.difficulty,
        content: {
          title: block.name,
          body: block.detail,
          instructions: '',
          hint: ''
        },
        agentSource: 'Caregiver'
      }));
      await dataStore.saveSchedule(updatedTasks);

      const fw = await dataStore.getFrameworks();
      setFrameworks(fw);
    }
    handleCloseEdit();
  };

  const handleCreateFramework = async () => {
    if (!newFrameworkName.trim()) return;

    const newFramework: CurriculumFramework = {
      id: `framework-${Date.now()}`,
      name: newFrameworkName.trim(),
      description: newFrameworkDesc.trim() || 'Custom curriculum framework',
      goals: ['Personalized learning'],
      adaptationNotes: 'Created by caregiver. AI adaptation will begin after first use.',
      createdBy: 'Caregiver',
      lastAdaptedBy: 'Caregiver',
      isActive: false
    };

    await dataStore.saveFramework(newFramework);
    const fw = await dataStore.getFrameworks();
    setFrameworks(fw);
    handleCloseEdit();
  };

  const handleMoveBlockUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...editBlocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    recalculateTimes(newBlocks);
    setEditBlocks(newBlocks);
  };

  const handleMoveBlockDown = (index: number) => {
    if (index === editBlocks.length - 1) return;
    const newBlocks = [...editBlocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    recalculateTimes(newBlocks);
    setEditBlocks(newBlocks);
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = editBlocks.filter((_, i) => i !== index);
    recalculateTimes(newBlocks);
    setEditBlocks(newBlocks);
  };

  const handleAddBlock = () => {
    const lastBlock = editBlocks[editBlocks.length - 1];
    const newTime = lastBlock ? addHour(lastBlock.time) : '08:00';
    const newBlock: ScheduleBlock = {
      id: `block-${Date.now()}`,
      time: newTime,
      endTime: addHour(newTime),
      name: 'New Activity',
      type: 'creative',
      icon: '✨',
      difficulty: 2,
      detail: ''
    };
    setEditBlocks([...editBlocks, newBlock]);
  };

  const handleBlockChange = (index: number, field: keyof ScheduleBlock, value: string | number) => {
    const newBlocks = [...editBlocks];
    const block = newBlocks[index];

    if (field === 'type') {
      const typeInfo = activityTypes.find(t => t.type === value);
      if (typeInfo) {
        newBlocks[index] = { ...block, type: value as TaskType, icon: typeInfo.icon };
      }
    } else if (field === 'name') {
      newBlocks[index] = { ...block, name: value as string };
    } else if (field === 'detail') {
      newBlocks[index] = { ...block, detail: value as string };
    } else if (field === 'difficulty') {
      newBlocks[index] = { ...block, difficulty: value as number };
    } else if (field === 'time') {
      newBlocks[index] = { ...block, time: value as string };
    } else if (field === 'endTime') {
      newBlocks[index] = { ...block, endTime: value as string };
    } else if (field === 'icon') {
      newBlocks[index] = { ...block, icon: value as string };
    }

    setEditBlocks(newBlocks);
  };

  const recalculateTimes = (blocks: ScheduleBlock[]) => {
    let currentHour = 8;
    blocks.forEach((block) => {
      block.time = `${currentHour.toString().padStart(2, '0')}:00`;
      block.endTime = `${(currentHour + 1).toString().padStart(2, '0')}:00`;
      currentHour++;
    });
  };

  const addHour = (time: string): string => {
    const hour = parseInt(time.split(':')[0]) + 1;
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const formatTime12h = (time24: string): string => {
    const hour = parseInt(time24.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const renderCurriculum = () => {
    // Edit Framework Modal
    if (editingFramework) {
      return (
        <div className="space-y-6">
          <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sky-300 mb-1">✏️ Editing: {editingFramework.name}</h3>
              <p className="text-sm text-sky-200/70">
                Reorder activities using arrows. Edit times, types, and add custom details.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCloseEdit}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFramework}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Schedule Blocks Editor */}
          <div className="space-y-3">
            {editBlocks.map((block, index) => (
              <div
                key={block.id}
                className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveBlockUp(index)}
                      disabled={index === 0}
                      className="p-1 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveBlockDown(index)}
                      disabled={index === editBlocks.length - 1}
                      className="p-1 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed rounded text-xs"
                    >
                      ↓
                    </button>
                  </div>

                  {/* Time display */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-sky-400">{formatTime12h(block.time)}</div>
                    <div className="text-xs text-neutral-500">to {formatTime12h(block.endTime)}</div>
                  </div>

                  {/* Icon */}
                  <div className="text-4xl">{block.icon}</div>

                  {/* Editable fields */}
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={block.name}
                        onChange={(e) => handleBlockChange(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Activity name"
                      />
                      <select
                        value={block.type}
                        onChange={(e) => handleBlockChange(index, 'type', e.target.value)}
                        className="px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      >
                        {activityTypes.map((at) => (
                          <option key={at.type} value={at.type}>
                            {at.icon} {at.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-400">Difficulty:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleBlockChange(index, 'difficulty', star)}
                            className={`text-lg ${star <= block.difficulty ? 'text-yellow-400' : 'text-neutral-600'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={block.detail}
                      onChange={(e) => handleBlockChange(index, 'detail', e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                      rows={2}
                      placeholder="Add custom detail or instructions for this activity..."
                    />
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveBlock(index)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Remove block"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Block Button */}
          <button
            onClick={handleAddBlock}
            className="w-full py-3 border-2 border-dashed border-sky-600 rounded-xl text-sky-400 hover:bg-sky-500/10 transition-colors"
          >
            + Add Activity Block
          </button>
        </div>
      );
    }

    // Create New Framework Modal
    if (isCreatingNew) {
      return (
        <div className="space-y-6">
          <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
            <h3 className="font-semibold text-sky-300 mb-2">📚 Create New Framework</h3>
            <p className="text-sm text-sky-200/70">
              Create a custom curriculum framework for {profile.name}. You can edit the schedule blocks after creation.
            </p>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Framework Name</label>
              <input
                type="text"
                value={newFrameworkName}
                onChange={(e) => setNewFrameworkName(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g., Morning Focus Schedule"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
              <textarea
                value={newFrameworkDesc}
                onChange={(e) => setNewFrameworkDesc(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                rows={3}
                placeholder="Describe the purpose of this framework..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCloseEdit}
                className="flex-1 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFramework}
                disabled={!newFrameworkName.trim()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-medium rounded-lg transition-colors"
              >
                Create Framework
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Main Curriculum View
    return (
      <div className="space-y-6">
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
          <h3 className="font-semibold text-sky-300 mb-2">📚 Curriculum Frameworks</h3>
          <p className="text-sm text-sky-200/70">
            Manage curriculum frameworks that define the daily schedule structure.
            The Default framework provides a balanced day with 8 activity blocks.
            Edit to customize timing, activities, and content for {profile.name}.
          </p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <h4 className="font-semibold text-emerald-300 text-sm">Auto-Evolving Curriculum</h4>
              <p className="text-xs text-emerald-200/60 mt-1">
                You don't need to rewrite the entire framework every time. The curriculum evolves automatically
                as {profile.name} completes activities. Use the Admin Directive box on the Overview tab
                to give high-level instructions like "make math harder" — the AI handles the rest.
              </p>
            </div>
          </div>
        </div>

        {frameworks.map((framework: CurriculumFramework) => (
          <div
            key={framework.id}
            className={`bg-neutral-800/50 border rounded-xl p-5 ${
              framework.isActive ? 'border-emerald-500/50' : 'border-neutral-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white text-lg flex items-center gap-2">
                  {framework.name}
                  {framework.id === 'default-curriculum' && (
                    <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 text-xs rounded">System Default</span>
                  )}
                </h4>
                <p className="text-sm text-neutral-400">{framework.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  framework.isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-neutral-700 text-neutral-400'
                }`}>
                  {framework.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleEditFramework(framework)}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded transition-colors"
                >
                  Edit Framework
                </button>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-neutral-500 mb-1">Goals:</p>
              <div className="flex flex-wrap gap-2">
                {framework.goals.map((goal: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-neutral-700 rounded text-xs text-neutral-300">
                    {goal}
                  </span>
                ))}
              </div>
            </div>

            {framework.adaptationNotes && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <p className="text-xs text-amber-300">
                  <span className="font-semibold">🤖 AI Adaptation:</span> {framework.adaptationNotes}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Last adapted by: {framework.lastAdaptedBy}
                </p>
              </div>
            )}

            {/* Activity Blocks Preview */}
            {framework.id === 'default-curriculum' && (
              <div className="mt-4 pt-4 border-t border-neutral-700">
                <p className="text-xs text-neutral-500 mb-2">Schedule Blocks (8 activities):</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {defaultScheduleTasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-neutral-700/50 rounded text-xs">
                      <span>{task.icon}</span>
                      <div>
                        <span className="text-neutral-400">{task.time}</span>
                        <span className="text-neutral-300 ml-1">{task.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={() => setIsCreatingNew(true)}
          className="w-full py-3 border-2 border-dashed border-neutral-600 rounded-xl text-neutral-400 hover:border-sky-500 hover:text-sky-400 transition-colors"
        >
          + Add Custom Framework
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Header */}
      <header className="p-4 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Exit Studio</span>
          </button>

          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-sky-400">🎨</span>
            AgentricAI Studio
          </h1>

          <div className="flex items-center gap-2 px-3 py-2 bg-sky-500/10 border border-sky-500/30 rounded-full">
            <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
            <span className="text-xs text-sky-400 font-medium">Caregiver View</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-6xl mx-auto flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="p-6 max-w-6xl mx-auto">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'curriculum' && renderCurriculum()}
        {activeTab === 'hive' && (
          <div className="space-y-4">
            <div className="bg-neutral-800/50 border border-neutral-600 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-white">Hive Status from Caregiver View</h4>
                  <p className="text-sm text-neutral-400">
                    The hive shows as <strong className="text-amber-400">awaiting</strong> because no student workflow is currently executing.
                    When {profile.name} opens Explorer mode and clicks an activity, the hive engages automatically.
                    The <strong className="text-blue-400">Guardian agent is always monitoring</strong> to protect data.
                  </p>
                </div>
              </div>
            </div>
            <AgentHive hiveState="awaiting" isWorkflowActive={false} />
          </div>
        )}
      </main>
    </div>
  );
};

export default CaregiverMode;
