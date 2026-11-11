import React, { useState } from 'react';
import { Lock, Fingerprint, X, Delete } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface PinLockModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  correctPin: string;
  title?: string;
  soundEnabled: boolean;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  correctPin,
  title = 'Private Journal Locked',
  soundEnabled,
}) => {
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (soundEnabled) soundManager.playClick();
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          if (soundEnabled) soundManager.playHabitDone();
          setTimeout(() => {
            setPin('');
            onSuccess();
          }, 150);
        } else {
          setErrorShake(true);
          setTimeout(() => {
            setPin('');
            setErrorShake(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    if (soundEnabled) soundManager.playClick();
    setPin((prev) => prev.slice(0, -1));
  };

  const handleBiometric = () => {
    if (soundEnabled) soundManager.playHabitDone();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-xs bg-[#0d1322] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center ${
          errorShake ? 'animate-bounce' : ''
        }`}
      >
        <div className="w-full flex justify-end">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-400 mb-5">
          Enter your 4-digit PIN code (Default: {correctPin})
        </p>

        {/* PIN Dots */}
        <div className="flex items-center gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                pin.length > idx
                  ? 'bg-cyan-400 scale-110 shadow-sm shadow-cyan-400/50'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-base font-semibold text-white active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBiometric}
            className="h-12 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-purple-400 flex items-center justify-center active:scale-95 transition-all"
            title="Simulate Fingerprint Scan"
          >
            <Fingerprint className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-base font-semibold text-white active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 flex items-center justify-center active:scale-95 transition-all"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleBiometric}
          className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>Unlock with Fingerprint</span>
        </button>
      </div>
    </div>
  );
};
