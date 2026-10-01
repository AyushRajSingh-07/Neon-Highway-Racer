/**
 * Neon Highway - Web Audio API Synthesizer
 * Zero-dependency procedural sound effects and synthwave audio engine.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('neon_highway_muted') === 'true';
    this.masterVolume = parseFloat(localStorage.getItem('neon_highway_master_vol') || '0.85');
    this.musicVolume = parseFloat(localStorage.getItem('neon_highway_music_vol') || '0.5');
    this.sfxVolume = parseFloat(localStorage.getItem('neon_highway_sfx_vol') || '0.8');
    this.initialized = false;
    
    // Master Gain
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;

    // Engine synth nodes
    this.engineOsc1 = null;
    this.engineOsc2 = null;
    this.engineFilter = null;
    this.engineGain = null;
    this.engineNoise = null;
    this.engineNoiseGain = null;
    this.engineRunning = false;

    // Music sequencer state
    this.musicPlaying = false;
    this.musicStep = 0;
    this.musicTimer = null;
    this.bpm = 125;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      const currentMaster = this.isMuted ? 0 : this.masterVolume;
      this.masterGain.gain.setValueAtTime(currentMaster, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Music bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, parseFloat(val)));
    localStorage.setItem('neon_highway_master_vol', this.masterVolume);
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  setMusicVolume(val) {
    this.musicVolume = Math.max(0, Math.min(1, parseFloat(val)));
    localStorage.setItem('neon_highway_music_vol', this.musicVolume);
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, parseFloat(val)));
    localStorage.setItem('neon_highway_sfx_vol', this.sfxVolume);
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    localStorage.setItem('neon_highway_muted', this.isMuted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  toggleMute() {
    return this.setMuted(!this.isMuted);
  }

  // --- Procedural Engine Sound ---
  startEngine() {
    if (!this.initialized || this.engineRunning || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;

      // Dual detuned sawtooths for a deep, roaring twin-cylinder cyberbike
      this.engineOsc1 = this.ctx.createOscillator();
      this.engineOsc1.type = 'sawtooth';
      this.engineOsc1.frequency.setValueAtTime(45, t);

      this.engineOsc2 = this.ctx.createOscillator();
      this.engineOsc2.type = 'triangle';
      this.engineOsc2.frequency.setValueAtTime(90, t);

      // Lowpass resonant filter to emulate engine exhaust acoustic body
      this.engineFilter = this.ctx.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(320, t);
      this.engineFilter.Q.setValueAtTime(4.5, t);

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.01, t);
      this.engineGain.gain.linearRampToValueAtTime(0.25, t + 0.1);

      // Noise buffer for exhaust air turbulence
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      this.engineNoise = this.ctx.createBufferSource();
      this.engineNoise.buffer = noiseBuffer;
      this.engineNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, t);
      noiseFilter.Q.setValueAtTime(1.5, t);

      this.engineNoiseGain = this.ctx.createGain();
      this.engineNoiseGain.gain.setValueAtTime(0.02, t);

      this.engineNoise.connect(noiseFilter);
      noiseFilter.connect(this.engineNoiseGain);
      this.engineNoiseGain.connect(this.sfxGain);

      this.engineOsc1.connect(this.engineFilter);
      this.engineOsc2.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.sfxGain);

      this.engineOsc1.start();
      this.engineOsc2.start();
      this.engineNoise.start();

      this.engineRunning = true;
    } catch (e) {
      console.warn('Failed to start engine audio:', e);
    }
  }

  updateEngine(speedRatio, isAccelerating, isBraking) {
    if (!this.engineRunning || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Frequency ramps from 48Hz (idle) to 210Hz (redline)
      const baseFreq = 48 + speedRatio * 165 + (isAccelerating ? 25 : 0);
      const filterFreq = 300 + speedRatio * 1400 + (isAccelerating ? 450 : 0);
      const volume = 0.18 + speedRatio * 0.22 + (isAccelerating ? 0.08 : 0);

      this.engineOsc1.frequency.setTargetAtTime(baseFreq, t, 0.05);
      this.engineOsc2.frequency.setTargetAtTime(baseFreq * 2.01, t, 0.05);
      this.engineFilter.frequency.setTargetAtTime(filterFreq, t, 0.06);
      this.engineGain.gain.setTargetAtTime(volume, t, 0.05);

      if (this.engineNoiseGain) {
        const noiseVol = 0.015 + speedRatio * 0.06;
        this.engineNoiseGain.gain.setTargetAtTime(noiseVol, t, 0.08);
      }
    } catch (e) {
      // Audio node may be closing
    }
  }

  stopEngine() {
    if (!this.engineRunning || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      if (this.engineGain) {
        this.engineGain.gain.linearRampToValueAtTime(0.001, t + 0.1);
      }
      setTimeout(() => {
        try {
          if (this.engineOsc1) this.engineOsc1.stop();
          if (this.engineOsc2) this.engineOsc2.stop();
          if (this.engineNoise) this.engineNoise.stop();
        } catch (e) {}
        this.engineRunning = false;
      }, 120);
    } catch (e) {
      this.engineRunning = false;
    }
  }

  // --- Near Miss Harmonic Chime ---
  playNearMiss(combo = 1) {
    if (!this.initialized || !this.ctx || this.isMuted) return;
    try {
      const t = this.ctx.currentTime;
      // Ascending chord sequence based on combo
      const rootNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const pitchIndex = Math.min(combo - 1, rootNotes.length - 1);
      const baseFreq = rootNotes[pitchIndex];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.18);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      // Add a sparkly overtone
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(baseFreq * 2, t);
      subGain.gain.setValueAtTime(0.2, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      subOsc.connect(subGain);
      subGain.connect(this.sfxGain);

      osc.start(t);
      subOsc.start(t);
      osc.stop(t + 0.38);
      subOsc.stop(t + 0.38);
    } catch (e) {}
  }

  // --- Traffic Passing Doppler Effect ---
  playPassWhoosh(panX = 0) {
    if (!this.initialized || !this.ctx || this.isMuted) return;
    try {
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.7;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      // Doppler sweep downwards
      filter.frequency.setValueAtTime(950, t);
      filter.frequency.exponentialRampToValueAtTime(280, t + 0.35);
      filter.Q.setValueAtTime(3.0, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      let panner = null;
      if (this.ctx.createStereoPanner) {
        panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panX)), t);
      }

      noise.connect(filter);
      filter.connect(gain);

      if (panner) {
        gain.connect(panner);
        panner.connect(this.sfxGain);
      } else {
        gain.connect(this.sfxGain);
      }

      noise.start(t);
      noise.stop(t + 0.4);
    } catch (e) {}
  }

  // --- Crash / Wipeout Explosion ---
  playCrash() {
    if (!this.initialized || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;

      // 1. Low punch sub-bass drop
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(140, t);
      boom.frequency.exponentialRampToValueAtTime(25, t + 0.8);
      boomGain.gain.setValueAtTime(0.7, t);
      boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      boom.connect(boomGain);
      boomGain.connect(this.sfxGain);
      boom.start(t);
      boom.stop(t + 0.95);

      // 2. White noise impact crunch
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, t);
      filter.frequency.exponentialRampToValueAtTime(150, t + 0.7);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(t);
      noise.stop(t + 0.8);
    } catch (e) {}
  }

  // --- Retro Synthwave Music Sequencer ---
  // A smooth synthwave bassline and arpeggio that keeps the arcade momentum
  startMusic() {
    if (this.musicPlaying || !this.ctx) return;
    this.musicPlaying = true;
    this.musicStep = 0;
    this.playNextMusicNote();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  playNextMusicNote() {
    if (!this.musicPlaying || !this.ctx) return;

    const bassNotes = [
      // Bassline in D minor (Synthwave favorite key)
      73.42, 73.42, 73.42, 73.42, // D2
      82.41, 82.41, 82.41, 82.41, // E2
      87.31, 87.31, 87.31, 87.31, // F2
      98.00, 98.00, 110.00, 110.00 // G2 -> A2
    ];

    const leadNotes = [
      293.66, 329.63, 349.23, 440.00, // D4, E4, F4, A4
      392.00, 349.23, 329.63, 293.66,
      440.00, 523.25, 587.33, 440.00,
      392.00, 349.23, 329.63, 220.00
    ];

    const t = this.ctx.currentTime;
    const stepDuration = 60 / (this.bpm * 4); // 16th notes

    // Trigger Bass synth
    const bassFreq = bassNotes[Math.floor(this.musicStep / 2) % bassNotes.length];
    if (this.musicStep % 2 === 0 && !this.isMuted) {
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      const bFilter = this.ctx.createBiquadFilter();

      bOsc.type = 'sawtooth';
      bOsc.frequency.setValueAtTime(bassFreq, t);

      bFilter.type = 'lowpass';
      bFilter.frequency.setValueAtTime(400, t);
      bFilter.frequency.exponentialRampToValueAtTime(120, t + stepDuration * 1.8);
      bFilter.Q.setValueAtTime(3.0, t);

      bGain.gain.setValueAtTime(0.22, t);
      bGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 1.9);

      bOsc.connect(bFilter);
      bFilter.connect(bGain);
      bGain.connect(this.musicGain);

      bOsc.start(t);
      bOsc.stop(t + stepDuration * 2);
    }

    // Trigger Pluck / Arpeggio
    if (this.musicStep % 2 === 1 && !this.isMuted) {
      const leadFreq = leadNotes[this.musicStep % leadNotes.length];
      const lOsc = this.ctx.createOscillator();
      const lGain = this.ctx.createGain();
      const lFilter = this.ctx.createBiquadFilter();

      lOsc.type = 'square';
      lOsc.frequency.setValueAtTime(leadFreq, t);

      lFilter.type = 'lowpass';
      lFilter.frequency.setValueAtTime(1400, t);
      lFilter.frequency.exponentialRampToValueAtTime(300, t + stepDuration * 0.9);

      lGain.gain.setValueAtTime(0.08, t);
      lGain.gain.exponentialRampToValueAtTime(0.001, t + stepDuration * 0.9);

      lOsc.connect(lFilter);
      lFilter.connect(lGain);
      lGain.connect(this.musicGain);

      lOsc.start(t);
      lOsc.stop(t + stepDuration);
    }

    this.musicStep = (this.musicStep + 1) % 32;
    this.musicTimer = setTimeout(() => this.playNextMusicNote(), stepDuration * 1000);
  }

  // --- Collectible Coin Pickup Sound ---
  playCoin() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  // --- Checkpoint Bonus Sound ---
  playCheckpoint() {
    if (this.isMuted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // --- Shop Purchase Chime ---
  playPurchase() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const freqs = [659.25, 880.00, 1174.66]; // E5, A5, D6
    freqs.forEach((f, idx) => {
      const tSub = t + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, tSub);

      gain.gain.setValueAtTime(0.22, tSub);
      gain.gain.exponentialRampToValueAtTime(0.001, tSub + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(tSub);
      osc.stop(tSub + 0.3);
    });
  }

  // --- Level Complete Fanfare ---
  playLevelComplete() {
    if (this.isMuted || !this.ctx) return;
    const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chords.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.5);
    });
  }

  // --- Level Failed Buzz ---
  playLevelFailed() {
    if (this.isMuted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.4);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.5);
  }
}

// Global audio singleton
window.neonAudio = new SoundEngine();
