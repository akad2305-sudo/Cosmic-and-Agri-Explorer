// ============================================================================
// COSMIC EXPLORER - SPACE, PLANETARY, TELESCOPE & SATELLITE DATABASE
// NASA, ESA, ISRO & Astrophysical Telemetry & Comprehensive Mission Histories
// ============================================================================

export const SOLAR_SYSTEM_DATA = {
  sun: {
    id: "sun",
    name: "The Sun (Sol)",
    type: "Yellow Dwarf Star (G2V)",
    radiusKm: 696340,
    radiusRel: 18,
    distanceFromSunAU: 0,
    orbitRadius: 0,
    orbitPeriodDays: 0,
    rotationPeriodHours: 600,
    surfaceTemp: "5,500 °C (9,932 °F)",
    coreTemp: "15,000,000 °C",
    gravity: "274.0 m/s² (28g)",
    mass: "1.989 × 10³⁰ kg (333,000 Earths)",
    composition: "73% Hydrogen, 25% Helium, 2% Heavier Elements (Oxygen, Carbon, Iron)",
    color: "#ffaa00",
    emissiveColor: "#ff5500",
    textureType: "sun",
    atmosphere: "Solar Corona, Chromosphere & Photosphere. Generates Solar Wind and Coronal Mass Ejections.",
    description: "The gravitational anchor of our solar system. The Sun accounts for 99.86% of all mass in the Solar System, generating massive thermonuclear fusion in its core.",
    keyMissions: ["Parker Solar Probe (NASA)", "SOHO (NASA/ESA)", "Solar Orbiter (ESA)", "Aditya-L1 (ISRO)"],
    funFact: "Every second, the Sun converts 600 million tons of hydrogen into helium through nuclear fusion."
  },
  mercury: {
    id: "mercury",
    name: "Mercury",
    type: "Terrestrial Planet",
    radiusKm: 2439.7,
    radiusRel: 1.5,
    distanceFromSunAU: 0.39,
    orbitRadius: 28,
    orbitPeriodDays: 88,
    orbitSpeed: 0.04,
    rotationPeriodHours: 1407.6,
    surfaceTemp: "-180 °C to 430 °C",
    gravity: "3.7 m/s² (0.38g)",
    mass: "3.301 × 10²³ kg (0.055 Earths)",
    moons: 0,
    color: "#b5b5b5",
    atmosphere: "Ultra-thin exosphere: Oxygen (42%), Sodium (29%), Hydrogen (22%), Helium (6%).",
    description: "The smallest planet in our solar system and closest to the Sun. It experiences extreme temperature swings from blistering heat to deep cosmic freeze.",
    keyMissions: ["Mariner 10 (NASA)", "MESSENGER (NASA)", "BepiColombo (ESA/JAXA)"],
    funFact: "Despite being closest to the Sun, radar observations revealed water ice inside permanently shadowed polar craters."
  },
  venus: {
    id: "venus",
    name: "Venus",
    type: "Terrestrial Planet",
    radiusKm: 6051.8,
    radiusRel: 3.2,
    distanceFromSunAU: 0.72,
    orbitRadius: 42,
    orbitPeriodDays: 224.7,
    orbitSpeed: 0.015,
    rotationPeriodHours: -5832.5,
    surfaceTemp: "465 °C (869 °F) - Hottest Planet",
    gravity: "8.87 m/s² (0.90g)",
    mass: "4.867 × 10²⁴ kg (0.815 Earths)",
    moons: 0,
    color: "#e3bb76",
    atmosphere: "96.5% Carbon Dioxide (CO₂), 3.5% Nitrogen with clouds of sulfuric acid. Pressure: 92 bar.",
    description: "Earth's 'toxic twin' enveloped in thick runaway greenhouse gas clouds. Its surface pressure is equivalent to being 900m underwater.",
    keyMissions: ["Venera 13 (USSR)", "Magellan (NASA)", "Akatsuki (JAXA)", "DAVINCI & VERITAS (Upcoming NASA)"],
    funFact: "Venus spins backwards compared to most planets, and its day is longer than its entire year!"
  },
  earth: {
    id: "earth",
    name: "Earth (Terra)",
    type: "Terrestrial Planet (Habitable Zone)",
    radiusKm: 6371,
    radiusRel: 3.5,
    distanceFromSunAU: 1.0,
    orbitRadius: 58,
    orbitPeriodDays: 365.25,
    orbitSpeed: 0.01,
    rotationPeriodHours: 23.93,
    surfaceTemp: "-89 °C to 58 °C (Mean: 15 °C)",
    gravity: "9.807 m/s² (1.0g)",
    mass: "5.972 × 10²⁴ kg",
    moons: 1,
    color: "#2a75d3",
    cloudsColor: "#ffffff",
    atmosphere: "78.08% Nitrogen (N₂), 20.95% Oxygen (O₂), 0.93% Argon, 0.04% CO₂. Surface Pressure: 1.013 bar.",
    description: "The cradle of life. The only known world with liquid surface water, active plate tectonics, and a vibrant biosphere.",
    keyMissions: ["ISS (International Space Station)", "Terra/Aqua (NASA)", "Landsat-9 (NASA/USGS)", "Sentinel-2 (ESA)"],
    funFact: "Earth's magnetic field acts as a protective shield against deadly solar radiation and coronal mass ejections."
  },
  moon: {
    id: "moon",
    name: "The Moon (Luna)",
    type: "Natural Satellite",
    radiusKm: 1737.4,
    radiusRel: 1.0,
    orbitRadius: 7,
    orbitPeriodDays: 27.3,
    surfaceTemp: "-130 °C to 120 °C",
    gravity: "1.62 m/s² (0.166g)",
    mass: "7.342 × 10²² kg",
    atmosphere: "Virtually vacuum (trace Helium, Neon, Hydrogen).",
    description: "Earth's only permanent natural satellite. Tidally locked to Earth, stabilizing our axial tilt and creating ocean tides.",
    keyMissions: ["Apollo 11-17 (NASA)", "Chandrayaan-1,2,3 (ISRO)", "Chang'e series (CNSA)", "Artemis (NASA)"],
    funFact: "Water ice resides in permanently shadowed craters at the lunar south pole, prime for future lunar colonies."
  },
  mars: {
    id: "mars",
    name: "Mars",
    type: "Terrestrial Planet",
    radiusKm: 3389.5,
    radiusRel: 2.2,
    distanceFromSunAU: 1.52,
    orbitRadius: 78,
    orbitPeriodDays: 687,
    orbitSpeed: 0.008,
    rotationPeriodHours: 24.62,
    surfaceTemp: "-140 °C to 20 °C (Mean: -63 °C)",
    gravity: "3.72 m/s² (0.38g)",
    mass: "6.417 × 10²³ kg (0.107 Earths)",
    moons: 2,
    color: "#d14b28",
    atmosphere: "95.3% Carbon Dioxide (CO₂), 2.6% Nitrogen, 1.9% Argon, 0.16% Oxygen. Pressure: 6.51 hPa.",
    description: "The Red Planet, rich in iron oxide. Home to Olympus Mons (tallest volcano in Solar System) and ancient dry river valleys.",
    keyMissions: ["Curiosity & Perseverance (NASA)", "Ingenuity Helicopter (NASA)", "Mangalyaan MOM (ISRO)", "Tianwen-1 (CNSA)"],
    funFact: "Olympus Mons on Mars is 22 km high—almost three times the height of Mount Everest!"
  },
  jupiter: {
    id: "jupiter",
    name: "Jupiter",
    type: "Gas Giant",
    radiusKm: 69911,
    radiusRel: 8.5,
    distanceFromSunAU: 5.20,
    orbitRadius: 110,
    orbitPeriodDays: 4333,
    orbitSpeed: 0.004,
    rotationPeriodHours: 9.93,
    surfaceTemp: "-110 °C (Cloud Tops)",
    gravity: "24.79 m/s² (2.53g)",
    mass: "1.898 × 10²⁷ kg (318 Earths)",
    moons: 95,
    color: "#c99a6b",
    atmosphere: "89% Hydrogen (H₂), 10% Helium (He), with ammonia and methane cloud stripes.",
    description: "The king of planets. A colossal gas giant whose massive gravitational field acts as a cosmic shield against incoming comets.",
    keyMissions: ["Voyager 1 & 2 (NASA)", "Galileo (NASA)", "Juno (NASA)", "JUICE (ESA)", "Europa Clipper (NASA)"],
    funFact: "The Great Red Spot is a monstrous anti-cyclonic storm larger than Earth that has raged for over 350 years."
  },
  saturn: {
    id: "saturn",
    name: "Saturn",
    type: "Gas Giant with Ring System",
    radiusKm: 58232,
    radiusRel: 7.2,
    distanceFromSunAU: 9.58,
    orbitRadius: 145,
    orbitPeriodDays: 10759,
    orbitSpeed: 0.003,
    rotationPeriodHours: 10.7,
    surfaceTemp: "-140 °C (Cloud Tops)",
    gravity: "10.44 m/s² (1.06g)",
    mass: "5.683 × 10²⁶ kg (95 Earths)",
    moons: 146,
    color: "#e2bf7d",
    rings: { innerRadius: 10, outerRadius: 18, color: "#d4b886" },
    atmosphere: "96.3% Hydrogen, 3.25% Helium, trace methane, ammonia, and water vapor.",
    description: "The jewel of the solar system. Famous for its majestic rings made of billions of chunks of pure water ice and rocky dust.",
    keyMissions: ["Cassini-Huygens (NASA/ESA)", "Voyager 1 & 2 (NASA)", "Pioneer 11 (NASA)", "Dragonfly (Upcoming NASA)"],
    funFact: "Saturn has the lowest density of all planets—it is less dense than water and would float in a giant cosmic bathtub!"
  },
  uranus: {
    id: "uranus",
    name: "Uranus",
    type: "Ice Giant",
    radiusKm: 25362,
    radiusRel: 4.8,
    distanceFromSunAU: 19.2,
    orbitRadius: 180,
    orbitPeriodDays: 30687,
    orbitSpeed: 0.002,
    rotationPeriodHours: -17.2,
    surfaceTemp: "-224 °C (Coldest planetary atmosphere)",
    gravity: "8.69 m/s² (0.89g)",
    mass: "8.681 × 10²⁵ kg (14.5 Earths)",
    moons: 28,
    color: "#73d7eb",
    rings: { innerRadius: 6, outerRadius: 8.5, color: "#8ae3f5" },
    atmosphere: "82.5% Hydrogen, 15.2% Helium, 2.3% Methane (gives its pale cyan color).",
    description: "An ice giant rotating on its side with an axial tilt of 97.77°, rolling around the Sun like a cosmic bowling ball.",
    keyMissions: ["Voyager 2 (NASA Flyby 1986)"],
    funFact: "Because Uranus rolls on its side, each pole gets 42 years of continuous sunlight followed by 42 years of darkness."
  },
  neptune: {
    id: "neptune",
    name: "Neptune",
    type: "Ice Giant",
    radiusKm: 24622,
    radiusRel: 4.6,
    distanceFromSunAU: 30.1,
    orbitRadius: 215,
    orbitPeriodDays: 60190,
    orbitSpeed: 0.0015,
    rotationPeriodHours: 16.1,
    surfaceTemp: "-214 °C",
    gravity: "11.15 m/s² (1.14g)",
    mass: "1.024 × 10²⁶ kg (17.1 Earths)",
    moons: 16,
    color: "#3b6fe8",
    atmosphere: "80% Hydrogen, 19% Helium, 1.5% Methane. Dynamic supersonic storms.",
    description: "The most distant major planet. A vibrant blue ice giant whipped by supersonic winds reaching over 2,100 km/h (1,300 mph).",
    keyMissions: ["Voyager 2 (NASA Flyby 1989)", "Hubble & James Webb Space Telescopes (Remote)"],
    funFact: "Neptune's moon Triton has active cryovolcanoes that erupt nitrogen ice and liquid nitrogen geysers 8 km into space."
  },
  pluto: {
    id: "pluto",
    name: "Pluto",
    type: "Dwarf Planet (Kuiper Belt)",
    radiusKm: 1188.3,
    radiusRel: 1.1,
    distanceFromSunAU: 39.5,
    orbitRadius: 245,
    orbitPeriodDays: 90560,
    orbitSpeed: 0.001,
    rotationPeriodHours: -153.3,
    surfaceTemp: "-233 °C to -223 °C",
    gravity: "0.62 m/s² (0.063g)",
    mass: "1.303 × 10²² kg (0.002 Earths)",
    moons: 5,
    color: "#c2a382",
    atmosphere: "Extremely tenuous nitrogen, methane, and carbon monoxide that freezes onto the surface.",
    description: "A fascinating frozen world featuring Sputnik Planitia (a giant heart-shaped nitrogen ice glacier) and towering water-ice mountains.",
    keyMissions: ["New Horizons (NASA Flyby 2015)"],
    funFact: "Pluto and its largest moon Charon are gravitationally locked face-to-face, orbiting a common center of mass outside Pluto."
  }
};

