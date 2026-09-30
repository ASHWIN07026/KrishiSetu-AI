import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/mockAgriData';
import { playFarmerAudio, stopSpeech } from '../utils/speech';
import { AudioTranscriber } from './AudioTranscriber';
import { LiveVoiceSession } from './LiveVoiceSession';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  RefreshCw,
  MessageSquare,
  Radio,
} from 'lucide-react';

interface FarmerVoiceAssistantProps {
  selectedLanguage: SupportedLanguage;
  currentState: string;
  currentDistrict: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const FarmerVoiceAssistant: React.FC<FarmerVoiceAssistantProps> = ({
  selectedLanguage,
  currentState,
  currentDistrict,
}) => {
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.English;

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [isLiveOpen, setIsLiveOpen] = useState<boolean>(false);

  const initialGreeting: Message = {
    id: 'init-1',
    sender: 'assistant',
    text:
      selectedLanguage === 'Hindi'
        ? `नमस्ते किसान भाई/बहन! मैं कृषिसेतु AI आवाज़ सहायक हूँ। आप मुझसे फसल रोग, जैविक खाद (जैसे दशपर्णी अर्क या जीवामृत), मौसम पूर्वानुमान, या अंतर-राज्यीय कृषि मंडियों के बारे में कुछ भी पूछ सकते हैं।`
        : selectedLanguage === 'Punjabi'
        ? `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਕ੍ਰਿਸ਼ੀਸੇਤੂ AI ਕਿਸਾਨ ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੇਰੇ ਤੋਂ ਫ਼ਸਲਾਂ ਦੇ ਰੋਗ, ਜੈਵਿਕ ਖਾਦਾਂ, ਮੌਸਮ ਜਾਂ ਮੰਡੀ ਭਾਵਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।`
        : selectedLanguage === 'Marathi'
        ? `नमस्कार शेतकरी मित्रांनो! मी कृषीसेतू AI सहाय्यक आहे. तुम्ही मला पीक रोग, दशपर्णी अर्क, खत व्यवस्थापन किंवा हवामान अंदाजाबद्दल विचारू शकता.`
        : selectedLanguage === 'Telugu'
        ? `నమస్కారం రైతు సోదరులారా! నేను కృషిసేతు AI వాయిస్ అసిస్టెంట్. మీరు నన్ను పంట వ్యాధులు, సేంద్రీయ ఎరువులు, వాతావరణం మరియు మార్కెట్ ధరల గురించి అడగవచ్చు.`
        : `Namaste Farmer! I am your KrishiSetu AI Voice Extension Officer for ${currentDistrict}, ${currentState}. Ask me anything about crop diseases, organic formulations (like Dashparni Ark or Jeevamrut), irrigation schedules, or inter-state cooperative grain selling.`,
    timestamp: 'Just now',
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);

  // Preset queries tailored to Indian smallholders
  const PRESET_QUERIES = [
    {
      q: 'How to prepare Dashparni Ark at home for pest control?',
      vernacular: 'कीट नियंत्रण के लिए घर पर दशपर्णी अर्क कैसे बनाएं?',
    },
    {
      q: 'Should I irrigate wheat today given the light rain and humidity forecast?',
      vernacular: 'क्या हल्की बारिश के अनुमान के बीच आज गेहूं में सिंचाई करनी चाहिए?',
    },
    {
      q: 'What is the government MSP for wheat and cotton this season?',
      vernacular: 'इस मौसम में गेहूं और कपास का सरकारी न्यूनतम समर्थन मूल्य (MSP) क्या है?',
    },
    {
      q: 'How does the inter-state stubble bio-pellet grid benefit farmers?',
      vernacular: 'अंतर-राज्यीय पराली बायो-पेलेट नेटवर्क से किसानों को क्या आर्थिक लाभ है?',
    },
  ];

  const handleSend = async (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);
    stopSpeech();
    setIsPlayingAudio(false);

    try {
      const res = await fetch('/api/agro-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: currentState,
          district: currentDistrict,
          crop: 'Field Crop',
          season: 'Rabi',
          soilData: { n: 180, p: 22, k: 260, ph: 7.4, organicCarbon: 0.5, ec: 0.5, moisture: 35 },
          satelliteData: { ndvi: 0.65, ndre: 0.58, ndwi: 0.2, lst: 28, vegetationConditionIndex: 75 },
          weatherData: { tempMax: 30, tempMin: 16, rainProb: 15, expectedRain: 0, humidity: 60, windSpeed: 9 },
          language: selectedLanguage,
          queryOverride: query,
        }),
      });

      const data = await res.json();
      let answerText = '';
      if (data.success && data.data) {
        answerText =
          data.data.spokenAdvisoryVoice ||
          `${data.data.headline}. ${data.data.irrigationAdvisory?.action || ''}. ${data.data.climateResilienceAction?.protectiveMeasure || ''}`;
      } else {
        answerText = `Advice for ${query}: For sustainable smallholder management in ${currentDistrict}, maintain balanced micronutrients and avoid chemical over-application. Contact your local Krishi Vigyan Kendra (KVK) for direct field validation.`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: answerText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Auto play voice for farmer convenience
      playFarmerAudio(
        answerText,
        selectedLanguage,
        () => {
          setIsPlayingAudio(true);
          setActiveSpeakingId(botMsg.id);
        },
        () => {
          setIsPlayingAudio(false);
          setActiveSpeakingId(null);
        },
        () => {
          setIsPlayingAudio(false);
          setActiveSpeakingId(null);
        }
      );
    } catch (err) {
      console.error('Farmer query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakMessage = (msg: Message) => {
    if (isPlayingAudio && activeSpeakingId === msg.id) {
      stopSpeech();
      setIsPlayingAudio(false);
      setActiveSpeakingId(null);
    } else {
      stopSpeech();
      playFarmerAudio(
        msg.text,
        selectedLanguage,
        () => {
          setIsPlayingAudio(true);
          setActiveSpeakingId(msg.id);
        },
        () => {
          setIsPlayingAudio(false);
          setActiveSpeakingId(null);
        },
        () => {
          setIsPlayingAudio(false);
          setActiveSpeakingId(null);
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Volume2 className="w-4 h-4" />
          <span>Multilingual Voice-First Agricultural Extension</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Kisan Voice Agro-Helpline
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Spoken advisories tuned for Indian smallholders across 8 regional languages. Powered by Google Gemini 3.8 Flash & Text-to-Speech audio models.
        </p>
      </div>

      {/* Gemini 3.8 Live API Voice-to-Voice Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 rounded-2xl border border-emerald-600/50 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
              Gemini 3.8 Live API
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5">Real-Time Voice-to-Voice Conversation</h4>
            <p className="text-xs text-slate-300">Talk continuously with the AI agronomist with sub-second voice latency.</p>
          </div>
        </div>
        <button
          onClick={() => setIsLiveOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg cursor-pointer transition"
        >
          <Mic className="w-4 h-4 text-slate-950" />
          <span>Launch Live Voice (gemini-3.8-live)</span>
        </button>
      </div>

      {/* Preset Farmer Queries */}
      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          Frequently Asked Questions by Smallholder Farmers
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset.q)}
              className="text-left p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 hover:text-white transition flex items-start gap-2 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{preset.q}</p>
                <p className="text-[11px] text-emerald-400/90 mt-0.5">{preset.vernacular}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl mb-4 h-[440px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center shrink-0 shadow">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-xs'
              }`}
            >
              <p>{msg.text}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => handleSpeakMessage(msg)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold ml-3 cursor-pointer"
                  >
                    {isPlayingAudio && activeSpeakingId === msg.id ? (
                      <>
                        <VolumeX className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-400">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>Speak Audio</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Consulting ICAR Knowledge Base & Generating Spoken Advisory...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl shadow-lg">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Type or ask a question in ${selectedLanguage} (e.g. "What spray for leaf spots?")...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none"
        />

        <AudioTranscriber
          onTranscribed={(text) => handleSend(text)}
          buttonLabel="Voice Input (Transcribe)"
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || !inputQuery.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2.5 rounded-lg transition disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Live Voice-to-Voice Modal */}
      <LiveVoiceSession
        isOpen={isLiveOpen}
        onClose={() => setIsLiveOpen(false)}
        district={currentDistrict}
        state={currentState}
      />
    </div>
  );
};
