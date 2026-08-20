// ============================================================================
// COSMIC EXPLORER - 3D DEEP SPACE, SPIRAL GALAXIES & BLACK HOLE ENGINE
// WebGL volumetric particle simulations & relativistic accretion disks
// ============================================================================

import { DEEP_SPACE_DATA } from "./data/spaceData.js";
import { sound } from "./audio.js";
import { auth } from "./auth.js";

export class DeepGalaxyEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.galaxyObject = null;
    this.currentMode = "milkyway";
    this.particleCount = 70000;
    this.rotationSpeed = 0.001;
    this.animationFrameId = null;
    this.wavelength = "optical";
  }

  init() {
    if (!this.container || typeof THREE === "undefined") return;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 4000);
    this.camera.position.set(0, 140, 220);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxDistance = 1200;
      this.controls.minDistance = 10;
    }

    // Build Current Mode
    this.loadObject(this.currentMode);

    // Event Listeners
    window.addEventListener("resize", () => this.onResize());
    this.bindUI();
    this.updateHUD();
    this.animate();
  }

  loadObject(type) {
    if (this.galaxyObject) {
      this.scene.remove(this.galaxyObject);
      this.galaxyObject = null;
    }

    this.currentMode = type;
    this.galaxyObject = new THREE.Group();

    if (type === "milkyway") {
      this.buildSpiralGalaxy(this.galaxyObject, 4, 180, 0.35);
    } else if (type === "andromeda") {
      this.buildAndromeda(this.galaxyObject);
    } else if (type === "gargantua") {
      this.buildBlackHole(this.galaxyObject);
    } else if (type === "nebula") {
      this.buildNebula(this.galaxyObject);
    } else if (type === "cosmic_web") {
      this.buildCosmicWeb(this.galaxyObject);
    }

    this.scene.add(this.galaxyObject);
  }

  // 1. Logarithmic Spiral Galaxy (Milky Way)
  buildSpiralGalaxy(group, numArms = 4, maxRadius = 180, armTightness = 0.35) {
    const count = this.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      // Distance from center with dense core weighting
      const r = Math.pow(Math.random(), 2.2) * maxRadius;
      const armIndex = i % numArms;
      const armAngle = (armIndex * 2 * Math.PI) / numArms;
      const spiralOffset = r * armTightness;

      // Random dispersion around the arm
      const spread = (Math.random() - 0.5) * (15 + r * 0.15);
      const angle = armAngle + spiralOffset + (Math.random() - 0.5) * 0.4;
      const height = (Math.random() - 0.5) * (maxRadius * 0.15) * Math.exp(-r / 60);

      positions[i] = Math.cos(angle) * r + spread;
      positions[i + 1] = height;
      positions[i + 2] = Math.sin(angle) * r + spread;

      // Color based on distance from core (Golden yellow core -> Blue-white arms)
      const distRatio = r / maxRadius;
      if (distRatio < 0.15) {
        // Bright galactic core
        colors[i] = 1.0;
        colors[i + 1] = 0.85;
        colors[i + 2] = 0.5;
      } else if (distRatio < 0.6) {
        // Mid-disc
        colors[i] = 0.6 + Math.random() * 0.4;
        colors[i + 1] = 0.7 + Math.random() * 0.3;
        colors[i + 2] = 1.0;
      } else {
        // Outer arms (HII hydrogen regions / faint stars)
        colors[i] = 0.4 + Math.random() * 0.6;
        colors[i + 1] = 0.3 + Math.random() * 0.4;
        colors[i + 2] = 0.9;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    // Galactic Core Supermassive Glow
    const coreGeo = new THREE.SphereGeometry(6, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffeedd,
      transparent: true,
      opacity: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);
  }

  // 2. Andromeda Galaxy (M31) Dual Spiral Collision
  buildAndromeda(group) {
    this.buildSpiralGalaxy(group, 2, 220, 0.28);

    // Satellite Dwarf Galaxy (M32 / M110)
    const dwarfGeo = new THREE.BufferGeometry();
    const dCount = 5000;
    const dPos = new Float32Array(dCount * 3);
    const dCol = new Float32Array(dCount * 3);

    for (let i = 0; i < dCount * 3; i += 3) {
      const r = Math.pow(Math.random(), 1.5) * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      dPos[i] = 120 + r * Math.sin(phi) * Math.cos(theta);
      dPos[i + 1] = 40 + r * Math.sin(phi) * Math.sin(theta);
      dPos[i + 2] = -60 + r * Math.cos(phi);

      dCol[i] = 0.9; dCol[i + 1] = 0.8; dCol[i + 2] = 0.6;
    }
    dwarfGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    dwarfGeo.setAttribute("color", new THREE.BufferAttribute(dCol, 3));

    const dwarfMat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
    group.add(new THREE.Points(dwarfGeo, dwarfMat));
  }

  // 3. Gargantua Supermassive Black Hole with Relativistic Accretion Disk & Jets
  buildBlackHole(group) {
    // Event Horizon (Absolute Black Sphere)
    const horizonGeo = new THREE.SphereGeometry(18, 64, 64);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    group.add(horizon);

    // Photon Sphere Ring (Glowing border of light orbiting event horizon)
    const photonRingGeo = new THREE.TorusGeometry(18.5, 0.8, 16, 100);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    photonRing.rotation.x = Math.PI / 2;
    group.add(photonRing);

    // Relativistic Accretion Disk (Particle system glowing orange/gold)
    const diskCount = 35000;
    const diskGeo = new THREE.BufferGeometry();
    const diskPos = new Float32Array(diskCount * 3);
    const diskCol = new Float32Array(diskCount * 3);

    for (let i = 0; i < diskCount * 3; i += 3) {
      const r = 22 + Math.pow(Math.random(), 1.5) * 85;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * (1.5 + (r - 22) * 0.08);

      diskPos[i] = Math.cos(angle) * r;
      diskPos[i + 1] = height;
      diskPos[i + 2] = Math.sin(angle) * r;

      // Doppler beaming / temperature gradient
      const innerRatio = 1 - ((r - 22) / 85);
      diskCol[i] = 1.0;
      diskCol[i + 1] = 0.3 + innerRatio * 0.65;
      diskCol[i + 2] = innerRatio * 0.8;
    }

    diskGeo.setAttribute("position", new THREE.BufferAttribute(diskPos, 3));
    diskGeo.setAttribute("color", new THREE.BufferAttribute(diskCol, 3));

    const diskMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const accretionDisk = new THREE.Points(diskGeo, diskMat);
    group.add(accretionDisk);

    // Gravitational Lensing Overhead Warp Ring (Interstellar Gargantua Effect)
    const lensRingGeo = new THREE.TorusGeometry(32, 2.5, 32, 100);
    const lensRingMat = new THREE.MeshBasicMaterial({
      color: 0xff9922,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const lensRing = new THREE.Mesh(lensRingGeo, lensRingMat);
    group.add(lensRing);

    // Relativistic Polar Jets
    for (let dir of [-1, 1]) {
      const jetCount = 2500;
      const jetGeo = new THREE.BufferGeometry();
      const jPos = new Float32Array(jetCount * 3);
      const jCol = new Float32Array(jetCount * 3);

      for (let j = 0; j < jetCount * 3; j += 3) {
        const dist = Math.random() * 120;
        const spread = (dist * 0.08) * (Math.random() - 0.5);
        jPos[j] = spread * 8;
        jPos[j + 1] = dir * dist;
        jPos[j + 2] = spread * 8;

        jCol[j] = 0.2;
        jCol[j + 1] = 0.7 + Math.random() * 0.3;
        jCol[j + 2] = 1.0;
      }
      jetGeo.setAttribute("position", new THREE.BufferAttribute(jPos, 3));
      jetGeo.setAttribute("color", new THREE.BufferAttribute(jCol, 3));
      const jetMat = new THREE.PointsMaterial({ size: 2.0, vertexColors: true, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending });
      group.add(new THREE.Points(jetGeo, jetMat));
    }
  }

  // 4. Interstellar Nebula
  buildNebula(group) {
    const count = 40000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const r = Math.pow(Math.random(), 1.2) * 110;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i] = r * Math.sin(phi) * Math.cos(theta) + (Math.sin(theta * 3) * 20);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta) + (Math.cos(phi * 2) * 15);
      positions[i + 2] = r * Math.cos(phi);

      // Gas coloration: Ionized Oxygen (Teal) & Hydrogen-Alpha (Deep Red/Magenta)
      const tint = Math.random();
      if (tint > 0.5) {
        colors[i] = 0.9; colors[i + 1] = 0.2; colors[i + 2] = 0.5; // H-Alpha
      } else {
        colors[i] = 0.1; colors[i + 1] = 0.8; colors[i + 2] = 0.9; // [OIII] Oxygen
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    group.add(new THREE.Points(geometry, material));
  }

  // 5. Cosmic Web (Large-Scale Universe Filaments)
  buildCosmicWeb(group) {
    const nodes = [];
    const nodeCount = 60;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 260,
        (Math.random() - 0.5) * 260,
        (Math.random() - 0.5) * 260
      ));
    }

    const lineGeo = new THREE.BufferGeometry();
    const linePoints = [];

    // Connect closest nodes with dark matter filaments
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 80) {
          linePoints.push(nodes[i], nodes[j]);
        }
      }
    }

    lineGeo.setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.35
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // Nodes as galaxy clusters
    const nodeClusterGeo = new THREE.BufferGeometry().setFromPoints(nodes);
    const nodeClusterMat = new THREE.PointsMaterial({
      color: 0x00f3ff,
      size: 4.5,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    group.add(new THREE.Points(nodeClusterGeo, nodeClusterMat));
  }

  bindUI() {
    const objSelect = document.getElementById("deepSpaceSelect");
    if (objSelect) {
      objSelect.addEventListener("change", (e) => {
        sound.playWarp();
        auth.addXP(25);
        this.loadObject(e.target.value);
        this.updateHUD();
      });
    }

    const particleSlider = document.getElementById("galaxyParticleSlider");
    if (particleSlider) {
      particleSlider.addEventListener("change", (e) => {
        this.particleCount = parseInt(e.target.value);
        this.loadObject(this.currentMode);
      });
    }

    const speedSlider = document.getElementById("galaxySpeedSlider");
    if (speedSlider) {
      speedSlider.addEventListener("input", (e) => {
        this.rotationSpeed = parseFloat(e.target.value) * 0.001;
      });
    }
  }

  updateHUD() {
    const data = DEEP_SPACE_DATA[this.currentMode];
    const hud = document.getElementById("deepSpaceHUD");
    if (!hud) return;

    if (!data) {
      hud.innerHTML = "";
      return;
    }

    hud.innerHTML = `
      <div class="glass-panel p-5 border border-purple-500/40 rounded-xl text-white max-w-sm">
        <div class="border-b border-purple-500/30 pb-3 mb-3">
          <span class="text-[10px] uppercase font-mono tracking-widest text-purple-300">Cosmological Entity</span>
          <h3 class="text-xl font-bold text-white font-mono">${data.name}</h3>
          <span class="text-xs text-purple-200">${data.type}</span>
        </div>

        <div class="space-y-2 text-xs">
          ${data.diameterLightYears ? `
          <div class="flex justify-between py-1 border-b border-white/5">
            <span class="text-gray-400">Diameter:</span>
            <span class="font-medium text-purple-200">${data.diameterLightYears.toLocaleString()} Light Years</span>
          </div>` : ''}
          ${data.starsCount ? `
          <div class="flex justify-between py-1 border-b border-white/5">
            <span class="text-gray-400">Estimated Stars:</span>
            <span class="font-medium text-purple-200">${data.starsCount}</span>
          </div>` : ''}
          ${data.centralObject ? `
          <div class="flex justify-between py-1 border-b border-white/5">
            <span class="text-gray-400">Galactic Core:</span>
            <span class="font-medium text-amber-300">${data.centralObject}</span>
          </div>` : ''}
          ${data.mass ? `
          <div class="flex justify-between py-1 border-b border-white/5">
            <span class="text-gray-400">Total Mass:</span>
            <span class="font-medium text-amber-300">${data.mass}</span>
          </div>` : ''}
          ${data.eventHorizonRadius ? `
          <div class="flex justify-between py-1 border-b border-white/5">
            <span class="text-gray-400">Schwarzschild Radius:</span>
            <span class="font-medium text-purple-200">${data.eventHorizonRadius}</span>
          </div>` : ''}
        </div>

        <div class="mt-3 pt-3 border-t border-purple-500/20 text-xs text-gray-300 italic leading-relaxed">
          "${data.description}"
        </div>
      </div>
    `;
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.galaxyObject) {
      this.galaxyObject.rotation.y += this.rotationSpeed;
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
