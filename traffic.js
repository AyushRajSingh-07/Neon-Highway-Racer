/**
 * Neon Highway - 3D Traffic Engine
 * Manages 3-lane AI vehicles (Cyber Sedans, Heavy Haulers, Coupes),
 * 3D positions, lane changing AI, near-misses, density presets, and dynamic score difficulty.
 */

class TrafficEngine3D {
  constructor(world, models) {
    this.world = world;
    this.models = models;
    this.cars = [];
    this.lastSpawnZ = 0;

    // Traffic Density Settings ('low' | 'normal' | 'high')
    this.density = 'normal';
    this.maxCars = 14;
    this.spawnDistance = 60.0;
    this.speedMult = 1.0;
    this.applyDensity('normal');

    // Lane centers in 3D world units: Left (+4.6), Center (0.0), Right (-4.6)
    this.lanes = [4.6, 0.0, -4.6];

    // Archetype definitions
    this.archetypes = [
      { type: 'sedan', speedMin: 70, speedMax: 105, colors: ['#00f0ff', '#0077ff', '#00ffaa'] },
      { type: 'hauler', speedMin: 45, speedMax: 75, colors: ['#ffaa00'] },
      { type: 'coupe', speedMin: 110, speedMax: 155, colors: ['#ff007f', '#aa00ff', '#ff3300'] }
    ];
  }

  setDensity(preset) {
    this.density = preset;
    this.applyDensity(preset);
  }

  applyDensity(preset) {
    if (preset === 'low') {
      this.maxCars = 9;
      this.spawnDistance = 80.0;
      this.speedMult = 0.92;
    } else if (preset === 'high') {
      this.maxCars = 18;
      this.spawnDistance = 45.0;
      this.speedMult = 1.08;
    } else { // normal
      this.maxCars = 14;
      this.spawnDistance = 60.0;
      this.speedMult = 1.0;
    }
  }

  reset() {
    // Remove all 3D meshes from scene
    for (let i = 0; i < this.cars.length; i++) {
      if (this.cars[i].mesh) {
        this.world.scene.remove(this.cars[i].mesh);
      }
    }
    this.cars = [];
    this.lastSpawnZ = 0;

    // Seed initial traffic ahead so player immediately engages
    this.spawnCar(60, 1.0);
    this.spawnCar(105, 1.0);
    this.spawnCar(155, 1.0);
    if (this.density !== 'low') {
      this.spawnCar(205, 1.0);
    }
  }

  update(playerZ, playerX, playerSpeed, dt, currentRunScore = 0) {
    // Difficulty Factor scales strictly with CURRENT RUN SCORE (resets every run)
    // Starts at 1.0 and increases progressively up to 2.2x
    const difficultyFactor = 1.0 + Math.min(1.2, (currentRunScore / 3000));

    // 1. Move and update existing traffic vehicles
    for (let i = this.cars.length - 1; i >= 0; i--) {
      const car = this.cars[i];

      // Convert km/h to world speed units
      const worldSpeed = (car.speed / 3.6);
      car.z += worldSpeed * dt;

      // Wheel rotation animation
      const wheelRotDelta = (worldSpeed / 0.35) * dt;
      if (car.wheels) {
        for (let w = 0; w < car.wheels.length; w++) {
          car.wheels[w].rotation.x += wheelRotDelta;
        }
      }

      // Coupe AI: Lane Changing Behavior
      if (car.type === 'coupe') {
        car.laneTimer -= dt;
        if (car.laneTimer <= 0) {
          car.laneTimer = 3.5 + Math.random() * 5.0;
          const currentLaneIdx = this.lanes.indexOf(car.targetX);
          let newLaneIdx = currentLaneIdx;
          if (currentLaneIdx === 0) newLaneIdx = 1;
          else if (currentLaneIdx === 2) newLaneIdx = 1;
          else newLaneIdx = Math.random() < 0.5 ? 0 : 2;

          car.targetX = this.lanes[newLaneIdx];
          car.changingLane = true;
          car.blinkerTimer = 0;
        }

        // Smooth lateral steering interpolation
        if (Math.abs(car.x - car.targetX) > 0.05) {
          const steerDir = Math.sign(car.targetX - car.x);
          car.x += steerDir * dt * 4.2;

          // Animate turn blinker:
          // steerDir > 0 -> moving toward +X (Left on screen) -> Left Blinker
          // steerDir < 0 -> moving toward -X (Right on screen) -> Right Blinker
          car.blinkerTimer += dt;
          const blinkOn = Math.floor(car.blinkerTimer * 7) % 2 === 0;
          if (car.blinkerMatL && car.blinkerMatR) {
            car.blinkerMatL.visible = steerDir > 0 && blinkOn;
            car.blinkerMatR.visible = steerDir < 0 && blinkOn;
          }

          car.mesh.rotation.z = -steerDir * 0.05;
        } else {
          car.x = car.targetX;
          car.changingLane = false;
          car.mesh.rotation.z = 0;
          if (car.blinkerMatL) car.blinkerMatL.visible = false;
          if (car.blinkerMatR) car.blinkerMatR.visible = false;
        }
      }

      // Update 3D mesh position
      car.mesh.position.set(car.x, 0, car.z);

      // Despawn vehicles that fall far behind camera
      if (car.z < playerZ - 30.0) {
        this.world.scene.remove(car.mesh);
        this.cars.splice(i, 1);
      }
    }

    // 2. Spawn new vehicles ahead
    const spawnZ = playerZ + 220;
    const requiredGap = (this.spawnDistance / difficultyFactor);
    if (this.cars.length < this.maxCars && (spawnZ - this.lastSpawnZ) > requiredGap) {
      this.spawnCar(spawnZ, difficultyFactor);
      this.lastSpawnZ = spawnZ;
    }
  }

