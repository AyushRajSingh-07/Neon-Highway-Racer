/**
 * Neon Highway - 3D World & Endless Highway Engine
 * Manages WebGL scene, lighting, atmospheric fog, modular road chunk pooling,
 * roadside scenery recycling, dynamic shadows, and 4 biomes × 4 times of day.
 */

class World3D {
  constructor(modelFactory) {
    this.models = modelFactory;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Quality Settings
    this.quality = 'high'; // 'high' | 'medium' | 'low'
    this.shadowsEnabled = true;

    // Road Dimensions
    this.roadWidth = 16.0;   // 3 lanes (each lane ~4.6 units)
    this.lanes = [4.6, 0.0, -4.6]; // Lane centers: Left (+4.6), Center (0.0), Right (-4.6)
    this.chunkLength = 50.0; // Z length per road chunk
    this.numChunks = 16;     // Total chunks visible ahead (800 units draw distance)

    // Current Biome & Lighting Setting
    this.currentMapId = 'city';
    this.currentTimeOfDay = 'midday';

    // Chunk Pool
    this.chunks = [];
    this.currentChunkIndex = 0;

    // Lighting refs
    this.ambientLight = null;
    this.sunLight = null;
    this.headLight = null;
    this.tailLight = null;

    // Horizon props group
    this.horizonGroup = null;
    this.horizonSun = null;
  }

  init(container) {
    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera Setup (3rd-person perspective)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(62, aspect, 0.1, 1000);
    this.camera.position.set(0, 3.4, -7.5);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      stencil: false
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = this.shadowsEnabled;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Base Lighting System
    this.setupLighting();

    // 5. Apply Initial Environment Settings
    this.setEnvironment(this.currentMapId, this.currentTimeOfDay);
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight('#7890b0', 1.5);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight('#fff9e6', 2.6);
    this.sunLight.position.set(35, 65, 85);
    this.sunLight.castShadow = this.shadowsEnabled;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 5;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -22;
    this.sunLight.shadow.camera.right = 22;
    this.sunLight.shadow.camera.top = 30;
    this.sunLight.shadow.camera.bottom = -10;
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);

    // Motorcycle Forward Headlight (SpotLight illuminating road ahead)
    this.headLight = new THREE.SpotLight('#ffffea', 4.5, 60, Math.PI / 6, 0.4, 1.2);
    this.headLight.position.set(0, 1.2, 0);
    this.scene.add(this.headLight);
    this.scene.add(this.headLight.target);

