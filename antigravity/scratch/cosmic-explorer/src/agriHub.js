// ============================================================================
// COSMIC EXPLORER - AGRO-ATMOSPHERIC INTELLIGENCE & CROP SUITABILITY HUB
// Environmental Tolerance, Atmospheric Presets, Astro-Botany & Pest Risk Engine
// ============================================================================

import { CROPS_DATA, ATMOSPHERE_PRESETS } from "./data/cropData.js";
import { sound } from "./audio.js";
import { auth } from "./auth.js";

export class AgriAtmosphereHub {
  constructor() {
    this.crops = CROPS_DATA;
    this.selectedCropId = "wheat";
    this.currentEnv = {
      tempC: 24,
      co2Ppm: 420,
      pressureHpa: 1013,
      humidityPct: 60,
      solarLightWm2: 500
    };
    this.activeCategoryFilter = "all";
    this.locationContext = null;
  }

  init() {
    this.bindEvents();
    this.renderCropsGrid();
    this.updateChamberSimulation();
    this.renderAstroBotanyTable();
  }

  setLocationData(loc, weather) {
    this.locationContext = { loc, weather };
    if (weather && weather.current) {
      this.currentEnv.tempC = weather.current.temperature_2m;
      this.currentEnv.humidityPct = weather.current.relative_humidity_2m;
      this.currentEnv.pressureHpa = weather.current.surface_pressure || 1013;
      this.currentEnv.solarLightWm2 = weather.current.direct_normal_irradiance || 520;
      this.syncSlidersWithEnv();
      this.updateChamberSimulation();
      this.renderCropsGrid();
    }
  }

  syncSlidersWithEnv() {
    const tempSlider = document.getElementById("chamberTempSlider");
    const co2Slider = document.getElementById("chamberCo2Slider");
    const pressSlider = document.getElementById("chamberPressureSlider");
    const humSlider = document.getElementById("chamberHumiditySlider");
    const lightSlider = document.getElementById("chamberLightSlider");

    if (tempSlider) tempSlider.value = this.currentEnv.tempC;
    if (co2Slider) co2Slider.value = this.currentEnv.co2Ppm;
    if (pressSlider) pressSlider.value = this.currentEnv.pressureHpa;
    if (humSlider) humSlider.value = this.currentEnv.humidityPct;
    if (lightSlider) lightSlider.value = this.currentEnv.solarLightWm2;

    this.updateSliderDisplayValues();
  }

  updateSliderDisplayValues() {
    const tVal = document.getElementById("chamberTempVal");
    const cVal = document.getElementById("chamberCo2Val");
    const pVal = document.getElementById("chamberPressureVal");
    const hVal = document.getElementById("chamberHumidityVal");
    const lVal = document.getElementById("chamberLightVal");

    if (tVal) tVal.innerText = `${this.currentEnv.tempC}°C`;
    if (cVal) cVal.innerText = `${this.currentEnv.co2Ppm} ppm`;
    if (pVal) pVal.innerText = `${this.currentEnv.pressureHpa} hPa`;
    if (hVal) hVal.innerText = `${this.currentEnv.humidityPct}%`;
    if (lVal) lVal.innerText = `${this.currentEnv.solarLightWm2} W/m²`;
  }

