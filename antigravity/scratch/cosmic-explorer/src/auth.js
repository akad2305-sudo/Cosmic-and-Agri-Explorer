// ============================================================================
// COSMIC EXPLORER - SCI-FI AUTHENTICATION & ASTRONAUT PROFILE SYSTEM
// Gmail / Password validation, Google OAuth simulation, and Guest Mode
// ============================================================================

import { sound } from "./audio.js";

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.storageKey = "cosmic_explorer_user_v2";
    this.listeners = [];
  }

  init() {
    // Check saved session
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch (e) {
        this.currentUser = null;
      }
    }
    this.bindEvents();
    this.notifyState();
  }

  onStateChange(fn) {
    this.listeners.push(fn);
  }

  notifyState() {
    this.listeners.forEach(fn => fn(this.currentUser));
  }

  bindEvents() {
    const loginForm = document.getElementById("authLoginForm");
    const googleBtn = document.getElementById("googleSignInBtn");
    const guestBtn = document.getElementById("guestSignInBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const togglePassBtn = document.getElementById("togglePasswordVisibility");
    const passwordInput = document.getElementById("authPassword");
    const strengthBar = document.getElementById("passwordStrengthBar");
    const strengthText = document.getElementById("passwordStrengthText");

    if (passwordInput && strengthBar && strengthText) {
      passwordInput.addEventListener("input", (e) => {
        const pass = e.target.value;
        let strength = 0;
        if (pass.length >= 6) strength += 25;
        if (pass.length >= 10) strength += 25;
        if (/[A-Z]/.test(pass)) strength += 25;
        if (/[0-9!@#$%^&*]/.test(pass)) strength += 25;

        strengthBar.style.width = `${strength}%`;
        if (strength < 50) {
          strengthBar.className = "h-full transition-all duration-300 bg-red-500";
          strengthText.innerText = "Weak (Minimum 6 characters)";
          strengthText.className = "text-xs text-red-400";
        } else if (strength < 75) {
          strengthBar.className = "h-full transition-all duration-300 bg-yellow-500";
          strengthText.innerText = "Moderate";
          strengthText.className = "text-xs text-yellow-400";
        } else {
          strengthBar.className = "h-full transition-all duration-300 bg-emerald-500";
          strengthText.innerText = "Strong Cryptographic Password";
          strengthText.className = "text-xs text-emerald-400";
        }
      });
    }

    if (togglePassBtn && passwordInput) {
      togglePassBtn.addEventListener("click", () => {
        const type = passwordInput.type === "password" ? "text" : "password";
        passwordInput.type = type;
        togglePassBtn.innerHTML = type === "password" ? `<i data-lucide="eye"></i>` : `<i data-lucide="eye-off"></i>`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        sound.playClick();
        const email = document.getElementById("authEmail").value.trim();
        const pass = document.getElementById("authPassword").value;
        const errEl = document.getElementById("authErrorMessage");

        // Validate Gmail / Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          if (errEl) {
            errEl.innerText = "⚠️ Please enter a valid email address (e.g. astronaut@gmail.com)";
            errEl.classList.remove("hidden");
          }
          sound.playError();
          return;
        }

        if (pass.length < 6) {
          if (errEl) {
            errEl.innerText = "⚠️ Password must be at least 6 characters long.";
            errEl.classList.remove("hidden");
          }
          sound.playError();
          return;
        }

        // Successful Sign In
        const username = email.split("@")[0];
        const user = {
          name: username.charAt(0).toUpperCase() + username.slice(1),
          email: email,
          type: "gmail",
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
          rank: "Flight Commander",
          xp: 1250,
          level: 3,
          badges: ["Solar Navigator", "JWST Specialist", "Planetary Pioneer"],
          loginTime: new Date().toISOString()
        };

        this.setUser(user);
        sound.playSuccess();
        this.closeModal();
      });
    }

    if (googleBtn) {
      googleBtn.addEventListener("click", () => {
        sound.playClick();
        // Simulate instant Google Account Pick
        const googleUser = {
          name: "Cosmic Explorer",
          email: "explorer.cadet@gmail.com",
          type: "google",
          avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=explorer",
          rank: "Astro-Officer",
          xp: 1500,
          level: 4,
          badges: ["Google Astrobiologist", "Galaxy Observer", "Quantum Scout"],
          loginTime: new Date().toISOString()
        };
        this.setUser(googleUser);
        sound.playSuccess();
        this.closeModal();
      });
    }

    if (guestBtn) {
      guestBtn.addEventListener("click", () => {
        sound.playClick();
        const guestUser = {
          name: "Guest Voyager",
          email: "guest@deepspace.voyage",
          type: "guest",
          avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=voyager",
          rank: "Space Cadet",
          xp: 250,
          level: 1,
          badges: ["Curious Stargazer"],
          loginTime: new Date().toISOString()
        };
        this.setUser(guestUser);
        sound.playSuccess();
        this.closeModal();
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        sound.playClick();
        this.logout();
      });
    }
  }

  setUser(user) {
    this.currentUser = user;
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.notifyState();
    this.updateUI();
  }

  addXP(amount) {
    if (!this.currentUser) return;
    this.currentUser.xp = (this.currentUser.xp || 0) + amount;
    const newLevel = Math.floor(this.currentUser.xp / 500) + 1;
    if (newLevel > this.currentUser.level) {
      this.currentUser.level = newLevel;
      if (newLevel >= 6) this.currentUser.rank = "Grand Fleet Admiral";
      else if (newLevel >= 4) this.currentUser.rank = "Chief Astrobiologist";
      else if (newLevel >= 2) this.currentUser.rank = "Flight Officer";
    }
    localStorage.setItem(this.storageKey, JSON.stringify(this.currentUser));
    this.updateUI();
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.storageKey);
    this.notifyState();
    this.openModal();
  }

  openModal() {
    const modal = document.getElementById("authModal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  }

  closeModal() {
    const modal = document.getElementById("authModal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }

  updateUI() {
    const avatarEl = document.getElementById("userAvatarImg");
    const nameEl = document.getElementById("userNameText");
    const rankEl = document.getElementById("userRankText");
    const xpEl = document.getElementById("userXpText");

    if (this.currentUser) {
      if (avatarEl) avatarEl.src = this.currentUser.avatar;
      if (nameEl) nameEl.innerText = this.currentUser.name;
      if (rankEl) rankEl.innerText = `${this.currentUser.rank} (Lvl ${this.currentUser.level || 1})`;
      if (xpEl) xpEl.innerText = `${this.currentUser.xp || 0} XP`;
    }
  }
}

export const auth = new AuthManager();