  spawnCar(targetZ, difficultyFactor) {
    let laneIdx = Math.floor(Math.random() * 3);
    // Keep center lane clear at launch for smooth player acceleration
    if (targetZ < 75) {
      laneIdx = Math.random() < 0.5 ? 0 : 2;
    }
    const laneX = this.lanes[laneIdx];

    // Don't spawn on top of another vehicle
    const isOccupied = this.cars.some(c => Math.abs(c.z - targetZ) < 26 && Math.abs(c.x - laneX) < 1.5);
    if (isOccupied) return;

    // Pick archetype
    const rand = Math.random() * 10;
    let arch = this.archetypes[0]; // Sedan
    if (rand > 7) arch = this.archetypes[1]; // Hauler
    else if (rand > 4) arch = this.archetypes[2]; // Coupe

    const color = arch.colors[Math.floor(Math.random() * arch.colors.length)];
    let modelData = null;

    if (arch.type === 'sedan') {
      modelData = this.models.createSedanModel(color);
    } else if (arch.type === 'hauler') {
      modelData = this.models.createHaulerModel();
    } else if (arch.type === 'coupe') {
      modelData = this.models.createCoupeModel(color);
    }

    const baseSpeed = arch.speedMin + Math.random() * (arch.speedMax - arch.speedMin);
    const speed = (baseSpeed + (difficultyFactor - 1) * 14) * this.speedMult;

    modelData.root.position.set(laneX, 0, targetZ);
    this.world.scene.add(modelData.root);

    this.cars.push({
      type: arch.type,
      x: laneX,
      targetX: laneX,
      z: targetZ,
      speed: speed,
      width: modelData.width,
      length: modelData.length,
      height: modelData.height,
      mesh: modelData.root,
      wheels: modelData.wheels,
      blinkerMatL: modelData.blinkerMatL,
      blinkerMatR: modelData.blinkerMatR,
      nearMissed: false,
      whooshPlayed: false,
      laneTimer: 2.0 + Math.random() * 4.0,
      changingLane: false,
      blinkerTimer: 0
    });

    // High difficulty: occasional paired block vehicle in adjacent lane (leaves 1 open lane)
    if (difficultyFactor > 1.35 && Math.random() < 0.45 && this.cars.length < this.maxCars) {
      const otherLanes = [0, 1, 2].filter(l => l !== laneIdx);
      const secondLaneIdx = otherLanes[Math.floor(Math.random() * otherLanes.length)];
      const secondLaneX = this.lanes[secondLaneIdx];

      const sModel = this.models.createSedanModel('#00f0ff');
      sModel.root.position.set(secondLaneX, 0, targetZ + 14);
      this.world.scene.add(sModel.root);

      this.cars.push({
        type: 'sedan',
        x: secondLaneX,
        targetX: secondLaneX,
        z: targetZ + 14,
        speed: speed * 0.95,
        width: sModel.width,
        length: sModel.length,
        height: sModel.height,
        mesh: sModel.root,
        wheels: sModel.wheels,
        nearMissed: false,
        whooshPlayed: false,
        laneTimer: 9999,
        changingLane: false,
        blinkerTimer: 0
      });
    }
  }

  // --- 3D Proximity, Near-Miss & Collision Detection ---
  checkInteractions(playerX, playerZ, playerSpeed) {
    let collision = false;
    let nearMiss = false;
    let nearMissCar = null;
    let hitCar = null;
    let overtakesCount = 0;

    const playerWidth = 1.0;
    const playerLength = 2.4;

    for (let i = 0; i < this.cars.length; i++) {
      const car = this.cars[i];
      const relZ = car.z - playerZ;
      const lateralDist = Math.abs(playerX - car.x);

      // Doppler Whoosh Sound when overtaking traffic
      if (!car.whooshPlayed && relZ < 5 && relZ > -5 && playerSpeed > car.speed + 15) {
        car.whooshPlayed = true;
        if (window.neonAudio) {
          const pan = car.x / 6.0;
          window.neonAudio.playPassWhoosh(pan);
        }
      }

      // Overtake counter (when car is passed from behind)
      if (!car.overtaken && relZ < -1.0 && playerSpeed > car.speed) {
        car.overtaken = true;
        overtakesCount++;
      }

      // Bounding Box overlap thresholds
      const collisionThresholdX = (playerWidth / 2) + (car.width / 2) * 0.85;
      const collisionThresholdZ = (playerLength / 2) + (car.length / 2) * 0.85;

      // 1. 3D Collision Check
      if (Math.abs(relZ) < collisionThresholdZ && lateralDist < collisionThresholdX) {
        collision = true;
        hitCar = car;
        break;
      }

      // 2. Risk-Reward Near Miss Check
      if (!car.nearMissed && relZ < -0.8 && relZ > -6.0 && playerSpeed > car.speed + 15) {
        const nearMissThresholdX = collisionThresholdX + 1.8;
        if (lateralDist < nearMissThresholdX) {
          car.nearMissed = true;
          nearMiss = true;
          nearMissCar = car;
        }
      }
    }

    return { collision, hitCar, nearMiss, nearMissCar, overtakesCount };
  }
}

if (typeof window !== 'undefined') window.TrafficEngine3D = TrafficEngine3D;
if (typeof module !== 'undefined') module.exports = TrafficEngine3D;
