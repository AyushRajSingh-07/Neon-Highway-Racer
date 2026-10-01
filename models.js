/**
 * Neon Highway - 3D Models & Procedural Asset Engine
 * Builds procedural 3D models for all 10 playable vehicles (5 bikes, 4 cars, 1 hoverboard),
 * traffic archetypes, and multi-environment roadside scenery across 4 biomes.
 */

// ============================================================================
// 10 SELECTABLE VEHICLE SPECIFICATIONS & PHYSICS PROFILES
// ============================================================================
const VEHICLE_SPECS = {
  // --- Motorcycles ---
  cyber_pulse: {
    id: 'cyber_pulse',
    name: 'Cyber Pulse',
    type: 'bike',
    category: 'Streetfighter',
    price: 0,
    desc: 'Agile cyber streetfighter with ultra-responsive leaning and balanced speed.',
    stats: { speed: 85, accel: 85, handling: 90 },
    maxSpeed: 235,
    cruiseSpeed: 160,
    minSpeed: 90,
    accelRate: 48,
    brakeRate: 65,
    turnSpeed: 6.5,
    bankFactor: 0.42,
    color: '#00f0ff',
    accentColor: '#ff00aa'
  },
  thunder_cruiser: {
    id: 'thunder_cruiser',
    name: 'Thunder Cruiser',
    type: 'bike',
    category: 'Chopper',
    price: 1500,
    desc: 'Heavy muscular chopper with massive low-end torque and rock-solid cruising.',
    stats: { speed: 80, accel: 95, handling: 65 },
    maxSpeed: 220,
    cruiseSpeed: 165,
    minSpeed: 90,
    accelRate: 55,
    brakeRate: 60,
    turnSpeed: 5.5,
    bankFactor: 0.35,
    color: '#ff8800',
    accentColor: '#ffee00'
  },
  shadow_ninja: {
    id: 'shadow_ninja',
    name: 'Shadow Ninja',
    type: 'bike',
    category: 'Hyperbike',
    price: 5500,
    desc: 'Lightweight carbon hyperbike tuned for blinding top speed and razor cornering.',
    stats: { speed: 100, accel: 75, handling: 95 },
    maxSpeed: 255,
    cruiseSpeed: 160,
    minSpeed: 90,
    accelRate: 45,
    brakeRate: 70,
    turnSpeed: 7.2,
    bankFactor: 0.45,
    color: '#111118',
    accentColor: '#00ff88'
  },
  dune_marauder: {
    id: 'dune_marauder',
    name: 'Dune Marauder',
    type: 'bike',
    category: 'Rally Raid',
    price: 2200,
    desc: 'Offroad desert raid bike with knobby dual-sport tires and protective shock cage.',
    stats: { speed: 75, accel: 85, handling: 80 },
    maxSpeed: 215,
    cruiseSpeed: 155,
    minSpeed: 90,
    accelRate: 50,
    brakeRate: 65,
    turnSpeed: 6.0,
    bankFactor: 0.38,
    color: '#c2782b',
    accentColor: '#ffdd44'
  },
  ghost_stryker: {
    id: 'ghost_stryker',
    name: 'Ghost Stryker',
    type: 'bike',
    category: 'Concept Racer',
    price: 6200,
    desc: 'Experimental aerodynamic prototype with active aero fins and glowing cyan conduits.',
    stats: { speed: 95, accel: 90, handling: 92 },
    maxSpeed: 248,
    cruiseSpeed: 165,
    minSpeed: 90,
    accelRate: 52,
    brakeRate: 72,
    turnSpeed: 7.0,
    bankFactor: 0.44,
    color: '#e6e6f0',
    accentColor: '#00d4ff'
  },

  // --- Sports Cars ---
  apex_gt: {
    id: 'apex_gt',
    name: 'Apex GT',
    type: 'car',
    category: 'Track Coupe',
    price: 3000,
    desc: 'Twin-turbo track coupe with wide aero fenders, carbon diffuser, and planted stability.',
    stats: { speed: 88, accel: 82, handling: 78 },
    maxSpeed: 238,
    cruiseSpeed: 160,
    minSpeed: 90,
    accelRate: 46,
    brakeRate: 68,
    turnSpeed: 6.2,
    bankFactor: 0.08,
    color: '#e01040',
    accentColor: '#ffffff'
  },
  enforcer: {
    id: 'enforcer',
    name: 'Enforcer Interceptor',
    type: 'car',
    category: 'Interceptor',
    price: 5000,
    desc: 'Armored highway pursuit interceptor with bull bar, push bumper, and strobe lightbar.',
    stats: { speed: 82, accel: 92, handling: 70 },
    maxSpeed: 228,
    cruiseSpeed: 160,
    minSpeed: 90,
    accelRate: 54,
    brakeRate: 75,
    turnSpeed: 5.6,
    bankFactor: 0.07,
    color: '#1a2030',
    accentColor: '#0088ff'
  },
  titan_hauler: {
    id: 'titan_hauler',
    name: 'Titan Custom Hauler',
    type: 'car',
    category: 'Super Cab',
    price: 7000,
    desc: 'Tuned custom racing semi cab with dual chrome vertical stacks and unstoppable presence.',
    stats: { speed: 70, accel: 78, handling: 60 },
    maxSpeed: 210,
    cruiseSpeed: 155,
    minSpeed: 90,
    accelRate: 44,
    brakeRate: 60,
    turnSpeed: 5.0,
    bankFactor: 0.06,
    color: '#ff8800',
    accentColor: '#222222'
  },
  phantom: {
    id: 'phantom',
    name: 'Phantom Hypercar',
    type: 'car',
    category: 'Hypercar',
    price: 8000,
    desc: 'Low-slung exotic hypercar featuring carbon rear wing and glowing aero diffuser.',
    stats: { speed: 98, accel: 94, handling: 85 },
    maxSpeed: 252,
    cruiseSpeed: 165,
    minSpeed: 90,
    accelRate: 54,
    brakeRate: 75,
    turnSpeed: 6.6,
    bankFactor: 0.08,
    color: '#7b1fa2',
    accentColor: '#00f0ff'
  },

  // --- Hoverboard ---
  quantum_hover: {
    id: 'quantum_hover',
    name: 'Quantum Hover',
    type: 'hover',
    category: 'Maglev Board',
    price: 10000,
    desc: 'Anti-grav repulsor board. Zero friction, floating bob, twin ion thrusters, and agile carving.',
    stats: { speed: 86, accel: 96, handling: 100 },
    maxSpeed: 236,
    cruiseSpeed: 160,
    minSpeed: 90,
    accelRate: 58,
    brakeRate: 70,
    turnSpeed: 7.5,
    bankFactor: 0.35,
    color: '#00ffc8',
    accentColor: '#ff00aa'
  }
};

class ModelFactory {
  constructor() {
    this.textures = this.initTextures();
    this.materials = this.initMaterials();
  }

  // --- Procedural Canvas Textures (Zero External Image Dependencies) ---
  initTextures() {
    const textures = {};

    // 1. Asphalt Road Texture (City & Standard)
    const asphaltCanvas = document.createElement('canvas');
    asphaltCanvas.width = 256;
    asphaltCanvas.height = 256;
    const actx = asphaltCanvas.getContext('2d');
    actx.fillStyle = '#0c0d18';
    actx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const bright = Math.random() * 25;
      actx.fillStyle = `rgba(${bright + 10}, ${bright + 15}, ${bright + 30}, 0.25)`;
      actx.fillRect(x, y, 1.5, 1.5);
    }
    actx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    actx.lineWidth = 1;
    for (let y = 0; y < 256; y += 32) {
      actx.beginPath();
      actx.moveTo(0, y);
      actx.lineTo(256, y);
      actx.stroke();
    }
    textures.asphalt = new THREE.CanvasTexture(asphaltCanvas);
    textures.asphalt.wrapS = THREE.RepeatWrapping;
    textures.asphalt.wrapT = THREE.RepeatWrapping;

