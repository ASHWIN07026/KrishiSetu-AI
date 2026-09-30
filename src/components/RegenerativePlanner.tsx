import React, { useState } from 'react';
import { RegenerativePlanResult, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/mockAgriData';
import { playFarmerAudio, stopSpeech } from '../utils/speech';
import {
  Sprout,
  RotateCw,
  Coins,
  Droplet,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle,
  TrendingDown,
  RefreshCw,
  Leaf,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface RegenerativePlannerProps {
  selectedLanguage: SupportedLanguage;
  currentState: string;
  currentDistrict: string;
}

export const RegenerativePlanner: React.FC<RegenerativePlannerProps> = ({
  selectedLanguage,
  currentState,
  currentDistrict,
}) => {
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.English;

  const [landAcreage, setLandAcreage] = useState<number>(3);
  const [currentCrop, setCurrentCrop] = useState<string>('Cotton');
  const [irrigationSource, setIrrigationSource] = useState<string>('Borewell & Monsoon dependent');
  const [soilType, setSoilType] = useState<string>('Black Cotton Soil (Vertisol)');

  const [loading, setLoading] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<RegenerativePlanResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    stopSpeech();
    setIsPlayingAudio(false);

    try {
      const res = await fetch('/api/regenerative-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: currentState,
          district: currentDistrict,
          currentCrop,
          landAcreage,
          irrigationSource,
          soilType,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to generate regenerative plan');
      }

      setPlanResult(data.data);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      alert('Failed to generate regenerative blueprint: ' + (err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      if (!planResult) return;
      playFarmerAudio(
        planResult.summaryInLanguage,
        selectedLanguage,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Leaf className="w-4 h-4" />
          <span>NITI Aayog & ICAR Natural Farming Framework</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Regenerative Agriculture & Climate-Resilience Blueprint
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Transition from input-heavy chemical agriculture to biological soil regeneration. Harness legume companion cropping, biochar carbon sequestration, and 40%+ water conservation while earning voluntary soil carbon credits.
        </p>
      </div>

      {/* Farm Parameters Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-400" />
          Farmer Plot Parameters ({currentState} • {currentDistrict})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Farm Acreage (Acres)
            </label>
            <input
              type="number"
              min="0.5"
              max="100"
              step="0.5"
              value={landAcreage}
              onChange={(e) => setLandAcreage(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Current Primary Crop
            </label>
            <select
              value={currentCrop}
              onChange={(e) => setCurrentCrop(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="Cotton">Cotton (कपास / कापूस)</option>
              <option value="Wheat">Wheat (गेंहू / ਕਣਕ)</option>
              <option value="Paddy / Rice">Paddy / Rice (धान / ধান)</option>
              <option value="Sugarcane">Sugarcane (गन्ना / ಕಬ್ಬು)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Chilli">Chilli (मिर्च / మిర్చి)</option>
              <option value="Maize">Maize (मक्का / ಜೋಳ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Irrigation Infrastructure
            </label>
            <select
              value={irrigationSource}
              onChange={(e) => setIrrigationSource(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="Borewell & Monsoon dependent">Borewell & Monsoon dependent</option>
              <option value="Canal Command Area with Flood Irrigation">Canal Command Area (Flood)</option>
              <option value="Drip / Micro-fertigation installed">Drip / Micro-fertigation</option>
              <option value="100% Rainfed (Dryland)">100% Rainfed (Dryland)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="Black Cotton Soil (Vertisol)">Black Cotton Soil (Vertisol)</option>
              <option value="Indo-Gangetic Alluvial Soil">Indo-Gangetic Alluvial Soil</option>
              <option value="Red Sandy Loam (Alfisol)">Red Sandy Loam (Alfisol)</option>
              <option value="Laterite / Acidic Soil">Laterite / Acidic Soil</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs md:text-sm shadow-lg shadow-emerald-900/40 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Designing Regenerative Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Natural Farming Transition Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Plan Results Display */}
      {planResult ? (
        <div className="space-y-6">
          {/* Top Summary Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex flex-col items-center justify-center p-2 shadow-inner">
                <span className="text-2xl font-black text-emerald-400">
                  {planResult.regenerativeHealthScore}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  / 100 Score
                </span>
              </div>
              <div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  {planResult.transitionTier}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Regenerative Soil Regeneration Pathway
                </h3>
                <p className="text-xs text-slate-400">
                  Tailored for {landAcreage} acres of {currentCrop} in {currentDistrict}, {currentState}
                </p>
              </div>
            </div>

            {/* Audio Readout */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Speech</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>{t.listenAudio}</span>
                </>
              )}
            </button>
          </div>

          {/* Spoken Overview Quote */}
          {planResult.summaryInLanguage && (
            <div className="bg-emerald-950/20 border-l-4 border-emerald-500 p-4 rounded-r-xl">
              <p className="text-xs md:text-sm text-slate-200 italic leading-relaxed">
                "{planResult.summaryInLanguage}"
              </p>
            </div>
          )}

          {/* 3-Season Crop Rotation Sequence */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <RotateCw className="w-4 h-4" />
              Tri-Seasonal Climate-Resilient Crop Rotation Architecture
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planResult.cropRotationCycle.map((cycle, idx) => (
                <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {cycle.season}
                    </span>
                    <h5 className="text-base font-bold text-white mt-2">
                      {cycle.primaryCrop}
                    </h5>
                    <div className="mt-2 text-xs">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Companion / Intercrop:</span>
                      <span className="text-amber-300 font-semibold">{cycle.intercropCompanion}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-300/90">
                    <strong>Ecological Value:</strong> {cycle.ecologicalBenefit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Restoration Strategies & Water Conservation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Soil Restoration */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Biological Soil Rebuilding Protocol
              </h4>
              <div className="space-y-3">
                {planResult.soilRestorationStrategy.map((strat, idx) => (
                  <div key={idx} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {strat.technique}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1">{strat.impact}</p>
                    <span className="text-[10px] text-amber-300 block mt-1 font-medium">
                      Cost: {strat.costEfficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Water & Carbon Economics */}
            <div className="space-y-6">
              {/* Water Conservation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Droplet className="w-4 h-4" />
                  Water Conservation Roadmap
                </h4>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white">
                      {planResult.waterConservationRoadmap.technique}
                    </span>
                    <span className="text-xs font-black text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      -{planResult.waterConservationRoadmap.projectedWaterSavingsPercent}% Water Needed
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Groundwater Recharge: <strong className="text-slate-200">{planResult.waterConservationRoadmap.groundwaterRechargeMeasure}</strong>
                  </p>
                </div>
              </div>

              {/* Economic & Carbon Credits Dividend */}
              <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-800/40 rounded-2xl p-6 shadow-xl">
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Coins className="w-4 h-4" />
                  Farmer Financial & Carbon Dividends
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Chemical Input Savings</span>
                    <span className="text-base font-black text-emerald-400">
                      -{planResult.economicsAndCarbonCredits.inputCostReductionPercent}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Saves on DAP/Urea</span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Soil Carbon Sequestered</span>
                    <span className="text-base font-black text-amber-300">
                      {planResult.economicsAndCarbonCredits.carbonCreditsEarnedTonsPerAcre} t/acre
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Verified CO2e</span>
                  </div>
                </div>

                <div className="mt-3 bg-slate-950/90 p-2.5 rounded-lg border border-amber-900/40 text-[11px] text-slate-300">
                  <strong>Estimated Annual Carbon Revenue:</strong> {planResult.economicsAndCarbonCredits.estimatedAnnualCarbonRevenue}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Build Your Regenerative Transition Roadmap</h3>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mb-6">
            Configure your farm's acreage and soil type above, then generate a scientific multi-season crop rotation plan designed to restore soil microbial carbon, lower water consumption, and reduce input debt.
          </p>
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm shadow-lg shadow-emerald-900/40 transition cursor-pointer"
          >
            Generate Roadmap for {landAcreage} Acres ({currentCrop})
          </button>
        </div>
      )}
    </div>
  );
};