  bindEvents() {
    const tempSlider = document.getElementById("chamberTempSlider");
    const co2Slider = document.getElementById("chamberCo2Slider");
    const pressSlider = document.getElementById("chamberPressureSlider");
    const humSlider = document.getElementById("chamberHumiditySlider");
    const lightSlider = document.getElementById("chamberLightSlider");

    const updateFromSliders = () => {
      this.currentEnv.tempC = parseFloat(tempSlider?.value || 24);
      this.currentEnv.co2Ppm = parseInt(co2Slider?.value || 420);
      this.currentEnv.pressureHpa = parseInt(pressSlider?.value || 1013);
      this.currentEnv.humidityPct = parseInt(humSlider?.value || 60);
      this.currentEnv.solarLightWm2 = parseInt(lightSlider?.value || 500);

      this.updateSliderDisplayValues();
      this.updateChamberSimulation();
      this.renderCropsGrid();
    };

    [tempSlider, co2Slider, pressSlider, humSlider, lightSlider].forEach(slider => {
      if (slider) slider.addEventListener("input", updateFromSliders);
    });

    // Atmospheric Presets
    const presetButtons = document.querySelectorAll(".atmo-preset-btn");
    presetButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        sound.playClick();
        presetButtons.forEach(b => b.classList.remove("active-preset"));
        btn.classList.add("active-preset");

        const presetKey = btn.dataset.preset;
        const preset = ATMOSPHERE_PRESETS[presetKey];
        if (preset) {
          this.currentEnv.tempC = preset.tempC;
          this.currentEnv.co2Ppm = preset.co2Ppm;
          this.currentEnv.pressureHpa = preset.pressureHpa;
          this.currentEnv.humidityPct = preset.humidityPct;
          this.currentEnv.solarLightWm2 = preset.solarLightWm2;

          this.syncSlidersWithEnv();
          this.updateChamberSimulation();
          this.renderCropsGrid();
          auth.addXP(15);
        }
      });
    });

    // Category Filter Buttons
    const catButtons = document.querySelectorAll(".crop-cat-btn");
    catButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        sound.playClick();
        catButtons.forEach(b => b.classList.remove("active-cat"));
        btn.classList.add("active-cat");
        this.activeCategoryFilter = btn.dataset.category;
        this.renderCropsGrid();
      });
    });
  }

  // Calculate environmental & atmospheric suitability score (0 - 100)
  calculateSuitability(crop, env) {
    let score = 100;

    // 1. Temperature Evaluation (Primary weight)
    if (env.tempC >= crop.tempOptMin && env.tempC <= crop.tempOptMax) {
      // Optimal range
    } else if (env.tempC >= crop.tempCritMin && env.tempC <= crop.tempCritMax) {
      // Suboptimal margin
      const dist = Math.min(Math.abs(env.tempC - crop.tempOptMin), Math.abs(env.tempC - crop.tempOptMax));
      score -= dist * 4.5;
    } else {
      // Critical lethal threshold
      score -= 55;
    }

    // 2. CO2 Tolerance & Enhancement
    if (env.co2Ppm < crop.co2Tolerance.min || env.co2Ppm > crop.co2Tolerance.max) {
      score -= 25;
    } else if (env.co2Ppm > 600 && crop.photosynthesisType === "C3") {
      score = Math.min(100, score + 10); // C3 plants benefit immensely from high CO2
    }

    // 3. Atmospheric Pressure Tolerance
    if (env.pressureHpa < crop.pressureToleranceHpa.min || env.pressureHpa > crop.pressureToleranceHpa.max) {
      score -= 20;
    }

    // 4. Humidity Tolerance
    if (env.humidityPct < crop.humidityOpt.min - 15 || env.humidityPct > crop.humidityOpt.max + 15) {
      score -= 15;
    }

    return Math.max(5, Math.min(100, Math.round(score)));
  }

  updateChamberSimulation() {
    const selectedCrop = this.crops.find(c => c.id === this.selectedCropId) || this.crops[0];
    const score = this.calculateSuitability(selectedCrop, this.currentEnv);

    // Photosynthetic Yield Multiplier
    let co2Factor = 1.0;
    if (this.currentEnv.co2Ppm > 420) {
      co2Factor += (this.currentEnv.co2Ppm - 420) * (selectedCrop.photosynthesisType === "C3" ? 0.0006 : 0.0002);
    }
    const biomassMultiplier = (score / 100) * co2Factor;

    // Render Chamber Simulation Panel
    const chamberPanel = document.getElementById("chamberResultsPanel");
    if (!chamberPanel) return;

    let statusColor = "emerald";
    let statusText = "THRIVING (Optimal Atmospheric Conditions)";
    if (score < 40) {
      statusColor = "red";
      statusText = "PHOTOSYNTHETIC FAILURE (Critical Environment Stress)";
    } else if (score < 70) {
      statusColor = "amber";
      statusText = "SUB-OPTIMAL (Moderate Climate Stress)";
    }

    chamberPanel.innerHTML = `
      <div class="glass-panel p-5 border border-${statusColor}-500/40 rounded-xl text-white space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <div class="flex items-center space-x-3">
            <span class="text-3xl">${selectedCrop.icon}</span>
            <div>
              <span class="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Atmospheric Bio-Chamber Test</span>
              <h3 class="text-xl font-bold font-mono text-white">${selectedCrop.name}</h3>
            </div>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold font-mono text-${statusColor}-400">${score}%</span>
            <span class="block text-[10px] text-gray-400 uppercase">Survival & Yield Score</span>
          </div>
        </div>

        <div class="p-2.5 rounded bg-${statusColor}-950/40 border border-${statusColor}-500/30 text-xs font-mono text-${statusColor}-300 flex items-center justify-between">
          <span>${statusText}</span>
          <span>Biomass Yield: ${biomassMultiplier.toFixed(2)}x Baseline</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="p-2.5 bg-black/40 rounded border border-white/5">
            <span class="text-gray-400 block text-[10px]">Optimal Temp</span>
            <span class="font-medium text-amber-300 font-mono">${selectedCrop.tempOptMin}°C - ${selectedCrop.tempOptMax}°C</span>
          </div>
          <div class="p-2.5 bg-black/40 rounded border border-white/5">
            <span class="text-gray-400 block text-[10px]">CO₂ Tolerance</span>
            <span class="font-medium text-emerald-300 font-mono">${selectedCrop.co2Tolerance.min} - ${selectedCrop.co2Tolerance.max} ppm</span>
          </div>
          <div class="p-2.5 bg-black/40 rounded border border-white/5">
            <span class="text-gray-400 block text-[10px]">Pressure Limit</span>
            <span class="font-medium text-cyan-300 font-mono">${selectedCrop.pressureToleranceHpa.min} - ${selectedCrop.pressureToleranceHpa.max} hPa</span>
          </div>
          <div class="p-2.5 bg-black/40 rounded border border-white/5">
            <span class="text-gray-400 block text-[10px]">Photosynthesis Type</span>
            <span class="font-medium text-purple-300 font-mono">${selectedCrop.photosynthesisType} Pathway</span>
          </div>
        </div>

        <div class="p-3 bg-cyan-950/30 rounded-lg border border-cyan-500/20 text-xs text-gray-300 space-y-1">
          <p><strong class="text-cyan-300">Astro-Botany & Greenhouse Notes:</strong> ${selectedCrop.astroNotes}</p>
          <p><strong class="text-cyan-300">Water Requirement:</strong> ${selectedCrop.waterReqMm} | <strong class="text-cyan-300">Soil:</strong> ${selectedCrop.soilType}</p>
        </div>

        <!-- Pest & Disease Forecaster -->
        <div class="border-t border-white/10 pt-3">
          <span class="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider block mb-2">🐛 Active Pest & Climate Risk Forecaster:</span>
          <div class="space-y-2">
            ${selectedCrop.pestRisks.map(p => `
              <div class="p-2 bg-red-950/30 rounded border border-red-500/20 text-[11px]">
                <div class="flex justify-between font-bold text-red-300 mb-0.5">
                  <span>${p.name}</span>
                  <span class="text-amber-400 font-normal">Trigger: ${p.trigger}</span>
                </div>
                <div class="text-gray-300"><strong>Mitigation:</strong> ${p.mitigation}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  renderCropsGrid() {
    const grid = document.getElementById("cropsSuitabilityGrid");
    if (!grid) return;

    let filtered = this.crops;
    if (this.activeCategoryFilter !== "all") {
      filtered = this.crops.filter(c => c.category.toLowerCase().includes(this.activeCategoryFilter.toLowerCase()));
    }

    grid.innerHTML = filtered.map(crop => {
      const score = this.calculateSuitability(crop, this.currentEnv);
      let badgeClass = "bg-emerald-950/70 border-emerald-500/50 text-emerald-300";
      if (score < 40) badgeClass = "bg-red-950/70 border-red-500/50 text-red-300";
      else if (score < 70) badgeClass = "bg-yellow-950/70 border-yellow-500/50 text-yellow-300";

      const isSelected = crop.id === this.selectedCropId;

      return `
        <div class="glass-panel p-4 rounded-xl border ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-500/30' : 'border-white/10 hover:border-white/30'} cursor-pointer transition-all duration-200" onclick="window.cosmicApp.selectCrop('${crop.id}')">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="text-2xl">${crop.icon}</span>
              <div>
                <h4 class="font-bold text-white text-sm leading-tight">${crop.name.split("(")[0]}</h4>
                <span class="text-[10px] text-gray-400">${crop.category}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 text-xs font-mono font-bold rounded-full border ${badgeClass}">${score}%</span>
          </div>

          <div class="space-y-1 text-[11px] text-gray-300 pt-2 border-t border-white/5">
            <div class="flex justify-between"><span>Optimum Temp:</span><span class="text-amber-300">${crop.tempOptMin}-${crop.tempOptMax}°C</span></div>
            <div class="flex justify-between"><span>CO₂ Optimal:</span><span class="text-emerald-300">${crop.co2OptPpm} ppm</span></div>
            <div class="flex justify-between"><span>Growth Cycle:</span><span class="text-cyan-300">${crop.growthDurationDays}</span></div>
          </div>
        </div>
      `;
    }).join("");
  }

  selectCrop(cropId) {
    this.selectedCropId = cropId;
    sound.playClick();
    this.updateChamberSimulation();
    this.renderCropsGrid();
  }

  renderAstroBotanyTable() {
    const tableBody = document.getElementById("astroBotanyTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = this.crops.map(c => `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-colors text-xs">
        <td class="py-2.5 px-3 flex items-center space-x-2">
          <span>${c.icon}</span>
          <span class="font-medium text-white">${c.name}</span>
        </td>
        <td class="py-2.5 px-3 text-cyan-300 font-mono">${c.tempOptMin}°C - ${c.tempOptMax}°C</td>
        <td class="py-2.5 px-3 text-emerald-300 font-mono">${c.co2Tolerance.min}-${c.co2Tolerance.max} ppm</td>
        <td class="py-2.5 px-3 text-purple-300 font-mono">${c.pressureToleranceHpa.min}-${c.pressureToleranceHpa.max} hPa</td>
        <td class="py-2.5 px-3 text-amber-300 font-mono">${c.photosynthesisType}</td>
        <td class="py-2.5 px-3 font-mono font-bold ${c.astroSuitabilityScore > 80 ? 'text-emerald-400' : 'text-yellow-400'}">${c.astroSuitabilityScore}/100</td>
      </tr>
    `).join("");
  }
}