// ============================================================================
// EXPANDED 3D SPACE TELESCOPES & SATELLITES WITH DETAILED HISTORIES
// ============================================================================
export const TELESCOPES_DATA = [
  {
    id: "jwst",
    name: "James Webb Space Telescope (JWST)",
    agency: "NASA / ESA / CSA",
    launchDate: "December 25, 2021 (Ariane 5 Rocket)",
    orbitLocation: "Sun-Earth L2 Lagrange Point (1.5 Million km from Earth)",
    primaryMirrorDiameter: "6.5 meters (21.3 ft) - 18 Beryllium Hexagons coated in pure Gold",
    wavelengthBand: "Infrared (0.6 to 28.3 μm) - Optical to Mid-Infrared",
    missionGoals: "Peer back 13.5+ billion years to first stars & galaxies, analyze exoplanet atmospheres for biosignatures.",
    instruments: [
      "NIRCam (Near-Infrared Camera)",
      "NIRSpec (Near-Infrared Spectrograph)",
      "MIRI (Mid-Infrared Instrument)",
      "FGS/NIRISS (Fine Guidance Sensor)"
    ],
    temperature: "-233 °C (-388 °F) Cryogenic Cold Side protected by 5-layer tennis-court-sized Sunshield",
    history: "Conceived in 1996 as Next Generation Space Telescope. Launched on Christmas Day 2021 after 25 years of engineering triumphs. Successfully executed over 300 single-point failure deployments in deep space.",
    discoveries: [
      "Discovered earliest known galaxies (JADES-GS-z14-0) formed 290M years after Big Bang",
      "Detected Carbon Dioxide, Methane, and Water in exoplanet atmospheres (WASP-39b, K2-18b)",
      "Unprecedented infrared views of Pillars of Creation and Carina Nebula"
    ],
    status: "Active & Operational (Expected 20+ year lifespan)",
    model3dType: "jwst"
  },
  {
    id: "hubble",
    name: "Hubble Space Telescope (HST)",
    agency: "NASA / ESA",
    launchDate: "April 24, 1990 (Space Shuttle Discovery STS-31)",
    orbitLocation: "Low Earth Orbit (540 km altitude, 95 min orbit)",
    primaryMirrorDiameter: "2.4 meters (7.9 ft)",
    wavelengthBand: "Ultraviolet, Visible, and Near-Infrared (0.1 to 1.0 μm)",
    missionGoals: "Determine rate of expansion of Universe (Hubble Constant), study galaxy formation and cosmic evolution.",
    instruments: [
      "WFC3 (Wide Field Camera 3)",
      "COS (Cosmic Origins Spectrograph)",
      "ACS (Advanced Camera for Surveys)",
      "STIS (Space Telescope Imaging Spectrograph)"
    ],
    temperature: "Operating in thermal orbit swing (-100 °C to +100 °C)",
    history: "Named after astronomer Edwin Hubble. Initially suffered spherical aberration in its primary mirror, repaired by astronauts in 1993 STS-61 spacewalk with COSTAR corrective optics. Serviced 5 times by NASA Space Shuttles.",
    discoveries: [
      "Pinned down age of Universe to ~13.8 billion years",
      "Provided definitive evidence that supermassive black holes lie at galactic centers",
      "Captured iconic Hubble Deep Field (thousands of distant galaxies in a speck of dark sky)"
    ],
    status: "Active (Over 35 years of continuous science discoveries)",
    model3dType: "hubble"
  },
  {
    id: "spitzer",
    name: "Spitzer Space Telescope",
    agency: "NASA (Jet Propulsion Laboratory)",
    launchDate: "August 25, 2003 (Delta II Rocket)",
    orbitLocation: "Earth-Trailing Heliocentric Orbit",
    primaryMirrorDiameter: "0.85 meters (Beryllium Cryogenic Mirror)",
    wavelengthBand: "Thermal Infrared (3 to 180 μm)",
    missionGoals: "Reveal the cold, dust-shrouded cosmic universe, detect exoplanet transits, and map stellar nurseries.",
    instruments: [
      "IRAC (Infrared Array Camera)",
      "IRS (Infrared Spectrograph)",
      "MIPS (Multiband Imaging Photometer)"
    ],
    temperature: "-268 °C (5.5 Kelvin cooled with Liquid Helium)",
    history: "Fourth of NASA's Great Observatories program. Pioneer of infrared astronomy that drifted behind Earth in solar orbit. Concluded its primary mission after 16 years in 2020.",
    discoveries: [
      "Discovered the largest known outer dust ring around Saturn (Phoebe Ring)",
      "Discovered 5 of the 7 Earth-sized rocky exoplanets in the TRAPPIST-1 system",
      "First telescope to directly detect light from exoplanets (HD 209458b)"
    ],
    status: "Mission Completed (Legacy continues in JWST science)",
    model3dType: "spitzer"
  },
  {
    id: "chandra",
    name: "Chandra X-ray Observatory",
    agency: "NASA / Smithsonian Astrophysical Observatory",
    launchDate: "July 23, 1999 (Space Shuttle Columbia STS-93)",
    orbitLocation: "High Elliptical Earth Orbit (16,000 km to 133,000 km)",
    primaryMirrorDiameter: "1.2 meters (Nested Wolter-I cylindrical iridium mirrors)",
    wavelengthBand: "High-Energy X-Rays (0.1 to 10 keV)",
    missionGoals: "Observe high-energy violent regions: black holes, supernova remnants, colliding galaxy clusters, and dark matter.",
    instruments: [
      "ACIS (Advanced CCD Imaging Spectrometer)",
      "HRC (High Resolution Camera)",
      "HETG (High Energy Transmission Grating)"
    ],
    temperature: "-120 °C detector focal plane",
    history: "Named after Nobel laureate Subrahmanyan Chandrasekhar. Deployed by Eileen Collins, NASA's first female Shuttle Commander. Orbits far above Earth's Van Allen radiation belts.",
    discoveries: [
      "Captured first direct observation of Dark Matter in the Bullet Cluster collision",
      "Resolved X-ray emission from accretion disks surrounding Sagittarius A* and M87*",
      "Tracked shockwaves and titanium debris from Supernova 1987A"
    ],
    status: "Active (25+ years of high-energy astrophysics)",
    model3dType: "chandra"
  },
  {
    id: "kepler",
    name: "Kepler & K2 Space Observatory",
    agency: "NASA / Ames Research Center",
    launchDate: "March 6, 2009 (Delta II Rocket)",
    orbitLocation: "Earth-Trailing Heliocentric Orbit",
    primaryMirrorDiameter: "1.4 meters (Schmidt photometer telescope)",
    wavelengthBand: "Visible Light (Ultra-high precision transit photometry)",
    missionGoals: "Survey the Milky Way to discover Earth-size and larger exoplanets in the habitable zone.",
    instruments: ["95-Megapixel Photometer CCD Array (42 CCD sensors)"],
    temperature: "-100 °C sensor focal plane",
    history: "Stared continuously at 150,000 stars in Cygnus-Lyra for 4 years. After reaction wheel failures in 2013, revived in the ingenious 'K2' mission using solar radiation pressure as a virtual steering wheel.",
    discoveries: [
      "Discovered over 2,700 confirmed exoplanets and revolutionized planetary science",
      "Proved that planets outnumber stars in the Milky Way galaxy",
      "Found first Earth-size habitable zone planet Kepler-186f and Kepler-452b"
    ],
    status: "Mission Completed (Retired November 2018)",
    model3dType: "kepler"
  },
  {
    id: "aditya_l1",
    name: "Aditya-L1 Solar Observatory",
    agency: "ISRO (Indian Space Research Organisation)",
    launchDate: "September 2, 2023 (PSLV-C57)",
    orbitLocation: "Sun-Earth L1 Lagrange Point (1.5 Million km from Earth)",
    primaryMirrorDiameter: "Visible Emission Line Coronagraph (VELC) Optics",
    wavelengthBand: "UV, Visible, X-Ray & Solar Wind Particles",
    missionGoals: "Study solar coronal heating, solar flares, Coronal Mass Ejections (CMEs), and space weather impact on Earth.",
    instruments: [
      "VELC (Visible Emission Line Coronagraph)",
      "SUIT (Solar Ultraviolet Imaging Telescope)",
      "SoLEXS (Solar Low Energy X-ray Spectrometer)",
      "ASPEX (Aditya Solar wind Particle Experiment)"
    ],
    temperature: "Multi-layered thermal insulation facing continuous unfiltered solar radiation",
    history: "India's first dedicated space-based solar observatory. Positioned into a halo orbit around the Sun-Earth L1 point with an uninterrupted 24/7 view of the Sun without eclipses.",
    discoveries: [
      "Captured high-resolution full-disc ultraviolet images of solar photosphere and chromosphere",
      "Monitored extreme solar flares during the historic May 2024 geomagnetic storms"
    ],
    status: "Active & Transmitting Real-Time Solar Telemetry",
    model3dType: "aditya"
  },
  {
    id: "voyager1",
    name: "Voyager 1 & 2 Interstellar Probes",
    agency: "NASA / Jet Propulsion Laboratory",
    launchDate: "September 5, 1977 (Titan IIIE-Centaur)",
    orbitLocation: "Interstellar Space (Over 24 Billion km from Earth - Most distant human object)",
    primaryMirrorDiameter: "3.7-meter High-Gain Radio Dish Antenna",
    wavelengthBand: "Radio Telemetry, Magnetometer & Cosmic Ray Sensors",
    missionGoals: "Grand Tour of Jupiter, Saturn, Uranus, Neptune, and exploration of the interstellar medium beyond the heliopause.",
    instruments: [
      "Plasma Wave Subsystem (PWS)",
      "Low Energy Charged Particle (LECP)",
      "Magnetometer (MAG)",
      "Cosmic Ray System (CRS)"
    ],
    temperature: "-200 °C deep cosmic vacuum powered by Plutonium-238 RTG generators",
    history: "Took advantage of a rare planetary alignment occurring once every 175 years. In 2012, Voyager 1 crossed the Heliopause into true interstellar space, carrying the famous Golden Record containing Earth's greetings, music, and biology.",
    discoveries: [
      "Discovered active sulfur volcanoes on Jupiter's moon Io",
      "Captured the iconic 'Pale Blue Dot' portrait of Earth from 6 billion km away",
      "Directly measured the density and magnetic field of the interstellar medium outside our Solar System"
    ],
    status: "Active (Operating continuously for over 48+ years!)",
    model3dType: "voyager"
  }
];

