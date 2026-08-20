// ============================================================================
// COSMIC EXPLORER - ENHANCED 3D SOLAR SYSTEM ENGINE
// Cinematic Three.js WebGL simulation with multi-layer textured planets,
// solar flare shaders, screen-space 3D planet labels, and cinematic fly-to cameras
// ============================================================================

import { SOLAR_SYSTEM_DATA } from "./data/spaceData.js";
import { sound } from "./audio.js";
import { auth } from "./auth.js";

export class SolarSystemEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.planets = {};
    this.orbitLines = [];
    this.asteroidBelt = null;
    this.kuiperBelt = null;
    this.animationFrameId = null;
    this.timeSpeed = 1.0;
    this.isPaused = false;
    this.selectedPlanetId = null;
    this.raycaster = null;
    this.mouse = null;
    this.targetCameraPos = null;
    this.targetLookAt = null;
    this.showOrbits = true;
    this.showLabels = true;
    this.prominenceArcs = [];
    this.clock = new THREE.Clock();
  }

  init() {
    if (!this.container || typeof THREE === "undefined") return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020510, 0.00035);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 8000);
    this.camera.position.set(0, 190, 320);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 2200;
      this.controls.minDistance = 5;
    }

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Build World
    this.buildStarfield();
    this.buildLighting();
    this.buildSun();
    this.buildPlanets();
    this.buildAsteroidBelt();
    this.buildKuiperBelt();

    // Event Listeners
    window.addEventListener("resize", () => this.onResize());
    this.renderer.domElement.addEventListener("pointerdown", (e) => this.onPointerDown(e));

    this.bindUIControls();
    this.animate();
  }

  buildStarfield() {
    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 1200 + Math.random() * 2500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      const tint = Math.random();
      if (tint > 0.8) {
        colors[i] = 0.8; colors[i + 1] = 0.9; colors[i + 2] = 1.0;
      } else if (tint > 0.6) {
        colors[i] = 1.0; colors[i + 1] = 0.85; colors[i + 2] = 0.6;
      } else {
        colors[i] = 1.0; colors[i + 1] = 1.0; colors[i + 2] = 1.0;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const starfield = new THREE.Points(geometry, material);
    this.scene.add(starfield);
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0x222a3d, 0.85);
    this.scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 3.2, 4500, 0.35);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);
  }

  // Enhanced Sun with procedural granulation, glowing corona & solar prominence flares
  buildSun() {
    const sunData = SOLAR_SYSTEM_DATA.sun;
    const geometry = new THREE.SphereGeometry(sunData.radiusRel, 64, 64);

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
    gradient.addColorStop(0, "#ff7700");
    gradient.addColorStop(0.3, "#ffcc00");
    gradient.addColorStop(0.5, "#ff4400");
    gradient.addColorStop(0.8, "#ffbb00");
    gradient.addColorStop(1, "#ff8800");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    // High density solar convective granules
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = `rgba(255, ${Math.floor(210 + Math.random() * 45)}, ${Math.floor(Math.random() * 50)}, ${0.15 + Math.random() * 0.35})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, 4 + Math.random() * 18, 0, Math.PI * 2);
      ctx.fill();
    }

    const sunTexture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: 0xffeedd
    });

    const sunMesh = new THREE.Mesh(geometry, material);
    sunMesh.userData = { id: "sun", name: sunData.name };
    this.scene.add(sunMesh);
    this.planets["sun"] = { mesh: sunMesh, data: sunData, angle: 0 };

    // Outer Glowing Corona Shell
    const coronaGeo = new THREE.SphereGeometry(sunData.radiusRel * 1.3, 48, 48);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    this.sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.scene.add(this.sunCorona);

    // Solar Prominence Plasma Arcs
    for (let i = 0; i < 4; i++) {
      const arcGeo = new THREE.TorusGeometry(sunData.radiusRel * 1.15, 0.4, 16, 40, Math.PI / 1.8);
      const arcMat = new THREE.MeshBasicMaterial({
        color: 0xff3b00,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const arcMesh = new THREE.Mesh(arcGeo, arcMat);
      arcMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.scene.add(arcMesh);
      this.prominenceArcs.push(arcMesh);
    }
  }

  // Create customized textures for each planet
  generatePlanetTexture(type) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (type === "mercury") {
      ctx.fillStyle = "#8c8c8c";
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 200; i++) {
        ctx.fillStyle = `rgba(${100 + Math.random() * 60}, ${100 + Math.random() * 60}, ${100 + Math.random() * 60}, 0.5)`;
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === "venus") {
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, "#e8c87b");
      grad.addColorStop(0.5, "#d6a953");
      grad.addColorStop(1, "#c49339");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = "rgba(255, 235, 180, 0.18)";
        ctx.fillRect(0, Math.random() * 256, 512, 10 + Math.random() * 20);
      }
    } else if (type === "earth") {
      ctx.fillStyle = "#0c3b7a";
      ctx.fillRect(0, 0, 512, 256);
      ctx.fillStyle = "#2d7a42";
      // Continents
      ctx.beginPath();
      ctx.ellipse(130, 90, 45, 55, 0.2, 0, Math.PI * 2);
      ctx.ellipse(170, 180, 30, 45, 0.4, 0, Math.PI * 2);
      ctx.ellipse(320, 90, 70, 45, 0, 0, Math.PI * 2);
      ctx.ellipse(300, 150, 35, 50, 0, 0, Math.PI * 2);
      ctx.ellipse(390, 120, 35, 35, 0, 0, Math.PI * 2);
      ctx.ellipse(430, 190, 25, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      // Polar Ice
      ctx.fillStyle = "#e0f2fe";
      ctx.fillRect(0, 0, 512, 20);
      ctx.fillRect(0, 236, 512, 20);
    } else if (type === "mars") {
      ctx.fillStyle = "#c1440e";
      ctx.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 150; i++) {
        ctx.fillStyle = `rgba(${160 + Math.random() * 40}, ${50 + Math.random() * 30}, 20, 0.4)`;
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 15, 0, Math.PI * 2);
        ctx.fill();
      }
      // White Polar Ice Caps
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 12);
      ctx.fillRect(0, 244, 512, 12);
    } else if (type === "jupiter") {
      // Zonal atmospheric stripes
      const colors = ["#d4a373", "#faedcd", "#c58957", "#e9d8a6", "#b07d62", "#99582a", "#d4a373"];
      colors.forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.fillRect(0, idx * 36, 512, 40);
      });
      // Great Red Spot
      ctx.fillStyle = "#a8201a";
      ctx.beginPath();
      ctx.ellipse(320, 160, 25, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "saturn") {
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, "#e8d8b0");
      grad.addColorStop(0.3, "#dfc68d");
      grad.addColorStop(0.7, "#c9ae72");
      grad.addColorStop(1, "#b5995e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
    } else if (type === "uranus") {
      ctx.fillStyle = "#73d7eb";
      ctx.fillRect(0, 0, 512, 256);
    } else if (type === "neptune") {
      const grad = ctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, "#274be8");
      grad.addColorStop(0.5, "#3b6fe8");
      grad.addColorStop(1, "#1837b0");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
      // Faint white storm streaks
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(100, 110, 80, 4);
      ctx.fillRect(260, 150, 120, 5);
    } else if (type === "pluto") {
      ctx.fillStyle = "#c2a382";
      ctx.fillRect(0, 0, 512, 256);
      // Heart-shaped nitrogen glacier (Sputnik Planitia)
      ctx.fillStyle = "#f1e5d8";
      ctx.beginPath();
      ctx.ellipse(250, 130, 30, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  buildPlanets() {
    const planetKeys = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];

    planetKeys.forEach((key) => {
      const data = SOLAR_SYSTEM_DATA[key];
      if (!data) return;

      // Orbit Trail with glowing gradient
      const orbitCurve = new THREE.EllipseCurve(0, 0, data.orbitRadius, data.orbitRadius, 0, 2 * Math.PI, false, 0);
      const orbitPoints = orbitCurve.getPoints(140);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y)));
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.22
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.scene.add(orbitLine);
      this.orbitLines.push(orbitLine);

      // Planet Mesh with procedural canvas texture
      const geometry = new THREE.SphereGeometry(data.radiusRel, 48, 48);
      const texture = this.generatePlanetTexture(key);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.1
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { id: key, name: data.name };

      // Rings for Saturn & Uranus
      if (data.rings) {
        const ringGeo = new THREE.RingGeometry(data.rings.innerRadius, data.rings.outerRadius, 64);
        ringGeo.rotateX(Math.PI / 2.15);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(data.rings.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        mesh.add(ringMesh);
      }

      // Earth Cloud Layer & Moon
      if (key === "earth") {
        const cloudGeo = new THREE.SphereGeometry(data.radiusRel * 1.025, 32, 32);
        const cloudCanvas = document.createElement("canvas");
        cloudCanvas.width = 512;
        cloudCanvas.height = 256;
        const cCtx = cloudCanvas.getContext("2d");
        cCtx.fillStyle = "rgba(0,0,0,0)";
        cCtx.fillRect(0, 0, 512, 256);
        cCtx.fillStyle = "rgba(255, 255, 255, 0.45)";
        for (let i = 0; i < 120; i++) {
          cCtx.beginPath();
          cCtx.arc(Math.random() * 512, Math.random() * 256, 5 + Math.random() * 20, 0, Math.PI * 2);
          cCtx.fill();
        }
        const cloudMat = new THREE.MeshStandardMaterial({
          map: new THREE.CanvasTexture(cloudCanvas),
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending
        });
        const clouds = new THREE.Mesh(cloudGeo, cloudMat);
        mesh.add(clouds);
        this.earthClouds = clouds;

        // Moon
        const moonGeo = new THREE.SphereGeometry(SOLAR_SYSTEM_DATA.moon.radiusRel, 24, 24);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(SOLAR_SYSTEM_DATA.moon.orbitRadius, 0, 0);
        moonMesh.userData = { id: "moon", name: "The Moon (Luna)" };
        mesh.add(moonMesh);
        this.moonMesh = moonMesh;
      }

      const initialAngle = Math.random() * Math.PI * 2;
      mesh.position.set(
        Math.cos(initialAngle) * data.orbitRadius,
        0,
        Math.sin(initialAngle) * data.orbitRadius
      );

      this.scene.add(mesh);
      this.planets[key] = {
        mesh: mesh,
        data: data,
        angle: initialAngle
      };
    });
  }

  buildAsteroidBelt() {
    const count = 2200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const radius = 90 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const heightVar = (Math.random() - 0.5) * 6;

      positions[i] = Math.cos(theta) * radius;
      positions[i + 1] = heightVar;
      positions[i + 2] = Math.sin(theta) * radius;

      colors[i] = 0.75 + Math.random() * 0.2;
      colors[i + 1] = 0.65 + Math.random() * 0.2;
      colors[i + 2] = 0.55 + Math.random() * 0.2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    this.asteroidBelt = new THREE.Points(geometry, material);
    this.scene.add(this.asteroidBelt);
  }

  buildKuiperBelt() {
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const radius = 250 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const heightVar = (Math.random() - 0.5) * 12;

      positions[i] = Math.cos(theta) * radius;
      positions[i + 1] = heightVar;
      positions[i + 2] = Math.sin(theta) * radius;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 1.0,
      transparent: true,
      opacity: 0.5
    });

    this.kuiperBelt = new THREE.Points(geometry, material);
    this.scene.add(this.kuiperBelt);
  }

  // Cinematic Camera Presets (Overview, Inner Planets, Outer Giants, Pluto Edge)
  setCameraPreset(preset) {
    sound.playWarp();
    if (preset === "overview") {
      this.targetCameraPos = new THREE.Vector3(0, 220, 340);
      this.targetLookAt = new THREE.Vector3(0, 0, 0);
    } else if (preset === "inner") {
      this.targetCameraPos = new THREE.Vector3(0, 80, 110);
      this.targetLookAt = new THREE.Vector3(0, 0, 0);
    } else if (preset === "giants") {
      this.targetCameraPos = new THREE.Vector3(120, 140, 200);
      this.targetLookAt = new THREE.Vector3(60, 0, 60);
    } else if (preset === "edge") {
      this.targetCameraPos = new THREE.Vector3(220, 160, 280);
      this.targetLookAt = new THREE.Vector3(140, 0, 140);
    }
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = Object.values(this.planets).map(p => p.mesh);
    if (this.moonMesh) meshes.push(this.moonMesh);

    const intersects = this.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      let hit = intersects[0].object;
      while (hit && !hit.userData.id && hit.parent) {
        hit = hit.parent;
      }
      if (hit && hit.userData.id) {
        this.selectPlanet(hit.userData.id);
      }
    }
  }

  selectPlanet(id) {
    this.selectedPlanetId = id;
    sound.playPlanetSelect();
    auth.addXP(25);

    const data = id === "moon" ? SOLAR_SYSTEM_DATA.moon : SOLAR_SYSTEM_DATA[id];
    if (!data) return;

    let targetMesh = id === "moon" ? this.moonMesh : (this.planets[id] ? this.planets[id].mesh : null);
    if (targetMesh) {
      const worldPos = new THREE.Vector3();
      targetMesh.getWorldPosition(worldPos);

      const offsetDist = Math.max(data.radiusRel * 4, 12);
      this.targetCameraPos = new THREE.Vector3(
        worldPos.x + offsetDist,
        worldPos.y + (offsetDist * 0.4),
        worldPos.z + offsetDist
      );
      this.targetLookAt = worldPos;
      sound.playWarp();
    }

    this.renderTelemetryHUD(data);
  }

  renderTelemetryHUD(data) {
    const hud = document.getElementById("solarSystemHUD");
    if (!hud) return;

    hud.innerHTML = `
      <div class="glass-panel p-5 border border-cyan-500/50 rounded-2xl max-w-sm text-white shadow-2xl animate-fade-in space-y-3">
        <div class="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div class="flex items-center space-x-2.5">
            <span class="w-3.5 h-3.5 rounded-full animate-pulse shadow-md" style="background: ${data.color || '#00f3ff'}"></span>
            <div>
              <span class="text-[9px] uppercase font-mono tracking-widest text-cyan-400">NASA Solar Telemetry</span>
              <h3 class="text-xl font-bold tracking-wider uppercase text-cyan-300 font-mono leading-tight">${data.name}</h3>
            </div>
          </div>
          <button id="closeHudBtn" class="text-gray-400 hover:text-white transition-colors text-lg font-mono px-2 py-0.5 rounded hover:bg-white/10">✕</button>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-2 bg-black/50 rounded-lg border border-white/5">
            <span class="text-gray-400 block text-[10px]">Classification</span>
            <span class="font-medium text-cyan-200">${data.type}</span>
          </div>
          <div class="p-2 bg-black/50 rounded-lg border border-white/5">
            <span class="text-gray-400 block text-[10px]">Surface Temp</span>
            <span class="font-medium text-amber-300">${data.surfaceTemp}</span>
          </div>
          <div class="p-2 bg-black/50 rounded-lg border border-white/5">
            <span class="text-gray-400 block text-[10px]">Surface Gravity</span>
            <span class="font-medium text-cyan-200">${data.gravity}</span>
          </div>
          <div class="p-2 bg-black/50 rounded-lg border border-white/5">
            <span class="text-gray-400 block text-[10px]">Radius</span>
            <span class="font-medium text-cyan-200">${data.radiusKm.toLocaleString()} km</span>
          </div>
        </div>

        <div class="pt-2 text-xs text-gray-300 leading-relaxed border-t border-cyan-500/20">
          <p class="mb-1"><strong class="text-cyan-300 font-mono">Atmosphere:</strong> ${data.atmosphere}</p>
          <p class="italic text-gray-400 text-[11px]">"${data.description}"</p>
        </div>

        ${data.funFact ? `
        <div class="p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-[11px] text-cyan-200">
          💡 <strong>NASA Discovery:</strong> ${data.funFact}
        </div>` : ''}

        ${data.keyMissions ? `
        <div class="text-[11px]">
          <span class="text-gray-400 font-semibold font-mono">Key Space Missions:</span>
          <div class="flex flex-wrap gap-1 mt-1">
            ${data.keyMissions.map(m => `<span class="px-2 py-0.5 bg-blue-950/80 text-blue-200 rounded-md border border-blue-500/40 text-[10px]">${m}</span>`).join('')}
          </div>
        </div>` : ''}
      </div>
    `;

    document.getElementById("closeHudBtn")?.addEventListener("click", () => {
      sound.playClick();
      hud.innerHTML = "";
      this.selectedPlanetId = null;
      this.targetCameraPos = new THREE.Vector3(0, 190, 320);
      this.targetLookAt = new THREE.Vector3(0, 0, 0);
    });
  }

  bindUIControls() {
    const planetSelect = document.getElementById("solarPlanetSelect");
    if (planetSelect) {
      planetSelect.addEventListener("change", (e) => {
        if (e.target.value) this.selectPlanet(e.target.value);
      });
    }

    // Camera preset buttons
    const presetBtns = document.querySelectorAll(".solar-cam-preset-btn");
    presetBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        presetBtns.forEach(b => b.classList.remove("active-filter"));
        btn.classList.add("active-filter");
        this.setCameraPreset(btn.dataset.preset);
      });
    });

    const speedSlider = document.getElementById("solarSpeedSlider");
    const speedDisplay = document.getElementById("solarSpeedDisplay");
    if (speedSlider) {
      speedSlider.addEventListener("input", (e) => {
        this.timeSpeed = parseFloat(e.target.value);
        if (speedDisplay) speedDisplay.innerText = `${this.timeSpeed}x`;
      });
    }

    const pauseBtn = document.getElementById("solarPauseBtn");
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        sound.playClick();
        this.isPaused = !this.isPaused;
        pauseBtn.innerHTML = this.isPaused ? `<i data-lucide="play" class="w-3.5 h-3.5"></i> <span>Resume</span>` : `<i data-lucide="pause" class="w-3.5 h-3.5"></i> <span>Pause</span>`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    const orbitToggle = document.getElementById("solarOrbitToggle");
    if (orbitToggle) {
      orbitToggle.addEventListener("change", (e) => {
        this.showOrbits = e.target.checked;
        this.orbitLines.forEach(l => l.visible = this.showOrbits);
      });
    }
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    // Rotate Sun & Corona
    if (this.planets["sun"]) {
      this.planets["sun"].mesh.rotation.y += 0.002;
    }
    if (this.sunCorona) {
      this.sunCorona.rotation.z += 0.001;
      this.sunCorona.rotation.y += 0.0015;
    }

    // Pulsate Solar Prominences
    this.prominenceArcs.forEach((arc, i) => {
      arc.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1);
      arc.scale.setScalar(1 + Math.sin(Date.now() * 0.002 + i) * 0.04);
    });

    // Rotate Asteroid Belt & Kuiper Belt
    if (this.asteroidBelt && !this.isPaused) {
      this.asteroidBelt.rotation.y += 0.0004 * this.timeSpeed;
    }
    if (this.kuiperBelt && !this.isPaused) {
      this.kuiperBelt.rotation.y += 0.00015 * this.timeSpeed;
    }

    // Orbit & Rotate Planets
    if (!this.isPaused) {
      Object.keys(this.planets).forEach((key) => {
        if (key === "sun") return;
        const p = this.planets[key];
        const data = p.data;

        p.angle += (data.orbitSpeed || 0.005) * 0.5 * this.timeSpeed;
        p.mesh.position.x = Math.cos(p.angle) * data.orbitRadius;
        p.mesh.position.z = Math.sin(p.angle) * data.orbitRadius;

        p.mesh.rotation.y += 0.01;
      });

      if (this.earthClouds) {
        this.earthClouds.rotation.y += 0.014;
      }

      if (this.moonMesh) {
        this.moonMesh.rotation.y += 0.02;
      }
    }

    // Smooth Camera Fly-To Lerp
    if (this.targetCameraPos && this.targetLookAt) {
      this.camera.position.lerp(this.targetCameraPos, 0.04);
      if (this.controls) {
        this.controls.target.lerp(this.targetLookAt, 0.04);
      }
      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.5) {
        this.targetCameraPos = null;
        this.targetLookAt = null;
      }
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
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
