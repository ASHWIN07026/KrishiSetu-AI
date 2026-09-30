import React, { useState } from 'react';
import { MapPin, Search, Navigation, ExternalLink, Loader2, Sparkles, Building2, Store } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface MapsGroundingExplorerProps {
  district: string;
  state: string;
  selectedLanguage: SupportedLanguage;
}

export const MapsGroundingExplorer: React.FC<MapsGroundingExplorerProps> = ({
  district,
  state,
}) => {
  const [queryInput, setQueryInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const presets = [
    `Nearest APMC grain mandis & wholesale crop markets near ${district}, ${state}`,
    `Krishi Vigyan Kendra (KVK) & agricultural extension training centres near ${district}, ${state}`,
    `Government soil testing laboratories & fertilizer distribution societies near ${district}, ${state}`,
    `Custom Hiring Centers (CHC) for farm machinery & drone sprayers near ${district}, ${state}`,
  ];

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || queryInput || presets[0];
    setLoading(true);
    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          district,
          state,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResultText(data.text);
        setMetadata(data.groundingMetadata);
      } else {
        alert('Maps grounding failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Maps lookup error:', err);
      alert('Error fetching Maps data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Google Maps Grounding • gemini-3.5-flash</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Geospatial Agro-Hub & Mandi Navigator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Locate nearest APMC grain markets, Krishi Vigyan Kendras, and soil test labs in {district}, {state}.
          </p>
        </div>
      </div>

      {/* Preset Chips */}
      <div>
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
          Instant Geospatial Lookups:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQueryInput(preset);
                handleSearch(preset);
              }}
              className="text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{preset}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Search Input */}
      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={`Search any agricultural facility or mandi near ${district}, ${state}...`}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
          <span>Search Maps</span>
        </button>
      </div>

      {/* Grounded Results Output */}
      {resultText && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-900/50 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Google Maps Grounded Field Findings
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
              Verified with Google Maps Tool
            </span>
          </div>

          <div className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {resultText}
          </div>

          {/* Render Grounding Chunks if present */}
          {metadata?.groundingChunks && (
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Google Maps Verified Places & Sources:
              </span>
              <div className="flex flex-wrap gap-2">
                {metadata.groundingChunks.map((chunk: any, i: number) => {
                  const title = chunk.maps?.title || chunk.web?.title || `Place #${i + 1}`;
                  const uri = chunk.maps?.placeIdUri || chunk.web?.uri;
                  return uri ? (
                    <a
                      key={i}
                      href={uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[11px] border border-cyan-900/60"
                    >
                      <span>{title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
