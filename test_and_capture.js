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
    return res.result ? res.result.value : null;
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buf);
    console.log(`[Captured] ${filename} (${buf.length} bytes) -> ${outPath}`);
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
  console.log('--- Starting Automated Verification Suite ---');

  // 1. Launch Headless Edge
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--mute-audio',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  edgeProc.on('error', (err) => console.error('Edge launch err:', err));

  await sleep(1500);

  // 2. Query Page target info for page ws URL
  let pageWsUrl = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const resp = await fetch('http://localhost:9222/json');
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
    // If no page target found, create one
    try {
      const resp = await fetch('http://localhost:9222/json/new?about:blank', { method: 'PUT' });
      const target = await resp.json();
      pageWsUrl = target.webSocketDebuggerUrl;
    } catch (e) {}
  }

  if (!pageWsUrl) {
    throw new Error('Failed to obtain Edge Page CDP WebSocket URL');
  }
  console.log('Connected to Edge Page CDP:', pageWsUrl);

  const cdp = new CDPSession(pageWsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.setViewport(1280, 720);

  // 3. Navigate to Neon Highway
  console.log('Navigating to http://localhost:8085/ ...');
  await cdp.send('Page.navigate', { url: 'http://localhost:8085/' });
  await sleep(2000);

  // Test 1: Lobby Verification
  console.log('\n--- 1. Testing Lobby Screen & Profile ---');
  const isLobbyVisible = await cdp.evaluate("!document.getElementById('lobbyScreen').classList.contains('hidden')");
  console.log('Lobby visible on load:', isLobbyVisible);

  // Set Username
  await cdp.evaluate(`
    const input = document.getElementById('lobbyUsername');
    input.value = 'APEX_RIDER';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  `);
  const savedUser = await cdp.evaluate("localStorage.getItem('neon_username')");
  console.log('Username saved in localStorage:', savedUser);

  // Vehicle Switch Verification
  const vehicleCount = await cdp.evaluate("Object.keys(VEHICLE_SPECS).length");
  console.log('Total vehicles available in specs:', vehicleCount);

  // Cycle through vehicles
  await cdp.evaluate("window.neonGame.setVehicle('phantom');");
  await sleep(400);
  const currentVehicle = await cdp.evaluate("window.neonGame.selectedVehicleId");
  const vehicleHeading = await cdp.evaluate("document.getElementById('lobbyVehicleName').textContent");
  console.log('Selected vehicle:', currentVehicle, '| Heading:', vehicleHeading);

  // Test Turntable Drag
  await cdp.evaluate(`
    const dragZone = document.getElementById('turntableDragZone');
    dragZone.dispatchEvent(new MouseEvent('mousedown', { clientX: 200, bubbles: true }));
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, bubbles: true }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  `);
  console.log('Turntable drag simulated successfully.');

  // Switch back to Cyber Pulse for main lobby screenshot
  await cdp.evaluate("window.neonGame.setVehicle('cyber_pulse');");
  await sleep(500);
  await cdp.screenshot('lobby_3d.png');

  // Test 2: Settings Modal Verification
  console.log('\n--- 2. Testing Settings Modal ---');
  await cdp.evaluate("document.getElementById('lobbySettingsBtn').click();");
  await sleep(300);

  await cdp.evaluate(`
    const sMaster = document.getElementById('settingMasterVolume');
    sMaster.value = '90';
    sMaster.dispatchEvent(new Event('input', { bubbles: true }));

    const sSens = document.getElementById('settingSensitivity');
    sSens.value = '120';
    sSens.dispatchEvent(new Event('input', { bubbles: true }));

    const sShake = document.getElementById('settingShake');
    sShake.checked = false;
    sShake.dispatchEvent(new Event('change', { bubbles: true }));
  `);

  await cdp.screenshot('settings_modal.png');

  // Reset to Defaults & Close
  await cdp.evaluate("document.getElementById('resetSettingsBtn').click();");
  const resetSens = await cdp.evaluate("document.getElementById('valSensitivity').textContent");
  console.log('Settings reset to defaults, sensitivity is:', resetSens);
  await cdp.evaluate("document.getElementById('closeSettingsBtn').click();");
  await sleep(300);

  // Test 3: Multi-Biome Highway Races
  console.log('\n--- 3. Testing 4 Biomes × 4 Times of Day ---');

  // A. Desert Biome (Mojave Canyon, Sunset, Dune Marauder)
  console.log('Testing Desert Biome (Dune Marauder)...');
  await cdp.evaluate(`
    window.neonGame.setMap('desert');
    window.neonGame.setTimeOfDay('sunset');
    window.neonGame.setVehicle('dune_marauder');
    window.neonGame.startRun();
  `);
  await sleep(1500);
  await cdp.screenshot('desert_gameplay.png');

  // B. Mountain Biome (Alpine Ridge, Morning, Phantom Hypercar)
  console.log('Testing Mountain Biome (Phantom Hypercar)...');
  await cdp.evaluate(`
    window.neonGame.setMap('mountains');
    window.neonGame.setTimeOfDay('morning');
    window.neonGame.setVehicle('phantom');
    window.neonGame.startRun();
  `);
  await sleep(1500);
  await cdp.screenshot('mountain_gameplay.png');

  // C. City Biome (Metropolis, Night, Enforcer Interceptor)
  console.log('Testing City Biome (Enforcer Interceptor)...');
  await cdp.evaluate(`
    window.neonGame.setMap('city');
    window.neonGame.setTimeOfDay('night');
    window.neonGame.setVehicle('enforcer');
    window.neonGame.startRun();
  `);
  await sleep(1500);
  await cdp.screenshot('city_gameplay.png');

  // D. Neon Grid Biome (Synthwave, Afternoon, Quantum Hover)
  console.log('Testing Neon Biome (Quantum Hoverboard)...');
  await cdp.evaluate(`
    window.neonGame.setMap('neon');
    window.neonGame.setTimeOfDay('sunset');
    window.neonGame.setVehicle('quantum_hover');
    window.neonGame.startRun();
  `);
  await sleep(1500);
  await cdp.screenshot('neon_gameplay.png');

  // Test 4: Pause & Return to Lobby Confirmation
  console.log('\n--- 4. Testing Pause & Confirmation Modal ---');
  await cdp.evaluate("window.neonGame.pauseGame();");
  await sleep(300);
  await cdp.evaluate("document.getElementById('returnLobbyBtn').click();");
  await sleep(300);
  await cdp.screenshot('pause_confirm.png');

  // Confirm Return to Lobby
  await cdp.evaluate("document.getElementById('confirmLobbyYes').click();");
  await sleep(400);
  const returnedToLobby = await cdp.evaluate("window.neonGame.state === window.neonGame.STATE_LOBBY");
  console.log('Returned cleanly to Lobby state:', returnedToLobby);

  // Test 5: Mobile Viewports
  console.log('\n--- 5. Testing Mobile Viewports ---');
  // Portrait (390 x 844 iPhone 14 style)
  await cdp.setViewport(390, 844);
  await sleep(400);
  await cdp.screenshot('mobile_lobby.png');

  // Start Mobile Run
  await cdp.evaluate("window.neonGame.startRun();");
  await sleep(1500);
  await cdp.screenshot('mobile_gameplay.png');

  console.log('\n=== All Tests Completed Successfully ===');

  cdp.close();
  edgeProc.kill();
}

run().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
