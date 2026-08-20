// ============================================================================
// COSMIC EXPLORER - GAMES & QUIZZES MODULE
// 1. Cosmic Explorer Academy (NASA Trivia Quiz)
// 2. Asteroid Pilot Arcade (Enhanced Shield Power & Plasma Overdrive)
// ============================================================================

import { QUIZ_QUESTIONS } from "./data/spaceData.js";
import { sound } from "./audio.js";
import { auth } from "./auth.js";

// ============================================================================
// 1. COSMIC QUIZ ENGINE
// ============================================================================
export class CosmicQuizEngine {
  constructor() {
    this.questions = QUIZ_QUESTIONS;
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.timer = null;
    this.timeLeft = 15;
    this.isAnswered = false;
    this.activeCategory = "all";
  }

  init() {
    this.bindEvents();
    this.startQuiz();
  }

  bindEvents() {
    const restartBtn = document.getElementById("quizRestartBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        sound.playClick();
        this.startQuiz();
      });
    }

    const catFilter = document.getElementById("quizCategorySelect");
    if (catFilter) {
      catFilter.addEventListener("change", (e) => {
        sound.playClick();
        this.activeCategory = e.target.value;
        this.startQuiz();
      });
    }
  }

  startQuiz() {
    let list = this.questions;
    if (this.activeCategory !== "all") {
      list = this.questions.filter(q => q.category === this.activeCategory);
    }
    this.filteredQuestions = [...list].sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.renderQuestion();
  }

  renderQuestion() {
    this.isAnswered = false;
    clearInterval(this.timer);
    this.timeLeft = 15;

    const quizContainer = document.getElementById("quizPlayArea");
    const summaryContainer = document.getElementById("quizSummaryArea");

    if (summaryContainer) summaryContainer.classList.add("hidden");
    if (quizContainer) quizContainer.classList.remove("hidden");

    if (this.currentIndex >= this.filteredQuestions.length) {
      this.showSummary();
      return;
    }

    const q = this.filteredQuestions[this.currentIndex];

    const qNumEl = document.getElementById("quizQuestionNum");
    const qTextEl = document.getElementById("quizQuestionText");
    const qOptionsEl = document.getElementById("quizOptionsContainer");
    const qTimerEl = document.getElementById("quizTimerDisplay");
    const qScoreEl = document.getElementById("quizScoreDisplay");
    const qStreakEl = document.getElementById("quizStreakDisplay");
    const qExplainEl = document.getElementById("quizExplanation");

    if (qNumEl) qNumEl.innerText = `Question ${this.currentIndex + 1} of ${this.filteredQuestions.length}`;
    if (qTextEl) qTextEl.innerText = q.question;
    if (qScoreEl) qScoreEl.innerText = `${this.score} XP`;
    if (qStreakEl) qStreakEl.innerText = `${this.streak}x Combo`;
    if (qExplainEl) {
      qExplainEl.classList.add("hidden");
      qExplainEl.innerHTML = "";
    }

    if (qOptionsEl) {
      qOptionsEl.innerHTML = q.options.map((opt, idx) => `
        <button class="quiz-opt-btn w-full text-left p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-cyan-950/40 hover:border-cyan-500/50 transition-all duration-200 text-sm text-gray-200 font-mono flex items-center space-x-3" data-idx="${idx}">
          <span class="w-6 h-6 rounded-full border border-cyan-400/60 flex items-center justify-center text-xs text-cyan-300">${String.fromCharCode(65 + idx)}</span>
          <span>${opt}</span>
        </button>
      `).join("");

      const buttons = qOptionsEl.querySelectorAll(".quiz-opt-btn");
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          if (this.isAnswered) return;
          this.handleAnswer(parseInt(btn.dataset.idx), q);
        });
      });
    }

    this.updateTimerUI();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerUI();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        if (!this.isAnswered) {
          this.handleAnswer(-1, q);
        }
      }
    }, 1000);
  }

  updateTimerUI() {
    const timerEl = document.getElementById("quizTimerDisplay");
    if (timerEl) {
      timerEl.innerText = `${this.timeLeft}s`;
      if (this.timeLeft <= 5) {
        timerEl.className = "text-red-400 font-mono font-bold animate-pulse";
      } else {
        timerEl.className = "text-cyan-300 font-mono font-bold";
      }
    }
  }

  handleAnswer(selectedIdx, q) {
    this.isAnswered = true;
    clearInterval(this.timer);

    const buttons = document.querySelectorAll(".quiz-opt-btn");
    const explainEl = document.getElementById("quizExplanation");

    if (selectedIdx === q.correctIndex) {
      sound.playSuccess();
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
      const earnedXP = 100 + (this.streak * 25);
      this.score += earnedXP;
      auth.addXP(earnedXP);

      if (buttons[selectedIdx]) {
        buttons[selectedIdx].classList.remove("bg-white/5", "border-white/10");
        buttons[selectedIdx].classList.add("bg-emerald-950/80", "border-emerald-500", "text-emerald-300");
      }
    } else {
      sound.playError();
      this.streak = 0;

      if (selectedIdx >= 0 && buttons[selectedIdx]) {
        buttons[selectedIdx].classList.remove("bg-white/5", "border-white/10");
        buttons[selectedIdx].classList.add("bg-red-950/80", "border-red-500", "text-red-300");
      }

      if (buttons[q.correctIndex]) {
        buttons[q.correctIndex].classList.remove("bg-white/5", "border-white/10");
        buttons[q.correctIndex].classList.add("bg-emerald-950/80", "border-emerald-500", "text-emerald-300");
      }
    }

    if (explainEl) {
      explainEl.classList.remove("hidden");
      explainEl.innerHTML = `
        <div class="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-gray-300 space-y-1 animate-fade-in">
          <strong class="text-cyan-300 font-mono">💡 NASA Telemetry Briefing:</strong>
          <p>${q.explanation}</p>
          <div class="pt-2 flex justify-end">
            <button id="quizNextBtn" class="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs shadow-lg shadow-cyan-500/30">Next Mission →</button>
          </div>
        </div>
      `;

      document.getElementById("quizNextBtn")?.addEventListener("click", () => {
        sound.playClick();
        this.currentIndex++;
        this.renderQuestion();
      });
    }
  }

  showSummary() {
    clearInterval(this.timer);
    const quizContainer = document.getElementById("quizPlayArea");
    const summaryContainer = document.getElementById("quizSummaryArea");

    if (quizContainer) quizContainer.classList.add("hidden");
    if (summaryContainer) {
      summaryContainer.classList.remove("hidden");
      sound.playSuccess();

      summaryContainer.innerHTML = `
        <div class="glass-panel p-6 border border-cyan-500/40 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <div class="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h3 class="text-2xl font-bold font-mono text-white">Mission Debrief Complete</h3>
          <p class="text-xs text-cyan-300 font-mono">Cosmic Academy Stargazer Evaluation</p>

          <div class="grid grid-cols-2 gap-3 text-xs my-4">
            <div class="p-3 bg-black/40 rounded-xl border border-white/5">
              <span class="text-gray-400 block text-[10px]">Total XP Earned</span>
              <span class="text-xl font-bold font-mono text-cyan-300">+${this.score} XP</span>
            </div>
            <div class="p-3 bg-black/40 rounded-xl border border-white/5">
              <span class="text-gray-400 block text-[10px]">Max Streak</span>
              <span class="text-xl font-bold font-mono text-amber-300">${this.maxStreak}x Combo</span>
            </div>
          </div>

          <div class="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-xs text-cyan-200">
            🎖️ <strong>Astronaut Honor:</strong> You are promoted to active cosmic exploration duty!
          </div>

          <button id="quizRestartSummaryBtn" class="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-sm transition-all shadow-lg shadow-cyan-500/30">
            🔄 Retake Cosmic Assessment
          </button>
        </div>
      `;

      document.getElementById("quizRestartSummaryBtn")?.addEventListener("click", () => {
        sound.playClick();
        this.startQuiz();
      });
    }
  }
}

