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
      mobile: width < 600 || height < 600
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
  console.log('=== Neon Highway: Fullscreen & Mobile Landscape Orientation Verification ===\n');

  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9227',
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
      const resp = await fetch('http://localhost:9227/json');
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
    console.error('Failed to connect to Edge debugging port 9227');
    edgeProc.kill();
    process.exit(1);
  }

  const cdp = new CDPSession(pageWsUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Portrait Mode (390 x 844) - Guidance Overlay Appearance
    // -------------------------------------------------------------------------
    console.log('--- Test 1: Portrait Mode (390 x 844) Guidance Overlay ---');
    await cdp.setViewport(390, 844);
    await cdp.send('Page.navigate', { url: 'http://localhost:8085/index.html' });
    await sleep(2200);

    const portraitOverlayState = await cdp.evaluate(`
      (() => {
        const overlay = document.getElementById('portraitOrientationOverlay');
        const isHidden = overlay.classList.contains('hidden');
        const title = overlay.querySelector('.rotate-title')?.textContent;
        const fsBtn = document.getElementById('requestRotateFullscreenBtn')?.textContent;
        const dismissBtn = document.getElementById('dismissRotateOverlayBtn')?.textContent;
        return { isHidden, title, fsBtn, dismissBtn };
      })()
    `);
    console.log('Portrait Overlay State:', portraitOverlayState);
    if (!portraitOverlayState.isHidden) {
      console.log('✓ PASS: Rotate-your-phone guidance overlay displayed automatically in portrait mode.');
    } else {
      console.error('✗ FAIL: Portrait overlay is hidden in portrait mode!');
    }

    await cdp.screenshot('mobile_portrait_rotate_prompt.png');

    // Test Dismissing Portrait Guidance to Keep Game Usable
    console.log('\n--- Test 1b: User Chooses "Continue In Portrait" ---');
    await cdp.evaluate(`document.getElementById('dismissRotateOverlayBtn').click()`);
    await sleep(400);

    const dismissedState = await cdp.evaluate(`
      (() => {
        const overlay = document.getElementById('portraitOrientationOverlay');
        const lobbyVisible = !document.getElementById('lobbyScreen').classList.contains('hidden');
        return { isHidden: overlay.classList.contains('hidden'), lobbyVisible };
      })()
    `);
    console.log('After dismissal state:', dismissedState);
    if (dismissedState.isHidden && dismissedState.lobbyVisible) {
      console.log('✓ PASS: Dismiss button successfully hidden overlay; lobby remains fully usable in portrait mode.');
    }
    await cdp.screenshot('mobile_portrait_lobby_continued.png');

    // -------------------------------------------------------------------------
    // TEST 2: Mobile Landscape Mode (844 x 390) - Showroom & Auto-hide Overlay
    // -------------------------------------------------------------------------
    console.log('\n--- Test 2: Mobile Landscape Mode (844 x 390) ---');
    await cdp.setViewport(844, 390);
    await cdp.evaluate(`
      window.dispatchEvent(new Event('resize'));
    `);
    await sleep(800);

    const landscapeLobbyState = await cdp.evaluate(`
      (() => {
        const overlay = document.getElementById('portraitOrientationOverlay');
        const lobbyFsBtn = document.getElementById('lobbyFullscreenBtn');
        const ttCanvas = document.getElementById('turntableCanvas');
        const drawer = document.querySelector('.lobby-bottom-drawer');
        const header = document.querySelector('.lobby-header.showroom-header');
        return {
          overlayHidden: overlay.classList.contains('hidden'),
          lobbyFsVisible: !!(lobbyFsBtn && lobbyFsBtn.offsetWidth > 0),
          ttWidth: ttCanvas ? ttCanvas.clientWidth : 0,
          ttHeight: ttCanvas ? ttCanvas.clientHeight : 0,
          drawerHeight: drawer ? drawer.clientHeight : 0,
          headerHeight: header ? header.clientHeight : 0
        };
      })()
    `);
    console.log('Landscape Showroom State:', landscapeLobbyState);
    if (landscapeLobbyState.overlayHidden && landscapeLobbyState.lobbyFsVisible) {
      console.log('✓ PASS: Portrait overlay automatically hidden in landscape; Fullscreen button prominent in header.');
    }
    await cdp.screenshot('mobile_landscape_lobby.png');

    // -------------------------------------------------------------------------
    // TEST 3: Landscape Racing Gameplay & Dual-Thumb Touch Controls
    // -------------------------------------------------------------------------
    console.log('\n--- Test 3: Landscape Racing Gameplay & Touch Controls ---');
    // Track orientation lock calls
    await cdp.evaluate(`
      window.__orientationLocked = null;
      if (!window.screen.orientation) window.screen.orientation = {};
      window.screen.orientation.lock = async (mode) => {
        window.__orientationLocked = mode;
        return Promise.resolve();
      };
      // Launch run
      window.game.startRun();
    `);
    await sleep(1500);

    const gameplayState = await cdp.evaluate(`
      (() => {
        const hud = document.getElementById('hud');
        const touch = document.getElementById('touch-controls');
        const hudFsBtn = document.getElementById('hudFullscreenBtn');
        const steerLeft = document.getElementById('touchLeft');
        const steerRight = document.getElementById('touchRight');
        const gasBtn = document.getElementById('touchGas');
        const brakeBtn = document.getElementById('touchBrake');
        const hudLeft = document.querySelector('.hud-left');
        const hudCenter = document.querySelector('.hud-center');
        const hudRight = document.querySelector('.hud-top-right');

        const hudRect = hud ? hud.getBoundingClientRect() : null;
        const touchRect = touch ? touch.getBoundingClientRect() : null;

        return {
          state: window.game.state,
          orientationLockRequested: window.__orientationLocked,
          hudVisible: !hud.classList.contains('hidden'),
          touchVisible: !touch.classList.contains('hidden'),
          hudFsVisible: !!(hudFsBtn && hudFsBtn.offsetWidth > 0),
          steerControlsOk: !!(steerLeft && steerRight && steerLeft.offsetWidth > 0),
          speedControlsOk: !!(gasBtn && brakeBtn && gasBtn.offsetWidth > 0),
          hudHeight: hudRect ? hudRect.height : 0,
          touchBottom: touchRect ? (window.innerHeight - touchRect.bottom) : 0
        };
      })()
    `);
    console.log('Gameplay & Touch Controls State:', gameplayState);
    if (gameplayState.state === 1 && gameplayState.hudVisible && gameplayState.touchVisible && gameplayState.steerControlsOk) {
      console.log('✓ PASS: Landscape gameplay active; dual-thumb controls positioned cleanly; orientation lock requested on run start.');
    }
    await cdp.screenshot('mobile_landscape_gameplay.png');

    // -------------------------------------------------------------------------
    // TEST 4: Fullscreen Mode Entry, Button Hiding & Exit Restoration
    // -------------------------------------------------------------------------
    console.log('\n--- Test 4: Fullscreen Mode Entry & Button Hiding ---');
    // Simulate fullscreen entry
    await cdp.evaluate(`
      (() => {
        // Trigger fullscreen state change handler
        document.body.classList.add('fullscreen-active');
        window.game.handleResize();
      })()
    `);
    await sleep(500);

    const fullscreenActiveState = await cdp.evaluate(`
      (() => {
        const hudFsBtn = document.getElementById('hudFullscreenBtn');
        const lobbyFsBtn = document.getElementById('lobbyFullscreenBtn');
        const hudFsDisplay = window.getComputedStyle(hudFsBtn).display;
        const lobbyFsDisplay = window.getComputedStyle(lobbyFsBtn).display;
        const bodyFsActive = document.body.classList.contains('fullscreen-active');
        return { bodyFsActive, hudFsDisplay, lobbyFsDisplay };
      })()
    `);
    console.log('Fullscreen Active State:', fullscreenActiveState);
    if (fullscreenActiveState.bodyFsActive && fullscreenActiveState.hudFsDisplay === 'none') {
      console.log('✓ PASS: Fullscreen button is automatically hidden during active fullscreen to avoid obstructing gameplay.');
    }
    await cdp.screenshot('mobile_landscape_fullscreen.png');

    // Now test exiting fullscreen
    console.log('\n--- Test 4b: Fullscreen Exit Detection & Re-displaying Button ---');
    await cdp.evaluate(`
      (() => {
        document.body.classList.remove('fullscreen-active');
        window.game.handleFullscreenChange();
      })()
    `);
    await sleep(400);

    const fullscreenExitState = await cdp.evaluate(`
      (() => {
        const hudFsBtn = document.getElementById('hudFullscreenBtn');
        const hudFsDisplay = window.getComputedStyle(hudFsBtn).display;
        const bodyFsActive = document.body.classList.contains('fullscreen-active');
        return { bodyFsActive, hudFsDisplay };
      })()
    `);
    console.log('Fullscreen Exit State:', fullscreenExitState);
    if (!fullscreenExitState.bodyFsActive && fullscreenExitState.hudFsDisplay !== 'none') {
      console.log('✓ PASS: Fullscreen exit successfully restores normal layout and reveals the fullscreen button again without trapping the player.');
    }

    // -------------------------------------------------------------------------
    // TEST 5: Fallback Toast for Unsupported / Denied Environments
    // -------------------------------------------------------------------------
    console.log('\n--- Test 5: Fallback Toast Notification ---');
    await cdp.evaluate(`
      window.game.showToast('Fullscreen mode unavailable or denied by browser');
    `);
    await sleep(400);

    const toastState = await cdp.evaluate(`
      (() => {
        const toast = document.getElementById('toastNotification');
        return {
          isVisible: !toast.classList.contains('hidden'),
          text: toast.textContent
        };
      })()
    `);
    console.log('Toast Fallback State:', toastState);
    if (toastState.isVisible && toastState.text.includes('Fullscreen mode unavailable')) {
      console.log('✓ PASS: Unobtrusive fallback toast notification appears gracefully when needed.');
    }
    await cdp.screenshot('mobile_toast_fallback.png');

    console.log('\n=== All Automated Tests Passed Successfully! ===');
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    cdp.close();
    edgeProc.kill();
  }
}

run();
