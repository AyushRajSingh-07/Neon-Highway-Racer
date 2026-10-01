/**
 * Neon Highway - Level Mode Engine
 * Manages 10 progressive objective-based levels, route distances,
 * countdown timer, checkpoint time bonuses, and 3D collectible coins.
 */

const LEVELS_CONFIG = [
  // --- CHAPTER 1: ROOKIE HIGHWAY (Stages 1-10) ---
  { level: 1, name: 'First Flight', map: 'neon', timeOfDay: 'sunset', targetDistance: 1200, targetOvertakes: 5, targetCoins: 6, timeLimit: 45, checkpoints: [600], reward: 400 },
  { level: 2, name: 'Mojave Outrun', map: 'desert', timeOfDay: 'midday', targetDistance: 1400, targetOvertakes: 6, targetCoins: 7, timeLimit: 48, checkpoints: [700], reward: 450 },
  { level: 3, name: 'Alpine Ascent', map: 'mountains', timeOfDay: 'morning', targetDistance: 1600, targetOvertakes: 7, targetCoins: 8, timeLimit: 50, checkpoints: [800], reward: 500 },
  { level: 4, name: 'Metro Midnight', map: 'city', timeOfDay: 'night', targetDistance: 1800, targetOvertakes: 8, targetCoins: 9, timeLimit: 52, checkpoints: [900], reward: 550 },
  { level: 5, name: 'Canyon Heat', map: 'desert', timeOfDay: 'sunset', targetDistance: 2000, targetOvertakes: 9, targetCoins: 10, timeLimit: 55, checkpoints: [1000], reward: 600 },
  { level: 6, name: 'Frost Peak Pass', map: 'mountains', timeOfDay: 'midday', targetDistance: 2200, targetOvertakes: 10, targetCoins: 11, timeLimit: 58, checkpoints: [1100], reward: 650 },
  { level: 7, name: 'Downtown Pulse', map: 'city', timeOfDay: 'midday', targetDistance: 2400, targetOvertakes: 11, targetCoins: 12, timeLimit: 60, checkpoints: [1200], reward: 700 },
  { level: 8, name: 'Grid Overdrive', map: 'neon', timeOfDay: 'night', targetDistance: 2600, targetOvertakes: 12, targetCoins: 13, timeLimit: 62, checkpoints: [850, 1750], reward: 750 },
  { level: 9, name: 'Glacier Sprint', map: 'mountains', timeOfDay: 'morning', targetDistance: 2800, targetOvertakes: 13, targetCoins: 14, timeLimit: 65, checkpoints: [900, 1900], reward: 800 },
  { level: 10, name: 'Rookie Finale', map: 'city', timeOfDay: 'night', targetDistance: 3000, targetOvertakes: 14, targetCoins: 15, timeLimit: 68, checkpoints: [1000, 2000], reward: 950 },

  // --- CHAPTER 2: ASPHALT CHALLENGERS (Stages 11-20) ---
  { level: 11, name: 'Neon Dawn', map: 'neon', timeOfDay: 'morning', targetDistance: 3150, targetOvertakes: 15, targetCoins: 15, timeLimit: 68, checkpoints: [1050, 2100], reward: 1000 },
  { level: 12, name: 'Sunken Valley', map: 'desert', timeOfDay: 'midday', targetDistance: 3300, targetOvertakes: 16, targetCoins: 16, timeLimit: 70, checkpoints: [1100, 2200], reward: 1050 },
  { level: 13, name: 'Highline Express', map: 'city', timeOfDay: 'midday', targetDistance: 3450, targetOvertakes: 16, targetCoins: 16, timeLimit: 72, checkpoints: [1150, 2300], reward: 1100 },
  { level: 14, name: 'Thunder Ridge', map: 'mountains', timeOfDay: 'sunset', targetDistance: 3600, targetOvertakes: 17, targetCoins: 17, timeLimit: 74, checkpoints: [1200, 2400], reward: 1150 },
  { level: 15, name: 'Skyline Drift', map: 'city', timeOfDay: 'morning', targetDistance: 3750, targetOvertakes: 18, targetCoins: 17, timeLimit: 76, checkpoints: [1250, 2500], reward: 1200 },
  { level: 16, name: 'Redrock Dash', map: 'desert', timeOfDay: 'sunset', targetDistance: 3900, targetOvertakes: 18, targetCoins: 18, timeLimit: 78, checkpoints: [1300, 2600], reward: 1250 },
  { level: 17, name: 'Cobalt Horizon', map: 'neon', timeOfDay: 'midday', targetDistance: 4050, targetOvertakes: 19, targetCoins: 18, timeLimit: 80, checkpoints: [1350, 2700], reward: 1300 },
  { level: 18, name: 'Cyber Expressway', map: 'city', timeOfDay: 'night', targetDistance: 4200, targetOvertakes: 20, targetCoins: 19, timeLimit: 82, checkpoints: [1400, 2800], reward: 1350 },
  { level: 19, name: 'Pinnacle Run', map: 'mountains', timeOfDay: 'morning', targetDistance: 4350, targetOvertakes: 20, targetCoins: 19, timeLimit: 84, checkpoints: [1450, 2900], reward: 1400 },
  { level: 20, name: 'Blythe Bypass', map: 'desert', timeOfDay: 'night', targetDistance: 4500, targetOvertakes: 21, targetCoins: 20, timeLimit: 86, checkpoints: [1500, 3000], reward: 1550 },

  // --- CHAPTER 3: HIGH-OCTANE RUSH (Stages 21-30) ---
  { level: 21, name: 'Quantum Corridor', map: 'neon', timeOfDay: 'sunset', targetDistance: 4650, targetOvertakes: 22, targetCoins: 21, timeLimit: 86, checkpoints: [1550, 3100], reward: 1600 },
  { level: 22, name: 'Solaris Highway', map: 'city', timeOfDay: 'midday', targetDistance: 4800, targetOvertakes: 23, targetCoins: 21, timeLimit: 88, checkpoints: [1600, 3200], reward: 1650 },
  { level: 23, name: 'Mistveil Gorge', map: 'mountains', timeOfDay: 'midday', targetDistance: 4950, targetOvertakes: 23, targetCoins: 22, timeLimit: 90, checkpoints: [1650, 3300], reward: 1700 },
  { level: 24, name: 'Avenue of Titans', map: 'city', timeOfDay: 'sunset', targetDistance: 5100, targetOvertakes: 24, targetCoins: 22, timeLimit: 92, checkpoints: [1700, 3400], reward: 1750 },
  { level: 25, name: 'Desert Tempest', map: 'desert', timeOfDay: 'morning', targetDistance: 5250, targetOvertakes: 25, targetCoins: 23, timeLimit: 94, checkpoints: [1300, 2600, 3900], reward: 1850 },
  { level: 26, name: 'Midnight Velocity', map: 'neon', timeOfDay: 'night', targetDistance: 5400, targetOvertakes: 25, targetCoins: 23, timeLimit: 96, checkpoints: [1350, 2700, 4050], reward: 1900 },
  { level: 27, name: 'Summit Rush', map: 'mountains', timeOfDay: 'morning', targetDistance: 5550, targetOvertakes: 26, targetCoins: 24, timeLimit: 98, checkpoints: [1400, 2800, 4200], reward: 1950 },
  { level: 28, name: 'Obsidian Grid', map: 'neon', timeOfDay: 'midday', targetDistance: 5700, targetOvertakes: 27, targetCoins: 24, timeLimit: 100, checkpoints: [1450, 2900, 4350], reward: 2000 },
  { level: 29, name: 'Mirage Trail', map: 'desert', timeOfDay: 'sunset', targetDistance: 5850, targetOvertakes: 27, targetCoins: 25, timeLimit: 102, checkpoints: [1500, 3000, 4500], reward: 2100 },
  { level: 30, name: 'Metropolis Core', map: 'city', timeOfDay: 'night', targetDistance: 6000, targetOvertakes: 28, targetCoins: 26, timeLimit: 104, checkpoints: [1500, 3000, 4500], reward: 2300 },

  // --- CHAPTER 4: MIDNIGHT SYNDICATE (Stages 31-40) ---
  { level: 31, name: 'Avalanche Pass', map: 'mountains', timeOfDay: 'midday', targetDistance: 6150, targetOvertakes: 29, targetCoins: 26, timeLimit: 106, checkpoints: [1550, 3100, 4650], reward: 2400 },
  { level: 32, name: 'Plasma Parkway', map: 'neon', timeOfDay: 'morning', targetDistance: 6300, targetOvertakes: 30, targetCoins: 27, timeLimit: 108, checkpoints: [1600, 3200, 4800], reward: 2500 },
  { level: 33, name: 'Canyon Vortex', map: 'desert', timeOfDay: 'midday', targetDistance: 6450, targetOvertakes: 30, targetCoins: 27, timeLimit: 110, checkpoints: [1600, 3250, 4900], reward: 2600 },
  { level: 34, name: 'Neon Zenith', map: 'neon', timeOfDay: 'sunset', targetDistance: 6600, targetOvertakes: 31, targetCoins: 28, timeLimit: 112, checkpoints: [1650, 3300, 4950], reward: 2700 },
  { level: 35, name: 'Alpine Blitz', map: 'mountains', timeOfDay: 'night', targetDistance: 6750, targetOvertakes: 32, targetCoins: 28, timeLimit: 114, checkpoints: [1700, 3400, 5100], reward: 2800 },
  { level: 36, name: 'Overdrive Avenue', map: 'city', timeOfDay: 'morning', targetDistance: 6900, targetOvertakes: 33, targetCoins: 29, timeLimit: 116, checkpoints: [1750, 3500, 5250], reward: 2950 },
  { level: 37, name: 'Dune Scramble', map: 'desert', timeOfDay: 'sunset', targetDistance: 7050, targetOvertakes: 33, targetCoins: 29, timeLimit: 118, checkpoints: [1750, 3550, 5300], reward: 3050 },
  { level: 38, name: 'Cyber Sub-Zero', map: 'mountains', timeOfDay: 'morning', targetDistance: 7200, targetOvertakes: 34, targetCoins: 30, timeLimit: 120, checkpoints: [1800, 3600, 5400], reward: 3150 },
  { level: 39, name: 'Skyscraper Boulevard', map: 'city', timeOfDay: 'midday', targetDistance: 7350, targetOvertakes: 35, targetCoins: 30, timeLimit: 122, checkpoints: [1850, 3700, 5550], reward: 3300 },
  { level: 40, name: 'Viper Canyon', map: 'desert', timeOfDay: 'night', targetDistance: 7500, targetOvertakes: 36, targetCoins: 31, timeLimit: 124, checkpoints: [1900, 3800, 5700], reward: 3500 },

  // --- CHAPTER 5: APEX GRAND PRIX (Stages 41-50) ---
  { level: 41, name: 'Hyperion Highway', map: 'neon', timeOfDay: 'night', targetDistance: 7650, targetOvertakes: 37, targetCoins: 32, timeLimit: 126, checkpoints: [1500, 3050, 4600, 6150], reward: 3650 },
  { level: 42, name: 'Cloudburst Peak', map: 'mountains', timeOfDay: 'midday', targetDistance: 7800, targetOvertakes: 38, targetCoins: 32, timeLimit: 128, checkpoints: [1550, 3100, 4700, 6250], reward: 3800 },
  { level: 43, name: 'Neo Shibuya', map: 'city', timeOfDay: 'sunset', targetDistance: 7950, targetOvertakes: 38, targetCoins: 33, timeLimit: 130, checkpoints: [1600, 3200, 4800, 6400], reward: 3950 },
  { level: 44, name: 'Inferno Valley', map: 'desert', timeOfDay: 'midday', targetDistance: 8100, targetOvertakes: 39, targetCoins: 33, timeLimit: 132, checkpoints: [1600, 3250, 4900, 6500], reward: 4100 },
  { level: 45, name: 'Omega Grid', map: 'neon', timeOfDay: 'morning', targetDistance: 8250, targetOvertakes: 40, targetCoins: 34, timeLimit: 134, checkpoints: [1650, 3300, 5000, 6650], reward: 4250 },
  { level: 46, name: 'Starlight Pass', map: 'mountains', timeOfDay: 'night', targetDistance: 8400, targetOvertakes: 41, targetCoins: 35, timeLimit: 136, checkpoints: [1700, 3400, 5100, 6750], reward: 4400 },
  { level: 47, name: 'Titanium Boulevard', map: 'city', timeOfDay: 'morning', targetDistance: 8550, targetOvertakes: 42, targetCoins: 35, timeLimit: 138, checkpoints: [1700, 3450, 5200, 6900], reward: 4600 },
  { level: 48, name: 'Sahara Supersonic', map: 'desert', timeOfDay: 'sunset', targetDistance: 8700, targetOvertakes: 43, targetCoins: 36, timeLimit: 140, checkpoints: [1750, 3500, 5300, 7050], reward: 4800 },
  { level: 49, name: 'Apex Crucible', map: 'neon', timeOfDay: 'night', targetDistance: 8850, targetOvertakes: 44, targetCoins: 37, timeLimit: 142, checkpoints: [1800, 3600, 5400, 7200], reward: 5200 },
  { level: 50, name: 'Cyber Legend Finale', map: 'city', timeOfDay: 'night', targetDistance: 9000, targetOvertakes: 45, targetCoins: 38, timeLimit: 145, checkpoints: [1800, 3600, 5400, 7200], reward: 6000 }
];