    // Motorcycle Taillight
    this.tailLight = new THREE.PointLight('#ff0033', 1.5, 8);
    this.tailLight.position.set(0, 0.8, -1.0);
    this.scene.add(this.tailLight);
  }

  // ==========================================================================
  // ENVIRONMENT ATMOSPHERE & TIME OF DAY ENGINE
  // ==========================================================================
  setEnvironment(mapId = 'city', timeOfDay = 'midday', forceRebuild = false) {
    const mapChanged = mapId !== this.currentMapId;
    this.currentMapId = mapId;
    this.currentTimeOfDay = timeOfDay;

    // Atmospheric palette definition per Map × Time
    const PALETTES = {
      city: {
        midday:    { sky: '#3a88e9', fog: '#b8d4f6', density: 0.0010, sun: '#fff9e6', sunInt: 2.6, amb: '#7890b0', ambInt: 1.5, head: '#ffffea' },
        afternoon: { sky: '#3a88e9', fog: '#b8d4f6', density: 0.0010, sun: '#fff9e6', sunInt: 2.6, amb: '#7890b0', ambInt: 1.5, head: '#ffffea' },
        morning:   { sky: '#c88265', fog: '#d0967d', density: 0.0016, sun: '#ffe0b0', sunInt: 2.2, amb: '#4a3848', ambInt: 1.3, head: '#ffffaa' },
        sunset:    { sky: '#802035', fog: '#982840', density: 0.0020, sun: '#ff4818', sunInt: 2.0, amb: '#401830', ambInt: 1.3, head: '#ffee88' },
        night:     { sky: '#060a18', fog: '#0a0e24', density: 0.0028, sun: '#3a5080', sunInt: 1.3, amb: '#141828', ambInt: 1.1, head: '#00f0ff' }
      },
      desert: {
        midday:    { sky: '#4298e8', fog: '#d4bda4', density: 0.0012, sun: '#fff4dc', sunInt: 2.6, amb: '#6a5240', ambInt: 1.5, head: '#ffffff' },
        afternoon: { sky: '#4298e8', fog: '#d4bda4', density: 0.0012, sun: '#fff4dc', sunInt: 2.6, amb: '#6a5240', ambInt: 1.5, head: '#ffffff' },
        morning:   { sky: '#d88550', fog: '#cf7c45', density: 0.0018, sun: '#ffcc88', sunInt: 2.2, amb: '#422818', ambInt: 1.3, head: '#ffeeaa' },
        sunset:    { sky: '#7a1c38', fog: '#922840', density: 0.0022, sun: '#ff4400', sunInt: 2.0, amb: '#481c24', ambInt: 1.3, head: '#ffdd66' },
        night:     { sky: '#060814', fog: '#0a0e20', density: 0.0026, sun: '#3a4a70', sunInt: 1.2, amb: '#141828', ambInt: 1.0, head: '#ffee88' }
      },
      mountains: {
        midday:    { sky: '#2570b8', fog: '#a0c4e8', density: 0.0011, sun: '#ffffff', sunInt: 2.6, amb: '#485e78', ambInt: 1.5, head: '#ffffff' },
        afternoon: { sky: '#2570b8', fog: '#a0c4e8', density: 0.0011, sun: '#ffffff', sunInt: 2.6, amb: '#485e78', ambInt: 1.5, head: '#ffffff' },
        morning:   { sky: '#90b4d0', fog: '#a8c6dd', density: 0.0018, sun: '#ffe8c0', sunInt: 2.0, amb: '#223040', ambInt: 1.3, head: '#ffffcc' },
        sunset:    { sky: '#44184c', fog: '#682460', density: 0.0022, sun: '#ff6640', sunInt: 2.0, amb: '#301834', ambInt: 1.3, head: '#ffeeaa' },
        night:     { sky: '#040612', fog: '#070a1c', density: 0.0028, sun: '#283658', sunInt: 1.2, amb: '#0e1424', ambInt: 1.0, head: '#00f0ff' }
      },
      neon: {
        midday:    { sky: '#0c0524', fog: '#1a0840', density: 0.0018, sun: '#00e5ff', sunInt: 2.2, amb: '#280c4e', ambInt: 1.5, head: '#ffffff' },
        afternoon: { sky: '#0c0524', fog: '#1a0840', density: 0.0018, sun: '#00e5ff', sunInt: 2.2, amb: '#280c4e', ambInt: 1.5, head: '#ffffff' },
        morning:   { sky: '#180830', fog: '#2a1045', density: 0.0022, sun: '#ff66aa', sunInt: 1.8, amb: '#220838', ambInt: 1.3, head: '#00f0ff' },
        sunset:    { sky: '#080016', fog: '#0e021e', density: 0.0024, sun: '#ff3388', sunInt: 2.0, amb: '#320854', ambInt: 1.4, head: '#00f0ff' },
        night:     { sky: '#02000a', fog: '#050014', density: 0.0030, sun: '#8800ff', sunInt: 1.3, amb: '#18002a', ambInt: 1.1, head: '#00f0ff' }
      }
    };

    const cfg = PALETTES[mapId]?.[timeOfDay] || PALETTES[mapId]?.midday || PALETTES.city.midday;

    // Apply scene background & fog
    this.scene.background = new THREE.Color(cfg.sky);
    this.scene.fog = new THREE.FogExp2(cfg.fog, cfg.density);

    // Apply lights
    if (this.ambientLight) {
      this.ambientLight.color.set(cfg.amb);
      this.ambientLight.intensity = cfg.ambInt;
    }
    if (this.sunLight) {
      this.sunLight.color.set(cfg.sun);
      this.sunLight.intensity = cfg.sunInt;
    }
    if (this.headLight) {
      this.headLight.color.set(cfg.head);
    }

    // Rebuild road chunks and backdrop if map changed, forced, or not yet built
    if (mapChanged || forceRebuild || this.chunks.length === 0) {
      this.rebuildRoadPool(mapId);
      this.buildHorizonBackdrop(mapId, timeOfDay);
    }
  }

  // --- Endless Highway Modular Chunks ---
  rebuildRoadPool(mapId) {
    // Remove existing chunks
    for (let i = 0; i < this.chunks.length; i++) {
      this.scene.remove(this.chunks[i]);
    }
    this.chunks = [];
    this.currentChunkIndex = 0;

    for (let i = 0; i < this.numChunks; i++) {
      const chunk = this.createRoadChunk(mapId);
      chunk.position.z = i * this.chunkLength;
      this.scene.add(chunk);
      this.chunks.push(chunk);

      // Attach map-specific roadside scenery to this chunk
      this.populateChunkScenery(chunk, i, mapId);
    }
  }

  createRoadChunk(mapId) {
    const chunk = new THREE.Group();

    // Determine Materials per Biome
    let roadMat = this.models.materials.asphalt;
    let dashMat = this.models.materials.laneDashWhite;
    let rumbleLMat = this.models.materials.rumblePink;
    let rumbleRMat = this.models.materials.rumbleCyan;
    let railMat = this.models.materials.guardrailSteel;
    let shoulderMat = this.models.materials.shoulderGround;

    if (mapId === 'desert') {
      roadMat = this.models.materials.desertAsphalt;
      dashMat = this.models.materials.laneDashYellow;
      rumbleLMat = this.models.materials.rumbleYellow;
      rumbleRMat = this.models.materials.rumbleYellow;
      railMat = this.models.materials.guardrailSteel;
      shoulderMat = this.models.materials.shoulderDesert;
    } else if (mapId === 'mountains') {
      roadMat = this.models.materials.mountainAsphalt;
      dashMat = this.models.materials.laneDashYellow;
      rumbleLMat = this.models.materials.rumbleRedWhite;
      rumbleRMat = this.models.materials.rumbleRedWhite;
      railMat = this.models.materials.guardrailSteel;
      shoulderMat = this.models.materials.shoulderMountain;
    } else if (mapId === 'neon') {
      roadMat = this.models.materials.neonGridAsphalt;
      dashMat = this.models.materials.laneDashCyan;
      rumbleLMat = this.models.materials.rumblePink;
      rumbleRMat = this.models.materials.rumbleCyan;
      railMat = this.models.materials.guardrail;
      shoulderMat = this.models.materials.shoulderNeonGrid;
    }

    if (mapId === 'city') {
      // 1. Modern Asphalt Road Surface
      const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.chunkLength, 1, 1);
      const roadMesh = new THREE.Mesh(roadGeo, this.models.materials.asphaltCityDay || this.models.materials.asphalt);
      roadMesh.rotation.x = -Math.PI / 2;
      roadMesh.receiveShadow = true;
      chunk.add(roadMesh);

      // 2. Dashed Lane Markings (White)
      const numDashes = 5;
      const dashLength = 4.0;
      const dashSpacing = this.chunkLength / numDashes;
      const dashGeo = new THREE.PlaneGeometry(0.24, dashLength);

      for (let d = 0; d < numDashes; d++) {
        const dashZ = -this.chunkLength / 2 + d * dashSpacing + dashLength / 2;

        const dashL = new THREE.Mesh(dashGeo, this.models.materials.laneDashWhite);
        dashL.rotation.x = -Math.PI / 2;
        dashL.position.set(-2.3, 0.015, dashZ);
        chunk.add(dashL);

        const dashR = new THREE.Mesh(dashGeo, this.models.materials.laneDashWhite);
        dashR.rotation.x = -Math.PI / 2;
        dashR.position.set(2.3, 0.015, dashZ);
        chunk.add(dashR);
      }

      // 3. White Solid Fog / Boundary Lines separating travel lanes from parking/curb
      const fogLineGeo = new THREE.PlaneGeometry(0.18, this.chunkLength);
      const fogLineL = new THREE.Mesh(fogLineGeo, this.models.materials.laneDashWhite);
      fogLineL.rotation.x = -Math.PI / 2;
      fogLineL.position.set(6.6, 0.015, 0);
      chunk.add(fogLineL);

      const fogLineR = new THREE.Mesh(fogLineGeo, this.models.materials.laneDashWhite);
      fogLineR.rotation.x = -Math.PI / 2;
      fogLineR.position.set(-6.6, 0.015, 0);
      chunk.add(fogLineR);

      // 4. Concrete Curbs (Left & Right at X = ±8.0)
      const curbW = 0.45;
      const curbH = 0.22;
      const curbGeo = new THREE.BoxGeometry(curbW, curbH, this.chunkLength);

      const curbL = new THREE.Mesh(curbGeo, this.models.materials.curbMat);
      curbL.position.set(this.roadWidth / 2 + curbW / 2, curbH / 2, 0);
      chunk.add(curbL);

      const curbR = new THREE.Mesh(curbGeo, this.models.materials.curbMat);
      curbR.position.set(-this.roadWidth / 2 - curbW / 2, curbH / 2, 0);
      chunk.add(curbR);

      // 5. Wide Concrete Pedestrian Sidewalks (Left & Right)
      const walkW = 8.5;
      const walkH = 0.16;
      const walkGeo = new THREE.BoxGeometry(walkW, walkH, this.chunkLength);

      const walkL = new THREE.Mesh(walkGeo, this.models.materials.sidewalkMat);
      walkL.position.set(this.roadWidth / 2 + curbW + walkW / 2, walkH / 2, 0);
      walkL.receiveShadow = true;
      chunk.add(walkL);

      const walkR = new THREE.Mesh(walkGeo, this.models.materials.sidewalkMat);
      walkR.position.set(-this.roadWidth / 2 - curbW - walkW / 2, walkH / 2, 0);
      walkR.receiveShadow = true;
      chunk.add(walkR);

      // 6. City Ground Base Terrain extending outward
      const terrainGeo = new THREE.PlaneGeometry(160, this.chunkLength, 1, 1);
      const terrainMesh = new THREE.Mesh(terrainGeo, this.models.materials.asphalt);
      terrainMesh.rotation.x = -Math.PI / 2;
      terrainMesh.position.set(0, -0.05, 0);
      terrainMesh.receiveShadow = true;
      chunk.add(terrainMesh);

      return chunk;
    }

    // 1. Asphalt Road Surface (Desert, Mountains, Neon)
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.chunkLength, 1, 1);
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.receiveShadow = true;
    chunk.add(roadMesh);

    // 2. Dashed Lane Lines (Separating 3 lanes at X = -2.3 and +2.3)
    const numDashes = 5;
    const dashLength = 4.0;
    const dashSpacing = this.chunkLength / numDashes;
    const dashGeo = new THREE.PlaneGeometry(0.24, dashLength);

    for (let d = 0; d < numDashes; d++) {
      const dashZ = -this.chunkLength / 2 + d * dashSpacing + dashLength / 2;

      const dashL = new THREE.Mesh(dashGeo, dashMat);
      dashL.rotation.x = -Math.PI / 2;
      dashL.position.set(-2.3, 0.015, dashZ);
      chunk.add(dashL);

      const dashR = new THREE.Mesh(dashGeo, dashMat);
      dashR.rotation.x = -Math.PI / 2;
      dashR.position.set(2.3, 0.015, dashZ);
      chunk.add(dashR);
    }

    // 3. Rumble Strips
    const rumbleW = 0.9;
    const rumbleGeo = new THREE.BoxGeometry(rumbleW, 0.12, this.chunkLength);

    const rumbleL = new THREE.Mesh(rumbleGeo, rumbleLMat);
    rumbleL.position.set(this.roadWidth / 2 + rumbleW / 2, 0.06, 0);
    chunk.add(rumbleL);

    const rumbleR = new THREE.Mesh(rumbleGeo, rumbleRMat);
    rumbleR.position.set(-this.roadWidth / 2 - rumbleW / 2, 0.06, 0);
    chunk.add(rumbleR);

    // 4. Guardrails
    const railGeo = new THREE.BoxGeometry(0.2, 0.65, this.chunkLength);
    const railL = new THREE.Mesh(railGeo, railMat);
    railL.position.set(this.roadWidth / 2 + rumbleW + 0.2, 0.35, 0);
    chunk.add(railL);

    const railR = new THREE.Mesh(railGeo, railMat);
    railR.position.set(-this.roadWidth / 2 - rumbleW - 0.2, 0.35, 0);
    chunk.add(railR);

    // 5. Off-Road Shoulder Ground Terrain
    const terrainGeo = new THREE.PlaneGeometry(160, this.chunkLength, 1, 1);
    const terrainMesh = new THREE.Mesh(terrainGeo, shoulderMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.set(0, -0.05, 0);
    terrainMesh.receiveShadow = true;
    chunk.add(terrainMesh);

    return chunk;
  }

  populateChunkScenery(chunk, chunkIdx, mapId) {
    const shoulderOffset = this.roadWidth / 2 + 3.2;

    if (mapId === 'desert') {
      // Saguaro Cacti on alternating sides
      if (chunkIdx % 2 === 0) {
        const cactusL = this.models.createCactusModel();
        cactusL.position.set(shoulderOffset + 2.5, 0, (chunkIdx % 4) * 5);
        chunk.add(cactusL);
      } else {
        const cactusR = this.models.createCactusModel();
        cactusR.position.set(-shoulderOffset - 2.5, 0, (chunkIdx % 3) * 6);
        chunk.add(cactusR);
      }

      // Desert Roadside Rocks
      if (chunkIdx % 3 === 1) {
        const rock = this.models.createDesertRockModel();
        rock.position.set(chunkIdx % 2 === 0 ? shoulderOffset + 5.5 : -shoulderOffset - 5.5, 0, 10);
        chunk.add(rock);
      }

      // Desert Sandstone Mesas on distant shoulders
      if (chunkIdx % 6 === 2) {
        const mesa = this.models.createDesertMesaModel();
        mesa.position.set(chunkIdx % 2 === 0 ? shoulderOffset + 24 : -shoulderOffset - 24, 0, 0);
        chunk.add(mesa);
      }

    } else if (mapId === 'mountains') {
      // Pine Trees on shoulders
      if (chunkIdx % 2 === 0) {
        const pineL = this.models.createPineTreeModel();
        pineL.position.set(shoulderOffset + 3.5, 0, 5);
        chunk.add(pineL);
      }
      if (chunkIdx % 2 === 1) {
        const pineR = this.models.createPineTreeModel();
        pineR.position.set(-shoulderOffset - 3.5, 0, -5);
        chunk.add(pineR);
      }

      // Mountain Boulders
      if (chunkIdx % 3 === 2) {
        const rock = this.models.createMountainRockModel();
        rock.position.set(chunkIdx % 2 === 0 ? shoulderOffset + 2.0 : -shoulderOffset - 2.0, 0, 0);
        chunk.add(rock);
      }

      // Mountain Cliffs on shoulders
      if (chunkIdx % 5 === 1) {
        const peak = this.models.createMountainPeakModel();
        peak.position.set(chunkIdx % 2 === 0 ? shoulderOffset + 22 : -shoulderOffset - 22, 0, 0);
        chunk.add(peak);
      }

    } else if (mapId === 'city') {
      const curbEdge = this.roadWidth / 2; // 8.0
      const buildingX = curbEdge + 9.5;   // strictly outside road (>17.5m from road center)
      const parkedCarX = curbEdge - 0.7;  // 7.3 (parallel parked curbside strip)

      // 1. Streetlights on Sidewalk every 2 chunks
      if (chunkIdx % 2 === 0) {
        const lightL = this.models.createCityStreetlightModernModel();
        lightL.position.set(curbEdge + 1.2, 0.16, 0);
        chunk.add(lightL);

        const lightR = this.models.createCityStreetlightModernModel();
        lightR.position.set(-curbEdge - 1.2, 0.16, 0);
        lightR.rotation.y = Math.PI;
        chunk.add(lightR);
      }

      // 2. Green Shade Trees in Sidewalk Grates
      if (chunkIdx % 2 === 1) {
        const treeL = this.models.createCityStreetTreeModel();
        treeL.position.set(curbEdge + 1.8, 0.16, -8);
        chunk.add(treeL);

        const treeR = this.models.createCityStreetTreeModel();
        treeR.position.set(-curbEdge - 1.8, 0.16, 8);
        chunk.add(treeR);
      }

      // 3. Parallel Parked Curbside Vehicles (at X = ±7.3, off the 3 travel lanes)
      if (chunkIdx % 3 === 1) {
        const parkedCar = this.models.createCityParkedVehicleModel(chunkIdx);
        const onRight = chunkIdx % 2 === 0;
        parkedCar.position.set(onRight ? parkedCarX : -parkedCarX, 0, (chunkIdx % 4) * 6 - 8);
        if (!onRight) parkedCar.rotation.y = Math.PI;
        chunk.add(parkedCar);
      }

      // 4. Alternating Architecture: Storefronts, Brick Apartments, Glass Office Skyscrapers
      const archType = chunkIdx % 4;
      if (archType === 0) {
        // Commercial Storefront with colorful awning
        const storeL = this.models.createCityStorefrontModel(chunkIdx);
        storeL.position.set(buildingX + 4.0, 0.16, 0);
        storeL.rotation.y = -Math.PI / 2;
        chunk.add(storeL);

        const storeR = this.models.createCityStorefrontModel(chunkIdx + 1);
        storeR.position.set(-buildingX - 4.0, 0.16, 0);
        storeR.rotation.y = Math.PI / 2;
        chunk.add(storeR);
      } else if (archType === 1) {
        // Multi-Story Brick Apartment Building
        const apt = this.models.createCityApartmentModel(chunkIdx);
        const onRight = chunkIdx % 2 === 0;
        apt.position.set(onRight ? buildingX + 6.0 : -buildingX - 6.0, 0.16, 0);
        if (onRight) apt.rotation.y = -Math.PI / 2;
        else apt.rotation.y = Math.PI / 2;
        chunk.add(apt);
      } else if (archType === 2) {
        // Modern Reflective Glass Office Skyscraper
        const tower = this.models.createCityOfficeTowerModel(chunkIdx);
        const onRight = chunkIdx % 2 === 1;
        tower.position.set(onRight ? buildingX + 9.0 : -buildingX - 9.0, 0.16, 0);
        chunk.add(tower);
      } else if (archType === 3) {
        // Cross-Street Intersection with Zebra Crosswalk and Overhead Signal Gantry
        const crosswalk = this.models.createCityCrosswalkIntersectionModel();
        crosswalk.position.set(0, 0, 0);
        chunk.add(crosswalk);
      }

      // 5. Electronic Billboards
      if (chunkIdx % 6 === 5) {
        const tags = ['METRO-CITY', 'CYBER-CORP', 'HYPER-DRIVE', 'NIGHT-PULSE'];
        const tag = tags[Math.floor(chunkIdx / 6) % tags.length];
        const billboard = this.models.createBillboardModel(tag);
        billboard.position.set(chunkIdx % 2 === 0 ? -buildingX - 4.5 : buildingX + 4.5, 0, 5);
        chunk.add(billboard);
      }

    } else { // Neon (Default)
      // Cyber Palm Trees
      if (chunkIdx % 2 === 0) {
        const palmL = this.models.createPalmTreeModel('#ff00aa');
        palmL.position.set(-shoulderOffset - 2.5, 0, 10);
        chunk.add(palmL);

        const palmR = this.models.createPalmTreeModel('#00e5ff');
        palmR.position.set(shoulderOffset + 2.5, 0, -10);
        chunk.add(palmR);
      }

      // Neon Highway Light Towers / Pylons
      if (chunkIdx % 3 === 1) {
        const pylonL = this.models.createPylonModel('#00f0ff');
        pylonL.position.set(-shoulderOffset - 1.2, 0, 0);
        chunk.add(pylonL);

        const pylonR = this.models.createPylonModel('#ff007f');
        pylonR.position.set(shoulderOffset + 1.2, 0, 0);
        chunk.add(pylonR);
      }

      // Holographic Roadside Billboards
      if (chunkIdx % 5 === 2) {
        const tags = ['NITRO-X', 'NEON SPEED', 'CYBER-PULSE', 'RETRO-80'];
        const tag = tags[Math.floor(chunkIdx / 5) % tags.length];
        const billboard = this.models.createBillboardModel(tag);
        billboard.position.set(chunkIdx % 2 === 0 ? -shoulderOffset - 4.5 : shoulderOffset + 4.5, 0, 5);
        chunk.add(billboard);
      }
    }

    // Overhead Digital Highway Sign Gantry (spans all 3 lanes across all biomes)
    if (chunkIdx % 8 === 4) {
      const gantryTexts = {
        city: ['METROPOLIS 101', 'DOWNTOWN EXPRESS', 'CYBER TUNNEL', 'AVENUE MATRIX'],
        desert: ['MOJAVE ROUTE 66', 'DUST CANYON', 'SOLAR PASS', 'SUN DEVIL 99'],
        mountains: ['ALPINE RIDGE', 'FROST SUMMIT', 'EAGLE CREST', 'GLACIER PASS'],
        neon: ['NEON HIGHWAY', 'TURBO SPEED', 'SYNTHWAVE 84', 'OVERDRIVE']
      };
      const list = gantryTexts[mapId] || gantryTexts.neon;
      const text = list[Math.floor(chunkIdx / 8) % list.length];
      const gantry = this.models.createGantryModel(text);
      gantry.position.set(0, 0, 0);
      chunk.add(gantry);
    }
  }

  // --- Horizon Backdrop Engine (Sun & Parallax Landscapes) ---
  buildHorizonBackdrop(mapId, timeOfDay) {
    if (this.horizonGroup) {
      this.scene.remove(this.horizonGroup);
    }
    this.horizonGroup = new THREE.Group();
    this.scene.add(this.horizonGroup);

    if (mapId === 'neon') {
      // Retro Synthwave Sun + Cyber Skyline
      this.horizonSun = this.models.createRetroSunModel();
      this.horizonSun.position.set(0, 32, 450);
      this.horizonGroup.add(this.horizonSun);

      const cityGroup = new THREE.Group();
      cityGroup.position.set(0, 0, 420);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: '#090018',
        roughness: 0.6,
        map: this.models.textures.cityWindows
      });

      const bCount = 38;
      const spreadWidth = 320;
      for (let i = 0; i < bCount; i++) {
        const bx = (i / bCount - 0.5) * spreadWidth + (Math.sin(i * 3.7) * 4);
        const bW = 6 + Math.abs(Math.sin(i * 1.5)) * 6;
        const bH = 18 + Math.abs(Math.cos(i * 2.3)) * 48;
        const bD = 8 + Math.sin(i) * 5;

        const bGeo = new THREE.BoxGeometry(bW, bH, bD);
        const bMesh = new THREE.Mesh(bGeo, buildingMat);
        bMesh.position.set(bx, bH / 2, Math.sin(i * 1.1) * 25);
        cityGroup.add(bMesh);

        if (i % 2 === 0) {
          const antGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.0, 4);
          const antMat = new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? '#00f0ff' : '#ff00aa' });
          const antMesh = new THREE.Mesh(antGeo, antMat);
          antMesh.position.set(bx, bH + 3.0, Math.sin(i * 1.1) * 25);
          cityGroup.add(antMesh);
        }
      }
      this.horizonGroup.add(cityGroup);

    } else if (mapId === 'city') {
      const isDaytime = timeOfDay === 'midday' || timeOfDay === 'afternoon' || timeOfDay === 'morning';

      // Natural Daytime Sun Orb in sky
      if (isDaytime) {
        const sunOrb = new THREE.Mesh(
          new THREE.SphereGeometry(22, 16, 16),
          new THREE.MeshBasicMaterial({ color: '#fffde8' })
        );
        sunOrb.position.set(65, 115, 460);
        this.horizonGroup.add(sunOrb);

        // Soft sun corona glow ring
        const corona = new THREE.Mesh(
          new THREE.RingGeometry(22, 45, 24),
          new THREE.MeshBasicMaterial({ color: '#fff5c0', transparent: true, opacity: 0.25, side: THREE.DoubleSide })
        );
        corona.position.set(65, 115, 458);
        this.horizonGroup.add(corona);
      }

      // Dense City Horizon Skyline
      const cityGroup = new THREE.Group();
      cityGroup.position.set(0, 0, 420);
      const buildingMat = new THREE.MeshStandardMaterial({
        color: isDaytime ? '#2b4462' : '#060a14',
        roughness: isDaytime ? 0.4 : 0.6,
        metalness: isDaytime ? 0.6 : 0.3,
        map: isDaytime ? this.models.textures.cityWindowsDay : this.models.textures.cityWindows
      });

      const bCount = 52;
      const spreadWidth = 380;
      for (let i = 0; i < bCount; i++) {
        const bx = (i / bCount - 0.5) * spreadWidth + (Math.sin(i * 4.1) * 5);
        const bW = 8 + Math.abs(Math.sin(i * 1.8)) * 9;
        const bH = 26 + Math.abs(Math.cos(i * 2.1)) * 75;
        const bD = 10 + Math.sin(i) * 6;

        const bGeo = new THREE.BoxGeometry(bW, bH, bD);
        const bMesh = new THREE.Mesh(bGeo, buildingMat);
        bMesh.position.set(bx, bH / 2, Math.sin(i * 1.3) * 30);
        cityGroup.add(bMesh);

        // Communications masts & beacons
        if (i % 3 === 0) {
          const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 10, 4), this.models.materials.chrome);
          spire.position.set(bx, bH + 5, Math.sin(i * 1.3) * 30);
          cityGroup.add(spire);

          const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 6), this.models.materials.neonRed);
          beacon.position.set(bx, bH + 10, Math.sin(i * 1.3) * 30);
          cityGroup.add(beacon);
        }
      }
      this.horizonGroup.add(cityGroup);

    } else if (mapId === 'desert') {
      // Expansive Canyon Mesas Horizon
      const mesaMat = new THREE.MeshStandardMaterial({ color: '#7a3c1c', roughness: 0.95 });
      const desertGroup = new THREE.Group();
      desertGroup.position.set(0, 0, 430);

      const mCount = 14;
      for (let i = 0; i < mCount; i++) {
        const mx = (i / mCount - 0.5) * 380 + Math.sin(i * 2.5) * 12;
        const mW = 35 + Math.abs(Math.sin(i * 1.7)) * 25;
        const mH = 20 + Math.abs(Math.cos(i * 2.1)) * 35;
        const mD = 25 + Math.sin(i) * 15;

        const mGeo = new THREE.BoxGeometry(mW, mH, mD);
        const mMesh = new THREE.Mesh(mGeo, mesaMat);
        mMesh.position.set(mx, mH / 2, Math.sin(i * 1.2) * 40);
        desertGroup.add(mMesh);
      }
      this.horizonGroup.add(desertGroup);

    } else if (mapId === 'mountains') {
      // Jagged Alpine Range Horizon
      const mtnGroup = new THREE.Group();
      mtnGroup.position.set(0, 0, 430);

      const rockMat = new THREE.MeshStandardMaterial({ color: '#1e2832', roughness: 0.9 });
      const snowMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6 });

      const pCount = 22;
      for (let i = 0; i < pCount; i++) {
        const px = (i / pCount - 0.5) * 360 + Math.sin(i * 3.1) * 8;
        const pR = 18 + Math.abs(Math.sin(i * 1.5)) * 14;
        const pH = 35 + Math.abs(Math.cos(i * 2.0)) * 55;

        const peakMesh = new THREE.Mesh(new THREE.ConeGeometry(pR, pH, 5), rockMat);
        peakMesh.position.set(px, pH / 2, Math.sin(i * 1.4) * 35);
        mtnGroup.add(peakMesh);

        const snowMesh = new THREE.Mesh(new THREE.ConeGeometry(pR * 0.55, pH * 0.4, 5), snowMat);
        snowMesh.position.set(px, pH * 0.8, Math.sin(i * 1.4) * 35);
        mtnGroup.add(snowMesh);
      }
      this.horizonGroup.add(mtnGroup);
    }
  }

  // --- Endless Recycling Update ---
  update(playerZ, playerX, speedRatio, dt) {
    const recycleThreshold = playerZ - this.chunkLength * 2.5;

    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      if (chunk.position.z < recycleThreshold) {
        let maxZ = -Infinity;
        for (let j = 0; j < this.chunks.length; j++) {
          if (this.chunks[j].position.z > maxZ) maxZ = this.chunks[j].position.z;
        }
        chunk.position.z = maxZ + this.chunkLength;
        this.currentChunkIndex++;
      }
    }

    // Move Sun light with player along Z axis
    if (this.sunLight) {
      this.sunLight.position.z = playerZ + 90;
      this.sunLight.target.position.set(0, 0, playerZ + 20);
      this.sunLight.target.updateMatrixWorld();
    }

    // Parallax Horizon Backdrop
    if (this.horizonGroup) {
      this.horizonGroup.position.z = playerZ + 420;
      this.horizonGroup.position.x = playerX * 10.0;
    }
  }

  // --- Quality Settings Preset Adjustment ---
  setQuality(preset) {
    this.quality = preset;
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    if (preset === 'high') {
      this.shadowsEnabled = true;
      this.renderer.shadowMap.enabled = true;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
      this.numChunks = 16;
      if (this.sunLight) this.sunLight.castShadow = true;
    } else if (preset === 'medium') {
      this.shadowsEnabled = !isMobile;
      this.renderer.shadowMap.enabled = this.shadowsEnabled;
      this.renderer.setPixelRatio(1.0);
      this.numChunks = 14;
      if (this.sunLight) this.sunLight.castShadow = this.shadowsEnabled;
    } else if (preset === 'low') {
      this.shadowsEnabled = false;
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1.0);
      this.numChunks = 11;
      if (this.sunLight) this.sunLight.castShadow = false;
    }
  }

  onResize(width, height) {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

if (typeof window !== 'undefined') window.World3D = World3D;
if (typeof module !== 'undefined') module.exports = World3D;
