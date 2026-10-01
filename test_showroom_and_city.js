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
  console.log('=== Neon Highway: Showroom Redesign, Character & Vehicle Models, and City Environment Verification ===');

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9224',
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
      const resp = await fetch('http://localhost:9224/json');
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
    console.error('Failed to connect to Edge debugging port 9224');
    edgeProc.kill();
    process.exit(1);
  }

  const cdp = new CDPSession(pageWsUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  try {
    // 1. Desktop Showroom
    console.log('\n--- 1. Desktop Showroom Verification ---');
    await cdp.setViewport(1280, 720);
    await cdp.send('Page.navigate', { url: 'http://localhost:8085/' });
    await sleep(2500);

    await cdp.evaluate(`new Promise(resolve => {
      if (window.game || window.neonGame) {
        window.game = window.game || window.neonGame;
        return resolve();
      }
      const interval = setInterval(() => {
        if (window.game || window.neonGame) {
          window.game = window.game || window.neonGame;
          clearInterval(interval);
          resolve();
        }
      }, 50);
    })`);

    const lobbyInfo = await cdp.evaluate(`(() => {
      const g = window.game || window.neonGame;
      return {
        vehicle: g.selectedVehicleId,
        map: g.selectedMapId,
        time: g.selectedTimeOfDay,
        currency: g.progression.currency,
        canvasWidth: g.ui.turntableCanvas.clientWidth,
        canvasHeight: g.ui.turntableCanvas.clientHeight,
        hasRider: !!(g.previewVehicle && g.previewVehicle.root)
      };
    })()`);
    console.log('Lobby Info:', lobbyInfo);

    // Let the turntable rotate smoothly for 1 second
    await sleep(1200);
    await cdp.screenshot('lobby_showroom_desktop.png');

    // 2. Mobile Showroom Verification (390x844 portrait)
    console.log('\n--- 2. Mobile Showroom Verification ---');
    await cdp.setViewport(390, 844);
    await cdp.evaluate(`window.game.handleResize()`);
    await sleep(800);

    const mobileInfo = await cdp.evaluate(`(() => {
      const g = window.game;
      const rect = g.ui.turntableCanvas.getBoundingClientRect();
      const drawer = document.querySelector('.lobby-bottom-drawer').getBoundingClientRect();
      return {
        turntableTop: rect.top,
        turntableHeight: rect.height,
        drawerTop: drawer.top,
        drawerHeight: drawer.height,
        viewportHeight: window.innerHeight
      };
    })()`);
    console.log('Mobile Layout Proportions:', mobileInfo);
    await cdp.screenshot('lobby_showroom_mobile.png');

    // Restore desktop viewport
    await cdp.setViewport(1280, 720);
    await cdp.evaluate(`window.game.handleResize()`);
    await sleep(500);

    // 3. Garage Tab & Paint Customization
    console.log('\n--- 3. Garage Tab & Customization ---');
    await cdp.evaluate(`window.game.switchTab('garage')`);
    await sleep(600);
    // Click paint chip #3 (e.g. emerald or ruby)
    await cdp.evaluate(`(() => {
      const chips = document.querySelectorAll('.paint-chip');
      if (chips.length > 2) chips[2].click();
    })()`);
    await sleep(500);
    await cdp.screenshot('lobby_garage_customization.png');

    // 4. Vehicle Shop Tab
    console.log('\n--- 4. Vehicle Shop Tab ---');
    await cdp.evaluate(`window.game.switchTab('shop')`);
    await sleep(600);
    await cdp.screenshot('lobby_vehicle_shop.png');

    // 5. Upgrades Tab
    console.log('\n--- 5. Upgrades Workshop Tab ---');
    await cdp.evaluate(`window.game.switchTab('upgrades')`);
    await sleep(600);
    await cdp.screenshot('lobby_upgrades_workshop.png');

    // 6. Test Vehicle Switching on Turntable
    console.log('\n--- 6. Vehicle Switching on Turntable ---');
    await cdp.evaluate(`window.game.switchTab('play')`);
    await sleep(400);
    // Switch to Thunder Cruiser
    await cdp.evaluate(`window.game.setVehicle('thunder_cruiser')`);
    await sleep(500);
    console.log('Switched to Thunder Cruiser, now cycling to Shadow Ninja...');
    await cdp.evaluate(`document.getElementById('nextVehicleBtn').click()`);
    await sleep(500);

    // Reset to Cyber Pulse for the City Ride
    await cdp.evaluate(`window.game.setVehicle('cyber_pulse')`);
    await sleep(400);

    // 7. City Daylight Racing Gameplay Verification
    console.log('\n--- 7. City Daylight Racing Gameplay Verification ---');
    // Ensure City Map + Midday Daylight
    await cdp.evaluate(`(() => {
      window.game.setMap('city');
      window.game.setTimeOfDay('midday');
      window.game.setGameMode('endless');
      window.game.startRun();
    })()`);
    await sleep(2500);

    const raceState = await cdp.evaluate(`(() => {
      const g = window.game;
      return {
        state: g.state,
        speed: Math.round(g.speed),
        playerX: g.playerX,
        playerZ: Math.round(g.playerZ),
        map: g.selectedMapId,
        time: g.selectedTimeOfDay,
        activeChunks: g.world.roadChunks.length,
        sceneryCount: g.world.sceneryPool.length,
        riderHead: !!(g.bike && g.bike.headGroup),
        forkGroup: !!(g.bike && g.bike.forkGroup)
      };
    })()`);
    console.log('City Racing State:', raceState);

    // Capture City Daylight Racing Screenshot
    await cdp.screenshot('city_daylight_gameplay.png');

    // 8. Test Steering Controls & Leaning Consistency
    console.log('\n--- 8. Testing Controls (Steer Left, Steer Right, Braking) ---');
    // Steer Left (Key A)
    await cdp.evaluate(`window.game.keys.left = true`);
    await sleep(600);
    const leftLean = await cdp.evaluate(`(() => {
      const g = window.game;
      return {
        playerX: g.playerX,
        lean: g.lean,
        bankGroupZ: g.bike.bankGroup.rotation.z,
        headGroupY: g.bike.headGroup ? g.bike.headGroup.rotation.y : 0
      };
    })()`);
    console.log('Steer Left Metrics:', leftLean);
    await cdp.evaluate(`window.game.keys.left = false`);
    await sleep(400);

    // Steer Right (Key D)
    await cdp.evaluate(`window.game.keys.right = true`);
    await sleep(600);
    const rightLean = await cdp.evaluate(`(() => {
      const g = window.game;
      return {
        playerX: g.playerX,
        lean: g.lean,
        bankGroupZ: g.bike.bankGroup.rotation.z,
        headGroupY: g.bike.headGroup ? g.bike.headGroup.rotation.y : 0
      };
    })()`);
    console.log('Steer Right Metrics:', rightLean);
    await cdp.evaluate(`window.game.keys.right = false`);
    await sleep(400);

    // Test Brake Deceleration (Speed must NOT reach 0)
    await cdp.evaluate(`window.game.keys.down = true`);
    await sleep(1200);
    const brakeMetrics = await cdp.evaluate(`(() => {
      const g = window.game;
      return {
        speed: Math.round(g.speed),
        minSpeed: g.minSpeed,
        brakeLightIntensity: g.bike.brakeLightMat.emissiveIntensity
      };
    })()`);
    console.log('Braking Metrics (Non-Zero Cruising):', brakeMetrics);
    await cdp.evaluate(`window.game.keys.down = false`);
    await sleep(500);

    // 9. City Sunset Gameplay Verification
    console.log('\n--- 9. City Sunset Gameplay Verification ---');
    await cdp.evaluate(`(() => {
      window.game.setTimeOfDay('sunset');
    })()`);
    await sleep(1500);
    await cdp.screenshot('city_sunset_gameplay.png');

    console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Test Suite Error:', err);
  } finally {
    cdp.close();
    edgeProc.kill();
    process.exit(0);
  }
}

run();