LEVELS_CONFIG.forEach(l => {
  l.levelNumber = l.level;
  l.baseReward = l.reward;
});

class LevelEngine {
  constructor(world, models, audio, progression) {
    this.world = world;
    this.models = models;
    this.audio = audio;
    this.progression = progression;

    this.active = false;
    this.currentLevelNum = 1;
    this.levelConfig = null;

    // Trackers
    this.timeRemaining = 0;
    this.overtakesCount = 0;
    this.coinsCount = 0;
    this.checkpointsPassed = new Set();
    this.finishReached = false;

    // 3D Objects
    this.coins = [];
    this.checkpointMeshes = [];
    this.finishGantry = null;

    // Notification banner
    this.checkpointBannerTimer = 0;
  }

  getLevelConfig(levelNum) {
    return LEVELS_CONFIG.find(l => l.level === levelNum) || LEVELS_CONFIG[0];
  }

  startLevel(levelNum) {
    this.clearObjects();
    this.currentLevelNum = levelNum;
    this.levelConfig = this.getLevelConfig(levelNum);
    this.active = true;

    // Reset trackers
    this.timeRemaining = this.levelConfig.timeLimit;
    this.overtakesCount = 0;
    this.coinsCount = 0;
    this.checkpointsPassed = new Set();
    this.finishReached = false;
    this.checkpointBannerTimer = 0;

    // Spawn 3D Coins along playable highway lanes
    this.spawnLevelCoins();

    // Spawn Checkpoints & Finish Line
    this.spawnLevelCheckpoints();
  }

