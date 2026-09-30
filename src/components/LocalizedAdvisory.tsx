import React, { useState, useEffect } from 'react';
import {
  AgroAdvisoryResult,
  SatelliteTelemetry,
  SoilHealthData,
  SupportedLanguage,
  WeatherData,
} from '../types';
import { STATE_DISTRICT_PROFILES, UI_TRANSLATIONS } from '../data/mockAgriData';
import { playFarmerAudio, stopSpeech } from '../utils/speech';
import { SatellitePlotVisualizer } from './SatellitePlotVisualizer';
import { FertilizerCalculator } from './FertilizerCalculator';
import { CommunityDiseaseRadar } from './CommunityDiseaseRadar';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  Satellite,
  Droplets,
  CloudRain,
  TrendingUp,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Wind,
  Thermometer,
  Layers,
  ArrowRight,
  Share2,
  Bookmark,
  Check,
  Download,
} from 'lucide-react';
import { generateAdvisoryPdf } from '../utils/generateAdvisoryPdf';

interface LocalizedAdvisoryProps {
  selectedProfileId: string;
  selectedLanguage: SupportedLanguage;
}

export const LocalizedAdvisory: React.FC<LocalizedAdvisoryProps> = ({
  selectedProfileId,
  selectedLanguage,
}) => {
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.English;
  const profile =
    STATE_DISTRICT_PROFILES.find((p) => p.id === selectedProfileId) ||
    STATE_DISTRICT_PROFILES[0];

  // Editable telemetry states allowing live experimentation
  const [soilData, setSoilData] = useState<SoilHealthData>(profile.soilProfile);
  const [satelliteData, setSatelliteData] = useState<SatelliteTelemetry>(profile.satelliteTelemetry);
  const [weatherData, setWeatherData] = useState<WeatherData>(profile.weatherForecast);

  const [loading, setLoading] = useState<boolean>(false);
  const [advisoryResult, setAdvisoryResult] = useState<AgroAdvisoryResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showSliders, setShowSliders] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'advisory' | 'heatmap' | 'fertilizer' | 'radar'>('advisory');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  // Sync state when profile changes
  useEffect(() => {
    setSoilData(profile.soilProfile);
    setSatelliteData(profile.satelliteTelemetry);
    setWeatherData(profile.weatherForecast);
    setAdvisoryResult(null);
    setIsSaved(false);
    stopSpeech();
    setIsPlayingAudio(false);
  }, [profile.id]);

  const handleDownloadPdf = () => {
    if (!advisoryResult) return;
    setIsGeneratingPdf(true);
    try {
      generateAdvisoryPdf({
        state: profile.state,
        district: profile.district,
        agroClimaticZone: profile.agroClimaticZone,
        crop: profile.majorCrops[0],
        season: profile.currentSeason,
        soilData,
        satelliteData,
        weatherData,
        advisoryResult,
        selectedLanguage,
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSaveToFirestore = async () => {
    if (!advisoryResult) return;
    let user = auth.currentUser;
    if (!user) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        user = res.user;
      } catch (err: any) {
        console.error('Google Sign-in failed:', err);
        return;
      }
    }
    if (!user) return;

    setIsSaving(true);
    const advisoryId = `adv_${Date.now()}`;
    const path = `users/${user.uid}/savedAdvisories/${advisoryId}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'savedAdvisories', advisoryId), {
        id: advisoryId,
        userId: user.uid,
        headline: advisoryResult.headline.slice(0, 300),
        state: profile.state,
        district: profile.district,
        crop: profile.majorCrops[0],
        riskLevel: advisoryResult.riskLevel,
        irrigationAction: (advisoryResult.irrigationAdvisory?.action || '').slice(0, 500),
        soilNutrition: (advisoryResult.soilNutrientManagement?.ureaDapCorrection || '').slice(0, 500),
        createdAt: new Date().toISOString(),
      });
      setIsSaved(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  // Generate Advisory via Gemini
  const handleGenerateAdvisory = async () => {
    setLoading(true);
    stopSpeech();
    setIsPlayingAudio(false);

    try {
      const res = await fetch('/api/agro-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: profile.state,
          district: profile.district,
          crop: profile.majorCrops[0],
          season: profile.currentSeason,
          soilData,
          satelliteData,
          weatherData,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate advisory.');
      }
      setAdvisoryResult(data.data);
    } catch (err: any) {
      console.error('Agro-advisory generation error:', err);
      alert('Could not generate agro-advisory: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      if (!advisoryResult) return;
      const textToSpeak = advisoryResult.spokenAdvisoryVoice || advisoryResult.headline;
      playFarmerAudio(
        textToSpeak,
        selectedLanguage,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  // Helper for NDVI color
  const getNdviColor = (val: number) => {
    if (val < 0.3) return 'text-red-400 bg-red-950/40 border-red-800';
    if (val < 0.55) return 'text-amber-400 bg-amber-950/40 border-amber-800';
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Header Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <span>{profile.state} Region</span>
              <span aria-hidden="true">·</span>
              <span>{profile.agroClimaticZone}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 font-medium">{profile.currentSeason} Season</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {profile.district} Agro-Advisory & Field Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Synthesizing ICAR Soil Health Card parameters, Sentinel-2 spectral indices, and IMD Agromet forecasts into real-time precision farming advisories.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowSliders(!showSliders)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/80 transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>{showSliders ? 'Hide Simulator' : 'Tune Telemetry'}</span>
            </button>

            <button
              onClick={handleGenerateAdvisory}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.generateAdvisory}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Simulation Sliders Drawer */}
        {showSliders && (
          <div className="mt-5 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 flex justify-between">
                <span>Soil Moisture Index</span>
                <span className="font-mono text-emerald-400">{soilData.moisture}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="80"
                value={soilData.moisture}
                onChange={(e) => setSoilData({ ...soilData, moisture: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">Simulate field moisture deficit vs surplus</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 flex justify-between">
                <span>Rainfall Probability (IMD)</span>
                <span className="font-mono text-sky-400">{weatherData.rainProb}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={weatherData.rainProb}
                onChange={(e) => setWeatherData({ ...weatherData, rainProb: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">Simulate dry spells vs unseasonal downpour</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 flex justify-between">
                <span>Satellite NDVI (Vegetation Vigor)</span>
                <span className="font-mono text-teal-400">{satelliteData.ndvi.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={satelliteData.ndvi}
                onChange={(e) => setSatelliteData({ ...satelliteData, ndvi: Number(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">0.2 = Stressed, 0.8 = Dense Canopy</span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Feature Navigation Segmented Bar */}
      <div className="flex flex-wrap items-center gap-1 mb-6 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('advisory')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeSubTab === 'advisory'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agro-Advisory & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveSubTab('heatmap')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeSubTab === 'heatmap'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Satellite className="w-3.5 h-3.5 text-teal-400" />
          <span>Satellite Plot Heatmap</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fertilizer')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeSubTab === 'fertilizer'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Fertilizer Calculator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('radar')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeSubTab === 'radar'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Community Disease Radar</span>
        </button>
      </div>

      {activeSubTab === 'heatmap' && (
        <SatellitePlotVisualizer
          telemetry={satelliteData}
          district={profile.district}
          state={profile.state}
          selectedLanguage={selectedLanguage}
        />
      )}

      {activeSubTab === 'fertilizer' && (
        <FertilizerCalculator
          crop={profile.majorCrops[0]}
          soilData={soilData}
          selectedLanguage={selectedLanguage}
          state={profile.state}
          district={profile.district}
        />
      )}

      {activeSubTab === 'radar' && (
        <CommunityDiseaseRadar
          district={profile.district}
          state={profile.state}
          selectedLanguage={selectedLanguage}
        />
      )}

      {activeSubTab === 'advisory' && (
        <>
          {/* 3 Telemetry Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pillar 1: Soil Health Card Analytics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                Soil Health Card
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                pH {soilData.ph} ({soilData.ph > 7.5 ? 'Alkaline' : soilData.ph < 6.5 ? 'Acidic' : 'Neutral'})
              </span>
            </div>

            <div className="space-y-3">
              {/* NPK */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 block">Nitrogen (N)</span>
                  <span className="text-sm font-bold text-white">{soilData.n}</span>
                  <span className="text-[9px] text-amber-400 block">kg/ha (Low)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Phosphorus (P)</span>
                  <span className="text-sm font-bold text-white">{soilData.p}</span>
                  <span className="text-[9px] text-emerald-400 block">kg/ha (Med)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Potassium (K)</span>
                  <span className="text-sm font-bold text-white">{soilData.k}</span>
                  <span className="text-[9px] text-emerald-400 block">kg/ha (Good)</span>
                </div>
              </div>

              {/* Organic Carbon & Moisture */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Organic Carbon</span>
                  <span className="font-bold text-amber-300">{soilData.organicCarbon}%</span>
                  <span className="text-[9px] text-slate-400 block">Target: &gt;0.75%</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Soil Moisture</span>
                  <span className="font-bold text-cyan-300">{soilData.moisture}%</span>
                  <span className="text-[9px] text-slate-400 block">Field capacity</span>
                </div>
              </div>

              {/* Micronutrients */}
              <div className="text-[11px] text-slate-400 flex justify-between bg-slate-800/40 px-2.5 py-1.5 rounded">
                <span>Zinc (Zn): <strong className="text-slate-200">{soilData.zinc} ppm</strong></span>
                <span>Sulfur (S): <strong className="text-slate-200">{soilData.sulfur} ppm</strong></span>
                <span>EC: <strong className="text-slate-200">{soilData.ec} dS/m</strong></span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Source: National Soil Health Card Portal (DAC&FW)
          </div>
        </div>

        {/* Pillar 2: ISRO Bhuvan & Sentinel Satellite Telemetry */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Satellite className="w-4 h-4" />
                Satellite Telemetry
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-teal-300">
                Sentinel-2 / Bhuvan
              </span>
            </div>

            <div className="space-y-3">
              {/* NDVI Card */}
              <div className={`p-3 rounded-lg border ${getNdviColor(satelliteData.ndvi)}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold">NDVI Vegetation Vigor</span>
                  <span className="text-lg font-black">{satelliteData.ndvi.toFixed(2)}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-current h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, satelliteData.ndvi * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] mt-1 text-slate-400">
                  <span>0.0 Fallow</span>
                  <span>0.5 Moderate</span>
                  <span>1.0 Dense Green</span>
                </div>
              </div>

              {/* Water & Temp Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Moisture Index (NDWI)</span>
                  <span className="font-bold text-cyan-300">{satelliteData.ndwi.toFixed(2)}</span>
                  <span className="text-[9px] text-slate-400 block">{satelliteData.ndwi < 0 ? 'Water Stress' : 'Hydrated'}</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Surface Temp (LST)</span>
                  <span className="font-bold text-amber-300">{satelliteData.lst}°C</span>
                  <span className="text-[9px] text-slate-400 block">Thermal Sensor</span>
                </div>
              </div>

              <div className="bg-slate-800/40 px-2.5 py-1.5 rounded flex justify-between text-[11px] text-slate-400">
                <span>Chlorophyll (NDRE): <strong className="text-slate-200">{satelliteData.ndre}</strong></span>
                <span>VCI Index: <strong className="text-slate-200">{satelliteData.vegetationConditionIndex}%</strong></span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Source: ISRO Bhuvan & Copernicus Sentinel-2
          </div>
        </div>

        {/* Pillar 3: IMD Agromet 5-Day Weather Forecast */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <CloudRain className="w-4 h-4" />
                IMD Agromet Forecast
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-300">
                5-Day Horizon
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <p className="text-slate-300 font-medium mb-2">{weatherData.condition}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Temp Range</span>
                      <span className="font-bold text-white">{weatherData.tempMin}°C - {weatherData.tempMax}°C</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Rain Chance</span>
                      <span className="font-bold text-cyan-300">{weatherData.rainProb}% ({weatherData.expectedRain}mm)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Relative Humidity</span>
                  <span className="font-bold text-slate-200">{weatherData.humidity}%</span>
                  <span className="text-[9px] text-slate-400 block">{weatherData.humidity > 70 ? 'Fungal Risk' : 'Normal'}</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Wind Velocity</span>
                  <span className="font-bold text-slate-200">{weatherData.windSpeed} km/h</span>
                  <span className="text-[9px] text-slate-400 block">Safe for foliar spray</span>
                </div>
              </div>

              {/* Mandi Intelligence preview */}
              <div className="bg-emerald-950/30 border border-emerald-900/50 p-2 rounded-lg text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Mandi APMC: {profile.mandiPrice.crop}</span>
                  <span className="font-bold text-emerald-300">₹{profile.mandiPrice.currentModalPrice} / qtl</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Govt MSP</span>
                  <span className="font-semibold text-slate-300">₹{profile.mandiPrice.msp || 'Market Rate'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Source: India Meteorological Department (IMD) & e-NAM
          </div>
        </div>
      </div>

      {/* AI Agro-Advisory Results Output */}
      {advisoryResult ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
          {/* Header & Risk Level */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    advisoryResult.riskLevel === 'Critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                      : advisoryResult.riskLevel === 'Elevated'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  }`}
                >
                  {advisoryResult.riskLevel} Agro-Climatic Alert
                </span>
                <span className="text-xs text-slate-400">
                  Target Crop: <strong className="text-white">{profile.majorCrops[0]}</strong>
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white leading-snug">
                {advisoryResult.headline}
              </h3>
            </div>

            {/* Actions: Download PDF, Save to Cloud & Audio Readout */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition shadow-lg cursor-pointer border bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-emerald-500/50"
                title="Download printable PDF summary of this advisory & soil health report"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>

              <button
                onClick={handleSaveToFirestore}
                disabled={isSaving || isSaved}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition shadow-lg cursor-pointer border ${
                  isSaved
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Save this advisory to your Firebase cloud account"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Saved to Cloud</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>{isSaving ? 'Saving...' : 'Save to Cloud'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleToggleAudio}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition shadow-lg cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-950 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Advisory Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{t.listenAudio}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Voice Summary Quote */}
          {advisoryResult.spokenAdvisoryVoice && (
            <div className="bg-emerald-950/30 border-l-4 border-emerald-500 p-4 rounded-r-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1 uppercase tracking-wider">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Audio Bulletin Transcript ({selectedLanguage})</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 italic leading-relaxed">
                "{advisoryResult.spokenAdvisoryVoice}"
              </p>
            </div>
          )}

          {/* Crop Growth Stage Assessment */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Crop Stage & Satellite Canopy Assessment
            </h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {advisoryResult.cropGrowthStageAssessment}
            </p>
          </div>

          {/* Action Cards: Irrigation + Nutrition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Irrigation Advisory */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-slate-900 border border-cyan-900/40 rounded-xl p-5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Droplets className="w-4 h-4" />
                <span>Irrigation Action Plan</span>
              </div>
              <p className="text-sm font-bold text-white mb-2">
                {advisoryResult.irrigationAdvisory.action}
              </p>
              <p className="text-xs text-slate-300 mb-3">
                {advisoryResult.irrigationAdvisory.rationale}
              </p>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-cyan-900/30 text-[11px] text-cyan-200">
                <strong>Water-Saving Guidance:</strong> {advisoryResult.irrigationAdvisory.waterSavingTips}
              </div>
            </div>

            {/* Soil Nutrition Amendments */}
            <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-900/40 rounded-xl p-5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4" />
                <span>Soil & Nutrition Management</span>
              </div>
              <p className="text-xs text-slate-200 mb-2 font-medium">
                {advisoryResult.soilNutrientManagement.ureaDapCorrection}
              </p>
              <div className="mb-2">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Micronutrients Required:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {advisoryResult.soilNutrientManagement.micronutrientsNeeded.map((nutr, idx) => (
                    <span key={idx} className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/40">
                      {nutr}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                <strong>Organic Carbon Boost:</strong> {advisoryResult.soilNutrientManagement.organicAmendments}
              </p>
            </div>
          </div>

          {/* Climate Resilience & Mandi Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Climate Resilience Action */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Climate Shock Shield</span>
              </div>
              <p className="text-xs font-bold text-rose-300 mb-1">
                Threat: {advisoryResult.climateResilienceAction.threat}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {advisoryResult.climateResilienceAction.protectiveMeasure}
              </p>
            </div>

            {/* Mandi & Collective Selling Intelligence */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4" />
                <span>Mandi & Collective FPO Strategy</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Govt MSP: <strong className="text-white">{advisoryResult.mandiMarketIntel.currentMsp}</strong></span>
                <span className="text-slate-400">Modal Price: <strong className="text-emerald-300">{advisoryResult.mandiMarketIntel.estimatedLocalMandiPrice}</strong></span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {advisoryResult.mandiMarketIntel.cooperativeSellingAdvice}
              </p>
            </div>
          </div>

          {/* Regional Inter-State Cooperation Note */}
          {advisoryResult.interStateCooperationNote && (
            <div className="bg-gradient-to-r from-amber-950/20 via-slate-900 to-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex items-start gap-3">
              <Share2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Inter-State Agricultural Cooperation Note (Krishi-DPG)
                </h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {advisoryResult.interStateCooperationNote}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Generate Localized Agro-Advisory</h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mb-6">
            Click the button below to feed the Soil Health Card numbers, Sentinel-2 vegetation index, and IMD meteorology for {profile.district} into Google Gemini for precision irrigation, fertilizer balancing, and climate advice.
          </p>
          <button
            onClick={handleGenerateAdvisory}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm shadow-lg shadow-emerald-900/40 transition cursor-pointer"
          >
            Synthesize Real-Time Advisory for {profile.majorCrops[0]}
          </button>
        </div>
      )}
      </>
      )}
    </div>
  );
};
