# Cosmic Explorer — Platform Walkthrough 🌌🛰️🌱

**Cosmic Explorer** is an interactive 3D WebGL space exploration, Earth observation, climate heat-map, and agro-atmospheric intelligence platform.

---

## 🚀 How to Launch and Explore

The project is located at:
`C:\Users\vivek\.gemini\antigravity\scratch\cosmic-explorer`

### Launch Options:
1. **Option 1 (One-Click Batch File)**: Double-click [`start.bat`](file:///C:/Users/vivek/.gemini/antigravity/scratch/cosmic-explorer/start.bat).
2. **Option 2 (PowerShell Server)**: Open PowerShell in the project directory and run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1
   ```
   This automatically starts a local HTTP server on `http://localhost:8080` and opens it in your default browser.

---

## 🌟 Updated Key Features & Additions

### 1. 🔭 3D Space Telescopes & Satellites with Mission Histories (`telescopeView.js`)
- **Expanded 3D Space Observatories & Satellites**:
  - **James Webb Space Telescope (JWST)**: 18 Gold Beryllium hexagonal mirrors, 5-layer Kapton sunshield at Sun-Earth L2.
  - **Hubble Space Telescope (HST)**: High-resolution cylindrical body, dual solar arrays, and aperture door.
  - **Spitzer Space Telescope**: Cryogenic infrared observatory with liquid helium cryostat and solar shield.
  - **Chandra X-ray Observatory**: Nested Wolter-I cylindrical optics and high-energy astrophysic sensors.
  - **Aditya-L1 Solar Observatory (ISRO)**: India's flagship solar telescope with VELC coronagraph at L1.
  - **Voyager 1 & 2 Interstellar Probes**: 3.7m high-gain radio dish, RTG power units, and Golden Record in interstellar space.
- **Mission Histories**: Detailed operational logs, launch dates, carrier rockets, scientific payloads, and milestone discoveries.
- **Telescope Viewport & Spectroscopy**: Direct lock-on to exoplanets (TRAPPIST-1e, Proxima Centauri b, Kepler-452b, 55 Cancri e) with $H_2O, CO_2, O_2, CH_4$ biosignature sensors.

### 2. 🌍 Earth & Satellites: NASA Live Space Map & Village Greenery/Temperature (`earthView.js` ✨)
- **Dual View Modes**:
  - **3D Orbiting Earth Globe**: Atmospheric Rayleigh glow, rotating clouds, and real-time orbital tracks for ISS (Space Station), Hubble, Landsat-9, and Terra MODIS.
  - **NASA Live Space Map**: Interactive full-resolution satellite map (Leaflet + NASA/ESRI World Imagery).
- **Universal Village / State / Country Search**:
  - Search any village, district, state, or country on Earth (e.g., Baramati, Fresno, Bundaberg, Thanjavur, Ludhiana, Sorriso).
  - Clicking anywhere on the satellite map drops an active tracking pin.
- **NASA Real-Time Telemetry HUD**:
  - 🌡️ **Land Surface Temperature ($^\circ\text{C} / ^\circ\text{F}$)** and Heat Index / "Feels Like".
  - 🌱 **NASA Greenery Index (NDVI)**: Evaluates vegetation density from 0.00 to 1.00 (Barren $\to$ Moderate Crop $\to$ Lush Dense Canopy).
  - 💧 **Soil Moisture, Humidity, Solar Irradiance ($W/m^2$), and Barometric Pressure**.
  - 🔥 **Thermal Anomaly Status** (Normal, Elevated, Wildfire Alert).
  - One-click transfer of satellite parameters directly into the Agro-Atmospheric Chamber.

### 3. 🎮 Cosmic Academy & Upgraded Asteroid Pilot Arcade (`games.js` ✨)
- **Cosmic Quiz Academy**: Multi-category trivia engine (Solar System, Telescopes, Agriculture & Biology, Galaxies, Earth & Satellites) with 15s timer, combo streaks, and Astronaut Promotion certificates.
- **Enhanced Asteroid Pilot Arcade**:
  - **200 HP Max Shield Capacity** (doubled protection!).
  - **5-Second Deflector Shield Barrier** (Spacebar) with minimal energy cost (15 HP).
  - **Quadrupled Shield Auto-Regeneration** (+0.18 HP per frame).
  - **Collectible Green Shield Crystals**: Grants +60 HP and instant invincibility barrier overdrive!
  - Collect Blue Plasma Orbs (+150 pts), vaporize incoming asteroids, and set high scores.

### 4. 🧑‍🚀 Authentication & Profile System (`auth.js`)
- Gmail & Password authentication with real-time password strength meter.
- Simulated Google One-Click sign-in and Guest Astronaut mode.
- Persistent astronaut dossier with XP, rank progression, and mission badges.

### 5. 🌱 Agro-Atmospheric Plant Chamber & Crop Suitability (`agriHub.js`)
- 5-factor atmospheric simulation ($CO_2$, Temperature, Pressure, Humidity, Solar Radiation).
- 25+ food, cash, and astro-botany crops with extreme climate tolerance analysis and pest risk forecaster.

---

## 📂 Project Architecture

```
C:\Users\vivek\.gemini\antigravity\scratch\cosmic-explorer/
├── index.html               # Main container with Leaflet & 3D canvases
├── start.bat                # Windows 1-click batch launcher
├── server.ps1               # Zero-dependency PowerShell HTTP server
├── styles/
│   ├── main.css             # Futuristic cyberpunk NASA theme
│   ├── components.css       # HUD panels, Leaflet map styling, sliders
│   └── responsive.css       # Mobile and tablet responsiveness
└── src/
    ├── app.js               # Application router & telemetry coordinator
    ├── auth.js              # Gmail login, Google OAuth & profile manager
    ├── audio.js             # Procedural Web Audio API sound synthesizer
    ├── solarSystem.js       # 3D Three.js Solar System simulation & HUD
    ├── telescopeView.js     # 3D Telescopes & Satellites with detailed histories
    ├── galaxies.js          # 3D Deep Space, Galaxies & Gargantua Black Hole
    ├── earthView.js         # 3D Earth globe & NASA Live Space Map (Greenery & Temp)
    ├── heatExplorer.js      # Granular heat & climate drill-down engine
    ├── agriHub.js           # Agro-Atmospheric Chamber & Crop Suitability
    ├── games.js             # Cosmic Quiz & 200 HP Shield Asteroid Pilot Arcade
    └── data/
        ├── spaceData.js     # Planet telemetry, expanded telescope histories
        └── cropData.js      # 25+ crops with atmospheric & climate tolerances
```
