// ============================================================================
// COSMIC EXPLORER - AGRO-ATMOSPHERIC & BOTANICAL DATABASE
// Plant Growth, Environmental Tolerance, Gas Ratios & Astro-Botany
// ============================================================================

export const CROPS_DATA = [
  // ==================== CEREALS & GRAINS ====================
  {
    id: "rice",
    name: "Rice (Paddy / Oryza sativa)",
    category: "Cereal Grain",
    icon: "🌾",
    tempOptMin: 22,
    tempOptMax: 32,
    tempCritMin: 12,
    tempCritMax: 42,
    co2OptPpm: 800, // Elevated CO2 accelerates C3 grain weight
    co2Tolerance: { min: 300, max: 1500 },
    pressureToleranceHpa: { min: 700, max: 1100 }, // Low altitude wetland
    humidityOpt: { min: 70, max: 90 }, // High humidity
    solarLightWm2: { min: 250, max: 550 },
    waterReqMm: "1100 - 1500 mm",
    soilType: "Clay loam, Heavy silt, Floodplain mud (Submerged/Aerobic)",
    growthDurationDays: "110 - 140 days",
    photosynthesisType: "C3",
    astroSuitabilityScore: 65,
    astroNotes: "High water footprint; requires dwarf cultivars for hydroponics on space stations.",
    pestRisks: [
      { name: "Bacterial Leaf Blight", trigger: "Temp > 28°C & Humidity > 85%", mitigation: "Copper oxychloride & field drainage" },
      { name: "Stem Borer", trigger: "Warm dry spells after rain", mitigation: "Pheromone traps & Trichogramma release" }
    ],
    recommendedSeason: "Kharif / Monsoon / Wet Season",
    description: "Primary staple food for over half the human population. Requires abundant standing water and warm tropical to subtropical conditions."
  },
  {
    id: "wheat",
    name: "Wheat (Triticum aestivum)",
    category: "Cereal Grain",
    icon: "🌾",
    tempOptMin: 15,
    tempOptMax: 24,
    tempCritMin: 3,
    tempCritMax: 35,
    co2OptPpm: 900,
    co2Tolerance: { min: 320, max: 1600 },
    pressureToleranceHpa: { min: 550, max: 1050 }, // Thrives in high plateaus
    humidityOpt: { min: 45, max: 70 },
    solarLightWm2: { min: 300, max: 600 },
    waterReqMm: "450 - 650 mm",
    soilType: "Well-drained Loam, Clay-Loam (pH 6.0 - 7.5)",
    growthDurationDays: "100 - 130 days",
    photosynthesisType: "C3",
    astroSuitabilityScore: 82, // USU-Apogee dwarf wheat is NASA tested!
    astroNotes: "Dwarf cultivars (USU-Apogee) successfully grown in NASA CELSS chambers at 1200 ppm CO₂ with 3x Earth yield!",
    pestRisks: [
      { name: "Stripe & Yellow Rust", trigger: "Cool temps (10-18°C) + High humidity", mitigation: "Resistant varieties & Propiconazole spray" },
      { name: "Aphids & Termites", trigger: "Unseasonal winter heat spikes", mitigation: "Neem oil or Imidacloprid" }
    ],
    recommendedSeason: "Rabi / Winter / Cool Season",
    description: "Cool-season staple grain providing 20% of all dietary calories. Highly responsive to CO₂ enrichment in controlled atmospheres."
  },
  {
    id: "maize",
    name: "Maize (Corn / Zea mays)",
    category: "Cereal Grain",
    icon: "🌽",
    tempOptMin: 20,
    tempOptMax: 30,
    tempCritMin: 10,
    tempCritMax: 40,
    co2OptPpm: 600, // C4 plant saturation at lower CO2
    co2Tolerance: { min: 350, max: 1200 },
    pressureToleranceHpa: { min: 650, max: 1050 },
    humidityOpt: { min: 50, max: 80 },
    solarLightWm2: { min: 350, max: 700 },
    waterReqMm: "500 - 800 mm",
    soilType: "Deep fertile loam, Sandy loam with high organic matter",
    growthDurationDays: "90 - 120 days",
    photosynthesisType: "C4 (High Water-Use Efficiency)",
    astroSuitabilityScore: 70,
    astroNotes: "C4 pathway provides intense biomass production, but requires large vertical headspace.",
    pestRisks: [
      { name: "Fall Armyworm", trigger: "Night temperatures > 22°C", mitigation: "Bt-based bio-pesticides & light traps" },
      { name: "Leaf Blight", trigger: "Cloudy humid weather during tassel stage", mitigation: "Mancozeb or Azoxystrobin" }
    ],
    recommendedSeason: "Kharif & Spring",
    description: "Powerhouse C4 grain with exceptional photosynthetic efficiency and multi-purpose industrial and food utility."
  },
  {
    id: "millets",
    name: "Pearl Millet & Sorghum (Bajra / Jowar)",
    category: "Superfood Cereal",
    icon: "🌾",
    tempOptMin: 25,
    tempOptMax: 36,
    tempCritMin: 15,
    tempCritMax: 46, // Super heat-tolerant!
    co2OptPpm: 550,
    co2Tolerance: { min: 300, max: 1200 },
    pressureToleranceHpa: { min: 600, max: 1050 },
    humidityOpt: { min: 25, max: 65 }, // High drought tolerance
    solarLightWm2: { min: 400, max: 850 },
    waterReqMm: "250 - 450 mm (Extremely low water)",
    soilType: "Arid soils, Sandy loam, Marginal drylands",
    growthDurationDays: "75 - 90 days",
    photosynthesisType: "C4 (Drought Resilient)",
    astroSuitabilityScore: 88,
    astroNotes: "Extremely resilient to heat shocks and water scarcity; prime candidate for closed-loop arid terraforming.",
    pestRisks: [
      { name: "Downy Mildew", trigger: "High humidity during seedling stage", mitigation: "Metalaxyl seed dressing" }
    ],
    recommendedSeason: "Kharif / Arid Summer",
    description: "Nutrient-dense super-grain thriving in 40°C+ heat waves with minimal irrigation. Rich in iron, calcium, and dietary fiber."
  },

  // ==================== ASTRO-BOTANY & CONTROLLED BIOSPHERE CROPS ====================
  {
    id: "space_lettuce",
    name: "Outredgeous Space Lettuce (Lactuca sativa)",
    category: "Astro-Botany Super Crop",
    icon: "🥬",
    tempOptMin: 18,
    tempOptMax: 24,
    tempCritMin: 7,
    tempCritMax: 32,
    co2OptPpm: 1200, // Supercharged under greenhouse CO2
    co2Tolerance: { min: 380, max: 2500 },
    pressureToleranceHpa: { min: 500, max: 1100 }, // Proven in ISS 1 atm & hypobaric domes
    humidityOpt: { min: 55, max: 75 },
    solarLightWm2: { min: 180, max: 400 },
    waterReqMm: "150 - 250 mm (Aeroponic / Hydroponic recycled)",
    soilType: "Porous ceramic arcillite substrate / Hydroponic nutrient film",
    growthDurationDays: "28 - 35 days (Fast Harvest)",
    photosynthesisType: "C3",
    astroSuitabilityScore: 98,
    astroNotes: "Successfully grown and eaten by astronauts on the ISS Veggie and APH (Advanced Plant Habitat) units!",
    pestRisks: [
      { name: "Tipburn / Pythium Root Rot", trigger: "High humidity & stagnant air in microgravity", mitigation: "Forced laminar air circulation & UV water sterilization" }
    ],
    recommendedSeason: "All Year (Climate-Controlled / Hydroponics)",
    description: "The pioneering space-farm crop. Rich in antioxidants and anthocyanins protecting astronauts from cosmic radiation."
  },
  {
    id: "spirulina",
    name: "Spirulina Algae (Arthrospira platensis)",
    category: "Astro-Botany Micro-Algae",
    icon: "🧪",
    tempOptMin: 30,
    tempOptMax: 38,
    tempCritMin: 18,
    tempCritMax: 45,
    co2OptPpm: 2500, // Massive CO2 sequestration!
    co2Tolerance: { min: 400, max: 10000 },
    pressureToleranceHpa: { min: 300, max: 1500 },
    humidityOpt: { min: 20, max: 100 }, // Liquid bioreactor
    solarLightWm2: { min: 150, max: 600 },
    waterReqMm: "Closed photobioreactor (99% recycling)",
    growthDurationDays: "3 - 5 days continuous doubling",
    photosynthesisType: "Cyanobacterial Oxygenic",
    astroSuitabilityScore: 99,
    astroNotes: "ESA MELiSSA & NASA primary candidate for oxygen generation and complete 65% protein food in deep space.",
    pestRisks: [
      { name: "Contamination by amoebae", trigger: "pH drop below 9.0", mitigation: "Maintain high alkaline sodium bicarbonate pH 9.5-10.5" }
    ],
    recommendedSeason: "All Seasons in Bioreactor",
    description: "70% complete protein by dry weight. Generates high purity Oxygen from astronaut CO₂ exhalations."
  },
  {
    id: "potato",
    name: "Potato (Solanum tuberosum)",
    category: "Tuber / Root Crop",
    icon: "🥔",
    tempOptMin: 15,
    tempOptMax: 22,
    tempCritMin: 5,
    tempCritMax: 29,
    co2OptPpm: 1000,
    co2Tolerance: { min: 350, max: 2000 },
    pressureToleranceHpa: { min: 550, max: 1100 },
    humidityOpt: { min: 65, max: 85 },
    solarLightWm2: { min: 250, max: 500 },
    waterReqMm: "500 - 700 mm",
    soilType: "Loose sandy loam, Aeroponic mist, Martian simulant regolith",
    growthDurationDays: "90 - 110 days",
    photosynthesisType: "C3",
    astroSuitabilityScore: 94,
    astroNotes: "Famous in 'The Martian'. Tested by CIP & NASA in hyper-saline desert Mars analog soils.",
    pestRisks: [
      { name: "Late Blight (Phytophthora)", trigger: "Cold foggy damp weather (<18°C + 95% RH)", mitigation: "Systemic fungicides & certified disease-free tubers" }
    ],
    recommendedSeason: "Rabi / Autumn-Winter",
    description: "High calorie-per-square-meter yield. Tubers develop underground, shielded from harsh surface microclimates."
  },

  // ==================== CASH CROPS & COMMERCIAL ====================
  {
    id: "cotton",
    name: "Cotton (Gossypium hirsutum)",
    category: "Cash / Fiber Crop",
    icon: "☁️",
    tempOptMin: 24,
    tempOptMax: 34,
    tempCritMin: 15,
    tempCritMax: 44,
    co2OptPpm: 750,
    co2Tolerance: { min: 350, max: 1400 },
    pressureToleranceHpa: { min: 700, max: 1050 },
    humidityOpt: { min: 40, max: 70 },
    solarLightWm2: { min: 400, max: 800 },
    waterReqMm: "600 - 900 mm",
    soilType: "Deep black clay soil (Regur), fertile alluvial loam",
    growthDurationDays: "150 - 180 days",
    photosynthesisType: "C3",
    astroSuitabilityScore: 60,
    astroNotes: "Sprouted on the Moon aboard China's Chang'e 4 lunar lander mini-biosphere in 2019!",
    pestRisks: [
      { name: "Pink Bollworm", trigger: "High evening temperatures", mitigation: "Bt-traits, mating disruption dispensers & neem sprays" },
      { name: "Whitefly & Leaf Curl Virus", trigger: "Dry warm spells during vegetative stage", mitigation: "Yellow sticky traps and Diafenthiuron" }
    ],
    recommendedSeason: "Kharif / Summer",
    description: "Leading natural textile fiber. Requires long frost-free periods, abundant sunshine, and moderate rainfall during growth followed by dry harvest."
  },
  {
    id: "sugarcane",
    name: "Sugarcane (Saccharum officinarum)",
    category: "Cash / Bioenergy Crop",
    icon: "🎋",
    tempOptMin: 26,
    tempOptMax: 35,
    tempCritMin: 18,
    tempCritMax: 45,
    co2OptPpm: 650,
    co2Tolerance: { min: 350, max: 1200 },
    pressureToleranceHpa: { min: 750, max: 1050 },
    humidityOpt: { min: 60, max: 85 },
    solarLightWm2: { min: 450, max: 850 },
    waterReqMm: "1500 - 2500 mm (High water)",
    soilType: "Deep rich loamy soils, well-drained river basin soils",
    growthDurationDays: "300 - 365 days (1 Full Year)",
    photosynthesisType: "C4 (Maximum Solar Conversion)",
    astroSuitabilityScore: 50,
    astroNotes: "Huge biomass yield, but long 1-year growth cycle limits closed space life support.",
    pestRisks: [
      { name: "Red Rot Disease", trigger: "Waterlogging + 30°C temperature", mitigation: "Trichoderma soil application & crop rotation" }
    ],
    recommendedSeason: "Annual Planting (Spring / Autumn)",
    description: "Giant perennial grass storing sucrose in thick stalks. Essential source of table sugar and ethanol biofuel."
  },
  {
    id: "soybean",
    name: "Soybean (Glycine max)",
    category: "Legume / Oilseed",
    icon: "🌱",
    tempOptMin: 22,
    tempOptMax: 30,
    tempCritMin: 12,
    tempCritMax: 38,
    co2OptPpm: 850,
    co2Tolerance: { min: 320, max: 1500 },
    pressureToleranceHpa: { min: 650, max: 1050 },
    humidityOpt: { min: 50, max: 75 },
    solarLightWm2: { min: 300, max: 650 },
    waterReqMm: "450 - 700 mm",
    soilType: "Fertile loam with Bradyrhizobium nitrogen-fixing bacteria",
    growthDurationDays: "90 - 115 days",
    photosynthesisType: "C3 (Nitrogen-Fixing)",
    astroSuitabilityScore: 89,
    astroNotes: "High protein & oil balance; fixates atmospheric nitrogen into soil, vital for terraforming Martian regolith.",
    pestRisks: [
      { name: "Yellow Mosaic Virus", trigger: "Whitefly activity in humid warmth", mitigation: "Resistant cultivars & seed treatment" }
    ],
    recommendedSeason: "Kharif / Monsoon",
    description: "Miracle bean providing 40% protein and 20% healthy lipids while enriching soil with atmospheric nitrogen."
  },

  // ==================== HORTICULTURE & VEGETABLES ====================
  {
    id: "tomato",
    name: "Tomato (Solanum lycopersicum)",
    category: "Horticultural Fruit-Vegetable",
    icon: "🍅",
    tempOptMin: 20,
    tempOptMax: 27,
    tempCritMin: 10,
    tempCritMax: 35,
    co2OptPpm: 1000,
    co2Tolerance: { min: 350, max: 1800 },
    pressureToleranceHpa: { min: 600, max: 1050 },
    humidityOpt: { min: 50, max: 70 },
    solarLightWm2: { min: 300, max: 600 },
    waterReqMm: "400 - 600 mm (Drip irrigation optimized)",
    soilType: "Sandy loam rich in organic compost (pH 6.0 - 6.8)",
    growthDurationDays: "70 - 90 days",
    photosynthesisType: "C3",
    astroSuitabilityScore: 91,
    astroNotes: "NASA Red Robin micro-dwarf tomatoes harvested on ISS in Veg-05 experiment!",
    pestRisks: [
      { name: "Early & Late Blight", trigger: "High humidity + wet foliage", mitigation: "Drip irrigation to keep leaves dry; Mancozeb" },
      { name: "Blossom End Rot", trigger: "Calcium deficiency triggered by heat stress", mitigation: "Maintain uniform soil moisture & foliar calcium" }
    ],
    recommendedSeason: "Autumn, Winter & Early Spring",
    description: "Global kitchen favorite rich in lycopene and vitamin C. Highly responsive to controlled greenhouse automation."
  },
  {
    id: "chili",
    name: "Hot Pepper / Chili (Capsicum annuum)",
    category: "Spices & Veg",
    icon: "🌶️",
    tempOptMin: 22,
    tempOptMax: 32,
    tempCritMin: 14,
    tempCritMax: 40,
    co2OptPpm: 900,
    co2Tolerance: { min: 350, max: 1500 },
    pressureToleranceHpa: { min: 650, max: 1050 },
    humidityOpt: { min: 45, max: 70 },
    solarLightWm2: { min: 350, max: 700 },
    waterReqMm: "350 - 500 mm",
    soilType: "Well-drained light loamy soils",
    growthDurationDays: "80 - 105 days",
    photosynthesisType: "C3",
    astroSuitabilityScore: 93,
    astroNotes: "Hatch chile peppers grown on ISS in Plant Habitat-04 set record for longest space experiment!",
    pestRisks: [
      { name: "Thrips & Mites", trigger: "Hot dry weather (>32°C)", mitigation: "Spinosad or predatory phytoseiid mites" }
    ],
    recommendedSeason: "Summer & Post-Monsoon",
    description: "Capsaicin-rich spice crop celebrated for enhancing astronaut flavor perception in microgravity environments."
  },

  // ==================== EXTREME ENVIRONMENT & TERRAFORMING ====================
  {
    id: "quinoa",
    name: "Quinoa (Chenopodium quinoa)",
    category: "Extreme Climate Halophyte",
    icon: "🌾",
    tempOptMin: 15,
    tempOptMax: 22,
    tempCritMin: -4, // Survives freezing!
    tempCritMax: 38,
    co2OptPpm: 800,
    co2Tolerance: { min: 300, max: 2000 },
    pressureToleranceHpa: { min: 450, max: 1050 }, // Thrives at 4000m high Andean altitude!
    humidityOpt: { min: 25, max: 60 },
    solarLightWm2: { min: 350, max: 800 },
    waterReqMm: "200 - 400 mm",
    soilType: "Saline soils, rocky gravel, marginal volcanic soils",
    growthDurationDays: "90 - 120 days",
    photosynthesisType: "C3 (Facultative Halophyte)",
    astroSuitabilityScore: 95,
    astroNotes: "Selected by NASA as ideal space crop for long-duration human space flights due to full amino acid profile.",
    pestRisks: [
      { name: "Downy Mildew", trigger: "Excess waterlogging", mitigation: "Raised beds and proper slope drainage" }
    ],
    recommendedSeason: "High Altitude / Cool Season",
    description: "Super-resilient Andean grain packed with complete protein, minerals, and extreme salt/frost resistance."
  },
  {
    id: "cactus_pear",
    name: "Prickly Pear Cactus (Opuntia ficus-indica)",
    category: "Extreme Arid CAM Plant",
    icon: "🌵",
    tempOptMin: 25,
    tempOptMax: 42,
    tempCritMin: -5,
    tempCritMax: 55, // Super-heat survival
    co2OptPpm: 1000,
    co2Tolerance: { min: 250, max: 3000 },
    pressureToleranceHpa: { min: 400, max: 1150 },
    humidityOpt: { min: 10, max: 45 },
    solarLightWm2: { min: 450, max: 1000 },
    waterReqMm: "100 - 250 mm (Extreme drought survivor)",
    soilType: "Desert sand, bare rocky slopes, weathered basalt",
    growthDurationDays: "Perennial succulent",
    photosynthesisType: "CAM (Crassulacean Acid Metabolism)",
    astroSuitabilityScore: 92,
    astroNotes: "Opens stomata only at night to prevent water loss; ultra-efficient carbon capture in arid terraforming domes.",
    pestRisks: [
      { name: "Cochineal scale insect", trigger: "Prolonged dry heat", mitigation: "High pressure water wash & biocontrol" }
    ],
    recommendedSeason: "Year-round Arid & Semi-Arid",
    description: "The ultimate desert survival plant. Converts minimal water into delicious edible pads (nopales) and sweet fruits."
  }
];

