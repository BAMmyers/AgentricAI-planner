// =============================================================================
// AgentricAI-planner - Main Application
// Backend Driver: https://github.com/BAMmyers/AgentricAI-IED-ollama.git
// Production entry point — manages state, routing, and initialization
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import type { AppView, StudentProfile } from './types';
import { dataStore } from './services/dataStore';
import LandingPage from './components/LandingPage';
import StudentMode from './components/StudentMode';
import CaregiverMode from './components/CaregiverMode';
import ProfileSetup from './components/ProfileSetup';

type AppState = 'loading' | 'setup' | 'ready';

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Initialize application
  useEffect(() => {
    const init = async () => {
      try {
        await dataStore.initialize();
        const existingProfile = await dataStore.getProfile();
        const connected = await dataStore.checkBackendConnection();
        setBackendConnected(connected);

        if (existingProfile) {
          setProfile(existingProfile);
          setAppState('ready');
        } else {
          setAppState('setup');
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setAppState('setup');
      }
    };
    init();
  }, []);

  // Handle profile creation
  const handleProfileCreated = useCallback(async (newProfile: StudentProfile) => {
    await dataStore.saveProfile(newProfile);
    setProfile(newProfile);

    // Attempt schedule generation from backend
    await dataStore.generateSchedule(newProfile);

    setAppState('ready');
  }, []);

  const handleNavigate = useCallback((view: AppView) => {
    setCurrentView(view);
  }, []);

  // Loading state
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">🧠</div>
          <h1 className="text-2xl font-bold mb-2">AgentricAI-planner</h1>
          <p className="text-neutral-400 mb-4">Initializing system...</p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // First-time setup
  if (appState === 'setup') {
    return <ProfileSetup onComplete={handleProfileCreated} />;
  }

  // Main application
  return (
    <>
      {currentView === 'landing' && (
        <LandingPage
          onNavigate={handleNavigate}
          profile={profile}
          backendConnected={backendConnected}
        />
      )}
      {currentView === 'student' && profile && (
        <StudentMode
          profile={profile}
          onBack={() => handleNavigate('landing')}
        />
      )}
      {currentView === 'caregiver' && profile && (
        <CaregiverMode
          profile={profile}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}

export default App;
