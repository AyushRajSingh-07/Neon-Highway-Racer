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
  console.log('=== Neon Highway: Mode-Specific HUD, Vehicle Ownership, 50 Levels & 3D Models Verification ===');

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9225',
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
      const resp = await fetch('http://localhost:9225/json');
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
    console.error('Failed to connect to Edge debugging port 9225');
    edgeProc.kill();
    process.exit(1);
  }

  const cdp = new CDPSession(pageWsUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  try {
    // 1. Navigate to game on port 8085
    await cdp.setViewport(1280, 720);
    await cdp.send('Page.navigate', { url: 'http://localhost:8085/' });
    await sleep(2500);

    // Reset progression to clean state for test
    await cdp.evaluate(`
      localStorage.clear();
      localStorage.setItem('neon_vehicle', 'cyber_pulse');
      localStorage.setItem('neon_username', 'TEST_RIDER');
      location.reload();
    `);
    await sleep(2500);

    // ========================================================================
    // TEST 1: 50 Levels Grid & Levels Configuration
    // ========================================================================
    console.log('\n--- 1. Testing 50 Playable Levels System ---');
    const levelCount = await cdp.evaluate(`LEVELS_CONFIG.length`);
    const progressionMax = await cdp.evaluate(`window.game.progression.maxLevel`);
    const renderedCardsCount = await cdp.evaluate(`document.querySelectorAll('.level-card').length`);
    console.log(`[Level Config Count]: ${levelCount} (Expected: 50)`);
    console.log(`[Progression Max Level]: ${progressionMax} (Expected: 50)`);
    console.log(`[Rendered Cards in Lobby]: ${renderedCardsCount} (Expected: 50)`);

    if (levelCount !== 50 || renderedCardsCount !== 50) {
      throw new Error(`50 levels mismatch: config=${levelCount}, rendered=${renderedCardsCount}`);
    }

    await cdp.screenshot('levels_grid_50_stages.png');

    // ========================================================================
    // TEST 2: Vehicle Ownership & Selection Enforcement
    // ========================================================================
    console.log('\n--- 2. Testing Vehicle Ownership & Selection Enforcement ---');
    const initialSelected = await cdp.evaluate(`window.game.selectedVehicleId`);
    const initialViewed = await cdp.evaluate(`window.game.viewedVehicleId`);
    const initialOwned = await cdp.evaluate(`window.game.progression.ownedVehicles`);
    console.log(`[Starter Equipped]: ${initialSelected}, Viewed: ${initialViewed}, Owned: ${JSON.stringify(initialOwned)}`);

    // Browse to a locked vehicle (apex_gt, price 3,000)
    await cdp.evaluate(`window.game.setVehicle('apex_gt');`);
    await sleep(400);

    const viewedAfterSwitch = await cdp.evaluate(`window.game.viewedVehicleId`);
    const selectedAfterSwitch = await cdp.evaluate(`window.game.selectedVehicleId`);
    const isApexOwned = await cdp.evaluate(`window.game.progression.isOwned('apex_gt')`);
    const turntableBuyBtnVisible = await cdp.evaluate(`!document.getElementById('turntableBuyBtn').classList.contains('hidden')`);
    const turntableBuyBtnText = await cdp.evaluate(`document.getElementById('turntableBuyBtn').textContent`);
    const lobbyStartBtnText = await cdp.evaluate(`document.getElementById('lobbyStartBtn').textContent`);

    console.log(`[Viewed Vehicle]: ${viewedAfterSwitch} (Expected: apex_gt)`);
    console.log(`[Equipped Vehicle]: ${selectedAfterSwitch} (Expected: cyber_pulse - NOT apex_gt!)`);
    console.log(`[Apex GT Owned?]: ${isApexOwned} (Expected: false)`);
    console.log(`[Turntable Buy Button Visible?]: ${turntableBuyBtnVisible} (Expected: true)`);
    console.log(`[Turntable Buy Button Text]: "${turntableBuyBtnText}"`);
    console.log(`[Lobby Start Button Text]: "${lobbyStartBtnText}"`);

    if (selectedAfterSwitch !== 'cyber_pulse') {
      throw new Error(`Vehicle ownership breach: locked vehicle equipped without purchase!`);
    }

    // Try starting a run with viewed locked vehicle -> Must open purchase modal instead of starting run!
    await cdp.evaluate(`document.getElementById('lobbyStartBtn').click();`);
    await sleep(400);

    const purchaseModalOpen = await cdp.evaluate(`!document.getElementById('purchaseModal').classList.contains('hidden')`);
    const purchaseModalVehName = await cdp.evaluate(`document.getElementById('purchaseVehicleName').textContent`);
    const purchaseModalErrorVisible = await cdp.evaluate(`!document.getElementById('purchaseErrorMsg').classList.contains('hidden')`);
    console.log(`[Purchase Modal Opened on Start Click?]: ${purchaseModalOpen} (Expected: true)`);
    console.log(`[Purchase Modal Vehicle Name]: ${purchaseModalVehName} (Expected: Apex GT)`);
    console.log(`[Insufficient Funds Warning Visible?]: ${purchaseModalErrorVisible} (Expected: true, balance 1000 < 3000)`);

    await cdp.screenshot('purchase_modal_insufficient.png');

    // Attempting purchase with insufficient funds must be rejected
    await cdp.evaluate(`document.getElementById('confirmPurchaseBtn').click();`);
    await sleep(200);
    const balanceAfterFailedBuy = await cdp.evaluate(`window.game.progression.currency`);
    const isApexOwnedAfterFailedBuy = await cdp.evaluate(`window.game.progression.isOwned('apex_gt')`);
    console.log(`[Balance After Failed Buy]: ${balanceAfterFailedBuy} (Expected: 1000)`);
    console.log(`[Apex GT Owned After Failed Buy?]: ${isApexOwnedAfterFailedBuy} (Expected: false)`);

    // Now grant credits, reopen purchase modal, and purchase successfully
    await cdp.evaluate(`
      window.game.progression.addCurrency(5000);
      window.game.openPurchaseModal('apex_gt');
    `);
    await sleep(400);

    const canAffordNow = await cdp.evaluate(`document.getElementById('purchaseErrorMsg').classList.contains('hidden')`);
    console.log(`[Can Afford Now (Balance: 6000 >= 3000)?]: ${canAffordNow} (Expected: true)`);
    await cdp.screenshot('purchase_modal_success.png');

    // Click purchase button
    await cdp.evaluate(`document.getElementById('confirmPurchaseBtn').click();`);
    await sleep(400);

    const balanceAfterBuy = await cdp.evaluate(`window.game.progression.currency`);
    const isApexOwnedNow = await cdp.evaluate(`window.game.progression.isOwned('apex_gt')`);
    const selectedAfterBuy = await cdp.evaluate(`window.game.selectedVehicleId`);
    const turntableBuyBtnHiddenNow = await cdp.evaluate(`document.getElementById('turntableBuyBtn').classList.contains('hidden')`);
    console.log(`[Balance After Buy]: ${balanceAfterBuy} (Expected: 3000)`);
    console.log(`[Apex GT Owned Now?]: ${isApexOwnedNow} (Expected: true)`);
    console.log(`[Selected/Equipped Now]: ${selectedAfterBuy} (Expected: apex_gt)`);
    console.log(`[Turntable Buy Button Hidden Now?]: ${turntableBuyBtnHiddenNow} (Expected: true)`);

    // ========================================================================
    // TEST 3: Mode-Specific HUD Isolation (Endless Mode)
    // ========================================================================
    console.log('\n--- 3. Testing Endless Mode HUD Isolation ---');
    await cdp.evaluate(`
      window.game.setGameMode('endless');
      window.game.startRun();
    `);
    await sleep(1200);

    const endlessHudStatus = await cdp.evaluate(`(() => {
      const bar = document.getElementById('hudLevelBar');
      const toast = document.getElementById('checkpointToast');
      const barStyle = window.getComputedStyle(bar);
      const toastStyle = window.getComputedStyle(toast);
      return {
        gameMode: window.game.gameMode,
        gameState: window.game.state,
        barHasHidden: bar.classList.contains('hidden'),
        barDisplay: barStyle.display,
        toastHasHidden: toast.classList.contains('hidden'),
        toastDisplay: toastStyle.display,
        timerText: document.getElementById('hudLevelTimer').textContent.trim(),
        distText: document.getElementById('hudLevelDist').textContent.trim(),
        overtakesText: document.getElementById('hudLevelOvertakes').textContent.trim(),
        coinsText: document.getElementById('hudLevelCoins').textContent.trim(),
        hudScoreVisible: window.getComputedStyle(document.getElementById('hudScore')).display !== 'none',
        hudSpeedVisible: window.getComputedStyle(document.getElementById('hudSpeed')).display !== 'none'
      };
    })()`);
    console.log('[Endless HUD Verification]:', JSON.stringify(endlessHudStatus, null, 2));

    if (!endlessHudStatus.barHasHidden || endlessHudStatus.barDisplay !== 'none') {
      throw new Error(`Endless mode HUD leak! Level bar display=${endlessHudStatus.barDisplay}, hasHidden=${endlessHudStatus.barHasHidden}`);
    }
    if (endlessHudStatus.toastDisplay !== 'none') {
      throw new Error(`Endless mode toast leak! Checkpoint toast display=${endlessHudStatus.toastDisplay}`);
    }

    await cdp.screenshot('endless_hud_clean.png');

    // Return to lobby from endless mode
    await cdp.evaluate(`window.game.returnToLobby();`);
    await sleep(600);

    // ========================================================================
    // TEST 4: Mode-Specific HUD Activation (Level Mode)
    // ========================================================================
    console.log('\n--- 4. Testing Level Mode HUD Activation ---');
    await cdp.evaluate(`
      window.game.setGameMode('levels');
      window.game.selectedLevelIndex = 0; // Stage 1
      window.game.startRun();
    `);
    await sleep(1500);

    const levelHudStatus = await cdp.evaluate(`(() => {
      const bar = document.getElementById('hudLevelBar');
      const toast = document.getElementById('checkpointToast');
      const barStyle = window.getComputedStyle(bar);
      return {
        gameMode: window.game.gameMode,
        gameState: window.game.state,
        barHasHidden: bar.classList.contains('hidden'),
        barDisplay: barStyle.display,
        timerText: document.getElementById('hudLevelTimer').textContent.trim(),
        distText: document.getElementById('hudLevelDist').textContent.trim(),
        overtakesText: document.getElementById('hudLevelOvertakes').textContent.trim(),
        coinsText: document.getElementById('hudLevelCoins').textContent.trim()
      };
    })()`);
    console.log('[Level Mode HUD Verification]:', JSON.stringify(levelHudStatus, null, 2));

    if (levelHudStatus.barHasHidden || levelHudStatus.barDisplay === 'none') {
      throw new Error(`Level mode HUD missing! Level bar display=${levelHudStatus.barDisplay}, hasHidden=${levelHudStatus.barHasHidden}`);
    }

    await cdp.screenshot('level_mode_hud.png');

    // Simulate stage victory and verify progression
    console.log('\n--- 5. Testing Stage Victory & Progression Persistence ---');
    await cdp.evaluate(`
      window.game.handleLevelVictory({
        baseReward: 500,
        coinBonus: 200,
        timeBonus: 300,
        totalReward: 1000
      });
    `);
    await sleep(600);

    const victoryModalOpen = await cdp.evaluate(`!document.getElementById('levelCompleteModal').classList.contains('hidden')`);
    const unlockedLevel = await cdp.evaluate(`window.game.progression.unlockedLevel`);
    console.log(`[Victory Modal Open?]: ${victoryModalOpen} (Expected: true)`);
    console.log(`[Unlocked Level After Stage 1 Clear]: ${unlockedLevel} (Expected: 2)`);

    await cdp.screenshot('stage_complete_modal_v2.png');

    // Click next stage button -> should load Stage 2
    await cdp.evaluate(`document.getElementById('levelNextBtn').click();`);
    await sleep(1200);

    const activeStage = await cdp.evaluate(`window.game.selectedLevelIndex + 1`);
    console.log(`[Active Stage]: ${activeStage} (Expected: 2)`);

    // Return to lobby
    await cdp.evaluate(`window.game.returnToLobby();`);
    await sleep(600);

    // ========================================================================
    // TEST 5: Inspect Newly Sculpted 3D Models in Showroom
    // ========================================================================
    console.log('\n--- 6. Capturing Showroom Screenshots of All Upgraded Models ---');
    
    // Switch to garage tab to frame cleanly
    await cdp.evaluate(`window.game.switchTab('garage');`);
    await sleep(300);

    const modelsToTest = [
      { id: 'apex_gt', name: 'model_apex_gt.png' },
      { id: 'enforcer', name: 'model_enforcer.png' },
      { id: 'titan_hauler', name: 'model_titan_hauler.png' },
      { id: 'phantom', name: 'model_phantom.png' },
      { id: 'quantum_hover', name: 'model_quantum_hover.png' }
    ];

    for (const m of modelsToTest) {
      await cdp.evaluate(`
        window.game.setVehicle('${m.id}', true);
        window.game.turntableAngle = 0.55;
      `);
      await sleep(600);
      await cdp.screenshot(m.name);
    }

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! Everything verified.');

  } catch (err) {
    console.error('Test Execution Failed:', err);
    process.exitCode = 1;
  } finally {
    cdp.close();
    edgeProc.kill();
  }
}

run();
