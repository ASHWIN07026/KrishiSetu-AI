import React, { useState } from 'react';
import { SharedEquipmentItem, SupportedLanguage } from '../types';
import { Truck, Cpu, CheckCircle2, ShieldCheck, Share2, Sparkles, Calendar, Clock } from 'lucide-react';

interface SharedEquipmentPoolProps {
  selectedLanguage: SupportedLanguage;
  currentState: string;
}

export const SharedEquipmentPool: React.FC<SharedEquipmentPoolProps> = ({
  currentState,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookedId, setBookedId] = useState<string | null>(null);

  const equipmentList: SharedEquipmentItem[] = [
    {
      id: 'eq-1',
      name: 'Garuda Kisan Drone Fleet (10L Tank - Nano Urea & Bio-spray)',
      category: 'Drone',
      originState: 'Telangana',
      originFpo: 'Warangal Precision Agro Collective',
      availableInStates: ['Telangana', 'Andhra Pradesh', 'Maharashtra', 'Karnataka'],
      ratePerHour: 450, // ₹ per acre / hour
      subsidyCoveredPercent: 50, // Subam scheme
      operatorProvided: true,
      status: 'Available',
    },
    {
      id: 'eq-2',
      name: 'PAU Super Seeder (Zero-Tillage Wheat Sowing in Rice Stubble)',
      category: 'Residue Seeder',
      originState: 'Punjab',
      originFpo: 'Ludhiana Progressive Kisan FPO',
      availableInStates: ['Punjab', 'Haryana & Delhi NCR', 'Uttar Pradesh'],
      ratePerHour: 650,
      subsidyCoveredPercent: 60,
      operatorProvided: true,
      status: 'Available',
    },
    {
      id: 'eq-3',
      name: 'Ecozen 5-MT Solar Portable Cold Storage Van',
      category: 'Solar Cold Storage',
      originState: 'Maharashtra',
      originFpo: 'Nashik Horticultural Farmers Federation',
      availableInStates: ['Maharashtra', 'Gujarat', 'Karnataka', 'Madhya Pradesh'],
      ratePerHour: 1200,
      subsidyCoveredPercent: 40,
      operatorProvided: true,
      status: 'Available',
    },
    {
      id: 'eq-4',
      name: 'Trimble Dual-Receiver GPS Laser Land Leveler',
      category: 'Laser Leveler',
      originState: 'Haryana',
      originFpo: 'Karnal Water-Smart Agricultural Consortium',
      availableInStates: ['Haryana', 'Punjab', 'Rajasthan', 'Uttar Pradesh'],
      ratePerHour: 550,
      subsidyCoveredPercent: 45,
      operatorProvided: true,
      status: 'Available',
    },
  ];

  const filtered = equipmentList.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleBook = (id: string) => {
    setBookedId(id);
    setTimeout(() => {
      alert(
        'Cooperative Dispatch Initiated! Under the Inter-State DPG Machinery Compact, this equipment will be shared via cross-border FPO logistics with zero inter-state road tolls.'
      );
    }, 400);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Theme: Inter-State Cooperative Asset Sharing</span>
          </div>
          <h3 className="text-xl font-black text-white">
            Federated FPO Machinery & Drone Fleet Pool
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-state cooperative pool enabling smallholders to rent laser levelers, drones, and happy seeders at 50% subsidized cooperative rates.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['All', 'Drone', 'Residue Seeder', 'Solar Cold Storage', 'Laser Leveler'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
                  {item.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {item.subsidyCoveredPercent}% DBT Subsidized
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">
                {item.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Home FPO: <strong className="text-slate-200">{item.originFpo}</strong> ({item.originState})
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                <span className="text-[10px] text-slate-400 mr-1">Cross-State Service Area:</span>
                {item.availableInStates.map((st, idx) => (
                  <span
                    key={idx}
                    className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                      st.includes(currentState)
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Cooperative Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-amber-400">₹{item.ratePerHour}</span>
                  <span className="text-[10px] text-slate-400">/ hour (operator incl.)</span>
                </div>
              </div>

              <button
                onClick={() => handleBook(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
                  bookedId === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {bookedId === item.id ? 'Dispatched ✓' : 'Book Shared Asset'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