// ============================================================================
// EXOPLANETARY SYSTEMS & ALIEN WORLDS
// ============================================================================
export const EXOPLANETS_DATA = [
  {
    id: "trappist1e",
    name: "TRAPPIST-1e",
    system: "TRAPPIST-1 System (7 Rocky Worlds)",
    hostStar: "Ultra-cool Red Dwarf Star (M8V)",
    distanceLightYears: 39.5,
    constellation: "Aquarius",
    massRelEarth: 0.69,
    radiusRelEarth: 0.92,
    orbitalPeriodDays: 6.1,
    surfaceTempEst: "-15 °C to 15 °C (Habitable Zone)",
    atmosphereStatus: "Candidate for liquid water oceans and nitrogen-rich atmosphere under JWST spectroscopy.",
    stellarHabitability: "High - inside conservative habitable zone where liquid water can pool on surface.",
    visualColor: "#4a90e2",
    description: "One of the most promising habitable exoplanet candidates known. Orbits closely around a compact red dwarf with six sister planets in sight.",
    spectralSignature: { h2o: "Detected Trace", co2: "High Probability", o2: "Observing", ch4: "Moderate" }
  },
  {
    id: "proxima_b",
    name: "Proxima Centauri b",
    system: "Alpha Centauri Triple Star System",
    hostStar: "Proxima Centauri (Red Dwarf)",
    distanceLightYears: 4.24,
    constellation: "Centaurus",
    massRelEarth: 1.17,
    radiusRelEarth: 1.07,
    orbitalPeriodDays: 11.2,
    surfaceTempEst: "-39 °C (Without Greenhouse Effect)",
    atmosphereStatus: "Tidally locked; subject to stellar flares and coronal mass ejections from its host star.",
    stellarHabitability: "Moderate - closest exoplanet to Earth, prime target for future interstellar laser sails.",
    visualColor: "#cf6a4c",
    description: "The closest known exoplanet to humankind. An Earth-sized rocky world orbiting in the habitable zone of our nearest stellar neighbor.",
    spectralSignature: { h2o: "Under Analysis", co2: "Detected", o2: "Searching", ch4: "Low" }
  },
  {
    id: "kepler452b",
    name: "Kepler-452b ('Earth 2.0')",
    system: "Kepler-452 System",
    hostStar: "G2V Yellow Dwarf (Sun-like star)",
    distanceLightYears: 1402,
    constellation: "Cygnus",
    massRelEarth: 5.0,
    radiusRelEarth: 1.63,
    orbitalPeriodDays: 384.8,
    surfaceTempEst: "-8 °C to 30 °C",
    atmosphereStatus: "Likely thick atmosphere with active volcanism and greenhouse effects.",
    stellarHabitability: "High - orbits a star virtually identical to our Sun at a 1.05 AU equivalent distance.",
    visualColor: "#39a085",
    description: "Often hailed as 'Earth's Older Cousin'. It has spent 6 billion years in the habitable zone of its sun-like star.",
    spectralSignature: { h2o: "High Probability", co2: "High", o2: "Candidate", ch4: "Detected" }
  },
  {
    id: "cancri55e",
    name: "55 Cancri e (Janssen)",
    system: "55 Cancri (Copernicus)",
    hostStar: "G8V Yellow Dwarf",
    distanceLightYears: 41,
    constellation: "Cancer",
    massRelEarth: 8.0,
    radiusRelEarth: 1.88,
    orbitalPeriodDays: 0.74,
    surfaceTempEst: "2,000 °C to 2,400 °C",
    atmosphereStatus: "Exotic atmosphere rich in carbon and hydrogen cyanide with oceans of glowing lava.",
    stellarHabitability: "Hostile - Extreme Lava World. Hypothesized to contain a thick mantle made of diamond.",
    visualColor: "#ff4500",
    description: "A blistering super-Earth so close to its star that its surface is a churning ocean of molten lava, with skies raining molten rock.",
    spectralSignature: { h2o: "None (Too Hot)", co2: "Detected by JWST", o2: "None", ch4: "Graphite/Carbon Rich" }
  }
];

