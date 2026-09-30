import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, X, Radio } from 'lucide-react';

interface LiveVoiceSessionProps {
  isOpen: boolean;
  onClose: () => void;
  district: string;
  state: string;
}

export const LiveVoiceSession: React.FC<LiveVoiceSessionProps> = ({
  isOpen,
  onClose,
  district,
  state,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // Helper to convert float32 audio to base64 16kHz PCM
  const floatTo16BitPCM = (input: Float32Array): string => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startSession = async () => {
    try {
      setErrorMessage(null);
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = inputCtx;

      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      outputAudioCtxRef.current = outputCtx;
      nextPlayTimeRef.current = outputCtx.currentTime;

      ws.onopen = async () => {
        setIsConnected(true);
        // Start microphone capture
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        mediaStreamRef.current = stream;

        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const channelData = e.inputBuffer.getChannelData(0);
            const base64Pcm = floatTo16BitPCM(channelData);
            ws.send(JSON.stringify({ audio: base64Pcm }));
          }
        };

        source.connect(processor);
        processor.connect(inputCtx.destination);
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.interrupted) {
            // Stop current playback queue
            if (outputCtx) {
              nextPlayTimeRef.current = outputCtx.currentTime;
            }
            setIsSpeaking(false);
          }
          if (data.audio && outputCtx) {
            setIsSpeaking(true);
            const binary = atob(data.audio);
            const len = binary.length / 2;
            const float32 = new Float32Array(len);
            for (let i = 0; i < len; i++) {
              const byte1 = binary.charCodeAt(i * 2);
              const byte2 = binary.charCodeAt(i * 2 + 1);
              let int16 = (byte2 << 8) | byte1;
              if (int16 >= 0x8000) int16 -= 0x10000;
              float32[i] = int16 / 32768.0;
            }

            const audioBuffer = outputCtx.createBuffer(1, float32.length, 24000);
            audioBuffer.getChannelData(0).set(float32);

            const sourceNode = outputCtx.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(outputCtx.destination);

            const startTime = Math.max(outputCtx.currentTime, nextPlayTimeRef.current);
            sourceNode.start(startTime);
            nextPlayTimeRef.current = startTime + audioBuffer.duration;

            sourceNode.onended = () => {
              if (outputCtx && outputCtx.currentTime >= nextPlayTimeRef.current - 0.1) {
                setIsSpeaking(false);
              }
            };
          }
          if (data.error) {
            setErrorMessage(data.error);
          }
        } catch (e) {
          console.error('Error decoding live response chunk:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setErrorMessage('WebSocket connection error with Live API.');
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsSpeaking(false);
      };
    } catch (err: any) {
      console.error('Failed to start Live session:', err);
      setErrorMessage(err.message || 'Microphone or WebSocket error');
      setIsConnected(false);
    }
  };

  const endSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (!isOpen) {
      endSession();
    }
    return () => {
      endSession();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-emerald-600/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
              Gemini 3.8 Live API • Real-Time Voice Conversation
            </span>
          </div>
          <button
            onClick={() => {
              endSession();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Pulse Indicator */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSpeaking
                ? 'bg-amber-500/20 border-4 border-amber-400 shadow-2xl shadow-amber-500/50 scale-110'
                : isConnected
                ? 'bg-emerald-500/20 border-4 border-emerald-400 shadow-xl shadow-emerald-500/30 animate-pulse'
                : 'bg-slate-800 border-2 border-slate-700'
            }`}
          >
            {isSpeaking ? (
              <Volume2 className="w-12 h-12 text-amber-400 animate-bounce" />
            ) : isConnected ? (
              <Mic className="w-12 h-12 text-emerald-400" />
            ) : (
              <MicOff className="w-10 h-10 text-slate-500" />
            )}
          </div>

          <div>
            <h4 className="text-lg font-black text-white">
              {isSpeaking
                ? 'KrishiSetu is speaking...'
                : isConnected
                ? 'Listening to you... Speak naturally!'
                : 'Real-Time Voice Assistant Offline'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Talk directly with Gemini 3.8 Live about farming in {district}, {state}.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-3 pt-2">
          {!isConnected ? (
            <button
              onClick={startSession}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-lg cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Connect Live Voice (gemini-3.8-live)</span>
            </button>
          ) : (
            <button
              onClick={endSession}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-lg cursor-pointer"
            >
              <MicOff className="w-4 h-4" />
              <span>Disconnect Voice Session</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
