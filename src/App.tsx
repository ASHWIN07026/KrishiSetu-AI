/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SupportedLanguage } from './types';
import { STATE_DISTRICT_PROFILES, DISTRICT_CLIMATE_ALERTS } from './data/mockAgriData';
import { Navbar } from './components/Navbar';
import { LocalizedAdvisory } from './components/LocalizedAdvisory';
import { DiagnosticTool } from './components/DiagnosticTool';
import { RegenerativePlanner } from './components/RegenerativePlanner';
import { CooperativeGrid } from './components/CooperativeGrid';
import { FarmerVoiceAssistant } from './components/FarmerVoiceAssistant';
import { ClimateAlertBanner } from './components/ClimateAlertBanner';
import { ClimateNotificationCenter } from './components/ClimateNotificationCenter';
import { ToastContainer } from './components/ToastContainer';
import { Sprout, Share2, Shield, HeartHandshake, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'advisory' | 'diagnostic' | 'regenerative' | 'cooperation' | 'voice'
  >('advisory');

  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    STATE_DISTRICT_PROFILES[0].id
  );
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('English');
  const [isClimateModalOpen, setIsClimateModalOpen] = useState<boolean>(false);

  const currentProfile =
    STATE_DISTRICT_PROFILES.find((p) => p.id === selectedProfileId) ||
    STATE_DISTRICT_PROFILES[0];

  const currentClimateAlert = DISTRICT_CLIMATE_ALERTS[selectedProfileId];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedProfileId={selectedProfileId}
        setSelectedProfileId={setSelectedProfileId}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onOpenClimateAlerts={() => setIsClimateModalOpen(true)}
      />

      {/* Real-time Extreme Weather & Climate Impact Alert Strip */}
      {currentClimateAlert && (
        <ClimateAlertBanner
          alert={currentClimateAlert}
          selectedLanguage={selectedLanguage}
          onOpenDetails={() => setIsClimateModalOpen(true)}
        />
      )}

      {/* Extreme Climate Notification Center Modal */}
      <ClimateNotificationCenter
        isOpen={isClimateModalOpen}
        onClose={() => setIsClimateModalOpen(false)}
        selectedProfileId={selectedProfileId}
        selectedLanguage={selectedLanguage}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {currentTab === 'advisory' && (
          <LocalizedAdvisory
            selectedProfileId={selectedProfileId}
            selectedLanguage={selectedLanguage}
          />
        )}

        {currentTab === 'diagnostic' && (
          <DiagnosticTool
            selectedLanguage={selectedLanguage}
            currentState={currentProfile.state}
            currentDistrict={currentProfile.district}
          />
        )}

        {currentTab === 'regenerative' && (
          <RegenerativePlanner
            selectedLanguage={selectedLanguage}
            currentState={currentProfile.state}
            currentDistrict={currentProfile.district}
          />
        )}

        {currentTab === 'cooperation' && (
          <CooperativeGrid selectedLanguage={selectedLanguage} />
        )}

        {currentTab === 'voice' && (
          <FarmerVoiceAssistant
            selectedLanguage={selectedLanguage}
            currentState={currentProfile.state}
            currentDistrict={currentProfile.district}
          />
        )}
      </main>

      {/* Clean Institutional Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-xs text-slate-400 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
              KS
            </div>
            <p className="text-slate-300 font-medium">
              KrishiSetu AI · Open National Agricultural Intelligence Network
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Aligned with ICAR & IMD Standards</span>
            <span aria-hidden="true">·</span>
            <span>Digital Public Infrastructure</span>
            <span aria-hidden="true">·</span>
            <span>8 Regional Languages</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
