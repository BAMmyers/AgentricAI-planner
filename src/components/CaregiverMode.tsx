// =============================================================================
// Caregiver Studio Mode - AgentricAI-planner
// AI-generated progress reports and curriculum management
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
  CurriculumFramework
} from '../types';
import { dataStore } from '../services/dataStore';
import AgentHive from './AgentHive';

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
      } catch (err) {
        console.error('Failed to load caregiver data:', err);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

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

  const renderOverview = () => (
    <div className="space-y-8">
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

  const renderCurriculum = () => {
    const handleEditFramework = (framework: CurriculumFramework) => {
      // For now, show the framework is editable
      console.log('Edit framework:', framework.id);
      // In production, this would open an edit modal
    };

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
                  {[
                    { time: '8:00 AM', icon: '📐', name: 'Morning Math' },
                    { time: '9:00 AM', icon: '📖', name: 'Story Time' },
                    { time: '10:00 AM', icon: '🎨', name: 'Creative Art' },
                    { time: '10:30 AM', icon: '🏃', name: 'Movement Break' },
                    { time: '11:00 AM', icon: '✍️', name: 'Writing Practice' },
                    { time: '12:00 PM', icon: '🍎', name: 'Lunch Break' },
                    { time: '1:00 PM', icon: '💬', name: 'Communication' },
                    { time: '2:00 PM', icon: '🎮', name: 'Free Play' }
                  ].map((block, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-neutral-700/50 rounded text-xs">
                      <span>{block.icon}</span>
                      <div>
                        <span className="text-neutral-400">{block.time}</span>
                        <span className="text-neutral-300 ml-1">{block.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <button className="w-full py-3 border-2 border-dashed border-neutral-600 rounded-xl text-neutral-400 hover:border-sky-500 hover:text-sky-400 transition-colors">
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
