// =============================================================================
// Agent Hive - AgentricAI-planner
// Hive visualization — 6 specialist agents, rigid 2-3 actions each
// Guardian always monitoring. Others awaiting → engaged → awaiting.
// Backend: AgentricAI-IED-ollama
// =============================================================================

import { useState } from 'react';
import type { HiveAgent, AgentAction, AgentStatus, HiveState } from '../types';
import { hiveAgents, backendDriver } from '../services/dataStore';

interface AgentHiveProps {
  isWorkflowActive?: boolean;
  hiveState?: HiveState;
}

const statusColors: Record<AgentStatus, string> = {
  awaiting: 'bg-amber-400',
  engaged: 'bg-green-400',
  monitoring: 'bg-blue-400',
  processing: 'bg-green-400',
  error: 'bg-red-400'
};

const statusBorderColors: Record<AgentStatus, string> = {
  awaiting: 'border-amber-400',
  engaged: 'border-green-400',
  monitoring: 'border-blue-400',
  processing: 'border-green-400',
  error: 'border-red-400'
};

const statusLabels: Record<AgentStatus, string> = {
  awaiting: 'Awaiting',
  engaged: 'Engaged',
  monitoring: 'Monitoring',
  processing: 'Processing',
  error: 'Error'
};

export default function AgentHive({ isWorkflowActive = false, hiveState = 'awaiting' }: AgentHiveProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const getEffectiveStatus = (agent: HiveAgent): AgentStatus => {
    if (agent.id === 'guardian') return 'monitoring';
    if (isWorkflowActive && hiveState === 'executing') return 'engaged';
    return 'awaiting';
  };

  const getActionEffectiveStatus = (agent: HiveAgent): AgentStatus => {
    if (agent.id === 'guardian') return 'monitoring';
    if (isWorkflowActive && hiveState === 'executing') return 'engaged';
    return 'awaiting';
  };

  const awaitingCount = hiveAgents.filter((a: HiveAgent) => getEffectiveStatus(a) === 'awaiting').length;
  const engagedCount = hiveAgents.filter((a: HiveAgent) => getEffectiveStatus(a) === 'engaged').length;
  const monitoringCount = hiveAgents.filter((a: HiveAgent) => getEffectiveStatus(a) === 'monitoring').length;

  return (
    <div className="space-y-6">
      {/* Hive Status Header */}
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${
              hiveState === 'executing'
                ? 'bg-green-400 animate-pulse'
                : 'bg-amber-400'
            }`} />
            <h3 className="text-xl font-bold text-white">
              {hiveState === 'executing' ? 'Hive Executing' : 'Hive Awaiting Stimulation'}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {awaitingCount > 0 && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-400">{awaitingCount} Awaiting</span>
              </span>
            )}
            {engagedCount > 0 && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-green-400">{engagedCount} Engaged</span>
              </span>
            )}
            {monitoringCount > 0 && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-blue-400">{monitoringCount} Monitoring</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          {hiveState === 'executing'
            ? 'User has clicked an activity. All agents are engaged in workflow execution.'
            : 'All agents are active at their stations, ready for user stimulation (click on an activity).'}
        </p>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {hiveAgents.map((agent: HiveAgent) => {
          const effectiveStatus = getEffectiveStatus(agent);
          const isExpanded = expandedAgent === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
              className={`
                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${agent.bgColor} ${statusBorderColors[effectiveStatus]}
                ${isExpanded ? 'col-span-2 lg:col-span-3' : ''}
                hover:scale-[1.02]
              `}
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{agent.icon}</span>
                  <div>
                    <h4 className="font-bold text-white">{agent.name}</h4>
                    <p className="text-xs text-gray-400">{agent.role}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium text-black
                    ${statusColors[effectiveStatus]}
                    ${effectiveStatus === 'engaged' || effectiveStatus === 'processing' ? 'animate-pulse' : ''}
                  `}>
                    {statusLabels[effectiveStatus]}
                  </span>
                  {agent.id === 'guardian' && (
                    <span className="text-[10px] text-blue-400 font-medium">Always On</span>
                  )}
                </div>
              </div>

              {/* Collapsed action dots */}
              {!isExpanded && (
                <div className="flex gap-1">
                  {agent.actions.map((action: AgentAction) => (
                    <div
                      key={action.id}
                      className={`w-2 h-2 rounded-full ${statusColors[getActionEffectiveStatus(agent)]}`}
                      title={`${action.name}: ${statusLabels[getActionEffectiveStatus(agent)]}`}
                    />
                  ))}
                </div>
              )}

              {/* Expanded detail */}
              {isExpanded && (
                <div className="mt-4 space-y-3 border-t border-neutral-600 pt-4">
                  <p className="text-sm text-gray-300">{agent.description}</p>

                  <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-gray-200">Actions ({agent.actions.length})</h5>
                    {agent.actions.map((action: AgentAction) => {
                      const actionStatus = getActionEffectiveStatus(agent);
                      return (
                        <div
                          key={action.id}
                          className="bg-neutral-800/50 rounded-lg p-3 flex items-start justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${statusColors[actionStatus]}`} />
                              <span className="font-medium text-white text-sm">{action.name}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 ml-4">{action.description}</p>
                            {action.lastResult && (
                              <p className="text-xs text-gray-500 mt-1 ml-4">Last: {action.lastResult}</p>
                            )}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium text-black ${statusColors[actionStatus]}`}>
                            {statusLabels[actionStatus]}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Agent Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                    <div className="bg-neutral-800/30 rounded p-2">
                      <div className="text-gray-400">Processed</div>
                      <div className="text-white font-bold">{agent.totalProcessed.toLocaleString()}</div>
                    </div>
                    <div className="bg-neutral-800/30 rounded p-2">
                      <div className="text-gray-400">Cycles</div>
                      <div className="text-white font-bold">{agent.cyclesCompleted.toLocaleString()}</div>
                    </div>
                    <div className="bg-neutral-800/30 rounded p-2">
                      <div className="text-gray-400">Uptime</div>
                      <div className="text-white font-bold">{agent.uptime}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Data Flow */}
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
        <h3 className="text-lg font-bold text-white mb-4">Hive Data Flow</h3>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="px-3 py-1 bg-neutral-700 rounded-lg text-gray-300">IED-ollama</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500 rounded-lg text-emerald-400">🎯 Orchestrator</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-sky-500/20 border border-sky-500 rounded-lg text-sky-400">📚 Curriculum</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500 rounded-lg text-purple-400">💬 Communicator</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-neutral-600 rounded-lg text-white">👤 Student</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-500 rounded-lg text-amber-400">🔍 Analyst</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-rose-500/20 border border-rose-500 rounded-lg text-rose-400">⚙️ Adapter</span>
          <span className="text-gray-500">↻</span>
        </div>
        <div className="flex items-center justify-center mt-4 pt-4 border-t border-neutral-700">
          <span className="px-3 py-1 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-400">
            🛡️ Guardian encrypts every write — ALWAYS MONITORING
          </span>
        </div>
      </div>

      {/* Backend Driver */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-6 border border-indigo-500/50">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧠</span>
              <h3 className="text-xl font-bold text-white">{backendDriver.name}</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">{backendDriver.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-400">Endpoint: </span>
                <span className="text-indigo-300 font-mono">{backendDriver.endpoint}</span>
              </div>
              <div>
                <span className="text-gray-400">Model: </span>
                <span className="text-indigo-300">{backendDriver.model}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              backendDriver.status === 'connected'
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}>
              {backendDriver.status === 'connected' ? '● Connected' : '○ Disconnected'}
            </span>
            <a
              href={backendDriver.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 underline"
            >
              View Repository →
            </a>
          </div>
        </div>
      </div>

      {/* Guardian Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <h4 className="font-semibold text-blue-400">Guardian Always Monitoring</h4>
            <p className="text-sm text-gray-400 mt-1">
              Security never sleeps. All data is encrypted via IndexedDB and stored locally.
              The Guardian agent remains in monitoring state at all times — even when other agents are awaiting stimulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
