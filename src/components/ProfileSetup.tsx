// =============================================================================
// Profile Setup - First-time onboarding for caregivers
// Creates the student profile that drives all AI adaptation
// =============================================================================

import { useState } from 'react';
import type { StudentProfile } from '../types';

interface ProfileSetupProps {
  onComplete: (profile: StudentProfile) => void;
}

const avatarOptions = ['🧒', '👧', '👦', '🧒🏽', '👧🏾', '👦🏻', '🧒🏿', '👧🏼'];
const gradeOptions = ['Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'];
const learningStyles = ['Visual', 'Auditory', 'Kinesthetic', 'Visual-Kinesthetic', 'Multi-Sensory'];
const commModes: { value: 'verbal' | 'aac' | 'mixed'; label: string }[] = [
  { value: 'verbal', label: 'Verbal' },
  { value: 'aac', label: 'AAC Device' },
  { value: 'mixed', label: 'Mixed (Verbal + AAC)' }
];
const commLevels = ['Pre-Communicator', 'Emerging Communicator', 'Developing Communicator', 'Functional Communicator'];

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧒');
  const [age, setAge] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [communicationMode, setCommunicationMode] = useState<'verbal' | 'aac' | 'mixed'>('aac');
  const [communicationLevel, setCommunicationLevel] = useState('');
  const [step, setStep] = useState(1);

  const canProceedStep1 = name.trim().length > 0 && age.trim().length > 0;
  const canProceedStep2 = gradeLevel.length > 0 && learningStyle.length > 0;
  const canProceedStep3 = communicationLevel.length > 0;

  const handleSubmit = () => {
    const profile: StudentProfile = {
      id: 'active-student',
      name: name.trim(),
      avatar,
      age: parseInt(age) || 0,
      gradeLevel,
      learningStyle,
      communicationMode,
      communicationLevel,
      streak: 0,
      totalSessions: 0,
      createdAt: new Date().toISOString()
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🧠</span>
          <h1 className="text-3xl font-bold mb-2">AgentricAI-planner</h1>
          <p className="text-neutral-400">Student Profile Setup</p>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-colors ${
                  s === step ? 'bg-indigo-500' : s < step ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-8">
          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Who is this for?</h2>
                <p className="text-sm text-neutral-400">Basic information about the student</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Student's Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Avatar</label>
                <div className="flex gap-3 flex-wrap">
                  {avatarOptions.map(a => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      className={`text-3xl p-2 rounded-xl transition-all ${
                        avatar === a
                          ? 'bg-indigo-500/20 border-2 border-indigo-500 scale-110'
                          : 'bg-neutral-900 border-2 border-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Age</label>
                <input
                  type="number"
                  min="3"
                  max="18"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age..."
                  className="w-32 px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold rounded-lg transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Learning */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Learning Profile</h2>
                <p className="text-sm text-neutral-400">Help the AI understand how {name} learns best</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Grade Level</label>
                <div className="flex flex-wrap gap-2">
                  {gradeOptions.map(g => (
                    <button
                      key={g}
                      onClick={() => setGradeLevel(g)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        gradeLevel === g
                          ? 'bg-indigo-500 text-white'
                          : 'bg-neutral-900 border border-neutral-600 text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Primary Learning Style</label>
                <div className="flex flex-wrap gap-2">
                  {learningStyles.map(ls => (
                    <button
                      key={ls}
                      onClick={() => setLearningStyle(ls)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        learningStyle === ls
                          ? 'bg-indigo-500 text-white'
                          : 'bg-neutral-900 border border-neutral-600 text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {ls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold rounded-lg transition-colors"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Communication */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Communication</h2>
                <p className="text-sm text-neutral-400">How does {name} communicate?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Communication Mode</label>
                <div className="flex flex-wrap gap-2">
                  {commModes.map(cm => (
                    <button
                      key={cm.value}
                      onClick={() => setCommunicationMode(cm.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        communicationMode === cm.value
                          ? 'bg-indigo-500 text-white'
                          : 'bg-neutral-900 border border-neutral-600 text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {cm.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Communication Level</label>
                <div className="flex flex-wrap gap-2">
                  {commLevels.map(cl => (
                    <button
                      key={cl}
                      onClick={() => setCommunicationLevel(cl)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        communicationLevel === cl
                          ? 'bg-indigo-500 text-white'
                          : 'bg-neutral-900 border border-neutral-600 text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {cl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                <p className="text-xs text-indigo-300">
                  🛡️ This profile is stored locally on this device and encrypted by the Guardian agent.
                  It is never transmitted to external servers.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceedStep3}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-bold rounded-lg transition-colors"
                >
                  Create Profile ✓
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          AgentricAI-planner • Privacy by architecture • All data stored locally
        </p>
      </div>
    </div>
  );
}
