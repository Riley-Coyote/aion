/**
 * Express Server for Quantum Simulator with AI Chat and Audio Visualization
 * 
 * This Node.js server uses Express to serve the application files and provides
 * a simple API endpoint for the chatbot functionality.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Create Express app
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'quantum-simulator-complete.html'));
});

// Fallback route for the original HTML file if someone tries to access it directly
app.get('/quantum-simulator-refined-chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'quantum-simulator-complete.html'));
});

// 404 page handling
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    next(); // Let API routes handle their own 404s
    return;
  }
  
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// API Routes
// Chat API endpoint
app.post('/api/chat', (req, res) => {
  try {
    const data = req.body;
    
    // Quantum physics themed responses
    const response = {
      text: generateQuantumResponse(data.message),
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// Status API endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.1.0',
    features: ['quantum-simulation', 'ai-chat', 'audio-visualization'],
    timestamp: new Date().toISOString()
  });
});

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Generate a quantum physics themed response based on the user's message
function generateQuantumResponse(message) {
  if (!message) return "I'm your quantum assistant. How can I help you today?";
  
  const msg = message.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi ')) {
    return "Hello! I'm your quantum simulation assistant. How can I help you understand the simulation today?";
  } else if (msg.includes('help')) {
    return "I can explain quantum concepts, describe the simulation behaviors, or help you interpret what you're seeing. What specific aspect would you like to explore?";
  } else if ((msg.includes('what') && msg.includes('this')) || msg.includes('explain')) {
    return "This is a quantum particle network simulator that visualizes quantum-inspired behaviors through particle interactions. Each point of light represents a quantum particle with properties like position, momentum, and energy levels. The patterns emerge from mathematical models inspired by quantum mechanics principles.";
  } else if (msg.includes('quantum')) {
    return "Quantum mechanics describes nature at the smallest scales. Key quantum concepts visualized here include wave-particle duality (particles behaving as both particles and waves), quantum uncertainty (positions and velocities cannot both be precisely known), and quantum entanglement (particles that remain connected regardless of distance).";
  } else if (msg.includes('audio') || msg.includes('sound') || msg.includes('harmonic')) {
    return "The audio visualization feature transforms sound into quantum particle patterns. When you use the 'Harmonics' mode, the particles organize according to harmonic frequencies detected in the audio. You can use your microphone, play audio files, or generate harmonic tones to see how different sounds create unique quantum-inspired visualizations.";
  } else if (msg.includes('particle') || msg.includes('particles')) {
    return "The particles in this simulation represent quantum probability waves. Their behavior is governed by quantum-inspired equations that determine how they move and interact. The brightness, color, and connections between particles represent different quantum properties like energy states and entanglement relationships.";
  } else if (msg.includes('entangle') || msg.includes('entanglement')) {
    return "Quantum entanglement is a phenomenon where particles become correlated in such a way that the quantum state of each particle cannot be described independently. In this simulation, entangled particles are represented by connections between points, showing how changing one particle instantaneously affects its entangled partners.";
  } else if (msg.includes('wave') || msg.includes('function')) {
    return "The wave function is a mathematical description of the quantum state of a system. In this simulation, the particles represent probability amplitudes of quantum wave functions. The wave-like patterns you see emerge from the mathematical properties of these functions interacting with each other.";
  } else if (msg.includes('superposition')) {
    return "Quantum superposition is the ability of quantum systems to exist in multiple states simultaneously until measured. In this simulation, particles with changing colors or oscillating brightness represent systems in superposition, existing in multiple energy states at once.";
  } else if (msg.includes('mode') || msg.includes('change') || msg.includes('different')) {
    return "You can explore different quantum phenomena by changing the simulation modes. Try 'Harmonics' mode for audio visualization, 'Entanglement' to see quantum correlation, or 'Wave' for quantum wave propagation patterns.";
  } else {
    return "That's an interesting question about quantum physics. The simulation visualizes quantum-inspired behavior, showing how particles interact according to quantum mechanical principles. If you'd like to know more about a specific aspect, please ask about concepts like superposition, entanglement, or wave functions.";
  }
}

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log(`Audio-enabled Quantum Simulator ready!`);
});