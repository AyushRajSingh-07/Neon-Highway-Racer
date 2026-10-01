/**
 * Neon Highway - Core 3D Game Coordinator
 * Orchestrates WebGL rendering loop, multi-vehicle 3D turntable lobby,
 * responsive vehicle physics (bikes, cars, hoverboard), multi-environment highway,
 * traffic scaling, audio engine sync, and pause/settings workflows.
 */

class NeonHighwayGame3D {
  constructor() {
    this.container = document.getElementById('game-container');

    // Subsystems
    this.models = new ModelFactory();
    this.world = new World3D(this.models);
    this.traffic = new TrafficEngine3D(this.world, this.models);
    this.audio = window.neonAudio;

    // Game States
    this.STATE_LOBBY = 0;
    this.STATE_PLAYING = 1;
    this.STATE_PAUSED = 2;
    this.STATE_GAMEOVER = 3;
    this.state = this.STATE_LOBBY;

    // Selections & LocalStorage Persistence
    this.selectedVehicleId = localStorage.getItem('neon_vehicle') || 'cyber_pulse';
    this.selectedMapId = localStorage.getItem('neon_map') || 'city';
    this.selectedTimeOfDay = localStorage.getItem('neon_time') || 'midday';
    this.selectedDensity = localStorage.getItem('neon_density') || 'normal';
    this.username = localStorage.getItem('neon_username') || 'CYBER_RIDER';

    // Settings
    this.masterVolume = parseFloat(localStorage.getItem('neon_master_volume') || '0.8');
    this.musicVolume = parseFloat(localStorage.getItem('neon_music_volume') || '0.7');
    this.sfxVolume = parseFloat(localStorage.getItem('neon_sfx_volume') || '0.85');
    this.steeringSensitivity = parseFloat(localStorage.getItem('neon_sensitivity') || '1.0');
    this.cameraShakeEnabled = localStorage.getItem('neon_shake') !== 'false';

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    this.quality = localStorage.getItem('neon_quality') || (isMobile ? 'medium' : 'high');

    // Player State & Physics
    this.playerX = 0;
    this.playerZ = 0;
    this.speed = 160;
    this.cruisingSpeed = 160;
    this.minSpeed = 90;
    this.maxSpeed = 235;
    this.boostAccel = 135;
    this.brakeDecel = 170;
    this.autoCruiseAccel = 80;
    this.autoCruiseDecel = 60;
    this.steerSpeed = 16.5;
    this.bankFactor = 0.42;
    this.lean = 0;
    this.targetLean = 0;
    this.suspensionBounce = 0;

    // Current Active Vehicle 3D Model
    this.bike = null;
    this.previewVehicle = null;
    this.turntableRenderer = null;
    this.turntableScene = null;
    this.turntableCamera = null;

    // 3D Turntable Preview Interaction
    this.turntableAngle = 0;
    this.turntableDragging = false;
    this.turntableLastX = 0;

    // Progression & Level System Integration
    this.progression = (typeof window !== 'undefined' && window.neonProgression) ? window.neonProgression : new NeonProgression();

    // Validate ownership of selected vehicle; default to 'cyber_pulse' if locked
    if (!this.progression.isOwned(this.selectedVehicleId)) {
      this.selectedVehicleId = 'cyber_pulse';
      localStorage.setItem('neon_vehicle', 'cyber_pulse');
    }
    this.viewedVehicleId = this.selectedVehicleId;
    this.pendingPurchaseVehicleId = null;

    this.levelEngine = new LevelEngine(this.world, this.models, this.audio, this.progression);
    this.gameMode = localStorage.getItem('neon_game_mode') || 'levels';
    this.selectedLevelIndex = parseInt(localStorage.getItem('neon_selected_level') || '0', 10);
    this.currentTab = 'play';

    // Crash sequence & shake
    this.screenShake = 0;
    this.crashTimer = 0;

    // Scoring & Match Stats
    this.score = 0;
    this.distance = 0;
    this.highScore = parseInt(localStorage.getItem('neon_highway_highscore') || '0', 10);
    this.nearMissCount = 0;
    this.combo = 0;
    this.comboTimer = 0;

    // Particle Systems
    this.exhaustParticles = [];
    this.crashDebris = [];

    // Inputs
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    // Touch Drag / Swipe Steering
    this.touchSteerActive = false;
    this.touchStartX = 0;

    // Timing
    this.lastTime = performance.now();

    // DOM UI Elements
    this.ui = {
      hud: document.getElementById('hud'),
      touchControls: document.getElementById('touch-controls'),
      score: document.getElementById('hudScore'),
      speed: document.getElementById('hudSpeed'),
      best: document.getElementById('hudBest'),
      combo: document.getElementById('hudCombo'),
      hudUsername: document.getElementById('hudUsername'),
      hudLevelBar: document.getElementById('hudLevelBar'),
      hudLevelTimer: document.getElementById('hudLevelTimer'),
      hudLevelDist: document.getElementById('hudLevelDist'),
      hudLevelOvertakes: document.getElementById('hudLevelOvertakes'),
      hudLevelCoins: document.getElementById('hudLevelCoins'),
      checkpointToast: document.getElementById('checkpointToast'),
      lobbyScreen: document.getElementById('lobbyScreen'),
      turntableCanvas: document.getElementById('turntableCanvas'),
      lobbyCurrency: document.getElementById('lobbyCurrency'),
      lobbyUsername: document.getElementById('lobbyUsername'),
      lobbyHighScore: document.getElementById('lobbyHighScore'),
      lobbyVehicleName: document.getElementById('lobbyVehicleName'),
      lobbyVehicleCategory: document.getElementById('lobbyVehicleCategory'),
      lobbyOwnershipBadge: document.getElementById('lobbyOwnershipBadge'),
      lobbyVehicleDesc: document.getElementById('lobbyVehicleDesc'),
      statSpeedBar: document.getElementById('statSpeedBar'),
      statSpeedVal: document.getElementById('statSpeedVal'),
      statAccelBar: document.getElementById('statAccelBar'),
      statAccelVal: document.getElementById('statAccelVal'),
      statHandlingBar: document.getElementById('statHandlingBar'),
      statHandlingVal: document.getElementById('statHandlingVal'),
      prevVehicleBtn: document.getElementById('prevVehicleBtn'),
      nextVehicleBtn: document.getElementById('nextVehicleBtn'),
      modeLevelsBtn: document.getElementById('modeLevelsBtn'),
      modeEndlessBtn: document.getElementById('modeEndlessBtn'),
      levelsSelectionView: document.getElementById('levelsSelectionView'),
      endlessOptionsView: document.getElementById('endlessOptionsView'),
      levelsGrid: document.getElementById('levelsGrid'),
      garagePillsContainer: document.getElementById('garagePillsContainer'),
      paintChipsContainer: document.getElementById('paintChipsContainer'),
      shopCatalogGrid: document.getElementById('shopCatalogGrid'),
      upgradesGrid: document.getElementById('upgradesGrid'),
      upgradeVehicleName: document.getElementById('upgradeVehicleName'),
      mapSelector: document.getElementById('mapSelector'),
      timeSelector: document.getElementById('timeSelector'),
      densitySelector: document.getElementById('densitySelector'),
      lobbyStartBtn: document.getElementById('lobbyStartBtn'),
      lobbySettingsBtn: document.getElementById('lobbySettingsBtn'),
      pauseScreen: document.getElementById('pauseScreen'),
      resumeBtn: document.getElementById('resumeBtn'),
      restartBtn: document.getElementById('restartBtn'),
      pauseSettingsBtn: document.getElementById('pauseSettingsBtn'),
      returnLobbyBtn: document.getElementById('returnLobbyBtn'),
      confirmLobbyModal: document.getElementById('confirmLobbyModal'),
      confirmLobbyYes: document.getElementById('confirmLobbyYes'),
      confirmLobbyNo: document.getElementById('confirmLobbyNo'),
      settingsModal: document.getElementById('settingsModal'),
      closeSettingsBtn: document.getElementById('closeSettingsBtn'),
      resetSettingsBtn: document.getElementById('resetSettingsBtn'),
      settingMasterVolume: document.getElementById('settingMasterVolume'),
      settingMusicVolume: document.getElementById('settingMusicVolume'),
      settingSfxVolume: document.getElementById('settingSfxVolume'),
      valMasterVolume: document.getElementById('valMasterVolume'),
      valMusicVolume: document.getElementById('valMusicVolume'),
      valSfxVolume: document.getElementById('valSfxVolume'),
      settingSensitivity: document.getElementById('settingSensitivity'),
      valSensitivity: document.getElementById('valSensitivity'),
      settingShake: document.getElementById('settingShake'),
      settingQuality: document.getElementById('settingQuality'),
      gameOverScreen: document.getElementById('gameOverScreen'),
      finalScore: document.getElementById('finalScore'),
      finalDistance: document.getElementById('finalDistance'),
      finalNearMiss: document.getElementById('finalNearMiss'),
      finalBest: document.getElementById('finalBest'),
      newBestBadge: document.getElementById('newBestBadge'),
      retryBtn: document.getElementById('retryBtn'),
      gameOverLobbyBtn: document.getElementById('gameOverLobbyBtn'),
      muteBtn: document.getElementById('muteBtn'),
      hudSettingsBtn: document.getElementById('hudSettingsBtn'),
      hudPauseBtn: document.getElementById('hudPauseBtn'),
      levelCompleteModal: document.getElementById('levelCompleteModal'),
      completeLevelTitle: document.getElementById('completeLevelTitle'),
      rewardBase: document.getElementById('rewardBase'),
      rewardCoins: document.getElementById('rewardCoins'),
      rewardTime: document.getElementById('rewardTime'),
      rewardTotal: document.getElementById('rewardTotal'),
      modalCurrencyBalance: document.getElementById('modalCurrencyBalance'),
      levelNextBtn: document.getElementById('levelNextBtn'),
      levelReplayBtn: document.getElementById('levelReplayBtn'),
      levelLobbyBtn: document.getElementById('levelLobbyBtn'),
      levelFailedModal: document.getElementById('levelFailedModal'),
      failedReasonText: document.getElementById('failedReasonText'),
      failDistance: document.getElementById('failDistance'),
      failCoins: document.getElementById('failCoins'),
      failOvertakes: document.getElementById('failOvertakes'),
      failTime: document.getElementById('failTime'),
      failRetryBtn: document.getElementById('failRetryBtn'),
      failLobbyBtn: document.getElementById('failLobbyBtn'),
      turntableBuyBtn: document.getElementById('turntableBuyBtn'),
      purchaseModal: document.getElementById('purchaseModal'),
      purchaseVehicleType: document.getElementById('purchaseVehicleType'),
      purchaseVehicleName: document.getElementById('purchaseVehicleName'),
      purchaseVehicleDesc: document.getElementById('purchaseVehicleDesc'),
      purchasePriceVal: document.getElementById('purchasePriceVal'),
      purchaseBalanceVal: document.getElementById('purchaseBalanceVal'),
      purchaseErrorMsg: document.getElementById('purchaseErrorMsg'),
      confirmPurchaseBtn: document.getElementById('confirmPurchaseBtn'),
      cancelPurchaseBtn: document.getElementById('cancelPurchaseBtn'),
      lobbyFullscreenBtn: document.getElementById('lobbyFullscreenBtn'),
      hudFullscreenBtn: document.getElementById('hudFullscreenBtn'),
      portraitOrientationOverlay: document.getElementById('portraitOrientationOverlay'),
      requestRotateFullscreenBtn: document.getElementById('requestRotateFullscreenBtn'),
      dismissRotateOverlayBtn: document.getElementById('dismissRotateOverlayBtn'),
      toastNotification: document.getElementById('toastNotification')
    };

    this.portraitDismissed = false;

    this.init();
  }

