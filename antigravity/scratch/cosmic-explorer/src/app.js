// ============================================================================
// COSMIC EXPLORER - MAIN APPLICATION COORDINATOR & ROUTER
// Seamless module lifecycle management, tab switching & real-time telemetry sync
// ============================================================================

import { auth } from "./auth.js";
import { sound } from "./audio.js";
import { SolarSystemEngine } from "./solarSystem.js";
import { TelescopeObservatory } from "./telescopeView.js";
import { DeepGalaxyEngine } from "./galaxies.js";
import { EarthObservationEngine } from "./earthView.js";
import { HeatExplorerEngine } from "./heatExplorer.js";
import { AgriAtmosphereHub } from "./agriHub.js";
import { CosmicQuizEngine, AsteroidArcadeGame } from "./games.js";

class CosmicExplorerApp {
  constructor() {
    this.activeTab = "solar";
    this.engines = {};
    this.audioStarted = false;
  }

  init() {
    // 1. Initialize Auth
    auth.init();

    // 2. Initialize Engines
    this.engines.solar = new SolarSystemEngine("solarSystemCanvasContainer");
    this.engines.telescopes = new TelescopeObservatory("telescopeCanvasContainer");
    this.engines.galaxies = new DeepGalaxyEngine("galaxyCanvasContainer");
    this.engines.earth = new EarthObservationEngine("earthCanvasContainer");
    this.engines.heat = new HeatExplorerEngine();
    this.engines.agri = new AgriAtmosphereHub();
    this.engines.quiz = new CosmicQuizEngine();
    this.engines.arcade = new AsteroidArcadeGame("arcadeCanvas");

    // 3. Connect Heat Explorer with Agriculture Hub
    this.engines.heat.onLocationUpdated = (loc, weather) => {
      this.engines.agri.setLocationData(loc, weather);
    };

    // 4. Initialize first active view
    this.engines.solar.init();
    this.engines.heat.init();
    this.engines.agri.init();

    // 5. Bind Navigation & Global Events
    this.bindNavigation();
    this.bindGlobalControls();

    // Handle initial auth modal if no saved user
    if (!auth.currentUser) {
      setTimeout(() => auth.openModal(), 600);
    } else {
      auth.updateUI();
    }
  }

  bindNavigation() {
    const navButtons = document.querySelectorAll(".nav-tab-btn");
    navButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;
        if (targetTab === this.activeTab) return;

        sound.playClick();
        this.switchTab(targetTab);
      });
    });

    // Quick Action button from Heat Explorer to Agriculture Hub
    document.getElementById("sendToAgriBtn")?.addEventListener("click", () => {
      sound.playClick();
      this.switchTab("agriculture");
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update Tab UI Buttons
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add("active-nav-tab");
      } else {
        btn.classList.remove("active-nav-tab");
      }
    });

    // Hide all view panels
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("hidden"));

    // Show target section
    const targetSec = document.getElementById(`section_${tabId}`);
    if (targetSec) targetSec.classList.remove("hidden");

    // Initialize/Resume Engine if needed
    if (tabId === "solar") {
      if (!this.engines.solar.scene) this.engines.solar.init();
      else this.engines.solar.onResize();
    } else if (tabId === "telescopes") {
      if (!this.engines.telescopes.scene) this.engines.telescopes.init();
      else this.engines.telescopes.onResize();
    } else if (tabId === "galaxies") {
      if (!this.engines.galaxies.scene) this.engines.galaxies.init();
      else this.engines.galaxies.onResize();
    } else if (tabId === "earth") {
      if (!this.engines.earth.scene) this.engines.earth.init();
      else this.engines.earth.onResize();
    } else if (tabId === "heat") {
      this.engines.heat.renderChart();
    } else if (tabId === "agriculture") {
      this.engines.agri.updateChamberSimulation();
    } else if (tabId === "games") {
      if (!this.engines.quiz.isAnswered) this.engines.quiz.init();
      this.engines.arcade.init();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  bindGlobalControls() {
    // Audio Sound FX & Music Toggle
    const soundToggle = document.getElementById("globalSoundToggle");
    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        const isMuted = sound.toggleMute();
        soundToggle.innerHTML = isMuted ? `<i data-lucide="volume-x"></i>` : `<i data-lucide="volume-2"></i>`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Profile Trigger
    document.getElementById("userProfileBtn")?.addEventListener("click", () => {
      sound.playClick();
      auth.openModal();
    });

    // Ambient space sound on first user touch
    document.addEventListener("pointerdown", () => {
      if (!this.audioStarted) {
        sound.startAmbientHum();
        this.audioStarted = true;
      }
    }, { once: true });
  }

  selectCrop(cropId) {
    this.engines.agri.selectCrop(cropId);
  }
}

// Global bootstrap
window.addEventListener("DOMContentLoaded", () => {
  window.cosmicApp = new CosmicExplorerApp();
  window.cosmicApp.init();
  if (window.lucide) window.lucide.createIcons();
});
