import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface AudioTranscriberProps {
  onTranscribed: (text: string) => void;
  buttonLabel?: string;
  className?: string;
}

export const AudioTranscriber: React.FC<AudioTranscriberProps> = ({
  onTranscribed,
  buttonLabel = 'Voice Input (Gemini 3.5 Transcribe)',
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());

        // Convert to Base64
        setIsTranscribing(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const res = await fetch('/api/transcribe-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: audioBlob.type || 'audio/webm',
              }),
            });
            const data = await res.json();
            if (data.success && data.text) {
              onTranscribed(data.text);
            } else {
              alert('Could not transcribe audio: ' + (data.message || 'No speech detected'));
            }
          } catch (err: any) {
            console.error('Transcription error:', err);
            alert('Transcription failed: ' + err.message);
          } finally {
            setIsTranscribing(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Microphone error:', err);
      alert('Microphone access denied or unavailable: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isTranscribing ? (
        <button
          disabled
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>Transcribing Audio (gemini-3.5-transcribe)...</span>
        </button>
      ) : isRecording ? (
        <button
          type="button"
          onClick={stopRecording}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold animate-pulse cursor-pointer shadow"
        >
          <Square className="w-3.5 h-3.5" />
          <span>Stop Recording (Listening...)</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
        >
          <Mic className="w-3.5 h-3.5 text-emerald-400" />
          <span>{buttonLabel}</span>
        </button>
      )}
    </div>
  );
};