    // 2. Desert Highway Road Texture (sun-bleached asphalt with sandy cracks)
    const desertRoadCanvas = document.createElement('canvas');
    desertRoadCanvas.width = 256;
    desertRoadCanvas.height = 256;
    const dctx = desertRoadCanvas.getContext('2d');
    dctx.fillStyle = '#2b231c';
    dctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const bright = Math.random() * 30;
      dctx.fillStyle = `rgba(${bright + 140}, ${bright + 90}, ${bright + 50}, 0.18)`;
      dctx.fillRect(x, y, 2, 2);
    }
    textures.desertRoad = new THREE.CanvasTexture(desertRoadCanvas);
    textures.desertRoad.wrapS = THREE.RepeatWrapping;
    textures.desertRoad.wrapT = THREE.RepeatWrapping;

    // 3. Mountain Road Texture (dark weathered wet asphalt with gravel)
    const mtnRoadCanvas = document.createElement('canvas');
    mtnRoadCanvas.width = 256;
    mtnRoadCanvas.height = 256;
    const mctx = mtnRoadCanvas.getContext('2d');
    mctx.fillStyle = '#161922';
    mctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const bright = Math.random() * 35;
      mctx.fillStyle = `rgba(${bright + 50}, ${bright + 60}, ${bright + 75}, 0.22)`;
      mctx.fillRect(x, y, 1.8, 1.8);
    }
    textures.mountainRoad = new THREE.CanvasTexture(mtnRoadCanvas);
    textures.mountainRoad.wrapS = THREE.RepeatWrapping;
    textures.mountainRoad.wrapT = THREE.RepeatWrapping;

    // 4. Synthwave Neon Grid Road Texture
    const neonGridCanvas = document.createElement('canvas');
    neonGridCanvas.width = 256;
    neonGridCanvas.height = 256;
    const ngctx = neonGridCanvas.getContext('2d');
    ngctx.fillStyle = '#060012';
    ngctx.fillRect(0, 0, 256, 256);
    ngctx.strokeStyle = 'rgba(255, 0, 180, 0.45)';
    ngctx.lineWidth = 2;
    for (let y = 0; y < 256; y += 32) {
      ngctx.beginPath();
      ngctx.moveTo(0, y);
      ngctx.lineTo(256, y);
      ngctx.stroke();
    }
    ngctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    for (let x = 0; x < 256; x += 32) {
      ngctx.beginPath();
      ngctx.moveTo(x, 0);
      ngctx.lineTo(x, 256);
      ngctx.stroke();
    }
    textures.neonGridRoad = new THREE.CanvasTexture(neonGridCanvas);
    textures.neonGridRoad.wrapS = THREE.RepeatWrapping;
    textures.neonGridRoad.wrapT = THREE.RepeatWrapping;

    // 5. Desert Sand & Dunes Terrain Texture
    const sandCanvas = document.createElement('canvas');
    sandCanvas.width = 256;
    sandCanvas.height = 256;
    const sctx = sandCanvas.getContext('2d');
    sctx.fillStyle = '#9c5b28';
    sctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const tone = Math.random() * 40;
      sctx.fillStyle = `rgba(${tone + 180}, ${tone + 110}, ${tone + 60}, 0.22)`;
      sctx.fillRect(x, y, 2.5, 2.5);
    }
    textures.desertSand = new THREE.CanvasTexture(sandCanvas);
    textures.desertSand.wrapS = THREE.RepeatWrapping;
    textures.desertSand.wrapT = THREE.RepeatWrapping;

    // 6. Mountain Snow / Pine Forest Ground
    const mtnTerrainCanvas = document.createElement('canvas');
    mtnTerrainCanvas.width = 256;
    mtnTerrainCanvas.height = 256;
    const mtctx = mtnTerrainCanvas.getContext('2d');
    mtctx.fillStyle = '#18241f';
    mtctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      mtctx.fillStyle = Math.random() < 0.3 ? 'rgba(230, 245, 255, 0.45)' : 'rgba(30, 50, 40, 0.35)';
      mtctx.fillRect(x, y, 2, 2);
    }
    textures.mountainGround = new THREE.CanvasTexture(mtnTerrainCanvas);
    textures.mountainGround.wrapS = THREE.RepeatWrapping;
    textures.mountainGround.wrapT = THREE.RepeatWrapping;

    // 7. Hazard Stripes Texture (for Hauler)
    const hazardCanvas = document.createElement('canvas');
    hazardCanvas.width = 128;
    hazardCanvas.height = 128;
    const hctx = hazardCanvas.getContext('2d');
    hctx.fillStyle = '#111';
    hctx.fillRect(0, 0, 128, 128);
    hctx.fillStyle = '#ffaa00';
    const stripeW = 20;
    for (let x = -128; x < 256; x += stripeW * 2) {
      hctx.beginPath();
      hctx.moveTo(x, 128);
      hctx.lineTo(x + stripeW, 128);
      hctx.lineTo(x + stripeW + 128, 0);
      hctx.lineTo(x + 128, 0);
      hctx.closePath();
      hctx.fill();
    }
    textures.hazard = new THREE.CanvasTexture(hazardCanvas);
    textures.hazard.wrapS = THREE.RepeatWrapping;
    textures.hazard.wrapT = THREE.RepeatWrapping;

    // 8. Cyber City Windows Texture
    const cityCanvas = document.createElement('canvas');
    cityCanvas.width = 128;
    cityCanvas.height = 256;
    const cctx = cityCanvas.getContext('2d');
    cctx.fillStyle = '#080014';
    cctx.fillRect(0, 0, 128, 256);
    for (let y = 8; y < 250; y += 14) {
      for (let x = 6; x < 122; x += 12) {
        if (Math.random() < 0.35) {
          cctx.fillStyle = Math.random() < 0.65 ? '#00f0ff' : '#ff00aa';
          cctx.shadowColor = cctx.fillStyle;
          cctx.shadowBlur = 4;
          cctx.fillRect(x, y, 6, 7);
        }
      }
    }
    textures.cityWindows = new THREE.CanvasTexture(cityCanvas);
    textures.cityWindows.wrapS = THREE.RepeatWrapping;
    textures.cityWindows.wrapT = THREE.RepeatWrapping;

    // 9. Modern Urban Concrete Sidewalk Pavers Texture
    const sidewalkCanvas = document.createElement('canvas');
    sidewalkCanvas.width = 256;
    sidewalkCanvas.height = 256;
    const sdwctx = sidewalkCanvas.getContext('2d');
    sdwctx.fillStyle = '#c0c5ce';
    sdwctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const g = Math.floor(Math.random() * 30 - 15);
      sdwctx.fillStyle = `rgba(${180 + g}, ${185 + g}, ${195 + g}, 0.35)`;
      sdwctx.fillRect(x, y, 1.5, 1.5);
    }
    sdwctx.strokeStyle = 'rgba(70, 75, 85, 0.45)';
    sdwctx.lineWidth = 2;
    for (let x = 0; x <= 256; x += 64) {
      sdwctx.beginPath();
      sdwctx.moveTo(x, 0);
      sdwctx.lineTo(x, 256);
      sdwctx.stroke();
    }
    for (let y = 0; y <= 256; y += 64) {
      sdwctx.beginPath();
      sdwctx.moveTo(0, y);
      sdwctx.lineTo(256, y);
      sdwctx.stroke();
    }
    textures.citySidewalk = new THREE.CanvasTexture(sidewalkCanvas);
    textures.citySidewalk.wrapS = THREE.RepeatWrapping;
    textures.citySidewalk.wrapT = THREE.RepeatWrapping;

    // 10. Commercial Street-Level Storefront Texture
    const sfCanvas = document.createElement('canvas');
    sfCanvas.width = 256;
    sfCanvas.height = 128;
    const sfctx = sfCanvas.getContext('2d');
    sfctx.fillStyle = '#222530';
    sfctx.fillRect(0, 0, 256, 128);
    const grad = sfctx.createLinearGradient(0, 40, 0, 128);
    grad.addColorStop(0, '#e8f0f8');
    grad.addColorStop(0.3, '#d0e0ee');
    grad.addColorStop(1, '#8ea0b5');
    sfctx.fillStyle = grad;
    sfctx.fillRect(16, 42, 224, 78);
    sfctx.fillStyle = '#3a4454';
    sfctx.fillRect(24, 80, 208, 6);
    sfctx.fillRect(24, 105, 208, 6);
    sfctx.strokeStyle = '#181b22';
    sfctx.lineWidth = 4;
    sfctx.strokeRect(16, 42, 224, 78);
    sfctx.beginPath();
    sfctx.moveTo(128, 42); sfctx.lineTo(128, 120);
    sfctx.moveTo(72, 42); sfctx.lineTo(72, 120);
    sfctx.moveTo(184, 42); sfctx.lineTo(184, 120);
    sfctx.stroke();
    const awningW = 16;
    for (let ax = 0; ax < 256; ax += awningW * 2) {
      sfctx.fillStyle = '#ff2b55';
      sfctx.fillRect(ax, 0, awningW, 36);
      sfctx.fillStyle = '#ffffff';
      sfctx.fillRect(ax + awningW, 0, awningW, 36);
    }
    sfctx.fillStyle = '#0f121a';
    sfctx.fillRect(20, 10, 216, 24);
    sfctx.fillStyle = '#00f0ff';
    sfctx.font = 'bold 12px sans-serif';
    sfctx.textAlign = 'center';
    sfctx.fillText('NEON HIGHWAY BAZAAR', 128, 26);
    textures.cityStorefront = new THREE.CanvasTexture(sfCanvas);

    // 11. Daytime City Apartment Brick & Window Facade Texture
    const brickCanvas = document.createElement('canvas');
    brickCanvas.width = 256;
    brickCanvas.height = 256;
    const bctx = brickCanvas.getContext('2d');
    bctx.fillStyle = '#944e3b';
    bctx.fillRect(0, 0, 256, 256);
    bctx.strokeStyle = '#b89480';
    bctx.lineWidth = 1;
    for (let y = 0; y < 256; y += 8) {
      bctx.beginPath();
      bctx.moveTo(0, y);
      bctx.lineTo(256, y);
      bctx.stroke();
    }
    for (let wy = 16; wy < 240; wy += 48) {
      for (let wx = 18; wx < 240; wx += 44) {
        bctx.fillStyle = '#1c2230';
        bctx.fillRect(wx, wy, 24, 30);
        bctx.fillStyle = '#dcdedf';
        bctx.fillRect(wx - 2, wy + 28, 28, 5);
        bctx.strokeStyle = '#ffffff';
        bctx.lineWidth = 1.5;
        bctx.strokeRect(wx, wy, 24, 28);
        bctx.beginPath();
        bctx.moveTo(wx + 12, wy); bctx.lineTo(wx + 12, wy + 28);
        bctx.moveTo(wx, wy + 14); bctx.lineTo(wx + 24, wy + 14);
        bctx.stroke();
      }
    }
    textures.cityBrickDay = new THREE.CanvasTexture(brickCanvas);
    textures.cityBrickDay.wrapS = THREE.RepeatWrapping;
    textures.cityBrickDay.wrapT = THREE.RepeatWrapping;

    // 12. Daytime Modern High-Rise Glass Curtain-Wall Skyscraper Facade
    const dayWinCanvas = document.createElement('canvas');
    dayWinCanvas.width = 256;
    dayWinCanvas.height = 256;
    const dwctx = dayWinCanvas.getContext('2d');
    dwctx.fillStyle = '#2c4566';
    dwctx.fillRect(0, 0, 256, 256);
    dwctx.strokeStyle = '#85a0be';
    dwctx.lineWidth = 2;
    for (let x = 0; x <= 256; x += 16) {
      dwctx.beginPath();
      dwctx.moveTo(x, 0);
      dwctx.lineTo(x, 256);
      dwctx.stroke();
    }
    for (let y = 0; y <= 256; y += 24) {
      dwctx.beginPath();
      dwctx.moveTo(0, y);
      dwctx.lineTo(256, y);
      dwctx.stroke();
    }
    for (let y = 2; y < 256; y += 24) {
      for (let x = 2; x < 256; x += 16) {
        if (Math.random() < 0.32) {
          dwctx.fillStyle = 'rgba(220, 240, 255, 0.40)';
          dwctx.fillRect(x, y, 12, 20);
        }
      }
    }
    textures.cityWindowsDay = new THREE.CanvasTexture(dayWinCanvas);
    textures.cityWindowsDay.wrapS = THREE.RepeatWrapping;
    textures.cityWindowsDay.wrapT = THREE.RepeatWrapping;

    // 13. Digital Motorcycle Dashboard / Gauge Cluster Screen
    const dashCanvas = document.createElement('canvas');
    dashCanvas.width = 128;
    dashCanvas.height = 64;
    const dsh = dashCanvas.getContext('2d');
    dsh.fillStyle = '#060914';
    dsh.fillRect(0, 0, 128, 64);
    dsh.strokeStyle = '#00f0ff';
    dsh.lineWidth = 4;
    dsh.beginPath();
    dsh.arc(64, 48, 42, Math.PI * 1.1, Math.PI * 1.9);
    dsh.stroke();
    dsh.fillStyle = '#00f0ff';
    dsh.font = 'bold 22px monospace';
    dsh.textAlign = 'center';
    dsh.fillText('185', 64, 38);
    dsh.font = 'bold 8px sans-serif';
    dsh.fillStyle = '#ff00aa';
    dsh.fillText('KM/H  GEAR 5', 64, 52);
    textures.dashboardScreen = new THREE.CanvasTexture(dashCanvas);

    // 14. Drilled Motorcycle Brake Disc Rotor Texture
    const discCanvas = document.createElement('canvas');
    discCanvas.width = 128;
    discCanvas.height = 128;
    const dbctx = discCanvas.getContext('2d');
    dbctx.fillStyle = '#949ca8';
    dbctx.beginPath();
    dbctx.arc(64, 64, 60, 0, Math.PI * 2);
    dbctx.fill();
    dbctx.fillStyle = '#323640';
    dbctx.beginPath();
    dbctx.arc(64, 64, 28, 0, Math.PI * 2);
    dbctx.fill();
    dbctx.fillStyle = '#111318';
    for (let r = 36; r <= 54; r += 9) {
      const numHoles = r === 36 ? 12 : (r === 45 ? 16 : 20);
      for (let h = 0; h < numHoles; h++) {
        const ang = (h / numHoles) * Math.PI * 2 + (r * 0.1);
        dbctx.beginPath();
        dbctx.arc(64 + Math.cos(ang) * r, 64 + Math.sin(ang) * r, 2, 0, Math.PI * 2);
        dbctx.fill();
      }
    }
    textures.discBrake = new THREE.CanvasTexture(discCanvas);

    return textures;
  }

  // --- Shared Reusable Materials ---
  initMaterials() {
    return {
      // Highway Materials
      asphalt: new THREE.MeshStandardMaterial({
        color: '#0d0e1c',
        roughness: 0.85,
        metalness: 0.15,
        map: this.textures.asphalt
      }),
      desertAsphalt: new THREE.MeshStandardMaterial({
        color: '#2b231c',
        roughness: 0.9,
        metalness: 0.05,
        map: this.textures.desertRoad
      }),
      mountainAsphalt: new THREE.MeshStandardMaterial({
        color: '#161922',
        roughness: 0.8,
        metalness: 0.2,
        map: this.textures.mountainRoad
      }),
      neonGridAsphalt: new THREE.MeshStandardMaterial({
        color: '#060012',
        roughness: 0.7,
        metalness: 0.3,
        map: this.textures.neonGridRoad
      }),

      // Lane Markings
      laneDashCyan: new THREE.MeshBasicMaterial({ color: '#00f0ff' }),
      laneDashWhite: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
      laneDashYellow: new THREE.MeshBasicMaterial({ color: '#ffcc00' }),
      laneDashPink: new THREE.MeshBasicMaterial({ color: '#ff00aa' }),
      laneDash: new THREE.MeshBasicMaterial({ color: '#00f0ff' }),

      // Rumble Strips
      rumbleCyan: new THREE.MeshStandardMaterial({
        color: '#00e5ff',
        emissive: '#00b0ff',
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.5
      }),
      rumblePink: new THREE.MeshStandardMaterial({
        color: '#ff007f',
        emissive: '#ff007f',
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.5
      }),
      rumbleRedWhite: new THREE.MeshStandardMaterial({
        color: '#ff2222',
        roughness: 0.5,
        metalness: 0.2
      }),
      rumbleYellow: new THREE.MeshStandardMaterial({
        color: '#ffaa00',
        roughness: 0.5,
        metalness: 0.2
      }),

      // Guardrails
      guardrail: new THREE.MeshStandardMaterial({
        color: '#2a1545',
        roughness: 0.4,
        metalness: 0.7
      }),
      guardrailSteel: new THREE.MeshStandardMaterial({
        color: '#8899aa',
        roughness: 0.3,
        metalness: 0.8
      }),
      guardrailWood: new THREE.MeshStandardMaterial({
        color: '#4a2f18',
        roughness: 0.9,
        metalness: 0.1
      }),
      guardrailStud: new THREE.MeshBasicMaterial({ color: '#00f0ff' }),
      guardrailStudAmber: new THREE.MeshBasicMaterial({ color: '#ffaa00' }),

      // Shoulders & Off-road terrain
      shoulderGround: new THREE.MeshBasicMaterial({ color: '#050210' }),
      shoulderDesert: new THREE.MeshStandardMaterial({
        color: '#8b4e20',
        roughness: 0.95,
        metalness: 0.05,
        map: this.textures.desertSand
      }),
      shoulderMountain: new THREE.MeshStandardMaterial({
        color: '#18241f',
        roughness: 0.9,
        metalness: 0.1,
        map: this.textures.mountainGround
      }),
      shoulderNeonGrid: new THREE.MeshBasicMaterial({ color: '#04000c' }),

      // Common Vehicle Materials
      tire: new THREE.MeshStandardMaterial({
        color: '#0a0a10',
        roughness: 0.9,
        metalness: 0.1
      }),
      wheelRim: new THREE.MeshStandardMaterial({
        color: '#1a1a2e',
        roughness: 0.2,
        metalness: 0.9
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: '#e0e5ff',
        roughness: 0.15,
        metalness: 0.95
      }),
      gold: new THREE.MeshStandardMaterial({
        color: '#ffd700',
        roughness: 0.25,
        metalness: 0.85
      }),
      carbon: new THREE.MeshStandardMaterial({
        color: '#101014',
        roughness: 0.5,
        metalness: 0.6
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#001a2e',
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.7,
        transparent: true,
        opacity: 0.85
      }),
      glassAmber: new THREE.MeshPhysicalMaterial({
        color: '#442200',
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      }),
      neonCyan: new THREE.MeshBasicMaterial({ color: '#00f0ff' }),
      neonPink: new THREE.MeshBasicMaterial({ color: '#ff007f' }),
      neonAmber: new THREE.MeshBasicMaterial({ color: '#ffaa00' }),
      neonRed: new THREE.MeshBasicMaterial({ color: '#ff0033' }),
      neonGreen: new THREE.MeshBasicMaterial({ color: '#00ff88' }),
      neonBlue: new THREE.MeshBasicMaterial({ color: '#0066ff' }),

      // Modern Daytime City Materials
      asphaltCityDay: new THREE.MeshStandardMaterial({
        color: '#1a1d26',
        roughness: 0.8,
        metalness: 0.1,
        map: this.textures.asphalt
      }),
      sidewalkMat: new THREE.MeshStandardMaterial({
        color: '#d4d8e0',
        roughness: 0.75,
        metalness: 0.1,
        map: this.textures.citySidewalk
      }),
      curbMat: new THREE.MeshStandardMaterial({
        color: '#8e96a2',
        roughness: 0.65,
        metalness: 0.2
      }),
      storefrontMat: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.45,
        metalness: 0.15,
        map: this.textures.cityStorefront
      }),
      brickApartmentMat: new THREE.MeshStandardMaterial({
        color: '#a3543d',
        roughness: 0.85,
        metalness: 0.1,
        map: this.textures.cityBrickDay
      }),
      officeGlassMat: new THREE.MeshStandardMaterial({
        color: '#3a567a',
        roughness: 0.25,
        metalness: 0.65,
        map: this.textures.cityWindowsDay
      }),
      treeFoliageMat: new THREE.MeshStandardMaterial({
        color: '#286e32',
        roughness: 0.85,
        metalness: 0.05
      }),
      treeBarkMat: new THREE.MeshStandardMaterial({
        color: '#423022',
        roughness: 0.95,
        metalness: 0.05
      }),
      streetLightPoleMat: new THREE.MeshStandardMaterial({
        color: '#252a36',
        roughness: 0.35,
        metalness: 0.8
      }),
      crosswalkMat: new THREE.MeshStandardMaterial({
        color: '#f4f6fa',
        roughness: 0.5,
        metalness: 0.1
      }),

      // Detailed Vehicle & Rider Materials
      goldFork: new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.2,
        metalness: 0.9
      }),
      brakeCaliper: new THREE.MeshStandardMaterial({
        color: '#e50914',
        roughness: 0.3,
        metalness: 0.5
      }),
      discBrake: new THREE.MeshStandardMaterial({
        color: '#ccd2db',
        roughness: 0.25,
        metalness: 0.85,
        map: this.textures.discBrake
      }),
      handlebarGrip: new THREE.MeshStandardMaterial({
        color: '#141416',
        roughness: 0.9,
        metalness: 0.1
      }),
      mirrorGlass: new THREE.MeshStandardMaterial({
        color: '#dce5f0',
        roughness: 0.05,
        metalness: 0.95
      }),
      dashboardDisplay: new THREE.MeshBasicMaterial({
        map: this.textures.dashboardScreen
      }),
      leatherBlack: new THREE.MeshStandardMaterial({
        color: '#121318',
        roughness: 0.45,
        metalness: 0.2
      }),
      armorSlider: new THREE.MeshStandardMaterial({
        color: '#0d0d12',
        roughness: 0.25,
        metalness: 0.5
      }),
      titaniumSlider: new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.15,
        metalness: 0.95
      }),

      // Rider Materials
      riderSuit: new THREE.MeshStandardMaterial({
        color: '#121224',
        roughness: 0.6,
        metalness: 0.4
      }),
      riderVisor: new THREE.MeshStandardMaterial({
        color: '#ff0099',
        emissive: '#880044',
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9
      })
    };
  }

  // ==========================================================================
  // UNIFIED FACTORY DISPATCHER FOR ALL 10 PLAYABLE VEHICLES
  // ==========================================================================
  createVehicleModel(vehicleId, customPaint = null) {
    let vehicle;
    switch (vehicleId) {
      case 'thunder_cruiser': vehicle = this.createThunderCruiserModel(); break;
      case 'shadow_ninja': vehicle = this.createShadowNinjaModel(); break;
      case 'dune_marauder': vehicle = this.createDuneMarauderModel(); break;
      case 'ghost_stryker': vehicle = this.createGhostStrykerModel(); break;
      case 'apex_gt': vehicle = this.createApexGTModel(); break;
      case 'enforcer': vehicle = this.createEnforcerModel(); break;
      case 'titan_hauler': vehicle = this.createTitanHaulerModel(); break;
      case 'phantom': vehicle = this.createPhantomHypercarModel(); break;
      case 'quantum_hover': vehicle = this.createQuantumHoverModel(); break;
      case 'cyber_pulse':
      default:
        vehicle = this.createCyberPulseModel(); break;
    }
    if (customPaint) {
      this.setVehiclePaint(vehicle, customPaint);
    }
    return vehicle;
  }

  setVehiclePaint(vehicleObj, hexColor) {
    if (!vehicleObj || !vehicleObj.root || !hexColor) return;
    const col = new THREE.Color(hexColor);
    vehicleObj.root.traverse(child => {
      if (child.isMesh && child.userData && child.userData.isBody) {
        if (child.material) {
          if (!child.userData.hasClonedMat) {
            child.material = child.material.clone();
            child.userData.hasClonedMat = true;
          }
          child.material.color.copy(col);
          if (child.material.emissive && child.material.emissive.getHex() > 0) {
            child.material.emissive.copy(col).multiplyScalar(0.25);
          }
          child.material.needsUpdate = true;
        }
      }
    });
  }

  // ==========================================================================
  // 1. VEHICLE: CYBER PULSE (STANDARD MOTORCYCLE)
  // ==========================================================================
  createCyberPulseModel() {
    return this.createMotorcycleModel();
  }

  createMotorcycleModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Main Twin-Spar Perimeter Frame
    const frameGeo = new THREE.BoxGeometry(0.52, 0.48, 1.65);
    const frameMat = new THREE.MeshStandardMaterial({ color: '#10121d', roughness: 0.35, metalness: 0.85 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.y = 0.65;
    frameMesh.castShadow = true;
    bankGroup.add(frameMesh);

    // Detailed 4-Cylinder Engine block with cooling fins & clutch cover
    const engineGeo = new THREE.BoxGeometry(0.48, 0.38, 0.52);
    const engineMat = new THREE.MeshStandardMaterial({ color: '#222533', roughness: 0.4, metalness: 0.8 });
    const engineMesh = new THREE.Mesh(engineGeo, engineMat);
    engineMesh.position.set(0, 0.46, -0.05);
    engineMesh.castShadow = true;
    bankGroup.add(engineMesh);

    // Circular clutch cover on right
    const clutchCover = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 12), this.materials.gold);
    clutchCover.rotation.z = Math.PI / 2;
    clutchCover.position.set(0.26, 0.44, -0.05);
    bankGroup.add(clutchCover);

    // Curved exhaust headers into upswept titanium muffler with carbon heat shield
    const headerMat = new THREE.MeshStandardMaterial({ color: '#a0a8b8', roughness: 0.3, metalness: 0.9 });
    for (let h = 0; h < 4; h++) {
      const hx = (h - 1.5) * 0.09;
      const header = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.35, 8), headerMat);
      header.position.set(hx, 0.34, 0.18);
      header.rotation.x = Math.PI / 4;
      bankGroup.add(header);
    }

    const muffler = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.65, 12), headerMat);
    muffler.position.set(0.24, 0.52, -0.85);
    muffler.rotation.x = -Math.PI / 8;
    bankGroup.add(muffler);

    const heatShield = new THREE.Mesh(new THREE.CylinderGeometry(0.084, 0.07, 0.28, 12, 1, true, 0, Math.PI), this.materials.carbon);
    heatShield.position.set(0.24, 0.52, -0.85);
    heatShield.rotation.x = -Math.PI / 8;
    bankGroup.add(heatShield);

    // Aerodynamic Fairing & Sculpted Fuel Tank
    const tankGeo = new THREE.BoxGeometry(0.54, 0.36, 0.95);
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#0c0822', roughness: 0.22, metalness: 0.88 });
    const tankMesh = new THREE.Mesh(tankGeo, bodyMat);
    tankMesh.userData.isBody = true;
    tankMesh.position.set(0, 0.88, 0.15);
    tankMesh.castShadow = true;
    bankGroup.add(tankMesh);

    // Cyan Neon Accent Line & Fairing Decals
    const trimGeo = new THREE.BoxGeometry(0.56, 0.05, 0.90);
    const trimMesh = new THREE.Mesh(trimGeo, this.materials.neonCyan);
    trimMesh.position.set(0, 0.88, 0.15);
    bankGroup.add(trimMesh);

    // Racing Windshield (tinted aerodynamic bubble)
    const shieldGeo = new THREE.ConeGeometry(0.25, 0.45, 4);
    const shieldMat = new THREE.MeshPhysicalMaterial({ color: '#00f0ff', transparent: true, opacity: 0.65, roughness: 0.1 });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.rotation.x = -Math.PI / 3;
    shieldMesh.rotation.y = Math.PI / 4;
    shieldMesh.position.set(0, 1.16, 0.58);
    bankGroup.add(shieldMesh);

    // Multi-element LED Projector Headlights
    const headlampGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12);
    const headlampL = new THREE.Mesh(headlampGeo, this.materials.neonCyan);
    headlampL.rotation.x = Math.PI / 2;
    headlampL.position.set(0.12, 0.95, 0.72);
    bankGroup.add(headlampL);
    const headlampR = headlampL.clone();
    headlampR.position.x = -0.12;
    bankGroup.add(headlampR);

    // Machined Aluminum Footpegs / Rearsets
    const pegGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8);
    const pegMat = new THREE.MeshStandardMaterial({ color: '#d0d8e4', metalness: 0.95, roughness: 0.2 });
    const pegL = new THREE.Mesh(pegGeo, pegMat);
    pegL.rotation.z = Math.PI / 2;
    pegL.position.set(0.24, 0.40, -0.45);
    bankGroup.add(pegL);
    const pegR = pegL.clone();
    pegR.position.x = -0.24;
    bankGroup.add(pegR);

    // Wheel Builder with Drilled Stainless Rotors & Racing Calipers
    const buildWheel = (radius, width, isFront = false) => {
      const wheelGroup = new THREE.Group();

      // Tire with curved profile
      const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 20);
      const tireMesh = new THREE.Mesh(tireGeo, this.materials.tire);
      tireMesh.rotation.z = Math.PI / 2;
      tireMesh.castShadow = true;
      wheelGroup.add(tireMesh);

      // Lightweight Multi-Spoke Alloy Rim
      const rimGeo = new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, width * 1.05, 14);
      const rimMesh = new THREE.Mesh(rimGeo, this.materials.wheelRim);
      rimMesh.rotation.z = Math.PI / 2;
      wheelGroup.add(rimMesh);

      const spokeGeo = new THREE.BoxGeometry(width * 1.1, radius * 1.4, 0.035);
      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(spokeGeo, this.materials.chrome);
        spoke.rotation.x = (s * Math.PI) / 5;
        wheelGroup.add(spoke);
      }

      // Drilled Stainless Steel Brake Rotors with Cross-Holes
      const discGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, 0.015, 16);
      if (isFront) {
        // Dual Front Brake Discs
        const discL = new THREE.Mesh(discGeo, this.materials.discBrake);
        discL.rotation.z = Math.PI / 2;
        discL.position.x = width * 0.58;
        wheelGroup.add(discL);

        const discR = discL.clone();
        discR.position.x = -width * 0.58;
        wheelGroup.add(discR);
      } else {
        // Single Rear Brake Disc
        const discRear = new THREE.Mesh(discGeo, this.materials.discBrake);
        discRear.rotation.z = Math.PI / 2;
        discRear.position.x = width * 0.55;
        wheelGroup.add(discRear);
      }

      return wheelGroup;
    };

    // Rear Wheel & Swingarm
    const rearWheel = buildWheel(0.38, 0.28, false);
    rearWheel.position.set(0, 0.38, -0.9);
    bankGroup.add(rearWheel);

    const swingGeo = new THREE.BoxGeometry(0.36, 0.12, 0.78);
    const swingMesh = new THREE.Mesh(swingGeo, this.materials.chrome);
    swingMesh.position.set(0, 0.46, -0.5);
    bankGroup.add(swingMesh);

    // Rear Brake Caliper
    const rearCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.10, 0.14), this.materials.brakeCaliper);
    rearCaliper.position.set(0.16, 0.48, -0.85);
    bankGroup.add(rearCaliper);

    // Front Fork Group with Steering Articulation
    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.38, 0.95);
    bankGroup.add(forkGroup);

    const frontWheel = buildWheel(0.38, 0.22, true);
    forkGroup.add(frontWheel);

    // Front Radial-Mount Racing Calipers
    const caliperL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.15), this.materials.brakeCaliper);
    caliperL.position.set(0.14, 0.12, -0.12);
    caliperL.rotation.x = Math.PI / 8;
    forkGroup.add(caliperL);

    const caliperR = caliperL.clone();
    caliperR.position.x = -0.14;
    forkGroup.add(caliperR);

    // Inverted Telescopic Front Forks (Gold Stanchions + Black Lower Sliders)
    const buildInvertedFork = (xPos) => {
      const g = new THREE.Group();
      g.position.set(xPos, 0.35, -0.08);
      g.rotation.x = -Math.PI / 10;

      // Upper gold stanchion
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.48, 10), this.materials.goldFork);
      upper.position.y = 0.22;
      g.add(upper);

      // Lower black slider
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.48, 10), this.materials.chrome);
      lower.position.y = -0.18;
      g.add(lower);

      return g;
    };

    const forkL = buildInvertedFork(0.16);
    forkGroup.add(forkL);
    const forkR = buildInvertedFork(-0.16);
    forkGroup.add(forkR);

    // Triple Clamps (Upper & Lower Yokes)
    const yokeGeo = new THREE.BoxGeometry(0.38, 0.04, 0.10);
    const yokeUpper = new THREE.Mesh(yokeGeo, this.materials.chrome);
    yokeUpper.position.set(0, 0.68, -0.16);
    forkGroup.add(yokeUpper);

    const yokeLower = yokeUpper.clone();
    yokeLower.position.y = 0.52;
    forkGroup.add(yokeLower);

    // Handlebars with Grips & Levers
    const cliponGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.34, 8);
    const cliponL = new THREE.Mesh(cliponGeo, this.materials.chrome);
    cliponL.rotation.z = Math.PI / 2.3;
    cliponL.position.set(0.20, 0.72, -0.18);
    forkGroup.add(cliponL);

    const cliponR = new THREE.Mesh(cliponGeo, this.materials.chrome);
    cliponR.rotation.z = -Math.PI / 2.3;
    cliponR.position.set(-0.20, 0.72, -0.18);
    forkGroup.add(cliponR);

    // Rubber Grips
    const gripGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.14, 8);
    const gripL = new THREE.Mesh(gripGeo, this.materials.handlebarGrip);
    gripL.rotation.z = Math.PI / 2.3;
    gripL.position.set(0.30, 0.72, -0.18);
    forkGroup.add(gripL);

    const gripR = new THREE.Mesh(gripGeo, this.materials.handlebarGrip);
    gripR.rotation.z = -Math.PI / 2.3;
    gripR.position.set(-0.30, 0.72, -0.18);
    forkGroup.add(gripR);

    // Front Brake Lever (Right) & Clutch Lever (Left)
    const leverGeo = new THREE.BoxGeometry(0.015, 0.015, 0.12);
    const leverL = new THREE.Mesh(leverGeo, this.materials.chrome);
    leverL.position.set(0.28, 0.71, -0.12);
    leverL.rotation.y = -Math.PI / 6;
    forkGroup.add(leverL);

    const leverR = new THREE.Mesh(leverGeo, this.materials.chrome);
    leverR.position.set(-0.28, 0.71, -0.12);
    leverR.rotation.y = Math.PI / 6;
    forkGroup.add(leverR);

    // Aerodynamic Bar-End Rearview Mirrors
    const mirrorStemGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 6);
    const mirrorHousingGeo = new THREE.BoxGeometry(0.09, 0.05, 0.02);

    const stemL = new THREE.Mesh(mirrorStemGeo, this.materials.chrome);
    stemL.position.set(0.38, 0.75, -0.18);
    stemL.rotation.z = -Math.PI / 4;
    forkGroup.add(stemL);

    const mirrorL = new THREE.Mesh(mirrorHousingGeo, this.materials.carbon);
    mirrorL.position.set(0.42, 0.78, -0.18);
    const glassL = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.04), this.materials.mirrorGlass);
    glassL.position.set(0, 0, -0.012);
    glassL.rotation.y = Math.PI;
    mirrorL.add(glassL);
    forkGroup.add(mirrorL);

    const stemR = new THREE.Mesh(mirrorStemGeo, this.materials.chrome);
    stemR.position.set(-0.38, 0.75, -0.18);
    stemR.rotation.z = Math.PI / 4;
    forkGroup.add(stemR);

    const mirrorR = new THREE.Mesh(mirrorHousingGeo, this.materials.carbon);
    mirrorR.position.set(-0.42, 0.78, -0.18);
    const glassR = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.04), this.materials.mirrorGlass);
    glassR.position.set(0, 0, -0.012);
    glassR.rotation.y = Math.PI;
    mirrorR.add(glassR);
    forkGroup.add(mirrorR);

    // Digital Instrument Cluster (LCD gauge screen angled toward pilot)
    const dashBox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.10), this.materials.carbon);
    dashBox.position.set(0, 0.76, -0.10);
    dashBox.rotation.x = Math.PI / 6;
    forkGroup.add(dashBox);

    const dashScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.08), this.materials.dashboardDisplay);
    dashScreen.position.set(0, 0.02, 0);
    dashScreen.rotation.x = -Math.PI / 2;
    dashBox.add(dashScreen);

    // Taillight
    const brakeLightGeo = new THREE.BoxGeometry(0.32, 0.08, 0.08);
    const brakeLightMat = new THREE.MeshStandardMaterial({
      color: '#ff0033',
      emissive: '#ff0022',
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const brakeMesh = new THREE.Mesh(brakeLightGeo, brakeLightMat);
    brakeMesh.position.set(0, 0.78, -1.05);
    bankGroup.add(brakeMesh);

    // Detailed Armored Rider in Natural Sport Tuck
    const riderGroup = this.buildRiderModel({
      posture: 'sport',
      suitColor: '#101322',
      accentColor: '#00f0ff',
      visorColor: '#ff00aa',
      pitchOffset: 0
    });
    bankGroup.add(riderGroup.root);

    return {
      root,
      bankGroup,
      forkGroup,
      rearWheel,
      frontWheel,
      brakeLightMat,
      kneeL: riderGroup.kneeL,
      kneeR: riderGroup.kneeR,
      headGroup: riderGroup.headGroup,
      exhaustPosL: new THREE.Vector3(0.24, 0.52, -1.15),
      exhaustPosR: new THREE.Vector3(-0.14, 0.52, -1.15),
      type: 'bike',
      isBike: true,
      bankFactor: 0.42
    };
  }

  // ==========================================================================
  // 2. VEHICLE: THUNDER CRUISER (HEAVY CHOPPER)
  // ==========================================================================
  createThunderCruiserModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Stretched Frame
    const frameGeo = new THREE.BoxGeometry(0.55, 0.42, 2.2);
    const frameMat = new THREE.MeshStandardMaterial({ color: '#160d05', roughness: 0.35, metalness: 0.8 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.y = 0.58;
    bankGroup.add(frameMesh);

    // Muscular Chrome V-Twin Engine
    const vCylGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.42, 8);
    const vCyl1 = new THREE.Mesh(vCylGeo, this.materials.chrome);
    vCyl1.rotation.z = Math.PI / 6;
    vCyl1.position.set(0, 0.55, 0.15);
    bankGroup.add(vCyl1);

    const vCyl2 = new THREE.Mesh(vCylGeo, this.materials.chrome);
    vCyl2.rotation.z = -Math.PI / 6;
    vCyl2.position.set(0, 0.55, -0.15);
    bankGroup.add(vCyl2);

    // Teardrop Tank (Orange Flame metallic)
    const tankGeo = new THREE.BoxGeometry(0.58, 0.36, 1.05);
    const tankMat = new THREE.MeshStandardMaterial({ color: '#ff6600', roughness: 0.2, metalness: 0.8 });
    const tankMesh = new THREE.Mesh(tankGeo, tankMat);
    tankMesh.userData.isBody = true;
    tankMesh.position.set(0, 0.82, 0.35);
    bankGroup.add(tankMesh);

    // Fat Rear Wheel (Radius 0.42, Width 0.38)
    const rearWheel = new THREE.Group();
    const rTire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.38, 18), this.materials.tire);
    rTire.rotation.z = Math.PI / 2;
    rearWheel.add(rTire);
    const rRim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.4, 12), this.materials.chrome);
    rRim.rotation.z = Math.PI / 2;
    rearWheel.add(rRim);
    rearWheel.position.set(0, 0.42, -1.15);
    bankGroup.add(rearWheel);

    // Long Chopper Front Forks
    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.44, 1.35);
    bankGroup.add(forkGroup);

    // Thin Large Front Wheel
    const frontWheel = new THREE.Group();
    const fTire = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.18, 18), this.materials.tire);
    fTire.rotation.z = Math.PI / 2;
    frontWheel.add(fTire);
    const fRim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.2, 12), this.materials.chrome);
    fRim.rotation.z = Math.PI / 2;
    frontWheel.add(fRim);
    forkGroup.add(frontWheel);

    // Raked extended chrome fork tubes
    const forkGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.3, 8);
    const forkL = new THREE.Mesh(forkGeo, this.materials.chrome);
    forkL.position.set(0.18, 0.48, -0.22);
    forkL.rotation.x = -Math.PI / 6;
    forkGroup.add(forkL);
    const forkR = forkL.clone();
    forkR.position.x = -0.18;
    forkGroup.add(forkR);

    // High ape-hanger chrome handlebars with rubber grips and teardrop mirrors
    const apeGeo = new THREE.BoxGeometry(0.85, 0.05, 0.05);
    const apeMesh = new THREE.Mesh(apeGeo, this.materials.chrome);
    apeMesh.position.set(0, 1.05, -0.4);
    forkGroup.add(apeMesh);

    // Rubber Grips
    const gripL = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.16, 8), this.materials.handlebarGrip);
    gripL.rotation.z = Math.PI / 2;
    gripL.position.set(0.35, 1.05, -0.4);
    forkGroup.add(gripL);
    const gripR = gripL.clone();
    gripR.position.x = -0.35;
    forkGroup.add(gripR);

    // Chrome Teardrop Mirrors
    const mirL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.06, 0.02), this.materials.chrome);
    mirL.position.set(0.42, 1.15, -0.4);
    const glassL = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.05), this.materials.mirrorGlass);
    glassL.position.set(0, 0, -0.012);
    glassL.rotation.y = Math.PI;
    mirL.add(glassL);
    forkGroup.add(mirL);

    const mirR = mirL.clone();
    mirR.position.x = -0.42;
    forkGroup.add(mirR);

    // Front Chrome Brake Disc
    const frontDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.015, 16), this.materials.discBrake);
    frontDisc.rotation.z = Math.PI / 2;
    frontDisc.position.x = 0.12;
    frontWheel.add(frontDisc);

    // Forward Highway Footpegs for Cruiser Boots
    const pegMat = new THREE.MeshStandardMaterial({ color: '#e0e5ff', metalness: 0.95, roughness: 0.2 });
    const pegL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 8), pegMat);
    pegL.rotation.z = Math.PI / 2;
    pegL.position.set(0.28, 0.42, 0.15);
    bankGroup.add(pegL);
    const pegR = pegL.clone();
    pegR.position.x = -0.28;
    bankGroup.add(pegR);

    // Taillight
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#ff2200', emissive: '#ff1100', emissiveIntensity: 0.9 });
    const brakeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.08), brakeLightMat);
    brakeMesh.position.set(0, 0.72, -1.25);
    bankGroup.add(brakeMesh);

    // Detailed Armored Cruiser Rider in relaxed upright touring posture
    const riderGroup = this.buildRiderModel({
      posture: 'cruiser',
      suitColor: '#2b1704',
      accentColor: '#ffaa00',
      visorColor: '#ffee44',
      pitchOffset: 0.05
    });
    bankGroup.add(riderGroup.root);

    return {
      root,
      bankGroup,
      forkGroup,
      rearWheel,
      frontWheel,
      brakeLightMat,
      kneeL: riderGroup.kneeL,
      kneeR: riderGroup.kneeR,
      headGroup: riderGroup.headGroup,
      exhaustPosL: new THREE.Vector3(0.22, 0.4, -1.3),
      exhaustPosR: new THREE.Vector3(-0.22, 0.4, -1.3),
      type: 'bike',
      isBike: true,
      bankFactor: 0.35
    };
  }

  // ==========================================================================
  // 3. VEHICLE: SHADOW NINJA (LIGHTWEIGHT HYPERBIKE)
  // ==========================================================================
  createShadowNinjaModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Carbon fiber aerodynamic chassis
    const bodyGeo = new THREE.BoxGeometry(0.48, 0.45, 1.7);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.carbon);
    bodyMesh.userData.isBody = true;
    bodyMesh.position.y = 0.65;
    bankGroup.add(bodyMesh);

    // Sharp green neon edge trims
    const trimGeo = new THREE.BoxGeometry(0.5, 0.04, 1.4);
    const trimMesh = new THREE.Mesh(trimGeo, this.materials.neonGreen);
    trimMesh.position.set(0, 0.88, 0.1);
    bankGroup.add(trimMesh);

    // Upswept racing tail cowl
    const cowlGeo = new THREE.ConeGeometry(0.24, 0.65, 4);
    const cowlMesh = new THREE.Mesh(cowlGeo, this.materials.carbon);
    cowlMesh.userData.isBody = true;
    cowlMesh.rotation.x = -Math.PI / 2.3;
    cowlMesh.rotation.y = Math.PI / 4;
    cowlMesh.position.set(0, 0.86, -0.85);
    bankGroup.add(cowlMesh);

    // Lightweight lightweight wheels with green rim tape
    const buildNinjaWheel = (radius, width) => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 18), this.materials.tire);
      tire.rotation.z = Math.PI / 2;
      g.add(tire);
      const rimTape = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.78, radius * 0.78, width * 1.04, 14), this.materials.neonGreen);
      rimTape.rotation.z = Math.PI / 2;
      g.add(rimTape);
      return g;
    };

    const rearWheel = buildNinjaWheel(0.38, 0.28);
    rearWheel.position.set(0, 0.38, -0.92);
    bankGroup.add(rearWheel);

    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.38, 0.98);
    bankGroup.add(forkGroup);

    const frontWheel = buildNinjaWheel(0.38, 0.2);
    forkGroup.add(frontWheel);

    // Golden inverted front suspension forks
    const forkTubeGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.85, 8);
    const forkL = new THREE.Mesh(forkTubeGeo, this.materials.gold);
    forkL.position.set(0.15, 0.35, -0.06);
    forkL.rotation.x = -Math.PI / 9;
    forkGroup.add(forkL);
    const forkR = forkL.clone();
    forkR.position.x = -0.15;
    forkGroup.add(forkR);

    // Clip-on racing handlebars with carbon lever guards
    const barL = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.30, 8), this.materials.carbon);
    barL.rotation.z = Math.PI / 2.2;
    barL.position.set(0.18, 0.72, -0.16);
    forkGroup.add(barL);
    const barR = barL.clone();
    barR.rotation.z = -Math.PI / 2.2;
    barR.position.x = -0.18;
    forkGroup.add(barR);

    // Front Wave Brake Discs
    const discGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.015, 14);
    const discF = new THREE.Mesh(discGeo, this.materials.discBrake);
    discF.rotation.z = Math.PI / 2;
    discF.position.x = 0.12;
    frontWheel.add(discF);

    // Minimalist LED brake strip
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#ff0033', emissive: '#ff0022', emissiveIntensity: 1.2 });
    const brakeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.06), brakeLightMat);
    brakeMesh.position.set(0, 0.95, -1.05);
    bankGroup.add(brakeMesh);

    // Aggressive Tucked Hyperbike Rider
    const riderGroup = this.buildRiderModel({
      posture: 'sport',
      suitColor: '#0b0c14',
      accentColor: '#00ff88',
      visorColor: '#00ff88',
      pitchOffset: -0.08
    });
    bankGroup.add(riderGroup.root);

    return {
      root,
      bankGroup,
      forkGroup,
      rearWheel,
      frontWheel,
      brakeLightMat,
      kneeL: riderGroup.kneeL,
      kneeR: riderGroup.kneeR,
      headGroup: riderGroup.headGroup,
      exhaustPosL: new THREE.Vector3(0.12, 0.75, -1.1),
      exhaustPosR: new THREE.Vector3(-0.12, 0.75, -1.1),
      type: 'bike',
      isBike: true,
      bankFactor: 0.45
    };
  }

  // ==========================================================================
  // 4. VEHICLE: DUNE MARAUDER (OFFROAD RALLY BIKE)
  // ==========================================================================
  createDuneMarauderModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Raised ground clearance frame
    const frameGeo = new THREE.BoxGeometry(0.5, 0.46, 1.7);
    const frameMat = new THREE.MeshStandardMaterial({ color: '#3d2612', roughness: 0.6, metalness: 0.4 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.y = 0.75;
    bankGroup.add(frameMesh);

    // Tubular orange crash bars / exo-cage
    const barMat = new THREE.MeshStandardMaterial({ color: '#ff5500', roughness: 0.3, metalness: 0.8 });
    const cageL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 6), barMat);
    cageL.position.set(0.32, 0.7, 0.1);
    cageL.rotation.z = Math.PI / 4;
    bankGroup.add(cageL);

    const cageR = cageL.clone();
    cageR.position.x = -0.32;
    cageR.rotation.z = -Math.PI / 4;
    bankGroup.add(cageR);

    // Knobby off-road spiked wheels
    const buildRallyWheel = (radius, width) => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 14), this.materials.tire);
      tire.rotation.z = Math.PI / 2;
      g.add(tire);
      // Knobby tread blocks
      for (let k = 0; k < 10; k++) {
        const knob = new THREE.Mesh(new THREE.BoxGeometry(width * 0.9, 0.08, 0.08), this.materials.tire);
        knob.rotation.x = (k * Math.PI) / 5;
        knob.position.y = radius * Math.cos((k * Math.PI) / 5);
        knob.position.z = radius * Math.sin((k * Math.PI) / 5);
        g.add(knob);
      }
      return g;
    };

    const rearWheel = buildRallyWheel(0.42, 0.3);
    rearWheel.position.set(0, 0.42, -0.92);
    bankGroup.add(rearWheel);

    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.44, 1.05);
    bankGroup.add(forkGroup);

    const frontWheel = buildRallyWheel(0.44, 0.22);
    forkGroup.add(frontWheel);

    // High beak fender
    const beakGeo = new THREE.ConeGeometry(0.25, 0.55, 4);
    const beakMat = new THREE.MeshStandardMaterial({ color: '#c2782b', roughness: 0.5 });
    const beakMesh = new THREE.Mesh(beakGeo, beakMat);
    beakMesh.userData.isBody = true;
    beakMesh.rotation.x = -Math.PI / 2.5;
    beakMesh.position.set(0, 0.65, 0.35);
    forkGroup.add(beakMesh);

    // Twin circular yellow rally spotlights
    const spotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8);
    const spotMat = new THREE.MeshBasicMaterial({ color: '#ffea00' });
    const spotL = new THREE.Mesh(spotGeo, spotMat);
    spotL.rotation.x = Math.PI / 2;
    spotL.position.set(0.12, 0.82, 0.25);
    forkGroup.add(spotL);
    const spotR = spotL.clone();
    spotR.position.x = -0.12;
    forkGroup.add(spotR);

    // Enduro Handlebars with Brush Handguards
    const barGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.82, 8);
    const barMesh = new THREE.Mesh(barGeo, this.materials.chrome);
    barMesh.rotation.z = Math.PI / 2;
    barMesh.position.set(0, 0.95, 0.12);
    forkGroup.add(barMesh);

    // Orange Handguards on Left & Right
    const guardMat = new THREE.MeshStandardMaterial({ color: '#ff5500', roughness: 0.4 });
    const guardL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.12), guardMat);
    guardL.position.set(0.38, 0.95, 0.15);
    forkGroup.add(guardL);
    const guardR = guardL.clone();
    guardR.position.x = -0.38;
    forkGroup.add(guardR);

    // Front Wave Disc
    const discGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.015, 14);
    const discF = new THREE.Mesh(discGeo, this.materials.discBrake);
    discF.rotation.z = Math.PI / 2;
    discF.position.x = 0.12;
    frontWheel.add(discF);

    // Taillight
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#ff3300', emissive: '#ff2200', emissiveIntensity: 1.0 });
    const brakeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.08), brakeLightMat);
    brakeMesh.position.set(0, 0.85, -1.05);
    bankGroup.add(brakeMesh);

    // Detailed Enduro Rally Raid Rider
    const riderGroup = this.buildRiderModel({
      posture: 'rally',
      suitColor: '#3c2818',
      accentColor: '#ffcc00',
      visorColor: '#ffea00',
      pitchOffset: 0.05
    });
    bankGroup.add(riderGroup.root);

    return {
      root,
      bankGroup,
      forkGroup,
      rearWheel,
      frontWheel,
      brakeLightMat,
      kneeL: riderGroup.kneeL,
      kneeR: riderGroup.kneeR,
      headGroup: riderGroup.headGroup,
      exhaustPosL: new THREE.Vector3(0.15, 0.85, -1.15),
      exhaustPosR: new THREE.Vector3(-0.15, 0.85, -1.15),
      type: 'bike',
      isBike: true,
      bankFactor: 0.38
    };
  }

  // ==========================================================================
  // 5. VEHICLE: GHOST STRYKER (CONCEPT PROTOTYPE BIKE)
  // ==========================================================================
  createGhostStrykerModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Pearlescent white monocoque shell
    const shellGeo = new THREE.BoxGeometry(0.52, 0.5, 1.85);
    const shellMat = new THREE.MeshStandardMaterial({ color: '#eeeeff', roughness: 0.15, metalness: 0.85 });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.userData.isBody = true;
    shellMesh.position.y = 0.68;
    bankGroup.add(shellMesh);

    // Cyan glowing energy conduits along the sides
    const conduitGeo = new THREE.BoxGeometry(0.56, 0.06, 1.6);
    const conduitMesh = new THREE.Mesh(conduitGeo, this.materials.neonCyan);
    conduitMesh.position.set(0, 0.72, 0);
    bankGroup.add(conduitMesh);

    // Swept aerodynamic aero winglets
    const wingGeo = new THREE.BoxGeometry(0.85, 0.04, 0.28);
    const wingMesh = new THREE.Mesh(wingGeo, shellMat);
    wingMesh.userData.isBody = true;
    wingMesh.position.set(0, 0.85, 0.5);
    bankGroup.add(wingMesh);

    // Hubless hollow wheels with cyan glow
    const buildHublessWheel = (radius, width) => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 20), this.materials.tire);
      tire.rotation.z = Math.PI / 2;
      g.add(tire);
      const innerGlow = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, width * 1.02, 16), this.materials.neonCyan);
      innerGlow.rotation.z = Math.PI / 2;
      g.add(innerGlow);
      return g;
    };

    const rearWheel = buildHublessWheel(0.39, 0.28);
    rearWheel.position.set(0, 0.39, -0.95);
    bankGroup.add(rearWheel);

    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.39, 0.95);
    bankGroup.add(forkGroup);

    const frontWheel = buildHublessWheel(0.39, 0.22);
    forkGroup.add(frontWheel);

    // Forward cyan headlight slit
    const headSlit = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 0.08), this.materials.neonCyan);
    headSlit.position.set(0, 0.7, 0.25);
    forkGroup.add(headSlit);

    // Full-width laser taillight
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#00d4ff', emissive: '#00b0ff', emissiveIntensity: 1.5 });
    const brakeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.05, 0.06), brakeLightMat);
    brakeMesh.position.set(0, 0.82, -1.05);
    bankGroup.add(brakeMesh);

    // Prototype Rider in White/Cyan aerodynamic suit
    const riderGroup = this.buildRiderModel({
      posture: 'sport',
      suitColor: '#dce0f0',
      accentColor: '#00f0ff',
      visorColor: '#00d4ff',
      pitchOffset: -0.06
    });
    bankGroup.add(riderGroup.root);

    return {
      root,
      bankGroup,
      forkGroup,
      rearWheel,
      frontWheel,
      brakeLightMat,
      kneeL: riderGroup.kneeL,
      kneeR: riderGroup.kneeR,
      headGroup: riderGroup.headGroup,
      exhaustPosL: new THREE.Vector3(0.14, 0.65, -1.15),
      exhaustPosR: new THREE.Vector3(-0.14, 0.65, -1.15),
      type: 'bike',
      isBike: true,
      bankFactor: 0.44
    };
  }

  // ==========================================================================
  // 6. VEHICLE: APEX GT (TRACK SPORTS COUPE)
  // ==========================================================================
  createApexGTModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Widebody Track Coupe Chassis Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#b3092b', roughness: 0.25, metalness: 0.85 });
    const trimMat = new THREE.MeshStandardMaterial({ color: '#161622', roughness: 0.5, metalness: 0.7 });
    const carbonMat = this.materials.carbon;
    const glassMat = this.materials.glass;

    // 1. Central Core Monocoque
    const coreGeo = new THREE.BoxGeometry(1.72, 0.44, 3.8);
    const coreMesh = new THREE.Mesh(coreGeo, bodyMat);
    coreMesh.userData.isBody = true;
    coreMesh.position.set(0, 0.42, -0.05);
    coreMesh.castShadow = true;
    bankGroup.add(coreMesh);

    // 2. Sloped Sculpted Hood with Heat Extractor Vents
    const hoodGeo = new THREE.BoxGeometry(1.60, 0.20, 1.45);
    const hoodMesh = new THREE.Mesh(hoodGeo, bodyMat);
    hoodMesh.userData.isBody = true;
    hoodMesh.position.set(0, 0.54, 0.95);
    hoodMesh.rotation.x = 0.08;
    hoodMesh.castShadow = true;
    bankGroup.add(hoodMesh);

    // Hood Twin Air Extractors (Carbon louvers)
    const ventL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.03, 0.55), carbonMat);
    ventL.position.set(0.42, 0.59, 0.95);
    ventL.rotation.x = 0.08;
    bankGroup.add(ventL);
    const ventR = ventL.clone();
    ventR.position.x = -0.42;
    bankGroup.add(ventR);

    // 3. Flared Aerodynamic Front Fenders
    const fenderGeoF = new THREE.BoxGeometry(0.24, 0.38, 1.15);
    const fenderFL = new THREE.Mesh(fenderGeoF, bodyMat);
    fenderFL.userData.isBody = true;
    fenderFL.position.set(0.92, 0.46, 1.22);
    bankGroup.add(fenderFL);
    const fenderFR = new THREE.Mesh(fenderGeoF, bodyMat);
    fenderFR.userData.isBody = true;
    fenderFR.position.set(-0.92, 0.46, 1.22);
    bankGroup.add(fenderFR);

    // 4. Wide Muscular Rear Haunches / Fenders
    const fenderGeoR = new THREE.BoxGeometry(0.26, 0.44, 1.28);
    const fenderRL = new THREE.Mesh(fenderGeoR, bodyMat);
    fenderRL.userData.isBody = true;
    fenderRL.position.set(0.95, 0.48, -1.22);
    bankGroup.add(fenderRL);
    const fenderRR = new THREE.Mesh(fenderGeoR, bodyMat);
    fenderRR.userData.isBody = true;
    fenderRR.position.set(-0.95, 0.48, -1.22);
    bankGroup.add(fenderRR);

    // 5. Sculpted Side Skirts with Carbon Winglets
    const skirtGeo = new THREE.BoxGeometry(0.18, 0.12, 1.55);
    const skirtL = new THREE.Mesh(skirtGeo, carbonMat);
    skirtL.position.set(0.92, 0.22, -0.05);
    bankGroup.add(skirtL);
    const skirtR = skirtL.clone();
    skirtR.position.x = -0.92;
    bankGroup.add(skirtR);

    // 6. Front Bumper with Large Radiator Mouth & Air Curtains
    const bumperGeo = new THREE.BoxGeometry(1.88, 0.32, 0.45);
    const bumperMesh = new THREE.Mesh(bumperGeo, bodyMat);
    bumperMesh.userData.isBody = true;
    bumperMesh.position.set(0, 0.36, 1.88);
    bankGroup.add(bumperMesh);

    // Black Honeycomb Grille
    const grilleMesh = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.18, 0.08), trimMat);
    grilleMesh.position.set(0, 0.32, 2.11);
    bankGroup.add(grilleMesh);

    // Carbon Front Splitter with Corner Dive Planes
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.05, 0.42), carbonMat);
    splitter.position.set(0, 0.18, 1.95);
    bankGroup.add(splitter);

    // 7. Sleek Aerodynamic Greenhouse (Canopy & Pillars)
    const roofBase = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.38, 1.70), glassMat);
    roofBase.position.set(0, 0.82, -0.22);
    roofBase.castShadow = true;
    bankGroup.add(roofBase);

    // Sculpted Carbon Roof Panel
    const roofTop = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.06, 1.15), carbonMat);
    roofTop.position.set(0, 1.02, -0.25);
    bankGroup.add(roofTop);

    // A-Pillars (Painted body color)
    const pillarGeo = new THREE.BoxGeometry(0.08, 0.42, 0.08);
    const aPillarL = new THREE.Mesh(pillarGeo, bodyMat);
    aPillarL.userData.isBody = true;
    aPillarL.position.set(0.64, 0.80, 0.38);
    aPillarL.rotation.x = -0.55;
    bankGroup.add(aPillarL);
    const aPillarR = aPillarL.clone();
    aPillarR.userData.isBody = true;
    aPillarR.position.x = -0.64;
    bankGroup.add(aPillarR);

    // Carbon Aero Side Mirrors
    const mirrorStem = new THREE.BoxGeometry(0.18, 0.04, 0.06);
    const mirrorHousing = new THREE.BoxGeometry(0.16, 0.10, 0.08);
    const mirrorL = new THREE.Group();
    mirrorL.position.set(0.78, 0.76, 0.32);
    mirrorL.add(new THREE.Mesh(mirrorStem, carbonMat));
    const mHeadL = new THREE.Mesh(mirrorHousing, carbonMat);
    mHeadL.position.set(0.12, 0.02, 0);
    mirrorL.add(mHeadL);
    bankGroup.add(mirrorL);

    const mirrorR = new THREE.Group();
    mirrorR.position.set(-0.78, 0.76, 0.32);
    mirrorR.add(new THREE.Mesh(mirrorStem, carbonMat));
    const mHeadR = new THREE.Mesh(mirrorHousing, carbonMat);
    mHeadR.position.set(-0.12, 0.02, 0);
    mirrorR.add(mHeadR);
    bankGroup.add(mirrorR);

    // 8. Seated Cockpit Racing Driver with Helmet & Steering Wheel
    const driver = this.buildCockpitDriver({ suitColor: '#121626', helmetColor: '#ffffff' });
    driver.position.set(0, -0.05, 0);
    bankGroup.add(driver);

    // 9. Rear Fascia & Aggressive Carbon Diffuser
    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.35, 0.42), bodyMat);
    rearBumper.userData.isBody = true;
    rearBumper.position.set(0, 0.42, -1.88);
    bankGroup.add(rearBumper);

    // Multi-Fin Carbon Rear Diffuser
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.12, 0.50), carbonMat);
    diffuser.position.set(0, 0.20, -1.90);
    bankGroup.add(diffuser);
    for (let f = -2; f <= 2; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.38), carbonMat);
      fin.position.set(f * 0.32, 0.20, -1.95);
      bankGroup.add(fin);
    }

    // 10. GT Racing Wing with Carbon Endplates
    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.04, 0.32), carbonMat);
    wingBlade.position.set(0, 0.88, -1.92);
    bankGroup.add(wingBlade);
    const endplateL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.34), carbonMat);
    endplateL.position.set(0.93, 0.88, -1.92);
    bankGroup.add(endplateL);
    const endplateR = endplateL.clone();
    endplateR.position.x = -0.93;
    bankGroup.add(endplateR);

    const wingPylonL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.10), carbonMat);
    wingPylonL.position.set(0.45, 0.74, -1.90);
    bankGroup.add(wingPylonL);
    const wingPylonR = wingPylonL.clone();
    wingPylonR.position.x = -0.45;
    bankGroup.add(wingPylonR);

    // 11. Projector Headlights with Cyan LED DRL Eyebrows
    const headlampGeo = new THREE.BoxGeometry(0.28, 0.08, 0.18);
    const headlampL = new THREE.Mesh(headlampGeo, this.materials.neonCyan);
    headlampL.position.set(0.68, 0.52, 1.95);
    headlampL.rotation.y = -0.15;
    bankGroup.add(headlampL);
    const headlampR = new THREE.Mesh(headlampGeo, this.materials.neonCyan);
    headlampR.position.set(-0.68, 0.52, 1.95);
    headlampR.rotation.y = 0.15;
    bankGroup.add(headlampR);

    // Quad Titanium Exhaust Tips
    const pipeMat = new THREE.MeshStandardMaterial({ color: '#556677', roughness: 0.3, metalness: 0.9 });
    for (let p of [-0.62, -0.48, 0.48, 0.62]) {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.18, 12), pipeMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(p, 0.28, -2.12);
      bankGroup.add(tip);
    }

    // 12. Full-Width Razor OLED Taillight Bar
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#ff0033', emissive: '#ff0022', emissiveIntensity: 1.4 });
    const brakeMesh = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.06, 0.06), brakeLightMat);
    brakeMesh.position.set(0, 0.55, -2.06);
    bankGroup.add(brakeMesh);

    // 13. Wheels with Sport Rims and Red Brake Calipers
    const wheels = [];
    const buildCarWheel = (r = 0.33, w = 0.28) => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 18), this.materials.tire);
      tire.rotation.z = Math.PI / 2;
      g.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.72, r * 0.72, w * 1.04, 12), this.materials.wheelRim);
      rim.rotation.z = Math.PI / 2;
      g.add(rim);
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.12), new THREE.MeshStandardMaterial({ color: '#ff0033' }));
      caliper.position.set(0, 0.15, 0);
      g.add(caliper);
      return g;
    };

    // Front Steering Fork Group
    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.33, 1.25);
    bankGroup.add(forkGroup);

    const fWheelL = buildCarWheel();
    fWheelL.position.x = 0.98;
    forkGroup.add(fWheelL);
    wheels.push(fWheelL);

    const fWheelR = buildCarWheel();
    fWheelR.position.x = -0.98;
    forkGroup.add(fWheelR);
    wheels.push(fWheelR);

    // Rear Wheels
    const rWheelL = buildCarWheel();
    rWheelL.position.set(1.00, 0.33, -1.25);
    bankGroup.add(rWheelL);
    wheels.push(rWheelL);

    const rWheelR = buildCarWheel();
    rWheelR.position.set(-1.00, 0.33, -1.25);
    bankGroup.add(rWheelR);
    wheels.push(rWheelR);

    return {
      root,
      bankGroup,
      forkGroup,
      wheels,
      brakeLightMat,
      exhaustPosL: new THREE.Vector3(0.55, 0.28, -2.15),
      exhaustPosR: new THREE.Vector3(-0.55, 0.28, -2.15),
      type: 'car',
      isCar: true,
      bankFactor: 0.08
    };
  }

  // ==========================================================================
  // 7. VEHICLE: ENFORCER (ARMORED HIGHWAY INTERCEPTOR)
  // ==========================================================================
  createEnforcerModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Armored Interceptor Materials (Midnight Navy + Matte Steel)
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#121828', roughness: 0.35, metalness: 0.75 });
    const steelMat = new THREE.MeshStandardMaterial({ color: '#090a10', roughness: 0.55, metalness: 0.85 });
    const chromeMat = this.materials.chrome;
    const glassMat = this.materials.glass;

    // 1. Heavy Armored Lower Chassis
    const chassisGeo = new THREE.BoxGeometry(1.85, 0.46, 4.1);
    const chassisMesh = new THREE.Mesh(chassisGeo, bodyMat);
    chassisMesh.userData.isBody = true;
    chassisMesh.position.set(0, 0.44, 0);
    chassisMesh.castShadow = true;
    bankGroup.add(chassisMesh);

    // 2. Chiseled Muscular Hood with Tactical Ram-Air Scoop
    const hoodGeo = new THREE.BoxGeometry(1.68, 0.22, 1.55);
    const hoodMesh = new THREE.Mesh(hoodGeo, bodyMat);
    hoodMesh.userData.isBody = true;
    hoodMesh.position.set(0, 0.58, 1.05);
    hoodMesh.rotation.x = 0.06;
    bankGroup.add(hoodMesh);

    const scoopGeo = new THREE.BoxGeometry(0.55, 0.12, 0.65);
    const scoopMesh = new THREE.Mesh(scoopGeo, steelMat);
    scoopMesh.position.set(0, 0.71, 0.95);
    scoopMesh.rotation.x = 0.06;
    bankGroup.add(scoopMesh);

    // 3. Flared Armored Wheel Arches (Front & Rear)
    const fenderGeoF = new THREE.BoxGeometry(0.25, 0.42, 1.25);
    const fenderFL = new THREE.Mesh(fenderGeoF, bodyMat);
    fenderFL.userData.isBody = true;
    fenderFL.position.set(0.98, 0.48, 1.28);
    bankGroup.add(fenderFL);
    const fenderFR = new THREE.Mesh(fenderGeoF, bodyMat);
    fenderFR.userData.isBody = true;
    fenderFR.position.set(-0.98, 0.48, 1.28);
    bankGroup.add(fenderFR);

    const fenderGeoR = new THREE.BoxGeometry(0.26, 0.46, 1.35);
    const fenderRL = new THREE.Mesh(fenderGeoR, bodyMat);
    fenderRL.userData.isBody = true;
    fenderRL.position.set(1.00, 0.50, -1.28);
    bankGroup.add(fenderRL);
    const fenderRR = new THREE.Mesh(fenderGeoR, bodyMat);
    fenderRR.userData.isBody = true;
    fenderRR.position.set(-1.00, 0.50, -1.28);
    bankGroup.add(fenderRR);

    // Side Rocker Armor Plates with Rivet Studs
    const armorPlateGeo = new THREE.BoxGeometry(0.12, 0.18, 1.6);
    const armorL = new THREE.Mesh(armorPlateGeo, steelMat);
    armorL.position.set(0.98, 0.32, 0);
    bankGroup.add(armorL);
    const armorR = armorL.clone();
    armorR.position.x = -0.98;
    bankGroup.add(armorR);

    // 4. Tactical Front Bull-Bar Push Bumper
    const bullBarGroup = new THREE.Group();
    bullBarGroup.position.set(0, 0.46, 2.12);
    // Vertical Steel Push Uprights
    const uprightGeo = new THREE.BoxGeometry(0.12, 0.52, 0.22);
    const upL = new THREE.Mesh(uprightGeo, steelMat);
    upL.position.set(0.48, 0.05, 0.08);
    bullBarGroup.add(upL);
    const upR = new THREE.Mesh(uprightGeo, steelMat);
    upR.position.set(-0.48, 0.05, 0.08);
    bullBarGroup.add(upR);
    // Horizontal Crossbars
    const crossBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.85, 8), steelMat);
    crossBar1.rotation.z = Math.PI / 2;
    crossBar1.position.set(0, 0.22, 0.06);
    bullBarGroup.add(crossBar1);
    const crossBar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.85, 8), steelMat);
    crossBar2.rotation.z = Math.PI / 2;
    crossBar2.position.set(0, -0.12, 0.06);
    bullBarGroup.add(crossBar2);
    bankGroup.add(bullBarGroup);

    // Heavy Front Grille with Recessed Strobe Beacons
    const grilleMesh = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.24, 0.1), steelMat);
    grilleMesh.position.set(0, 0.46, 2.06);
    bankGroup.add(grilleMesh);

    // 5. Armored Ballistic Glass Cabin & Reinforced Pillars
    const cabinMesh = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.45, 1.85), glassMat);
    cabinMesh.position.set(0, 0.88, -0.18);
    cabinMesh.castShadow = true;
    bankGroup.add(cabinMesh);

    // Steel Roof Armor Plate & Front Sun Visor Brow
    const roofPlate = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.06, 1.35), bodyMat);
    roofPlate.userData.isBody = true;
    roofPlate.position.set(0, 1.11, -0.22);
    bankGroup.add(roofPlate);

    const brow = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.10, 0.18), steelMat);
    brow.position.set(0, 1.05, 0.50);
    brow.rotation.x = 0.25;
    bankGroup.add(brow);

    // A-Pillars (Armored body)
    const pillarGeo = new THREE.BoxGeometry(0.10, 0.46, 0.10);
    const aPillarL = new THREE.Mesh(pillarGeo, bodyMat);
    aPillarL.userData.isBody = true;
    aPillarL.position.set(0.68, 0.86, 0.42);
    aPillarL.rotation.x = -0.52;
    bankGroup.add(aPillarL);
    const aPillarR = aPillarL.clone();
    aPillarR.userData.isBody = true;
    aPillarR.position.x = -0.68;
    bankGroup.add(aPillarR);

    // Pursuit A-Pillar Spotlights (Driver & Passenger)
    const spotGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 8);
    const spotL = new THREE.Mesh(spotGeo, chromeMat);
    spotL.rotation.x = Math.PI / 2;
    spotL.position.set(0.80, 0.90, 0.38);
    bankGroup.add(spotL);
    const spotR = spotL.clone();
    spotR.position.x = -0.80;
    bankGroup.add(spotR);

    // 6. Roof Emergency Pursuit Lightbar (Faceted Red & Blue Strobe)
    const lightbarBase = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 0.20), steelMat);
    lightbarBase.position.set(0, 1.16, -0.18);
    bankGroup.add(lightbarBase);

    const strobeL = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.08, 0.14), new THREE.MeshStandardMaterial({
      color: '#ff0033',
      emissive: '#ff0022',
      emissiveIntensity: 2.2
    }));
    strobeL.position.set(0.24, 1.22, -0.18);
    bankGroup.add(strobeL);

    const strobeR = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.08, 0.14), new THREE.MeshStandardMaterial({
      color: '#0066ff',
      emissive: '#0055ff',
      emissiveIntensity: 2.2
    }));
    strobeR.position.set(-0.24, 1.22, -0.18);
    bankGroup.add(strobeR);

    // Center Siren Speaker Box
    const sirenBox = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.16), chromeMat);
    sirenBox.position.set(0, 1.22, -0.18);
    bankGroup.add(sirenBox);

    // 7. Seated Pursuit Interceptor Driver
    const driver = this.buildCockpitDriver({ suitColor: '#0a0e1a', helmetColor: '#283244' });
    driver.position.set(0, 0.05, 0);
    bankGroup.add(driver);

    // 8. Quad Pursuit Headlights
    const headlampGeo = new THREE.BoxGeometry(0.25, 0.10, 0.15);
    const hlL1 = new THREE.Mesh(headlampGeo, this.materials.neonCyan);
    hlL1.position.set(0.66, 0.54, 2.05);
    bankGroup.add(hlL1);
    const hlR1 = new THREE.Mesh(headlampGeo, this.materials.neonCyan);
    hlR1.position.set(-0.66, 0.54, 2.05);
    bankGroup.add(hlR1);

    // 9. Rear Heavy Bumper & Recovery Shackles
    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.38, 0.40), bodyMat);
    rearBumper.userData.isBody = true;
    rearBumper.position.set(0, 0.44, -1.95);
    bankGroup.add(rearBumper);

    // Rear Pursuit Deck Spoiler
    const pursuitWing = new THREE.Mesh(new THREE.BoxGeometry(1.70, 0.06, 0.35), steelMat);
    pursuitWing.position.set(0, 0.82, -1.96);
    bankGroup.add(pursuitWing);

    // Dual Armored Exhaust Outlets
    const pipeMat = new THREE.MeshStandardMaterial({ color: '#333844', roughness: 0.4, metalness: 0.8 });
    for (let p of [-0.65, 0.65]) {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.22, 12), pipeMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(p, 0.30, -2.18);
      bankGroup.add(tip);
    }

    // 10. Heavy Brake Light Bar
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#ff1100', emissive: '#ee0000', emissiveIntensity: 1.4 });
    const brakeMesh = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.10, 0.08), brakeLightMat);
    brakeMesh.position.set(0, 0.58, -2.14);
    bankGroup.add(brakeMesh);

    // 11. Wheels (Heavy Duty Steel Pursuit Rims with Chrome Center Hubs)
    const wheels = [];
    const buildHeavyWheel = () => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.30, 18), this.materials.tire);
      tire.rotation.z = Math.PI / 2;
      g.add(tire);
      const steelRim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.31, 14), steelMat);
      steelRim.rotation.z = Math.PI / 2;
      g.add(steelRim);
      const chromeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.33, 10), chromeMat);
      chromeHub.rotation.z = Math.PI / 2;
      g.add(chromeHub);
      return g;
    };

    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.35, 1.30);
    bankGroup.add(forkGroup);

    const fWheelL = buildHeavyWheel();
    fWheelL.position.x = 1.05;
    forkGroup.add(fWheelL);
    wheels.push(fWheelL);

    const fWheelR = buildHeavyWheel();
    fWheelR.position.x = -1.05;
    forkGroup.add(fWheelR);
    wheels.push(fWheelR);

    const rWheelL = buildHeavyWheel();
    rWheelL.position.set(1.05, 0.35, -1.30);
    bankGroup.add(rWheelL);
    wheels.push(rWheelL);

    const rWheelR = buildHeavyWheel();
    rWheelR.position.set(-1.05, 0.35, -1.30);
    bankGroup.add(rWheelR);
    wheels.push(rWheelR);

    return {
      root,
      bankGroup,
      forkGroup,
      wheels,
      brakeLightMat,
      strobeL,
      strobeR,
      exhaustPosL: new THREE.Vector3(0.65, 0.30, -2.22),
      exhaustPosR: new THREE.Vector3(-0.65, 0.30, -2.22),
      type: 'car',
      isCar: true,
      bankFactor: 0.07
    };
  }

  // ==========================================================================
  // 8. VEHICLE: TITAN CUSTOM HAULER (SUPER-TRUCK CAB)
  // ==========================================================================
  createTitanHaulerModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Custom Racing Super-Truck Cab Materials (Bright Orange + Polished Chrome)
    const cabMat = new THREE.MeshStandardMaterial({ color: '#ff6600', roughness: 0.28, metalness: 0.75 });
    const darkSteelMat = new THREE.MeshStandardMaterial({ color: '#14141c', roughness: 0.5, metalness: 0.8 });
    const chromeMat = this.materials.chrome;
    const glassMat = this.materials.glass;
    const amberLightMat = new THREE.MeshStandardMaterial({ color: '#ffaa00', emissive: '#ff8800', emissiveIntensity: 1.8 });

    // 1. Chopped-Top Racing Sleeper Cab
    const cabGeo = new THREE.BoxGeometry(2.15, 1.35, 1.85);
    const cabMesh = new THREE.Mesh(cabGeo, cabMat);
    cabMesh.userData.isBody = true;
    cabMesh.position.set(0, 1.25, 0.15);
    cabMesh.castShadow = true;
    bankGroup.add(cabMesh);

    // 2. Sculpted Long Nose Hood
    const hoodGeo = new THREE.BoxGeometry(1.95, 0.95, 1.65);
    const hoodMesh = new THREE.Mesh(hoodGeo, cabMat);
    hoodMesh.userData.isBody = true;
    hoodMesh.position.set(0, 0.92, 1.70);
    hoodMesh.castShadow = true;
    bankGroup.add(hoodMesh);

    // Dual Chrome Air Cleaner Canisters on Hood Sides
    const airCanGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.85, 12);
    const airCanL = new THREE.Mesh(airCanGeo, chromeMat);
    airCanL.position.set(1.12, 1.15, 1.45);
    bankGroup.add(airCanL);
    const airCanR = airCanL.clone();
    airCanR.position.x = -1.12;
    bankGroup.add(airCanR);

    // 3. Massive Vertical Chrome Front Grille
    const grilleGeo = new THREE.BoxGeometry(1.68, 0.96, 0.16);
    const grilleMesh = new THREE.Mesh(grilleGeo, chromeMat);
    grilleMesh.position.set(0, 0.92, 2.54);
    bankGroup.add(grilleMesh);

    // Horizontal Chrome Louver Bars
    for (let b = -3; b <= 3; b++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.04, 0.08), darkSteelMat);
      bar.position.set(0, 0.92 + b * 0.11, 2.63);
      bankGroup.add(bar);
    }

    // Heavy Dropped Chrome Front Bumper with Fog Lights
    const bumperGeo = new THREE.BoxGeometry(2.28, 0.42, 0.22);
    const bumperMesh = new THREE.Mesh(bumperGeo, chromeMat);
    bumperMesh.position.set(0, 0.32, 2.54);
    bankGroup.add(bumperMesh);

    // Dual Amber Fog Lamps
    const fogL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12), amberLightMat);
    fogL.rotation.x = Math.PI / 2;
    fogL.position.set(0.72, 0.32, 2.66);
    bankGroup.add(fogL);
    const fogR = fogL.clone();
    fogR.position.x = -0.72;
    bankGroup.add(fogR);

    // 4. Chopped Windshield, Front Sun Visor, and Roof Marker Bullets
    const winGeo = new THREE.BoxGeometry(1.92, 0.48, 0.10);
    const winMesh = new THREE.Mesh(winGeo, glassMat);
    winMesh.position.set(0, 1.46, 1.08);
    winMesh.rotation.x = -0.15;
    bankGroup.add(winMesh);

    // Chrome Sun Visor Brow
    const visorGeo = new THREE.BoxGeometry(2.05, 0.16, 0.32);
    const visorMesh = new THREE.Mesh(visorGeo, chromeMat);
    visorMesh.position.set(0, 1.74, 1.06);
    visorMesh.rotation.x = 0.32;
    bankGroup.add(visorMesh);

    // 5 Glowing Amber Roof Clearance Marker Bullets
    for (let c = -2; c <= 2; c++) {
      const marker = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.10, 8), amberLightMat);
      marker.rotation.x = -Math.PI / 2;
      marker.position.set(c * 0.36, 1.95, 0.72);
      bankGroup.add(marker);
    }

    // 5. Seated Trucker Racing Driver in Cab
    const driver = this.buildCockpitDriver({ suitColor: '#281a0e', helmetColor: '#ddaa22' });
    driver.position.set(0.38, 0.58, 0.35);
    bankGroup.add(driver);

    // 6. Dual Towering Chrome Exhaust Stacks with Heat Shields
    const stackGeo = new THREE.CylinderGeometry(0.085, 0.085, 2.7, 12);
    const shieldGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.35, 12, 1, true);

    const stackL = new THREE.Mesh(stackGeo, chromeMat);
    stackL.position.set(1.18, 2.15, -0.65);
    bankGroup.add(stackL);
    const shieldL = new THREE.Mesh(shieldGeo, chromeMat);
    shieldL.position.set(1.18, 1.65, -0.65);
    bankGroup.add(shieldL);

    const stackR = stackL.clone();
    stackR.position.x = -1.18;
    bankGroup.add(stackR);
    const shieldR = shieldL.clone();
    shieldR.position.x = -1.18;
    bankGroup.add(shieldR);

    // 7. Tubular Chrome Headache Rack Behind Cab
    const rackGeo = new THREE.BoxGeometry(2.05, 1.15, 0.08);
    const rackMesh = new THREE.Mesh(rackGeo, chromeMat);
    rackMesh.position.set(0, 1.35, -0.80);
    bankGroup.add(rackMesh);

    // 8. Exposed Rear Chassis Rails, Diamond Catwalk, & Fifth Wheel
    const frameGeo = new THREE.BoxGeometry(1.45, 0.30, 2.4);
    const frameMesh = new THREE.Mesh(frameGeo, darkSteelMat);
    frameMesh.position.set(0, 0.45, -1.55);
    bankGroup.add(frameMesh);

    // Aluminum Diamond-Plate Catwalk
    const deckGeo = new THREE.BoxGeometry(1.35, 0.04, 1.25);
    const deckMesh = new THREE.Mesh(deckGeo, chromeMat);
    deckMesh.position.set(0, 0.62, -1.05);
    bankGroup.add(deckMesh);

    // Heavy Fifth Wheel Hitch Plate
    const hitchGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.10, 12);
    const hitchMesh = new THREE.Mesh(hitchGeo, darkSteelMat);
    hitchMesh.position.set(0, 0.65, -1.85);
    bankGroup.add(hitchMesh);

    // Side Cylindrical Chrome Fuel Tanks with Stepping Rungs
    const tankGeo = new THREE.CylinderGeometry(0.34, 0.34, 1.45, 14);
    const tankL = new THREE.Mesh(tankGeo, chromeMat);
    tankL.rotation.x = Math.PI / 2;
    tankL.position.set(1.14, 0.42, 0.35);
    bankGroup.add(tankL);
    const tankR = tankL.clone();
    tankR.position.x = -1.14;
    bankGroup.add(tankR);

    // 9. 6 Massive Heavy-Duty Hauler Wheels
    const wheels = [];
    const buildHaulerWheel = () => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.34, 18), this.materials.tire);
      tire.rotation.z = Math.PI / 2;
      g.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.36, 12), chromeMat);
      rim.rotation.z = Math.PI / 2;
      g.add(rim);
      return g;
    };

    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.44, 1.45);
    bankGroup.add(forkGroup);

    const fWheelL = buildHaulerWheel();
    fWheelL.position.x = 1.20;
    forkGroup.add(fWheelL);
    wheels.push(fWheelL);

    const fWheelR = buildHaulerWheel();
    fWheelR.position.x = -1.20;
    forkGroup.add(fWheelR);
    wheels.push(fWheelR);

    const midWheelL = buildHaulerWheel();
    midWheelL.position.set(1.20, 0.44, -1.35);
    bankGroup.add(midWheelL);
    wheels.push(midWheelL);

    const midWheelR = buildHaulerWheel();
    midWheelR.position.set(-1.20, 0.44, -1.35);
    bankGroup.add(midWheelR);
    wheels.push(midWheelR);

    const rWheelL = buildHaulerWheel();
    rWheelL.position.set(1.20, 0.44, -2.15);
    bankGroup.add(rWheelL);
    wheels.push(rWheelL);

    const rWheelR = buildHaulerWheel();
    rWheelR.position.set(-1.20, 0.44, -2.15);
    bankGroup.add(rWheelR);
    wheels.push(rWheelR);

    // 10. Heavy Rear Mudflaps & Dual-Tier Brake Lights
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#ff1100', emissive: '#ee0000', emissiveIntensity: 1.4 });
    const brakeMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.16, 0.08), brakeLightMat);
    brakeMeshL.position.set(-0.85, 0.55, -2.62);
    bankGroup.add(brakeMeshL);

    const brakeMeshR = brakeMeshL.clone();
    brakeMeshR.position.x = 0.85;
    bankGroup.add(brakeMeshR);

    // Mudflaps
    const flapGeo = new THREE.BoxGeometry(0.45, 0.42, 0.04);
    const flapL = new THREE.Mesh(flapGeo, darkSteelMat);
    flapL.position.set(-0.85, 0.28, -2.60);
    bankGroup.add(flapL);
    const flapR = flapL.clone();
    flapR.position.x = 0.85;
    bankGroup.add(flapR);

    return {
      root,
      bankGroup,
      forkGroup,
      wheels,
      brakeLightMat,
      exhaustPosL: new THREE.Vector3(1.18, 3.5, -0.65),
      exhaustPosR: new THREE.Vector3(-1.18, 3.5, -0.65),
      type: 'car',
      isCar: true,
      bankFactor: 0.06
    };
  }

  // ==========================================================================
  // 9. VEHICLE: PHANTOM HYPERCAR (EXOTIC HYPERCAR)
  // ==========================================================================
  createPhantomHypercarModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Exotic Hypercar Materials (Metallic Royal Purple + Carbon Fiber + Neon Cyan)
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#5b1088', roughness: 0.16, metalness: 0.92 });
    const darkMat = new THREE.MeshStandardMaterial({ color: '#0d0d16', roughness: 0.4, metalness: 0.8 });
    const carbonMat = this.materials.carbon;
    const glassMat = this.materials.glass;
    const neonCyan = this.materials.neonCyan;

    // 1. Ultra-Low Central Monocoque Fuselage
    const monoGeo = new THREE.BoxGeometry(1.68, 0.36, 4.25);
    const monoMesh = new THREE.Mesh(monoGeo, bodyMat);
    monoMesh.userData.isBody = true;
    monoMesh.position.set(0, 0.35, 0);
    monoMesh.castShadow = true;
    bankGroup.add(monoMesh);

    // 2. Pointed Low-Slung Shark Nose with Front Flow-Through Duct
    const noseGeo = new THREE.BoxGeometry(1.58, 0.20, 1.45);
    const noseMesh = new THREE.Mesh(noseGeo, bodyMat);
    noseMesh.userData.isBody = true;
    noseMesh.position.set(0, 0.44, 1.25);
    noseMesh.rotation.x = 0.12;
    bankGroup.add(noseMesh);

    // Flow-through hood air extraction scoop (air enters front bumper, exits top of hood)
    const ductGeo = new THREE.BoxGeometry(0.72, 0.08, 0.65);
    const ductMesh = new THREE.Mesh(ductGeo, carbonMat);
    ductMesh.position.set(0, 0.52, 1.15);
    ductMesh.rotation.x = 0.12;
    bankGroup.add(ductMesh);

    // Pointed Carbon Front Splitter with Corner Dive Canards
    const splitGeo = new THREE.BoxGeometry(1.98, 0.05, 0.45);
    const splitter = new THREE.Mesh(splitGeo, carbonMat);
    splitter.position.set(0, 0.15, 2.05);
    bankGroup.add(splitter);

    const canardL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.22), carbonMat);
    canardL.position.set(0.96, 0.32, 1.95);
    canardL.rotation.z = -0.25;
    bankGroup.add(canardL);
    const canardR = canardL.clone();
    canardR.position.x = -0.96;
    canardR.rotation.z = 0.25;
    bankGroup.add(canardR);

    // 3. Flared Aerodynamic Front Fenders
    const fenderGeoF = new THREE.BoxGeometry(0.25, 0.35, 1.22);
    const fenderFL = new THREE.Mesh(fenderGeoF, bodyMat);
    fenderFL.userData.isBody = true;
    fenderFL.position.set(0.94, 0.40, 1.26);
    bankGroup.add(fenderFL);
    const fenderFR = new THREE.Mesh(fenderGeoF, bodyMat);
    fenderFR.userData.isBody = true;
    fenderFR.position.set(-0.94, 0.40, 1.26);
    bankGroup.add(fenderFR);

    // 4. Scalloped Side Radiator Venturi Tunnels & Carbon Side Blades
    const sideTunnelsL = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.24, 1.65), darkMat);
    sideTunnelsL.position.set(0.86, 0.32, 0.05);
    bankGroup.add(sideTunnelsL);
    const sideTunnelsR = sideTunnelsL.clone();
    sideTunnelsR.position.x = -0.86;
    bankGroup.add(sideTunnelsR);

    const bladeL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 1.4), carbonMat);
    bladeL.position.set(0.98, 0.38, 0.05);
    bankGroup.add(bladeL);
    const bladeR = bladeL.clone();
    bladeR.position.x = -0.98;
    bankGroup.add(bladeR);

    // 5. Muscular Rear Haunches & Mid-Engine Bay Cover
    const fenderGeoR = new THREE.BoxGeometry(0.28, 0.42, 1.35);
    const fenderRL = new THREE.Mesh(fenderGeoR, bodyMat);
    fenderRL.userData.isBody = true;
    fenderRL.position.set(0.96, 0.44, -1.25);
    bankGroup.add(fenderRL);
    const fenderRR = new THREE.Mesh(fenderGeoR, bodyMat);
    fenderRR.userData.isBody = true;
    fenderRR.position.set(-0.96, 0.44, -1.25);
    bankGroup.add(fenderRR);

    // Mid-Engine Glass Louver Deck
    const engDeck = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 1.15), glassMat);
    engDeck.position.set(0, 0.54, -0.95);
    bankGroup.add(engDeck);

    // 6. Teardrop Le Mans Glass Cockpit with Carbon Dorsal Shark Fin
    const canopyMesh = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.36, 1.85), glassMat);
    canopyMesh.position.set(0, 0.68, -0.15);
    canopyMesh.castShadow = true;
    bankGroup.add(canopyMesh);

    // Central Dorsal Shark Fin Spine (Runs along roof to rear wing)
    const finGeo = new THREE.BoxGeometry(0.04, 0.28, 1.95);
    const sharkFin = new THREE.Mesh(finGeo, carbonMat);
    sharkFin.position.set(0, 0.88, -0.65);
    bankGroup.add(sharkFin);

    // 7. Seated Reclined Prototype Driver with HUD Yoke
    const driver = this.buildCockpitDriver({ suitColor: '#1a0828', helmetColor: '#00f0ff' });
    driver.position.set(0, -0.15, -0.1);
    bankGroup.add(driver);

    // 8. Massive Swan-Neck GT Carbon Wing with Glowing Cyan Endplates
    const wingBlade = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.05, 0.44), carbonMat);
    wingBlade.position.set(0, 0.98, -1.95);
    bankGroup.add(wingBlade);

    // Swan-Neck Curved Pylons
    const swanGeo = new THREE.BoxGeometry(0.04, 0.36, 0.25);
    const swanL = new THREE.Mesh(swanGeo, carbonMat);
    swanL.position.set(-0.55, 0.82, -1.92);
    bankGroup.add(swanL);
    const swanR = swanL.clone();
    swanR.position.x = 0.55;
    bankGroup.add(swanR);

    // Glowing Neon Cyan Aero Endplates
    const endplateL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.46), neonCyan);
    endplateL.position.set(1.08, 0.98, -1.95);
    bankGroup.add(endplateL);
    const endplateR = endplateL.clone();
    endplateR.position.x = -1.08;
    bankGroup.add(endplateR);

    // 9. Center-Mounted Quad Titanium Exhaust Cluster (Tight 2x2 Square)
    const pipeMat = new THREE.MeshStandardMaterial({ color: '#556677', roughness: 0.25, metalness: 0.95 });
    const pipes = [
      [-0.08, 0.52], [0.08, 0.52],
      [-0.08, 0.40], [0.08, 0.40]
    ];
    pipes.forEach(([px, py]) => {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 12), pipeMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(px, py, -2.18);
      bankGroup.add(tip);
    });

    // 10. Multi-Tunnel Carbon Rear Diffuser with Cyan Underglow
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.10, 0.55), carbonMat);
    diffuser.position.set(0, 0.16, -1.95);
    bankGroup.add(diffuser);

    const diffGlow = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.03, 0.40), neonCyan);
    diffGlow.position.set(0, 0.12, -2.00);
    bankGroup.add(diffGlow);

    // 11. Razor OLED Laser Taillight Blade
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#ff0055', emissive: '#ff0044', emissiveIntensity: 1.6 });
    const brakeMesh = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.05, 0.06), brakeLightMat);
    brakeMesh.position.set(0, 0.46, -2.16);
    bankGroup.add(brakeMesh);

    // Slim Laser Headlights
    const hlGeo = new THREE.BoxGeometry(0.28, 0.05, 0.15);
    const hlL = new THREE.Mesh(hlGeo, neonCyan);
    hlL.position.set(0.68, 0.48, 1.95);
    hlL.rotation.y = -0.22;
    bankGroup.add(hlL);
    const hlR = new THREE.Mesh(hlGeo, neonCyan);
    hlR.position.set(-0.68, 0.48, 1.95);
    hlR.rotation.y = 0.22;
    bankGroup.add(hlR);

    // 12. Ultra-Wide Center-Lock Turbine Aero Wheels
    const wheels = [];
    const buildHyperWheel = () => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.29, 18), this.materials.tire);
      tire.rotation.z = Math.PI / 2;
      g.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.30, 14), this.materials.wheelRim);
      rim.rotation.z = Math.PI / 2;
      g.add(rim);
      const centerLock = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.32, 10), neonCyan);
      centerLock.rotation.z = Math.PI / 2;
      g.add(centerLock);
      return g;
    };

    const forkGroup = new THREE.Group();
    forkGroup.position.set(0, 0.31, 1.28);
    bankGroup.add(forkGroup);

    const fWheelL = buildHyperWheel();
    fWheelL.position.x = 1.02;
    forkGroup.add(fWheelL);
    wheels.push(fWheelL);

    const fWheelR = buildHyperWheel();
    fWheelR.position.x = -1.02;
    forkGroup.add(fWheelR);
    wheels.push(fWheelR);

    const rWheelL = buildHyperWheel();
    rWheelL.position.set(1.02, 0.31, -1.28);
    bankGroup.add(rWheelL);
    wheels.push(rWheelL);

    const rWheelR = buildHyperWheel();
    rWheelR.position.set(-1.02, 0.31, -1.28);
    bankGroup.add(rWheelR);
    wheels.push(rWheelR);

    return {
      root,
      bankGroup,
      forkGroup,
      wheels,
      brakeLightMat,
      exhaustPosL: new THREE.Vector3(0.08, 0.46, -2.22),
      exhaustPosR: new THREE.Vector3(-0.08, 0.46, -2.22),
      type: 'car',
      isCar: true,
      bankFactor: 0.08
    };
  }

  // ==========================================================================
  // 10. VEHICLE: QUANTUM HOVER (ANTI-GRAV HOVERBOARD)
  // ==========================================================================
  createQuantumHoverModel() {
    const root = new THREE.Group();
    const bankGroup = new THREE.Group();
    root.add(bankGroup);

    // Sculpted Anti-Grav Deck Materials
    const deckMat = new THREE.MeshStandardMaterial({ color: '#00e5ff', roughness: 0.18, metalness: 0.88 });
    const gripMat = new THREE.MeshStandardMaterial({ color: '#111218', roughness: 0.95 });
    const darkMat = new THREE.MeshStandardMaterial({ color: '#151722', roughness: 0.4, metalness: 0.8 });
    const chromeMat = this.materials.chrome;
    const neonCyan = this.materials.neonCyan;

    // 1. Central Aerodynamic Deck Body (Floats at Y=0.50)
    const deckCenter = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 1.8), deckMat);
    deckCenter.userData.isBody = true;
    deckCenter.position.set(0, 0.50, 0);
    deckCenter.castShadow = true;
    bankGroup.add(deckCenter);

    // 2. Tapered Aerodynamic Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.36, 0.65, 4);
    const noseMesh = new THREE.Mesh(noseGeo, deckMat);
    noseMesh.userData.isBody = true;
    noseMesh.rotation.x = -Math.PI / 2;
    noseMesh.rotation.y = Math.PI / 4;
    noseMesh.position.set(0, 0.50, 1.15);
    bankGroup.add(noseMesh);

    // Glowing Neon Cyan Nose Tip
    const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), neonCyan);
    noseTip.position.set(0, 0.50, 1.48);
    bankGroup.add(noseTip);

    // 3. Upturned Rear Kicktail
    const kickGeo = new THREE.BoxGeometry(0.68, 0.07, 0.52);
    const kickMesh = new THREE.Mesh(kickGeo, deckMat);
    kickMesh.userData.isBody = true;
    kickMesh.position.set(0, 0.56, -1.05);
    kickMesh.rotation.x = -0.22;
    bankGroup.add(kickMesh);

    // 4. Textured Grip Tape with Neon Center Circuit Line
    const gripCenter = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.015, 1.7), gripMat);
    gripCenter.position.set(0, 0.545, 0);
    bankGroup.add(gripCenter);

    const gripKick = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.015, 0.46), gripMat);
    gripKick.position.set(0, 0.60, -1.04);
    gripKick.rotation.x = -0.22;
    bankGroup.add(gripKick);

    const circuitLine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 1.9), neonCyan);
    circuitLine.position.set(0, 0.55, 0);
    bankGroup.add(circuitLine);

    // 5. Dual Under-Deck Maglev Repulsor Rings with Ion Turbine Cores
    const buildRepulsor = (zPos) => {
      const g = new THREE.Group();
      g.position.set(0, 0.44, zPos);

      // Outer Torus Ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 8, 18), darkMat);
      ring.rotation.x = Math.PI / 2;
      g.add(ring);

      // Glowing Cyan Ion Plasma Core
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16), neonCyan);
      g.add(core);

      // Internal Chrome Turbine Blades
      for (let b = 0; b < 6; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.36), chromeMat);
        blade.rotation.y = (b * Math.PI) / 6;
        g.add(blade);
      }
      return g;
    };

    const repF = buildRepulsor(0.62);
    bankGroup.add(repF);
    const repR = buildRepulsor(-0.55);
    bankGroup.add(repR);

    // 6. Twin Vectoring Ion Thrusters at Kicktail Base
    const thrusterMat = new THREE.MeshStandardMaterial({ color: '#161824', metalness: 0.9, roughness: 0.3 });
    const buildThruster = (xPos) => {
      const g = new THREE.Group();
      g.position.set(xPos, 0.52, -1.16);

      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.075, 0.38, 12), thrusterMat);
      barrel.rotation.x = Math.PI / 2;
      g.add(barrel);

      const gimbalRing = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.015, 6, 12), chromeMat);
      g.add(gimbalRing);
      return g;
    };

    const thL = buildThruster(0.20);
    bankGroup.add(thL);
    const thR = buildThruster(-0.20);
    bankGroup.add(thR);

    // Brake Light Reactive Ion Nozzle Glow
    const brakeLightMat = new THREE.MeshStandardMaterial({ color: '#00ffcc', emissive: '#00e5ff', emissiveIntensity: 1.8 });
    const core1 = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.05, 12), brakeLightMat);
    core1.rotation.x = Math.PI / 2;
    core1.position.set(0.20, 0.52, -1.35);
    bankGroup.add(core1);

    const core2 = core1.clone();
    core2.position.x = -0.20;
    bankGroup.add(core2);

    // 7. Athletic Hover Surfer/Skater Rider
    const riderGroup = this.buildHoverSurferRider();
    bankGroup.add(riderGroup);

    // ForkGroup dummy for interface compatibility
    const forkGroup = new THREE.Group();
    bankGroup.add(forkGroup);

    return {
      root,
      bankGroup,
      forkGroup,
      brakeLightMat,
      isHover: true,
      type: 'hover',
      bankFactor: 0.35,
      exhaustPosL: new THREE.Vector3(0.20, 0.52, -1.38),
      exhaustPosR: new THREE.Vector3(-0.20, 0.52, -1.38)
    };
  }

  // --- Helper: Build Detailed Multi-Part Animated Motorcycle Rider ---
  buildRiderModel(optionsOrSuitColor = '#121224', visorColor = '#ff00aa', pitchOffset = 0, extraOpts = {}) {
    let opts = {};
    if (typeof optionsOrSuitColor === 'object' && optionsOrSuitColor !== null) {
      opts = optionsOrSuitColor;
    } else {
      opts = {
        suitColor: optionsOrSuitColor,
        visorColor: visorColor,
        pitchOffset: pitchOffset,
        ...extraOpts
      };
    }

    const posture = opts.posture || 'sport'; // 'sport' | 'cruiser' | 'rally' | 'hyper'
    const suitColor = opts.suitColor || '#121422';
    const accentColor = opts.accentColor || '#00f0ff';
    const finalVisorColor = opts.visorColor || '#ff00aa';
    const pitch = (opts.pitchOffset !== undefined ? opts.pitchOffset : 0);

    const root = new THREE.Group();
    root.name = 'riderRoot';

    // Materials
    const suitMat = new THREE.MeshStandardMaterial({
      color: suitColor,
      roughness: 0.45,
      metalness: 0.25
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.35,
      metalness: 0.4,
      emissive: accentColor,
      emissiveIntensity: 0.2
    });
    const sliderMat = this.materials.armorSlider || new THREE.MeshStandardMaterial({ color: '#111218', roughness: 0.25, metalness: 0.5 });
    const titaniumMat = this.materials.titaniumSlider || new THREE.MeshStandardMaterial({ color: '#d8dee9', roughness: 0.15, metalness: 0.95 });
    const visorMat = new THREE.MeshStandardMaterial({
      color: finalVisorColor,
      emissive: finalVisorColor,
      emissiveIntensity: 0.55,
      roughness: 0.08,
      metalness: 0.9
    });
    const gloveMat = this.materials.leatherBlack || new THREE.MeshStandardMaterial({ color: '#121218', roughness: 0.5, metalness: 0.2 });
    const bootMat = new THREE.MeshStandardMaterial({ color: '#14141c', roughness: 0.4, metalness: 0.3 });

    // Spine & Torso Group (Pivots according to riding posture)
    const spineGroup = new THREE.Group();
    root.add(spineGroup);

    // Dynamic Posture settings
    let torsoPitch = 0.38 + pitch;
    let torsoY = 1.06 + pitch * 0.5;
    let torsoZ = -0.06;
    let armPitch = Math.PI / 3.4;
    let armSpread = 0.26;
    let armZ = 0.28;
    let legZ = -0.22;
    let legPitch = -Math.PI / 5.5;
    let bootZ = -0.48;
    let bootY = 0.38;

    if (posture === 'cruiser') {
      torsoPitch = 0.12 + pitch;
      torsoY = 1.04;
      torsoZ = -0.16;
      armPitch = Math.PI / 4.2;
      armSpread = 0.30;
      armZ = 0.35;
      legZ = 0.05;
      legPitch = -Math.PI / 10;
      bootZ = 0.15;
      bootY = 0.42;
    } else if (posture === 'rally') {
      torsoPitch = 0.22 + pitch;
      torsoY = 1.12;
      torsoZ = -0.08;
      armPitch = Math.PI / 3.0;
      armSpread = 0.32;
      armZ = 0.32;
      legZ = -0.18;
      legPitch = -Math.PI / 6.5;
      bootZ = -0.42;
      bootY = 0.44;
    }

    spineGroup.position.set(0, torsoY, torsoZ);
    spineGroup.rotation.x = torsoPitch;

    // 1. Torso Core Bodywork & Armored Suit
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.50, 0.28), suitMat);
    torsoMesh.castShadow = true;
    spineGroup.add(torsoMesh);

    // Ergonomic Chest Protector Plate
    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 0.08), accentMat);
    chestPlate.position.set(0, 0.05, 0.15);
    spineGroup.add(chestPlate);

    const sternumGroove = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.30, 0.09), sliderMat);
    sternumGroove.position.set(0, 0.05, 0.15);
    spineGroup.add(sternumGroove);

    // Pro Aerodynamic Speed Hump (Upper Thoracic Back Hump)
    const humpGeo = new THREE.ConeGeometry(0.14, 0.38, 4);
    const speedHump = new THREE.Mesh(humpGeo, suitMat);
    speedHump.rotation.x = Math.PI / 2.2;
    speedHump.rotation.y = Math.PI / 4;
    speedHump.position.set(0, 0.12, -0.18);
    spineGroup.add(speedHump);

    const humpAccent = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.04), accentMat);
    humpAccent.position.set(0, 0.12, -0.22);
    spineGroup.add(humpAccent);

    // Shoulder Armor Cups with Titanium Sliders
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), sliderMat);
    shoulderL.position.set(0.24, 0.20, 0.02);
    spineGroup.add(shoulderL);
    const titanSliderL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 8), titaniumMat);
    titanSliderL.rotation.z = Math.PI / 2;
    titanSliderL.position.set(0.32, 0.20, 0.02);
    spineGroup.add(titanSliderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), sliderMat);
    shoulderR.position.set(-0.24, 0.20, 0.02);
    spineGroup.add(shoulderR);
    const titanSliderR = titanSliderL.clone();
    titanSliderR.position.set(-0.32, 0.20, 0.02);
    spineGroup.add(titanSliderR);

    // Kidney Belt / Waist
    const waistBelt = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.10, 0.26), sliderMat);
    waistBelt.position.set(0, -0.22, 0);
    spineGroup.add(waistBelt);

    // 2. Neck & Full-Face Aerodynamic Helmet
    const headGroup = new THREE.Group();
    headGroup.name = 'riderHead';
    headGroup.position.set(0, 0.36, 0.10);
    spineGroup.add(headGroup);

    // Neck
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.12, 8), gloveMat);
    neckMesh.position.y = -0.06;
    headGroup.add(neckMesh);

    // Outer Helmet Shell (Rounded with Aerodynamic Taper)
    const shellGeo = new THREE.SphereGeometry(0.19, 14, 12);
    const shellMesh = new THREE.Mesh(shellGeo, suitMat);
    shellMesh.position.set(0, 0.06, 0);
    headGroup.add(shellMesh);

    // Rear Aerodynamic Spoiler Winglet
    const spoilerGeo = new THREE.BoxGeometry(0.22, 0.05, 0.14);
    const spoilerMesh = new THREE.Mesh(spoilerGeo, accentMat);
    spoilerMesh.position.set(0, 0.08, -0.16);
    spoilerMesh.rotation.x = -Math.PI / 8;
    headGroup.add(spoilerMesh);

    // Crown Racing Stripe
    const stripeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.20, 0.34), accentMat);
    stripeMesh.position.set(0, 0.12, 0);
    headGroup.add(stripeMesh);

    // Chin Bar & Air Intake Vents
    const chinBarGeo = new THREE.BoxGeometry(0.24, 0.13, 0.18);
    const chinBar = new THREE.Mesh(chinBarGeo, suitMat);
    chinBar.position.set(0, -0.04, 0.12);
    headGroup.add(chinBar);

    const ventMesh = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.04, 0.02), sliderMat);
    ventMesh.position.set(0, -0.04, 0.215);
    headGroup.add(ventMesh);

    // Curved Full-Face Optical Visor
    const visorGeo = new THREE.CylinderGeometry(0.192, 0.192, 0.12, 14, 1, false, Math.PI * 0.12, Math.PI * 0.76);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.06, 0.01);
    headGroup.add(visorMesh);

    // Side Visor Hinge Pivot Discs
    const pivotGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.02, 8);
    const pivotL = new THREE.Mesh(pivotGeo, titaniumMat);
    pivotL.rotation.z = Math.PI / 2;
    pivotL.position.set(0.19, 0.06, 0.02);
    headGroup.add(pivotL);

    const pivotR = pivotL.clone();
    pivotR.position.x = -0.19;
    headGroup.add(pivotR);

    // 3. Arms & Gauntlet Gloves Gripping Handlebars
    const buildArm = (isLeft) => {
      const armGroup = new THREE.Group();
      const sign = isLeft ? 1 : -1;

      const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.32, 8), suitMat);
      bicep.position.set(sign * 0.05, -0.12, 0.06);
      bicep.rotation.set(armPitch, 0, sign * -0.15);
      armGroup.add(bicep);

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), sliderMat);
      elbow.position.set(sign * 0.08, -0.25, 0.14);
      armGroup.add(elbow);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.048, 0.30, 8), suitMat);
      forearm.position.set(sign * 0.06, -0.36, 0.26);
      forearm.rotation.set(armPitch * 1.3, 0, sign * 0.1);
      armGroup.add(forearm);

      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.08, 8), gloveMat);
      cuff.position.set(sign * 0.05, -0.46, 0.35);
      armGroup.add(cuff);

      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.09), gloveMat);
      hand.position.set(sign * 0.05, -0.50, 0.40);
      armGroup.add(hand);

      const knuckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.06), sliderMat);
      knuckle.position.set(sign * 0.05, -0.48, 0.42);
      armGroup.add(knuckle);

      return armGroup;
    };

    const armL = buildArm(true);
    armL.position.set(armSpread, 0.18, 0.02);
    spineGroup.add(armL);

    const armR = buildArm(false);
    armR.position.set(-armSpread, 0.18, 0.02);
    spineGroup.add(armR);

    // 4. Armored Leather Racing Pants & Legs
    const legsGroup = new THREE.Group();
    root.add(legsGroup);
    legsGroup.position.set(0, 0.85, 0);

    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.30), suitMat);
    pelvis.position.set(0, 0, torsoZ - 0.04);
    legsGroup.add(pelvis);

    const buildLeg = (isLeft) => {
      const legGroup = new THREE.Group();
      const sign = isLeft ? 1 : -1;

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.42, 8), suitMat);
      thigh.position.set(sign * 0.20, -0.16, legZ + 0.12);
      thigh.rotation.set(legPitch * 1.5, 0, sign * -0.12);
      legGroup.add(thigh);

      const kneeGroup = new THREE.Group();
      kneeGroup.position.set(sign * 0.28, -0.32, legZ + 0.30);

      const kneeArmor = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), sliderMat);
      kneeGroup.add(kneeArmor);

      const puck = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.09, 0.10), accentMat);
      puck.position.set(sign * 0.04, 0, 0.02);
      kneeGroup.add(puck);

      const sparkSlider = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 0.08), titaniumMat);
      sparkSlider.position.set(sign * 0.07, 0, 0.02);
      kneeGroup.add(sparkSlider);

      legGroup.add(kneeGroup);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.055, 0.40, 8), suitMat);
      shin.position.set(sign * 0.20, -0.46, legZ + 0.10);
      shin.rotation.set(-legPitch * 1.8, 0, sign * 0.08);
      legGroup.add(shin);

      const shinGuard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.04), sliderMat);
      shinGuard.position.set(sign * 0.21, -0.44, legZ + 0.15);
      legGroup.add(shinGuard);

      const boot = new THREE.Group();
      boot.position.set(sign * 0.20, bootY - 0.85, bootZ);

      const bootMain = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.28), bootMat);
      boot.add(bootMain);

      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.30), sliderMat);
      sole.position.y = -0.07;
      boot.add(sole);

      const toeSlider = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.10), titaniumMat);
      toeSlider.position.set(sign * 0.06, -0.04, 0.10);
      boot.add(toeSlider);

      legGroup.add(boot);

      return { legGroup, kneeGroup };
    };

    const legL = buildLeg(true);
    legsGroup.add(legL.legGroup);

    const legR = buildLeg(false);
    legsGroup.add(legR.legGroup);

    return {
      root,
      headGroup,
      spineGroup,
      kneeL: legL.kneeGroup,
      kneeR: legR.kneeGroup
    };
  }

  // --- Helper: Build Cockpit Driver for 4-Wheeled Vehicles ---
  buildCockpitDriver(options = {}) {
    const group = new THREE.Group();
    group.name = 'cockpitDriver';

    const seatMat = new THREE.MeshStandardMaterial({ color: '#16161e', roughness: 0.8 });
    const harnessMat = new THREE.MeshStandardMaterial({ color: '#ff0055', roughness: 0.4 });
    const suitMat = new THREE.MeshStandardMaterial({ color: options.suitColor || '#121626', roughness: 0.5 });
    const helmetMat = new THREE.MeshStandardMaterial({ color: options.helmetColor || '#ffffff', roughness: 0.3 });
    const visorMat = new THREE.MeshStandardMaterial({ color: '#ffaa00', emissive: '#ff5500', emissiveIntensity: 0.5 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#222', roughness: 0.3, metalness: 0.7 });

    const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.65), seatMat);
    seatBase.position.set(0, 0.52, -0.15);
    group.add(seatBase);

    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.85, 0.16), seatMat);
    seatBack.position.set(0, 0.95, -0.42);
    seatBack.rotation.x = -Math.PI / 14;
    group.add(seatBack);

    const harnessL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.04), harnessMat);
    harnessL.position.set(0.14, 0.95, -0.30);
    group.add(harnessL);
    const harnessR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.75, 0.04), harnessMat);
    harnessR.position.set(-0.14, 0.95, -0.30);
    group.add(harnessR);

    const driverTorso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.50, 0.28), suitMat);
    driverTorso.position.set(0, 0.88, -0.22);
    driverTorso.rotation.x = -Math.PI / 16;
    group.add(driverTorso);

    const driverHelmet = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), helmetMat);
    driverHelmet.position.set(0, 1.25, -0.15);
    group.add(driverHelmet);

    const driverVisor = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 0.12), visorMat);
    driverVisor.position.set(0, 1.25, -0.03);
    group.add(driverVisor);

    const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.024, 8, 16), wheelMat);
    steeringWheel.position.set(0, 0.92, 0.22);
    steeringWheel.rotation.x = Math.PI / 4;
    group.add(steeringWheel);

    const handGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const handL = new THREE.Mesh(handGeo, suitMat);
    handL.position.set(0.14, 0.95, 0.18);
    group.add(handL);
    const handR = new THREE.Mesh(handGeo, suitMat);
    handR.position.set(-0.14, 0.95, 0.18);
    group.add(handR);

    return group;
  }

  // --- Helper: Build Surfer/Skater Rider for Hoverboard ---
  buildHoverSurferRider() {
    const root = new THREE.Group();
    const suitMat = new THREE.MeshStandardMaterial({ color: '#16192e', roughness: 0.5, metalness: 0.5 });
    const neonTrim = new THREE.MeshBasicMaterial({ color: '#00ffc8' });
    const sliderMat = this.materials.armorSlider || new THREE.MeshStandardMaterial({ color: '#111218' });

    // Boots planted on repulsor board
    const buildBoot = (zPos, angle) => {
      const g = new THREE.Group();
      g.position.set(0, 0.6, zPos);
      g.rotation.y = angle;
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.32), suitMat);
      g.add(b);
      const sole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.34), sliderMat);
      sole.position.y = -0.05;
      g.add(sole);
      return g;
    };
    root.add(buildBoot(0.5, Math.PI / 3));
    root.add(buildBoot(-0.5, Math.PI / 2.5));

    // Athletic bent knees
    const legGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.55, 8);
    const legF = new THREE.Mesh(legGeo, suitMat);
    legF.position.set(0.05, 0.88, 0.45);
    legF.rotation.set(Math.PI / 10, 0, -Math.PI / 14);
    root.add(legF);

    const legB = new THREE.Mesh(legGeo, suitMat);
    legB.position.set(-0.05, 0.88, -0.45);
    legB.rotation.set(-Math.PI / 10, 0, Math.PI / 14);
    root.add(legB);

    // Torso with athletic lean
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.55, 0.28), suitMat);
    torsoMesh.position.set(0, 1.38, 0);
    torsoMesh.rotation.y = Math.PI / 4;
    root.add(torsoMesh);

    // Full-Face Aerodynamic Helmet
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.78, 0.05);
    root.add(headGroup);

    const helmetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), suitMat);
    headGroup.add(helmetMesh);

    const aeroFin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.20), neonTrim);
    aeroFin.position.set(0, 0.10, -0.10);
    headGroup.add(aeroFin);

    const visorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.12), neonTrim);
    visorMesh.position.set(0, 0, 0.16);
    headGroup.add(visorMesh);

    // Balancing outstretched arms
    const armGeo = new THREE.CylinderGeometry(0.06, 0.048, 0.55, 8);
    const armL = new THREE.Mesh(armGeo, suitMat);
    armL.position.set(0.32, 1.38, -0.15);
    armL.rotation.set(0, 0, -Math.PI / 3);
    root.add(armL);

    const armR = new THREE.Mesh(armGeo, suitMat);
    armR.position.set(-0.32, 1.38, 0.15);
    armR.rotation.set(0, 0, Math.PI / 3);
    root.add(armR);

    return root;
  }

  // ==========================================================================
  // TRAFFIC VEHICLE BUILDERS
  // ==========================================================================
  createSedanModel(colorHex = '#00f0ff') {
    const group = new THREE.Group();
    const carMat = new THREE.MeshStandardMaterial({ color: '#080816', roughness: 0.35, metalness: 0.8 });
    const accentMat = new THREE.MeshBasicMaterial({ color: colorHex });

    const lowerGeo = new THREE.BoxGeometry(1.9, 0.55, 3.8);
    const lowerMesh = new THREE.Mesh(lowerGeo, carMat);
    lowerMesh.position.y = 0.45;
    lowerMesh.castShadow = true;
    group.add(lowerMesh);

    const cabinGeo = new THREE.BoxGeometry(1.5, 0.55, 1.8);
    const cabinMesh = new THREE.Mesh(cabinGeo, this.materials.glass);
    cabinMesh.position.set(0, 0.95, -0.2);
    cabinMesh.castShadow = true;
    group.add(cabinMesh);

    const headGeo = new THREE.BoxGeometry(1.6, 0.08, 0.1);
    const headMesh = new THREE.Mesh(headGeo, accentMat);
    headMesh.position.set(0, 0.48, 1.9);
    group.add(headMesh);

    const tailGeo = new THREE.BoxGeometry(1.7, 0.1, 0.1);
    const tailMesh = new THREE.Mesh(tailGeo, this.materials.neonRed);
    tailMesh.position.set(0, 0.52, -1.9);
    group.add(tailMesh);

    const diffGeo = new THREE.BoxGeometry(1.4, 0.08, 0.1);
    const diffMesh = new THREE.Mesh(diffGeo, accentMat);
    diffMesh.position.set(0, 0.22, -1.9);
    group.add(diffMesh);

    const wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 14);
    const wheelPositions = [
      [-0.95, 0.32, 1.1],
      [0.95, 0.32, 1.1],
      [-0.95, 0.32, -1.1],
      [0.95, 0.32, -1.1]
    ];
    for (const [wx, wy, wz] of wheelPositions) {
      const w = new THREE.Mesh(wheelGeo, this.materials.tire);
      w.rotation.z = Math.PI / 2;
      w.position.set(wx, wy, wz);
      group.add(w);
      wheels.push(w);
    }

    return { root: group, wheels, width: 2.1, length: 4.0, height: 1.4 };
  }

  createHaulerModel() {
    const group = new THREE.Group();
    const cabGeo = new THREE.BoxGeometry(2.4, 1.9, 2.0);
    const cabMat = new THREE.MeshStandardMaterial({ color: '#090818', roughness: 0.4, metalness: 0.7 });
    const cabMesh = new THREE.Mesh(cabGeo, cabMat);
    cabMesh.position.set(0, 1.45, 2.2);
    cabMesh.castShadow = true;
    group.add(cabMesh);

    const winGeo = new THREE.BoxGeometry(2.1, 0.7, 0.1);
    const winMesh = new THREE.Mesh(winGeo, this.materials.glass);
    winMesh.position.set(0, 1.75, 3.22);
    group.add(winMesh);

    const cargoGeo = new THREE.BoxGeometry(2.5, 2.3, 4.8);
    const cargoMat = new THREE.MeshStandardMaterial({ color: '#100e24', roughness: 0.6, metalness: 0.3 });
    const cargoMesh = new THREE.Mesh(cargoGeo, cargoMat);
    cargoMesh.position.set(0, 1.75, -1.2);
    cargoMesh.castShadow = true;
    group.add(cargoMesh);

    const hazardGeo = new THREE.BoxGeometry(2.4, 0.45, 0.1);
    const hazardMat = new THREE.MeshBasicMaterial({ map: this.textures.hazard });
    const hazardMesh = new THREE.Mesh(hazardGeo, hazardMat);
    hazardMesh.position.set(0, 0.75, -3.62);
    group.add(hazardMesh);

    const stackGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8);
    const stackL = new THREE.Mesh(stackGeo, this.materials.chrome);
    stackL.position.set(-1.25, 2.1, 1.15);
    group.add(stackL);

    const stackR = stackL.clone();
    stackR.position.x = 1.25;
    group.add(stackR);

    const brakeClusterGeo = new THREE.BoxGeometry(0.55, 0.22, 0.1);
    const brakeL = new THREE.Mesh(brakeClusterGeo, this.materials.neonRed);
    brakeL.position.set(-0.85, 1.1, -3.62);
    group.add(brakeL);

    const brakeR = brakeL.clone();
    brakeR.position.x = 0.85;
    group.add(brakeR);

    const wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.32, 14);
    const wheelPositions = [
      [-1.25, 0.45, 2.2],
      [1.25, 0.45, 2.2],
      [-1.25, 0.45, -0.6],
      [1.25, 0.45, -0.6],
      [-1.25, 0.45, -2.4],
      [1.25, 0.45, -2.4]
    ];
    for (const [wx, wy, wz] of wheelPositions) {
      const w = new THREE.Mesh(wheelGeo, this.materials.tire);
      w.rotation.z = Math.PI / 2;
      w.position.set(wx, wy, wz);
      group.add(w);
      wheels.push(w);
    }

    return { root: group, wheels, width: 2.8, length: 7.2, height: 3.2 };
  }

  createCoupeModel(colorHex = '#ff007f') {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#120422', roughness: 0.2, metalness: 0.9 });
    const accentMat = new THREE.MeshBasicMaterial({ color: colorHex });

    const wedgeGeo = new THREE.BoxGeometry(2.0, 0.45, 4.2);
    const wedgeMesh = new THREE.Mesh(wedgeGeo, bodyMat);
    wedgeMesh.position.y = 0.38;
    wedgeMesh.castShadow = true;
    group.add(wedgeMesh);

    const canopyGeo = new THREE.BoxGeometry(1.4, 0.42, 1.8);
    const canopyMesh = new THREE.Mesh(canopyGeo, this.materials.glass);
    canopyMesh.position.set(0, 0.75, -0.2);
    canopyMesh.castShadow = true;
    group.add(canopyMesh);

    const wingGeo = new THREE.BoxGeometry(2.1, 0.05, 0.4);
    const wingMesh = new THREE.Mesh(wingGeo, accentMat);
    wingMesh.position.set(0, 0.95, -1.9);
    group.add(wingMesh);

    const strutGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.35, 6);
    const strutL = new THREE.Mesh(strutGeo, this.materials.chrome);
    strutL.position.set(-0.65, 0.78, -1.9);
    group.add(strutL);

    const strutR = strutL.clone();
    strutR.position.x = 0.65;
    group.add(strutR);

    const tailGeo = new THREE.BoxGeometry(0.65, 0.1, 0.08);
    const tailL = new THREE.Mesh(tailGeo, this.materials.neonPink);
    tailL.position.set(-0.55, 0.45, -2.12);
    group.add(tailL);

    const tailR = tailL.clone();
    tailR.position.x = 0.55;
    group.add(tailR);

    const blinkerMatL = new THREE.MeshBasicMaterial({ color: '#ffaa00', visible: false });
    const blinkerMatR = new THREE.MeshBasicMaterial({ color: '#ffaa00', visible: false });

    const blinkerGeo = new THREE.BoxGeometry(0.2, 0.12, 0.08);
    const blinkerMeshL = new THREE.Mesh(blinkerGeo, blinkerMatL);
    blinkerMeshL.position.set(0.95, 0.45, -2.12);
    group.add(blinkerMeshL);

    const blinkerMeshR = new THREE.Mesh(blinkerGeo, blinkerMatR);
    blinkerMeshR.position.set(-0.95, 0.45, -2.12);
    group.add(blinkerMeshR);

    const wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.26, 14);
    const wheelPositions = [
      [-1.02, 0.3, 1.2],
      [1.02, 0.3, 1.2],
      [-1.02, 0.3, -1.2],
      [1.02, 0.3, -1.2]
    ];
    for (const [wx, wy, wz] of wheelPositions) {
      const w = new THREE.Mesh(wheelGeo, this.materials.tire);
      w.rotation.z = Math.PI / 2;
      w.position.set(wx, wy, wz);
      group.add(w);
      wheels.push(w);
    }

    return {
      root: group,
      wheels,
      blinkerMatL,
      blinkerMatR,
      width: 2.2,
      length: 4.4,
      height: 1.15
    };
  }

  // ==========================================================================
  // SCENERY: DESERT BIOME PROPS
  // ==========================================================================
  createCactusModel() {
    const group = new THREE.Group();
    const cactusMat = new THREE.MeshStandardMaterial({ color: '#2d5a27', roughness: 0.8, metalness: 0.1 });

    // Main Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.35, 0.4, 4.5, 8);
    const trunk = new THREE.Mesh(trunkGeo, cactusMat);
    trunk.position.y = 2.25;
    trunk.castShadow = true;
    group.add(trunk);

    // Left Arm
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.6, 6), cactusMat);
    armL.position.set(0.7, 2.6, 0);
    armL.rotation.z = -Math.PI / 4;
    group.add(armL);

    const branchL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 6), cactusMat);
    branchL.position.set(1.2, 3.5, 0);
    group.add(branchL);

    // Right Arm
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.4, 6), cactusMat);
    armR.position.set(-0.65, 2.1, 0);
    armR.rotation.z = Math.PI / 4;
    group.add(armR);

    const branchR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 6), cactusMat);
    branchR.position.set(-1.05, 2.8, 0);
    group.add(branchR);

    return group;
  }

  createDesertMesaModel() {
    const group = new THREE.Group();
    const mesaMat = new THREE.MeshStandardMaterial({ color: '#8c4824', roughness: 0.95, metalness: 0.05 });

    // Tier 1 Base
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(28, 8, 22), mesaMat);
    baseMesh.position.y = 4;
    group.add(baseMesh);

    // Tier 2 Middle
    const midMesh = new THREE.Mesh(new THREE.BoxGeometry(20, 7, 16), mesaMat);
    midMesh.position.y = 11.5;
    group.add(midMesh);

    // Tier 3 Cap
    const capMesh = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 11), mesaMat);
    capMesh.position.y = 17;
    group.add(capMesh);

    return group;
  }

  createDesertRockModel() {
    const rockGeo = new THREE.DodecahedronGeometry(2.5, 1);
    const rockMat = new THREE.MeshStandardMaterial({ color: '#a05c32', roughness: 0.9 });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.y = 1.8;
    rock.scale.set(1.2, 0.8, 1.5);
    return rock;
  }

  // ==========================================================================
  // SCENERY: MOUNTAIN BIOME PROPS
  // ==========================================================================
  createPineTreeModel() {
    const group = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#3d2514', roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: '#163820', roughness: 0.8 });
    const snowMat = new THREE.MeshStandardMaterial({ color: '#eef5ff', roughness: 0.7 });

    // Trunk
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 2.5, 6), trunkMat);
    trunk.position.y = 1.25;
    group.add(trunk);

    // 3 Foliage Cones with Snow Caps
    const tiers = [
      { y: 3.0, r: 2.2, h: 2.5 },
      { y: 4.8, r: 1.7, h: 2.2 },
      { y: 6.4, r: 1.1, h: 1.8 }
    ];

    for (const t of tiers) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(t.r, t.h, 7), foliageMat);
      cone.position.y = t.y;
      group.add(cone);

      const snow = new THREE.Mesh(new THREE.ConeGeometry(t.r * 0.7, t.h * 0.4, 7), snowMat);
      snow.position.y = t.y + t.h * 0.35;
      group.add(snow);
    }

    return group;
  }

  createMountainPeakModel() {
    const group = new THREE.Group();
    const rockMat = new THREE.MeshStandardMaterial({ color: '#2b333a', roughness: 0.9 });
    const snowMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 });

    // Base jagged peak
    const peakMesh = new THREE.Mesh(new THREE.ConeGeometry(18, 35, 5), rockMat);
    peakMesh.position.y = 17.5;
    group.add(peakMesh);

    // Snow Cap
    const snowCap = new THREE.Mesh(new THREE.ConeGeometry(9, 14, 5), snowMat);
    snowCap.position.y = 28;
    group.add(snowCap);

    return group;
  }

  createMountainRockModel() {
    const rockGeo = new THREE.DodecahedronGeometry(2.2, 1);
    const rockMat = new THREE.MeshStandardMaterial({ color: '#404c56', roughness: 0.85 });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.y = 1.5;
    rock.scale.set(1.4, 0.9, 1.2);
    return rock;
  }

  // ==========================================================================
  // SCENERY: CITY BIOME PROPS
  // ==========================================================================
  // 1. Contemporary Swept-Arch LED Streetlight
  createCityStreetlightModel() {
    return this.createCityStreetlightModernModel();
  }

  createCityStreetlightModernModel() {
    const group = new THREE.Group();
    const poleMat = this.materials.streetLightPoleMat || new THREE.MeshStandardMaterial({ color: '#282e3c', roughness: 0.35, metalness: 0.8 });
    const lampMat = new THREE.MeshBasicMaterial({ color: '#fff9e6' });
    const casingMat = new THREE.MeshStandardMaterial({ color: '#161922', roughness: 0.3, metalness: 0.85 });

    // Vertical swept pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.15, 7.8, 8), poleMat);
    pole.position.y = 3.9;
    group.add(pole);

    // Modern Curved Overhang Arm extending toward road
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8), poleMat);
    arm.position.set(-1.1, 7.5, 0);
    arm.rotation.z = Math.PI / 2.8;
    group.add(arm);

    // Aerodynamic Luminaire Head
    const luminaire = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.10, 0.32), casingMat);
    luminaire.position.set(-2.2, 7.4, 0);
    group.add(luminaire);

    // Glowing LED Downlight lens
    const lightLens = new THREE.Mesh(new THREE.PlaneGeometry(0.70, 0.24), lampMat);
    lightLens.position.set(-2.2, 7.34, 0);
    lightLens.rotation.x = Math.PI / 2;
    group.add(lightLens);

    // Banner / Flag bracket on pole
    const bannerMat = new THREE.MeshStandardMaterial({ color: '#00f0ff', roughness: 0.6 });
    const banner = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 0.65), bannerMat);
    banner.position.set(0.22, 5.2, 0);
    group.add(banner);

    return group;
  }

  // 2. Commercial Street-Level Storefront (Boutiques, Cafes, Arcades)
  createCityStorefrontModel(variant = 0) {
    const group = new THREE.Group();
    const width = 14;
    const height = 6.8;
    const depth = 8;

    // Building Base & Structure
    const wallMat = new THREE.MeshStandardMaterial({
      color: variant % 2 === 0 ? '#323640' : '#4a3d36',
      roughness: 0.7
    });
    const structure = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMat);
    structure.position.y = height / 2;
    structure.castShadow = true;
    structure.receiveShadow = true;
    group.add(structure);

    // Commercial Ground-Floor Facade with Glass Windows
    const facadeGeo = new THREE.PlaneGeometry(width * 0.95, height * 0.88);
    const facade = new THREE.Mesh(facadeGeo, this.materials.storefrontMat);
    facade.position.set(0, height / 2, depth / 2 + 0.02);
    group.add(facade);

    // Fabric Awning projecting over the sidewalk
    const awningColors = ['#ff2a55', '#00b4d8', '#ff9f1c', '#2ec4b6'];
    const awningColor = awningColors[variant % awningColors.length];
    const awningMat = new THREE.MeshStandardMaterial({ color: awningColor, roughness: 0.6 });

    const awning = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, 0.08, 1.8), awningMat);
    awning.position.set(0, height * 0.64, depth / 2 + 0.9);
    awning.rotation.x = Math.PI / 10;
    group.add(awning);

    // Storefront 3D Illuminated Sign
    const signNames = ['METRO BISTRO', 'CYBER GEAR', 'APEX MOTORS', 'ARCADE CAFE'];
    const signName = signNames[variant % signNames.length];
    const signBox = new THREE.Mesh(new THREE.BoxGeometry(width * 0.75, 0.85, 0.25), this.materials.streetLightPoleMat);
    signBox.position.set(0, height * 0.86, depth / 2 + 0.15);
    group.add(signBox);

    // Glass Entry Door Frame
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 0.1), this.materials.chrome);
    doorFrame.position.set(0, 1.4, depth / 2 + 0.05);
    group.add(doorFrame);

    return group;
  }

  // 3. Multi-Story Urban Residential Brick/Stucco Apartment
  createCityApartmentModel(variant = 0) {
    const group = new THREE.Group();
    const width = 14 + (variant % 3) * 2;
    const height = 20 + (variant % 4) * 6;
    const depth = 12;

    // Brick Apartment Body
    const aptMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), this.materials.brickApartmentMat);
    aptMesh.position.y = height / 2;
    aptMesh.castShadow = true;
    aptMesh.receiveShadow = true;
    group.add(aptMesh);

    // Decorative Rooftop Parapet
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(width + 0.4, 0.6, depth + 0.4), this.materials.curbMat);
    parapet.position.y = height + 0.3;
    group.add(parapet);

    // Rooftop Water Tank (Classic Cedar/Steel Cylinder)
    const tankGeo = new THREE.CylinderGeometry(1.4, 1.4, 2.5, 12);
    const tankMat = new THREE.MeshStandardMaterial({ color: '#5a3d28', roughness: 0.9 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(width * 0.2, height + 2.5, 0);
    group.add(tank);

    // Water tank steel legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.3, 6);
    const legMat = this.materials.streetLightPoleMat;
    for (let l = 0; l < 4; l++) {
      const ang = (l / 4) * Math.PI * 2;
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(width * 0.2 + Math.cos(ang) * 1.1, height + 0.65, Math.sin(ang) * 1.1);
      group.add(leg);
    }

    // Rooftop AC Compressor Units
    const acGeo = new THREE.BoxGeometry(1.6, 1.1, 1.4);
    const acMat = new THREE.MeshStandardMaterial({ color: '#7a828e', roughness: 0.5, metalness: 0.6 });
    const ac1 = new THREE.Mesh(acGeo, acMat);
    ac1.position.set(-width * 0.25, height + 0.55, depth * 0.2);
    group.add(ac1);

    // Exterior Fire Escape Metal Platforms & Ladders on side
    const escapeMat = this.materials.streetLightPoleMat;
    for (let fl = 4; fl < height - 2; fl += 4.5) {
      const plat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 2.8), escapeMat);
      plat.position.set(width / 2 + 0.4, fl, 0);
      group.add(plat);

      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.06), escapeMat);
      rail.position.set(width / 2 + 0.4, fl + 0.4, 1.4);
      group.add(rail);
    }

    return group;
  }

  // 4. Modern Glass Curtain-Wall Skyscraper Office Tower
  createCityTowerModel() {
    return this.createCityOfficeTowerModel(Math.floor(Math.random() * 5));
  }

  createCityOfficeTowerModel(variant = 0) {
    const group = new THREE.Group();
    const width = 16 + (variant % 3) * 4;
    const height = 48 + (variant % 4) * 16;
    const depth = 16 + (variant % 2) * 4;

    // Main Tower with Daytime Reflective Glass Texture
    const tower = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), this.materials.officeGlassMat);
    tower.position.y = height / 2;
    tower.castShadow = true;
    tower.receiveShadow = true;
    group.add(tower);

    // Stepped Architectural Crown Setback
    const crownH = 8;
    const crown = new THREE.Mesh(new THREE.BoxGeometry(width * 0.75, crownH, depth * 0.75), this.materials.officeGlassMat);
    crown.position.y = height + crownH / 2;
    group.add(crown);

    // Rooftop Communications Mast Spire with Warning Beacon
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.25, 12, 6), this.materials.chrome);
    spire.position.y = height + crownH + 6;
    group.add(spire);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), this.materials.neonRed);
    beacon.position.y = height + crownH + 12;
    group.add(beacon);

    return group;
  }

  // 5. Deciduous Green Street Tree in Sidewalk Grate
  createCityStreetTreeModel() {
    const group = new THREE.Group();

    // Cast Iron Tree Grate embedded in sidewalk
    const grateGeo = new THREE.BoxGeometry(1.6, 0.04, 1.6);
    const grateMat = this.materials.streetLightPoleMat;
    const grate = new THREE.Mesh(grateGeo, grateMat);
    grate.position.y = 0.02;
    group.add(grate);

    // Organic Wood Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.26, 4.2, 8);
    const trunk = new THREE.Mesh(trunkGeo, this.materials.treeBarkMat);
    trunk.position.y = 2.1;
    trunk.castShadow = true;
    group.add(trunk);

    // Lush Summer Foliage Canopy Clustered in 4 Spheres
    const foliageMat = this.materials.treeFoliageMat;
    const crownCenters = [
      { x: 0, y: 4.8, z: 0, r: 1.5 },
      { x: 0.6, y: 4.5, z: 0.4, r: 1.2 },
      { x: -0.5, y: 4.6, z: -0.3, r: 1.3 },
      { x: 0.2, y: 5.6, z: -0.2, r: 1.1 }
    ];

    crownCenters.forEach(c => {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(c.r, 8, 8), foliageMat);
      sphere.position.set(c.x, c.y, c.z);
      sphere.castShadow = true;
      group.add(sphere);
    });

    return group;
  }

  // 6. Curbside Parked Vehicles (Sedans, Hatchbacks, Compact SUVs)
  createCityParkedVehicleModel(variant = 0) {
    const group = new THREE.Group();
    const colors = ['#d8dee9', '#2b4c7e', '#e5e9f0', '#9c1c28', '#2e3440'];
    const carColor = colors[variant % colors.length];
    const carMat = new THREE.MeshStandardMaterial({ color: carColor, roughness: 0.25, metalness: 0.8 });

    // Lower Body
    const lower = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.52, 3.8), carMat);
    lower.position.y = 0.44;
    lower.castShadow = true;
    group.add(lower);

    // Cabin with Glass Windows
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.44, 2.0), this.materials.glass);
    cabin.position.set(0, 0.88, -0.2);
    group.add(cabin);

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.05, 1.8), carMat);
    roof.position.set(0, 1.12, -0.2);
    group.add(roof);

    // Headlights & Taillights
    const headL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.05), new THREE.MeshBasicMaterial({ color: '#fff8e7' }));
    headL.position.set(0.6, 0.48, 1.91);
    group.add(headL);
    const headR = headL.clone();
    headR.position.x = -0.6;
    group.add(headR);

    const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.05), new THREE.MeshBasicMaterial({ color: '#ff1122' }));
    tailL.position.set(0.6, 0.48, -1.91);
    group.add(tailL);
    const tailR = tailL.clone();
    tailR.position.x = -0.6;
    group.add(tailR);

    // 4 Wheels
    const buildWheel = (x, z) => {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 14), this.materials.tire);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.32, z);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.20, 0.24, 10), this.materials.chrome);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(x, 0.32, z);
      group.add(w);
      group.add(rim);
    };
    buildWheel(0.95, 1.1);
    buildWheel(-0.95, 1.1);
    buildWheel(0.95, -1.1);
    buildWheel(-0.95, -1.1);

    return group;
  }

  // 7. City Crosswalk Intersection with Overhead Traffic Signal Gantry
  createCityCrosswalkIntersectionModel() {
    const group = new THREE.Group();

    // Zebra Crosswalk Stripes (8 crisp white stripes across the roadway)
    const stripeGeo = new THREE.PlaneGeometry(0.9, 4.2);
    for (let s = -3.5; s <= 3.5; s++) {
      const stripe = new THREE.Mesh(stripeGeo, this.materials.crosswalkMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(s * 1.8, 0.02, 0);
      group.add(stripe);
    }

    // Overhead Traffic Light Gantry Mast & Arm
    const mastMat = this.materials.streetLightPoleMat;
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 8.2, 8), mastMat);
    mast.position.set(8.5, 4.1, 3.5);
    group.add(mast);

    const crossArm = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.22, 0.22), mastMat);
    crossArm.position.set(0, 7.8, 3.5);
    group.add(crossArm);

    // Traffic Signal Heads (Green, Amber, Red) over each lane
    const laneX = [-4.6, 0, 4.6];
    laneX.forEach(lx => {
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.95, 0.30), this.materials.streetLightPoleMat);
      head.position.set(lx, 7.2, 3.5);
      group.add(head);

      // Active Green Light Signal facing incoming traffic (+Z)
      const greenSignal = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 8), new THREE.MeshBasicMaterial({ color: '#00ff88' }));
      greenSignal.position.set(lx, 6.9, 3.65);
      group.add(greenSignal);
    });

    return group;
  }

  // ==========================================================================
  // SCENERY: NEON BIOME PROPS
  // ==========================================================================
  createPalmTreeModel(colorHex = '#ff00aa') {
    const group = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#1a0033', roughness: 0.5, metalness: 0.7 });
    const neonLeafMat = new THREE.MeshBasicMaterial({ color: colorHex });

    // Segmented Trunk
    const trunkHeight = 6.0;
    const segments = 5;
    const segH = trunkHeight / segments;
    for (let s = 0; s < segments; s++) {
      const segGeo = new THREE.CylinderGeometry(0.18 - s * 0.015, 0.22 - s * 0.015, segH, 6);
      const segMesh = new THREE.Mesh(segGeo, trunkMat);
      segMesh.position.y = s * segH + segH / 2;
      segMesh.rotation.z = Math.sin(s * 0.6) * 0.05;
      group.add(segMesh);
    }

    // Glowing Holographic Palm Fronds
    const frondCount = 7;
    for (let f = 0; f < frondCount; f++) {
      const angle = (f / frondCount) * Math.PI * 2;
      const frondGeo = new THREE.BoxGeometry(0.2, 0.04, 2.4);
      const frond = new THREE.Mesh(frondGeo, neonLeafMat);
      frond.position.set(Math.cos(angle) * 1.1, trunkHeight - 0.2, Math.sin(angle) * 1.1);
      frond.rotation.y = angle;
      frond.rotation.x = Math.PI / 4.5;
      group.add(frond);
    }

    return group;
  }

  createPylonModel(colorHex = '#00f0ff') {
    const group = new THREE.Group();
    const towerMat = new THREE.MeshStandardMaterial({ color: '#0d001a', roughness: 0.4, metalness: 0.8 });
    const beamMat = new THREE.MeshBasicMaterial({ color: colorHex });

    const legGeo = new THREE.CylinderGeometry(0.1, 0.2, 9.0, 4);
    const legL = new THREE.Mesh(legGeo, towerMat);
    legL.position.set(-0.8, 4.5, 0);
    legL.rotation.z = -0.08;
    group.add(legL);

    const legR = new THREE.Mesh(legGeo, towerMat);
    legR.position.set(0.8, 4.5, 0);
    legR.rotation.z = 0.08;
    group.add(legR);

    // Glowing Neon Beacon Rings
    for (let h = 3; h < 9; h += 2.5) {
      const ringGeo = new THREE.TorusGeometry(0.65 - h * 0.03, 0.04, 6, 12);
      const ring = new THREE.Mesh(ringGeo, beamMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = h;
      group.add(ring);
    }

    return group;
  }

  createGantryModel(text = 'NEON HIGHWAY') {
    const group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: '#16082e', roughness: 0.4, metalness: 0.8 });

    const pillarGeo = new THREE.CylinderGeometry(0.25, 0.3, 8.5, 8);
    const pillarL = new THREE.Mesh(pillarGeo, frameMat);
    pillarL.position.set(10.5, 4.25, 0);
    group.add(pillarL);

    const pillarR = pillarL.clone();
    pillarR.position.x = -10.5;
    group.add(pillarR);

    const spanGeo = new THREE.BoxGeometry(21.4, 0.6, 0.6);
    const spanMesh = new THREE.Mesh(spanGeo, frameMat);
    spanMesh.position.set(0, 8.2, 0);
    group.add(spanMesh);

    // Canvas Sign Banner
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 512;
    bannerCanvas.height = 96;
    const bctx = bannerCanvas.getContext('2d');
    bctx.fillStyle = '#0a0018';
    bctx.fillRect(0, 0, 512, 96);
    bctx.strokeStyle = '#00f0ff';
    bctx.lineWidth = 4;
    bctx.strokeRect(4, 4, 504, 88);

    bctx.fillStyle = '#ff00aa';
    bctx.font = "bold 34px 'Orbitron', monospace, sans-serif";
    bctx.textAlign = 'center';
    bctx.textBaseline = 'middle';
    bctx.fillText(text, 256, 48);

    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    const bannerGeo = new THREE.PlaneGeometry(12, 2.2);
    const bannerMesh = new THREE.Mesh(bannerGeo, new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide }));
    bannerMesh.position.set(0, 8.2, 0.35);
    group.add(bannerMesh);

    return group;
  }

  createBillboardModel(tag = 'OVERDRIVE') {
    const group = new THREE.Group();
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 4.0, 6);
    const postMat = new THREE.MeshStandardMaterial({ color: '#16082e' });
    const postL = new THREE.Mesh(postGeo, postMat);
    postL.position.set(-1.4, 2.0, 0);
    group.add(postL);

    const postR = postL.clone();
    postR.position.x = 1.4;
    group.add(postR);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#100028';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = '#ff00aa';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 124);

    ctx.fillStyle = '#00ffff';
    ctx.font = "bold 28px 'Orbitron', monospace, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, 128, 64);

    const tex = new THREE.CanvasTexture(canvas);
    const faceGeo = new THREE.BoxGeometry(3.6, 1.8, 0.15);
    const faceMesh = new THREE.Mesh(faceGeo, new THREE.MeshBasicMaterial({ map: tex }));
    faceMesh.position.set(0, 4.5, 0);
    group.add(faceMesh);

    return group;
  }

  createRetroSunModel() {
    const sunCanvas = document.createElement('canvas');
    sunCanvas.width = 512;
    sunCanvas.height = 512;
    const ctx = sunCanvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ffff40');
    grad.addColorStop(0.35, '#ff0066');
    grad.addColorStop(0.8, '#880088');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.fill();

    // Cut horizontal retro slats into lower half
    ctx.fillStyle = '#060012';
    for (let i = 0; i < 9; i++) {
      const y = 256 + i * 26;
      const h = 4 + i * 3.2;
      ctx.fillRect(0, y, 512, h);
    }

    const tex = new THREE.CanvasTexture(sunCanvas);
    const sunGeo = new THREE.PlaneGeometry(160, 160);
    const sunMat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    return new THREE.Mesh(sunGeo, sunMat);
  }

  // ==========================================================================
  // LEVEL MODE OBJECTS: COINS, CHECKPOINT ARCHES, AND FINISH LINE
  // ==========================================================================
  createCoinModel() {
    const root = new THREE.Group();
    const spinGroup = new THREE.Group();
    root.add(spinGroup);

    // Golden Coin Disc (Radius 0.5, thickness 0.12)
    const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 24);
    const coinMat = new THREE.MeshStandardMaterial({
      color: '#ffcc00',
      metalness: 0.85,
      roughness: 0.2,
      emissive: '#ff9900',
      emissiveIntensity: 0.45
    });
    const coinMesh = new THREE.Mesh(coinGeo, coinMat);
    coinMesh.rotation.x = Math.PI / 2;
    spinGroup.add(coinMesh);

    // Glowing Outer Ring Bevel
    const ringGeo = new THREE.TorusGeometry(0.52, 0.05, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: '#ffea00' });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    spinGroup.add(ringMesh);

    // Canvas Texture with Original Currency Symbol "₳"
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#060012';
    ctx.font = "bold 80px 'Orbitron', monospace, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('₳', 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    const badgeGeo = new THREE.PlaneGeometry(0.68, 0.68);
    const badgeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
    const badgeF = new THREE.Mesh(badgeGeo, badgeMat);
    badgeF.position.z = 0.07;
    spinGroup.add(badgeF);

    const badgeB = badgeF.clone();
    badgeB.position.z = -0.07;
    badgeB.rotation.y = Math.PI;
    root.spinGroup = spinGroup;
    root.mesh = coinMesh;
    return root;
  }

  createCheckpointArchModel(tag = 'CHECKPOINT') {
    const group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: '#090820', roughness: 0.3, metalness: 0.8 });

    // Left & Right Cyber Pillars
    const pillarGeo = new THREE.BoxGeometry(1.2, 9.0, 1.2);
    const pillarL = new THREE.Mesh(pillarGeo, frameMat);
    pillarL.position.set(11.0, 4.5, 0);
    group.add(pillarL);

    const pillarR = pillarL.clone();
    pillarR.position.x = -11.0;
    group.add(pillarR);

    // Vertical Neon Edge Strips on Pillars (Cyan / Amber)
    const stripGeo = new THREE.BoxGeometry(0.12, 9.0, 1.25);
    const stripL = new THREE.Mesh(stripGeo, this.materials.neonCyan);
    stripL.position.set(10.4, 4.5, 0);
    group.add(stripL);

    const stripR = new THREE.Mesh(stripGeo, this.materials.neonCyan);
    stripR.position.set(-10.4, 4.5, 0);
    group.add(stripR);

    // Overhead Arch Truss Span
    const spanGeo = new THREE.BoxGeometry(23.2, 1.0, 1.4);
    const spanMesh = new THREE.Mesh(spanGeo, frameMat);
    spanMesh.position.set(0, 8.8, 0);
    group.add(spanMesh);

    // Lower glowing neon edge on the span
    const lowerNeonGeo = new THREE.BoxGeometry(22.6, 0.15, 1.5);
    const lowerNeonMesh = new THREE.Mesh(lowerNeonGeo, this.materials.neonAmber);
    lowerNeonMesh.position.set(0, 8.25, 0);
    group.add(lowerNeonMesh);

    // Canvas Checkpoint Banner
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 512;
    bannerCanvas.height = 128;
    const bctx = bannerCanvas.getContext('2d');
    bctx.fillStyle = '#060015';
    bctx.fillRect(0, 0, 512, 128);
    bctx.strokeStyle = '#ffaa00';
    bctx.lineWidth = 6;
    bctx.strokeRect(6, 6, 500, 116);

    bctx.fillStyle = '#ffcc00';
    bctx.font = "900 44px 'Orbitron', monospace, sans-serif";
    bctx.textAlign = 'center';
    bctx.textBaseline = 'middle';
    bctx.fillText(tag, 256, 44);

    bctx.fillStyle = '#00f0ff';
    bctx.font = "bold 26px 'Orbitron', monospace, sans-serif";
    bctx.fillText('+15s TIME BONUS', 256, 88);

    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    const bannerGeo = new THREE.PlaneGeometry(13.5, 3.4);
    const bannerMesh = new THREE.Mesh(bannerGeo, new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide }));
    bannerMesh.position.set(0, 8.8, 0.72);
    group.add(bannerMesh);

    return group;
  }

  createFinishLineModel() {
    const group = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: '#090820', roughness: 0.3, metalness: 0.8 });

    // Grand Gantry Towers
    const towerGeo = new THREE.BoxGeometry(1.6, 12.0, 1.6);
    const towerL = new THREE.Mesh(towerGeo, frameMat);
    towerL.position.set(11.2, 6.0, 0);
    group.add(towerL);

    const towerR = towerL.clone();
    towerR.position.x = -11.2;
    group.add(towerR);

    // Neon columns
    const colGeo = new THREE.BoxGeometry(0.18, 11.5, 1.65);
    const colL = new THREE.Mesh(colGeo, this.materials.neonPink);
    colL.position.set(10.4, 6.0, 0);
    group.add(colL);

    const colR = new THREE.Mesh(colGeo, this.materials.neonPink);
    colR.position.set(-10.4, 6.0, 0);
    group.add(colR);

    // Top Bridge
    const spanGeo = new THREE.BoxGeometry(24.0, 1.4, 1.8);
    const spanMesh = new THREE.Mesh(spanGeo, frameMat);
    spanMesh.position.set(0, 11.2, 0);
    group.add(spanMesh);

    // Checkered Banner
    const checkCanvas = document.createElement('canvas');
    checkCanvas.width = 512;
    checkCanvas.height = 128;
    const cctx = checkCanvas.getContext('2d');
    const squareSize = 32;
    for (let y = 0; y < 128; y += squareSize) {
      for (let x = 0; x < 512; x += squareSize) {
        cctx.fillStyle = ((x / squareSize + y / squareSize) % 2 === 0) ? '#ffffff' : '#00e5ff';
        cctx.fillRect(x, y, squareSize, squareSize);
      }
    }
    // Center title plaque
    cctx.fillStyle = 'rgba(6, 0, 18, 0.88)';
    cctx.fillRect(40, 20, 432, 88);
    cctx.strokeStyle = '#ff00aa';
    cctx.lineWidth = 4;
    cctx.strokeRect(40, 20, 432, 88);

    cctx.fillStyle = '#ffffff';
    cctx.font = "900 48px 'Orbitron', monospace, sans-serif";
    cctx.textAlign = 'center';
    cctx.textBaseline = 'middle';
    cctx.fillText('FINISH LINE', 256, 64);

    const checkTex = new THREE.CanvasTexture(checkCanvas);
    const bannerGeo = new THREE.PlaneGeometry(16, 4.0);
    const bannerMesh = new THREE.Mesh(bannerGeo, new THREE.MeshBasicMaterial({ map: checkTex, side: THREE.DoubleSide }));
    bannerMesh.position.set(0, 11.2, 0.95);
    group.add(bannerMesh);

    // Roadway Finish Decal across asphalt (X from -7.5 to 7.5)
    const roadDecalCanvas = document.createElement('canvas');
    roadDecalCanvas.width = 512;
    roadDecalCanvas.height = 128;
    const rdctx = roadDecalCanvas.getContext('2d');
    for (let y = 0; y < 128; y += 32) {
      for (let x = 0; x < 512; x += 32) {
        rdctx.fillStyle = ((x / 32 + y / 32) % 2 === 0) ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 240, 255, 0.65)';
        rdctx.fillRect(x, y, 32, 32);
      }
    }
    const roadDecalTex = new THREE.CanvasTexture(roadDecalCanvas);
    const roadDecalGeo = new THREE.PlaneGeometry(15, 3.5);
    const roadDecalMesh = new THREE.Mesh(roadDecalGeo, new THREE.MeshBasicMaterial({ map: roadDecalTex, transparent: true, side: THREE.DoubleSide }));
    roadDecalMesh.rotation.x = -Math.PI / 2;
    roadDecalMesh.position.set(0, 0.04, 0);
    group.add(roadDecalMesh);

    return group;
  }
}

if (typeof window !== 'undefined') {
  window.VEHICLE_SPECS = VEHICLE_SPECS;
  window.ModelFactory = ModelFactory;
}
if (typeof module !== 'undefined') {
  module.exports = { ModelFactory, VEHICLE_SPECS };
}
