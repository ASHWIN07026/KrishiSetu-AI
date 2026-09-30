import React, { useState } from 'react';
import { PestOutbreakReport, SupportedLanguage } from '../types';
import { Radio, AlertTriangle, ShieldCheck, MapPin, Plus, CheckCircle2, Share2, Sparkles } from 'lucide-react';

interface CommunityDiseaseRadarProps {
  district: string;
  state: string;
  selectedLanguage: SupportedLanguage;
}

export const CommunityDiseaseRadar: React.FC<CommunityDiseaseRadarProps> = ({
  district,
  state,
}) => {
  const [reports, setReports] = useState<PestOutbreakReport[]>([
    {
      id: 'rep-1',
      diseaseOrPest: 'Stripe Rust / Yellow Rust (Puccinia)',
      crop: 'Wheat (HD 2967 & PBW 550)',
      location: 'Talwandi Kalan Block',
      state: state,
      distanceKm: 18,
      severity: 'High',
      reportedAgo: '2 hours ago',
      verifiedByKvk: true,
      recommendedPrecaution: 'Inspect flag leaves; apply prophylactic foliar spray of Trichoderma viride or Azoxystrobin (0.1%).',
    },
    {
      id: 'rep-2',
      diseaseOrPest: 'Invasive Black Thrips (Thrips parvispinus)',
      crop: 'Chilli & Capsicum',
      location: 'Adjoining Mandi Border Area',
      state: state,
      distanceKm: 34,
      severity: 'Alert',
      reportedAgo: '5 hours ago',
      verifiedByKvk: true,
      recommendedPrecaution: 'Install 40 yellow/blue sticky traps per acre; spray Dashparni Ark at dusk to repel vectors.',
    },
    {
      id: 'rep-3',
      diseaseOrPest: 'Pink Bollworm (Pectinophora gossypiella)',
      crop: 'Cotton (Late Kharif Stubble)',
      location: 'South River Flank',
      state: state,
      distanceKm: 52,
      severity: 'Moderate',
      reportedAgo: '1 day ago',
      verifiedByKvk: false,
      recommendedPrecaution: 'Install pheromone traps (5/acre); destroy unpicked bolls to prevent overwintering.',
    },
  ]);

  const [showReportForm, setShowReportForm] = useState<boolean>(false);
  const [newCrop, setNewCrop] = useState<string>('Wheat');
  const [newIssue, setNewIssue] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.trim()) return;

    const newEntry: PestOutbreakReport = {
      id: `rep-${Date.now()}`,
      diseaseOrPest: newIssue,
      crop: newCrop,
      location: newLocation || `${district} Village Cluster`,
      state: state,
      distanceKm: 4,
      severity: 'Alert',
      reportedAgo: 'Just now',
      verifiedByKvk: false,
      recommendedPrecaution: 'Community report logged. Local Krishi Vigyan Kendra extension team dispatched for validation.',
    };

    setReports([newEntry, ...reports]);
    setNewIssue('');
    setNewLocation('');
    setShowReportForm(false);
    alert('Thank you, Kisan Bhai! Your field observation has alerted 14 surrounding villages in the AgriStack network.');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Real-Time Biosecurity & Spore Radar</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Community Crop Disease & Pest Vector Radar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Crowdsourced alerts from farmers and Krishi Vigyan Kendras (KVKs) within 60 km radius of {district}.
          </p>
        </div>

        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Report Localized Outbreak</span>
        </button>
      </div>

      {/* Report Form Drawer */}
      {showReportForm && (
        <form onSubmit={handleAddReport} className="bg-slate-950 p-4 rounded-xl border border-rose-900/60 space-y-3">
          <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
            Broadcast Outbreak Alert to Surrounding Villages
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block font-semibold mb-1">Affected Crop</label>
              <select
                value={newCrop}
                onChange={(e) => setNewCrop(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="Wheat">Wheat</option>
                <option value="Paddy / Rice">Paddy / Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Tomato">Tomato</option>
                <option value="Chilli">Chilli</option>
                <option value="Mustard">Mustard</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block font-semibold mb-1">Disease / Pest Observed</label>
              <input
                type="text"
                value={newIssue}
                onChange={(e) => setNewIssue(e.target.value)}
                placeholder="e.g. Yellow stripe rust, Brown plant hopper..."
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block font-semibold mb-1">Village / Cluster Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Rampur Gram Panchayat"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowReportForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
            >
              Broadcast Alert
            </button>
          </div>
        </form>
      )}

      {/* Reports Feed */}
      <div className="space-y-3">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    rep.severity === 'High'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : rep.severity === 'Alert'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                  }`}
                >
                  {rep.severity} Spore Level
                </span>
                <span className="text-xs font-bold text-white">{rep.diseaseOrPest}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-emerald-400 font-medium">{rep.crop}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {rep.location} ({rep.distanceKm} km away)
                </span>
                <span>•</span>
                <span>{rep.reportedAgo}</span>
                {rep.verifiedByKvk && (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> KVK Field Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 mt-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <strong className="text-amber-300">Preventative Advice:</strong> {rep.recommendedPrecaution}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `⚠️ *KrishiSetu Pest Radar Alert:* ${rep.diseaseOrPest} detected in ${rep.location} (${rep.distanceKm} km from you). Precaution: ${rep.recommendedPrecaution}`
                  )
                }
                className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                Copy Alert
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
