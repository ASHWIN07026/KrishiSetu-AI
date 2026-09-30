import { jsPDF } from 'jspdf';
import {
  AgroAdvisoryResult,
  SatelliteTelemetry,
  SoilHealthData,
  SupportedLanguage,
  WeatherData,
} from '../types';

interface GeneratePdfParams {
  state: string;
  district: string;
  agroClimaticZone: string;
  crop: string;
  season: string;
  soilData: SoilHealthData;
  satelliteData: SatelliteTelemetry;
  weatherData: WeatherData;
  advisoryResult: AgroAdvisoryResult;
  selectedLanguage: SupportedLanguage;
}

export function generateAdvisoryPdf({
  state,
  district,
  agroClimaticZone,
  crop,
  season,
  soilData,
  satelliteData,
  weatherData,
  advisoryResult,
  selectedLanguage,
}: GeneratePdfParams): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  // 1. Top Decorative Header Bar
  doc.setFillColor(6, 78, 59); // Emerald 900
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setFillColor(16, 185, 129); // Emerald 500 accent stripe
  doc.rect(0, 24, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('KRISHISETU AI • NATIONAL DIGITAL AGRICULTURE NETWORK', margin, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(209, 250, 229);
  doc.text(
    'Digital Public Good (DPG) • Interoperable Soil, Satellite & Climate Intelligence Bulletin',
    margin,
    18
  );

  y = 32;

  // 2. Metadata Box (State, District, Date, Crop)
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.setFont('helvetica', 'bold');
  doc.text('DISTRICT / STATE:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${district}, ${state} (${season} Season)`, margin + 38, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('AGRO-CLIMATIC ZONE:', margin + 4, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(agroClimaticZone || 'Central Zone', margin + 44, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TARGET CROP:', margin + 4, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text(crop, margin + 30, y + 18);

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('GENERATED ON:', margin + 115, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(dateStr, margin + 145, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('LANGUAGE:', margin + 115, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(selectedLanguage, margin + 145, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('RISK STATUS:', margin + 115, y + 18);
  
  // Risk tag color
  if (advisoryResult.riskLevel === 'Critical') {
    doc.setTextColor(220, 38, 38);
  } else if (advisoryResult.riskLevel === 'Elevated') {
    doc.setTextColor(217, 119, 6);
  } else {
    doc.setTextColor(16, 185, 129);
  }
  doc.text(advisoryResult.riskLevel.toUpperCase(), margin + 145, y + 18);

  y += 28;

  // 3. Section Title Helper
  const drawSectionTitle = (title: string, currentY: number): number => {
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(margin, currentY, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin + 5, currentY + 5.5);
    return currentY + 10;
  };

  // 4. Advisory Headline & Assessment
  y = drawSectionTitle('1. AI AGRO-METEOROLOGICAL ADVISORY SUMMARY', y);

  doc.setFillColor(240, 253, 244); // Emerald 50
  doc.setDrawColor(187, 247, 208); // Emerald 200
  doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 95, 70); // Emerald 800
  const headlineLines = doc.splitTextToSize(advisoryResult.headline, contentWidth - 8);
  doc.text(headlineLines, margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const growthLines = doc.splitTextToSize(
    `Growth Stage: ${advisoryResult.cropGrowthStageAssessment}`,
    contentWidth - 8
  );
  doc.text(growthLines, margin + 4, y + 16);

  y += 26;

  // 5. Dual Columns: Precision Irrigation & Soil Nutrient Balancing
  y = drawSectionTitle('2. PRECISION IRRIGATION & NUTRIENT RECOMMENDATIONS', y);

  const colWidth = (contentWidth - 4) / 2;

  // Left: Irrigation
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, colWidth, 42, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(2, 132, 199); // Sky 600
  doc.text('Irrigation Schedule & Moisture Action', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const irriAction = doc.splitTextToSize(
    `Action: ${advisoryResult.irrigationAdvisory.action}`,
    colWidth - 8
  );
  doc.text(irriAction, margin + 4, y + 12);

  const irriRationale = doc.splitTextToSize(
    `Rationale: ${advisoryResult.irrigationAdvisory.rationale}`,
    colWidth - 8
  );
  doc.text(irriRationale, margin + 4, y + 23);

  const waterSaving = doc.splitTextToSize(
    `Conservation: ${advisoryResult.irrigationAdvisory.waterSavingTips}`,
    colWidth - 8
  );
  doc.setTextColor(15, 118, 110);
  doc.text(waterSaving, margin + 4, y + 34);

  // Right: Soil Nutrient Management
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + colWidth + 4, y, colWidth, 42, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(217, 119, 6); // Amber 600
  doc.text('Fertilizer Balancing & Micronutrients', margin + colWidth + 8, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const npkAction = doc.splitTextToSize(
    `Correction: ${advisoryResult.soilNutrientManagement.ureaDapCorrection}`,
    colWidth - 8
  );
  doc.text(npkAction, margin + colWidth + 8, y + 12);

  const microList = advisoryResult.soilNutrientManagement.micronutrientsNeeded.join(', ');
  const microText = doc.splitTextToSize(
    `Micronutrients Needed: ${microList || 'Zinc, Boron balance'}`,
    colWidth - 8
  );
  doc.text(microText, margin + colWidth + 8, y + 23);

  const organicText = doc.splitTextToSize(
    `Organic Boost: ${advisoryResult.soilNutrientManagement.organicAmendments}`,
    colWidth - 8
  );
  doc.setTextColor(4, 120, 87);
  doc.text(organicText, margin + colWidth + 8, y + 34);

  y += 48;

  // 6. Climate Shock Shield & Mandi Collective Strategy
  y = drawSectionTitle('3. CLIMATE RESILIENCE & MANDI MARKETING STRATEGY', y);

  // Left: Climate Shield
  doc.setFillColor(254, 242, 242); // Rose 50
  doc.setDrawColor(254, 202, 202); // Rose 200
  doc.roundedRect(margin, y, colWidth, 38, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(225, 29, 72); // Rose 600
  doc.text('Climate Impact & Threat Mitigation', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const threatText = doc.splitTextToSize(
    `Forecast Threat: ${advisoryResult.climateResilienceAction.threat}`,
    colWidth - 8
  );
  doc.text(threatText, margin + 4, y + 13);

  const shieldAction = doc.splitTextToSize(
    `Protective Measure: ${advisoryResult.climateResilienceAction.protectiveMeasure}`,
    colWidth - 8
  );
  doc.text(shieldAction, margin + 4, y + 22);

  // Right: Mandi & FPO
  doc.setFillColor(240, 253, 250); // Teal 50
  doc.setDrawColor(204, 251, 241); // Teal 200
  doc.roundedRect(margin + colWidth + 4, y, colWidth, 38, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136); // Teal 600
  doc.text('APMC Mandi & FPO Collective Selling', margin + colWidth + 8, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `MSP Benchmark: ${advisoryResult.mandiMarketIntel.currentMsp}`,
    margin + colWidth + 8,
    y + 13
  );
  doc.text(
    `Est. Local Modal Price: ${advisoryResult.mandiMarketIntel.estimatedLocalMandiPrice}`,
    margin + colWidth + 8,
    y + 19
  );

  const mandiAdvice = doc.splitTextToSize(
    `FPO Advisory: ${advisoryResult.mandiMarketIntel.cooperativeSellingAdvice}`,
    colWidth - 8
  );
  doc.text(mandiAdvice, margin + colWidth + 8, y + 25);

  y += 44;

  // 7. Telemetry Data Table (Soil, Weather & Sentinel-2)
  y = drawSectionTitle('4. GROUND & SATELLITE TELEMETRY AUDIT', y);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 38, 1.5, 1.5, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);

  // Table row 1: Soil parameters
  doc.text('SOIL HEALTH METRICS (ICAR SHC Benchmark):', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Nitrogen (N): ${soilData.n} kg/ha  |  Phosphorus (P): ${soilData.p} kg/ha  |  Potassium (K): ${soilData.k} kg/ha  |  pH: ${soilData.ph}`,
    margin + 4,
    y + 10
  );
  doc.text(
    `Organic Carbon (OC): ${soilData.organicCarbon}%  |  Moisture: ${soilData.moisture}%  |  Zinc: ${soilData.zinc} ppm  |  Sulfur: ${soilData.sulfur} ppm`,
    margin + 4,
    y + 15
  );

  // Table row 2: Satellite Telemetry
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('SATELLITE SPECTROMETRY (ISRO Bhuvan / Sentinel-2):', margin + 4, y + 21);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `NDVI (Canopy Vigour): ${satelliteData.ndvi}  |  NDWI (Water Index): ${satelliteData.ndwi}  |  NDRE: ${satelliteData.ndre}  |  LST: ${satelliteData.lst}°C  |  VCI: ${satelliteData.vegetationConditionIndex}%`,
    margin + 4,
    y + 26
  );

  // Table row 3: Weather
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('IMD AGROMET FORECAST:', margin + 4, y + 31);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Temp: ${weatherData.tempMin}°C - ${weatherData.tempMax}°C  |  Rain Prob: ${weatherData.rainProb}%  |  Expected Rain: ${weatherData.expectedRain} mm  |  Humidity: ${weatherData.humidity}%  |  Wind: ${weatherData.windSpeed} km/h`,
    margin + 4,
    y + 36
  );

  y += 44;

  // 8. Inter-state cooperation note & Footer
  if (advisoryResult.interStateCooperationNote) {
    doc.setFillColor(254, 252, 232); // Amber 50
    doc.setDrawColor(254, 240, 138); // Amber 200
    doc.roundedRect(margin, y, contentWidth, 16, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text('INTER-STATE COOPERATIVE INTELLIGENCE NOTE (Theme: Cooperation):', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    const coopLines = doc.splitTextToSize(
      advisoryResult.interStateCooperationNote,
      contentWidth - 8
    );
    doc.text(coopLines, margin + 4, y + 10);
  }

  // 9. Document Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'KrishiSetu AI DPG • Compliant with Indian Council of Agricultural Research (ICAR) & IMD protocols.',
    margin,
    pageHeight - 7
  );
  doc.text(
    `Page 1 of 1 • Document Hash: #KS-${district.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
    pageWidth - margin - 65,
    pageHeight - 7
  );

  // Trigger browser download
  const safeFilename = `KrishiSetu-Advisory-${district}-${crop}-${dateStr.replace(/\s+/g, '_')}.pdf`;
  doc.save(safeFilename);
}
