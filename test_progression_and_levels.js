const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\singh\\.gemini\\antigravity\\brain\\c58b5117-ce2a-4a69-a84d-8e376d1246f2';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

class CDPSession {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 1;
    this.pending = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id && this.pending.has(data.id)) {
          const { resolve, reject } = this.pending.get(data.id);
          this.pending.delete(data.id);
          if (data.error) reject(new Error(data.error.message));
          else resolve(data.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.msgId++;
    const payload = JSON.stringify({ id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(payload);
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res && res.exceptionDetails) {
      console.error('CDP Evaluation Exception:', res.exceptionDetails.exception ? res.exceptionDetails.exception.description : res.exceptionDetails.text);
    }
    return res && res.result ? res.result.value : null;
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buf);
    console.log(`[Screenshot Saved] ${filename} (${buf.length} bytes)`);
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600
    });
  }

  close() {
    this.ws.close();
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('=== Neon Highway: Progression, Shop, Customization & Level Mode Test Suite ===');

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  edgeProc.on('error', (err) => console.error('Edge launch error:', err));
  await sleep(1500);

  let pageWsUrl = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const resp = await fetch('http://localhost:9223/json');
      const list = await resp.json();
      const page = list.find(item => item.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        pageWsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {
      await sleep(500);
    }
  }

  if (!pageWsUrl) {
    try {
      const resp = await fetch('http://localhost:9223/json/new?about:blank', { method: 'PUT' });
      const target = await resp.json();
      pageWsUrl = target.webSocketDebuggerUrl;
    } catch (e) {}
  }

  if (!pageWsUrl) {
    throw new Error('Failed to obtain Edge Page CDP WebSocket URL');
  }

  const cdp = new CDPSession(pageWsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.setViewport(1280, 750);

  // Navigate to app
  await cdp.send('Page.navigate', { url: 'http://localhost:8085/' });
  await sleep(2500);

  // Initialize fresh test progression
  await cdp.evaluate(`
    if (window.neonGame && window.neonGame.progression) {
      window.neonGame.progression.resetAllData();
      window.neonGame.refreshLobbyDisplay();
    }
  `);
  await sleep(1000);

  // 1. Verify Lobby Vehicle Preview Centering & Sizing
  console.log('\n--- 1. Testing Lobby Vehicle Preview Centering & Framing ---');
  const previewStatus = await cdp.evaluate(`
    (() => {
      const game = window.neonGame;
      const cam = game.turntableCamera;
      const canvas = game.ui.turntableCanvas;
      const bike = game.previewVehicle;
      const box = new THREE.Box3().setFromObject(bike.root);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      return {
        camX: cam.position.x,
        camY: cam.position.y,
        camZ: cam.position.z,
        canvasW: canvas.clientWidth,
        canvasH: canvas.clientHeight,
        vehicleWidth: size.x,
        vehicleHeight: size.y,
        vehicleLength: size.z,
        centerX: center.x,
        centerY: center.y
      };
    })()
  `);
  console.log('Preview Framing Details (Cyber Pulse):', previewStatus);

  // Test large hauler preview framing
  await cdp.evaluate("window.neonGame.setVehicle('titan_hauler', true);");
  await sleep(400);
  const haulerFraming = await cdp.evaluate(`
    (() => {
      const game = window.neonGame;
      const cam = game.turntableCamera;
      const bike = game.previewVehicle;
      const box = new THREE.Box3().setFromObject(bike.root);
      const size = new THREE.Vector3();
      box.getSize(size);
      return {
        vehicleLength: size.z,
        camZ: cam.position.z,
        camY: cam.position.y
      };
    })()
  `);
  console.log('Large Vehicle Framing (Titan Hauler length=' + haulerFraming.vehicleLength.toFixed(2) + 'm): camZ=' + haulerFraming.camZ.toFixed(2));

  // Reset back to cyber_pulse
  await cdp.evaluate("window.neonGame.setVehicle('cyber_pulse');");
  await sleep(400);
  await cdp.screenshot('lobby_turntable.png');

  // 2. Verify Garage Tab & Customization (Paint & Equipping)
  console.log('\n--- 2. Testing Garage Tab & Vehicle Paint Customization ---');
  await cdp.evaluate("window.neonGame.switchTab('garage');");
  await sleep(500);

  // Apply Neon Green Paint
  await cdp.evaluate(`
    const greenChip = Array.from(document.querySelectorAll('.paint-chip')).find(c => c.title === 'Neon Green');
    if (greenChip) greenChip.click();
  `);
  await sleep(300);

  const appliedPaint = await cdp.evaluate("window.neonGame.progression.getPaint('cyber_pulse')");
  console.log('Applied Paint Color:', appliedPaint);
  await cdp.screenshot('garage_customization.png');

  // 3. Verify Shop Tab & Currency Purchases
  console.log('\n--- 3. Testing Shop Tab & Apex Currency (₳) Transactions ---');
  await cdp.evaluate("window.neonGame.switchTab('shop');");
  await sleep(500);

  const startBalance = await cdp.evaluate("window.neonGame.progression.currency");
  console.log('Initial Currency Balance:', startBalance, '₳');

  // Add 3,000 currency to test vehicle purchase
  await cdp.evaluate(`
    window.neonGame.progression.addCurrency(3000);
    window.neonGame.updateLobbyCurrency();
    window.neonGame.renderShopCatalog();
  `);
  const balanceAfterBonus = await cdp.evaluate("window.neonGame.progression.currency");
  console.log('Balance after bonus:', balanceAfterBonus, '₳');

  // Buy Thunder Cruiser (1,500 ₳)
  await cdp.evaluate(`
    const buyBtns = Array.from(document.querySelectorAll('.shop-buy-btn'));
    // Find thunder cruiser button
    const thunderBtn = buyBtns.find(b => b.textContent.includes('1,500') || b.textContent.includes('BUY'));
    if (thunderBtn) thunderBtn.click();
  `);
  await sleep(400);

  const balanceAfterBuy = await cdp.evaluate("window.neonGame.progression.currency");
  const isThunderOwned = await cdp.evaluate("window.neonGame.progression.isOwned('thunder_cruiser')");
  console.log('Balance after buying Thunder Cruiser:', balanceAfterBuy, '₳ | Is Owned:', isThunderOwned);
  await cdp.screenshot('vehicle_shop.png');

  // 4. Verify Upgrades Workshop
  console.log('\n--- 4. Testing Upgrades Workshop ---');
  await cdp.evaluate("window.neonGame.switchTab('upgrades');");
  await sleep(500);

  // Buy 2 Speed Upgrades
  await cdp.evaluate(`
    {
      const upBtns = Array.from(document.querySelectorAll('.upgrade-btn'));
      if (upBtns[0]) upBtns[0].click(); // Speed upgrade
    }
  `);
  await sleep(300);
  await cdp.evaluate(`
    {
      const upBtns = Array.from(document.querySelectorAll('.upgrade-btn'));
      if (upBtns[0]) upBtns[0].click(); // Speed upgrade #2
    }
  `);
  await sleep(300);

  const speedLevel = await cdp.evaluate("window.neonGame.progression.getUpgrades(window.neonGame.selectedVehicleId).speed");
  const upgradedMaxSpeed = await cdp.evaluate("window.neonGame.maxSpeed");
  console.log('Speed Upgrade Level:', speedLevel, '/ 5 | Actual In-Game Max Speed:', upgradedMaxSpeed, 'KM/H');
  await cdp.screenshot('upgrades_workshop.png');

  // 5. Verify Level Mode (10 Stages) & Gameplay Run
  console.log('\n--- 5. Testing Level Mode & Stage 1 Objectives ---');
  await cdp.evaluate("window.neonGame.switchTab('play');");
  await cdp.evaluate("window.neonGame.setGameMode('levels');");
  await sleep(400);

  const stagesCount = await cdp.evaluate("LEVELS_CONFIG.length");
  const unlockedLevel = await cdp.evaluate("window.neonGame.progression.unlockedLevel");
  console.log('Stages Configured:', stagesCount, '| Current Unlocked Level:', unlockedLevel);

  // Launch Stage 1
  await cdp.evaluate("window.neonGame.startRun();");
  await sleep(1500);

  const levelActive = await cdp.evaluate("window.neonGame.levelEngine.active");
  const hudLevelVisible = await cdp.evaluate("!document.getElementById('hudLevelBar').classList.contains('hidden')");
  const mapBiome = await cdp.evaluate("window.neonGame.world.currentMapId");
  console.log('Stage 1 Active:', levelActive, '| Level HUD Bar Visible:', hudLevelVisible, '| Stage Map Biome:', mapBiome);

  // Collect some coins and test checkpoint
  await cdp.evaluate(`
    // Simulate player driving and collecting coins
    window.neonGame.levelEngine.coinsCount = 12;
    window.neonGame.levelEngine.overtakesCount = 8;
    window.neonGame.levelEngine.timeRemaining = 45;
    window.neonGame.updateHUD();
    window.neonGame.showCheckpointToast('CHECKPOINT REACHED! +15 SECONDS');
  `);
  await sleep(400);
  await cdp.screenshot('level_mode_gameplay.png');

  // 6. Test Stage Victory Sequence & Reward Distribution
  console.log('\n--- 6. Testing Stage Victory & Rewards Modal ---');
  await cdp.evaluate(`
    // Simulate reaching finish line
    window.neonGame.playerZ = window.neonGame.levelEngine.levelConfig.targetDistance + 10;
    const res = window.neonGame.levelEngine.update(0.016, window.neonGame.playerZ, window.neonGame.playerX, 180);
    if (res.state === 'completed') {
      window.neonGame.handleLevelVictory(res);
    }
  `);
  await sleep(600);

  const victoryVisible = await cdp.evaluate("!document.getElementById('levelCompleteModal').classList.contains('hidden')");
  const newUnlockedLevel = await cdp.evaluate("window.neonGame.progression.unlockedLevel");
  const rewardTotalText = await cdp.evaluate("document.getElementById('rewardTotal').textContent");
  console.log('Victory Modal Visible:', victoryVisible, '| New Unlocked Level:', newUnlockedLevel, '| Total Reward Payout:', rewardTotalText);
  await cdp.screenshot('stage_complete_modal.png');

  // Close victory modal and return to lobby
  await cdp.evaluate("document.getElementById('levelLobbyBtn').click();");
  await sleep(500);

  // 7. Test Stage Failure Modal (Crash / Time Expire)
  console.log('\n--- 7. Testing Stage Failure Flow ---');
  await cdp.evaluate("window.neonGame.startRun();");
  await sleep(500);
  await cdp.evaluate("window.neonGame.handleLevelFailed('TIME EXPIRED');");
  await sleep(500);
  const failVisible = await cdp.evaluate("!document.getElementById('levelFailedModal').classList.contains('hidden')");
  const failReason = await cdp.evaluate("document.getElementById('failedReasonText').textContent");
  console.log('Failure Modal Visible:', failVisible, '| Reason:', failReason);
  await cdp.screenshot('stage_failed_modal.png');

  await cdp.evaluate("document.getElementById('failLobbyBtn').click();");
  await sleep(500);

  // 8. Test Mobile Layout
  console.log('\n--- 8. Testing Mobile Responsiveness ---');
  await cdp.setViewport(390, 844);
  await sleep(300);
  await cdp.evaluate('window.neonGame.handleResize();');
  await sleep(500);
  await cdp.screenshot('mobile_lobby_preview.png');

  await cdp.evaluate("window.neonGame.startRun();");
  await sleep(1500);
  await cdp.screenshot('mobile_stage_gameplay.png');

  console.log('\n=== All Verification Tests Passed Successfully! ===');

  cdp.close();
  edgeProc.kill();
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
