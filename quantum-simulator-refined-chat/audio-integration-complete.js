/**
 * Audio Integration for Quantum Simulator
 * Connects audio analyzer with particle simulation
 */

// Audio analyzer for sound visualization
let audioAnalyzer = null;
let activeHarmonics = [1, 2, 3, 4, 5]; // Default harmonics

// Initialize audio analyzer
function initAudioAnalyzer() {
  audioAnalyzer = new AudioAnalyzer({
    fftSize: 2048,
    smoothingTimeConstant: 0.85,
    onAnalysisUpdate: updateVisualizationFromAudio,
    onError: message => {
      console.error('Audio error:', message);
      // Show an error message to the user
      const canvas = document.getElementById('audioVisualizerCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff4040';
        ctx.font = '12px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText('Audio error: ' + message, canvas.width / 2, canvas.height / 2);
      }
    }
  });
  
  return audioAnalyzer.initialize();
}

// Setup audio controls
function setupAudioControls() {
  const micButton = document.getElementById('micButton');
  const fileButton = document.getElementById('fileButton');
  const audioFileInput = document.getElementById('audioFileInput');
  const playButton = document.getElementById('playButton');
  const frequencySelect = document.getElementById('baseFrequency');
  const harmonicButtons = document.querySelectorAll('.harmonic-preset');
  
  // Initialize the visualizer canvas
  initAudioVisualizer();
  
  // Microphone button
  if (micButton) {
    micButton.addEventListener('click', async () => {
      if (!audioAnalyzer) {
        await initAudioAnalyzer();
      }
      
      // Toggle microphone on/off
      if (micButton.classList.contains('active')) {
        audioAnalyzer.stop();
        micButton.classList.remove('active');
        
        // Clear visualization
        clearAudioVisualizer();
      } else {
        // Deactivate other buttons
        fileButton.classList.remove('active');
        playButton.classList.remove('active');
        
        // Start microphone
        const success = await audioAnalyzer.startMicrophone();
        if (success) {
          micButton.classList.add('active');
          
          // Change shape mode to harmonics for visualization
          if (window.shapeMode !== 'harmonics') {
            const harmonicsButton = document.querySelector('button[data-mode="harmonics"]');
            if (harmonicsButton) {
              harmonicsButton.click();
            }
          }
        }
      }
    });
  }
  
  // File input button
  if (fileButton && audioFileInput) {
    fileButton.addEventListener('click', () => {
      audioFileInput.click();
    });
    
    audioFileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!audioAnalyzer) {
        await initAudioAnalyzer();
      }
      
      // Deactivate other buttons
      micButton.classList.remove('active');
      playButton.classList.remove('active');
      
      // Load audio file
      const success = await audioAnalyzer.loadAudioFile(file);
      if (success) {
        fileButton.classList.add('active');
        
        // Change shape mode to harmonics for visualization
        if (window.shapeMode !== 'harmonics') {
          const harmonicsButton = document.querySelector('button[data-mode="harmonics"]');
          if (harmonicsButton) {
            harmonicsButton.click();
          }
        }
      }
    });
  }
  
  // Play button and harmonic generation
  if (playButton && frequencySelect) {
    // Set up harmonic preset buttons
    harmonicButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active state
        harmonicButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Parse harmonics
        const harmonicsString = button.getAttribute('data-harmonics');
        if (harmonicsString) {
          activeHarmonics = harmonicsString.split(',').map(h => parseFloat(h));
        }
      });
    });
    
    // Set initial active harmonic
    harmonicButtons[0].classList.add('active');
    
    // Play button
    playButton.addEventListener('click', async () => {
      if (!audioAnalyzer) {
        await initAudioAnalyzer();
      }
      
      // Deactivate other buttons
      micButton.classList.remove('active');
      fileButton.classList.remove('active');
      
      // Get selected frequency
      const baseFrequency = parseFloat(frequencySelect.value);
      
      // Play chord with selected harmonics
      const success = await audioAnalyzer.playChord(baseFrequency, activeHarmonics, 3);
      if (success) {
        playButton.classList.add('active');
        
        // Reset button after playback completes
        setTimeout(() => {
          playButton.classList.remove('active');
        }, 3000);
        
        // Change shape mode to harmonics for visualization
        if (window.shapeMode !== 'harmonics') {
          const harmonicsButton = document.querySelector('button[data-mode="harmonics"]');
          if (harmonicsButton) {
            harmonicsButton.click();
          }
        }
      }
    });
  }
}

