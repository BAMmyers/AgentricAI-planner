// =============================================================================
// Activity View Component - AgentricAI-planner
// Full Activity Interaction Modal — touch-optimized for AAC devices
// Backend: AgentricAI-IED-ollama
// =============================================================================

import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { PlannerTask } from '../types';
import { llmService } from '../services/llmService';

interface ActivityViewProps {
  activity: PlannerTask;
  onComplete: () => void;
  onClose: () => void;
  feedback: string | null;
  isFeedbackLoading: boolean;
}

const ActivityView: React.FC<ActivityViewProps> = ({ activity, onComplete, onClose, feedback, isFeedbackLoading }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [writingText, setWritingText] = useState('');
  const sketchpadCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [musicDescription, setMusicDescription] = useState<string | null>(null);
  const [isMusicLoading, setIsMusicLoading] = useState(false);

  useEffect(() => {
    setMathAnswer('');
    setWritingText('');
    setIsSpeaking(false);
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setMusicDescription(null);
    setIsMusicLoading(false);
  }, [activity]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (!isFeedbackLoading || feedback)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isFeedbackLoading, feedback]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = sketchpadCanvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in event) {
      return {
        offsetX: event.touches[0].clientX - rect.left,
        offsetY: event.touches[0].clientY - rect.top
      };
    } else {
      return {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top
      };
    }
  };

  const getCanvasContext = useCallback(() => {
    const canvas = sketchpadCanvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    const context = getCanvasContext();
    if (!context) return;
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoords(event);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  }, [getCanvasContext]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    if (!isDrawing) return;
    const context = getCanvasContext();
    if (!context) return;
    const { offsetX, offsetY } = getCoords(event);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  }, [isDrawing, getCanvasContext]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    const context = getCanvasContext();
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  }, [isDrawing, getCanvasContext]);

  const clearCanvas = useCallback(() => {
    const canvas = sketchpadCanvasRef.current;
    const context = getCanvasContext();
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, [getCanvasContext]);
  
  useEffect(() => {
    if (activity.type === 'art' || activity.type === 'writing') {
      const canvas = sketchpadCanvasRef.current;
      const context = getCanvasContext();
      if (canvas && context) {
        const observer = new ResizeObserver(entries => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            canvas.width = width;
            canvas.height = height;
            context.lineCap = 'round';
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 4;
          }
        });
        observer.observe(canvas);

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        context.lineCap = 'round';
        context.strokeStyle = '#FFFFFF';
        context.lineWidth = 4;

        return () => observer.disconnect();
      }
    }
  }, [activity.type, getCanvasContext]);

  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = activity.content?.body || 'No content to read.';
    if (!textToRead.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateMusic = async (genre: string) => {
    setIsMusicLoading(true);
    setMusicDescription(null);

    const durationMinutes = activity.duration || 5;
    const prompt = `You are a creative music director. Describe a ${durationMinutes}-minute piece of instrumental ${genre} music suitable for background play during a child's free time. The description should be vivid and imaginative, detailing the tempo, instruments, and overall feeling of the song.`;

    try {
      const { text, error } = await llmService.generateText(prompt);
      if (error) throw new Error(error);
      setMusicDescription(text);
    } catch {
      setMusicDescription("Could not generate a music description at this time. Enjoy the quiet or hum your own tune!");
    } finally {
      setIsMusicLoading(false);
    }
  };

  const renderActivityContent = () => {
    switch (activity.type) {
      case 'reading':
        return (
          <div className="text-center">
            <h3 className="text-3xl font-bold text-cyan-400 mb-4">{activity.content?.title || activity.name}</h3>
            <div className="bg-neutral-800 p-4 rounded-lg max-h-64 overflow-y-auto text-left mb-6">
              <p className="text-lg text-gray-300 leading-relaxed">{activity.content?.body || 'Loading story...'}</p>
            </div>
            <button 
              onClick={handleReadAloud} 
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mr-4"
            >
              {isSpeaking ? 'Stop Reading 🤫' : 'Read Aloud 🔊'}
            </button>
          </div>
        );
      
      case 'math':
        return (
          <div className="text-center">
            <h3 className="text-3xl font-bold text-cyan-400 mb-4">{activity.content?.title || activity.name}</h3>
            <div className="bg-neutral-800 p-6 rounded-lg space-y-6">
              <p className="text-xl text-gray-300">{activity.content?.body || "Let's get started!"}</p>
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                placeholder="Answer"
                className="w-48 mx-auto p-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-4xl text-center font-bold text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                aria-label="Math answer input"
              />
            </div>
          </div>
        );
      
      case 'art':
        return (
          <div className="text-center w-full h-full flex flex-col">
            <div className="shrink-0">
              <h3 className="text-3xl font-bold text-cyan-400 mb-2">{activity.content?.title || activity.name}</h3>
              <p className="text-lg text-gray-300 mb-4">{activity.content?.body || "Let's get creative!"}</p>
            </div>
            <div className="w-full flex-grow bg-neutral-800 rounded-lg p-2 flex flex-col space-y-2 min-h-0">
              <canvas
                ref={sketchpadCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                onTouchCancel={stopDrawing}
                className="w-full h-full bg-neutral-950 rounded cursor-crosshair"
                style={{ touchAction: 'none' }}
              />
            </div>
            <div className="flex space-x-4 mt-4 shrink-0">
              <button
                onClick={clearCanvas}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Clear Canvas
              </button>
              <button
                onClick={onComplete}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                I'm Finished!
              </button>
            </div>
          </div>
        );
      
      case 'writing':
        return (
          <div className="text-center w-full h-full flex flex-col">
            <div className="shrink-0">
              <h3 className="text-3xl font-bold text-cyan-400 mb-2">{activity.content?.title || activity.name}</h3>
              <p className="text-lg text-gray-300 mb-4">{activity.content?.body || "Let's get started!"}</p>
            </div>
            <div className="w-full flex-grow grid grid-cols-2 gap-4 min-h-0">
              <div className="h-full flex flex-col bg-neutral-800 rounded-lg p-2 space-y-2">
                <label className="text-sm font-bold text-gray-400">Draw or write here</label>
                <canvas
                  ref={sketchpadCanvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  onTouchCancel={stopDrawing}
                  className="w-full h-full bg-neutral-950 rounded cursor-crosshair"
                  style={{ touchAction: 'none' }}
                />
                <button
                  onClick={clearCanvas}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg text-xs transition-colors"
                >
                  Clear Sketchpad
                </button>
              </div>
              <div className="h-full flex flex-col bg-neutral-800 rounded-lg p-2 space-y-2">
                <label className="text-sm font-bold text-gray-400">Or type here</label>
                <textarea
                  value={writingText}
                  onChange={(e) => setWritingText(e.target.value)}
                  placeholder="Type your sentences..."
                  className="w-full h-full flex-grow p-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-lg text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition resize-none"
                  aria-label="Writing practice text input"
                />
              </div>
            </div>
          </div>
        );
      
      case 'play':
        return (
          <div className="text-center w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-cyan-400 mb-4">{activity.content?.title || activity.name}</h3>
            <p className="text-lg text-gray-300 mb-6 max-w-lg">{activity.content?.body}</p>
            
            <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-2xl">
              <p className="text-lg text-gray-300 mb-4">If you would like, here are some music choices you can play in the background:</p>
              <div className="flex justify-center space-x-4 mb-6">
                {['Pop', 'Electronica', 'Funk'].map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenerateMusic(genre)}
                    disabled={isMusicLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors text-lg disabled:opacity-50"
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {isMusicLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  <p className="ml-3 text-gray-300">Composing your track...</p>
                </div>
              )}
              {musicDescription && !isMusicLoading && (
                <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                  <h4 className="font-bold text-purple-400 mb-2">Your Soundtrack:</h4>
                  <p className="text-gray-300 whitespace-pre-wrap">{musicDescription}</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'social_studies':
        return (
          <div className="text-center">
            <h3 className="text-3xl font-bold text-cyan-400 mb-4">{activity.content?.title || activity.name}</h3>
            <div className="bg-neutral-800 p-6 rounded-lg">
              <p className="text-xl text-gray-300">{activity.content?.body || "Let's get started!"}</p>
            </div>
          </div>
        );
      
      case 'communication':
        return (
          <div className="text-center w-full">
            <h3 className="text-3xl font-bold text-purple-400 mb-4">{activity.content?.title || activity.name}</h3>
            <div className="bg-neutral-800 p-6 rounded-lg mb-6">
              <p className="text-xl text-gray-300 mb-6">{activity.content?.body || "Let's practice communicating!"}</p>
              
              {/* Emotion/Communication Buttons - AAC Style */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { emoji: '😊', label: 'Happy', color: 'bg-yellow-500/20 border-yellow-500' },
                  { emoji: '😴', label: 'Tired', color: 'bg-blue-500/20 border-blue-500' },
                  { emoji: '🎉', label: 'Excited', color: 'bg-pink-500/20 border-pink-500' },
                  { emoji: '😌', label: 'Calm', color: 'bg-green-500/20 border-green-500' },
                  { emoji: '😢', label: 'Sad', color: 'bg-blue-600/20 border-blue-600' },
                  { emoji: '😤', label: 'Frustrated', color: 'bg-red-500/20 border-red-500' },
                  { emoji: '🤔', label: 'Thinking', color: 'bg-purple-500/20 border-purple-500' },
                  { emoji: '🤗', label: 'Loved', color: 'bg-rose-500/20 border-rose-500' }
                ].map((emotion) => (
                  <button
                    key={emotion.label}
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(`I feel ${emotion.label}`);
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className={`${emotion.color} border-2 rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform active:scale-95`}
                  >
                    <span className="text-5xl">{emotion.emoji}</span>
                    <span className="text-lg font-medium text-white">{emotion.label}</span>
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-6">
                Tap a feeling to hear it spoken aloud
              </p>
            </div>
          </div>
        );
      
      case 'movement':
        return (
          <div className="text-center w-full">
            <h3 className="text-3xl font-bold text-emerald-400 mb-4">{activity.content?.title || activity.name}</h3>
            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="text-8xl mb-6 animate-bounce">🏃</div>
              <p className="text-xl text-gray-300 mb-6">{activity.content?.body || "Time to move your body!"}</p>
              
              {/* Movement Activity Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
                {[
                  { emoji: '🙆', action: 'Stretch up high!' },
                  { emoji: '🙇', action: 'Touch your toes' },
                  { emoji: '🔄', action: 'Spin around slowly' },
                  { emoji: '👏', action: 'Clap 5 times' },
                  { emoji: '🦘', action: 'Jump 3 times' },
                  { emoji: '🤗', action: 'Give yourself a hug' }
                ].map((move, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 flex flex-col items-center gap-2"
                  >
                    <span className="text-4xl">{move.emoji}</span>
                    <span className="text-sm text-white">{move.action}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-400">
                Moving your body helps your brain learn better! 💪
              </p>
            </div>
          </div>
        );
      
      case 'break':
        return (
          <div className="text-center w-full">
            <h3 className="text-3xl font-bold text-amber-400 mb-4">{activity.content?.title || activity.name}</h3>
            <div className="bg-neutral-800 p-6 rounded-lg">
              <div className="text-8xl mb-6">☀️</div>
              <p className="text-xl text-gray-300 mb-6">{activity.content?.body || "Time for a break!"}</p>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 max-w-md mx-auto">
                <h4 className="text-lg font-semibold text-amber-400 mb-3">Break Time Suggestions:</h4>
                <ul className="text-left text-gray-300 space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">🍎</span>
                    <span>Have a healthy snack</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">💧</span>
                    <span>Drink some water</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">🚶</span>
                    <span>Take a short walk</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">😌</span>
                    <span>Rest your eyes</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-gray-400 mt-6">
                Taking breaks helps you learn better! Come back when you're ready. 🌟
              </p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <div className="text-8xl mb-4">{activity.icon}</div>
            <h3 className="text-4xl font-bold text-gray-200">{activity.name}</h3>
            <p className="text-lg text-gray-400 mt-2">{activity.content?.body || 'Time to begin!'}</p>
          </div>
        );
    }
  };
  
  const renderContent = () => {
    if (isFeedbackLoading) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400"></div>
          <p className="mt-4 text-lg text-gray-300">Analyzing your great work...</p>
        </div>
      );
    }
    
    if (feedback) {
      return (
        <div className="text-center flex flex-col items-center justify-center">
          <div className="text-7xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-green-400 mb-4">Task Complete!</h3>
          <p className="text-xl text-gray-200 mb-8 max-w-lg">{feedback}</p>
          <button
            onClick={onClose}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-full transition-colors text-xl shadow-lg"
          >
            Continue
          </button>
        </div>
      );
    }

    return (
      <>
        <div className={`w-full flex-grow flex flex-col ${activity.type === 'art' || activity.type === 'writing' ? 'items-stretch' : 'items-center justify-center'}`}>
          {renderActivityContent()}
        </div>
        {activity.type !== 'art' && (
          <button
            onClick={onComplete}
            className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-xl shadow-lg"
          >
            I'm Finished!
          </button>
        )}
      </>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" 
      onClick={!isFeedbackLoading && feedback ? onClose : undefined}
    >
      <div 
        className="bg-neutral-900 border-4 border-dotted border-neutral-700 rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] max-h-[45rem] p-8 flex flex-col items-stretch justify-center relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default ActivityView;
