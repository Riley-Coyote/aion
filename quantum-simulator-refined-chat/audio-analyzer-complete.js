/**
 * Audio Analyzer for Quantum Simulator
 * Provides real-time audio analysis for visualization
 */

class AudioAnalyzer {
  constructor(options = {}) {
    this.options = Object.assign({
      fftSize: 2048,
      smoothingTimeConstant: 0.85,
      minDecibels: -100,
      maxDecibels: -30,
      onAnalysisUpdate: null,
      onError: message => console.error(message)
    }, options);
    
    this.isInitialized = false;
    this.isActive = false;
    this.audioContext = null;
    this.analyzer = null;
    this.source = null;
    this.frequencyData = null;
    this.timeData = null;
    this.animationFrame = null;
  }
  
  /**
   * Initialize the audio analyzer with user's microphone
   */
  async initialize() {
    if (this.isInitialized) return true;
    
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Setup analyzer node
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = this.options.fftSize;
      this.analyzer.smoothingTimeConstant = this.options.smoothingTimeConstant;
      this.analyzer.minDecibels = this.options.minDecibels;
      this.analyzer.maxDecibels = this.options.maxDecibels;
      
      // Create data arrays for analysis
      this.frequencyData = new Uint8Array(this.analyzer.frequencyBinCount);
      this.timeData = new Uint8Array(this.analyzer.fftSize);
      
      // Mark as initialized
      this.isInitialized = true;
      console.log('Audio analyzer initialized successfully');
      
      return true;
    } catch (error) {
      this.options.onError(`Failed to initialize audio analyzer: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Start analyzing audio from user's microphone
   */
  async startMicrophone() {
    if (!this.isInitialized && !(await this.initialize())) {
      return false;
    }
    
    if (this.isActive) return true;
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      // Create media stream source
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyzer);
      
      // Start analysis loop
      this.isActive = true;
      this.startAnalysisLoop();
      
      console.log('Microphone input started');
      return true;
    } catch (error) {
      this.options.onError(`Microphone access denied or error: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Load and analyze audio from a file
   */
  async loadAudioFile(file) {
    if (!this.isInitialized && !(await this.initialize())) {
      return false;
    }
    
    if (this.isActive) {
      this.stop();
    }
    
    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      });
      
      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Create buffer source
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = audioBuffer;
      
      // Connect through analyzer
      this.source.connect(this.analyzer);
      this.analyzer.connect(this.audioContext.destination);
      
      // Start playback
      this.source.start(0);
      
      // Start analysis loop
      this.isActive = true;
      this.startAnalysisLoop();
      
      // Set up event for when audio finishes
      this.source.onended = () => {
        this.stop();
      };
      
      console.log('Audio file loaded and playing');
      return true;
    } catch (error) {
      this.options.onError(`Failed to load audio file: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Generate harmonic tone at specified frequency
   */
  playTone(frequency, duration = 2, waveform = 'sine') {
    if (!this.isInitialized && !this.initialize()) {
      return false;
    }
    
    if (this.isActive) {
      this.stop();
    }
    
    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Create oscillator
      this.source = this.audioContext.createOscillator();
      this.source.type = waveform; // sine, square, sawtooth, triangle
      this.source.frequency.value = frequency;
      
      // Add gain control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.5;
      
      // Smooth attack/release
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
      
      // Connect nodes
      this.source.connect(gainNode);
      gainNode.connect(this.analyzer);
      this.analyzer.connect(this.audioContext.destination);
      
      // Start oscillator
      this.source.start();
      this.source.stop(this.audioContext.currentTime + duration);
      
      // Set up event for when tone finishes
      this.source.onended = () => {
        this.stop();
      };
      
      // Start analysis loop
      this.isActive = true;
      this.startAnalysisLoop();
      
      console.log(`Playing ${waveform} tone at ${frequency}Hz`);
      return true;
    } catch (error) {
      this.options.onError(`Failed to play tone: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Play chord with harmonics
   */
  playChord(baseFrequency, harmonics = [1, 3/2, 2], duration = 3) {
    if (!this.isInitialized && !this.initialize()) {
      return false;
    }
    
    if (this.isActive) {
      this.stop();
    }
    
    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Create gain node for master output
      const masterGain = this.audioContext.createGain();
      masterGain.gain.value = 0.7;
      masterGain.connect(this.analyzer);
      this.analyzer.connect(this.audioContext.destination);
      
      // Create oscillators for each harmonic
      const oscillators = harmonics.map(ratio => {
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = baseFrequency * ratio;
        
        // Create individual gain for this oscillator
        const gain = this.audioContext.createGain();
        gain.gain.value = 1 / harmonics.length * 0.8;
        
        // Add fade in/out
        gain.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(1 / harmonics.length * 0.8, this.audioContext.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
        
        // Connect oscillator to its gain, then to master gain
        osc.connect(gain);
        gain.connect(masterGain);
        
        return osc;
      });
      
      // Start all oscillators
      oscillators.forEach(osc => {
        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
      });
      
      // Store reference to stop later
      this.source = {
        oscillators,
        stop: () => oscillators.forEach(osc => osc.stop())
      };
      
      // Set timeout to stop analysis when chord ends
      setTimeout(() => {
        this.stop();
      }, duration * 1000);
      
      // Start analysis loop
      this.isActive = true;
      this.startAnalysisLoop();
      
      console.log(`Playing chord with base frequency ${baseFrequency}Hz`);
      return true;
    } catch (error) {
      this.options.onError(`Failed to play chord: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Run continuous analysis loop
   */
  startAnalysisLoop() {
    if (!this.isActive) return;
    
    const analyzeFrame = () => {
      if (!this.isActive) return;
      
      // Get frequency and time domain data
      this.analyzer.getByteFrequencyData(this.frequencyData);
      this.analyzer.getByteTimeDomainData(this.timeData);
      
      // Calculate audio metrics
      const metrics = this.calculateAudioMetrics();
      
      // Call update callback if provided
      if (typeof this.options.onAnalysisUpdate === 'function') {
        this.options.onAnalysisUpdate(metrics);
      }
      
      // Schedule next frame
      this.animationFrame = requestAnimationFrame(analyzeFrame);
    };
    
    // Start loop
    this.animationFrame = requestAnimationFrame(analyzeFrame);
  }
  
  /**
   * Calculate various audio metrics from raw data
   */
  calculateAudioMetrics() {
    const frequencyBinCount = this.analyzer.frequencyBinCount;
    const sampleRate = this.audioContext.sampleRate;
    
    // Calculate bass, mid, treble energy levels
    const bassEnd = Math.floor(frequencyBinCount * 0.1);  // ~0-200Hz
    const midEnd = Math.floor(frequencyBinCount * 0.5);   // ~200-2000Hz
    
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;
    let totalSum = 0;
    
    // Calculate frequency-band energy
    for (let i = 0; i < frequencyBinCount; i++) {
      const value = this.frequencyData[i] / 255; // Normalize to 0-1
      
      if (i < bassEnd) {
        bassSum += value;
      } else if (i < midEnd) {
        midSum += value;
      } else {
        trebleSum += value;
      }
      
      totalSum += value;
    }
    
    // Normalize energy levels
    const bassEnergy = bassSum / bassEnd;
    const midEnergy = midSum / (midEnd - bassEnd);
    const trebleEnergy = trebleSum / (frequencyBinCount - midEnd);
    const totalEnergy = totalSum / frequencyBinCount;
    
    // Find dominant frequency
    let maxValue = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < frequencyBinCount; i++) {
      if (this.frequencyData[i] > maxValue) {
        maxValue = this.frequencyData[i];
        maxIndex = i;
      }
    }
    
    const dominantFrequency = maxIndex * sampleRate / (this.analyzer.fftSize * 2);
    
    // Calculate spectral centroid (brightness)
    let weightedSum = 0;
    let spectrumSum = 0;
    
    for (let i = 0; i < frequencyBinCount; i++) {
      const frequency = i * sampleRate / (this.analyzer.fftSize * 2);
      const amplitude = this.frequencyData[i] / 255;
      
      weightedSum += frequency * amplitude;
      spectrumSum += amplitude;
    }
    
    const spectralCentroid = weightedSum / spectrumSum;
    
    // Detect beats by looking for significant bass energy increase
    const isBeat = bassEnergy > 0.5 && bassEnergy > this.lastBassEnergy * 1.3;
    this.lastBassEnergy = bassEnergy;
    
    // Calculate zero-crossing rate (noisiness)
    let zeroCrossings = 0;
    
    for (let i = 1; i < this.timeData.length; i++) {
      if ((this.timeData[i - 1] < 128 && this.timeData[i] >= 128) ||
          (this.timeData[i - 1] >= 128 && this.timeData[i] < 128)) {
        zeroCrossings++;
      }
    }
    
    const zeroCrossingRate = zeroCrossings / this.timeData.length;
    
    // Return all metrics
    return {
      frequencyData: Array.from(this.frequencyData),
      timeData: Array.from(this.timeData),
      bassEnergy,
      midEnergy,
      trebleEnergy,
      totalEnergy,
      dominantFrequency,
      spectralCentroid,
      zeroCrossingRate,
      isBeat
    };
  }
  
  /**
   * Stop audio analysis
   */
  stop() {
    if (!this.isActive) return;
    
    // Stop analysis loop
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    // Stop audio source
    if (this.source) {
      if (typeof this.source.stop === 'function') {
        this.source.stop();
      } else if (this.source.oscillators) {
        this.source.oscillators.forEach(osc => {
          if (osc.stop && osc.context.state !== 'closed') {
            osc.stop();
          }
        });
      }
      
      this.source = null;
    }
    
    this.isActive = false;
    console.log('Audio analysis stopped');
  }
  
  /**
   * Clean up and release resources
   */
  dispose() {
    this.stop();
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isInitialized = false;
    console.log('Audio analyzer disposed');
  }
}

// Make available globally
window.AudioAnalyzer = AudioAnalyzer;