  spawnLevelCoins() {
    const lanes = [4.6, 0.0, -4.6];
    const totalCoins = Math.max(this.levelConfig.targetCoins + 8, Math.round(this.levelConfig.targetCoins * 1.35)); // Generous coin abundance so targets are achievable!
    const step = (this.levelConfig.targetDistance - 250) / totalCoins;

    for (let i = 0; i < totalCoins; i++) {
      const z = 120 + i * step + (Math.sin(i * 1.7) * 20);
      const lane = lanes[i % lanes.length];

      const coinModel = this.models.createCoinModel();
      coinModel.position.set(lane, 0.75, z);
      this.world.scene.add(coinModel);

      this.coins.push({
        x: lane,
        z: z,
        mesh: coinModel,
        collected: false
      });
    }
  }

  spawnLevelCheckpoints() {
    // Checkpoints
    for (const cpZ of this.levelConfig.checkpoints) {
      const arch = this.models.createCheckpointArchModel();
      arch.position.set(0, 0, cpZ);
      this.world.scene.add(arch);
      this.checkpointMeshes.push({ z: cpZ, mesh: arch });
    }

    // Finish Line Gantry
    this.finishGantry = this.models.createFinishLineModel();
    this.finishGantry.position.set(0, 0, this.levelConfig.targetDistance);
    this.world.scene.add(this.finishGantry);
  }

