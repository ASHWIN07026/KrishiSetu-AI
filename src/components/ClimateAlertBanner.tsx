import React, { useState } from 'react';
import { ClimateEventAlert, SupportedLanguage } from '../types';
import { playFarmerAudio, stopSpeech } from '../utils/speech';
import {
  AlertTriangle,
  Flame,
  CloudRain,
  Snowflake,
  Wind,
  Waves,
  Volume2,
  VolumeX,
  ArrowRight,
  X,
} from 'lucide-react';

interface ClimateAlertBannerProps {
  alert: ClimateEventAlert;
  selectedLanguage: SupportedLanguage;
  onOpenDetails: () => void;
}

export const ClimateAlertBanner: React.FC<ClimateAlertBannerProps> = ({
  alert,
  selectedLanguage,
  onOpenDetails,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const getEventIcon = (type: ClimateEventAlert['eventType']) => {
    switch (type) {
      case 'Heatwave':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'Unseasonal Rain':
        return <CloudRain className="w-3.5 h-3.5 text-sky-400" />;
      case 'Cold Wave / Frost':
        return <Snowflake className="w-3.5 h-3.5 text-cyan-300" />;
      case 'High Wind Lodging':
        return <Wind className="w-3.5 h-3.5 text-teal-300" />;
      case 'Flash Flood / Cyclone':
        return <Waves className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getSeverityBg = (severity: ClimateEventAlert['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/70 border-rose-800/40 text-rose-100';
      case 'Warning':
        return 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-amber-800/40 text-amber-100';
      default:
        return 'bg-slate-900/90 border-slate-800 text-slate-200';
    }
  };

  const localizedHeadline =
    alert.vernacularHeadline[selectedLanguage] || alert.headline;

  const handleToggleVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      playFarmerAudio(
        alert.spokenAudioWarning,
        selectedLanguage,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  return (
    <div
      onClick={onOpenDetails}
      className={`border-b px-4 py-2 transition cursor-pointer flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm ${getSeverityBg(
        alert.severity
      )}`}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
        <div className="p-1 rounded-md bg-black/40 border border-white/10 shrink-0">
          {getEventIcon(alert.eventType)}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-white">
            {localizedHeadline}
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            ({alert.temperatureOrRainStat})
          </span>
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            · Expected onset: {alert.onsetForecast}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Voice Audio Readout */}
        <button
          onClick={handleToggleVoice}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition border border-white/10 bg-black/30 hover:bg-black/50 text-slate-200 cursor-pointer"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Listen</span>
            </>
          )}
        </button>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-900 px-2.5 py-1 rounded text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          <span>Advisory</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition cursor-pointer ml-1"
          title="Dismiss alert"
          aria-label="Dismiss climate alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

