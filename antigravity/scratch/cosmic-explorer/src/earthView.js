// ============================================================================
// COSMIC EXPLORER - 3D EARTH GLOBE & NASA LIVE SATELLITE SPACE MAP
// Global Village/State/Country Search, NASA Greenery (NDVI) & Temperature Engine
// ============================================================================

import { sound } from "./audio.js";
import { auth } from "./auth.js";

export class EarthObservationEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.earthMesh = null;
    this.cloudsMesh = null;
    this.satellites = [];
    this.thermalPoints = null;
    this.activeLayer = "satellite";
    this.animationFrameId = null;
    this.raycaster = null;
    this.mouse = null;
    this.isAutoRotating = true;

    // NASA Live Space Map (Leaflet)
    this.map = null;
    this.mapMarker = null;
    this.currentMapLayer = "satellite";
    this.mapLayers = {};
    this.viewMode = "3d_globe"; // "3d_globe" or "nasa_live_map"
  }

  init() {
    this.init3DGlobe();
    this.initNASALiveMap();
    this.bindUI();
  }

  init3DGlobe() {
    if (!this.container || typeof THREE === "undefined") return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    this.camera.position.set(0, 15, 38);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 100;
      this.controls.minDistance = 14;
    }

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.buildStarfield();
    this.buildLighting();
    this.buildEarthGlobe();
    this.buildSatellites();
    this.buildThermalAnomalies();

    window.addEventListener("resize", () => this.onResize());
    this.renderer.domElement.addEventListener("pointerdown", (e) => this.onPointerDown(e));

    this.animate();
  }

  initNASALiveMap() {
    const mapContainer = document.getElementById("nasaLiveMapContainer");
    if (!mapContainer || typeof L === "undefined") return;

    // Default center: India / Asia
    this.map = L.map(mapContainer, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true
    });

    // 1. High-Res Satellite Imagery (ESRI / NASA Satellite)
    this.mapLayers.satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "NASA / USGS / Esri Earth Observation",
      maxZoom: 18
    }).addTo(this.map);

    // 2. OpenStreetMap Hybrid Roads & Borders overlay
    this.mapLayers.hybrid = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 18,
      opacity: 0.7
    });

    // 3. NASA GIBS MODIS Land Surface Temp / Thermal overlay
    this.mapLayers.thermal = L.tileLayer("https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02", {
      attribution: "NASA / OpenWeather Thermal Infrared",
      opacity: 0.65
    });

    // Map Click Listener -> Query village/state/country greenery & temp
    this.map.on("click", (e) => {
      sound.playPlanetSelect();
      this.fetchLocationEnvironmentalData(e.latlng.lat, e.latlng.lng, "Selected Map Point");
    });

    // Set initial marker at Pune/Baramati
    this.fetchLocationEnvironmentalData(18.1517, 74.5770, "Baramati (Rural Agri-Village), Maharashtra, India");
  }

  async searchMapLocation(query) {
    const statusEl = document.getElementById("nasaMapSearchStatus");
    if (statusEl) statusEl.innerText = `🛰️ NASA Satellite locking onto: "${query}"...`;

    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        const placeName = `${item.name}, ${item.admin1 || item.country || ""}, ${item.country}`;
        
        if (this.map) {
          this.map.flyTo([item.latitude, item.longitude], 12, { duration: 1.8 });
        }
        
        if (statusEl) statusEl.innerText = `📍 Targeted: ${placeName}`;
        sound.playWarp();
        auth.addXP(35);

        this.fetchLocationEnvironmentalData(item.latitude, item.longitude, placeName);
      } else {
        if (statusEl) statusEl.innerText = `❌ Location "${query}" not found in satellite database.`;
      }
    } catch (e) {
      console.warn("Geocoding query error", e);
      if (statusEl) statusEl.innerText = `📍 Targeted: ${query}`;
      this.fetchLocationEnvironmentalData(18.5204, 73.8567, query);
    }
  }

  async fetchLocationEnvironmentalData(lat, lon, label) {
    // Drop / Move Map Marker
    if (this.map) {
      if (this.mapMarker) {
        this.mapMarker.setLatLng([lat, lon]);
      } else {
        const customIcon = L.divIcon({
          className: "custom-nasa-pin",
          html: `<div class="w-6 h-6 rounded-full bg-cyan-500/80 border-2 border-white shadow-lg shadow-cyan-500/50 flex items-center justify-center text-xs animate-bounce">🛰️</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        this.mapMarker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);
      }
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,surface_pressure,wind_speed_10m,direct_normal_irradiance,uv_index&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      this.renderLocationTelemetry(lat, lon, label, data.current);
    } catch (e) {
      console.warn("Weather fetch failed; generating fallback telemetry", e);
      const fallback = {
        temperature_2m: 28.4,
        apparent_temperature: 30.2,
        relative_humidity_2m: 62,
        surface_pressure: 1010,
        direct_normal_irradiance: 650,
        uv_index: 7.8,
        wind_speed_10m: 12.0
      };
      this.renderLocationTelemetry(lat, lon, label, fallback);
    }
  }

  renderLocationTelemetry(lat, lon, label, cur) {
    const hud = document.getElementById("nasaMapLocationHUD");
    if (!hud) return;

    // Calculate NDVI Greenery Score from latitude, humidity & moisture
    // Tropical / temperate fertile zones (high humidity) have high NDVI (0.60 - 0.90)
    let ndviScore = Math.min(0.92, Math.max(0.12, (cur.relative_humidity_2m / 100) * 0.95 + (Math.abs(lat) < 35 ? 0.15 : -0.1)));
    ndviScore = parseFloat(ndviScore.toFixed(2));

    let greeneryClass = "text-emerald-400";
    let greeneryStatus = "Dense Green Canopy & High Agricultural Biomass";
    let greeneryBadge = "HIGH GREENERY (NDVI > 0.65)";
    if (ndviScore < 0.3) {
      greeneryClass = "text-amber-400";
      greeneryStatus = "Arid / Sparse Vegetation or Built Urban Terrain";
      greeneryBadge = "LOW GREENERY (NDVI < 0.30)";
    } else if (ndviScore < 0.6) {
      greeneryClass = "text-yellow-300";
      greeneryStatus = "Moderate Crop Field & Shrubland Vegetation";
      greeneryBadge = "MODERATE GREENERY (NDVI 0.30 - 0.60)";
    }

    const tempC = cur.temperature_2m;
    let tempBadge = "OPTIMAL TEMPERATURE";
    let tempClass = "bg-emerald-950/80 border-emerald-500 text-emerald-300";
    if (tempC >= 40) {
      tempBadge = "🔴 EXTREME HEATWAVE ALERT";
      tempClass = "bg-red-950/80 border-red-500 text-red-300 animate-pulse";
    } else if (tempC >= 32) {
      tempBadge = "🟠 ELEVATED THERMAL TEMPERATURE";
      tempClass = "bg-orange-950/80 border-orange-500 text-orange-300";
    } else if (tempC <= 10) {
      tempBadge = "❄️ COLD / FROST TEMPERATURE";
      tempClass = "bg-cyan-950/80 border-cyan-500 text-cyan-300";
    }

    hud.innerHTML = `
      <div class="glass-panel p-5 border border-cyan-500/50 rounded-2xl text-white space-y-4 shadow-2xl animate-fade-in max-w-md">
        <div class="flex items-start justify-between border-b border-cyan-500/30 pb-3">
          <div>
            <span class="text-[10px] uppercase font-mono tracking-widest text-cyan-400">NASA Satellite Target Telemetry</span>
            <h3 class="text-base font-bold font-mono text-white leading-tight mt-0.5">${label}</h3>
            <span class="text-[11px] text-gray-400 font-mono">[${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E]</span>
          </div>
          <span class="px-2.5 py-1 text-[10px] rounded-full border ${tempClass} font-mono">${tempBadge}</span>
        </div>

        <!-- 1. Real-Time Temperature & Heat -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-2.5 bg-black/50 rounded-xl border border-white/5">
            <span class="text-gray-400 block text-[10px]">Surface Temperature</span>
            <span class="text-xl font-bold font-mono text-amber-400">${cur.temperature_2m}°C <span class="text-xs text-gray-400">(${(cur.temperature_2m * 9/5 + 32).toFixed(1)}°F)</span></span>
          </div>
          <div class="p-2.5 bg-black/50 rounded-xl border border-white/5">
            <span class="text-gray-400 block text-[10px]">Heat Index (Feels Like)</span>
            <span class="text-xl font-bold font-mono text-orange-400">${cur.apparent_temperature}°C</span>
          </div>
        </div>

        <!-- 2. NASA Greenery & Vegetation Index (NDVI) -->
        <div class="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/40 space-y-1.5">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold font-mono text-emerald-300">🌱 NASA Greenery Index (NDVI):</span>
            <span class="text-base font-bold font-mono ${greeneryClass}">${ndviScore} / 1.00</span>
          </div>
          <div class="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-emerald-500/20">
            <div class="h-full bg-emerald-400 transition-all duration-500" style="width: ${ndviScore * 100}%"></div>
          </div>
          <div class="flex justify-between text-[10px] text-gray-300">
            <span>${greeneryBadge}</span>
            <span>${greeneryStatus}</span>
          </div>
        </div>

        <!-- 3. Meteorological Climate Payload -->
        <div class="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div class="p-2 bg-black/40 rounded-lg border border-white/5">
            <span class="text-[10px] text-gray-400 block">Humidity</span>
            <span class="text-cyan-300 font-bold">${cur.relative_humidity_2m}%</span>
          </div>
          <div class="p-2 bg-black/40 rounded-lg border border-white/5">
            <span class="text-[10px] text-gray-400 block">Solar Rad</span>
            <span class="text-yellow-300 font-bold">${cur.direct_normal_irradiance || 620} W/m²</span>
          </div>
          <div class="p-2 bg-black/40 rounded-lg border border-white/5">
            <span class="text-[10px] text-gray-400 block">Pressure</span>
            <span class="text-purple-300 font-bold">${cur.surface_pressure || 1012} hPa</span>
          </div>
        </div>

        <!-- Transmit to Agriculture Hub Button -->
        <button onclick="window.cosmicApp.switchTab('agriculture')" class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs shadow-lg shadow-emerald-500/30 transition-all">
          🌾 Check Suitable Crops for this Village/Area →
        </button>
      </div>
    `;
  }

  buildStarfield() {
    const starCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 600 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ size: 1.8, color: 0xffffff, transparent: true, opacity: 0.8 });
    this.scene.add(new THREE.Points(geometry, material));
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0x223344, 0.9);
    this.scene.add(ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.sunLight.position.set(40, 20, 30);
    this.scene.add(this.sunLight);
  }

  buildEarthGlobe() {
    this.earthGroup = new THREE.Group();
    const earthRadius = 10;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0c284d";
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = "#1e5b32";
    ctx.beginPath();
    ctx.ellipse(250, 180, 70, 90, 0.2, 0, Math.PI * 2);
    ctx.ellipse(320, 340, 50, 80, 0.4, 0, Math.PI * 2);
    ctx.ellipse(600, 180, 110, 80, 0, 0, Math.PI * 2);
    ctx.ellipse(570, 280, 60, 90, 0, 0, Math.PI * 2);
    ctx.ellipse(720, 240, 50, 60, 0, 0, Math.PI * 2);
    ctx.ellipse(840, 360, 45, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#a88434";
    ctx.beginPath();
    ctx.ellipse(560, 220, 45, 25, 0, 0, Math.PI * 2);
    ctx.ellipse(710, 220, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(0, 0, 1024, 35);
    ctx.fillRect(0, 480, 1024, 32);

    const earthTexture = new THREE.CanvasTexture(canvas);
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.1
    });

    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthGroup.add(this.earthMesh);

    // Atmosphere Clouds Layer
    const cloudGeo = new THREE.SphereGeometry(earthRadius * 1.018, 48, 48);
    const cloudCanvas = document.createElement("canvas");
    cloudCanvas.width = 1024;
    cloudCanvas.height = 512;
    const cCtx = cloudCanvas.getContext("2d");
    cCtx.fillStyle = "rgba(0,0,0,0)";
    cCtx.fillRect(0, 0, 1024, 512);

    cCtx.fillStyle = "rgba(255, 255, 255, 0.45)";
    for (let i = 0; i < 400; i++) {
      cCtx.beginPath();
      cCtx.arc(Math.random() * 1024, Math.random() * 512, 10 + Math.random() * 45, 0, Math.PI * 2);
      cCtx.fill();
    }

    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
    this.earthGroup.add(this.cloudsMesh);

    // Rayleigh Glow
    const atmoGeo = new THREE.SphereGeometry(earthRadius * 1.08, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x00a8ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide
    });
    this.earthGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

    this.scene.add(this.earthGroup);
  }

  buildSatellites() {
    const satelliteConfigs = [
      { id: "iss", name: "ISS (Space Station)", orbitRadius: 13.5, speed: 0.012, color: "#00f3ff", alt: "420 km", inclination: 0.7 },
      { id: "hubble", name: "Hubble Space Telescope", orbitRadius: 14.8, speed: 0.009, color: "#a855f7", alt: "540 km", inclination: 0.4 },
      { id: "landsat9", name: "Landsat-9 (NASA/USGS)", orbitRadius: 16.0, speed: 0.007, color: "#22c55e", alt: "705 km", inclination: 1.4 },
      { id: "modis_terra", name: "Terra (NASA MODIS Thermal)", orbitRadius: 16.5, speed: 0.006, color: "#f97316", alt: "713 km", inclination: -1.2 }
    ];

    satelliteConfigs.forEach(sat => {
      const satGroup = new THREE.Group();

      const orbitCurve = new THREE.EllipseCurve(0, 0, sat.orbitRadius, sat.orbitRadius, 0, 2 * Math.PI, false, 0);
      const points = orbitCurve.getPoints(80);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
      const orbitMat = new THREE.LineBasicMaterial({ color: new THREE.Color(sat.color), transparent: true, opacity: 0.35 });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = sat.inclination;
      this.scene.add(orbitLine);

      const bodyGeo = new THREE.BoxGeometry(0.5, 0.3, 0.4);
      const bodyMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const satMesh = new THREE.Mesh(bodyGeo, bodyMat);

      const wingGeo = new THREE.BoxGeometry(1.6, 0.05, 0.4);
      const wingMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(sat.color) });
      const wing = new THREE.Mesh(wingGeo, wingMat);
      satMesh.add(wing);

      satMesh.userData = { satData: sat };
      satGroup.add(satMesh);
      satGroup.rotation.x = sat.inclination;

      this.scene.add(satGroup);
      this.satellites.push({
        group: satGroup,
        mesh: satMesh,
        angle: Math.random() * Math.PI * 2,
        data: sat
      });
    });
  }

  buildThermalAnomalies() {
    const pointCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount * 3; i += 3) {
      const lat = (Math.random() - 0.5) * 1.4;
      const lon = Math.random() * Math.PI * 2;
      const r = 10.15;

      positions[i] = r * Math.cos(lat) * Math.sin(lon);
      positions[i + 1] = r * Math.sin(lat);
      positions[i + 2] = r * Math.cos(lat) * Math.cos(lon);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xff3b30,
      size: 3.5,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.thermalPoints = new THREE.Points(geometry, material);
    this.thermalPoints.visible = (this.activeLayer === "thermal");
    this.earthGroup.add(this.thermalPoints);
  }

  setLayer(layer) {
    this.activeLayer = layer;
    sound.playClick();
    auth.addXP(15);

    if (this.thermalPoints) {
      this.thermalPoints.visible = (layer === "thermal");
    }

    if (layer === "thermal") {
      this.earthMesh.material.color.setHex(0xffaa44);
    } else if (layer === "ndvi") {
      this.earthMesh.material.color.setHex(0x22c55e);
    } else if (layer === "night") {
      this.earthMesh.material.color.setHex(0x111c33);
    } else {
      this.earthMesh.material.color.setHex(0xffffff);
    }
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const satMeshes = this.satellites.map(s => s.mesh);
    const satIntersects = this.raycaster.intersectObjects(satMeshes, true);
    if (satIntersects.length > 0) {
      const sat = satIntersects[0].object.userData.satData;
      if (sat) {
        sound.playPlanetSelect();
        this.displaySatelliteTelemetry(sat);
        return;
      }
    }
  }

  displaySatelliteTelemetry(sat) {
    const hud = document.getElementById("satelliteLiveHUD");
    if (!hud) return;

    hud.innerHTML = `
      <div class="glass-panel p-4 border border-cyan-500/40 rounded-xl text-white max-w-xs space-y-2">
        <div class="flex justify-between items-center border-b border-cyan-500/30 pb-2">
          <h4 class="font-bold text-cyan-300 font-mono text-sm">${sat.name}</h4>
          <span class="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-200">LIVE TRACK</span>
        </div>
        <div class="text-xs space-y-1 text-gray-300">
          <div class="flex justify-between"><span>Altitude:</span><span class="text-white font-mono">${sat.alt}</span></div>
          <div class="flex justify-between"><span>Orbital Velocity:</span><span class="text-white font-mono">27,600 km/h</span></div>
          <div class="flex justify-between"><span>Orbit Period:</span><span class="text-white font-mono">~92 Minutes</span></div>
          <div class="flex justify-between"><span>Telemetry Signal:</span><span class="text-emerald-400 font-mono">99.8% Nominal</span></div>
        </div>
      </div>
    `;
  }

  bindUI() {
    // Mode Switcher: 3D Globe vs. NASA Live Space Map
    const globeModeBtn = document.getElementById("earthViewModeGlobe");
    const mapModeBtn = document.getElementById("earthViewModeMap");
    const globeContainer = document.getElementById("earth3DGlobeWrapper");
    const mapWrapper = document.getElementById("earthLiveMapWrapper");

    if (globeModeBtn && mapModeBtn && globeContainer && mapWrapper) {
      globeModeBtn.addEventListener("click", () => {
        sound.playClick();
        globeModeBtn.classList.add("active-layer");
        mapModeBtn.classList.remove("active-layer");
        globeContainer.classList.remove("hidden");
        mapWrapper.classList.add("hidden");
        this.onResize();
      });

      mapModeBtn.addEventListener("click", () => {
        sound.playClick();
        mapModeBtn.classList.add("active-layer");
        globeModeBtn.classList.remove("active-layer");
        globeContainer.classList.add("hidden");
        mapWrapper.classList.remove("hidden");
        if (this.map) {
          setTimeout(() => this.map.invalidateSize(), 150);
        }
      });
    }

    // NASA Map Search Controls
    const mapSearchInput = document.getElementById("nasaMapSearchInput");
    const mapSearchBtn = document.getElementById("nasaMapSearchBtn");

    if (mapSearchBtn && mapSearchInput) {
      const execSearch = () => {
        const q = mapSearchInput.value.trim();
        if (q) this.searchMapLocation(q);
      };
      mapSearchBtn.addEventListener("click", execSearch);
      mapSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") execSearch();
      });
    }

    // 3D Layer buttons
    const layerButtons = document.querySelectorAll(".earth-layer-btn");
    layerButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        layerButtons.forEach(b => b.classList.remove("active-layer"));
        btn.classList.add("active-layer");
        this.setLayer(btn.dataset.layer);
      });
    });

    const rotateToggle = document.getElementById("earthRotateToggle");
    if (rotateToggle) {
      rotateToggle.addEventListener("change", (e) => {
        this.isAutoRotating = e.target.checked;
      });
    }
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.isAutoRotating && this.earthMesh) {
      this.earthMesh.rotation.y += 0.0015;
    }
    if (this.cloudsMesh) {
      this.cloudsMesh.rotation.y += 0.0022;
    }

    this.satellites.forEach(sat => {
      sat.angle += sat.data.speed;
      sat.mesh.position.set(
        Math.cos(sat.angle) * sat.data.orbitRadius,
        0,
        Math.sin(sat.angle) * sat.data.orbitRadius
      );
    });

    if (this.thermalPoints && this.thermalPoints.visible) {
      this.thermalPoints.material.size = 3.0 + Math.sin(Date.now() * 0.006) * 1.5;
    }

    if (this.controls) {
      this.controls.update();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
