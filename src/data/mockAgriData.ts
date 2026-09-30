import { StateDistrictProfile, SupportedLanguage } from '../types';

export const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'English', label: 'English', native: 'English' },
  { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'Marathi', label: 'Marathi', native: 'मराठी' },
  { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  { code: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { code: 'Punjabi', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'Bengali', label: 'Bengali', native: 'বাংলা' },
  { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  English: {
    appTitle: 'KrishiSetu AI',
    tagline: 'Interoperable Digital Agriculture Network & Inter-State Cooperation Grid',
    dpgBadge: 'Digital Public Good (DPG)',
    tabAdvisory: 'Agro-Advisory & Telemetry',
    tabDiagnostic: 'Crop Disease Vision AI',
    tabRegenerative: 'Regenerative Planner',
    tabCooperation: 'Inter-State Cooperation Grid',
    tabVoice: 'Kisan Voice Assistant',
    stateSelector: 'Select State & Agro-District',
    currentSeason: 'Current Season',
    listenAudio: 'Listen to Voice Advisory',
    playingAudio: 'Playing Advisory...',
    diagnoseButton: 'Analyze Leaf with Gemini Vision',
    diagnosing: 'Diagnosing Pathology...',
    generateAdvisory: 'Generate AI Advisory',
    generating: 'Synthesizing Satellite & Soil Data...',
    soilCardTitle: 'Soil Health Card & Chemical Analytics',
    satelliteTitle: 'ISRO Bhuvan & Sentinel Satellite Telemetry',
    weatherTitle: 'IMD Agromet 5-Day Weather Forecast',
    coopNetworkTitle: 'Federal Agri-Cooperative Data Exchange (Krishi-DPG)',
    activeAgreements: 'Active Inter-State Compacts',
  },
  Hindi: {
    appTitle: 'कृषिसेतु AI',
    tagline: 'डिजिटल कृषि नेटवर्क एवं अंतर-राज्यीय सहयोग ग्रिड',
    dpgBadge: 'डिजिटल पब्लिक गुड (DPG)',
    tabAdvisory: 'सटीक कृषि परामर्श एवं उपग्रह डेटा',
    tabDiagnostic: 'फसल रोग जांच (कंप्यूटर विज़न)',
    tabRegenerative: 'पुनर्योजी खेती योजना',
    tabCooperation: 'अंतर-राज्यीय सहयोग ग्रिड',
    tabVoice: 'किसान आवाज़ सहायक',
    stateSelector: 'राज्य एवं कृषि जिला चुनें',
    currentSeason: 'वर्तमान कृषि मौसम',
    listenAudio: 'बोलकर सुनें (आवाज़)',
    playingAudio: 'परामर्श सुनाया जा रहा है...',
    diagnoseButton: 'जेमिनी विज़न द्वारा रोग जांचें',
    diagnosing: 'रोग का विश्लेषण जारी...',
    generateAdvisory: 'एआई परामर्श प्राप्त करें',
    generating: 'उपग्रह एवं मृदा डेटा संकलन...',
    soilCardTitle: 'मृदा स्वास्थ्य कार्ड (Soil Health Card)',
    satelliteTitle: 'इसरो भुवन एवं उपग्रह सूचकांक (NDVI)',
    weatherTitle: 'मौसम विभाग (IMD) 5-दिवसीय पूर्वानुमान',
    coopNetworkTitle: 'अंतर-राज्यीय कृषि सहयोग डेटा नेटवर्क',
    activeAgreements: 'सक्रिय अंतर-राज्यीय समझौते',
  },
  Marathi: {
    appTitle: 'कृषीसेतू AI',
    tagline: 'आंतर-राज्य कृषी सहकार्य आणि डिजिटल सार्वजनिक पायाभूत सुविधा',
    dpgBadge: 'डिजिटल पब्लिक गुड',
    tabAdvisory: 'रिअल-टाइम कृषी सल्ला',
    tabDiagnostic: 'पीक रोग निदान AI',
    tabRegenerative: 'पुनरुत्पादक शेती आराखडा',
    tabCooperation: 'राज्य सहकार्य ग्रिड',
    tabVoice: 'शेतकरी व्हॉइस सहाय्यक',
    stateSelector: 'राज्य आणि जिल्हा निवडा',
    currentSeason: 'हंगाम',
    listenAudio: 'सल्ला ऐका',
    playingAudio: 'सल्ला सुरू आहे...',
    diagnoseButton: 'रोगाचे निदान करा',
    diagnosing: 'तपासणी सुरू आहे...',
    generateAdvisory: 'AI सल्ला मिळवा',
    generating: 'माहिती गोळा केली जात आहे...',
    soilCardTitle: 'मृदा आरोग्य पत्रिका',
    satelliteTitle: 'उपग्रह निर्देशांक (NDVI)',
    weatherTitle: 'हवामान अंदाज',
    coopNetworkTitle: 'आंतर-राज्य कृषी सहकार्य मंच',
    activeAgreements: 'सक्रिय करार',
  },
  Telugu: {
    appTitle: 'కృషిసేతు AI',
    tagline: 'అంతర్రాష్ట్ర వ్యవసాయ సహకార నెట్వర్క్',
    dpgBadge: 'డిజిటల్ పబ్లిక్ గుడ్',
    tabAdvisory: 'వ్యవసాయ సలహాలు',
    tabDiagnostic: 'పంట వ్యాధి నిర్ధారణ AI',
    tabRegenerative: 'ప్రకృతి వ్యవసాయ ప్రణాళిక',
    tabCooperation: 'రాష్ట్రాల సహకార గ్రిడ్',
    tabVoice: 'రైతు వాయిస్ అసిస్టెంట్',
    stateSelector: 'రాష్ట్రం & జిల్లా ఎంచుకోండి',
    currentSeason: 'ప్రస్తుత సీజన్',
    listenAudio: 'సలహా వినండి',
    playingAudio: 'ప్లే అవుతోంది...',
    diagnoseButton: 'వ్యాధిని గుర్తించండి',
    diagnosing: 'పరిశీలిస్తోంది...',
    generateAdvisory: 'AI సలహా పొందండి',
    generating: 'డేటా విశ్లేషిస్తోంది...',
    soilCardTitle: 'భూసార పరీక్ష పత్రం',
    satelliteTitle: 'శాటిలైట్ డేటా (NDVI)',
    weatherTitle: 'వాతావరణ సూచన',
    coopNetworkTitle: 'అంతర్రాష్ట్ర సహకార నెట్వర్క్',
    activeAgreements: 'క్రియాశీల ఒప్పందాలు',
  },
  Tamil: {
    appTitle: 'கிருஷிசேது AI',
    tagline: 'மாநிலங்களுக்கு இடையேயான விவசாய ஒத்துழைப்பு வலைப்பின்னல்',
    dpgBadge: 'டிஜிட்டல் பொது நலம்',
    tabAdvisory: 'விவசாய ஆலோசனை',
    tabDiagnostic: 'பயிர் நோய் கண்டறிதல் AI',
    tabRegenerative: 'இயற்கை வேளாண்மை திட்டம்',
    tabCooperation: 'மாநில கூட்டு கட்டமைப்பு',
    tabVoice: 'விவசாயி குரல் உதவியாளர்',
    stateSelector: 'மாநிலம் & மாவட்டம்',
    currentSeason: 'பருவம்',
    listenAudio: 'குரல் ஆலோசனையை கேளுங்கள்',
    playingAudio: 'ஒலிக்கிறது...',
    diagnoseButton: 'நோயை கண்டறிக',
    diagnosing: 'பரிசோதிக்கிறது...',
    generateAdvisory: 'AI ஆலோசனை பெறுக',
    generating: 'தரவு பகுப்பாய்வு...',
    soilCardTitle: 'மண் வள அட்டை',
    satelliteTitle: 'செயற்கைக்கோள் குறியீடு',
    weatherTitle: 'வானிலை அறிக்கை',
    coopNetworkTitle: 'கூட்டுறவு தகவல் பரிமாற்றம்',
    activeAgreements: 'செயலில் உள்ள ஒப்பந்தங்கள்',
  },
  Punjabi: {
    appTitle: 'ਕ੍ਰਿਸ਼ੀਸੇਤੂ AI',
    tagline: 'ਅੰਤਰ-ਰਾਜੀ ਖੇਤੀਬਾੜੀ ਸਹਿਯੋਗ ਅਤੇ ਡਿਜੀਟਲ ਨੈੱਟਵਰਕ',
    dpgBadge: 'ਡਿਜੀਟਲ ਪਬਲਿਕ ਗੁੱਡ',
    tabAdvisory: 'ਖੇਤੀ ਸਲਾਹਕਾਰੀ ਅਤੇ ਸੈਟੇਲਾਈਟ ਡੇਟਾ',
    tabDiagnostic: 'ਫ਼ਸਲ ਬਿਮਾਰੀ ਜਾਂਚ AI',
    tabRegenerative: 'ਕੁਦਰਤੀ ਖੇਤੀ ਯੋਜਨਾ',
    tabCooperation: 'ਅੰਤਰ-ਰਾਜੀ ਸਹਿਯੋਗ ਗਰਿੱਡ',
    tabVoice: 'ਕਿਸਾਨ ਆਵਾਜ਼ ਸਹਾਇਕ',
    stateSelector: 'ਰਾਜ ਅਤੇ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
    currentSeason: 'ਮੌਜੂਦਾ ਸੀਜ਼ਨ',
    listenAudio: 'ਆਵਾਜ਼ ਸੁਣੋ',
    playingAudio: 'ਸੁਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...',
    diagnoseButton: 'ਬਿਮਾਰੀ ਦੀ ਜਾਂਚ ਕਰੋ',
    diagnosing: 'ਜਾਂਚ ਜਾਰੀ ਹੈ...',
    generateAdvisory: 'AI ਸਲਾਹ ਲਓ',
    generating: 'ਡੇਟਾ ਇਕੱਠਾ ਹੋ ਰਿਹਾ ਹੈ...',
    soilCardTitle: 'ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ',
    satelliteTitle: 'ਸੈਟੇਲਾਈਟ NDVI ਡੇਟਾ',
    weatherTitle: 'ਮੌਸਮ ਪੂਰਵ ਅਨੁਮਾਨ',
    coopNetworkTitle: 'ਅੰਤਰ-ਰਾਜੀ ਖੇਤੀ ਸਹਿਯੋਗ',
    activeAgreements: 'ਸਰਗਰਮ ਸਮਝੌਤੇ',
  },
  Bengali: {
    appTitle: 'কৃষি সেতু AI',
    tagline: 'আন্তঃরাজ্য কৃষি সহযোগিতা ও ডিজিটাল নেটওয়ার্ক',
    dpgBadge: 'ডিজিটাল পাবলিক গুড',
    tabAdvisory: 'কৃষি পরামর্শ ও উপগ্রহ বিশ্লেষণ',
    tabDiagnostic: 'ফসলের রোগ নির্ণয় AI',
    tabRegenerative: 'পুনরুজ্জীবিত কৃষি পরিকল্পনা',
    tabCooperation: 'আন্তঃরাজ্য সহযোগিতা গ্রিড',
    tabVoice: 'কৃষক ভয়েস সহকারী',
    stateSelector: 'রাজ্য ও জেলা নির্বাচন',
    currentSeason: 'বর্তমান মরসুম',
    listenAudio: 'পরামর্শ শুনুন',
    playingAudio: 'চালানো হচ্ছে...',
    diagnoseButton: 'রোগ বিশ্লেষণ করুন',
    diagnosing: 'বিশ্লেষণ চলছে...',
    generateAdvisory: 'AI পরামর্শ নিন',
    generating: 'তথ্য সংগ্রহ করা হচ্ছে...',
    soilCardTitle: 'মৃত্তিকা স্বাস্থ্য কার্ড',
    satelliteTitle: 'স্যাটেলাইট সূচক (NDVI)',
    weatherTitle: 'আবহাওয়া পূর্বাভাস',
    coopNetworkTitle: 'আন্তঃরাজ্য ডেটা বিনিময়',
    activeAgreements: 'সক্রিয় চুক্তি',
  },
  Kannada: {
    appTitle: 'ಕೃಷಿಸೇತು AI',
    tagline: 'ಅಂತರ-ರಾಜ್ಯ ಕೃಷಿ ಸಹಕಾರ ಡಿಜಿಟಲ್ ಜಾಲ',
    dpgBadge: 'ಡಿಜಿಟಲ್ ಪಬ್ಲಿಕ್ ಗುಡ್',
    tabAdvisory: 'ಕೃಷಿ ಸಲಹೆ ಮತ್ತು ಉಪಗ್ರಹ ಡೇಟಾ',
    tabDiagnostic: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ AI',
    tabRegenerative: 'ನೈಸರ್ಗಿಕ ಕೃಷಿ ಯೋಜನೆ',
    tabCooperation: 'ರಾಜ್ಯಗಳ ಸಹಕಾರ ಗ್ರಿಡ್',
    tabVoice: 'ರೈತ ವಾಯ್ಸ್ ಸಹಾಯಕ',
    stateSelector: 'ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ',
    currentSeason: 'ಪ್ರಸ್ತುತ ಹಂಗಾಮು',
    listenAudio: 'ಸಲಹೆ ಆಲಿಸಿ',
    playingAudio: 'ಪ್ಲೇ ಆಗುತ್ತಿದೆ...',
    diagnoseButton: 'ರೋಗ ಪರಿಶೀಲಿಸಿ',
    diagnosing: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    generateAdvisory: 'AI ಸಲಹೆ ಪಡೆಯಿರಿ',
    generating: 'ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ...',
    soilCardTitle: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಪತ್ರಿಕೆ',
    satelliteTitle: 'ಉಪಗ್ರಹ ಸೂಚ್ಯಂಕ (NDVI)',
    weatherTitle: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    coopNetworkTitle: 'ಅಂತರ-ರಾಜ್ಯ ಸಹಕಾರ ಜಾಲ',
    activeAgreements: 'ಸಕ್ರಿಯ ಒಪ್ಪಂದಗಳು',
  },
};

export const STATE_DISTRICT_PROFILES: StateDistrictProfile[] = [
  {
    id: 'punjab-ludhiana',
    state: 'Punjab',
    district: 'Ludhiana',
    agroClimaticZone: 'Trans-Gangetic Plain Region',
    majorCrops: ['Wheat (PBW 826)', 'Paddy (PR 126)', 'Maize', 'Mustard'],
    currentSeason: 'Rabi',
    soilProfile: {
      n: 145, // Deficient in Nitrogen due to intensive cropping
      p: 28,  // Medium
      k: 185, // Medium-Low
      ph: 7.8,
      organicCarbon: 0.38, // Low organic carbon
      ec: 0.42,
      moisture: 32,
      zinc: 0.55, // Deficient
      sulfur: 8.2, // Deficient
    },
    satelliteTelemetry: {
      ndvi: 0.71,
      ndre: 0.62,
      ndwi: 0.24,
      lst: 24.2,
      vegetationConditionIndex: 82,
    },
    weatherForecast: {
      tempMax: 27,
      tempMin: 14,
      rainProb: 15,
      expectedRain: 0,
      humidity: 58,
      windSpeed: 8,
      condition: 'Clear with mild westerly breeze',
    },
    mandiPrice: {
      crop: 'Wheat',
      msp: 2275,
      currentModalPrice: 2340,
      trend: 'up',
    },
  },
  {
    id: 'maharashtra-akola',
    state: 'Maharashtra',
    district: 'Akola (Vidarbha)',
    agroClimaticZone: 'Western Plateau & Hills (Central Deccan)',
    majorCrops: ['Cotton (BT)', 'Soybean (JS 335)', 'Pigeonpea (Tur)', 'Gram'],
    currentSeason: 'Rabi',
    soilProfile: {
      n: 180,
      p: 14,
      k: 310, // Rich in Potassium typical of black vertisols
      ph: 8.1, // Calcareous black soil
      organicCarbon: 0.46,
      ec: 0.55,
      moisture: 24, // Moisture deficit
      zinc: 0.62,
      sulfur: 9.8,
    },
    satelliteTelemetry: {
      ndvi: 0.49,
      ndre: 0.41,
      ndwi: -0.08, // Water stress detected
      lst: 33.5,
      vegetationConditionIndex: 58,
    },
    weatherForecast: {
      tempMax: 35,
      tempMin: 19,
      rainProb: 5,
      expectedRain: 0,
      humidity: 38,
      windSpeed: 12,
      condition: 'Dry & warm afternoon heat spike',
    },
    mandiPrice: {
      crop: 'Cotton (Medium Staple)',
      msp: 7121,
      currentModalPrice: 6980,
      trend: 'stable',
    },
  },
  {
    id: 'andhra-guntur',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    agroClimaticZone: 'East Coast Plains & Hills',
    majorCrops: ['Chilli (Teja)', 'Cotton', 'Paddy', 'Tobacco', 'Black Gram'],
    currentSeason: 'Rabi',
    soilProfile: {
      n: 210,
      p: 35,
      k: 260,
      ph: 7.2,
      organicCarbon: 0.58,
      ec: 0.82,
      moisture: 42,
      zinc: 0.88,
      sulfur: 14.5,
    },
    satelliteTelemetry: {
      ndvi: 0.65,
      ndre: 0.58,
      ndwi: 0.18,
      lst: 31.0,
      vegetationConditionIndex: 76,
    },
    weatherForecast: {
      tempMax: 34,
      tempMin: 22,
      rainProb: 25,
      expectedRain: 4,
      humidity: 74,
      windSpeed: 14,
      condition: 'Coastal humid, thrips proliferation risk',
    },
    mandiPrice: {
      crop: 'Chilli (Teja Dry)',
      msp: 0, // Commercial crop
      currentModalPrice: 19500,
      trend: 'up',
    },
  },
  {
    id: 'up-varanasi',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    agroClimaticZone: 'Middle Gangetic Plain',
    majorCrops: ['Rice (Swarna)', 'Wheat (HD 2967)', 'Mustard', 'Vegetables (Peas)'],
    currentSeason: 'Rabi',
    soilProfile: {
      n: 160,
      p: 19,
      k: 210,
      ph: 7.4,
      organicCarbon: 0.44,
      ec: 0.48,
      moisture: 38,
      zinc: 0.52,
      sulfur: 11.0,
    },
    satelliteTelemetry: {
      ndvi: 0.68,
      ndre: 0.59,
      ndwi: 0.22,
      lst: 26.8,
      vegetationConditionIndex: 79,
    },
    weatherForecast: {
      tempMax: 29,
      tempMin: 16,
      rainProb: 10,
      expectedRain: 0,
      humidity: 62,
      windSpeed: 7,
      condition: 'Pleasant winter sunshine',
    },
    mandiPrice: {
      crop: 'Mustard Seed',
      msp: 5650,
      currentModalPrice: 5820,
      trend: 'up',
    },
  },
  {
    id: 'karnataka-belagavi',
    state: 'Karnataka',
    district: 'Belagavi',
    agroClimaticZone: 'Southern Plateau & Northern Transition Zone',
    majorCrops: ['Sugarcane (Co 86032)', 'Maize', 'Soybean', 'Jowar'],
    currentSeason: 'Rabi',
    soilProfile: {
      n: 195,
      p: 22,
      k: 290,
      ph: 7.6,
      organicCarbon: 0.52,
      ec: 0.61,
      moisture: 36,
      zinc: 0.74,
      sulfur: 13.0,
    },
    satelliteTelemetry: {
      ndvi: 0.74,
      ndre: 0.66,
      ndwi: 0.31,
      lst: 28.5,
      vegetationConditionIndex: 85,
    },
    weatherForecast: {
      tempMax: 31,
      tempMin: 17,
      rainProb: 15,
      expectedRain: 1,
      humidity: 52,
      windSpeed: 10,
      condition: 'Partly cloudy, dry winds',
    },
    mandiPrice: {
      crop: 'Maize',
      msp: 2090,
      currentModalPrice: 2220,
      trend: 'stable',
    },
  },
  {
    id: 'wb-bardhaman',
    state: 'West Bengal',
    district: 'Purba Bardhaman',
    agroClimaticZone: 'Lower Gangetic Plain (Rice Bowl)',
    majorCrops: ['Boro Rice (IR 36)', 'Potato (Jyoti)', 'Jute', 'Mustard'],
    currentSeason: 'Rabi',
    soilProfile: {
      n: 225,
      p: 31,
      k: 195,
      ph: 6.4, // Slightly acidic alluvial soil
      organicCarbon: 0.68,
      ec: 0.39,
      moisture: 48,
      zinc: 0.81,
      sulfur: 16.2,
    },
    satelliteTelemetry: {
      ndvi: 0.78,
      ndre: 0.70,
      ndwi: 0.39,
      lst: 27.1,
      vegetationConditionIndex: 88,
    },
    weatherForecast: {
      tempMax: 30,
      tempMin: 18,
      rainProb: 30,
      expectedRain: 6,
      humidity: 78,
      windSpeed: 9,
      condition: 'Humid with chance of evening shower',
    },
    mandiPrice: {
      crop: 'Potato (Table)',
      msp: 0,
      currentModalPrice: 1120,
      trend: 'stable',
    },
  },
  {
    id: 'mp-sehore',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    agroClimaticZone: 'Central Plateau (Malwa Region)',
    majorCrops: ['Sharbati Wheat', 'Soybean', 'Chickpea (Chana)', 'Lentil'],
    currentSeason: 'Rabi',
    soilProfile: {
      n: 170,
      p: 16,
      k: 280,
      ph: 7.7,
      organicCarbon: 0.41,
      ec: 0.50,
      moisture: 30,
      zinc: 0.58,
      sulfur: 9.1,
    },
    satelliteTelemetry: {
      ndvi: 0.63,
      ndre: 0.55,
      ndwi: 0.12,
      lst: 29.8,
      vegetationConditionIndex: 72,
    },
    weatherForecast: {
      tempMax: 31,
      tempMin: 15,
      rainProb: 0,
      expectedRain: 0,
      humidity: 44,
      windSpeed: 8,
      condition: 'Clear sunny sky, dry atmosphere',
    },
    mandiPrice: {
      crop: 'Wheat (Sharbati)',
      msp: 2275,
      currentModalPrice: 3100, // Premium quality
      trend: 'up',
    },
  },
];

// Helper to generate SVG visual specimen images for disease test cases
const createSpecimenSvg = (title: string, color: string, spotColor: string, pattern: 'spots' | 'stripes' | 'curls' | 'blight'): string => {
  let innerElements = '';
  if (pattern === 'spots') {
    innerElements = `
      <circle cx="120" cy="110" r="16" fill="${spotColor}" opacity="0.85" />
      <circle cx="120" cy="110" r="8" fill="#1e293b" />
      <circle cx="170" cy="160" r="22" fill="${spotColor}" opacity="0.9" />
      <circle cx="170" cy="160" r="12" fill="#1e293b" />
      <circle cx="90" cy="210" r="18" fill="${spotColor}" opacity="0.85" />
      <circle cx="140" cy="260" r="25" fill="${spotColor}" opacity="0.85" />
      <circle cx="140" cy="260" r="14" fill="#3f1a04" />
    `;
  } else if (pattern === 'stripes') {
    innerElements = `
      <line x1="110" y1="60" x2="110" y2="340" stroke="${spotColor}" stroke-width="8" stroke-dasharray="12,6" />
      <line x1="130" y1="50" x2="130" y2="350" stroke="${spotColor}" stroke-width="10" stroke-dasharray="16,4" />
      <line x1="150" y1="70" x2="150" y2="330" stroke="${spotColor}" stroke-width="7" stroke-dasharray="8,8" />
    `;
  } else if (pattern === 'curls') {
    innerElements = `
      <path d="M 80 150 Q 150 110 200 170 T 110 290" fill="none" stroke="${spotColor}" stroke-width="12" stroke-linecap="round" />
      <path d="M 120 100 Q 180 180 140 240" fill="none" stroke="#f59e0b" stroke-width="6" />
      <circle cx="150" cy="170" r="14" fill="#ef4444" opacity="0.8" />
    `;
  } else {
    innerElements = `
      <path d="M 60 180 C 100 120, 180 140, 220 200 C 190 280, 90 300, 60 180 Z" fill="${spotColor}" opacity="0.75" />
      <path d="M 90 200 C 120 160, 170 170, 190 220 C 170 260, 110 270, 90 200 Z" fill="#2d1600" opacity="0.9" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4ade80" />
        <stop offset="50%" stop-color="${color}" />
        <stop offset="100%" stop-color="#14532d" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="#0f172a" rx="16"/>
    <!-- Leaf base shape -->
    <path d="M 150 30 C 240 100, 260 230, 150 285 C 40 230, 60 100, 150 30 Z" fill="url(#leafGrad)" stroke="#166534" stroke-width="4"/>
    <!-- Main stem -->
    <line x1="150" y1="35" x2="150" y2="280" stroke="#14532d" stroke-width="5"/>
    <!-- Leaf veins -->
    <line x1="150" y1="90" x2="210" y2="130" stroke="#166534" stroke-width="2.5"/>
    <line x1="150" y1="90" x2="90" y2="130" stroke="#166534" stroke-width="2.5"/>
    <line x1="150" y1="160" x2="225" y2="195" stroke="#166534" stroke-width="2.5"/>
    <line x1="150" y1="160" x2="75" y2="195" stroke="#166534" stroke-width="2.5"/>
    <line x1="150" y1="220" x2="200" y2="245" stroke="#166534" stroke-width="2"/>
    <line x1="150" y1="220" x2="100" y2="245" stroke="#166534" stroke-width="2"/>
    <!-- Pathological lesions -->
    ${innerElements}
    <!-- Badge -->
    <rect x="15" y="15" width="130" height="26" rx="6" fill="#020617" opacity="0.85" />
    <text x="25" y="32" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">${title}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export interface PathologySpecimen {
  id: string;
  crop: string;
  name: string;
  vernacular: string;
  defaultSymptoms: string;
  state: string;
  district: string;
  previewUrl: string;
  severity: 'High' | 'Moderate';
}

export const PRESET_SPECIMENS: PathologySpecimen[] = [
  {
    id: 'wheat-yellow-rust',
    crop: 'Wheat',
    name: 'Wheat Stripe / Yellow Rust (Puccinia striiformis)',
    vernacular: 'पीला रतुआ / ਪੀਲੀ ਕੁੰਗੀ (Peeli Kungi)',
    defaultSymptoms: 'Parallel yellow-orange powdery pustules along leaf veins. Rapid leaf drying and shriveling.',
    state: 'Punjab',
    district: 'Ludhiana',
    previewUrl: createSpecimenSvg('Wheat Stripe Rust', '#15803d', '#eab308', 'stripes'),
    severity: 'High',
  },
  {
    id: 'rice-blast',
    crop: 'Paddy / Rice',
    name: 'Rice Leaf Blast (Magnaporthe oryzae)',
    vernacular: 'धान का झुलसा रोग / ব্লাস্ট রোগ (Blast Rog)',
    defaultSymptoms: 'Spindle-shaped / diamond-shaped lesions with grayish necrotic centers and reddish-brown borders.',
    state: 'West Bengal',
    district: 'Purba Bardhaman',
    previewUrl: createSpecimenSvg('Rice Leaf Blast', '#166534', '#78350f', 'blight'),
    severity: 'High',
  },
  {
    id: 'cotton-leaf-curl',
    crop: 'Cotton',
    name: 'Cotton Leaf Curl Virus (CLCuV) & Whitefly',
    vernacular: 'कपास का पत्ता मरोड़ रोग / पानांचा चुरडा (Churda)',
    defaultSymptoms: 'Upward/downward curling of leaves, vein thickening, enation under leaf surface, stunted boll growth.',
    state: 'Maharashtra',
    district: 'Akola',
    previewUrl: createSpecimenSvg('Cotton Leaf Curl', '#15803d', '#dc2626', 'curls'),
    severity: 'High',
  },
  {
    id: 'tomato-early-blight',
    crop: 'Tomato',
    name: 'Early Blight (Alternaria solani)',
    vernacular: 'अगेती झुलसा / టమాటా ముందస్తు తెగులు',
    defaultSymptoms: 'Concentric ring "target-board" dark brown circular spots surrounded by yellow chlorotic halo.',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    previewUrl: createSpecimenSvg('Tomato Early Blight', '#166534', '#451a03', 'spots'),
    severity: 'Moderate',
  },
];

export interface InterStateCompact {
  id: string;
  sourceState: string;
  partnerState: string;
  corridorName: string;
  challengeCategory: string;
  status: 'Active' | 'Pioneering' | 'Expanding';
  keyIntervention: string;
  sharedDataFeed: string;
  economicOrClimateImpact: string;
}

export const ACTIVE_INTER_STATE_COMPACTS: InterStateCompact[] = [
  {
    id: 'punjab-haryana-delhi',
    sourceState: 'Punjab',
    partnerState: 'Haryana & Delhi NCR',
    corridorName: 'North Agri-Air Quality Circularity Corridor',
    challengeCategory: 'Paddy Straw (Parali) Stubble Management & Bio-Pellet Logistics',
    status: 'Active',
    keyIntervention: 'Ex-situ residue procurement via FPOs connected to NCR thermal power co-firing plants; in-situ PUSA bio-decomposer telemetry tracking.',
    sharedDataFeed: 'ISRO Bhuvan Thermal Fire-Count API & Mandi Straw Depot ERP',
    economicOrClimateImpact: '9.4M tonnes straw redirected; ₹420 Cr direct farmer income; 38% reduction in winter smog index.',
  },
  {
    id: 'maha-karnataka-basin',
    sourceState: 'Maharashtra',
    partnerState: 'Karnataka',
    corridorName: 'Krishna-Bhima River Basin Shared Agromet Grid',
    challengeCategory: 'Drought Resilience & Cross-Border Canal Micro-Allocation',
    status: 'Active',
    keyIntervention: 'Shared ultrasonic canal discharge telemetry and joint solar drip-irrigation rationing during dry spells in Sangli, Solapur & Belagavi.',
    sharedDataFeed: 'Central Water Commission (CWC) Reservoir Gauge Sync & Sentinel Soil Moisture',
    economicOrClimateImpact: '1.2M smallholders protected against sugarcane and jowar crop wilting; 34% water wastage eliminated.',
  },
  {
    id: 'ap-telangana-spices',
    sourceState: 'Andhra Pradesh',
    partnerState: 'Telangana',
    corridorName: 'Guntur-Warangal Chilli & Spice Pest Migration Radar',
    challengeCategory: 'Invasive Black Thrips (Thrips parvispinus) Early Warning Grid',
    status: 'Active',
    keyIntervention: 'Cross-border yellow sticky trap image sensors and predatory mite (Amblyseius) biological control distribution.',
    sharedDataFeed: 'ICAR-IIHR Pest Vector Telemetry & Spore Migration Doppler Wind Vector',
    economicOrClimateImpact: 'Prevented ₹680 Cr crop loss in export-quality Teja chillies across 14 adjoining border mandals.',
  },
  {
    id: 'odisha-wb-coastal',
    sourceState: 'Odisha',
    partnerState: 'West Bengal',
    corridorName: 'Bay of Bengal Saline & Cyclone Resilient Seed Vault',
    challengeCategory: 'Sea Surge, Soil Salinization & Flash Flood Defense',
    status: 'Expanding',
    keyIntervention: 'Mutual seed multiplier grid for submergence-tolerant rice (Swarna-Sub1) and halophyte salt-tolerant grains (CR Dhan 407).',
    sharedDataFeed: 'National Seed Grid (SATHI) Blockchain Ledger & INCOIS Cyclone Surge Alert',
    economicOrClimateImpact: 'Resilience for 450,000 coastal delta farmers; zero famine-induced replanting debt after cyclonic surges.',
  },
  {
    id: 'mp-rajasthan-millets',
    sourceState: 'Madhya Pradesh',
    partnerState: 'Rajasthan',
    corridorName: 'Malwa-Chambal Shree Anna (Millets) & Carbon Farming Grid',
    challengeCategory: 'Groundwater Depletion & Soil Organic Carbon Depletion',
    status: 'Pioneering',
    keyIntervention: 'Cooperative FPO aggregation of Bajra, Jowar and Kodo millets with decentralized biochar pyrolysis and joint carbon credit certification.',
    sharedDataFeed: 'AgriStack Unified Farmer Registry & Verra-aligned Soil Carbon Sat-Index',
    economicOrClimateImpact: '180,000 acres converted to regenerative Shree Anna; ₹3,800/acre carbon and water-saving dividend.',
  },
];

export const DISTRICT_CLIMATE_ALERTS: Record<string, import('../types').ClimateEventAlert> = {
  'maharashtra-akola': {
    id: 'alert-akola-heatwave',
    districtId: 'maharashtra-akola',
    eventType: 'Heatwave',
    severity: 'Critical',
    headline: 'Severe Heatwave & High Thermal Stress Warning (+5.4°C Spike)',
    vernacularHeadline: {
      English: 'Severe Heatwave & High Thermal Stress Warning (+5.4°C Spike)',
      Hindi: 'तीव्र लू एवं अत्यधिक ताप तनाव चेतावनी (+5.4°C वृद्धि)',
      Marathi: 'तीव्र उष्णतेची लाट आणि पिकांवर उष्णतेचा ताण इशारा',
      Telugu: 'తీవ్రమైన వడగాల్పులు మరియు ఉష్ణ ఒత్తిడి హెచ్చరిక',
      Punjabi: 'ਗੰਭੀਰ ਲੂ ਅਤੇ ਗਰਮੀ ਦੇ ਤਣਾਅ ਦੀ ਚਿਤਾਵਨੀ',
    },
    onsetForecast: 'Next 24 to 48 Hours',
    duration: 'Active for 3 Days',
    vulnerableCrops: ['Cotton (Late Boll / Flowering)', 'Late-sown Wheat (Grain Filling)', 'Pigeonpea (Tur)'],
    temperatureOrRainStat: '36.8°C Peak (Anomaly +5.4°C), RH 32%',
    impactAnalysis: 'Severe evapotranspiration risk causing premature wheat grain shriveling (forced maturity) and cotton square/boll drop.',
    immediateProtectiveMeasures: [
      'Apply foliar spray of Potassium Nitrate (13:0:45) @ 1% (10g/L water) or Salicylic Acid (100 ppm) in late evening to induce thermo-tolerance.',
      'Operate micro-sprinklers or drip systems during night or early morning hours (4 AM–7 AM) to cool root zones.',
      'Spread 2 to 3-inch dry biomass / straw mulch across crop rows to arrest soil moisture vapor loss.',
    ],
    recommendedSprayOrDrainage: 'Foliar Potassium Nitrate (13-0-45) @ 10g/L + Evening Micro-Drip',
    spokenAudioWarning: 'Alert for Akola district farmers: Severe heatwave of 36.8 degrees Celsius is forecast for the next 48 hours. Please do not irrigate in midday sun. Spray 1% Potassium Nitrate in the evening and apply straw mulching to shield grain filling.',
  },
  'wb-bardhaman': {
    id: 'alert-wb-unseasonal-rain',
    districtId: 'wb-bardhaman',
    eventType: 'Unseasonal Rain',
    severity: 'Critical',
    headline: "Nor'wester (কালবৈশাখী) Cloudburst & Waterlogging Threat",
    vernacularHeadline: {
      English: "Nor'wester (Kalbaishakhi) Cloudburst & Waterlogging Threat",
      Bengali: 'কালবৈশাখী ঝড় ও আকস্মিক ভারী বৃষ্টিপাতের লাল সতর্কতা',
      Hindi: 'असामयिक मूसलाधार वर्षा एवं जलभराव की गंभीर चेतावनी',
    },
    onsetForecast: 'Commencing Tonight at 21:00 hrs',
    duration: 'Heavy squalls for 18 Hours',
    vulnerableCrops: ['Boro Rice (Nursery & Tillering)', 'Potato (Harvest Ready)', 'Mustard'],
    temperatureOrRainStat: '48 mm Precipitation Expected, Wind Gusts 54 km/h',
    impactAnalysis: 'Sudden field inundation will induce tuber rot in unharvested potatoes and fungal blast in Boro rice nurseries.',
    immediateProtectiveMeasures: [
      'Dig trench drainage outlets at lowest corners of potato and vegetable fields immediately.',
      'Rush harvesting of mature potato tubers; move produce to elevated sheds covered with tarpaulin.',
      'Hold all chemical urea/DAP top-dressing to prevent nutrient leaching into waterways.',
    ],
    recommendedSprayOrDrainage: 'Trench Drainage Cuts + Prophylactic Trichoderma spray once rain halts',
    spokenAudioWarning: 'Warning for Purba Bardhaman farmers: Heavy Norwester showers of 48 mm with high winds are expected tonight. Immediately clear field drainage channels and move harvested potatoes to dry covered storage.',
  },
  'punjab-ludhiana': {
    id: 'alert-punjab-frost-fog',
    districtId: 'punjab-ludhiana',
    eventType: 'Cold Wave / Frost',
    severity: 'Warning',
    headline: 'Dense Western Disturbance Fog & Frost Alert (Yellow Rust Vector Window)',
    vernacularHeadline: {
      English: 'Dense Western Disturbance Fog & Frost Alert',
      Punjabi: 'ਸੰਘਣੀ ਧੁੰਦ, ਕੋਰਾ ਅਤੇ ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਗੰਭੀਰ ਖ਼ਤਰਾ',
      Hindi: 'घने कोहरे, पाला एवं पीला रतुआ का गंभीर अलर्ट',
    },
    onsetForecast: 'Tonight 02:00 to 09:00 hrs',
    duration: 'Persisting for next 4 days',
    vulnerableCrops: ['Wheat (PBW 826 / HD 3086)', 'Mustard (Pod Stage)', 'Potato'],
    temperatureOrRainStat: 'Night Temp 6.2°C, Morning RH 95%',
    impactAnalysis: 'Prolonged leaf wetness exceeding 8 hours provides optimum incubation for Stripe Rust (Puccinia striiformis) fungal spore explosion.',
    immediateProtectiveMeasures: [
      'Provide light nocturnal irrigation to raise ground temperature by 1.5°C and protect mustard from frost damage.',
      'Scout fields daily for parallel yellow pustules; spray Propiconazole (Tilt 25% EC) @ 1ml/L or bio-agent Trichoderma at first sign.',
      'Burn dry cow dung / residue at farm field borders to create a gentle smoke blanket against frost.',
    ],
    recommendedSprayOrDrainage: 'Nocturnal Light Irrigation + Prophylactic Bio-Fungicide',
    spokenAudioWarning: 'Alert for Ludhiana farmers: Night frost and dense fog with 95% humidity will persist. Give light night irrigation to prevent frost injury and inspect wheat for yellow rust spots.',
  },
  'andhra-guntur': {
    id: 'alert-ap-cyclone-depression',
    districtId: 'andhra-guntur',
    eventType: 'Flash Flood / Cyclone',
    severity: 'Critical',
    headline: 'Bay of Bengal Deep Depression & Coastal Squall Alert',
    vernacularHeadline: {
      English: 'Bay of Bengal Deep Depression & Coastal Squall Alert',
      Telugu: 'బంగాళాఖాతంలో వాయుగుండం మరియు తీరప్రాంత భారీ వర్షాల హెచ్చరిక',
      Hindi: 'बंगाल की खाड़ी में गहरा दबाव एवं तटीय चक्रवाती तूफान चेतावनी',
    },
    onsetForecast: 'Within 36 Hours',
    duration: '48-hour continuous squall window',
    vulnerableCrops: ['Chilli (Teja & Byadgi)', 'Cotton (Picking Stage)', 'Paddy'],
    temperatureOrRainStat: '52 mm Rain Forecast, Coastal Winds 62 km/h',
    impactAnalysis: 'High wind velocity will cause lodging in standing crops; humidity saturation will trigger bacterial leaf spot and PeCSV vectors.',
    immediateProtectiveMeasures: [
      'Provide earth mounds along Chilli ridges to prevent root lodging from violent coastal gusts.',
      'Do not apply foliar sprays or chemical fertilizers until squall clears.',
      'Shift harvested dry chillies from drying yards to elevated FPO warehouse chambers immediately.',
    ],
    recommendedSprayOrDrainage: 'Ridge Reinforcement + Post-Squall Copper Oxychloride 50 WP (3g/L)',
    spokenAudioWarning: 'Urgent warning for Guntur district farmers: A deep depression in the Bay of Bengal will bring 52 mm rainfall and 62 km/h winds within 36 hours. Secure harvested chillies indoors and reinforce ridge drainage.',
  },
  'up-varanasi': {
    id: 'alert-up-hailstorm',
    districtId: 'up-varanasi',
    eventType: 'Unseasonal Rain',
    severity: 'Warning',
    headline: 'Thunderstorm with Isolated Hailstorm Advisory',
    vernacularHeadline: {
      English: 'Thunderstorm with Isolated Hailstorm Advisory',
      Hindi: 'गरज-चमक के साथ ओलावृष्टि एवं तेज हवाओं की चेतावनी',
    },
    onsetForecast: 'Tomorrow Afternoon (14:00 - 18:00 hrs)',
    duration: 'Short 4-hour severe convective window',
    vulnerableCrops: ['Wheat (Flowering)', 'Mustard (Seed Maturity)', 'Vegetable Crops'],
    temperatureOrRainStat: 'Wind Gusts up to 45 km/h, 15 mm Rain with Hail',
    impactAnalysis: 'Hail pellet impacts will shatter mature mustard pods and snap succulent vegetable stems.',
    immediateProtectiveMeasures: [
      'Deploy anti-hail protective netting across tomato, chili, and nursery plots.',
      'Harvest mustard if pods have turned yellowish-brown to avoid 40% pod shattering loss.',
      'Avoid standing under trees during lightning and disconnect farm electric pump sets.',
    ],
    recommendedSprayOrDrainage: 'Pre-storm Harvest of Ready Pods + Anti-Hail Covering',
    spokenAudioWarning: 'Weather advisory for Varanasi farmers: Thunderstorms with isolated hail are expected tomorrow afternoon. Harvest mature mustard pods today to prevent pod shattering.',
  },
  'mp-sehore': {
    id: 'alert-mp-heatwave',
    districtId: 'mp-sehore',
    eventType: 'Heatwave',
    severity: 'Warning',
    headline: 'Malwa Plateau Heat Spike & Hot Westerly Wind Alert',
    vernacularHeadline: {
      English: 'Malwa Plateau Heat Spike & Hot Westerly Wind Alert',
      Hindi: 'मालवा क्षेत्र में अचानक तापमान वृद्धि एवं शुष्क पछुआ हवाओं का अलर्ट',
    },
    onsetForecast: 'Next 48 Hours',
    duration: 'Active 3 Days',
    vulnerableCrops: ['Sharbati Wheat (Grain Filling)', 'Chickpea (Chana)', 'Lentil'],
    temperatureOrRainStat: '34.8°C Max (+4.8°C Anomaly), Humidity 28%',
    impactAnalysis: 'Hot dry westerly winds will deplete soil moisture by 6% daily, threatening Sharbati wheat grain luster and test weight.',
    immediateProtectiveMeasures: [
      'Provide light sprinkler irrigation during calm morning hours to maintain microclimate humidity.',
      'Spray 2% Urea + 1% Potassium Chloride solution to reduce leaf transpiration.',
      'Apply straw mulching to conserve moisture in chickpea rows.',
    ],
    recommendedSprayOrDrainage: 'Morning Micro-Sprinkler + Anti-Transpirant Spray',
    spokenAudioWarning: 'Advisory for Sehore farmers: Dry westerly winds and 34.8 degrees temperature will rapidly deplete soil moisture. Give light sprinkler irrigation in the morning to protect Sharbati wheat grain quality.',
  },
  'karnataka-belagavi': {
    id: 'alert-karnataka-dryspell',
    districtId: 'karnataka-belagavi',
    eventType: 'Heatwave',
    severity: 'Watch',
    headline: 'Prolonged Dry Spell & Canal Inflow Curtailment Watch',
    vernacularHeadline: {
      English: 'Prolonged Dry Spell & Canal Inflow Curtailment Watch',
      Kannada: 'ದೀರ್ಘಕಾಲದ ಶುಷ್ಕ ವಾತಾವರಣ ಮತ್ತು ಕಾಲುವೆ ನೀರು ನಿಯಂತ್ರಣ ಎಚ್ಚರಿಕೆ',
      Hindi: 'दीर्घकालिक शुष्क मौसम एवं नहर जल आपूर्ति में कमी की सूचना',
    },
    onsetForecast: 'Upcoming 5-7 Days',
    duration: 'Next 10 Days',
    vulnerableCrops: ['Sugarcane (Grand Growth Stage)', 'Maize', 'Soybean'],
    temperatureOrRainStat: '33.5°C Max, 0 mm Rain Forecast',
    impactAnalysis: 'Declining reservoir discharge from Krishna basin will limit canal turn schedules.',
    immediateProtectiveMeasures: [
      'Shift sugarcane irrigation to alternate furrow method to stretch available water by 40%.',
      'Use trash mulching (5 tonnes/ha) in sugarcane ratoon to cut soil evaporation.',
      'Coordinate with neighboring FPO under Krishna-Bhima cooperative grid for shared borewell rotation.',
    ],
    recommendedSprayOrDrainage: 'Alternate Furrow Drip + Trash Mulching',
    spokenAudioWarning: 'Advisory for Belagavi farmers: Dry weather and reduced canal water are forecast for the next 10 days. Adopt alternate furrow irrigation and sugarcane trash mulching to save water.',
  },
};