  update(dt, playerZ, playerX, playerSpeed) {
    if (!this.active) return { state: 'inactive' };

    // 1. Decrement countdown timer
    this.timeRemaining -= dt;

    // Checkpoint banner timer
    if (this.checkpointBannerTimer > 0) {
      this.checkpointBannerTimer -= dt;
    }

    // Timer expired fail condition
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.active = false;
      return { state: 'failed', reason: 'time_expired' };
    }

    // 2. Animate and check coins
    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];
      if (coin.collected) continue;

      // Spin rotation
      coin.mesh.rotation.y += dt * 3.8;
      coin.mesh.position.y = 0.75 + Math.sin(performance.now() * 0.005 + coin.z) * 0.12;

      // Pickup Hit Check
      const dz = Math.abs(coin.z - playerZ);
      const dx = Math.abs(coin.x - playerX);

      if (dz < 2.4 && dx < 1.4) {
        coin.collected = true;
        this.world.scene.remove(coin.mesh);
        this.coinsCount++;

        // Coin sound & reward
        if (this.audio && this.audio.playCoin) this.audio.playCoin();
        this.progression.addCurrency(10); // Immediate +10₳ per coin picked up!
      }
    }

    // 3. Checkpoint Trigger Check
    for (const cp of this.checkpointMeshes) {
      if (!this.checkpointsPassed.has(cp.z) && playerZ >= cp.z) {
        this.checkpointsPassed.add(cp.z);
        this.timeRemaining += 15.0; // Add +15 seconds!
        this.checkpointBannerTimer = 3.2;

        if (this.audio && this.audio.playCheckpoint) this.audio.playCheckpoint();
      }
    }

    // 4. Finish Line Reached Check
    if (!this.finishReached && playerZ >= this.levelConfig.targetDistance) {
      this.finishReached = true;
      this.active = false;

      // Check objectives
      const overtakesOk = this.overtakesCount >= this.levelConfig.targetOvertakes;
      const coinsOk = this.coinsCount >= this.levelConfig.targetCoins;

      if (overtakesOk && coinsOk && this.timeRemaining > 0) {
        // Calculate transparent bonuses
        const baseReward = this.levelConfig.reward;
        const timeBonus = Math.floor(this.timeRemaining) * 12; // 12₳ per second left
        const coinBonus = this.coinsCount * 15;
        const totalReward = baseReward + timeBonus + coinBonus;

        this.progression.addCurrency(totalReward);
        this.progression.unlockNextLevel(this.currentLevelNum);

        if (this.audio && this.audio.playLevelComplete) this.audio.playLevelComplete();

        return {
          state: 'completed',
          levelNum: this.currentLevelNum,
          baseReward,
          timeBonus,
          coinBonus,
          totalReward,
          timeRemaining: this.timeRemaining,
          overtakes: this.overtakesCount,
          coins: this.coinsCount
        };
      } else {
        return {
          state: 'failed',
          reason: 'objectives_missed',
          missedOvertakes: !overtakesOk,
          missedCoins: !coinsOk
        };
      }
    }

    return {
      state: 'running',
      timeRemaining: this.timeRemaining,
      overtakes: this.overtakesCount,
      targetOvertakes: this.levelConfig.targetOvertakes,
      coins: this.coinsCount,
      targetCoins: this.levelConfig.targetCoins,
      distance: playerZ,
      targetDistance: this.levelConfig.targetDistance,
      checkpointBanner: this.checkpointBannerTimer > 0
    };
  }

  onCarOvertaken() {
    if (this.active) {
      this.overtakesCount++;
    }
  }

  cleanup() {
    this.active = false;
    this.clearObjects();
  }

  clearObjects() {
    for (let i = 0; i < this.coins.length; i++) {
      if (this.coins[i].mesh) {
        this.world.scene.remove(this.coins[i].mesh);
      }
    }
    this.coins = [];

    for (let i = 0; i < this.checkpointMeshes.length; i++) {
      if (this.checkpointMeshes[i].mesh) {
        this.world.scene.remove(this.checkpointMeshes[i].mesh);
      }
    }
    this.checkpointMeshes = [];

    if (this.finishGantry) {
      this.world.scene.remove(this.finishGantry);
      this.finishGantry = null;
    }
  }
}

if (typeof window !== 'undefined') {
  window.LEVELS_CONFIG = LEVELS_CONFIG;
  window.LevelEngine = LevelEngine;
}
if (typeof module !== 'undefined') {
  module.exports = { LevelEngine, LEVELS_CONFIG };
}
