import React, { useState } from 'react';
import { SatelliteTelemetry, SupportedLanguage } from '../types';
import { Satellite, Eye, Droplets, Thermometer, Layers, AlertCircle, Sparkles } from 'lucide-react';

interface SatellitePlotVisualizerProps {
  telemetry: SatelliteTelemetry;
  district: string;
  state: string;
  selectedLanguage: SupportedLanguage;
}

export const SatellitePlotVisualizer: React.FC<SatellitePlotVisualizerProps> = ({
  telemetry,
  district,
  state,
}) => {
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'ndwi' | 'lst'>('ndvi');
  const [selectedZone, setSelectedZone] = useState<number | null>(1);

  const zones = [
    {
      id: 1,
      name: 'Plot A: Northern Canal Boundary',
      acreage: '1.2 Acres',
      crop: 'Wheat (Canopy Active)',
      ndviVal: (telemetry.ndvi + 0.05).toFixed(2),
      moistureVal: '44% (Adequate)',
      tempVal: `${(telemetry.lst - 1.2).toFixed(1)}°C`,
      status: 'Healthy Vegetative Growth',
      recommendation: 'Canopy vigor is optimal. Hold flood irrigation; next light irrigation scheduled after 5 days.',
    },
    {
      id: 2,
      name: 'Plot B: Central Silt Basin',
      acreage: '0.8 Acres',
      crop: 'Wheat / Intercrop Border',
      ndviVal: telemetry.ndvi.toFixed(2),
      moistureVal: '36% (Normal)',
      tempVal: `${telemetry.lst.toFixed(1)}°C`,
      status: 'Normal Vigor',
      recommendation: 'Uniform germination. Light foliar spray of 19-19-19 NPK (1%) recommended this week.',
    },
    {
      id: 3,
      name: 'Plot C: Southern Elevated Ridge',
      acreage: '0.5 Acres',
      crop: 'Marginal Slope',
      ndviVal: (telemetry.ndvi - 0.14).toFixed(2),
      moistureVal: '22% (Water Deficit Stress)',
      tempVal: `${(telemetry.lst + 2.5).toFixed(1)}°C`,
      status: 'Moderate Moisture Stress',
      recommendation: 'Urgent: Run drip irrigation for 50 minutes. Organic mulching needed to arrest soil evaporation.',
    },
  ];

  const currentZone = zones.find((z) => z.id === selectedZone) || zones[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Layer Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Satellite className="w-4 h-4 text-teal-400" />
            <span>Copernicus Sentinel-2 & ISRO Bhuvan Radiometry</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Interactive Satellite Farm Plot Heatmap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            10-meter multispectral resolution telemetry for field parcel in {district}, {state}.
          </p>
        </div>

        {/* Layer Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveLayer('ndvi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeLayer === 'ndvi'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>NDVI (Vigor)</span>
          </button>

          <button
            onClick={() => setActiveLayer('ndwi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeLayer === 'ndwi'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>NDWI (Moisture)</span>
          </button>

          <button
            onClick={() => setActiveLayer('lst')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeLayer === 'lst'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal LST</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer: SVG Map on Left, Zone Micro-Advisory on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Interactive Farm Plot Map */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Click a plot parcel to inspect localized micro-advice</span>
            <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded text-teal-400">
              Pass: Sentinel-2B 10m
            </span>
          </div>

          <svg viewBox="0 0 600 360" className="w-full h-auto rounded-lg shadow-inner">
            {/* Background field boundary */}
            <rect width="600" height="360" fill="#090d16" />

            {/* Grid lines */}
            <line x1="0" y1="120" x2="600" y2="120" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="0" y1="240" x2="600" y2="240" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="200" y1="0" x2="200" y2="360" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            <line x1="400" y1="0" x2="400" y2="360" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />

            {/* Canal feature */}
            <path d="M 0 35 Q 300 55 600 20" stroke="#0284c7" strokeWidth="10" fill="none" opacity="0.75" />
            <text x="15" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold">Canal Inflow Feeder</text>

            {/* Plot A (Northern Parcel - Healthy) */}
            <polygon
              points="40,65 560,65 540,165 40,165"
              fill={activeLayer === 'ndvi' ? '#15803d' : activeLayer === 'ndwi' ? '#0369a1' : '#b45309'}
              opacity={selectedZone === 1 ? '0.95' : '0.65'}
              stroke={selectedZone === 1 ? '#4ade80' : '#334155'}
              strokeWidth={selectedZone === 1 ? '3' : '1.5'}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => setSelectedZone(1)}
            />
            <text x="60" y="115" fill="#ffffff" fontSize="12" fontWeight="bold">Plot A: North Parcel (1.2 Ac)</text>
            <text x="60" y="135" fill="#e2e8f0" fontSize="10">
              {activeLayer === 'ndvi' ? `NDVI: ${(telemetry.ndvi + 0.05).toFixed(2)} (High Vigor)` : activeLayer === 'ndwi' ? 'Moisture: 44% (Adequate)' : `LST: ${(telemetry.lst - 1.2).toFixed(1)}°C`}
            </text>

            {/* Plot B (Central Basin - Moderate) */}
            <polygon
              points="40,175 380,175 370,270 40,270"
              fill={activeLayer === 'ndvi' ? '#166534' : activeLayer === 'ndwi' ? '#0284c7' : '#d97706'}
              opacity={selectedZone === 2 ? '0.95' : '0.65'}
              stroke={selectedZone === 2 ? '#38bdf8' : '#334155'}
              strokeWidth={selectedZone === 2 ? '3' : '1.5'}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => setSelectedZone(2)}
            />
            <text x="60" y="215" fill="#ffffff" fontSize="12" fontWeight="bold">Plot B: Central Basin (0.8 Ac)</text>
            <text x="60" y="235" fill="#e2e8f0" fontSize="10">
              {activeLayer === 'ndvi' ? `NDVI: ${telemetry.ndvi.toFixed(2)} (Normal)` : activeLayer === 'ndwi' ? 'Moisture: 36% (Normal)' : `LST: ${telemetry.lst.toFixed(1)}°C`}
            </text>

            {/* Plot C (Southern Ridge - Water Deficit Stressed) */}
            <polygon
              points="390,175 560,175 550,330 380,330"
              fill={activeLayer === 'ndvi' ? '#854d0e' : activeLayer === 'ndwi' ? '#991b1b' : '#dc2626'}
              opacity={selectedZone === 3 ? '0.95' : '0.65'}
              stroke={selectedZone === 3 ? '#f87171' : '#334155'}
              strokeWidth={selectedZone === 3 ? '3' : '1.5'}
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => setSelectedZone(3)}
            />
            <text x="405" y="240" fill="#ffffff" fontSize="11" fontWeight="bold">Plot C: Ridge (0.5 Ac)</text>
            <text x="405" y="260" fill="#fecaca" fontSize="9" fontWeight="bold">
              {activeLayer === 'ndvi' ? 'Water Stress Alert' : activeLayer === 'ndwi' ? 'Dry Patch (-22%)' : `Heat Spike ${(telemetry.lst + 2.5).toFixed(1)}°C`}
            </text>
          </svg>

          {/* Color bar legend */}
          <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-600 inline-block" /> Stressed / Water Deficit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Moderate Vigor
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Optimal Hydration & Biomass
            </span>
          </div>
        </div>

        {/* Selected Zone Micro-Advisory Card */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                Micro-Zone Precision Intelligence
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {currentZone.name}
              </h4>
              <span className="text-xs text-slate-400">{currentZone.acreage} • {currentZone.crop}</span>
            </div>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded font-mono">
              Zone #{currentZone.id}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">NDVI Vigor</span>
              <span className="font-bold text-emerald-400">{currentZone.ndviVal}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Moisture</span>
              <span className="font-bold text-cyan-400">{currentZone.moistureVal.split(' ')[0]}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Temperature</span>
              <span className="font-bold text-amber-400">{currentZone.tempVal}</span>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Zone-Specific Action Suggestion
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {currentZone.recommendation}
            </p>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Status: <strong className="text-white">{currentZone.status}</strong></span>
            <span className="text-emerald-400 font-semibold">AgriStack Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