// ============================================================================
// DEEP SPACE OBJECTS, GALAXIES & COSMOLOGY
// ============================================================================
export const DEEP_SPACE_DATA = {
  milkyway: {
    id: "milkyway",
    name: "Milky Way Galaxy",
    type: "Barred Spiral Galaxy (SBbc)",
    diameterLightYears: 100000,
    starsCount: "100 to 400 Billion Stars",
    centralObject: "Sagittarius A* (Supermassive Black Hole ~4.3M Solar Masses)",
    spiralArms: ["Perseus Arm", "Scutum-Centaurus Arm", "Sagittarius Arm", "Orion-Cygnus Spur (Our Home)"],
    rotationSpeed: "220 km/s (Our solar system takes 230M years for 1 galactic year)",
    description: "Our galactic metropolis. A barred spiral disc containing gas, dust, and hundreds of billions of solar systems spinning around Sagittarius A*."
  },
  andromeda: {
    id: "andromeda",
    name: "Andromeda Galaxy (M31)",
    type: "Major Spiral Galaxy (SA(s)b)",
    diameterLightYears: 220000,
    distanceFromMilkyWay: "2.5 Million Light Years",
    starsCount: "~1 Trillion Stars",
    collisionTime: "Colliding with Milky Way in ~4.5 Billion Years to form 'Milkomeda'",
    description: "The largest galaxy in our Local Group. Currently hurtling toward the Milky Way at 110 km/second, set to merge into a giant elliptical galaxy."
  },
  gargantua: {
    id: "gargantua",
    name: "Supermassive Black Hole & Accretion Disk",
    type: "Rotating Kerr Black Hole (Relativistic)",
    mass: "6.5 Billion Solar Masses (Analogous to M87*)",
    eventHorizonRadius: "38.5 Billion km (Schwarzschild Radius)",
    accretionDiskTemp: "Millions of Kelvin (Emits high-energy X-Rays and Synchrotron Radiation)",
    phenomena: ["Gravitational Lensing", "Frame Dragging (Ergosphere)", "Relativistic Jets", "Photon Sphere Ring"],
    description: "A cosmic singularity where gravity curves spacetime to infinity. Matter spiraling into the event horizon heats up to relativistic plasma glowing brightly."
  },
  orion_nebula: {
    id: "orion_nebula",
    name: "Orion Nebula (Messier 42)",
    type: "Diffuse Stellar Nursery & Emission Nebula",
    diameterLightYears: 24,
    distanceFromEarth: "1,344 Light Years",
    stellarNursery: "Thousands of newborn stars and protoplanetary discs (proplyds) forming planets right now.",
    description: "A glowing cosmic cloud of hydrogen, helium, and ionized gas where brand new stars and solar systems are being born right before our eyes."
  }
};

