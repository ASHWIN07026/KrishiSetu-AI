import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import {
  LANGUAGE_OPTIONS,
  STATE_DISTRICT_PROFILES,
  UI_TRANSLATIONS,
  DISTRICT_CLIMATE_ALERTS,
} from '../data/mockAgriData';
import {
  Sprout,
  Globe,
  MapPin,
  Share2,
  Volume2,
  ShieldCheck,
  ClipboardCheck,
  Bell,
  UserCheck,
  User,
} from 'lucide-react';
import { ActionChecklistModal } from './ActionChecklistModal';
import { AuthModal } from './AuthModal';
import { auth } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  currentTab: 'advisory' | 'diagnostic' | 'regenerative' | 'cooperation' | 'voice';
  setCurrentTab: (tab: 'advisory' | 'diagnostic' | 'regenerative' | 'cooperation' | 'voice') => void;
  selectedProfileId: string;
  setSelectedProfileId: (id: string) => void;
  selectedLanguage: SupportedLanguage;
  setSelectedLanguage: (lang: SupportedLanguage) => void;
  onOpenClimateAlerts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedProfileId,
  setSelectedProfileId,
  selectedLanguage,
  setSelectedLanguage,
  onOpenClimateAlerts,
}) => {
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.English;
  const currentProfile = STATE_DISTRICT_PROFILES.find((p) => p.id === selectedProfileId) || STATE_DISTRICT_PROFILES[0];
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const currentClimateAlert = DISTRICT_CLIMATE_ALERTS[selectedProfileId];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Quiet Utility Micro-Header */}
      <div className="bg-slate-950/90 px-4 py-1.5 border-b border-slate-800/70 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-300">National Agriculture Intelligence Network</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="hidden sm:inline">ICAR & IMD Open Protocol Compliant</span>
          <span aria-hidden="true" className="text-slate-600 hidden md:inline">·</span>
          <span className="text-slate-400 hidden md:inline">28 States & UTs Federated</span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 text-[11px] hidden sm:inline">Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
            className="bg-slate-900/90 hover:bg-slate-900 text-slate-200 text-xs rounded-md px-2 py-0.5 border border-slate-700/80 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium transition"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code} className="bg-slate-900 text-white">
                {opt.native} ({opt.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center p-2 text-emerald-400 shadow-sm shadow-emerald-950/40">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                {t.appTitle}
              </h1>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                DPG
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Climate Alert Indicator (Clean & Understated) */}
          {currentClimateAlert && (
            <button
              onClick={onOpenClimateAlerts}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                currentClimateAlert.severity === 'Critical'
                  ? 'bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border-rose-800/60'
                  : 'bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border-amber-800/60'
              }`}
              title="Click to view localized climate hazard warning"
            >
              <Bell className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">Alert</span>
              <span className="text-[10px] opacity-80 font-semibold">
                ({currentClimateAlert.eventType})
              </span>
            </button>
          )}

          {/* Action Checklist Button */}
          <button
            onClick={() => setIsChecklistOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
            title="Field Action Suggestions Checklist"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Suggestions</span>
            <span className="text-[10px] text-emerald-300 bg-emerald-950/80 border border-emerald-800/40 px-1.5 py-0.2 rounded font-semibold">
              4
            </span>
          </button>

          {/* State & District Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-700/80">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {STATE_DISTRICT_PROFILES.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.district}, {p.state} ({p.currentSeason})
                </option>
              ))}
            </select>
          </div>

          {/* Farmer Account & Cloud Firestore Sync Button */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
            title="Farmer Profile & Cloud Records"
          >
            {currentUser ? (
              <>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt=""
                    className="w-4 h-4 rounded-full border border-emerald-400"
                  />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="max-w-[70px] truncate text-emerald-300">
                  {currentUser.displayName?.split(' ')[0] || 'Farmer'}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Farmer ID</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav aria-label="Main Navigation" className="max-w-7xl mx-auto px-4 flex overflow-x-auto scrollbar-none border-t border-slate-800/70 text-xs sm:text-sm">
        <button
          onClick={() => setCurrentTab('advisory')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            currentTab === 'advisory'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span>{t.tabAdvisory}</span>
        </button>

        <button
          onClick={() => setCurrentTab('diagnostic')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            currentTab === 'diagnostic'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🔬</span>
          <span>{t.tabDiagnostic}</span>
        </button>

        <button
          onClick={() => setCurrentTab('regenerative')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            currentTab === 'regenerative'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-sm">🌱</span>
          <span>{t.tabRegenerative}</span>
        </button>

        <button
          onClick={() => setCurrentTab('cooperation')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            currentTab === 'cooperation'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
          <span>{t.tabCooperation}</span>
        </button>

        <button
          onClick={() => setCurrentTab('voice')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
            currentTab === 'voice'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span>{t.tabVoice}</span>
        </button>
      </nav>

      {/* Action Suggestions Checklist Modal */}
      <ActionChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        state={currentProfile.state}
        district={currentProfile.district}
        selectedLanguage={selectedLanguage}
      />

      {/* Farmer Account & Firebase Cloud Sync Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentState={currentProfile.state}
        currentDistrict={currentProfile.district}
        selectedLanguage={selectedLanguage}
      />
    </header>
  );
};