// Initialize audio visualizer canvas
function initAudioVisualizer() {
  const canvas = document.getElementById('audioVisualizerCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Draw empty state
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#888';
  ctx.font = '11px JetBrains Mono';
  ctx.textAlign = 'center';
  ctx.fillText('No audio input', canvas.width / 2, canvas.height / 2);
}

// Clear audio visualizer
function clearAudioVisualizer() {
  const canvas = document.getElementById('audioVisualizerCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw empty state
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#888';
  ctx.font = '11px JetBrains Mono';
  ctx.textAlign = 'center';
  ctx.fillText('No audio input', canvas.width / 2, canvas.height / 2);
}

// Update visualization from audio analysis
function updateVisualizationFromAudio(metrics) {
  // Update visualizer canvas
  const canvas = document.getElementById('audioVisualizerCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, width, height);
  
  // Draw frequency data
  const barCount = 64; // Number of frequency bars to show
  const frequencyData = metrics.frequencyData;
  const barWidth = width / barCount;
  
  for (let i = 0; i < barCount; i++) {
    // Get frequency value (0-255)
    const index = Math.floor(i * frequencyData.length / barCount);
    const value = frequencyData[index] / 255; // Normalize to 0-1
    
    // Calculate bar height
    const barHeight = value * height;
    
    // Color based on frequency (hue from 220 to 0, higher frequencies are "hotter")
    const hue = 220 - (i / barCount) * 220;
    ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.7 + value * 0.3})`;
    
    // Draw bar
    const x = i * barWidth;
    const y = height - barHeight;
    ctx.fillRect(x, y, barWidth - 1, barHeight);
  }
  
  // Draw time domain waveform
  const timeData = metrics.timeData;
  const timeStep = width / timeData.length;
  
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < timeData.length; i++) {
    const x = i * timeStep;
    const y = (timeData[i] / 255) * height / 2 + height / 4;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  // Update simulator with audio data if we have access to settings
  if (window.settings && window.shapeMode === 'harmonics') {
    // Set harmonics in settings
    window.settings.harmonicSeries = getHarmonicsFromAudio(metrics);
    window.settings.waveAmplitude = 0.8 + metrics.bassEnergy * 2;
    window.settings.fundamentalFrequency = 0.2 + metrics.midEnergy * 0.4;
    
    // Flash particle colors on beats
    if (metrics.isBeat) {
      window.settings.pulseStrength = 0.2 + metrics.bassEnergy * 0.3;
    }
  }
}

// Extract harmonics from audio data
function getHarmonicsFromAudio(metrics) {
  // Find peaks in frequency data
  const frequencyData = metrics.frequencyData;
  const peaks = [];
  
  // Find local maxima in frequency data
  for (let i = 2; i < frequencyData.length - 2; i++) {
    if (frequencyData[i] > 100 && // Amplitude threshold
        frequencyData[i] > frequencyData[i-1] && 
        frequencyData[i] > frequencyData[i-2] && 
        frequencyData[i] > frequencyData[i+1] && 
        frequencyData[i] > frequencyData[i+2]) {
      peaks.push(i);
    }
  }
  
  // If no clear peaks, use bass, mid, treble energy to create harmonics
  if (peaks.length < 3) {
    return [
      1, 
      1 + metrics.bassEnergy, 
      2 - metrics.midEnergy * 0.5, 
      3 + metrics.trebleEnergy * 2,
      5,
      8
    ];
  }
  
  // Get the first few peaks
  const harmonics = peaks.slice(0, 6).map(peak => {
    // Normalize to a reasonable range
    return 1 + (peak / frequencyData.length) * 10;
  });
  
  // Ensure we have at least 3 harmonics
  while (harmonics.length < 3) {
    const lastHarmonic = harmonics[harmonics.length - 1] || 1;
    harmonics.push(lastHarmonic * 2);
  }
  
  return harmonics;
}

// Make audio controls globally available
window.audioControls = {
  setup: setupAudioControls,
  init: initAudioAnalyzer,
  visualize: initAudioVisualizer,
  clear: clearAudioVisualizer
};