// ============================================================================
// COSMIC QUIZ & ACADEMY QUESTIONS
// ============================================================================
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "solar_system",
    question: "Which planet in our Solar System has the hottest average surface temperature?",
    options: ["Mercury (Closest to Sun)", "Venus (Runaway Greenhouse Effect)", "Mars", "Jupiter"],
    correctIndex: 1,
    explanation: "Venus is the hottest planet (~465 °C) because its dense 96.5% Carbon Dioxide atmosphere traps solar heat through runaway greenhouse effect, even though Mercury is closer to the Sun."
  },
  {
    id: 2,
    category: "telescopes",
    question: "Where is the James Webb Space Telescope (JWST) located in space?",
    options: ["Low Earth Orbit next to Hubble", "On the surface of the Moon", "At the Sun-Earth L2 Lagrange Point (1.5M km away)", "Orbiting around Mars"],
    correctIndex: 2,
    explanation: "JWST operates at the Sun-Earth L2 point, where gravitational forces allow it to stay in fixed alignment with Earth while keeping its sunshield facing the Sun."
  },
  {
    id: 3,
    category: "agriculture",
    question: "What happens to most plants when atmospheric CO₂ is elevated in controlled greenhouses?",
    options: ["Photosynthetic rate and water-use efficiency increase", "Plant growth stops completely", "Plants lose all green chlorophyll", "Plants consume 10x more oxygen"],
    correctIndex: 0,
    explanation: "CO₂ enrichment (up to 800-1200 ppm) accelerates Rubisco enzyme activity during photosynthesis, boosting biomass yields and improving water-use efficiency."
  },
  {
    id: 4,
    category: "galaxies",
    question: "What is at the dead center of our Milky Way Galaxy?",
    options: ["A super-dense cloud of water vapor", "Sagittarius A* (a Supermassive Black Hole)", "A giant dying red star", "The planet Jupiter"],
    correctIndex: 1,
    explanation: "Sagittarius A* is a supermassive black hole with a mass equal to ~4.3 million times our Sun, holding the galactic center together."
  },
  {
    id: 5,
    category: "earth_climate",
    question: "Which NASA satellite instrument measures global Land Surface Temperature (LST) and thermal anomalies?",
    options: ["MODIS on Terra and Aqua satellites", "Voyager 1 plasma wave sensor", "Apollo 11 seismometer", "New Horizons LORRI"],
    correctIndex: 0,
    explanation: "NASA's MODIS (Moderate Resolution Imaging Spectroradiometer) on Terra & Aqua satellites maps Earth's daily surface temperature and wildfire heat anomalies."
  },
  {
    id: 6,
    category: "agriculture",
    question: "Which crop is tested extensively on the ISS (Veggie experiment) for astronaut life support due to rapid growth?",
    options: ["Space Lettuce & Mizuna Mustard greens", "Coconut palms", "Giant bamboo", "Sugarcane stalks"],
    correctIndex: 0,
    explanation: "NASA astronauts on the International Space Station grew and harvested 'Outredgeous' red romaine lettuce and Mizuna mustard under LED light arrays in the Veggie facility."
  },
  {
    id: 7,
    category: "telescopes",
    question: "What was the purpose of the Golden Record placed aboard NASA's Voyager 1 & 2 spacecraft?",
    options: ["To balance spacecraft weight", "To carry sounds, images, and cultural greetings of Earth to extraterrestrial life", "To store scientific backup code", "To shield the radio antenna"],
    correctIndex: 1,
    explanation: "Curated by Carl Sagan, the Golden Record contains 115 images, sounds of wind, thunder, animals, spoken greetings in 55 languages, and music representing humanity."
  },
  {
    id: 8,
    category: "telescopes",
    question: "Which Indian space mission is dedicated to studying the Sun from the Sun-Earth L1 point?",
    options: ["Aditya-L1", "Chandrayaan-3", "Mangalyaan", "AstroSat"],
    correctIndex: 0,
    explanation: "ISRO's Aditya-L1 is India's premier solar observatory stationed at the Sun-Earth L1 point, providing continuous 24/7 observations of the solar corona and flares."
  },
  {
    id: 9,
    category: "earth_climate",
    question: "What index is used by agricultural satellites to measure vegetation greenness and crop chlorophyll health?",
    options: ["NDVI (Normalized Difference Vegetation Index)", "Richter Scale", "Kelvin Heat Index", "Sonar Doppler Ratio"],
    correctIndex: 0,
    explanation: "NDVI measures the difference between near-infrared (which healthy vegetation strongly reflects) and red light (which vegetation absorbs) to gauge crop canopy density."
  },
  {
    id: 10,
    category: "galaxies",
    question: "What will happen when the Andromeda Galaxy collides with the Milky Way in ~4.5 billion years?",
    options: ["Both galaxies will explode into dust", "Individual stars will rarely collide; they will merge into a giant elliptical galaxy", "The Universe will collapse", "The Sun will turn into a black hole immediately"],
    correctIndex: 1,
    explanation: "Because stars are separated by light years of empty space, stellar collisions are extremely rare. The two galaxies' gravitational fields will intertwine to form 'Milkomeda'."
  }
];
