// ============================================================================
// COSMIC EXPLORER - 3D SPACE TELESCOPES & EXOPLANET OBSERVATORY
// 3D Space Telescopes (JWST, Hubble, Spitzer, Chandra, Kepler, Aditya-L1, Voyager)
// ============================================================================

import { TELESCOPES_DATA, EXOPLANETS_DATA, DEEP_SPACE_DATA } from "./data/spaceData.js";
import { sound } from "./audio.js";
import { auth } from "./auth.js";

export class TelescopeObservatory {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.telescopeGroup = null;
    this.currentTelescopeId = "jwst";
    this.currentTargetId = "trappist1e";
    this.currentFilter = "infrared";
    this.animationFrameId = null;
    this.targetExoplanetMesh = null;
    this.targetDistantGroup = null;
  }

  init() {
    if (!this.container || typeof THREE === "undefined") return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3000);
    this.camera.position.set(22, 12, 28);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // Orbit Controls
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 140;
      this.controls.minDistance = 5;
    }

    // Build World
    this.buildStarfield();
    this.buildLighting();
    this.populateTelescopeDropdown();
    this.loadTelescopeModel(this.currentTelescopeId);
    this.buildDistantTargets();

    // Event Listeners
    window.addEventListener("resize", () => this.onResize());
    this.bindUI();
    this.updateHUD();
    this.animate();
  }

  populateTelescopeDropdown() {
    const teleSelect = document.getElementById("telescopeSelect");
    if (!teleSelect) return;

    teleSelect.innerHTML = TELESCOPES_DATA.map(t => `
      <option value="${t.id}" ${t.id === this.currentTelescopeId ? "selected" : ""}>
        ${t.name} [${t.agency}]
      </option>
    `).join("");
  }

  buildStarfield() {
    const starCount = 3500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 800 + Math.random() * 1200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      colors[i] = 0.8 + Math.random() * 0.2;
      colors[i + 1] = 0.85 + Math.random() * 0.15;
      colors[i + 2] = 1.0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    const starfield = new THREE.Points(geometry, material);
    this.scene.add(starfield);
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0x334466, 1.2);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    mainLight.position.set(30, 40, 20);
    this.scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x00f3ff, 1.0);
    rimLight.position.set(-30, -20, -20);
    this.scene.add(rimLight);
  }

  loadTelescopeModel(type) {
    if (this.telescopeGroup) {
      this.scene.remove(this.telescopeGroup);
    }

    this.telescopeGroup = new THREE.Group();

    if (type === "jwst") {
      this.buildJWSTModel(this.telescopeGroup);
    } else if (type === "hubble") {
      this.buildHubbleModel(this.telescopeGroup);
    } else if (type === "spitzer") {
      this.buildSpitzerModel(this.telescopeGroup);
    } else if (type === "chandra") {
      this.buildChandraModel(this.telescopeGroup);
    } else if (type === "aditya_l1") {
      this.buildAdityaModel(this.telescopeGroup);
    } else if (type === "voyager1") {
      this.buildVoyagerModel(this.telescopeGroup);
    } else {
      this.buildGenericTelescope(this.telescopeGroup);
    }

    this.scene.add(this.telescopeGroup);
  }

  // 1. James Webb Space Telescope (JWST)
  buildJWSTModel(group) {
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 14);
    shieldShape.lineTo(6.5, 4);
    shieldShape.lineTo(7.5, -6);
    shieldShape.lineTo(0, -14);
    shieldShape.lineTo(-7.5, -6);
    shieldShape.lineTo(-6.5, 4);
    shieldShape.closePath();

    const shieldGeo = new THREE.ShapeGeometry(shieldShape);
    shieldGeo.rotateX(Math.PI / 2);

    for (let l = 0; l < 5; l++) {
      const shieldMat = new THREE.MeshStandardMaterial({
        color: l === 0 ? 0xffbbcc : 0xd8d8d8,
        roughness: 0.2,
        metalness: 0.9,
        side: THREE.DoubleSide
      });
      const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldMesh.position.y = -2.5 - (l * 0.35);
      shieldMesh.scale.set(1 - (l * 0.04), 1 - (l * 0.04), 1 - (l * 0.04));
      group.add(shieldMesh);
    }

    const busGeo = new THREE.BoxGeometry(4, 2, 4);
    const busMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
    const bus = new THREE.Mesh(busGeo, busMat);
    bus.position.set(0, -5, 0);
    group.add(bus);

    const solarGeo = new THREE.BoxGeometry(2, 0.2, 8);
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x113377, metalness: 0.9, roughness: 0.2 });
    const solar = new THREE.Mesh(solarGeo, solarMat);
    solar.position.set(0, -5.5, -7);
    group.add(solar);

    const mirrorBackplaneGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.5, 6);
    mirrorBackplaneGeo.rotateX(Math.PI / 2);
    const backplaneMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6 });
    const backplane = new THREE.Mesh(mirrorBackplaneGeo, backplaneMat);
    backplane.position.set(0, 1.5, 0);
    group.add(backplane);

    const hexRadius = 0.9;
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x664400,
      emissiveIntensity: 0.3
    });

    const hexPositions = [
      [0, 1.6], [1.38, 0.8], [1.38, -0.8], [0, -1.6], [-1.38, -0.8], [-1.38, 0.8],
      [0, 3.2], [1.38, 2.4], [2.77, 1.6], [2.77, 0], [2.77, -1.6], [1.38, -2.4],
      [0, -3.2], [-1.38, -2.4], [-2.77, -1.6], [-2.77, 0], [-2.77, 1.6], [-1.38, 2.4]
    ];

    hexPositions.forEach(([hx, hy]) => {
      const hexGeo = new THREE.CylinderGeometry(hexRadius * 0.94, hexRadius * 0.94, 0.15, 6);
      hexGeo.rotateX(Math.PI / 2);
      const hexMesh = new THREE.Mesh(hexGeo, goldMat);
      hexMesh.position.set(hx, 1.8 + hy, 0.3);
      group.add(hexMesh);
    });

    const strutMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8 });
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const strutGeo = new THREE.CylinderGeometry(0.08, 0.08, 8.5);
      const strut = new THREE.Mesh(strutGeo, strutMat);
      strut.position.set(Math.sin(angle) * 2.5, 1.8 + Math.cos(angle) * 2.5, 3.8);
      strut.rotation.x = -Math.PI / 3.8;
      strut.rotation.y = angle;
      group.add(strut);
    }

    const secMirrorGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
    secMirrorGeo.rotateX(Math.PI / 2);
    const secMirror = new THREE.Mesh(secMirrorGeo, goldMat);
    secMirror.position.set(0, 1.8, 7.5);
    group.add(secMirror);
  }

  // 2. Hubble Space Telescope (HST)
  buildHubbleModel(group) {
    const bodyGeo = new THREE.CylinderGeometry(2.4, 2.4, 10, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.85, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const frontGeo = new THREE.CylinderGeometry(2.1, 2.4, 3, 32);
    const frontMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5 });
    const front = new THREE.Mesh(frontGeo, frontMat);
    front.rotation.x = Math.PI / 2;
    front.position.z = 6;
    group.add(front);

    const doorGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.2, 32);
    doorGeo.rotateX(Math.PI / 2);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xbbbbbb, metalness: 0.9 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2.0, 7.4);
    door.rotation.x = -Math.PI / 4;
    group.add(door);

    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1a3388, metalness: 0.8, roughness: 0.2 });
    for (let side of [-1, 1]) {
      const wingGeo = new THREE.BoxGeometry(0.2, 3, 9);
      const wing = new THREE.Mesh(wingGeo, solarMat);
      wing.position.set(side * 6.5, 0, 0);
      group.add(wing);

      const boomGeo = new THREE.CylinderGeometry(0.15, 0.15, 4.5);
      boomGeo.rotateZ(Math.PI / 2);
      const boom = new THREE.Mesh(boomGeo, bodyMat);
      boom.position.set(side * 3.5, 0, 0);
      group.add(boom);
    }
  }

  // 3. Spitzer Space Telescope
  buildSpitzerModel(group) {
    const cryoGeo = new THREE.CylinderGeometry(2.2, 2.2, 7, 24);
    const cryoMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const cryo = new THREE.Mesh(cryoGeo, cryoMat);
    group.add(cryo);

    // Solar shield curved shell
    const shieldGeo = new THREE.CylinderGeometry(2.6, 2.6, 7.5, 24, 1, true, 0, Math.PI);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0x1a3388, metalness: 0.9, roughness: 0.2, side: THREE.DoubleSide });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.z = 0.4;
    group.add(shield);
  }

  // 4. Chandra X-ray Observatory
  buildChandraModel(group) {
    const tubeGeo = new THREE.CylinderGeometry(1.6, 2.4, 13, 24);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.85 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.x = Math.PI / 2;
    group.add(tube);

    const solarMat = new THREE.MeshStandardMaterial({ color: 0x113388, metalness: 0.8 });
    for (let side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.5, 7), solarMat);
      wing.position.set(side * 5.5, 0, -2);
      group.add(wing);
    }
  }

  // 5. Aditya-L1 ISRO Solar Observatory
  buildAdityaModel(group) {
    const busGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5);
    const busMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.85 });
    const bus = new THREE.Mesh(busGeo, busMat);
    group.add(bus);

    // VELC Coronagraph Aperture
    const velcGeo = new THREE.CylinderGeometry(0.9, 0.9, 3, 16);
    velcGeo.rotateX(Math.PI / 2);
    const velcMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5 });
    const velc = new THREE.Mesh(velcGeo, velcMat);
    velc.position.set(0, 0, 3);
    group.add(velc);

    // Solar Wings with ISRO Blue Cells
    const isroSolarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 });
    for (let side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(7, 0.15, 2.8), isroSolarMat);
      wing.position.set(side * 6, 0, 0);
      group.add(wing);
    }
  }

  // 6. Voyager 1 & 2 Interstellar Probes
  buildVoyagerModel(group) {
    // 3.7m High Gain Radio Dish
    const dishGeo = new THREE.SphereGeometry(4.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, metalness: 0.6, side: THREE.DoubleSide });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI;
    dish.position.y = 2;
    group.add(dish);

    // Instrument Bus
    const busGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.5, 10);
    const busMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const bus = new THREE.Mesh(busGeo, busMat);
    bus.position.y = -0.5;
    group.add(bus);

    // Long Magnetometer Boom
    const boomGeo = new THREE.CylinderGeometry(0.08, 0.08, 14);
    const boomMat = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const boom = new THREE.Mesh(boomGeo, boomMat);
    boom.rotation.z = Math.PI / 3;
    boom.position.set(6, -2, 0);
    group.add(boom);

    // RTG Power Generator Boom
    const rtgGeo = new THREE.CylinderGeometry(0.4, 0.4, 4);
    const rtgMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const rtg = new THREE.Mesh(rtgGeo, rtgMat);
    rtg.rotation.z = -Math.PI / 3;
    rtg.position.set(-3.5, -2, 0);
    group.add(rtg);
  }

  buildGenericTelescope(group) {
    const bodyGeo = new THREE.CylinderGeometry(2, 2.5, 8, 24);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);
  }

  buildDistantTargets() {
    this.targetDistantGroup = new THREE.Group();
    this.scene.add(this.targetDistantGroup);
    this.updateTargetExoplanet();
  }

  updateTargetExoplanet() {
    if (!this.targetDistantGroup) return;
    this.targetDistantGroup.clear();

    const exo = EXOPLANETS_DATA.find(e => e.id === this.currentTargetId) || EXOPLANETS_DATA[0];

    const exoGeo = new THREE.SphereGeometry(6.5, 32, 32);
    const exoMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(exo.visualColor || "#39a085"),
      roughness: 0.5,
      metalness: 0.1
    });
    this.targetExoplanetMesh = new THREE.Mesh(exoGeo, exoMat);
    this.targetExoplanetMesh.position.set(80, 25, -120);

    const atmoGeo = new THREE.SphereGeometry(7.2, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(exo.visualColor || "#00f3ff"),
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide
    });
    const atmo = new THREE.Mesh(atmoGeo, atmoMat);
    this.targetExoplanetMesh.add(atmo);

    this.targetDistantGroup.add(this.targetExoplanetMesh);
  }

  slewTelescopeToTarget(targetId) {
    this.currentTargetId = targetId;
    sound.playTelescopeSlew();
    auth.addXP(20);

    this.updateTargetExoplanet();

    if (this.telescopeGroup) {
      this.targetTelescopeRot = {
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 0.8,
        z: (Math.random() - 0.5) * 0.3
      };
    }

    this.updateHUD();
  }

  setTelescope(telescopeId) {
    this.currentTelescopeId = telescopeId;
    sound.playClick();
    this.loadTelescopeModel(telescopeId);
    this.updateHUD();
  }

  setFilter(filterName) {
    this.currentFilter = filterName;
    sound.playClick();
    this.updateHUD();
  }

  updateHUD() {
    const teleData = TELESCOPES_DATA.find(t => t.id === this.currentTelescopeId) || TELESCOPES_DATA[0];
    const exoData = EXOPLANETS_DATA.find(e => e.id === this.currentTargetId) || EXOPLANETS_DATA[0];

    const teleHud = document.getElementById("telescopeSpecPanel");
    const viewportHud = document.getElementById("telescopeViewportPanel");

    if (teleHud) {
      teleHud.innerHTML = `
        <div class="glass-panel p-5 border border-cyan-500/40 rounded-xl text-white space-y-3.5 max-h-[580px] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
            <div>
              <span class="text-[10px] uppercase font-mono tracking-widest text-cyan-400">Space Observatory & Satellite</span>
              <h3 class="text-base font-bold text-white font-mono leading-tight">${teleData.name}</h3>
            </div>
            <span class="px-2 py-0.5 text-[11px] rounded-full bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 font-mono">${teleData.status.split(" ")[0]}</span>
          </div>

          <!-- Comprehensive History Log -->
          <div class="p-2.5 bg-blue-950/40 rounded border border-blue-500/30 text-xs text-blue-200 leading-relaxed">
            <strong class="text-cyan-300 font-mono block mb-1">📜 Mission History & Legacy:</strong>
            ${teleData.history || teleData.missionGoals}
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2 bg-black/40 rounded border border-white/5">
              <span class="text-gray-400 block text-[10px]">Space Agency</span>
              <span class="font-medium text-cyan-200">${teleData.agency}</span>
            </div>
            <div class="p-2 bg-black/40 rounded border border-white/5">
              <span class="text-gray-400 block text-[10px]">Launch Date</span>
              <span class="font-medium text-cyan-200">${teleData.launchDate}</span>
            </div>
            <div class="p-2 bg-black/40 rounded border border-white/5">
              <span class="text-gray-400 block text-[10px]">Orbit Location</span>
              <span class="font-medium text-cyan-200">${teleData.orbitLocation}</span>
            </div>
            <div class="p-2 bg-black/40 rounded border border-white/5">
              <span class="text-gray-400 block text-[10px]">Primary Optics</span>
              <span class="font-medium text-amber-300">${teleData.primaryMirrorDiameter}</span>
            </div>
          </div>

          <div class="text-xs">
            <span class="text-gray-400 font-semibold block mb-1">Scientific Payload / Instruments:</span>
            <ul class="space-y-0.5 text-cyan-100/90 text-[11px] list-disc list-inside">
              ${teleData.instruments.map(inst => `<li>${inst}</li>`).join("")}
            </ul>
          </div>

          <div class="p-2 bg-cyan-950/30 rounded border border-cyan-500/20 text-[11px] text-gray-300">
            <strong class="text-cyan-300">Groundbreaking Breakthrough:</strong> ${teleData.discoveries[0]}
          </div>
        </div>
      `;
    }

    if (viewportHud) {
      viewportHud.innerHTML = `
        <div class="glass-panel p-5 border border-purple-500/40 rounded-xl text-white space-y-3.5">
          <div class="flex items-center justify-between border-b border-purple-500/30 pb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full animate-ping" style="background: ${exoData.visualColor || '#a855f7'}"></span>
              <div>
                <span class="text-[10px] uppercase font-mono tracking-widest text-purple-300">Telescope Viewport Lock-On</span>
                <h4 class="text-base font-bold text-white font-mono leading-tight">${exoData.name}</h4>
              </div>
            </div>
            <span class="text-xs font-mono text-purple-300">${exoData.distanceLightYears} LY</span>
          </div>

          <p class="text-xs text-gray-300 italic">"${exoData.description}"</p>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2 bg-black/40 rounded border border-white/5">
              <span class="text-gray-400 block text-[10px]">Host Star</span>
              <span class="font-medium text-purple-200">${exoData.hostStar}</span>
            </div>
            <div class="p-2 bg-black/40 rounded border border-white/5">
              <span class="text-gray-400 block text-[10px]">Surface Temp Est.</span>
              <span class="font-medium text-amber-300">${exoData.surfaceTempEst}</span>
            </div>
          </div>

          <div class="p-2.5 bg-purple-950/40 rounded-lg border border-purple-500/30">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-[11px] font-bold text-purple-300 font-mono">📡 Spectroscopy Biosignatures:</span>
              <span class="text-[10px] text-gray-400">${this.currentFilter.toUpperCase()} Spectrum</span>
            </div>
            <div class="grid grid-cols-4 gap-1 text-center text-[10px]">
              <div class="p-1 bg-black/50 rounded border border-cyan-500/30">
                <span class="block text-cyan-300 font-bold">H₂O</span>
                <span class="text-gray-300">${exoData.spectralSignature.h2o}</span>
              </div>
              <div class="p-1 bg-black/50 rounded border border-amber-500/30">
                <span class="block text-amber-300 font-bold">CO₂</span>
                <span class="text-gray-300">${exoData.spectralSignature.co2}</span>
              </div>
              <div class="p-1 bg-black/50 rounded border border-emerald-500/30">
                <span class="block text-emerald-300 font-bold">O₂</span>
                <span class="text-gray-300">${exoData.spectralSignature.o2}</span>
              </div>
              <div class="p-1 bg-black/50 rounded border border-purple-500/30">
                <span class="block text-purple-300 font-bold">CH₄</span>
                <span class="text-gray-300">${exoData.spectralSignature.ch4}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  bindUI() {
    const teleSelect = document.getElementById("telescopeSelect");
    if (teleSelect) {
      teleSelect.addEventListener("change", (e) => this.setTelescope(e.target.value));
    }

    const targetSelect = document.getElementById("telescopeTargetSelect");
    if (targetSelect) {
      targetSelect.addEventListener("change", (e) => this.slewTelescopeToTarget(e.target.value));
    }

    const filterBtns = document.querySelectorAll(".spectrum-filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active-filter"));
        btn.classList.add("active-filter");
        this.setFilter(btn.dataset.filter);
      });
    });
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.telescopeGroup) {
      this.telescopeGroup.rotation.y += 0.001;
      if (this.targetTelescopeRot) {
        this.telescopeGroup.rotation.x = THREE.MathUtils.lerp(this.telescopeGroup.rotation.x, this.targetTelescopeRot.x, 0.03);
        this.telescopeGroup.rotation.z = THREE.MathUtils.lerp(this.telescopeGroup.rotation.z, this.targetTelescopeRot.z, 0.03);
      }
    }

    if (this.targetExoplanetMesh) {
      this.targetExoplanetMesh.rotation.y += 0.005;
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
