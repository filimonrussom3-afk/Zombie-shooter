// Simple Sound System using Web Audio API
class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.3;
  }

  // Initialize audio context on first use (required for browser security)
  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        this.enabled = false;
        return false;
      }
    }

    // Resume audio context if suspended
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  // Play a simple beep
  beep(freq, duration) {
    if (!this.enabled) return;

    const ctx = this.init();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      gain.gain.setValueAtTime(this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  // Slide frequency down
  slideDown(freqStart, freqEnd, duration) {
    if (!this.enabled) return;

    const ctx = this.init();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);

      gain.gain.setValueAtTime(this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  // Slide frequency up
  slideUp(freqStart, freqEnd, duration) {
    if (!this.enabled) return;

    const ctx = this.init();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);

      gain.gain.setValueAtTime(this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  // Sound effects - Galaga arcade style
  shoot() { 
    // Realistic gun shooting sound using amplitude-modulated noise
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      // Create noise burst for realistic gunshot
      const bufferSize = ctx.sampleRate * 0.1; // 100ms
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      // Fill with white noise
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Create nodes
      const noiseSource = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Setup filter for gun-like tone
      filter.type = 'highpass';
      filter.frequency.value = 2000;

      // Connect audio graph
      noiseSource.buffer = noiseBuffer;
      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Quick attack, fast decay envelope for gunshot
      gainNode.gain.setValueAtTime(this.volume * 0.8, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      noiseSource.start(ctx.currentTime);
      noiseSource.stop(ctx.currentTime + 0.08);

      // Layer: Add a quick pitch sweep for more impact
      const pitchOsc = ctx.createOscillator();
      const pitchGain = ctx.createGain();
      
      pitchOsc.connect(pitchGain);
      pitchGain.connect(ctx.destination);
      
      pitchOsc.frequency.setValueAtTime(200, ctx.currentTime);
      pitchOsc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
      
      pitchGain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
      pitchGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      
      pitchOsc.start(ctx.currentTime);
      pitchOsc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }
  
  enemyShoot() { 
    // Realistic alien/laser enemy shooting sound - threatening and distinctive
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    try {
      // Create a burst of noise for the base sound
      const bufferSize = ctx.sampleRate * 0.12;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      // Fill with white noise
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Noise component
      const noiseSource = ctx.createBufferSource();
      const nGainNode = ctx.createGain();
      const nFilter = ctx.createBiquadFilter();

      // Setup filter for low-pass (darker than player shot)
      nFilter.type = 'lowpass';
      nFilter.frequency.value = 1200;

      noiseSource.buffer = noiseBuffer;
      noiseSource.connect(nFilter);
      nFilter.connect(nGainNode);
      nGainNode.connect(ctx.destination);

      // Envelope: quick attack, medium decay (more threatening)
      nGainNode.gain.setValueAtTime(this.volume * 0.6, ctx.currentTime);
      nGainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      noiseSource.start(ctx.currentTime);
      noiseSource.stop(ctx.currentTime + 0.12);

      // Layer: Descending pitch sweep for threatening character
      const pitchOsc = ctx.createOscillator();
      const pitchGain = ctx.createGain();
      
      pitchOsc.type = 'square'; // Square wave for more alien sound
      pitchOsc.connect(pitchGain);
      pitchGain.connect(ctx.destination);
      
      // Start lower and sweep down
      pitchOsc.frequency.setValueAtTime(400, ctx.currentTime);
      pitchOsc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      
      pitchGain.gain.setValueAtTime(this.volume * 0.25, ctx.currentTime);
      pitchGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      
      pitchOsc.start(ctx.currentTime);
      pitchOsc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }
  
  hit() { 
    // Quick descending pitch for hit - arcade style kill
    this.slideDown(800, 150, 0.15);
  }
  
  damage() { 
    // Deeper warning beep for player damage
    this.beep(250, 0.18);
  }
  
  powerUp() { 
    // Classic ascending powerup chime
    this.slideUp(600, 1200, 0.25);
  }
  
  levelUp() {
    // Galaga-style level complete fanfare
    this.beep(800, 0.12);
    setTimeout(() => this.beep(1000, 0.12), 80);
    setTimeout(() => this.beep(1200, 0.16), 160);
  }
  
  gameEnd() { 
    // Classic arcade game over - descending tone
    this.slideDown(800, 200, 0.3);
    setTimeout(() => this.slideDown(600, 100, 0.2), 320);
  }

  // Background music/ambient sound
  playBackgroundMusic() {
    if (!this.enabled || this.backgroundOscillators) return; // Prevent multiple instances
    
    const ctx = this.init();
    if (!ctx) return;

    try {
      this.backgroundOscillators = [];
      this.backgroundGains = [];

      // Create layered ambient background using multiple oscillators
      // Base drone (low frequency)
      const base = ctx.createOscillator();
      const baseGain = ctx.createGain();
      base.type = 'sine';
      base.frequency.value = 80;
      base.connect(baseGain);
      baseGain.connect(ctx.destination);
      baseGain.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
      base.start();
      this.backgroundOscillators.push(base);
      this.backgroundGains.push(baseGain);

      // Mid-range harmonic tone
      const mid = ctx.createOscillator();
      const midGain = ctx.createGain();
      mid.type = 'sine';
      mid.frequency.value = 160;
      mid.connect(midGain);
      midGain.connect(ctx.destination);
      midGain.gain.setValueAtTime(this.volume * 0.12, ctx.currentTime);
      mid.start();
      this.backgroundOscillators.push(mid);
      this.backgroundGains.push(midGain);

      // High ambient tone
      const high = ctx.createOscillator();
      const highGain = ctx.createGain();
      high.type = 'sine';
      high.frequency.value = 240;
      high.connect(highGain);
      highGain.connect(ctx.destination);
      highGain.gain.setValueAtTime(this.volume * 0.1, ctx.currentTime);
      high.start();
      this.backgroundOscillators.push(high);
      this.backgroundGains.push(highGain);

      // Add subtle pulsing effect
      this.backgroundPulseInterval = setInterval(() => {
        if (this.backgroundGains) {
          const pulseTime = 0.3;
          this.backgroundGains.forEach(gain => {
            gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(gain.gain.value * 0.7, ctx.currentTime + pulseTime / 2);
            gain.gain.exponentialRampToValueAtTime(gain.gain.value, ctx.currentTime + pulseTime);
          });
        }
      }, 3000); // Pulse every 3 seconds
    } catch (e) {
      console.log('Background music error:', e);
    }
  }

  // Stop background music
  stopBackgroundMusic() {
    if (this.backgroundOscillators) {
      this.backgroundOscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {}
      });
      this.backgroundOscillators = null;
      this.backgroundGains = null;
    }
    if (this.backgroundPulseInterval) {
      clearInterval(this.backgroundPulseInterval);
      this.backgroundPulseInterval = null;
    }
  }
}

// Create global sound instance
let audio = new Audio();

// Initialize audio on first user interaction
document.addEventListener('click', () => {
  audio.init();
});

document.addEventListener('keydown', () => {
  audio.init();
});
