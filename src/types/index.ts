export type SupportedLanguage =
  | 'English'
  | 'Hindi'
  | 'Marathi'
  | 'Telugu'
  | 'Tamil'
  | 'Punjabi'
  | 'Bengali'
  | 'Kannada';

export interface SoilHealthData {
  n: number; // kg/ha
  p: number; // kg/ha
  k: number; // kg/ha
  ph: number;
  organicCarbon: number; // %
  ec: number; // dS/m
  moisture: number; // %
  zinc: number; // ppm
  sulfur: number; // ppm
}

export interface SatelliteTelemetry {
  ndvi: number; // 0 to 1
  ndre: number; // Normalized Difference Red Edge
  ndwi: number; // Moisture index
  lst: number; // Land Surface Temperature °C
  vegetationConditionIndex: number; // %
}

export interface WeatherData {
  tempMax: number;
  tempMin: number;
  rainProb: number;
  expectedRain: number; // mm
  humidity: number;
  windSpeed: number;
  condition: string;
}

export interface StateDistrictProfile {
  id: string;
  state: string;
  district: string;
  agroClimaticZone: string;
  majorCrops: string[];
  currentSeason: 'Kharif' | 'Rabi' | 'Zaid';
  soilProfile: SoilHealthData;
  satelliteTelemetry: SatelliteTelemetry;
  weatherForecast: WeatherData;
  mandiPrice: {
    crop: string;
    msp: number;
    currentModalPrice: number;
    trend: 'up' | 'stable' | 'down';
  };
}

export interface CropDiagnosticResult {
  diseaseDetected: string;
  localName: string;
  pathogenType: string;
  confidenceScore: number;
  severity: 'High' | 'Moderate' | 'Low';
  affectedParts: string;
  diagnosisDetails: string;
  immediateAction: string;
  organicBioRemedies: Array<{
    name: string;
    dosage: string;
    applicationMethod: string;
  }>;
  integratedPestManagement: Array<{
    chemicalName: string;
    dosage: string;
    waitingPeriodDays: number;
    precautions: string;
  }>;
  preventativePractices: string[];
  interStateAdvisoryAlert?: {
    isMigratoryThreat: boolean;
    vectorTransmission: string;
    borderAlertMessage: string;
  };
  farmerAudioSummary: string;
}

export interface AgroAdvisoryResult {
  headline: string;
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'Critical';
  cropGrowthStageAssessment: string;
  irrigationAdvisory: {
    action: string;
    rationale: string;
    waterSavingTips: string;
  };
  soilNutrientManagement: {
    ureaDapCorrection: string;
    micronutrientsNeeded: string[];
    organicAmendments: string;
  };
  climateResilienceAction: {
    threat: string;
    protectiveMeasure: string;
  };
  mandiMarketIntel: {
    currentMsp: string;
    estimatedLocalMandiPrice: string;
    cooperativeSellingAdvice: string;
  };
  interStateCooperationNote: string;
  spokenAdvisoryVoice: string;
}

export interface RegenerativePlanResult {
  regenerativeHealthScore: number;
  transitionTier: string;
  cropRotationCycle: Array<{
    season: string;
    primaryCrop: string;
    intercropCompanion: string;
    ecologicalBenefit: string;
  }>;
  soilRestorationStrategy: Array<{
    technique: string;
    impact: string;
    costEfficiency: string;
  }>;
  waterConservationRoadmap: {
    technique: string;
    projectedWaterSavingsPercent: number;
    groundwaterRechargeMeasure: string;
  };
  economicsAndCarbonCredits: {
    inputCostReductionPercent: number;
    projectedYieldStability: string;
    carbonCreditsEarnedTonsPerAcre: number;
    estimatedAnnualCarbonRevenue: string;
  };
  summaryInLanguage: string;
}

export interface CooperativeCompactResult {
  protocolTitle: string;
  participatingStates: string[];
  commonEcologicalChallenge: string;
  jointInterventions: Array<{
    pillar: string;
    action: string;
    digitalInfrastructure: string;
  }>;
  impactMetrics: {
    carbonReduction: string;
    farmersBenefitted: string;
    economicValueUnlocked: string;
  };
  openDataSpec: {
    standardName: string;
    telemetryShared: string[];
  };
  cooperativePledge: string;
}

export interface FertilizerInputPlan {
  crop: string;
  acreage: number;
  ureaBags: number; // 45kg bags
  dapBags: number; // 50kg bags
  mopBags: number; // 50kg bags (potash)
  zincSulfateKg: number;
  sulfurKg: number;
  organicCompostTons: number;
  jeevamrutLitres: number;
  chemicalCostTotal: number;
  regenerativeCostTotal: number;
  savingsRupees: number;
  applicationSchedule: Array<{
    stage: string;
    timing: string;
    inputs: string;
    method: string;
  }>;
}

export interface SharedEquipmentItem {
  id: string;
  name: string;
  category: 'Drone' | 'Residue Seeder' | 'Solar Cold Storage' | 'Laser Leveler';
  originState: string;
  originFpo: string;
  availableInStates: string[];
  ratePerHour: number;
  subsidyCoveredPercent: number;
  operatorProvided: boolean;
  status: 'Available' | 'Dispatched' | 'Booked';
}

export interface PestOutbreakReport {
  id: string;
  diseaseOrPest: string;
  crop: string;
  location: string;
  state: string;
  distanceKm: number;
  severity: 'High' | 'Moderate' | 'Alert';
  reportedAgo: string;
  verifiedByKvk: boolean;
  recommendedPrecaution: string;
}

export interface ClimateEventAlert {
  id: string;
  districtId: string;
  eventType: 'Heatwave' | 'Unseasonal Rain' | 'Flash Flood / Cyclone' | 'Cold Wave / Frost' | 'High Wind Lodging';
  severity: 'Critical' | 'Warning' | 'Watch';
  headline: string;
  vernacularHeadline: Partial<Record<SupportedLanguage, string>>;
  onsetForecast: string;
  duration: string;
  vulnerableCrops: string[];
  temperatureOrRainStat: string;
  impactAnalysis: string;
  immediateProtectiveMeasures: string[];
  recommendedSprayOrDrainage: string;
  spokenAudioWarning: string;
}


