import React, { useState } from 'react';
import { ClimateEventAlert, SupportedLanguage } from '../types';
import { DISTRICT_CLIMATE_ALERTS, STATE_DISTRICT_PROFILES } from '../data/mockAgriData';
import { playFarmerAudio, stopSpeech } from '../utils/speech';
import {
  X,
  AlertTriangle,
  Flame,
  CloudRain,
  Snowflake,
  Wind,
  Waves,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Bell,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface ClimateNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProfileId: string;
  selectedLanguage: SupportedLanguage;
}

export const ClimateNotificationCenter: React.FC<ClimateNotificationCenterProps> = ({
  isOpen,
  onClose,
  selectedProfileId,
  selectedLanguage,
}) => {
  if (!isOpen) return null;

  const currentProfile =
    STATE_DISTRICT_PROFILES.find((p) => p.id === selectedProfileId) ||
    STATE_DISTRICT_PROFILES[0];

  const primaryAlert: ClimateEventAlert | undefined =
    DISTRICT_CLIMATE_ALERTS[selectedProfileId] ||
    DISTRICT_CLIMATE_ALERTS['maharashtra-akola'];

  const otherAlerts = Object.values(DISTRICT_CLIMATE_ALERTS).filter(
    (a) => a.districtId !== selectedProfileId
  );

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'primary' | 'all'>('primary');

  const handleToggleVoice = () => {
    if (!primaryAlert) return;
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      playFarmerAudio(
        primaryAlert.spokenAudioWarning,
        selectedLanguage,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleShareWhatsApp = () => {
    if (!primaryAlert) return;
    const text = `🚨 *URGENT AGROMET WEATHER ALERT: ${currentProfile.district}, ${currentProfile.state}* 🚨\n\n` +
      `⚠️ *Event:* ${primaryAlert.headline}\n` +
      `⏱️ *Onset Window:* ${primaryAlert.onsetForecast} (${primaryAlert.duration})\n` +
      `📊 *Weather Telemetry:* ${primaryAlert.temperatureOrRainStat}\n` +
      `🌾 *Crops at Risk:* ${primaryAlert.vulnerableCrops.join(', ')}\n\n` +
      `🛡️ *Immediate Emergency Measures:* \n` +
      primaryAlert.immediateProtectiveMeasures.map((m, idx) => `${idx + 1}. ${m}`).join('\n') +
      `\n\n_Dispatched via KrishiSetu Interoperable Agromet Network & IMD Agromet Advisory_`;

    navigator.clipboard.writeText(text);
    alert('Emergency Weather Alert copied! Paste and broadcast to your Village Farmer WhatsApp Group.');
  };

  const getEventIcon = (type: ClimateEventAlert['eventType']) => {
    switch (type) {
      case 'Heatwave':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Unseasonal Rain':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'Cold Wave / Frost':
        return <Snowflake className="w-5 h-5 text-blue-400" />;
      case 'High Wind Lodging':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'Flash Flood / Cyclone':
        return <Waves className="w-5 h-5 text-rose-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-red-800/80 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-900/40 p-2 border border-red-400/40">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">
                  IMD Agromet Extreme Climate Emergency Feed
                </h3>
                <span className="bg-red-500/20 text-red-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-red-500/40 animate-pulse">
                  Live Early-Warning
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time thermal anomaly, cloudburst, and frost alerts for {currentProfile.district}, {currentProfile.state}.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              setIsPlayingAudio(false);
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switch: District Alert vs National Grid */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('primary')}
            className={`flex-1 py-2 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'primary'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Current District: {currentProfile.district}</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>All Regional Alerts ({otherAlerts.length + 1})</span>
          </button>
        </div>

        {activeTab === 'primary' && primaryAlert && (
          <div className="space-y-5">
            {/* Anomaly Banner Card */}
            <div className="bg-gradient-to-r from-red-950/70 via-slate-950 to-amber-950/70 p-5 rounded-2xl border border-red-800/80 shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-red-900/60 border border-red-700">
                    {getEventIcon(primaryAlert.eventType)}
                  </span>
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {primaryAlert.severity} Alert
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    {primaryAlert.eventType}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Onset: <strong className="text-white">{primaryAlert.onsetForecast}</strong></span>
                  <span className="text-slate-500">•</span>
                  <span>{primaryAlert.duration}</span>
                </div>
              </div>

              <h4 className="text-lg md:text-xl font-black text-white">
                {primaryAlert.vernacularHeadline[selectedLanguage] || primaryAlert.headline}
              </h4>

              <div className="bg-black/50 p-2.5 rounded-xl border border-red-900/40 text-xs font-mono text-amber-300 flex justify-between items-center">
                <span>Radiometric Telemetry: <strong>{primaryAlert.temperatureOrRainStat}</strong></span>
                <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded text-red-300 border border-red-800">
                  Anomaly Detected
                </span>
              </div>
            </div>

            {/* Vulnerable Crops & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block">
                  Crops & Growth Stages at Risk in {currentProfile.district}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {primaryAlert.vulnerableCrops.map((crop, idx) => (
                    <span
                      key={idx}
                      className="bg-rose-950/60 text-rose-200 text-xs px-2.5 py-1 rounded-lg border border-rose-900/80 font-medium"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Agronomic Shock Impact
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {primaryAlert.impactAnalysis}
                </p>
              </div>
            </div>

            {/* Emergency Protective Actions Protocol */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Mandatory Emergency Farm Countermeasures
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                  Field Proven (ICAR)
                </span>
              </div>

              <div className="space-y-2.5">
                {primaryAlert.immediateProtectiveMeasures.map((measure, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {measure}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50 text-xs text-emerald-300">
                <strong>Recommended Treatment:</strong> {primaryAlert.recommendedSprayOrDrainage}
              </div>
            </div>

            {/* Action Bar: Voice Readout + WhatsApp Emergency Broadcast */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleToggleVoice}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-slate-950 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Spoken Warning</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>Listen Spoken Audio Warning ({selectedLanguage})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-lg shadow-emerald-950/40 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Broadcast Emergency Alert on WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* All Alerts View */}
        {activeTab === 'all' && (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {Object.values(DISTRICT_CLIMATE_ALERTS).map((alt) => {
              const prof = STATE_DISTRICT_PROFILES.find((p) => p.id === alt.districtId);
              return (
                <div
                  key={alt.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-slate-900 border border-slate-800">
                        {getEventIcon(alt.eventType)}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {prof?.district || alt.districtId}, {prof?.state}
                      </span>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                          alt.severity === 'Critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {alt.severity}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {alt.temperatureOrRainStat}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200">
                    {alt.headline}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Onset: {alt.onsetForecast} • Crops: {alt.vulnerableCrops.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
