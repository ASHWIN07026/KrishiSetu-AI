import React, { useState, useRef } from 'react';
import { CropDiagnosticResult, SupportedLanguage } from '../types';
import { PRESET_SPECIMENS, PathologySpecimen, UI_TRANSLATIONS } from '../data/mockAgriData';
import { playFarmerAudio, stopSpeech } from '../utils/speech';
import { AudioTranscriber } from './AudioTranscriber';
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
  Camera,
  Upload,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldAlert,
  Leaf,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Bug,
  Share2,
  Bookmark,
  Check,
} from 'lucide-react';

interface DiagnosticToolProps {
  selectedLanguage: SupportedLanguage;
  currentState: string;
  currentDistrict: string;
}

export const DiagnosticTool: React.FC<DiagnosticToolProps> = ({
  selectedLanguage,
  currentState,
  currentDistrict,
}) => {
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.English;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [observedSymptoms, setObservedSymptoms] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>(PRESET_SPECIMENS[0].previewUrl);
  const [imageBase64, setImageBase64] = useState<string>(PRESET_SPECIMENS[0].previewUrl);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<CropDiagnosticResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Handle Preset Specimen Click
  const handleSelectPreset = (specimen: PathologySpecimen) => {
    setSelectedCrop(specimen.crop);
    setObservedSymptoms(specimen.defaultSymptoms);
    setPreviewImage(specimen.previewUrl);
    setImageBase64(specimen.previewUrl);
    setDiagnosticResult(null);
    setIsSaved(false);
    stopSpeech();
    setIsPlayingAudio(false);
  };

  const handleSaveDiagnosisToFirestore = async () => {
    if (!diagnosticResult) return;
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
    const diagId = `diag_${Date.now()}`;
    const path = `users/${user.uid}/diagnostics/${diagId}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'diagnostics', diagId), {
        id: diagId,
        userId: user.uid,
        crop: selectedCrop,
        diseaseDetected: diagnosticResult.diseaseDetected.slice(0, 150),
        severity: diagnosticResult.severity,
        confidenceScore: diagnosticResult.confidenceScore,
        immediateAction: (diagnosticResult.immediateAction || '').slice(0, 500),
        createdAt: new Date().toISOString(),
      });
      setIsSaved(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
      setImageBase64(base64);
      setDiagnosticResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Start Camera
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      alert('Camera access could not be initialized. Please upload an image file instead.');
    }
  };

  // Capture Photo from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPreviewImage(dataUrl);
      setImageBase64(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Run Diagnosis with Gemini API
  const handleDiagnose = async () => {
    if (!imageBase64) {
      setErrorMsg('Please select or upload a crop leaf image first.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    stopSpeech();
    setIsPlayingAudio(false);

    try {
      const res = await fetch('/api/crop-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType: imageBase64.startsWith('data:image/svg+xml') ? 'image/svg+xml' : 'image/jpeg',
          cropType: selectedCrop,
          state: currentState,
          district: currentDistrict,
          observedSymptoms,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Diagnosis service encountered an issue.');
      }

      setDiagnosticResult(data.data);
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setErrorMsg(err.message || 'Unable to complete diagnosis. Please check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Audio Playback
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      if (!diagnosticResult) return;
      const textToSpeak = diagnosticResult.farmerAudioSummary || diagnosticResult.diagnosisDetails;
      playFarmerAudio(
        textToSpeak,
        selectedLanguage,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Bug className="w-4 h-4" />
          <span>Multimodal Plant Pathology & Pest Intelligence Engine</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Crop Disease & Pest Diagnosis
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl">
          Powered by Google Gemini 3.8 Flash Vision. Upload photos of infected leaves, stems, or pests to receive instant ICAR-grade diagnoses, bio-organic remedies, CIBRC chemical dosages, and cross-state migratory vector alerts.
        </p>
      </div>

      {/* Preset Specimens Bar */}
      <div className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Test: Sample Field Specimens (1-Click Evaluation)
          </span>
          <span className="text-[11px] text-slate-400">Click any preset to load specimen</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_SPECIMENS.map((specimen) => (
            <button
              key={specimen.id}
              onClick={() => handleSelectPreset(specimen)}
              className={`p-2.5 rounded-lg border text-left transition flex items-center gap-3 ${
                previewImage === specimen.previewUrl
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-900/20'
                  : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-500'
              }`}
            >
              <img
                src={specimen.previewUrl}
                alt={specimen.name}
                className="w-12 h-12 rounded object-cover border border-slate-700 shrink-0"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{specimen.name}</p>
                <p className="text-[11px] text-emerald-400 font-medium truncate">{specimen.vernacular}</p>
                <p className="text-[10px] text-slate-400">{specimen.crop}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload & Controls on Left, Diagnosis Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Input & Crop Context */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>Leaf Specimen Photo</span>
              <span className="text-xs font-normal text-slate-400">{currentState} • {currentDistrict}</span>
            </h3>

            {/* Camera View or Image Preview */}
            <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-slate-700 bg-slate-950 aspect-video flex items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-3">
                    <button
                      onClick={capturePhoto}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Capture Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : previewImage ? (
                <div className="relative w-full h-full group">
                  <img
                    src={previewImage}
                    alt="Selected leaf specimen"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-800/90 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-md font-medium cursor-pointer"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <Upload className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No image loaded</p>
                </div>
              )}
            </div>

            {/* Upload & Camera Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                Upload Photo
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                Live Camera
              </button>
            </div>

            {/* Crop & Field Parameters */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Crop Specimen Type
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Wheat">Wheat (गेंहू / ਕਣਕ)</option>
                  <option value="Paddy / Rice">Paddy / Rice (धान / ধান)</option>
                  <option value="Cotton">Cotton (कपास / कापूस)</option>
                  <option value="Tomato">Tomato (टमाटर / టమాటా)</option>
                  <option value="Chilli">Chilli (मिर्च / మిర్చి)</option>
                  <option value="Sugarcane">Sugarcane (गन्ना / ಕಬ್ಬು)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Maize">Maize (मक्का / ಜೋಳ)</option>
                  <option value="Mustard">Mustard (सरसों / ਰਾਈ)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Observed Field Symptoms & Spread
                  </label>
                  <AudioTranscriber
                    buttonLabel="Speak Symptoms (Transcribe)"
                    onTranscribed={(text) =>
                      setObservedSymptoms((prev) => (prev ? `${prev} ${text}` : text))
                    }
                  />
                </div>
                <textarea
                  rows={2}
                  value={observedSymptoms}
                  onChange={(e) => setObservedSymptoms(e.target.value)}
                  placeholder="e.g. Yellow powder on upper leaves, spreading downwind, noticed 3 days after unseasonal fog..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-red-300 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Diagnosis Action Button */}
              <button
                onClick={handleDiagnose}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/40 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.diagnosing}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{t.diagnoseButton}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Report */}
        <div className="lg:col-span-7">
          {diagnosticResult ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              {/* Report Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {diagnosticResult.pathogenType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        diagnosticResult.severity === 'High'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {diagnosticResult.severity} Severity
                    </span>
                    <span className="text-xs text-slate-400">
                      Confidence: <strong className="text-emerald-400">{diagnosticResult.confidenceScore}%</strong>
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white">
                    {diagnosticResult.diseaseDetected}
                  </h3>
                  <p className="text-emerald-400 font-semibold text-sm">
                    {diagnosticResult.localName}
                  </p>
                </div>

                {/* Action Buttons: Save to Cloud & Voice Readout */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDiagnosisToFirestore}
                    disabled={isSaving || isSaved}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition shadow cursor-pointer border ${
                      isSaved
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                    title="Save this diagnosis to your Firebase cloud account"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Saved</span>
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
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Stop Voice</span>
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

              {/* Spoken Summary Banner */}
              {diagnosticResult.farmerAudioSummary && (
                <div className="bg-slate-800/80 border-l-4 border-emerald-500 p-3 rounded-r-lg">
                  <p className="text-xs text-slate-300 italic">
                    "{diagnosticResult.farmerAudioSummary}"
                  </p>
                </div>
              )}

              {/* Immediate Urgent Action */}
              <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wide mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Immediate Action (Within 24-48 Hours)</span>
                </div>
                <p className="text-xs text-red-100 font-medium">
                  {diagnosticResult.immediateAction}
                </p>
              </div>

              {/* Diagnosis Details */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Diagnostic Pathology Breakdown
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                  {diagnosticResult.diagnosisDetails}
                </p>
              </div>

              {/* Dual Treatments: Organic / Bio-Remedies vs Chemical IPM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic & Biological Remedies */}
                <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <Leaf className="w-4 h-4" />
                    <span>Biological & Organic Remedies</span>
                  </div>
                  <div className="space-y-2.5">
                    {diagnosticResult.organicBioRemedies.map((remedy, idx) => (
                      <div key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-emerald-900/30">
                        <p className="text-xs font-bold text-white">{remedy.name}</p>
                        <p className="text-[11px] text-emerald-300 mt-0.5">Dosage: {remedy.dosage}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{remedy.applicationMethod}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integrated Pest Management (Chemical Formulation) */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>CIB&RC Approved Chemical IPM</span>
                  </div>
                  <div className="space-y-2.5">
                    {diagnosticResult.integratedPestManagement.map((chem, idx) => (
                      <div key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700">
                        <p className="text-xs font-bold text-white">{chem.chemicalName}</p>
                        <p className="text-[11px] text-amber-300 mt-0.5">Dose: {chem.dosage}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>Waiting: {chem.waitingPeriodDays} days</span>
                          <span className="text-slate-500">PPE Required</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preventative Agronomic Practices */}
              {diagnosticResult.preventativePractices && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Preventative Cultivation Measures
                  </h4>
                  <ul className="space-y-1.5">
                    {diagnosticResult.preventativePractices.map((prac, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{prac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Inter-State Migratory Vector Alert */}
              {diagnosticResult.interStateAdvisoryAlert && (
                <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
                  <Share2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                      Inter-State Cross-Border Migratory Threat Notice
                    </h5>
                    <p className="text-xs text-amber-100/90 mt-1">
                      {diagnosticResult.interStateAdvisoryAlert.borderAlertMessage}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Vector Transmission: {diagnosticResult.interStateAdvisoryAlert.vectorTransmission}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to Inspect Leaf Specimen</h3>
              <p className="text-xs text-slate-400 max-w-md mb-6">
                Select one of the preset field specimens above or upload your own leaf photograph. Gemini Vision will analyze foliar necrosis, fungal pustules, and viral mottling to diagnose pathology.
              </p>
              <button
                onClick={handleDiagnose}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs shadow cursor-pointer"
              >
                Analyze Current Specimen ({PRESET_SPECIMENS[0].name.split('(')[0]})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
