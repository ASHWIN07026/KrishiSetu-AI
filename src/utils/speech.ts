import { SupportedLanguage } from '../types';

let currentAudio: HTMLAudioElement | null = null;

const LANG_CODE_MAP: Record<SupportedLanguage, string> = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Marathi: 'mr-IN',
  Telugu: 'te-IN',
  Tamil: 'ta-IN',
  Punjabi: 'pa-IN',
  Bengali: 'bn-IN',
  Kannada: 'kn-IN',
};

export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const playFarmerAudio = async (
  text: string,
  language: SupportedLanguage,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): Promise<void> => {
  stopSpeech();

  if (!text || text.trim() === '') return;

  onStart?.();

  try {
    // 1. Try Gemini TTS through server
    const res = await fetch('/api/voice-tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language,
        voice: 'Kore',
      }),
    });

    const data = await res.json();

    if (data.success && data.audioData) {
      currentAudio = new Audio(data.audioData);
      currentAudio.onended = () => {
        currentAudio = null;
        onEnd?.();
      };
      currentAudio.onerror = (e) => {
        console.warn('Audio playback error, falling back to browser speech synthesis:', e);
        fallbackBrowserSpeech(text, language, onEnd, onError);
      };
      await currentAudio.play();
      return;
    }
  } catch (err) {
    console.warn('Gemini TTS endpoint call failed, falling back to browser synthesis:', err);
  }

  // 2. Fallback to browser Web Speech API
  fallbackBrowserSpeech(text, language, onEnd, onError);
};

const fallbackBrowserSpeech = (
  text: string,
  language: SupportedLanguage,
  onEnd?: () => void,
  onError?: (err: any) => void
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLangCode = LANG_CODE_MAP[language] || 'hi-IN';
    utterance.lang = targetLangCode;
    utterance.rate = 0.95; // Clearer pace for farmers
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prefer matching voice
    const matchedVoice = voices.find(
      (v) => v.lang.startsWith(targetLangCode.split('-')[0]) || v.lang.includes('IN')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      onError?.(e);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis failure:', err);
    onError?.(err);
    onEnd?.();
  }
};
