import React, { useState, useEffect } from 'react';
import { CooperativeCompactResult, SupportedLanguage } from '../types';
import { ACTIVE_INTER_STATE_COMPACTS, InterStateCompact, UI_TRANSLATIONS } from '../data/mockAgriData';
import { SharedEquipmentPool } from './SharedEquipmentPool';
import {
  Share2,
  Network,
  ShieldCheck,
  Activity,
  ArrowRight,
  Database,
  Building2,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Globe2,
  Cpu,
  FileText,
  Radio,
} from 'lucide-react';

interface CooperativeGridProps {
  selectedLanguage: SupportedLanguage;
}

export const CooperativeGrid: React.FC<CooperativeGridProps> = ({ selectedLanguage }) => {
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.English;

  const [selectedCompact, setSelectedCompact] = useState<InterStateCompact>(ACTIVE_INTER_STATE_COMPACTS[0]);

  // Bilateral Generator State
  const [sourceState, setSourceState] = useState<string>('Punjab');
  const [targetState, setTargetState] = useState<string>('Haryana & Delhi NCR');
  const [challengeCategory, setChallengeCategory] = useState<string>(
    'Crop Residue Biomass & Stubble Management'
  );
  const [customInquiry, setCustomInquiry] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [compactResult, setCompactResult] = useState<CooperativeCompactResult | null>(null);

  // Simulated live telemetry packets for the DPG Network
  const [telemetryLogs, setTelemetryLogs] = useState<Array<{ id: number; time: string; source: string; target: string; payload: string; status: string }>>([
    {
      id: 1,
      time: 'Just now',
      source: 'Punjab-Ludhiana Node',
      target: 'Haryana-Karnal Hub',
      payload: 'PUSA Bio-decomposer Spore Count & Straw Density (JSON)',
      status: 'VERIFIED',
    },
    {
      id: 2,
      time: '1m ago',
      source: 'Maharashtra CWC Gauge',
      target: 'Karnataka Belagavi Canal Grid',
      payload: 'Krishna-Bhima Inflow Telemetry: 14,200 cusecs',
      status: 'VERIFIED',
    },
    {
      id: 3,
      time: '3m ago',
      source: 'Andhra-Guntur KVK',
      target: 'Telangana-Warangal Spice FPO',
      payload: 'Black Thrips Trap Vector Alert: +18% humidity spike',
      status: 'DISPATCHED',
    },
    {
      id: 4,
      time: '5m ago',
      source: 'Odisha Seed Corp',
      target: 'West Bengal Sundarbans Hub',
      payload: 'Swarna-Sub1 Flood Submergence Rice Seeds: 8,500 MT reserve',
      status: 'SETTLED',
    },
  ]);

  // Auto add simulated telemetry ticks
  useEffect(() => {
    const timer = setInterval(() => {
      const sampleEvents = [
        {
          source: 'Madhya Pradesh Malwa Grid',
          target: 'Rajasthan Kota Mandi',
          payload: 'Kodo Millet Carbon Verification Hash #8912',
          status: 'COMMITTED',
        },
        {
          source: 'Punjab Agri Dept',
          target: 'NTPC Jhajjar Thermal Plant',
          payload: 'Ex-Situ Biomass Pellet Consignment #PB-2045: 450 Tons',
          status: 'IN TRANSIT',
        },
        {
          source: 'Karnataka Water Board',
          target: 'Maharashtra Solapur Drip Collective',
          payload: 'Shared Aquifer Depletion Telemetry: -0.4m seasonal deficit',
          status: 'ALERTED',
        },
      ];
      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const newEntry = {
        id: Date.now(),
        time: 'Just now',
        source: randomEvent.source,
        target: randomEvent.target,
        payload: randomEvent.payload,
        status: randomEvent.status,
      };
      setTelemetryLogs((prev) => [newEntry, ...prev.slice(0, 5)]);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  const handleSynthesizeCompact = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cooperative-exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceState,
          targetState,
          initiativeCategory: challengeCategory,
          queryText: customInquiry,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to synthesize compact');
      }

      setCompactResult(data.data);
    } catch (err: any) {
      console.error('Cooperative generation error:', err);
      alert('Could not synthesize inter-state compact: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner / Manifesto */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-800/50 rounded-2xl p-6 md:p-8 shadow-2xl mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Share2 className="w-4 h-4 animate-spin-slow" />
              <span>National Theme: Inter-State Agricultural Cooperation</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/40">
                Krishi-DPG Open Grid
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Interoperable Digital Agriculture Network & Cooperative Grid
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              India's agro-ecological crises—groundwater depletion, pest migration corridors, stubble burning, and cyclonic storm surges—transcend state borders. KrishiSetu establishes the nation's first Digital Public Good (DPG) protocol enabling state governments, FPOs, and research institutions to pool data models, telemetry, and climate-resilient buffer stocks.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-amber-800/40 p-4 rounded-xl text-center shrink-0">
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xl mb-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>5 Active Corridors</span>
            </div>
            <span className="text-[11px] text-slate-400 block">Federated Across 14 Indian States</span>
            <span className="text-[10px] text-amber-400 font-semibold block mt-1">Open AgriStack Standard v2.4</span>
          </div>
        </div>
      </div>

      {/* Grid Section: Active Inter-State Corridors */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            Active Inter-State Agricultural Corridors (Field-Deployed)
          </h3>
          <span className="text-xs text-slate-400">Click a corridor to view cooperative telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACTIVE_INTER_STATE_COMPACTS.map((compact) => (
            <div
              key={compact.id}
              onClick={() => setSelectedCompact(compact)}
              className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                selectedCompact.id === compact.id
                  ? 'bg-slate-800/90 border-amber-500 shadow-xl shadow-amber-950/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                    {compact.status}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    {compact.sourceState} ↔ {compact.partnerState}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  {compact.corridorName}
                </h4>
                <p className="text-xs text-slate-400 mb-3">
                  {compact.challengeCategory}
                </p>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 mb-3">
                  <strong>Coordinated Action:</strong> {compact.keyIntervention}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <span>Data: {compact.sharedDataFeed.split('&')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Corridor Deep Dive & Live Telemetry Packet Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Selected Compact Telemetry Specs */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Corridor Protocol Blueprint
              </span>
              <h4 className="text-lg font-black text-white mt-0.5">
                {selectedCompact.corridorName}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Participating States</span>
              <span className="text-xs font-bold text-emerald-400">
                {selectedCompact.sourceState} & {selectedCompact.partnerState}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold text-[11px] uppercase">Cross-Border Agro-Ecological Challenge:</span>
              <p className="text-white font-medium mt-0.5">{selectedCompact.challengeCategory}</p>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold text-[11px] uppercase">Joint Institutional Action:</span>
              <p className="text-slate-300 leading-relaxed mt-0.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {selectedCompact.keyIntervention}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold block text-[10px] uppercase">
                  Federated Open Data Stream
                </span>
                <p className="text-slate-300 mt-1">{selectedCompact.sharedDataFeed}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold block text-[10px] uppercase">
                  Quantified Climate & Economic Impact
                </span>
                <p className="text-slate-300 mt-1">{selectedCompact.economicOrClimateImpact}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Inter-State Data Federation Packet Stream */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Live DPG Telemetry Stream
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                AgOpen-Schema v2.4
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {telemetryLogs.map((log) => (
                <div key={log.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                      {log.source} ➔ {log.target}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{log.payload}</p>
                  <span className="text-[9px] text-slate-500 mt-0.5 block">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
            <span>Encrypted Inter-State RPC Bridge</span>
            <span className="text-emerald-400 font-semibold">100% Protocol Uptime</span>
          </div>
        </div>
      </div>

      {/* Inter-State Cooperative Machinery & Drone Fleet Pool */}
      <div className="mb-10">
        <SharedEquipmentPool selectedLanguage={selectedLanguage} currentState={sourceState} />
      </div>

      {/* Interactive Bilateral Compact Generator (Gemini Powered) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Inter-State DPG Synthesizer</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white">
          Simulate a New Bilateral Agro-Cooperative Protocol
        </h3>
        <p className="text-xs md:text-sm text-slate-400 mt-1 mb-6 max-w-2xl">
          Pair any two Indian states to solve a shared cross-border agricultural challenge. Google Gemini will generate a complete bilateral agreement with open-data specifications, logistics frameworks, and farmer benefit metrics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Source State
            </label>
            <select
              value={sourceState}
              onChange={(e) => setSourceState(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
            >
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Odisha">Odisha</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Assam">Assam</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Partner State / Region
            </label>
            <select
              value={targetState}
              onChange={(e) => setTargetState(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
            >
              <option value="Haryana & Delhi NCR">Haryana & Delhi NCR</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Telangana">Telangana</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Odisha">Odisha</option>
              <option value="Bihar">Bihar</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Shared Cooperative Challenge
            </label>
            <select
              value={challengeCategory}
              onChange={(e) => setChallengeCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
            >
              <option value="Crop Residue Biomass & Stubble Management">Crop Residue Biomass & Stubble Management</option>
              <option value="River Basin Shared Water & Canal Discharge Allocation">River Basin Shared Water & Canal Allocation</option>
              <option value="Pest Migration Radar & Bio-Predator Logistics">Pest Migration Radar & Bio-Predator Logistics</option>
              <option value="Climate-Resilient Seed Vault & Buffer Stock">Climate-Resilient Seed Vault & Buffer Stock</option>
              <option value="Millets (Shree Anna) Collective & Soil Carbon Registry">Millets Collective & Soil Carbon Registry</option>
              <option value="Cold Chain & Perishable FPO Inter-State Corridor">Cold Chain & Perishable FPO Inter-State Corridor</option>
            </select>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Custom Inter-State Objective or Scenario (Optional)
          </label>
          <input
            type="text"
            value={customInquiry}
            onChange={(e) => setCustomInquiry(e.target.value)}
            placeholder="e.g. Set up a mutual drone spraying fleet sharing agreement during locust outbreaks or unseasonal pest attacks..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSynthesizeCompact}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs md:text-sm shadow-xl shadow-amber-950/40 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Synthesizing Inter-State Compact with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Draft Inter-State Cooperative Compact</span>
              </>
            )}
          </button>
        </div>

        {/* Synthesized Output Display */}
        {compactResult && (
          <div className="mt-8 pt-8 border-t border-slate-800 space-y-6">
            <div className="bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 p-6 rounded-2xl border border-amber-800/60 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4" />
                <span>Formally Synthesized Compact</span>
              </div>
              <h4 className="text-xl md:text-2xl font-black text-white">
                {compactResult.protocolTitle}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Bilateral Parties: <strong className="text-emerald-400">{compactResult.participatingStates.join(' & ')}</strong>
              </p>
              <p className="text-xs text-slate-300 mt-2 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <strong>Shared Ecological Challenge:</strong> {compactResult.commonEcologicalChallenge}
              </p>
            </div>

            {/* Tri-Pillar Interventions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compactResult.jointInterventions.map((item, idx) => (
                <div key={idx} className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded">
                      Pillar {idx + 1}: {item.pillar}
                    </span>
                    <p className="text-xs font-semibold text-white mt-2 leading-snug">
                      {item.action}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-300">
                    <strong>Digital Public Infra:</strong> {item.digitalInfrastructure}
                  </div>
                </div>
              ))}
            </div>

            {/* Impact Metrics & Open Data Spec */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Quantified Cooperative Impact
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li>• Carbon Mitigation: <strong className="text-white">{compactResult.impactMetrics.carbonReduction}</strong></li>
                  <li>• Smallholders Covered: <strong className="text-white">{compactResult.impactMetrics.farmersBenefitted}</strong></li>
                  <li>• Economic Value Unlocked: <strong className="text-white">{compactResult.impactMetrics.economicValueUnlocked}</strong></li>
                </ul>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <h5 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
                  Open Data Schema Specification
                </h5>
                <p className="text-[11px] text-slate-400 mb-1">Standard: {compactResult.openDataSpec.standardName}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {compactResult.openDataSpec.telemetryShared.map((tele, idx) => (
                    <span key={idx} className="bg-teal-950/60 text-teal-300 text-[10px] px-2 py-0.5 rounded border border-teal-800">
                      {tele}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pledge */}
            <div className="bg-emerald-950/20 border-l-4 border-emerald-500 p-4 rounded-r-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                Inter-State Federal Solidarity Pledge
              </span>
              <p className="text-xs md:text-sm text-slate-200 italic leading-relaxed">
                "{compactResult.cooperativePledge}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
