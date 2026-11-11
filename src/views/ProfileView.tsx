import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Bell,
  Volume2,
  VolumeX,
  FileCode,
  Smartphone,
  Check,
  Edit2,
  Sparkles,
  Info,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../types';
import { exportBackupJSON, resetAllDataToDefault } from '../utils/storage';
import { soundManager } from '../utils/soundEffects';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  allAppData: any;
  onOpenExportModal: () => void;
  onOpenPinModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: 'dark' | 'amoled' | 'light';
  onToggleTheme: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  allAppData,
  onOpenExportModal,
  onOpenPinModal,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [tagline, setTagline] = useState(user.tagline);
  const [avatar, setAvatar] = useState(user.avatar);
  const [pinCode, setPinCode] = useState(user.pinCode);

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) soundManager.playHabitDone();
    onUpdateUser({
      ...user,
      name,
      email,
      tagline,
      avatar,
      pinCode,
    });
    setIsEditing(false);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.habits && parsed.goals) {
          localStorage.clear();
          Object.keys(parsed).forEach((k) => {
            localStorage.setItem(k, JSON.stringify(parsed[k]));
          });
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12 text-left">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Profile & Settings</h2>
        <p className="text-xs text-slate-400">Manage security, offline backup, and device preferences.</p>
      </div>

      {/* User Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#12192e] to-[#0c1220] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shrink-0 shadow-lg shadow-purple-600/30">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-[14px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">{user.name}</h3>
              <span className="text-xs text-cyan-400 font-mono">{user.email}</span>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{user.tagline}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) soundManager.playClick();
              setIsEditing(!isEditing);
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center shrink-0"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Profile Form Inline */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-4 pt-3 border-t border-slate-800 space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Personal Motto</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Select Avatar</label>
              <div className="flex items-center gap-2">
                {sampleAvatars.map((av) => (
                  <img
                    key={av}
                    src={av}
                    onClick={() => setAvatar(av)}
                    className={`w-10 h-10 rounded-xl object-cover cursor-pointer transition-transform ${
                      avatar === av ? 'ring-2 ring-cyan-400 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md transition-colors"
            >
              Save Profile
            </button>
          </form>
        )}
      </div>

      {/* Security & PIN Lock */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Security & Privacy</span>
        </h3>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-white block">4-Digit PIN Protection</span>
            <span className="text-[11px] text-slate-400">
              Locks private journal and sensitive metrics (Current: {user.pinCode})
            </span>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) soundManager.playClick();
              onUpdateUser({
                ...user,
                isPinEnabled: !user.isPinEnabled,
              });
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              user.isPinEnabled ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                user.isPinEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* App Preferences */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          System Preferences
        </h3>

        {/* Theme Selector (Dark Navy, AMOLED Pure Black, One UI Light) */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Display Theme</span>
                <span className="text-[10px] text-slate-400">AMOLED mode cuts battery consumption on Galaxy A16</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              {theme === 'amoled' ? 'Pure Black' : theme === 'light' ? 'One UI Light' : 'Dark Navy'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={() => {
                if (soundEnabled) soundManager.playClick();
                onUpdateUser({ ...user, theme: 'dark' });
              }}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                theme === 'dark'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Dark Navy</span>
            </button>

            <button
              onClick={() => {
                if (soundEnabled) soundManager.playClick();
                onUpdateUser({ ...user, theme: 'amoled' });
              }}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                theme === 'amoled'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Zap className="w-3 h-3 text-emerald-300" />
              <span>AMOLED</span>
            </button>

            <button
              onClick={() => {
                if (soundEnabled) soundManager.playClick();
                onUpdateUser({ ...user, theme: 'light' });
              }}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                theme === 'light'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>One UI Light</span>
            </button>
          </div>
        </div>

        {/* Samsung Galaxy A16 5G Hardware Profile */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-900 border border-blue-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Samsung Galaxy A16 5G</span>
                <span className="text-[10px] text-emerald-400 font-mono">Optimized Hardware Profile</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30">
              One UI 6.1
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 pt-1">
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Display Ratio</span>
              <strong className="text-white">6.7" 19.5:9 (1080×2340)</strong>
            </div>
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Screen Refresh</span>
              <strong className="text-white">90Hz Super AMOLED</strong>
            </div>
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Architecture</span>
              <strong className="text-white">ARM64-v8a (Dimensity/Exynos)</strong>
            </div>
            <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 block">Offline Mode</span>
              <strong className="text-emerald-400">100% Local SQLite DB</strong>
            </div>
          </div>
        </div>

        {/* Audio Synthesis */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-2.5">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <div>
              <span className="text-xs font-semibold text-white block">Haptic Audio Cues</span>
              <span className="text-[10px] text-slate-400">Web Audio synthesized chimes</span>
            </div>
          </div>
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) soundManager.playHabitDone();
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Android Native Studio Project & APK Center */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/30 space-y-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Android Native Studio Project & APK
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Download the production Kotlin + Jetpack Compose Android Studio project zip, Room DB schemas, and Gradle APK build scripts.
        </p>
        <button
          onClick={onOpenExportModal}
          className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-600/30"
        >
          <FileCode className="w-4 h-4" />
          <span>Open Android Source & APK Center</span>
        </button>
      </div>

      {/* Backup, Restore & Reset */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Data Backup & Offline Portability
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => exportBackupJSON(allAppData)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white block">Export JSON</span>
              <span className="text-[10px] text-slate-400">Save full backup</span>
            </div>
          </button>

          <label className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs font-bold text-white block">Import JSON</span>
              <span className="text-[10px] text-slate-400">Restore from file</span>
            </div>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data back to original defaults?')) {
              resetAllDataToDefault();
            }
          }}
          className="w-full py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Data to Initial Demo State</span>
        </button>
      </div>
    </div>
  );
};
