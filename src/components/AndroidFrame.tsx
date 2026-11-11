import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Signal,
  Battery,
  Smartphone,
  Monitor,
  Zap,
  ArrowLeft,
  Circle,
  Menu,
  Square,
  Sparkles,
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface AndroidFrameProps {
  children: React.ReactNode;
  theme: 'dark' | 'amoled' | 'light';
  onBackPress?: () => void;
  onHomePress?: () => void;
  canGoBack?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  theme,
  onBackPress,
  onHomePress,
  canGoBack = false,
}) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [deviceMode, setDeviceMode] = useState<'a16' | 'fluid'>('a16');
  const [navBarType, setNavBarType] = useState<'gesture' | 'buttons'>('gesture');
  const [showRecentsModal, setShowRecentsModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${minutes.toString().padStart(2, '0')}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    soundManager.playClick();
    if (onBackPress) {
      onBackPress();
    }
  };

  const handleHome = () => {
    soundManager.playClick();
    if (onHomePress) {
      onHomePress();
    }
    setShowRecentsModal(false);
  };

  const handleRecents = () => {
    soundManager.playClick();
    setShowRecentsModal((prev) => !prev);
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 flex flex-col items-center justify-start sm:p-3 ${
      theme === 'amoled'
        ? 'bg-black text-slate-100'
        : theme === 'light'
        ? 'bg-slate-100 text-slate-900'
        : 'bg-[#040711] text-slate-100'
    }`}>
      {/* Top Device Bar & Samsung A16 5G Info Bar (Visible on desktop/tablet) */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-5xl py-2 px-3 mb-1 text-xs text-slate-400 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Samsung Galaxy A16 5G</span>
          </div>
          <span className="text-slate-500">·</span>
          <span className="text-[11px] text-slate-300">
            6.7" Super AMOLED · 1080×2340 (19.5:9) · 90Hz · One UI 6.1
          </span>
        </div>

        {/* View Controls & Samsung System Nav Switcher */}
        <div className="flex items-center gap-2">
          {/* Nav style switcher for testing */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setNavBarType('gesture')}
              className={`px-2 py-0.5 rounded transition-colors ${
                navBarType === 'gesture'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Samsung One UI Gesture Bar"
            >
              Gesture Bar
            </button>
            <button
              onClick={() => setNavBarType('buttons')}
              className={`px-2 py-0.5 rounded transition-colors ${
                navBarType === 'buttons'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Samsung 3-Button Navigation (Recents, Home, Back)"
            >
              3-Button Nav
            </button>
          </div>

          {/* Device viewport frame switcher */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setDeviceMode('a16')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${
                deviceMode === 'a16'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Samsung Galaxy A16 5G 19.5:9 Screen"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>A16 5G Frame</span>
            </button>
            <button
              onClick={() => setDeviceMode('fluid')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${
                deviceMode === 'fluid'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Expanded Responsive View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Responsive</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Samsung Galaxy A16 5G Device Wrapper */}
      <div
        className={`w-full transition-all duration-200 ${
          deviceMode === 'a16'
            ? 'max-w-[420px] sm:my-1 sm:rounded-[46px] sm:border-[9px] sm:border-slate-800/95 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col h-[100dvh] sm:h-[890px] relative'
            : 'max-w-6xl mx-auto rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col min-h-[92vh]'
        } ${
          theme === 'amoled'
            ? 'bg-black text-slate-100'
            : theme === 'light'
            ? 'bg-white text-slate-900'
            : 'bg-[#080c16] text-slate-100'
        }`}
        style={{
          // Samsung A16 19.5:9 display ratio
          aspectRatio: deviceMode === 'a16' ? '9 / 19.5' : undefined,
        }}
      >
        {/* Samsung One UI Status Bar (90Hz, 5G, Battery, VoLTE, Infinity-U Camera Cutout) */}
        <div
          className={`shrink-0 h-10 px-5 flex items-center justify-between text-xs select-none z-50 border-b ${
            theme === 'amoled'
              ? 'bg-black border-white/[0.06] text-slate-200'
              : theme === 'light'
              ? 'bg-slate-100 border-slate-200 text-slate-800'
              : 'bg-[#0a0e1a]/98 border-white/[0.04] text-slate-200'
          }`}
        >
          {/* Clock & Notification icon */}
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-tight text-[12px]">
              {currentTime}
            </span>
            <span className="hidden xs:inline-block text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold">
              90Hz
            </span>
          </div>

          {/* Samsung Infinity-U Waterdrop Camera Notch */}
          <div className="flex flex-col items-center">
            <div className="w-5 h-3 bg-black rounded-b-full border-b border-x border-slate-800/70 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
            </div>
          </div>

          {/* Samsung One UI System Icons: VoLTE, 5G, Signal, Battery */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-cyan-400 font-extrabold px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30">
              5G
            </span>
            <span className="text-[8px] font-mono font-bold text-slate-400 hidden xs:inline">
              VoLTE
            </span>
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-0.5 text-emerald-400">
              <Battery className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold text-slate-300">92%</span>
            </div>
          </div>
        </div>

        {/* Content View Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative smooth-scroll-90hz">
          {children}

          {/* Samsung One UI App Switcher / Recents Preview Modal */}
          {showRecentsModal && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md p-6 flex flex-col items-center justify-center animate-fade-in">
              <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white mb-2 shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">LIFE OS Active Process</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Samsung Galaxy A16 5G · Low-RAM mode (14.2 MB memory footprint)
                </p>
                <div className="w-full mt-4 flex gap-2">
                  <button
                    onClick={handleHome}
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white"
                  >
                    Resume App
                  </button>
                  <button
                    onClick={() => setShowRecentsModal(false)}
                    className="py-2 px-3 rounded-xl bg-slate-800 text-xs text-slate-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Samsung System Navigation (Gesture Bar or 3-Button Navigation) */}
        {deviceMode === 'a16' && (
          <div
            className={`shrink-0 select-none border-t transition-colors ${
              theme === 'amoled'
                ? 'bg-black border-white/[0.06]'
                : theme === 'light'
                ? 'bg-slate-100 border-slate-200'
                : 'bg-[#0a0e1a] border-white/[0.04]'
            } ${navBarType === 'buttons' ? 'h-11 px-8 flex items-center justify-between' : 'h-5 flex items-center justify-center pb-1'}`}
          >
            {navBarType === 'gesture' ? (
              /* Samsung Gesture Bar: interactive swipe-up/tap trigger */
              <div
                onClick={handleHome}
                className="w-36 h-1.5 bg-slate-500/70 hover:bg-slate-400 rounded-full cursor-pointer transition-all active:w-40 active:scale-95"
                title="Samsung Gesture Pill (Tap for Home, Swipe for Recents)"
              />
            ) : (
              /* Samsung 3-Button Navigation: Interactive Recents, Home, Back */
              <>
                {/* 1. Recents Button (|||) */}
                <button
                  onClick={handleRecents}
                  className="w-10 h-8 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-transform"
                  title="Samsung Recents Button"
                  aria-label="Recent Apps"
                >
                  <div className="flex gap-1 items-center">
                    <span className="w-0.5 h-3.5 bg-current rounded-full" />
                    <span className="w-0.5 h-3.5 bg-current rounded-full" />
                    <span className="w-0.5 h-3.5 bg-current rounded-full" />
                  </div>
                </button>

                {/* 2. Home Button (Rounded square / ⌂) */}
                <button
                  onClick={handleHome}
                  className="w-10 h-8 flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-transform"
                  title="Samsung Home Button"
                  aria-label="Home"
                >
                  <div className="w-3.5 h-3.5 rounded-[4px] border-2 border-current" />
                </button>

                {/* 3. Back Button (<) */}
                <button
                  onClick={handleBack}
                  className={`w-10 h-8 flex items-center justify-center transition-transform active:scale-90 ${
                    canGoBack ? 'text-cyan-400 hover:text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Samsung Back Button (Hardware Back)"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
