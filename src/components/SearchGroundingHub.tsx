import React, { useState } from 'react';
import { Search, Globe, ExternalLink, Loader2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface SearchGroundingHubProps {
  district: string;
  state: string;
  selectedLanguage: SupportedLanguage;
}

export const SearchGroundingHub: React.FC<SearchGroundingHubProps> = ({
  district,
  state,
}) => {
  const [queryInput, setQueryInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const presets = [
    `Today's APMC mandi modal price for major crops in ${state} mandis 2026`,
    `Current official Minimum Support Price (MSP) notified rates for Wheat, Cotton, and Paddy 2026`,
    `PM-KUSUM 90% solar water pump subsidy application process and guidelines in ${state}`,
    `Latest IMD weather forecast and monsoon status advisory for ${district}, ${state}`,
  ];

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || queryInput || presets[0];
    setLoading(true);
    try {
      const res = await fetch('/api/search-grounding', {
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
        alert('Search grounding failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Search lookup error:', err);
      alert('Error fetching search grounded data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Google Search Grounding • gemini-3.5-flash</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Real-Time Mandi Prices & Agricultural Policy Intelligence
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Up-to-the-minute web grounded search across Agmarknet, e-NAM, PIB, and Ministry portals.
          </p>
        </div>
      </div>

      {/* Preset Chips */}
      <div>
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
          Trending Live Agricultural Inquiries:
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
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{preset}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search live mandi rates, PM-Kisan installment dates, crop subsidy rules..."
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
          <span>Search Web</span>
        </button>
      </div>

      {/* Grounded Results Output */}
      {resultText && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-900/50 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Google Search Grounded Intelligence
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
              Verified with Google Search Tool
            </span>
          </div>

          <div className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {resultText}
          </div>

          {/* Web Citation Sources */}
          {metadata?.groundingChunks && (
            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                Official Sources & Web References:
              </span>
              <div className="flex flex-wrap gap-2">
                {metadata.groundingChunks.map((chunk: any, i: number) => {
                  const title = chunk.web?.title || `Source #${i + 1}`;
                  const uri = chunk.web?.uri;
                  return uri ? (
                    <a
                      key={i}
                      href={uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 text-[11px] border border-emerald-900/60"
                    >
                      <Globe className="w-3 h-3" />
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
