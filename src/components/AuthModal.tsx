import React, { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  db,
  signInWithPopup,
  signOut,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import { X, LogIn, LogOut, UserCheck, Bookmark, Sprout, ShieldCheck, Loader2, Download } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { STATE_DISTRICT_PROFILES } from '../data/mockAgriData';
import { generateAdvisoryPdf } from '../utils/generateAdvisoryPdf';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: string;
  currentDistrict: string;
  selectedLanguage: SupportedLanguage;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentState,
  currentDistrict,
  selectedLanguage,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [acreageInput, setAcreageInput] = useState<number>(3);
  const [primaryCropInput, setPrimaryCropInput] = useState<string>('Wheat');
  const [savedAdvisories, setSavedAdvisories] = useState<any[]>([]);
  const [savedDiagnostics, setSavedDiagnostics] = useState<any[]>([]);
  const [historyTab, setHistoryTab] = useState<'advisories' | 'diagnostics'>('advisories');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load or create user profile
        const userPath = `users/${user.uid}`;
        try {
          const userDocRef = doc(db, 'users', user.uid);
          let userSnap;
          try {
            userSnap = await getDoc(userDocRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, userPath);
            return;
          }

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.acreage) setAcreageInput(data.acreage);
            if (data.primaryCrop) setPrimaryCropInput(data.primaryCrop);
          } else {
            // Create initial profile in Firestore
            try {
              await setDoc(userDocRef, {
                uid: user.uid,
                displayName: user.displayName || 'Farmer',
                email: user.email || '',
                state: currentState,
                district: currentDistrict,
                acreage: 3,
                primaryCrop: 'Wheat',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, userPath);
            }
          }

          // Listen to saved advisories in Firestore
          const advPath = `users/${user.uid}/savedAdvisories`;
          const advColRef = collection(db, 'users', user.uid, 'savedAdvisories');
          onSnapshot(
            advColRef,
            (snapshot) => {
              const docs = snapshot.docs.map((d) => d.data());
              setSavedAdvisories(docs);
            },
            (error) => {
              handleFirestoreError(error, OperationType.GET, advPath);
            }
          );

          // Listen to saved diagnostics in Firestore
          const diagPath = `users/${user.uid}/diagnostics`;
          const diagColRef = collection(db, 'users', user.uid, 'diagnostics');
          onSnapshot(
            diagColRef,
            (snapshot) => {
              const docs = snapshot.docs.map((d) => d.data());
              setSavedDiagnostics(docs);
            },
            (error) => {
              handleFirestoreError(error, OperationType.GET, diagPath);
            }
          );
        } catch (err) {
          console.error('Error loading Firestore profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, [currentState, currentDistrict]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Sign-in error:', err);
      alert('Google Sign-in failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setSavedAdvisories([]);
    setSavedDiagnostics([]);
  };

  const handleDownloadSavedAdvisory = (item: any) => {
    const profile =
      STATE_DISTRICT_PROFILES.find(
        (p) =>
          p.district.toLowerCase() === (item.district || currentDistrict).toLowerCase() ||
          p.state.toLowerCase() === (item.state || currentState).toLowerCase()
      ) || STATE_DISTRICT_PROFILES[0];

    generateAdvisoryPdf({
      state: item.state || profile.state,
      district: item.district || profile.district,
      agroClimaticZone: profile.agroClimaticZone,
      crop: item.crop || profile.majorCrops[0],
      season: profile.currentSeason,
      soilData: profile.soilProfile,
      satelliteData: profile.satelliteTelemetry,
      weatherData: profile.weatherForecast,
      advisoryResult: {
        headline: item.headline || 'Saved Agro-Advisory Bulletin',
        riskLevel: (item.riskLevel as any) || 'Moderate',
        cropGrowthStageAssessment: 'Vegetative to Flowering transition stage under monitored soil profile.',
        irrigationAdvisory: {
          action: item.irrigationAction || 'Scheduled micro-irrigation applied.',
          rationale: 'Calibrated based on satellite moisture index and rainfall forecast.',
          waterSavingTips: 'Mulching and alternate furrow irrigation recommended.',
        },
        soilNutrientManagement: {
          ureaDapCorrection: item.soilNutrition || 'Balanced split nitrogen and phosphatic application.',
          micronutrientsNeeded: ['Zinc Sulfate', 'Boron'],
          organicAmendments: 'Compost top-dressing with bio-fertilizers.',
        },
        climateResilienceAction: {
          threat: 'Seasonal temperature fluctuations & high humidity.',
          protectiveMeasure: 'Maintain drainage channels and monitor crop canopy health.',
        },
        mandiMarketIntel: {
          currentMsp: 'Official MSP Grade-A',
          estimatedLocalMandiPrice: 'APMC Benchmark Rate',
          cooperativeSellingAdvice: 'Participate in FPO collective auction for better price realization.',
        },
        interStateCooperationNote: 'Inter-State DPG digital exchange for sustainable agriculture.',
        spokenAdvisoryVoice: item.headline || '',
      },
      selectedLanguage,
    });
  };

  const handleSaveFarmProfile = async () => {
    if (!currentUser) return;
    const userPath = `users/${currentUser.uid}`;
    try {
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          state: currentState,
          district: currentDistrict,
          acreage: acreageInput,
          primaryCrop: primaryCropInput,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      alert('Farm profile saved to Firebase Firestore!');
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, userPath);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-600/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
              Firebase Auth & Cloud Firestore
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        {!currentUser ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-inner">
              <UserCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">Sign In with Google</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Save your soil cards, farm plots, and AI agro-advisories securely in your personal Firestore account.
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs shadow-lg transition mx-auto cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <LogIn className="w-4 h-4 text-slate-950" />
              )}
              <span>Continue with Google Account</span>
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Logged in Profile details */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Farmer'}
                    className="w-12 h-12 rounded-full border border-emerald-500"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                    {currentUser.displayName?.[0] || 'K'}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-black text-white">
                    {currentUser.displayName}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Verified Farmer Account
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl border border-slate-700 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Farm Profile Configuration stored in Firestore */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                My Farm Profile (Firestore Synced)
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Land Holding (Acres)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={acreageInput}
                    onChange={(e) => setAcreageInput(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Primary Crop</label>
                  <input
                    type="text"
                    value={primaryCropInput}
                    onChange={(e) => setPrimaryCropInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveFarmProfile}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Save Farm Profile to Cloud
              </button>
            </div>

            {/* Saved History from Firestore */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Cloud Records
                  </span>
                </div>
                <div className="flex gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    onClick={() => setHistoryTab('advisories')}
                    className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                      historyTab === 'advisories'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Advisories ({savedAdvisories.length})
                  </button>
                  <button
                    onClick={() => setHistoryTab('diagnostics')}
                    className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                      historyTab === 'diagnostics'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Diagnoses ({savedDiagnostics.length})
                  </button>
                </div>
              </div>

              {historyTab === 'advisories' ? (
                savedAdvisories.length === 0 ? (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                    No saved advisories yet. Click "Save to Cloud" on any advisory bulletin to store it here.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {savedAdvisories.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white truncate max-w-[200px]">
                            {item.headline || item.crop}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-emerald-400 font-mono">
                              {item.crop}
                            </span>
                            <button
                              onClick={() => handleDownloadSavedAdvisory(item)}
                              className="text-slate-400 hover:text-emerald-400 p-1 rounded hover:bg-slate-800 transition cursor-pointer"
                              title="Download PDF Summary"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">
                          {item.irrigationAction || item.soilNutrition}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                savedDiagnostics.length === 0 ? (
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                    No diagnostic records saved yet. Click "Save to Cloud" after diagnosing crop specimens.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {savedDiagnostics.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white truncate max-w-[200px]">
                            {item.diseaseDetected}
                          </span>
                          <span className="text-[9px] font-bold text-amber-400">
                            {item.severity} • {item.crop}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">
                          {item.immediateAction}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