// ============================================================================
// 2. ASTEROID PILOT: DEEP SPACE ODYSSEY (ENHANCED SHIELD POWER ARCADE)
// Max Shield: 200 HP | Rapid Regen | 5s Invincible Deflector Barrier | Shield Crystals
// ============================================================================
export class AsteroidArcadeGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.maxShield = 200;
    this.ship = {
      x: 300,
      y: 350,
      width: 32,
      height: 32,
      speed: 6.5,
      shield: 200,
      isShieldActive: false,
      shieldTimer: 0
    };
    this.asteroids = [];
    this.orbs = [];
    this.shieldCrystals = [];
    this.keys = {};
    this.score = 0;
    this.distanceKm = 0;
    this.isRunning = false;
    this.animationId = null;
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    this.bindControls();
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.clientWidth || 600;
    this.canvas.height = 420;
    this.ship.x = this.canvas.width / 2;
    this.ship.y = this.canvas.height - 60;
  }

  bindControls() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      if (e.code === "Space") {
        this.activateShield();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    let isDragging = false;
    this.canvas.addEventListener("pointerdown", (e) => {
      isDragging = true;
      this.updateShipPointer(e);
    });

    this.canvas.addEventListener("pointermove", (e) => {
      if (isDragging) this.updateShipPointer(e);
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    const startBtn = document.getElementById("arcadeStartBtn");
    const shieldBtn = document.getElementById("arcadeShieldBtn");

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        sound.playClick();
        this.start();
      });
    }

    if (shieldBtn) {
      shieldBtn.addEventListener("click", () => {
        this.activateShield();
      });
    }
  }

  updateShipPointer(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.ship.x = e.clientX - rect.left;
    this.ship.y = Math.max(80, Math.min(this.canvas.height - 30, e.clientY - rect.top));
  }

  // Enhanced Deflector Shield (5 Seconds duration, minimal cost 15 HP)
  activateShield() {
    if (this.ship.shield >= 15 && !this.ship.isShieldActive) {
      this.ship.isShieldActive = true;
      this.ship.shield -= 15;
      sound.playClick(1400);

      // Extended 5-second shield protection!
      setTimeout(() => {
        this.ship.isShieldActive = false;
      }, 5000);
    }
  }

  start() {
    this.resize();
    this.score = 0;
    this.distanceKm = 0;
    this.ship.shield = this.maxShield;
    this.ship.isShieldActive = false;
    this.asteroids = [];
    this.orbs = [];
    this.shieldCrystals = [];
    this.isRunning = true;

    const overlay = document.getElementById("arcadeOverlay");
    if (overlay) overlay.classList.add("hidden");

    sound.playWarp();
    this.loop();
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  update() {
    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) this.ship.x -= this.ship.speed;
    if (this.keys["ArrowRight"] || this.keys["KeyD"]) this.ship.x += this.ship.speed;
    if (this.keys["ArrowUp"] || this.keys["KeyW"]) this.ship.y -= this.ship.speed;
    if (this.keys["ArrowDown"] || this.keys["KeyS"]) this.ship.y += this.ship.speed;

    this.ship.x = Math.max(15, Math.min(this.canvas.width - 15, this.ship.x));
    this.ship.y = Math.max(20, Math.min(this.canvas.height - 20, this.ship.y));

    this.distanceKm += 20;
    this.score += 1;

    // Rapid Auto Shield Generator (+0.18 HP per frame)
    if (this.ship.shield < this.maxShield) {
      this.ship.shield = Math.min(this.maxShield, this.ship.shield + 0.18);
    }

    // Spawn Asteroids
    if (Math.random() < 0.04) {
      this.asteroids.push({
        x: Math.random() * this.canvas.width,
        y: -30,
        radius: 12 + Math.random() * 22,
        speedX: (Math.random() - 0.5) * 2,
        speedY: 2.5 + Math.random() * 4.0,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.05
      });
    }

    // Spawn Blue Energy Plasma Orbs
    if (Math.random() < 0.02) {
      this.orbs.push({
        x: 20 + Math.random() * (this.canvas.width - 40),
        y: -20,
        radius: 10,
        speedY: 2.2
      });
    }

    // Spawn Green Shield Recharge Crystals (NEW ✨)
    if (Math.random() < 0.015) {
      this.shieldCrystals.push({
        x: 25 + Math.random() * (this.canvas.width - 50),
        y: -25,
        radius: 12,
        speedY: 2.0,
        rotation: 0
      });
    }

    // Update Asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const a = this.asteroids[i];
      a.x += a.speedX;
      a.y += a.speedY;
      a.rotation += a.rotSpeed;

      const dist = Math.hypot(this.ship.x - a.x, this.ship.y - a.y);
      if (dist < a.radius + this.ship.width / 2) {
        if (this.ship.isShieldActive) {
          // Deflector Shield vaporizes asteroid!
          this.asteroids.splice(i, 1);
          this.score += 100;
          sound.playClick(1100);
          continue;
        } else if (this.ship.shield > 50) {
          // High Shield absorbs kinetic hit!
          this.ship.shield -= 45;
          this.asteroids.splice(i, 1);
          sound.playError();
          continue;
        } else {
          // Hull destroyed
          this.gameOver();
          return;
        }
      }

      if (a.y > this.canvas.height + 40) {
        this.asteroids.splice(i, 1);
      }
    }

    // Update Energy Orbs
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const o = this.orbs[i];
      o.y += o.speedY;

      const dist = Math.hypot(this.ship.x - o.x, this.ship.y - o.y);
      if (dist < o.radius + this.ship.width / 2) {
        this.orbs.splice(i, 1);
        this.score += 150;
        this.ship.shield = Math.min(this.maxShield, this.ship.shield + 25);
        sound.playSuccess();
        continue;
      }

      if (o.y > this.canvas.height + 20) {
        this.orbs.splice(i, 1);
      }
    }

    // Update Green Shield Crystals
    for (let i = this.shieldCrystals.length - 1; i >= 0; i--) {
      const c = this.shieldCrystals[i];
      c.y += c.speedY;
      c.rotation += 0.04;

      const dist = Math.hypot(this.ship.x - c.x, this.ship.y - c.y);
      if (dist < c.radius + this.ship.width / 2) {
        this.shieldCrystals.splice(i, 1);
        this.score += 250;
        this.ship.shield = Math.min(this.maxShield, this.ship.shield + 60);
        this.ship.isShieldActive = true; // Instant barrier overdrive!
        sound.playSuccess();
        setTimeout(() => { this.ship.isShieldActive = false; }, 4000);
        continue;
      }

      if (c.y > this.canvas.height + 25) {
        this.shieldCrystals.splice(i, 1);
      }
    }

    this.updateHUD();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#050813";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Star stream
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    for (let i = 0; i < 40; i++) {
      const sx = (i * 37 + (Date.now() * 0.1)) % this.canvas.width;
      const sy = (i * 53 + (Date.now() * 0.3)) % this.canvas.height;
      this.ctx.fillRect(sx, sy, 1.5, 3.5);
    }

    // Draw Blue Plasma Orbs
    this.orbs.forEach(o => {
      this.ctx.save();
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = "#00f3ff";
      this.ctx.fillStyle = "#00f3ff";
      this.ctx.beginPath();
      this.ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // Draw Green Shield Crystals
    this.shieldCrystals.forEach(c => {
      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rotation);
      this.ctx.shadowBlur = 18;
      this.ctx.shadowColor = "#10b981";
      this.ctx.fillStyle = "#10b981";
      this.ctx.beginPath();
      this.ctx.moveTo(0, -c.radius);
      this.ctx.lineTo(c.radius, 0);
      this.ctx.lineTo(0, c.radius);
      this.ctx.lineTo(-c.radius, 0);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    });

    // Draw Asteroids
    this.asteroids.forEach(a => {
      this.ctx.save();
      this.ctx.translate(a.x, a.y);
      this.ctx.rotate(a.rotation);
      this.ctx.fillStyle = "#64748b";
      this.ctx.strokeStyle = "#94a3b8";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, a.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Draw Ship
    this.ctx.save();
    this.ctx.translate(this.ship.x, this.ship.y);

    // Thrust Flame
    this.ctx.fillStyle = "#ff6600";
    this.ctx.beginPath();
    this.ctx.moveTo(-7, 14);
    this.ctx.lineTo(0, 26 + Math.random() * 10);
    this.ctx.lineTo(7, 14);
    this.ctx.fill();

    // Ship Hull
    this.ctx.fillStyle = "#ffffff";
    this.ctx.strokeStyle = "#00f3ff";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -18);
    this.ctx.lineTo(16, 16);
    this.ctx.lineTo(0, 9);
    this.ctx.lineTo(-16, 16);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Glowing 360° Deflector Shield Bubble
    if (this.ship.isShieldActive) {
      this.ctx.strokeStyle = "#38bdf8";
      this.ctx.shadowBlur = 24;
      this.ctx.shadowColor = "#00f3ff";
      this.ctx.fillStyle = "rgba(0, 243, 255, 0.2)";
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 28, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  updateHUD() {
    const scoreEl = document.getElementById("arcadeScoreDisplay");
    const distEl = document.getElementById("arcadeDistDisplay");
    const shieldBar = document.getElementById("arcadeShieldBar");
    const shieldValText = document.getElementById("arcadeShieldValText");

    if (scoreEl) scoreEl.innerText = `${this.score} PTS`;
    if (distEl) distEl.innerText = `${(this.distanceKm / 1000).toFixed(1)}k km`;
    if (shieldBar) {
      const pct = (this.ship.shield / this.maxShield) * 100;
      shieldBar.style.width = `${pct}%`;
      if (pct > 50) shieldBar.className = "h-full bg-emerald-400 shadow-lg shadow-emerald-400/50";
      else if (pct > 25) shieldBar.className = "h-full bg-yellow-400";
      else shieldBar.className = "h-full bg-red-500 animate-pulse";
    }
    if (shieldValText) {
      shieldValText.innerText = `${Math.round(this.ship.shield)} / ${this.maxShield} HP`;
    }
  }

  gameOver() {
    this.isRunning = false;
    sound.playError();
    auth.addXP(Math.round(this.score / 2));

    const overlay = document.getElementById("arcadeOverlay");
    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.innerHTML = `
        <div class="text-center space-y-3 p-6 glass-panel border border-red-500/40 rounded-2xl max-w-xs mx-auto animate-fade-in">
          <span class="text-3xl">💥</span>
          <h3 class="text-xl font-bold font-mono text-red-400">Ship Hull Compromised</h3>
          <p class="text-xs text-gray-300">Final Distance: ${(this.distanceKm / 1000).toFixed(1)}k km</p>
          <div class="text-lg font-mono font-bold text-amber-300">Score: ${this.score} PTS</div>
          <button id="arcadeRestartBtn" class="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs rounded-xl shadow-lg">
            🚀 Launch New Probe
          </button>
        </div>
      `;
      document.getElementById("arcadeRestartBtn")?.addEventListener("click", () => this.start());
    }
  }
}
