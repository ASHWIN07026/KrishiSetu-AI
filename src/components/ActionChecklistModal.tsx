import React from 'react';
import { SupportedLanguage } from '../types';
import { CheckCircle2, Droplets, Leaf, ShieldAlert, Sparkles, X, Share2, Printer } from 'lucide-react';

interface ActionChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: string;
  district: string;
  selectedLanguage: SupportedLanguage;
}

export const ActionChecklistModal: React.FC<ActionChecklistModalProps> = ({
  isOpen,
  onClose,
  state,
  district,
  selectedLanguage,
}) => {
  if (!isOpen) return null;

  const currentTasks = [
    {
      category: 'Irrigation & Moisture',
      icon: Droplets,
      color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
      action: 'Hold furrow irrigation for 48 hours; light morning drip only.',
      reason: 'NDWI indicates 32% soil moisture with 15% rainfall probability in IMD 5-day horizon.',
      priority: 'High',
    },
    {
      category: 'Soil Nutrition Top-Dressing',
      icon: Leaf,
      color: 'text-amber-400 bg-amber-950/60 border-amber-800',
      action: 'Apply Zinc Sulfate (21%) @ 10 kg/acre + 2 bags Vermicompost.',
      reason: 'Soil Health Card reveals Zinc deficiency (0.55 ppm) and low organic carbon (<0.45%).',
      priority: 'Medium',
    },
    {
      category: 'Pest & Pathogen Prevention',
      icon: ShieldAlert,
      color: 'text-rose-400 bg-rose-950/60 border-rose-800',
      action: 'Foliar spray of Neem Oil (1500 ppm) @ 5ml/litre water during evening hours.',
      reason: 'High relative humidity (62%) creates favorable conditions for fungal spore germination.',
      priority: 'Urgent',
    },
    {
      category: 'Inter-State DPG Cooperation',
      icon: Share2,
      color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      action: 'Check FPO collective selling rate before selling wheat/cotton at local APMC.',
      reason: 'Regional bio-pellet and grain pool in neighboring state trading at ₹80/qtl premium over MSP.',
      priority: 'Strategic',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Agro-Action Recommendations Summary</span>
            </div>
            <h3 className="text-xl font-black text-white">
              Farmer Action Checklist • {district}, {state}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregated from Soil Health Card, Sentinel Satellite Telemetry & IMD Forecast
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {currentTasks.map((task, idx) => {
            const Icon = task.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border ${task.color} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {task.category}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          task.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : task.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white leading-snug">{task.action}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{task.reason}</p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-slate-600 hover:text-emerald-400 cursor-pointer transition" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <span>Language: <strong className="text-emerald-300">{selectedLanguage}</strong></span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const text = `🌾 *KrishiSetu Agro-Action Recommendations* (${district}, ${state})\n\n` +
                  currentTasks.map((t, i) => `${i + 1}. [${t.priority}] *${t.category}*:\n👉 ${t.action}\n_Reason:_ ${t.reason}`).join('\n\n') +
                  `\n\n_National Digital Public Good (AgriStack & ICAR-IMD Open Telemetry)_`;
                navigator.clipboard.writeText(text);
                alert('Agro-Action Checklist copied to clipboard! You can paste and share it directly into your Village Farmer WhatsApp Group.');
              }}
              className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs cursor-pointer shadow"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
