import React, { useState } from 'react';
import { SoilHealthData, SupportedLanguage } from '../types';
import { Layers, ShoppingBag, Coins, ArrowRight, CheckCircle2, Sparkles, Copy, Check } from 'lucide-react';

interface FertilizerCalculatorProps {
  crop: string;
  soilData: SoilHealthData;
  selectedLanguage: SupportedLanguage;
  state: string;
  district: string;
}

export const FertilizerCalculator: React.FC<FertilizerCalculatorProps> = ({
  crop,
  soilData,
  selectedLanguage,
  state,
  district,
}) => {
  const [acreage, setAcreage] = useState<number>(2.5);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute scientific dosage based on crop and soil deficiency
  // Wheat typical rec: 120-60-40 kg N-P-K / ha = ~50-25-16 kg / acre
  // Adjust for existing soil NPK
  const nDeficitRatio = Math.max(0.6, (280 - soilData.n) / 140);
  const pDeficitRatio = Math.max(0.5, (30 - soilData.p) / 15);
  const kDeficitRatio = Math.max(0.4, (280 - soilData.k) / 140);

  const ureaBags = Math.max(1, Math.round(acreage * 1.8 * nDeficitRatio * 10) / 10);
  const dapBags = Math.max(0.5, Math.round(acreage * 0.9 * pDeficitRatio * 10) / 10);
  const mopBags = Math.max(0.5, Math.round(acreage * 0.6 * kDeficitRatio * 10) / 10);
  const zincKg = Math.round(acreage * (soilData.zinc < 0.6 ? 10 : 5));
  const sulfurKg = Math.round(acreage * (soilData.sulfur < 10 ? 8 : 4));

  const organicCompostTons = Math.round(acreage * 1.5 * 10) / 10;
  const jeevamrutLitres = Math.round(acreage * 200);

  // Financial Estimates
  // Subsidized market price: Urea bag ~₹267, DAP bag ~₹1350, MOP ~₹1700, Zinc ~₹85/kg, Sulfur ~₹60/kg
  const chemicalCost = Math.round(
    ureaBags * 267 + dapBags * 1350 + mopBags * 1700 + zincKg * 85 + sulfurKg * 60
  );
  // Farm-prepared bio inputs: Desi cow dung/urine, jaggery, gram flour, farm compost
  const regenerativeCost = Math.round(organicCompostTons * 800 + jeevamrutLitres * 1.2);
  const netSavings = Math.max(1200, chemicalCost - regenerativeCost);

  const handleCopySummary = () => {
    const text = `🌾 *KrishiSetu Fertilizer & Input Guidance* (${district}, ${state})
Crop: ${crop} | Area: ${acreage} Acres
📦 *Recommended Bag Counts (Soil Card Tuned):*
• Neem-Coated Urea (45kg): ${ureaBags} Bags
• DAP (50kg): ${dapBags} Bags
• MOP Potash (50kg): ${mopBags} Bags
• Zinc Sulfate 21%: ${zincKg} kg
• Sulfur (90% WDG): ${sulfurKg} kg

🌱 *Natural / Bio Alternative:*
• Farm Compost: ${organicCompostTons} Tonnes
• Jeevamrut: ${jeevamrutLitres} Litres
💰 Potential Net Savings: ₹${netSavings.toLocaleString('en-IN')}

_Generated via KrishiSetu DPG Open Agromet Protocol_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>ICAR Precision Input & Bag Optimizer</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Custom Fertilizer & Seed Bag Calculator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Converts Soil Health Card chemical deficits into exact retail bag quantities for {crop}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <label className="text-xs text-slate-400 font-semibold">Farm Area:</label>
            <input
              type="number"
              min="0.5"
              max="50"
              step="0.5"
              value={acreage}
              onChange={(e) => setAcreage(Math.max(0.5, Number(e.target.value)))}
              className="w-16 bg-slate-800 text-white font-black text-xs text-center rounded py-1 px-1 border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs font-bold text-emerald-400">Acres</span>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition border border-slate-700 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Share WhatsApp Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bag Calculations Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Urea */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Neem-Coated Urea</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{ureaBags}</p>
            <span className="text-[11px] text-slate-300 font-semibold">Bags (45 kg)</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 border-t border-slate-800 pt-1">
            Top-dress in 2 splits
          </p>
        </div>

        {/* DAP */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">DAP (Di-Ammonium)</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{dapBags}</p>
            <span className="text-[11px] text-slate-300 font-semibold">Bags (50 kg)</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 border-t border-slate-800 pt-1">
            100% Basal at sowing
          </p>
        </div>

        {/* MOP Potash */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">MOP (Muriate Potash)</span>
            <p className="text-2xl font-black text-cyan-400 mt-1">{mopBags}</p>
            <span className="text-[11px] text-slate-300 font-semibold">Bags (50 kg)</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 border-t border-slate-800 pt-1">
            Improves grain test weight
          </p>
        </div>

        {/* Zinc Sulfate */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Zinc Sulfate 21%</span>
            <p className="text-2xl font-black text-violet-400 mt-1">{zincKg}</p>
            <span className="text-[11px] text-slate-300 font-semibold">kg Total</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 border-t border-slate-800 pt-1">
            Corrects chlorosis
          </p>
        </div>

        {/* Sulfur WDG */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Sulfur 90% WDG</span>
            <p className="text-2xl font-black text-yellow-400 mt-1">{sulfurKg}</p>
            <span className="text-[11px] text-slate-300 font-semibold">kg Total</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-2 border-t border-slate-800 pt-1">
            Boosts protein & oil synthesis
          </p>
        </div>
      </div>

      {/* 3-Stage Application Timing Schedule */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
          Standard ICAR Application Schedule (Do Not Dump All at Once)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Stage 1: Basal Application (At Sowing)
            </span>
            <p className="text-slate-200 font-bold mt-1">100% DAP + 100% MOP + 50% Zinc</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Band placement 5 cm below seed level during field preparation.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Stage 2: 1st Top Dressing (Day 21–25)
            </span>
            <p className="text-slate-200 font-bold mt-1">50% Urea ({Math.round(ureaBags * 0.5 * 10) / 10} Bags)</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Apply at Crown Root Initiation (CRI) stage immediately after light irrigation.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
              Stage 3: 2nd Top Dressing (Day 45–50)
            </span>
            <p className="text-slate-200 font-bold mt-1">50% Urea + Remaining Zinc/Sulfur</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Apply prior to boot leaf / flowering stage. Avoid during midday heat.
            </p>
          </div>
        </div>
      </div>

      {/* Economics & Bio-Alternative Comparison */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-slate-950 to-amber-950/30 p-4 rounded-xl border border-emerald-900/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Natural Bio-Farming Alternative Available
          </span>
          <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
            Substituting synthetic chemical bags with <strong>{organicCompostTons} Tonnes of vermicompost</strong> and <strong>{jeevamrutLitres} L of fermented Jeevamrut</strong> yields comparable vigor while reducing retail input spend.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-emerald-800 px-4 py-2.5 rounded-xl text-center shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Farmer Net Cost Savings</span>
          <span className="text-lg font-black text-emerald-400">
            ₹{netSavings.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">for {acreage} acres</span>
        </div>
      </div>
    </div>
  );
};
