import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Check, X, Sparkles, Volume2 } from 'lucide-react';
import { voiceService, parseVoiceInput, ParsedVoiceCommand } from '../utils/speechRecognition';
import { soundManager } from '../utils/soundEffects';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveHabit: (habitData: any) => void;
  onSaveTask: (taskData: any) => void;
  soundEnabled: boolean;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onSaveHabit,
  onSaveTask,
  soundEnabled,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedDraft, setParsedDraft] = useState<ParsedVoiceCommand | null>(null);
  const [statusMessage, setStatusMessage] = useState('Tap microphone and speak...');

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setParsedDraft(null);
      setStatusMessage('Tap microphone and speak... (e.g. "Add daily coding at 6 PM")');
    } else {
      voiceService.stopListening();
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (soundEnabled) soundManager.playClick();
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      setStatusMessage('Voice recognition paused.');
    } else {
      setTranscript('');
      setParsedDraft(null);
      setIsListening(true);
      setStatusMessage('Listening... Speak now.');

      voiceService.startListening(
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setIsListening(false);
            const draft = parseVoiceInput(text);
            setParsedDraft(draft);
            setStatusMessage('Draft ready! Review and confirm below:');
          }
        },
        (err) => {
          setIsListening(false);
          setStatusMessage(`Microphone issue: ${err}. You can type command below.`);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleManualParse = (text: string) => {
    setTranscript(text);
    const draft = parseVoiceInput(text);
    setParsedDraft(draft);
    setStatusMessage('Draft ready! Review and confirm:');
  };

  const handleConfirm = () => {
    if (!parsedDraft) return;
    if (soundEnabled) soundManager.playHabitDone();

    if (parsedDraft.type === 'habit') {
      onSaveHabit({
        name: parsedDraft.title,
        category: parsedDraft.category,
        reminderTime: parsedDraft.time || '09:00',
        frequency: parsedDraft.frequency || 'daily',
        habitType: 'boolean',
        targetValue: 1,
        unit: 'done',
        color: '#8b5cf6',
        icon: 'Sparkles',
        description: `Voice created habit: ${transcript}`,
      });
    } else {
      onSaveTask({
        title: parsedDraft.title,
        category: parsedDraft.category,
        dueTime: parsedDraft.time || '14:00',
        priority: parsedDraft.priority || 'medium',
        description: `Voice created task: ${transcript}`,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#0d1322] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Android Voice Input</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Mic Button with Pulse */}
        <div className="my-3 relative flex items-center justify-center">
          {isListening && (
            <div className="absolute w-24 h-24 rounded-full bg-purple-500/20 animate-ping" />
          )}
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/40 scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8 animate-pulse" /> : <MicOff className="w-8 h-8" />}
          </button>
        </div>

        <p className="text-xs text-center text-slate-400 mb-3 px-2 min-h-[32px]">{statusMessage}</p>

        {/* Live transcript or text fallback */}
        <div className="w-full bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80 mb-3 text-left">
          <label className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">
            Speech Transcript
          </label>
          <input
            type="text"
            value={transcript}
            onChange={(e) => handleManualParse(e.target.value)}
            placeholder='Or type: "Add daily coding at 6 PM"'
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Parsed Draft preview */}
        {parsedDraft && (
          <div className="w-full bg-purple-950/30 border border-purple-500/30 rounded-2xl p-3 mb-4 text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Parsed Intent: {parsedDraft.type.toUpperCase()}</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Title:</span>
                <span className="text-white font-medium">{parsedDraft.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-cyan-400">{parsedDraft.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time:</span>
                <span className="text-slate-300">{parsedDraft.time}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!parsedDraft}
            className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              parsedDraft
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-600/30 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