  init() {
    // 1. Initialize 3D World
    this.world.init(this.container);
    this.world.setQuality(this.quality);
    this.world.setEnvironment(this.selectedMapId, this.selectedTimeOfDay);
    this.traffic.setDensity(this.selectedDensity);

    // 2. Initialize 3D Turntable Preview
    this.initTurntable();

    // 3. Instantiate Player 3D Vehicle Model
    this.setVehicle(this.selectedVehicleId);

    // 3. Audio Configuration
    this.applyAudioSettings();

    // 4. Setup Particle Systems
    this.initParticleSystems();

    // 5. Setup UI & Event Listeners
    this.bindInputs();
    this.bindUI();
    this.setGameMode(this.gameMode);
    this.switchTab(this.currentTab);
    this.refreshLobbyDisplay();

    // Window resize & orientation check
    window.addEventListener('resize', () => {
      this.handleResize();
      this.checkOrientationState();
    });

    // Orientation change handling across mobile browsers
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleResize();
        this.checkOrientationState();
      }, 150);
    });

    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', () => {
        setTimeout(() => {
          this.handleResize();
          this.checkOrientationState();
        }, 150);
      });
    }

    // Fullscreen change events across browsers
    const onFsChange = () => this.handleFullscreenChange();
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('mozfullscreenchange', onFsChange);
    document.addEventListener('MSFullscreenChange', onFsChange);

    // Initial orientation check
    this.checkOrientationState();

    // Tab visibility handling (pause safely if running)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === this.STATE_PLAYING) {
        this.pauseGame();
      }
    });

    // Start 60 FPS Animation Loop
    this.animate();

    // Check query params for autostart
    const params = new URLSearchParams(window.location.search);
    if (params.has('vehicle')) {
      this.setVehicle(params.get('vehicle'));
    }
    if (params.has('map')) {
      this.setMap(params.get('map'));
    }
    if (params.has('time')) {
      this.setTimeOfDay(params.get('time'));
    }
    if (params.has('density')) {
      this.setDensity(params.get('density'));
    }
    if (params.has('autostart')) {
      this.startRun();
      if (params.has('gas')) {
        this.keys.up = true;
      }
    }
  }

  // ==========================================================================
  // VEHICLE SETUP & LOBBY TURNTABLE
  // ==========================================================================
  initTurntable() {
    if (!this.ui.turntableCanvas) return;
    const canvas = this.ui.turntableCanvas;
    const width = canvas.clientWidth || 360;
    const height = canvas.clientHeight || 200;

    this.turntableScene = new THREE.Scene();
    this.turntableCamera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);

    this.turntableRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    this.turntableRenderer.setSize(width, height, false);
    this.turntableRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));

    // Studio lights for turntable showroom
    const amb = new THREE.AmbientLight('#ffffff', 1.8);
    this.turntableScene.add(amb);

    const dirCyan = new THREE.DirectionalLight('#00f0ff', 2.4);
    dirCyan.position.set(-3, 4, 3);
    this.turntableScene.add(dirCyan);

    const dirPink = new THREE.DirectionalLight('#ff00aa', 2.0);
    dirPink.position.set(3, 4, -2);
    this.turntableScene.add(dirPink);

    const dirKey = new THREE.DirectionalLight('#ffffff', 2.0);
    dirKey.position.set(0, 5, 4);
    this.turntableScene.add(dirKey);

    // Glowing Circular Pedestal Platform
    const pedestalGeo = new THREE.CylinderGeometry(2.2, 2.3, 0.12, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: '#0e0424',
      roughness: 0.3,
      metalness: 0.8
    });
    this.pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    this.pedestalMesh.position.set(0, -0.06, 0);
    this.turntableScene.add(this.pedestalMesh);

    const ringGeo = new THREE.TorusGeometry(2.25, 0.04, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: '#00f0ff' });
    this.pedestalRing = new THREE.Mesh(ringGeo, ringMat);
    this.pedestalRing.rotation.x = Math.PI / 2;
    this.pedestalRing.position.set(0, 0.01, 0);
    this.turntableScene.add(this.pedestalRing);

    // Preview Vehicle Model
    const customPaint = this.progression.getPaint(this.selectedVehicleId);
    this.previewVehicle = this.models.createVehicleModel(this.selectedVehicleId, customPaint);
    this.previewVehicle.root.position.set(0, 0, 0);
    this.turntableScene.add(this.previewVehicle.root);

    this.updateTurntableFraming();
  }

  updateTurntableFraming() {
    if (!this.turntableCamera || !this.previewVehicle || !this.previewVehicle.root) return;
    const box = new THREE.Box3().setFromObject(this.previewVehicle.root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z, 2.0);
    const aspect = this.turntableCamera.aspect || 1.6;
    const fovRad = (this.turntableCamera.fov * Math.PI) / 180;
    const distV = (maxDim * 0.5) / Math.tan(fovRad * 0.5);
    const distH = (maxDim * 0.5) / (Math.tan(fovRad * 0.5) * aspect);
    const camDist = Math.max(distV, distH) * 1.25 + 0.6;

    const camY = center.y + camDist * 0.22;
    this.turntableCamera.position.set(0, camY, camDist);
    this.turntableCamera.lookAt(0, center.y + 0.08, 0);
    this.turntableCamera.updateProjectionMatrix();

    if (this.pedestalMesh) {
      const pedScale = Math.max(1.0, maxDim / 2.6);
      this.pedestalMesh.scale.set(pedScale, 1.0, pedScale);
      this.pedestalRing.scale.set(pedScale, 1.0, pedScale);
    }
  }

  setVehicle(vehicleId, forceEquip = false) {
    if (!VEHICLE_SPECS[vehicleId]) vehicleId = 'cyber_pulse';
    const isOwned = this.progression.isOwned(vehicleId);

    this.viewedVehicleId = vehicleId;

    // Only equip if owned or explicitly forced
    if (isOwned || forceEquip) {
      this.selectedVehicleId = vehicleId;
      localStorage.setItem('neon_vehicle', vehicleId);

      const customPaint = this.progression.getPaint(vehicleId);
      if (this.bike && this.bike.root) {
        this.world.scene.remove(this.bike.root);
      }
      this.bike = this.models.createVehicleModel(vehicleId, customPaint);
      this.bike.root.position.set(0, 0, 0);
      this.world.scene.add(this.bike.root);
      this.world.headLight.target = this.bike.root;

      // Apply vehicle physics specs + upgrade bonuses
      const spec = VEHICLE_SPECS[vehicleId];
      const upgrades = this.progression.getUpgrades(vehicleId);
      const speedBonus = upgrades.speed * 6; // +6 km/h per speed upgrade
      const accelBonus = upgrades.accel * 4.5;
      const handlingBonus = upgrades.handling * 0.45;

      this.maxSpeed = spec.maxSpeed + speedBonus;
      this.cruisingSpeed = spec.cruiseSpeed + speedBonus * 0.6;
      this.minSpeed = spec.minSpeed;
      this.boostAccel = (spec.accelRate + accelBonus) * 2.8;
      this.brakeDecel = spec.brakeRate * 2.6;
      this.steerSpeed = (spec.turnSpeed + handlingBonus) * 2.6 * this.steeringSensitivity;
      this.bankFactor = spec.bankFactor;
    }

    // Update turntable preview vehicle with viewed vehicle
    const previewPaint = this.progression.getPaint(vehicleId);
    if (this.turntableScene) {
      if (this.previewVehicle && this.previewVehicle.root) {
        this.turntableScene.remove(this.previewVehicle.root);
      }
      this.previewVehicle = this.models.createVehicleModel(vehicleId, previewPaint);
      this.previewVehicle.root.position.set(0, 0, 0);
      this.turntableScene.add(this.previewVehicle.root);
      this.updateTurntableFraming();
    }

    this.refreshLobbyDisplay(vehicleId);
  }

  openPurchaseModal(vehicleId) {
    const spec = VEHICLE_SPECS[vehicleId];
    if (!spec) return;

    this.pendingPurchaseVehicleId = vehicleId;
    if (this.ui.purchaseVehicleType) this.ui.purchaseVehicleType.textContent = spec.category.toUpperCase();
    if (this.ui.purchaseVehicleName) this.ui.purchaseVehicleName.textContent = spec.name;
    if (this.ui.purchaseVehicleDesc) this.ui.purchaseVehicleDesc.textContent = spec.desc;
    if (this.ui.purchasePriceVal) this.ui.purchasePriceVal.textContent = spec.price.toLocaleString();
    if (this.ui.purchaseBalanceVal) this.ui.purchaseBalanceVal.textContent = this.progression.currency.toLocaleString();

    const canAfford = this.progression.canAfford(spec.price);
    if (this.ui.purchaseErrorMsg) {
      this.ui.purchaseErrorMsg.classList.toggle('hidden', canAfford);
    }
    if (this.ui.confirmPurchaseBtn) {
      this.ui.confirmPurchaseBtn.style.opacity = canAfford ? '1.0' : '0.6';
      this.ui.confirmPurchaseBtn.textContent = canAfford ? `BUY (₳ ${spec.price.toLocaleString()}) ⚡` : 'INSUFFICIENT FUNDS';
    }

    if (this.ui.purchaseModal) {
      this.ui.purchaseModal.classList.remove('hidden');
    }
  }

  closePurchaseModal() {
    this.pendingPurchaseVehicleId = null;
    if (this.ui.purchaseModal) {
      this.ui.purchaseModal.classList.add('hidden');
    }
  }

  confirmPurchase() {
    if (!this.pendingPurchaseVehicleId) return;
    const vId = this.pendingPurchaseVehicleId;
    const spec = VEHICLE_SPECS[vId];
    if (!spec) return;

    if (!this.progression.canAfford(spec.price)) {
      if (this.ui.purchaseErrorMsg) this.ui.purchaseErrorMsg.classList.remove('hidden');
      return;
    }

    const bought = this.progression.buyVehicle(vId);
    if (bought) {
      this.audio.playPurchase();
      this.updateLobbyCurrency();
      this.closePurchaseModal();
      this.setVehicle(vId, true); // Now owned, equip it!
      if (this.currentTab === 'shop') this.renderShopCatalog();
      if (this.currentTab === 'garage') {
        this.renderGarageVehicles();
        this.renderPaintChips();
      }
    }
  }

  setMap(mapId) {
    this.selectedMapId = mapId;
    localStorage.setItem('neon_map', mapId);
    this.world.setEnvironment(this.selectedMapId, this.selectedTimeOfDay, true);
    this.refreshLobbyDisplay();
  }

  setTimeOfDay(timeOfDay) {
    this.selectedTimeOfDay = timeOfDay;
    localStorage.setItem('neon_time', timeOfDay);
    this.world.setEnvironment(this.selectedMapId, this.selectedTimeOfDay, true);
    this.refreshLobbyDisplay();
  }

  setDensity(density) {
    this.selectedDensity = density;
    localStorage.setItem('neon_density', density);
    this.traffic.setDensity(density);
    this.refreshLobbyDisplay();
  }

  setGameMode(mode) {
    this.gameMode = mode;
    localStorage.setItem('neon_game_mode', mode);

    if (this.ui.modeLevelsBtn) this.ui.modeLevelsBtn.classList.toggle('active', mode === 'levels');
    if (this.ui.modeEndlessBtn) this.ui.modeEndlessBtn.classList.toggle('active', mode === 'endless');

    if (this.ui.levelsSelectionView) this.ui.levelsSelectionView.classList.toggle('hidden', mode !== 'levels');
    if (this.ui.endlessOptionsView) this.ui.endlessOptionsView.classList.toggle('hidden', mode !== 'endless');

    // Immediately update HUD visibility and clear stale objective values when switching modes
    if (mode === 'endless') {
      if (this.ui.hudLevelBar) this.ui.hudLevelBar.classList.add('hidden');
      if (this.ui.checkpointToast) this.ui.checkpointToast.classList.add('hidden');
      if (this.ui.hudLevelTimer) this.ui.hudLevelTimer.textContent = '';
      if (this.ui.hudLevelDist) this.ui.hudLevelDist.textContent = '';
      if (this.ui.hudLevelOvertakes) this.ui.hudLevelOvertakes.textContent = '';
      if (this.ui.hudLevelCoins) this.ui.hudLevelCoins.textContent = '';
    } else {
      if (this.state === this.STATE_PLAYING && this.ui.hudLevelBar) {
        this.ui.hudLevelBar.classList.remove('hidden');
      }
    }

    const activeViewId = this.viewedVehicleId || this.selectedVehicleId;
    const isOwned = this.progression.isOwned(activeViewId);
    if (this.ui.lobbyStartBtn) {
      if (!isOwned) {
        const spec = VEHICLE_SPECS[activeViewId];
        this.ui.lobbyStartBtn.textContent = `UNLOCK ${spec ? spec.name.toUpperCase() : 'VEHICLE'} ⚡`;
      } else {
        this.ui.lobbyStartBtn.textContent = mode === 'levels'
          ? `START STAGE ${this.selectedLevelIndex + 1} ⚡`
          : 'LAUNCH RUN ⚡';
      }
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    const tabBtns = document.querySelectorAll('.lobby-tab-btn');
    tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));

    const paneMap = {
      play: 'tabContentPlay',
      garage: 'tabContentGarage',
      shop: 'tabContentShop',
      upgrades: 'tabContentUpgrades'
    };

    Object.entries(paneMap).forEach(([t, paneId]) => {
      const pane = document.getElementById(paneId);
      if (pane) pane.classList.toggle('hidden', t !== tab);
    });

    if (tab === 'play') {
      this.setVehicle(this.selectedVehicleId);
      this.setGameMode(this.gameMode);
    } else if (tab === 'garage') {
      this.setVehicle(this.selectedVehicleId);
      this.renderGarageVehicles();
      this.renderPaintChips();
    } else if (tab === 'shop') {
      this.renderShopCatalog();
    } else if (tab === 'upgrades') {
      this.setVehicle(this.selectedVehicleId);
      this.renderUpgradesWorkshop();
    }
  }

  updateLobbyCurrency() {
    const cur = this.progression.currency;
    if (this.ui.lobbyCurrency) this.ui.lobbyCurrency.textContent = cur.toLocaleString();
    if (this.ui.modalCurrencyBalance) this.ui.modalCurrencyBalance.textContent = cur.toLocaleString();
  }

  renderLevelsGrid() {
    if (!this.ui.levelsGrid) return;
    this.ui.levelsGrid.innerHTML = '';
    const unlockedLevel = this.progression.unlockedLevel || 1;

    LEVELS_CONFIG.forEach((lvl, idx) => {
      const card = document.createElement('div');
      const lvlNum = lvl.levelNumber || lvl.level || (idx + 1);
      const isLocked = lvlNum > unlockedLevel;
      const isSelected = idx === this.selectedLevelIndex;
      const rewardVal = lvl.baseReward || lvl.reward || 500;

      card.className = `level-card ${isLocked ? 'locked' : ''} ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="level-card-num">STAGE ${lvlNum} ${isLocked ? '🔒' : (lvlNum < unlockedLevel ? '✓' : '★')}</div>
        <div class="level-card-title">${lvl.name}</div>
        <div class="level-card-meta">${lvl.targetDistance}m • ${lvl.timeLimit}s</div>
        <div class="level-card-reward">₳ ${rewardVal.toLocaleString()}</div>
      `;

      if (!isLocked) {
        card.addEventListener('click', () => {
          this.selectedLevelIndex = idx;
          localStorage.setItem('neon_selected_level', idx);
          this.renderLevelsGrid();
          if (this.ui.lobbyStartBtn) {
            this.ui.lobbyStartBtn.textContent = `START STAGE ${lvlNum} ⚡`;
          }
        });
      }

      this.ui.levelsGrid.appendChild(card);
    });
  }

  renderGarageVehicles() {
    if (!this.ui.garagePillsContainer) return;
    this.ui.garagePillsContainer.innerHTML = '';

    const owned = this.progression.ownedVehicles;
    owned.forEach(vId => {
      const spec = VEHICLE_SPECS[vId];
      if (!spec) return;
      const pill = document.createElement('button');
      pill.className = `v-pill ${vId === this.selectedVehicleId ? 'active' : ''}`;
      pill.textContent = spec.name;
      pill.addEventListener('click', () => {
        this.setVehicle(vId);
        this.renderGarageVehicles();
        this.renderPaintChips();
      });
      this.ui.garagePillsContainer.appendChild(pill);
    });
  }

  renderPaintChips() {
    if (!this.ui.paintChipsContainer) return;
    this.ui.paintChipsContainer.innerHTML = '';

    const colors = [
      { name: 'Cyber Cyan', hex: '#00f0ff' },
      { name: 'Hot Pink', hex: '#ff007f' },
      { name: 'Electric Gold', hex: '#ffea00' },
      { name: 'Neon Green', hex: '#00ff88' },
      { name: 'Sunset Orange', hex: '#ff6600' },
      { name: 'Deep Purple', hex: '#7b1fa2' },
      { name: 'Midnight Navy', hex: '#101726' },
      { name: 'Ghost White', hex: '#ffffff' },
      { name: 'Crimson Red', hex: '#e01040' }
    ];

    const currentPaint = (this.progression.getPaint(this.selectedVehicleId) || '#00f0ff').toLowerCase();

    colors.forEach(c => {
      const chip = document.createElement('button');
      const isSelected = currentPaint === c.hex.toLowerCase();
      chip.className = `paint-chip ${isSelected ? 'active' : ''}`;
      chip.style.backgroundColor = c.hex;
      chip.title = c.name;

      chip.addEventListener('click', () => {
        this.progression.setPaint(this.selectedVehicleId, c.hex);
        if (this.previewVehicle) {
          this.models.setVehiclePaint(this.previewVehicle, c.hex);
        }
        if (this.bike) {
          this.models.setVehiclePaint(this.bike, c.hex);
        }
        this.renderPaintChips();
      });

      this.ui.paintChipsContainer.appendChild(chip);
    });
  }

  renderShopCatalog() {
    if (!this.ui.shopCatalogGrid) return;
    this.ui.shopCatalogGrid.innerHTML = '';

    Object.values(VEHICLE_SPECS).forEach(spec => {
      const card = document.createElement('div');
      const isOwned = this.progression.isOwned(spec.id);
      const isSelected = spec.id === this.selectedVehicleId;

      card.className = `shop-card ${isOwned ? 'owned' : ''} ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="shop-card-header">
          <span class="shop-card-name">${spec.name}</span>
          <span class="shop-card-price">${isOwned ? 'OWNED' : `₳ ${spec.price.toLocaleString()}`}</span>
        </div>
        <div class="shop-card-stats">SPD: ${spec.stats.speed} • ACC: ${spec.stats.accel} • HND: ${spec.stats.handling}</div>
        <button class="shop-buy-btn ${isOwned ? 'owned' : ''}">
          ${isOwned ? (isSelected ? 'SELECTED ✓' : 'EQUIP') : `BUY (₳ ${spec.price.toLocaleString()})`}
        </button>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
          // Preview on turntable (does not equip if locked)
          this.setVehicle(spec.id, false);
          this.renderShopCatalog();
        }
      });

      const btn = card.querySelector('.shop-buy-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOwned) {
          this.setVehicle(spec.id);
          this.renderShopCatalog();
        } else {
          this.openPurchaseModal(spec.id);
        }
      });

      this.ui.shopCatalogGrid.appendChild(card);
    });
  }

  renderUpgradesWorkshop() {
    if (!this.ui.upgradesGrid) return;
    this.ui.upgradesGrid.innerHTML = '';

    const spec = VEHICLE_SPECS[this.selectedVehicleId];
    if (this.ui.upgradeVehicleName) this.ui.upgradeVehicleName.textContent = spec.name.toUpperCase();

    const upgrades = this.progression.getUpgrades(this.selectedVehicleId);
    const types = [
      { key: 'speed', label: 'TOP SPEED', desc: '+6 KM/H Max Velocity', costMult: 250 },
      { key: 'accel', label: 'ACCELERATION', desc: '+15% Nitro Pickup', costMult: 200 },
      { key: 'handling', label: 'HANDLING', desc: '+12% Lean Response', costMult: 220 }
    ];

    types.forEach(t => {
      const curLvl = upgrades[t.key] || 0;
      const isMax = curLvl >= 5;
      const cost = isMax ? 0 : (curLvl + 1) * t.costMult;
      const canBuy = !isMax && this.progression.canAfford(cost);

      const card = document.createElement('div');
      card.className = 'upgrade-card';

      let pipsHtml = '';
      for (let p = 1; p <= 5; p++) {
        pipsHtml += `<div class="upgrade-pip ${p <= curLvl ? 'filled' : ''}"></div>`;
      }

      card.innerHTML = `
        <div class="upgrade-card-title">${t.label} (LVL ${curLvl}/5)</div>
        <div class="upgrade-card-desc">${t.desc}</div>
        <div class="upgrade-pips-row">${pipsHtml}</div>
        <button class="upgrade-btn" ${(!canBuy || isMax) ? 'disabled' : ''}>
          ${isMax ? 'MAX LEVEL' : `UPGRADE ₳ ${cost.toLocaleString()}`}
        </button>
      `;

      const btn = card.querySelector('.upgrade-btn');
      if (btn && !isMax) {
        btn.addEventListener('click', () => {
          if (this.progression.upgradeVehicle(this.selectedVehicleId, t.key)) {
            this.audio.playPurchase();
            this.updateLobbyCurrency();
            this.setVehicle(this.selectedVehicleId);
            this.renderUpgradesWorkshop();
          }
        });
      }

      this.ui.upgradesGrid.appendChild(card);
    });
  }

  refreshLobbyDisplay(viewVehicleId = null) {
    const vId = viewVehicleId || this.viewedVehicleId || this.selectedVehicleId;
    const spec = VEHICLE_SPECS[vId] || VEHICLE_SPECS.cyber_pulse;
    const isOwned = this.progression.isOwned(vId);

    // Profile & Currency
    if (this.ui.lobbyUsername) this.ui.lobbyUsername.value = this.username;
    if (this.ui.lobbyHighScore) this.ui.lobbyHighScore.textContent = this.highScore.toLocaleString();
    if (this.ui.hudUsername) this.ui.hudUsername.textContent = this.username;
    this.updateLobbyCurrency();

    // Vehicle details
    if (this.ui.lobbyVehicleName) this.ui.lobbyVehicleName.textContent = spec.name;
    if (this.ui.lobbyVehicleCategory) this.ui.lobbyVehicleCategory.textContent = spec.category.toUpperCase();
    if (this.ui.lobbyVehicleDesc) this.ui.lobbyVehicleDesc.textContent = spec.desc;

    // Ownership badge
    if (this.ui.lobbyOwnershipBadge) {
      this.ui.lobbyOwnershipBadge.className = `ownership-badge ${isOwned ? 'owned' : 'locked'}`;
      this.ui.lobbyOwnershipBadge.textContent = isOwned ? 'OWNED' : `LOCKED (₳ ${spec.price.toLocaleString()})`;
    }

    // Turntable Unlock / Buy Button
    if (this.ui.turntableBuyBtn) {
      if (!isOwned) {
        this.ui.turntableBuyBtn.classList.remove('hidden');
        this.ui.turntableBuyBtn.textContent = `UNLOCK FOR ₳ ${spec.price.toLocaleString()}`;
      } else {
        this.ui.turntableBuyBtn.classList.add('hidden');
      }
    }

    // Lobby Start / Unlock Button
    if (this.ui.lobbyStartBtn) {
      if (!isOwned) {
        this.ui.lobbyStartBtn.textContent = `UNLOCK ${spec.name.toUpperCase()} ⚡`;
      } else {
        this.ui.lobbyStartBtn.textContent = this.gameMode === 'levels'
          ? `START STAGE ${this.selectedLevelIndex + 1} ⚡`
          : 'LAUNCH RUN ⚡';
      }
    }

    // Vehicle stats with upgrade bonuses
    const upgrades = this.progression.getUpgrades(vId);
    const speedBonus = upgrades.speed * 6;
    const accelBonus = upgrades.accel * 3;
    const handlingBonus = upgrades.handling * 3;

    if (this.ui.statSpeedBar) this.ui.statSpeedBar.style.width = `${Math.min(100, spec.stats.speed + speedBonus)}%`;
    if (this.ui.statSpeedVal) this.ui.statSpeedVal.textContent = `${spec.maxSpeed + speedBonus} KM/H`;

    if (this.ui.statAccelBar) this.ui.statAccelBar.style.width = `${Math.min(100, spec.stats.accel + accelBonus)}%`;
    if (this.ui.statAccelVal) this.ui.statAccelVal.textContent = `${Math.min(100, spec.stats.accel + accelBonus)}%`;

    if (this.ui.statHandlingBar) this.ui.statHandlingBar.style.width = `${Math.min(100, spec.stats.handling + handlingBonus)}%`;
    if (this.ui.statHandlingVal) this.ui.statHandlingVal.textContent = `${Math.min(100, spec.stats.handling + handlingBonus)}%`;

    // Map Pills active state
    const mapPills = document.querySelectorAll('#mapSelector .opt-pill');
    mapPills.forEach(p => {
      p.classList.toggle('active', p.dataset.map === this.selectedMapId);
    });

    // Time Pills active state
    const timePills = document.querySelectorAll('#timeSelector .opt-pill');
    timePills.forEach(p => {
      p.classList.toggle('active', p.dataset.time === this.selectedTimeOfDay);
    });

    // Density Pills active state
    const densityPills = document.querySelectorAll('#densitySelector .opt-pill');
    densityPills.forEach(p => {
      p.classList.toggle('active', p.dataset.density === this.selectedDensity);
    });

    // Render mode grid
    this.renderLevelsGrid();
  }

  // ==========================================================================
  // PARTICLE SYSTEMS
  // ==========================================================================
  initParticleSystems() {
    // 1. Exhaust Flame Sparks
    const sparkGeo = new THREE.BoxGeometry(0.08, 0.08, 0.25);
    for (let i = 0; i < 40; i++) {
      const sparkMat = new THREE.MeshBasicMaterial({ color: '#00f0ff', transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(sparkGeo, sparkMat);
      mesh.visible = false;
      this.world.scene.add(mesh);
      this.exhaustParticles.push({
        mesh,
        life: 0,
        maxLife: 0.3,
        vel: new THREE.Vector3()
      });
    }
  }

  // ==========================================================================
  // AUDIO CONFIGURATION & PERSISTENCE
  // ==========================================================================
  applyAudioSettings() {
    if (!this.audio) return;
    this.audio.setMasterVolume(this.masterVolume);
    this.audio.setMusicVolume(this.musicVolume);
    this.audio.setSfxVolume(this.sfxVolume);
  }

  // ==========================================================================
  // UI & EVENT BINDINGS
  // ==========================================================================
  bindInputs() {
    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return; // Allow typing username!

      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        this.keys.up = true;
        e.preventDefault();
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        this.keys.down = true;
        e.preventDefault();
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        this.keys.left = true;
        e.preventDefault();
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        this.keys.right = true;
        e.preventDefault();
      }

      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === this.STATE_PLAYING) this.pauseGame();
        else if (this.state === this.STATE_PAUSED) this.resumeGame();
      }

      if (e.code === 'KeyM') {
        this.toggleMute();
      }

      if (e.code === 'KeyF') {
        this.toggleFullscreen();
      }

      if (e.code === 'KeyR' && this.state === this.STATE_GAMEOVER) {
        this.startRun();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.target.tagName === 'INPUT') return;

      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.keys.up = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.keys.down = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.right = false;
    });

    // Global Touch Key Release Helper (prevents stuck keys during interruptions)
    this.releaseAllTouchKeys = () => {
      this.keys.up = false;
      this.keys.down = false;
      this.keys.left = false;
      this.keys.right = false;
      ['touchLeft', 'touchRight', 'touchGas', 'touchBrake'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('pressed');
      });
    };

    window.addEventListener('blur', () => this.releaseAllTouchKeys());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.releaseAllTouchKeys();
    });

    // High-performance, zero-latency touch button bindings with Pointer Capture
    const bindTouchBtn = (id, keyName) => {
      const btn = document.getElementById(id);
      if (!btn) return;

      const press = (e) => {
        this.keys[keyName] = true;
        btn.classList.add('pressed');
        if (e && e.cancelable) e.preventDefault();
      };

      const release = (e) => {
        this.keys[keyName] = false;
        btn.classList.remove('pressed');
        if (e && e.cancelable) e.preventDefault();
      };

      // Pointer events with pointer capture for modern browsers & multi-touch
      btn.addEventListener('pointerdown', (e) => {
        press(e);
        try {
          btn.setPointerCapture(e.pointerId);
        } catch (_) {}
      });

      btn.addEventListener('pointerup', (e) => {
        release(e);
        try {
          btn.releasePointerCapture(e.pointerId);
        } catch (_) {}
      });

      btn.addEventListener('pointercancel', (e) => {
        release(e);
        try {
          btn.releasePointerCapture(e.pointerId);
        } catch (_) {}
      });

      btn.addEventListener('pointerleave', (e) => {
        if (!btn.hasPointerCapture || !btn.hasPointerCapture(e.pointerId)) {
          release(e);
        }
      });

      // Touch events layer for mobile WebKit & standard touch devices
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });
    };

    bindTouchBtn('touchLeft', 'left');
    bindTouchBtn('touchRight', 'right');
    bindTouchBtn('touchGas', 'up');
    bindTouchBtn('touchBrake', 'down');
  }

  bindUI() {
    // 1. Username input persistence
    if (this.ui.lobbyUsername) {
      this.ui.lobbyUsername.addEventListener('input', (e) => {
        const val = e.target.value.trim().toUpperCase() || 'CYBER_RIDER';
        this.username = val;
        localStorage.setItem('neon_username', val);
        if (this.ui.hudUsername) this.ui.hudUsername.textContent = val;
      });
    }

    // 2. Turntable Drag Rotation Interaction (Mouse & Touch)
    const dragZone = document.getElementById('turntableDragZone');
    if (dragZone) {
      const startDrag = (clientX) => {
        this.turntableDragging = true;
        this.turntableLastX = clientX;
      };
      const moveDrag = (clientX) => {
        if (!this.turntableDragging) return;
        const deltaX = clientX - this.turntableLastX;
        this.turntableAngle -= deltaX * 0.012;
        this.turntableLastX = clientX;
      };
      const stopDrag = () => {
        this.turntableDragging = false;
      };

      dragZone.addEventListener('mousedown', (e) => startDrag(e.clientX));
      window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
      window.addEventListener('mouseup', stopDrag);

      dragZone.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) startDrag(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) moveDrag(e.touches[0].clientX);
      }, { passive: true });
      window.addEventListener('touchend', stopDrag);
    }

    // 3. Vehicle Next/Prev buttons
    const vehicleKeys = Object.keys(VEHICLE_SPECS);
    if (this.ui.prevVehicleBtn) {
      this.ui.prevVehicleBtn.addEventListener('click', () => {
        const currentIdx = vehicleKeys.indexOf(this.viewedVehicleId || this.selectedVehicleId);
        const prevIdx = (currentIdx - 1 + vehicleKeys.length) % vehicleKeys.length;
        this.setVehicle(vehicleKeys[prevIdx]);
      });
    }
    if (this.ui.nextVehicleBtn) {
      this.ui.nextVehicleBtn.addEventListener('click', () => {
        const currentIdx = vehicleKeys.indexOf(this.viewedVehicleId || this.selectedVehicleId);
        const nextIdx = (currentIdx + 1) % vehicleKeys.length;
        this.setVehicle(vehicleKeys[nextIdx]);
      });
    }

    // Turntable Unlock / Buy Button
    if (this.ui.turntableBuyBtn) {
      this.ui.turntableBuyBtn.addEventListener('click', () => {
        this.openPurchaseModal(this.viewedVehicleId || this.selectedVehicleId);
      });
    }

    // Purchase Modal Action Buttons
    if (this.ui.cancelPurchaseBtn) {
      this.ui.cancelPurchaseBtn.addEventListener('click', () => this.closePurchaseModal());
    }
    if (this.ui.confirmPurchaseBtn) {
      this.ui.confirmPurchaseBtn.addEventListener('click', () => this.confirmPurchase());
    }

    // 4. Vehicle Selection Pills
    if (this.ui.vehiclePillsContainer) {
      this.ui.vehiclePillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.v-pill');
        if (pill && pill.dataset.vehicle) {
          this.setVehicle(pill.dataset.vehicle);
        }
      });
    }

    // 5. Map Selection Pills
    if (this.ui.mapSelector) {
      this.ui.mapSelector.addEventListener('click', (e) => {
        const pill = e.target.closest('.opt-pill');
        if (pill && pill.dataset.map) {
          this.setMap(pill.dataset.map);
        }
      });
    }

    // 6. Time of Day Selection Pills
    if (this.ui.timeSelector) {
      this.ui.timeSelector.addEventListener('click', (e) => {
        const pill = e.target.closest('.opt-pill');
        if (pill && pill.dataset.time) {
          this.setTimeOfDay(pill.dataset.time);
        }
      });
    }

    // 7. Traffic Density Selection Pills
    if (this.ui.densitySelector) {
      this.ui.densitySelector.addEventListener('click', (e) => {
        const pill = e.target.closest('.opt-pill');
        if (pill && pill.dataset.density) {
          this.setDensity(pill.dataset.density);
        }
      });
    }

    // 8. Launch Run Button
    if (this.ui.lobbyStartBtn) {
      this.ui.lobbyStartBtn.addEventListener('click', () => this.startRun());
    }

    // 9. Pause & Resume Buttons
    if (this.ui.hudPauseBtn) this.ui.hudPauseBtn.addEventListener('click', () => this.pauseGame());
    if (this.ui.resumeBtn) this.ui.resumeBtn.addEventListener('click', () => this.resumeGame());
    if (this.ui.restartBtn) this.ui.restartBtn.addEventListener('click', () => this.startRun());

    // 10. Return to Lobby flow with Confirmation Modal
    if (this.ui.returnLobbyBtn) {
      this.ui.returnLobbyBtn.addEventListener('click', () => {
        this.ui.confirmLobbyModal.classList.remove('hidden');
      });
    }
    if (this.ui.confirmLobbyNo) {
      this.ui.confirmLobbyNo.addEventListener('click', () => {
        this.ui.confirmLobbyModal.classList.add('hidden');
      });
    }
    if (this.ui.confirmLobbyYes) {
      this.ui.confirmLobbyYes.addEventListener('click', () => {
        this.ui.confirmLobbyModal.classList.add('hidden');
        this.returnToLobby();
      });
    }
    if (this.ui.gameOverLobbyBtn) {
      this.ui.gameOverLobbyBtn.addEventListener('click', () => this.returnToLobby());
    }

    // 11. Retry Button
    if (this.ui.retryBtn) this.ui.retryBtn.addEventListener('click', () => this.startRun());

    // 12. Fullscreen Toggle Buttons
    if (this.ui.lobbyFullscreenBtn) {
      this.ui.lobbyFullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }
    if (this.ui.hudFullscreenBtn) {
      this.ui.hudFullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // 13. Portrait Orientation Guidance Overlay Buttons
    if (this.ui.requestRotateFullscreenBtn) {
      this.ui.requestRotateFullscreenBtn.addEventListener('click', () => {
        this.enterFullscreen();
      });
    }
    if (this.ui.dismissRotateOverlayBtn) {
      this.ui.dismissRotateOverlayBtn.addEventListener('click', () => {
        this.portraitDismissed = true;
        if (this.ui.portraitOrientationOverlay) {
          this.ui.portraitOrientationOverlay.classList.add('hidden');
        }
      });
    }

    // Navigation Tabs (Race, Garage, Shop, Upgrades)
    const tabBtns = document.querySelectorAll('.lobby-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // Game Mode Toggle (Levels vs Endless)
    if (this.ui.modeLevelsBtn) {
      this.ui.modeLevelsBtn.addEventListener('click', () => this.setGameMode('levels'));
    }
    if (this.ui.modeEndlessBtn) {
      this.ui.modeEndlessBtn.addEventListener('click', () => this.setGameMode('endless'));
    }

    // Level Complete Modal Buttons
    if (this.ui.levelNextBtn) {
      this.ui.levelNextBtn.addEventListener('click', () => {
        this.ui.levelCompleteModal.classList.add('hidden');
        if (this.selectedLevelIndex + 1 < LEVELS_CONFIG.length) {
          this.selectedLevelIndex++;
          localStorage.setItem('neon_selected_level', this.selectedLevelIndex);
          this.startRun();
        } else {
          this.returnToLobby();
        }
      });
    }
    if (this.ui.levelReplayBtn) {
      this.ui.levelReplayBtn.addEventListener('click', () => {
        this.ui.levelCompleteModal.classList.add('hidden');
        this.startRun();
      });
    }
    if (this.ui.levelLobbyBtn) {
      this.ui.levelLobbyBtn.addEventListener('click', () => {
        this.ui.levelCompleteModal.classList.add('hidden');
        this.returnToLobby();
      });
    }

    // Level Failed Modal Buttons
    if (this.ui.failRetryBtn) {
      this.ui.failRetryBtn.addEventListener('click', () => {
        this.ui.levelFailedModal.classList.add('hidden');
        this.startRun();
      });
    }
    if (this.ui.failLobbyBtn) {
      this.ui.failLobbyBtn.addEventListener('click', () => {
        this.ui.levelFailedModal.classList.add('hidden');
        this.returnToLobby();
      });
    }

    // 12. Settings Modal Wiring
    const openSettings = () => {
      this.syncSettingsUI();
      this.ui.settingsModal.classList.remove('hidden');
    };
    if (this.ui.lobbySettingsBtn) this.ui.lobbySettingsBtn.addEventListener('click', openSettings);
    if (this.ui.hudSettingsBtn) this.ui.hudSettingsBtn.addEventListener('click', openSettings);
    if (this.ui.pauseSettingsBtn) this.ui.pauseSettingsBtn.addEventListener('click', openSettings);

    if (this.ui.closeSettingsBtn) {
      this.ui.closeSettingsBtn.addEventListener('click', () => {
        this.ui.settingsModal.classList.add('hidden');
      });
    }

    // Volume Sliders
    if (this.ui.settingMasterVolume) {
      this.ui.settingMasterVolume.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.ui.valMasterVolume.textContent = `${val}%`;
        this.masterVolume = val / 100;
        localStorage.setItem('neon_master_volume', this.masterVolume);
        this.audio.setMasterVolume(this.masterVolume);
      });
    }
    if (this.ui.settingMusicVolume) {
      this.ui.settingMusicVolume.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.ui.valMusicVolume.textContent = `${val}%`;
        this.musicVolume = val / 100;
        localStorage.setItem('neon_music_volume', this.musicVolume);
        this.audio.setMusicVolume(this.musicVolume);
      });
    }
    if (this.ui.settingSfxVolume) {
      this.ui.settingSfxVolume.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.ui.valSfxVolume.textContent = `${val}%`;
        this.sfxVolume = val / 100;
        localStorage.setItem('neon_sfx_volume', this.sfxVolume);
        this.audio.setSfxVolume(this.sfxVolume);
      });
    }

    // Steering Sensitivity Slider
    if (this.ui.settingSensitivity) {
      this.ui.settingSensitivity.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.ui.valSensitivity.textContent = `${val}%`;
        this.steeringSensitivity = val / 100;
        localStorage.setItem('neon_sensitivity', this.steeringSensitivity);
        const spec = VEHICLE_SPECS[this.selectedVehicleId];
        if (spec) this.steerSpeed = spec.turnSpeed * 2.6 * this.steeringSensitivity;
      });
    }

    // Camera Shake Toggle
    if (this.ui.settingShake) {
      this.ui.settingShake.addEventListener('change', (e) => {
        this.cameraShakeEnabled = e.target.checked;
        localStorage.setItem('neon_shake', this.cameraShakeEnabled);
      });
    }

    // Graphics Quality Dropdown
    if (this.ui.settingQuality) {
      this.ui.settingQuality.addEventListener('change', (e) => {
        this.quality = e.target.value;
        localStorage.setItem('neon_quality', this.quality);
        this.world.setQuality(this.quality);
      });
    }

    // Reset Defaults Button
    if (this.ui.resetSettingsBtn) {
      this.ui.resetSettingsBtn.addEventListener('click', () => {
        this.masterVolume = 0.8;
        this.musicVolume = 0.7;
        this.sfxVolume = 0.85;
        this.steeringSensitivity = 1.0;
        this.cameraShakeEnabled = true;
        this.quality = 'high';

        localStorage.setItem('neon_master_volume', '0.8');
        localStorage.setItem('neon_music_volume', '0.7');
        localStorage.setItem('neon_sfx_volume', '0.85');
        localStorage.setItem('neon_sensitivity', '1.0');
        localStorage.setItem('neon_shake', 'true');
        localStorage.setItem('neon_quality', 'high');

        this.applyAudioSettings();
        this.world.setQuality(this.quality);
        this.syncSettingsUI();
      });
    }

    // Sound Mute Toggle
    if (this.ui.muteBtn) {
      this.ui.muteBtn.addEventListener('click', () => this.toggleMute());
    }
  }

  syncSettingsUI() {
    if (this.ui.settingMasterVolume) this.ui.settingMasterVolume.value = Math.round(this.masterVolume * 100);
    if (this.ui.valMasterVolume) this.ui.valMasterVolume.textContent = `${Math.round(this.masterVolume * 100)}%`;

    if (this.ui.settingMusicVolume) this.ui.settingMusicVolume.value = Math.round(this.musicVolume * 100);
    if (this.ui.valMusicVolume) this.ui.valMusicVolume.textContent = `${Math.round(this.musicVolume * 100)}%`;

    if (this.ui.settingSfxVolume) this.ui.settingSfxVolume.value = Math.round(this.sfxVolume * 100);
    if (this.ui.valSfxVolume) this.ui.valSfxVolume.textContent = `${Math.round(this.sfxVolume * 100)}%`;

    if (this.ui.settingSensitivity) this.ui.settingSensitivity.value = Math.round(this.steeringSensitivity * 100);
    if (this.ui.valSensitivity) this.ui.valSensitivity.textContent = `${Math.round(this.steeringSensitivity * 100)}%`;

    if (this.ui.settingShake) this.ui.settingShake.checked = this.cameraShakeEnabled;
    if (this.ui.settingQuality) this.ui.settingQuality.value = this.quality;
  }

  toggleMute() {
    if (!this.audio) return;
    const isMuted = this.audio.toggleMute();
    if (this.ui.muteBtn) {
      this.ui.muteBtn.textContent = isMuted ? '🔇' : '🔊';
      this.ui.muteBtn.title = isMuted ? 'Unmute Sound (M)' : 'Mute Sound (M)';
    }
  }

  // ==========================================================================
  // GAME LIFECYCLE & RUN MANAGEMENT
  // ==========================================================================
  startRun() {
    // If player is viewing a locked vehicle and attempts to start, open the purchase modal instead!
    const activeViewId = this.viewedVehicleId || this.selectedVehicleId;
    if (!this.progression.isOwned(activeViewId)) {
      this.openPurchaseModal(activeViewId);
      return;
    }

    // Strictly validate ownership of the selected vehicle; fallback to 'cyber_pulse' if not owned
    if (!this.progression.isOwned(this.selectedVehicleId)) {
      this.selectedVehicleId = 'cyber_pulse';
      this.viewedVehicleId = 'cyber_pulse';
      localStorage.setItem('neon_vehicle', 'cyber_pulse');
    }

    this.audio.init();

    // Request landscape orientation upon user gesture to start race
    this.requestLandscapeOrientation();

    // Reset Player State
    this.playerX = 0;
    this.playerZ = 0;
    this.lean = 0;
    this.targetLean = 0;
    this.suspensionBounce = 0;

    // Apply Vehicle Specs with Upgrades
    const spec = VEHICLE_SPECS[this.selectedVehicleId] || VEHICLE_SPECS.cyber_pulse;
    const upgrades = this.progression.getUpgrades(this.selectedVehicleId);
    const speedBonus = upgrades.speed * 6;
    const accelBonus = upgrades.accel * 4.5;
    const handlingBonus = upgrades.handling * 0.45;

    this.maxSpeed = spec.maxSpeed + speedBonus;
    this.cruisingSpeed = spec.cruiseSpeed + speedBonus * 0.6;
    this.minSpeed = spec.minSpeed;
    this.boostAccel = (spec.accelRate + accelBonus) * 2.8;
    this.brakeDecel = spec.brakeRate * 2.6;
    this.steerSpeed = (spec.turnSpeed + handlingBonus) * 2.6 * this.steeringSensitivity;
    this.bankFactor = spec.bankFactor;

    this.speed = this.cruisingSpeed;

    // Reset Match Stats (Difficulty strictly scales with current match score)
    this.score = 0;
    this.distance = 0;
    this.nearMissCount = 0;
    this.combo = 0;
    this.comboTimer = 0;

    // Rebuild vehicle & place on highway
    if (this.bike) {
      const customPaint = this.progression.getPaint(this.selectedVehicleId);
      this.models.setVehiclePaint(this.bike, customPaint);
      this.bike.root.position.set(0, 0, 0);
      this.bike.root.rotation.set(0, 0, 0);
      this.bike.bankGroup.rotation.z = 0;
      if (this.bike.forkGroup) this.bike.forkGroup.rotation.y = 0;
      this.bike.root.visible = true;
    }

    // Mode-specific configuration: Levels vs Endless
    if (this.gameMode === 'levels') {
      const lvlNum = this.selectedLevelIndex + 1;
      this.levelEngine.startLevel(lvlNum);
      const lvlCfg = this.levelEngine.levelConfig;
      this.world.setEnvironment(lvlCfg.map, lvlCfg.timeOfDay, true);
      this.traffic.setDensity('normal');
      if (this.ui.hudLevelBar) this.ui.hudLevelBar.classList.remove('hidden');
      if (this.ui.checkpointToast) this.ui.checkpointToast.classList.add('hidden');
    } else {
      this.levelEngine.cleanup();
      this.world.setEnvironment(this.selectedMapId, this.selectedTimeOfDay, true);
      this.traffic.setDensity(this.selectedDensity);
      // STRICTLY HIDE LEVEL HUD & CLEAR STALE VALUES IN ENDLESS MODE
      if (this.ui.hudLevelBar) this.ui.hudLevelBar.classList.add('hidden');
      if (this.ui.checkpointToast) this.ui.checkpointToast.classList.add('hidden');
      if (this.ui.hudLevelTimer) this.ui.hudLevelTimer.textContent = '';
      if (this.ui.hudLevelDist) this.ui.hudLevelDist.textContent = '';
      if (this.ui.hudLevelOvertakes) this.ui.hudLevelOvertakes.textContent = '';
      if (this.ui.hudLevelCoins) this.ui.hudLevelCoins.textContent = '';
    }

    // Reset traffic engine for chosen density
    this.traffic.reset();

    // Clear crash debris
    this.clearCrashDebris();

    // Hide any previous modals
    if (this.ui.levelCompleteModal) this.ui.levelCompleteModal.classList.add('hidden');
    if (this.ui.levelFailedModal) this.ui.levelFailedModal.classList.add('hidden');

    // Switch State & Display
    this.state = this.STATE_PLAYING;
    this.ui.lobbyScreen.classList.add('hidden');
    this.ui.pauseScreen.classList.add('hidden');
    this.ui.gameOverScreen.classList.add('hidden');
    this.ui.hud.classList.remove('hidden');
    this.ui.touchControls.classList.remove('hidden');

    this.audio.startEngine();
    this.audio.startMusic();

    this.lastTime = performance.now();
  }

  pauseGame() {
    if (this.state !== this.STATE_PLAYING) return;
    this.state = this.STATE_PAUSED;
    if (this.releaseAllTouchKeys) this.releaseAllTouchKeys();
    this.audio.stopEngine();
    this.audio.stopMusic();
    this.ui.pauseScreen.classList.remove('hidden');
  }

  resumeGame() {
    if (this.state !== this.STATE_PAUSED) return;
    this.state = this.STATE_PLAYING;
    if (this.releaseAllTouchKeys) this.releaseAllTouchKeys();
    this.audio.startEngine();
    this.audio.startMusic();
    this.ui.pauseScreen.classList.add('hidden');
    this.lastTime = performance.now();
  }

  returnToLobby() {
    this.state = this.STATE_LOBBY;
    if (this.releaseAllTouchKeys) this.releaseAllTouchKeys();
    this.audio.stopEngine();
    this.audio.stopMusic();

    this.levelEngine.cleanup();

    if (this.ui.pauseScreen) this.ui.pauseScreen.classList.add('hidden');
    if (this.ui.gameOverScreen) this.ui.gameOverScreen.classList.add('hidden');
    if (this.ui.levelCompleteModal) this.ui.levelCompleteModal.classList.add('hidden');
    if (this.ui.levelFailedModal) this.ui.levelFailedModal.classList.add('hidden');
    if (this.ui.hud) this.ui.hud.classList.add('hidden');
    if (this.ui.hudLevelBar) this.ui.hudLevelBar.classList.add('hidden');
    if (this.ui.checkpointToast) this.ui.checkpointToast.classList.add('hidden');
    if (this.ui.touchControls) this.ui.touchControls.classList.add('hidden');
    if (this.ui.lobbyScreen) this.ui.lobbyScreen.classList.remove('hidden');

    this.clearCrashDebris();

    // Reset vehicle preview position and visibility
    this.playerX = 0;
    this.playerZ = 0;
    if (this.bike && this.bike.root) {
      this.bike.root.position.set(0, 0, 0);
      this.bike.root.rotation.set(0, 0, 0);
      this.bike.bankGroup.rotation.z = 0;
      this.bike.root.visible = true;
    }

    this.world.setEnvironment(this.selectedMapId, this.selectedTimeOfDay, true);
    this.refreshLobbyDisplay();
    this.updateTurntableFraming();
    this.lastTime = performance.now();
  }

  triggerCrash() {
    this.state = this.STATE_GAMEOVER;
    this.audio.playCrash();
    this.audio.stopEngine();
    this.audio.stopMusic();

    this.screenShake = 0.85;
    this.crashTimer = 1.2;

    if (this.bike && this.bike.root) {
      this.bike.root.visible = false;
    }
    this.spawnCrashDebris();

    if (this.gameMode === 'levels') {
      this.levelEngine.active = false;
      setTimeout(() => {
        this.handleLevelFailed('COLLISION CRASH');
      }, 950);
    } else {
      const isNewRecord = this.score > this.highScore;
      if (isNewRecord) {
        this.highScore = Math.floor(this.score);
        localStorage.setItem('neon_highway_highscore', this.highScore);
      }

      setTimeout(() => {
        this.ui.finalScore.textContent = Math.floor(this.score).toLocaleString();
        this.ui.finalDistance.textContent = `${Math.floor(this.distance).toLocaleString()} m`;
        this.ui.finalNearMiss.textContent = this.nearMissCount;
        this.ui.finalBest.textContent = this.highScore.toLocaleString();

        if (isNewRecord && this.score > 0) {
          this.ui.newBestBadge.classList.remove('hidden');
        } else {
          this.ui.newBestBadge.classList.add('hidden');
        }
        this.ui.gameOverScreen.classList.remove('hidden');
        this.updateHUD();
      }, 950);
    }
  }

  spawnCrashDebris() {
    const debrisGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const colors = ['#00f0ff', '#ff007f', '#ffaa00', '#ffffff', '#220044'];

    for (let i = 0; i < 35; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mesh = new THREE.Mesh(debrisGeo, new THREE.MeshBasicMaterial({ color }));
      mesh.position.set(
        this.playerX + (Math.random() * 0.8 - 0.4),
        0.8 + Math.random() * 0.8,
        this.playerZ + (Math.random() * 0.8 - 0.4)
      );
      this.world.scene.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = 12 + Math.random() * 28;
      this.crashDebris.push({
        mesh,
        vel: new THREE.Vector3(Math.cos(angle) * speed, 8 + Math.random() * 18, Math.sin(angle) * speed),
        rotVel: new THREE.Vector3(Math.random() * 15, Math.random() * 15, Math.random() * 15),
        life: 1.5
      });
    }
  }

  clearCrashDebris() {
    for (let i = 0; i < this.crashDebris.length; i++) {
      if (this.crashDebris[i].mesh) {
        this.world.scene.remove(this.crashDebris[i].mesh);
      }
    }
    this.crashDebris = [];
  }

  // ==========================================================================
  // MAIN UPDATE & RENDER LOOP
  // ==========================================================================
  update(dt) {
    // 1. LOBBY TURNTABLE VIEWPORT
    if (this.state === this.STATE_LOBBY) {
      if (!this.turntableDragging) {
        this.turntableAngle += dt * 0.75;
      }
      if (this.previewVehicle && this.previewVehicle.root) {
        this.previewVehicle.root.rotation.y = this.turntableAngle;
        this.previewVehicle.bankGroup.rotation.z = 0;
        if (this.previewVehicle.forkGroup) this.previewVehicle.forkGroup.rotation.y = 0;

        if (this.previewVehicle.isHover) {
          this.previewVehicle.root.position.y = Math.sin(performance.now() * 0.003) * 0.08;
        } else {
          this.previewVehicle.root.position.y = 0;
        }

        if (this.previewVehicle.headGroup) {
          this.previewVehicle.headGroup.rotation.y = Math.sin(performance.now() * 0.0012) * 0.16;
        }
      }

      if (this.turntableRenderer && this.turntableScene && this.turntableCamera) {
        this.turntableRenderer.render(this.turntableScene, this.turntableCamera);
      }

      // Render background highway world on main canvas
      this.playerZ += 18 * dt;
      this.world.update(this.playerZ, 0, 0.1, dt);
      this.world.render();
      return;
    }

    if (this.state === this.STATE_PAUSED) return;

    if (this.state === this.STATE_GAMEOVER) {
      this.updateCrashDebris(dt);
      if (this.screenShake > 0) {
        this.screenShake = Math.max(0, this.screenShake - dt * 1.5);
      }
      this.updateCamera(dt, 0);
      this.world.render();
      return;
    }

    // 2. ACTIVE RUN: Automatic Cruising & Controls
    if (this.keys.up) {
      this.speed = Math.min(this.maxSpeed, this.speed + this.boostAccel * dt);
    } else if (this.keys.down) {
      this.speed = Math.max(this.minSpeed, this.speed - this.brakeDecel * dt);
    } else {
      // Auto-cruise toward cruisingSpeed
      if (this.speed < this.cruisingSpeed) {
        this.speed = Math.min(this.cruisingSpeed, this.speed + this.autoCruiseAccel * dt);
      } else if (this.speed > this.cruisingSpeed) {
        this.speed = Math.max(this.cruisingSpeed, this.speed - this.autoCruiseDecel * dt);
      }
    }

    // Road shoulder drag
    const roadLimit = 6.8;
    if (Math.abs(this.playerX) > 6.0) {
      this.speed = Math.max(this.minSpeed, this.speed - 90 * dt);
      this.screenShake = Math.max(this.screenShake, 0.08);
    } else if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 1.5);
    }

    const worldSpeed = (this.speed / 3.6);
    this.playerZ += worldSpeed * dt;

    // Steering & Banking
    this.targetLean = 0;
    if (this.keys.left) {
      this.playerX += this.steerSpeed * dt;
      this.targetLean = -1.0;
    }
    if (this.keys.right) {
      this.playerX -= this.steerSpeed * dt;
      this.targetLean = 1.0;
    }

    this.playerX = Math.max(-roadLimit, Math.min(roadLimit, this.playerX));
    this.lean += (this.targetLean - this.lean) * dt * 10.0;

    // Suspension bounce or hover bobbing
    if (this.bike.isHover) {
      this.suspensionBounce = 0.48 + Math.sin(performance.now() * 0.008) * 0.07;
    } else {
      this.suspensionBounce = Math.sin(performance.now() * 0.02 * (this.speed / 45)) * (this.speed > 10 ? 0.03 : 0);
    }

    // 3. Update Vehicle Visuals (Bikes, Cars, Hoverboard)
    this.updateVehicleVisuals(dt, worldSpeed);

    // 4. Audio Engine Sync
    const speedRatio = this.speed / this.maxSpeed;
    this.audio.updateEngine(speedRatio, this.keys.up, this.keys.down);

    // 5. Scoring & Distance Tracking
    const distanceGain = worldSpeed * dt;
    this.distance += distanceGain;
    this.score += distanceGain * 1.8 * (1 + speedRatio);

    // 6. Traffic Update & Score-Based Difficulty Scaling (Current Match Score Only)
    this.traffic.update(this.playerZ, this.playerX, this.speed, dt, this.score);
    const interaction = this.traffic.checkInteractions(this.playerX, this.playerZ, this.speed);

    // Overtake counter sync for level mode
    if (interaction.overtakesCount > 0 && this.gameMode === 'levels') {
      for (let k = 0; k < interaction.overtakesCount; k++) {
        this.levelEngine.onCarOvertaken();
      }
    }

    // Near-Miss Trigger
    if (interaction.nearMiss) {
      this.combo++;
      this.comboTimer = 3.6;
      this.nearMissCount++;

      const comboBonus = 250 * this.combo;
      this.score += comboBonus;

      this.audio.playNearMiss(this.combo);

      this.ui.combo.textContent = `NEAR MISS x${this.combo}!`;
      this.ui.combo.classList.add('active');
    }

    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.ui.combo.classList.remove('active');
      }
    }

    // Collision Check
    if (interaction.collision) {
      this.triggerCrash();
      return;
    }

    // 6.5. LEVEL MODE ENGINE UPDATE
    if (this.gameMode === 'levels' && this.levelEngine.active) {
      const lvlRes = this.levelEngine.update(dt, this.playerZ, this.playerX, this.speed);
      if (lvlRes.checkpointBanner) {
        this.showCheckpointToast('CHECKPOINT REACHED! +15 SECONDS');
      }
      if (lvlRes.state === 'completed') {
        this.handleLevelVictory(lvlRes);
        return;
      }
      if (lvlRes.state === 'failed') {
        const reason = lvlRes.reason === 'time_expired' ? 'TIME EXPIRED' : 'OBJECTIVES MISSED';
        this.handleLevelFailed(reason);
        return;
      }
    }

    // 7. World, Particles & Camera
    this.world.update(this.playerZ, this.playerX, speedRatio, dt);
    this.updateParticles(dt, speedRatio);
    this.updateCamera(dt, speedRatio);
    this.updateHUD();

    this.world.render();
  }

  // --- Dynamic Vehicle Visual Updates for All 10 Vehicles ---
  updateVehicleVisuals(dt, worldSpeed) {
    if (!this.bike) return;

    this.bike.root.position.set(this.playerX, this.suspensionBounce, this.playerZ);
    this.bike.root.rotation.set(0, 0, 0);

    // Banking Angle & Steering Angle
    const bankAngle = this.lean * this.bankFactor;
    this.bike.bankGroup.rotation.z = bankAngle;

    const steerAngle = -this.lean * (this.bike.isCar ? 0.28 : 0.22);
    if (this.bike.forkGroup) {
      this.bike.forkGroup.rotation.y = steerAngle;
    }

    // Wheels rotation
    if (this.bike.wheels) {
      const wheelRotDelta = (worldSpeed / 0.32) * dt;
      for (let i = 0; i < this.bike.wheels.length; i++) {
        this.bike.wheels[i].rotation.x += wheelRotDelta;
      }
    } else if (this.bike.rearWheel && this.bike.frontWheel) {
      const wheelRotDelta = (worldSpeed / 0.38) * dt;
      this.bike.rearWheel.rotation.x += wheelRotDelta;
      this.bike.frontWheel.rotation.x += wheelRotDelta;
    }

    // Police Strobe Flashing (for Enforcer)
    if (this.bike.strobeL && this.bike.strobeR) {
      const flash = Math.floor(performance.now() * 0.008) % 2 === 0;
      this.bike.strobeL.visible = flash;
      this.bike.strobeR.visible = !flash;
    }

    // Knee Sliders & Head Lean into Corners (for Bikes)
    if (this.bike.kneeL && this.bike.kneeR) {
      this.bike.kneeL.position.x = 0.32 + (this.lean < -0.2 ? 0.16 : 0);
      this.bike.kneeR.position.x = -0.32 - (this.lean > 0.2 ? 0.16 : 0);
    }
    if (this.bike.headGroup) {
      // Rider turns helmet into apex of the turn
      this.bike.headGroup.rotation.y = -this.lean * 0.28;
      this.bike.headGroup.rotation.z = -this.lean * 0.10;
    }

    // Brake light flare
    const isBraking = this.keys.down;
    if (this.bike.brakeLightMat) {
      this.bike.brakeLightMat.emissiveIntensity = isBraking ? 2.8 : 0.8;
    }
    if (this.world.tailLight) {
      this.world.tailLight.intensity = isBraking ? 3.5 : 1.2;
    }

    // Sync lights to player position
    this.world.headLight.position.set(this.playerX, 1.2, this.playerZ + 0.8);
    this.world.tailLight.position.set(this.playerX, 0.8, this.playerZ - 1.0);
  }

  // --- Dynamic 3rd-Person Camera System ---
  updateCamera(dt, speedRatio) {
    const cam = this.world.camera;
    if (!cam) return;

    const targetX = this.playerX * 0.65;
    const targetY = 3.3 + this.suspensionBounce * 0.5;
    const targetZ = this.playerZ - 6.8;

    cam.position.x += (targetX - cam.position.x) * dt * 8.5;
    cam.position.y = targetY;
    cam.position.z = targetZ;

    // Screen Shake (if enabled)
    if (this.cameraShakeEnabled && this.screenShake > 0) {
      cam.position.x += (Math.random() * 2 - 1) * this.screenShake;
      cam.position.y += (Math.random() * 2 - 1) * this.screenShake;
    }

    // Dutch angle roll tilt
    cam.up.set(this.lean * 0.05, 1, 0).normalize();

    // Look slightly ahead
    const lookTarget = new THREE.Vector3(this.playerX * 0.35, 1.5, this.playerZ + 20);
    cam.lookAt(lookTarget);

    // Speed-adaptive dynamic FOV
    const targetFOV = 62 + speedRatio * 12;
    if (Math.abs(cam.fov - targetFOV) > 0.1) {
      cam.fov += (targetFOV - cam.fov) * dt * 4.0;
      cam.updateProjectionMatrix();
    }
  }

  // --- Particle Systems ---
  updateParticles(dt, speedRatio) {
    if (this.speed > 15 && this.bike) {
      const isAccelerating = this.keys.up;
      const spawnCount = isAccelerating ? 2 : 1;

      for (let i = 0; i < spawnCount; i++) {
        const p = this.exhaustParticles.find(spark => spark.life <= 0);
        if (p) {
          const posL = this.bike.exhaustPosL || new THREE.Vector3(0.14, 0.6, -1.1);
          const posR = this.bike.exhaustPosR || new THREE.Vector3(-0.14, 0.6, -1.1);
          const side = Math.random() < 0.5 ? posL : posR;

          p.mesh.position.set(
            this.playerX + side.x + (this.lean * 0.1),
            side.y + this.suspensionBounce,
            this.playerZ + side.z
          );

          if (this.bike.isHover) {
            p.mesh.material.color.set(isAccelerating ? '#00ffff' : '#ff00aa');
          } else {
            p.mesh.material.color.set(isAccelerating ? '#00f0ff' : '#ffaa00');
          }

          p.vel.set(
            (Math.random() * 1.5 - 0.75) - this.lean * 2.0,
            Math.random() * 1.5,
            -20 - Math.random() * 25
          );
          p.life = 0.28;
          p.maxLife = 0.28;
          p.mesh.visible = true;
        }
      }
    }

    for (let i = 0; i < this.exhaustParticles.length; i++) {
      const p = this.exhaustParticles[i];
      if (p.life > 0) {
        p.life -= dt;
        if (p.life <= 0) {
          p.mesh.visible = false;
        } else {
          p.mesh.position.addScaledVector(p.vel, dt);
          p.mesh.material.opacity = p.life / p.maxLife;
        }
      }
    }
  }

  updateCrashDebris(dt) {
    for (let i = 0; i < this.crashDebris.length; i++) {
      const d = this.crashDebris[i];
      if (d.life > 0) {
        d.life -= dt;
        d.vel.y -= 25 * dt; // Gravity
        d.mesh.position.addScaledVector(d.vel, dt);
        d.mesh.rotation.x += d.rotVel.x * dt;
        d.mesh.rotation.y += d.rotVel.y * dt;
        d.mesh.rotation.z += d.rotVel.z * dt;
        if (d.mesh.position.y < 0.1) {
          d.mesh.position.y = 0.1;
          d.vel.y = -d.vel.y * 0.4;
          d.vel.x *= 0.7;
          d.vel.z *= 0.7;
        }
      }
    }
  }

  updateHUD() {
    if (this.ui.speed) this.ui.speed.textContent = Math.round(this.speed);
    if (this.ui.score) this.ui.score.textContent = Math.floor(this.score).toLocaleString();
    if (this.ui.best) this.ui.best.textContent = this.highScore.toLocaleString();
    if (this.ui.hudUsername) this.ui.hudUsername.textContent = this.username;

    if (this.gameMode === 'levels' && this.levelEngine.active && this.levelEngine.levelConfig) {
      const lvl = this.levelEngine.levelConfig;
      const timeLeft = Math.max(0, Math.ceil(this.levelEngine.timeRemaining));
      const distLeft = Math.max(0, Math.round(lvl.targetDistance - this.playerZ));

      if (this.ui.hudLevelTimer) {
        this.ui.hudLevelTimer.textContent = `${timeLeft}s`;
        this.ui.hudLevelTimer.classList.toggle('urgent', timeLeft <= 6);
      }
      if (this.ui.hudLevelDist) {
        this.ui.hudLevelDist.textContent = `${distLeft}m`;
      }
      if (this.ui.hudLevelOvertakes) {
        this.ui.hudLevelOvertakes.textContent = `${this.levelEngine.overtakesCount} / ${lvl.targetOvertakes}`;
      }
      if (this.ui.hudLevelCoins) {
        this.ui.hudLevelCoins.textContent = `${this.levelEngine.coinsCount} / ${lvl.targetCoins}`;
      }
    }
  }

  handleLevelVictory(res) {
    this.state = this.STATE_PAUSED;
    this.audio.stopEngine();
    this.audio.stopMusic();

    const lvlCfg = this.levelEngine.levelConfig;
    if (this.ui.completeLevelTitle) {
      this.ui.completeLevelTitle.textContent = `STAGE ${lvlCfg.level} COMPLETED!`;
    }
    if (this.ui.rewardBase) {
      this.ui.rewardBase.textContent = `+₳ ${res.baseReward.toLocaleString()}`;
    }
    if (this.ui.rewardCoins) {
      this.ui.rewardCoins.textContent = `+₳ ${res.coinBonus.toLocaleString()}`;
    }
    if (this.ui.rewardTime) {
      this.ui.rewardTime.textContent = `+₳ ${res.timeBonus.toLocaleString()}`;
    }
    if (this.ui.rewardTotal) {
      this.ui.rewardTotal.textContent = `+₳ ${res.totalReward.toLocaleString()}`;
    }
    if (this.ui.modalCurrencyBalance) {
      this.ui.modalCurrencyBalance.textContent = this.progression.currency.toLocaleString();
    }

    if (this.ui.levelNextBtn) {
      const hasNext = lvlCfg.level < LEVELS_CONFIG.length;
      this.ui.levelNextBtn.textContent = hasNext ? `STAGE ${lvlCfg.level + 1} ➔` : 'ALL CLEAR! 🎉';
      this.ui.levelNextBtn.disabled = !hasNext;
    }

    if (lvlCfg && lvlCfg.level) {
      this.progression.unlockNextLevel(lvlCfg.level);
    }
    if (this.ui.levelCompleteModal) {
      this.ui.levelCompleteModal.classList.remove('hidden');
    }
    this.updateLobbyCurrency();
    this.renderLevelsGrid();
  }

  handleLevelFailed(reason = 'STAGE FAILED') {
    this.state = this.STATE_GAMEOVER;
    this.audio.stopEngine();
    this.audio.stopMusic();
    if (this.audio.playLevelFailed) this.audio.playLevelFailed();

    const lvlCfg = this.levelEngine.levelConfig;
    if (this.ui.failedReasonText) {
      this.ui.failedReasonText.textContent = reason.toUpperCase();
    }
    if (this.ui.failDistance && lvlCfg) {
      this.ui.failDistance.textContent = `${Math.min(lvlCfg.targetDistance, Math.round(this.playerZ))} / ${lvlCfg.targetDistance} m`;
    }
    if (this.ui.failCoins && lvlCfg) {
      this.ui.failCoins.textContent = `${this.levelEngine.coinsCount} / ${lvlCfg.targetCoins}`;
    }
    if (this.ui.failOvertakes && lvlCfg) {
      this.ui.failOvertakes.textContent = `${this.levelEngine.overtakesCount} / ${lvlCfg.targetOvertakes}`;
    }
    if (this.ui.failTime) {
      this.ui.failTime.textContent = `${Math.max(0, Math.ceil(this.levelEngine.timeRemaining))}s`;
    }

    if (this.ui.levelFailedModal) {
      this.ui.levelFailedModal.classList.remove('hidden');
    }
  }

  showCheckpointToast(text) {
    if (!this.ui.checkpointToast) return;
    this.ui.checkpointToast.textContent = text;
    this.ui.checkpointToast.classList.add('active');
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      if (this.ui.checkpointToast) this.ui.checkpointToast.classList.remove('active');
    }, 1800);
  }

  // ==========================================================================
  // FULLSCREEN & MOBILE ORIENTATION COORDINATION
  // ==========================================================================
  isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  }

  async enterFullscreen() {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        await el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      } else {
        this.showToast('Fullscreen mode is not supported by your browser');
      }
    } catch (err) {
      console.warn('Fullscreen request rejected or denied:', err);
      this.showToast('Fullscreen mode unavailable or denied');
    }

    // Automatically request landscape orientation on interaction
    await this.requestLandscapeOrientation();
  }

  async exitFullscreen() {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (err) {
      console.warn('Exit fullscreen error:', err);
    }
  }

  toggleFullscreen() {
    if (this.isFullscreen()) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  handleFullscreenChange() {
    const active = this.isFullscreen();
    document.body.classList.toggle('fullscreen-active', active);

    // After exiting fullscreen or changing state, restore normal page layout and update orientation guidance
    this.handleResize();
    this.checkOrientationState();
  }

  async requestLandscapeOrientation() {
    try {
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        await screen.orientation.lock('landscape');
        return true;
      } else if (screen.lockOrientation) {
        return screen.lockOrientation('landscape');
      } else if (screen.webkitLockOrientation) {
        return screen.webkitLockOrientation('landscape');
      } else if (screen.mozLockOrientation) {
        return screen.mozLockOrientation('landscape');
      } else if (screen.msLockOrientation) {
        return screen.msLockOrientation('landscape');
      }
    } catch (err) {
      // Browsers like iOS Safari or unpermitted iframes throw or reject orientation locking.
      // This is expected and handled gracefully:
      console.info('Orientation lock could not be applied automatically:', err.message || err);
      return false;
    }
    return false;
  }

  checkOrientationState() {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (!this.ui.portraitOrientationOverlay) return;

    if (!isPortrait) {
      // In landscape: automatically hide portrait overlay and reset user dismissal
      this.ui.portraitOrientationOverlay.classList.add('hidden');
      this.portraitDismissed = false;
    } else {
      // In portrait: show overlay unless dismissed by user
      if (!this.portraitDismissed) {
        this.ui.portraitOrientationOverlay.classList.remove('hidden');
      } else {
        this.ui.portraitOrientationOverlay.classList.add('hidden');
      }
    }
  }

  showToast(message, duration = 2800) {
    if (!this.ui.toastNotification) return;
    this.ui.toastNotification.textContent = message;
    this.ui.toastNotification.classList.remove('hidden');
    if (this.toastTimeoutNotice) clearTimeout(this.toastTimeoutNotice);
    this.toastTimeoutNotice = setTimeout(() => {
      if (this.ui.toastNotification) this.ui.toastNotification.classList.add('hidden');
    }, duration);
  }

  handleResize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.world.onResize(w, h);
    if (this.ui.turntableCanvas && this.turntableRenderer && this.turntableCamera) {
      const rect = this.ui.turntableCanvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.turntableCamera.aspect = rect.width / rect.height;
        this.turntableRenderer.setSize(rect.width, rect.height, false);
        this.updateTurntableFraming();
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.update(dt);
  }
}

// Instantiate game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.neonGame = new NeonHighwayGame3D();
  window.game = window.neonGame;
});