// ============================================================================
// ATMOSPHERIC PRESETS FOR BIO-CHAMBER SIMULATION
// ============================================================================
export const ATMOSPHERE_PRESETS = {
  earth_standard: {
    name: "Earth Standard (Sea Level)",
    tempC: 22,
    co2Ppm: 420,
    pressureHpa: 1013,
    humidityPct: 60,
    solarLightWm2: 500,
    description: "Standard Earth troposphere condition with 21% O2, 78% N2, and baseline CO2."
  },
  greenhouse_enriched: {
    name: "Advanced Climate Greenhouse",
    tempC: 26,
    co2Ppm: 1000,
    pressureHpa: 1013,
    humidityPct: 70,
    solarLightWm2: 650,
    description: "CO2-enriched commercial greenhouse optimized for maximum biomass acceleration."
  },
  high_altitude: {
    name: "High Plateau / Andean Alpine (3500m)",
    tempC: 12,
    co2Ppm: 380,
    pressureHpa: 650,
    humidityPct: 35,
    solarLightWm2: 800,
    description: "Low barometric pressure, cold nights, and intense ultraviolet solar radiation."
  },
  arid_desert: {
    name: "Arid Sahara / Thar Desert",
    tempC: 38,
    co2Ppm: 415,
    pressureHpa: 1010,
    humidityPct: 18,
    solarLightWm2: 900,
    description: "Intense heat wave, scorching solar irradiance, and critical atmospheric moisture deficit."
  },
  mars_biodome: {
    name: "Pressurized Martian Bio-Dome",
    tempC: 21,
    co2Ppm: 1500,
    pressureHpa: 700, // Reduced pressure dome saves structural mass
    humidityPct: 65,
    solarLightWm2: 430, // Mars solar constant with LED supplementation
    description: "High CO2, optimized humidity, and lightweight structural hypobaric pressure for extraterrestrial colonies."
  }
};
