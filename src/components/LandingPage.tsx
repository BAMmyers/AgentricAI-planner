// =============================================================================
// Landing Page - AgentricAI-planner
// Production entry portal — dual-view access
// Backend: AgentricAI-IED-ollama
// =============================================================================

import { useState, useEffect } from 'react';
import type { AppView, StudentProfile } from '../types';
import { hiveAgents, backendDriver } from '../services/dataStore';
import { llmService } from '../services/llmService';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  profile: StudentProfile | null;
  backendConnected: boolean;
}

export default function LandingPage({ onNavigate, profile, backendConnected }: LandingPageProps) {
  const [isConnected, setIsConnected] = useState(backendConnected);
  const [isChecking, setIsChecking] = useState(false);

  const monitoringCount = hiveAgents.filter((a) => a.status === 'monitoring').length;
  const awaitingCount = hiveAgents.filter((a) => a.status === 'awaiting').length;

  const handleCheckConnection = async () => {
    setIsChecking(true);
    const connected = await llmService.checkConnection();
    setIsConnected(connected);
    backendDriver.status = connected ? 'connected' : 'disconnected';
    backendDriver.lastPing = new Date().toISOString();
    setIsChecking(false);
  };

  useEffect(() => {
    handleCheckConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <div>
              <h1 className="text-xl font-bold">AgentricAI-planner</h1>
              <p className="text-xs text-neutral-400">Adaptive Learning Companion</p>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckConnection}
              disabled={isChecking}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                isConnected
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                isChecking ? 'bg-amber-400 animate-pulse' :
                isConnected ? 'bg-emerald-400' : 'bg-red-400'
              }`} />
              <span className={`text-xs ${isConnected ? 'text-emerald-300' : 'text-red-300'}`}>
                {isChecking ? 'Checking...' : isConnected ? 'IED-ollama Connected' : 'Backend Offline'}
              </span>
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span className="text-xs text-amber-400">{awaitingCount} Awaiting</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-xs text-blue-400">{monitoringCount} Monitoring</span>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <section className="px-6 py-16 max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-sm text-indigo-300">
              🛡️ Privacy-First • AI-Driven • Hyper-Adaptive
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
            The AgentricAI-planner
            <br />
            <span className="text-4xl md:text-5xl">Project</span>
          </h2>
          
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-4">
            A fully autonomous, AI-driven educational ecosystem designed for children with unique learning needs.
            <span className="text-purple-400"> Privacy guaranteed by architecture.</span>
          </p>

          {profile && (
            <p className="text-neutral-400 mb-8">
              Active profile: <span className="text-white font-semibold">{profile.avatar} {profile.name}</span>
            </p>
          )}

          {!isConnected && (
            <div className="mb-8 max-w-2xl mx-auto bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-sm text-amber-300">
                ⚠️ <strong>AgentricAI-IED-ollama is not running.</strong> Start the backend at{' '}
                <code className="bg-neutral-800 px-2 py-0.5 rounded text-xs">http://localhost:11434</code>{' '}
                to enable AI-driven schedule generation, feedback, and insights.
              </p>
              <p className="text-xs text-amber-400/70 mt-2">
                Without the backend, the application operates in local-only mode with stored data.
              </p>
            </div>
          )}

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 text-left">
              <span className="text-3xl mb-3 block">🛡️</span>
              <h3 className="font-bold text-lg mb-2">Privacy by Design</h3>
              <p className="text-sm text-neutral-400">
                All interaction data is encrypted and stored locally via IndexedDB.
                The AI is the sole intermediary — no external data transmission.
              </p>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 text-left">
              <span className="text-3xl mb-3 block">🐝</span>
              <h3 className="font-bold text-lg mb-2">Agent Hive</h3>
              <p className="text-sm text-neutral-400">
                6 specialist agents with rigid 2-3 actions each, operating
                simultaneously like a hive to personalize every interaction.
              </p>
            </div>
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 text-left">
              <span className="text-3xl mb-3 block">📱</span>
              <h3 className="font-bold text-lg mb-2">AAC Optimized</h3>
              <p className="text-sm text-neutral-400">
                Built as a PWA for iPad and Galaxy tablets — the devices
                already used by neurodiverse learners worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Dual view section */}
        <section className="px-6 pb-16 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Choose Your Portal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Portal */}
            <button
              onClick={() => onNavigate('student')}
              className="group relative bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-2 border-emerald-500/30 rounded-2xl p-8 text-left hover:border-emerald-400 transition-all hover:scale-[1.02]"
            >
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  Explorer Mode
                </span>
              </div>
              <div className="text-6xl mb-4">🎒</div>
              <h4 className="text-2xl font-bold text-emerald-300 mb-2">Student View</h4>
              <p className="text-neutral-400 mb-4">
                The private, adaptive daily schedule. Clean, engaging, and personalized
                by the AI for the learner's current state.
              </p>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Completely private interactions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  AI companion always active
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  Touch-optimized for AAC devices
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-2 text-emerald-400 group-hover:gap-4 transition-all">
                <span className="font-semibold">Enter as Student</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>

            {/* Caregiver Portal */}
            <button
              onClick={() => onNavigate('caregiver')}
              className="group relative bg-gradient-to-br from-sky-500/10 to-purple-500/10 border-2 border-sky-500/30 rounded-2xl p-8 text-left hover:border-sky-400 transition-all hover:scale-[1.02]"
            >
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-sky-500/20 text-sky-400 text-xs rounded-full">
                  Studio Mode
                </span>
              </div>
              <div className="text-6xl mb-4">📊</div>
              <h4 className="text-2xl font-bold text-sky-300 mb-2">Caregiver View</h4>
              <p className="text-neutral-400 mb-4">
                AI-generated progress reports and curriculum management.
                Never see raw student data — only meaningful insights.
              </p>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span>
                  AI-filtered progress reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span>
                  Curriculum framework creation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span>
                  Agent Hive monitoring
                </li>
              </ul>
              <div className="mt-6 flex items-center gap-2 text-sky-400 group-hover:gap-4 transition-all">
                <span className="font-semibold">Enter as Caregiver</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </div>
        </section>

        {/* Hive preview */}
        <section className="px-6 pb-16 max-w-5xl mx-auto">
          <div className="bg-neutral-800/30 border border-neutral-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐝</span>
                <div>
                  <h4 className="font-bold">Agent Hive Status</h4>
                  <p className="text-xs text-neutral-400">
                    All agents at stations • Awaiting user stimulation • Guardian always monitoring
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  <span className="text-sm text-amber-400">Awaiting</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {hiveAgents.map((agent) => {
                const isGuardian = agent.id === 'guardian';
                const statusColor = isGuardian ? 'text-blue-400' : 'text-amber-400';
                const statusLabel = isGuardian ? 'Monitoring' : 'Awaiting';
                const borderClass = isGuardian
                  ? 'border-blue-500 ring-1 ring-blue-500/30'
                  : 'border-neutral-700';

                return (
                  <div
                    key={agent.id}
                    className={`bg-neutral-900/50 border rounded-lg p-3 text-center ${borderClass}`}
                  >
                    <span className="text-2xl">{agent.icon}</span>
                    <p className="text-xs font-semibold mt-1 text-neutral-300">{agent.name}</p>
                    <p className={`text-xs ${statusColor}`}>{statusLabel}</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {agent.actions.map((action) => (
                        <div
                          key={action.id}
                          className={`w-2 h-2 rounded-full ${isGuardian ? 'bg-blue-400' : 'bg-amber-400'}`}
                          title={action.name}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300 text-center">
                🛡️ <strong>Guardian agent is always monitoring</strong> — Data encrypted and protected at all times. Security never sleeps.
              </p>
            </div>
          </div>
        </section>

        {/* Backend driver */}
        <section className="px-6 pb-16 max-w-5xl mx-auto">
          <div className={`bg-gradient-to-r rounded-2xl p-6 ${
            isConnected
              ? 'from-purple-500/10 to-indigo-500/10 border border-purple-500/30'
              : 'from-red-500/10 to-amber-500/10 border border-red-500/30'
          }`}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">🧠</span>
              <div className="flex-1">
                <h4 className="font-bold text-lg">{backendDriver.name}</h4>
                <p className="text-sm text-neutral-400">{backendDriver.description}</p>
                <a
                  href={backendDriver.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-400 hover:text-purple-300 underline"
                >
                  github.com/{backendDriver.repo}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-emerald-400' : 'bg-red-400'
                }`} />
                <span className="text-sm">{isConnected ? 'Connected' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-neutral-800 text-center text-sm text-neutral-500">
          <p>
            AgentricAI-planner • Part of{' '}
            <a
              href="https://github.com/BAMmyers/AgentricAI_Studios"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              AgentricAI Studios
            </a>
          </p>
          <p className="mt-2 text-xs text-neutral-600">
            Privacy by architecture. AI-driven adaptation. Built for neurodiverse learners.
          </p>
        </footer>
      </div>
    </div>
  );
}
