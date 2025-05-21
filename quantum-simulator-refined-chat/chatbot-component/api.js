/**
 * API Interface for Quantum Particle Network Simulator Chat
 * Handles communication with backend AI services
 */

class ChatAPI {
  constructor(options = {}) {
    this.apiEndpoint = options.apiEndpoint || 'https://api.example.com/chat';
    this.apiKey = options.apiKey || null;
    this.model = options.model || 'quantum-assistant-1.0';
    this.maxRetries = options.maxRetries || 3;
    this.timeout = options.timeout || 30000; // 30 seconds
    this.status = 'disconnected';
    this.onStatusChange = options.onStatusChange || function() {};
    
    // Use local response generation when no API is available
    this.useLocalFallback = options.useLocalFallback !== false;
    
    // Trigger initial status update
    this.updateStatus('disconnected');
  }
  
  // Update API connection status
  updateStatus(status) {
    this.status = status;
    this.onStatusChange(status);
  }
  
  // Connect to API
  async connect() {
    try {
      this.updateStatus('connecting');
      
      // Simulated connection - in production would check actual API availability
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.updateStatus('connected');
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      this.updateStatus('error');
      return false;
    }
  }
  
  // Send message to API
  async sendMessage(message, context = {}) {
    try {
      this.updateStatus('processing');
      
      // In a real implementation, this would make an actual API call
      // For this demo, we'll simulate a response
      
      // Add slight delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      // If we're using fallback mode or no API key is available
      if (this.useLocalFallback || !this.apiKey) {
        const response = this.generateLocalResponse(message, context);
        this.updateStatus('connected');
        return response;
      }
      
      // This would be a real API call in production
      const response = {
        text: "This would be a response from the actual API service.",
        confidence: 0.95,
        timestamp: new Date().toISOString()
      };
      
      this.updateStatus('connected');
      return response;
    } catch (error) {
      console.error('API error:', error);
      this.updateStatus('error');
      
      return {
        text: "I'm sorry, I encountered an error processing your request. Please try again later.",
        error: true,
        errorDetail: error.message
      };
    }
  }
  
  // Local fallback response generation
  generateLocalResponse(message, context = {}) {
    // Convert message to lowercase for easier matching
    const msg = message.toLowerCase();
    
    // Get simulation context
    const { particleCount, activeMode, colorMode } = context;
    
    // Predetermined responses based on message content
    if (msg.includes('hello') || msg.includes('hi ')) {
      return {
        text: "Hello! I'm your quantum simulation assistant. How can I help you understand the current particle system?",
        confidence: 0.98
      };
    } else if (msg.includes('help')) {
      return {
        text: "I can explain the quantum simulation, describe the different modes, or help you interpret what you're seeing. What would you like to know?",
        confidence: 0.95
      };
    } else if (msg.includes('what') && msg.includes('this')) {
      return {
        text: "This is a quantum particle network simulator that visualizes quantum-inspired particle behaviors. It models different quantum phenomena through particle interactions and field effects.",
        confidence: 0.92
      };
    } else if (msg.includes('mode') || msg.includes('pattern')) {
      return {
        text: `You're currently using the ${activeMode || 'default'} mode, which simulates ${this.describeModeEffect(activeMode)}. The particles are visualized using the ${colorMode || 'standard'} color scheme.`,
        confidence: 0.85
      };
    } else if (msg.includes('particle') && (msg.includes('count') || msg.includes('number'))) {
      return {
        text: `The simulation currently has ${particleCount || 'many'} particles. Each particle represents a quantum probability wave function in the system.`,
        confidence: 0.88
      };
    } else if (msg.includes('quantum')) {
      return {
        text: "Quantum mechanics describes nature at the atomic and subatomic scales. This simulation visualizes quantum concepts like wave-particle duality, superposition, and entanglement through the behavior of the particle system.",
        confidence: 0.9
      };
    } else if (msg.includes('color') || msg.includes('colors')) {
      return {
        text: `The current color scheme (${colorMode || 'standard'}) represents different quantum properties of the particles, such as energy levels, probability density, or phase relationships.`,
        confidence: 0.86
      };
    } else {
      return {
        text: "I'm still learning about quantum simulations. Could you rephrase your question or ask about the particle behaviors, simulation modes, or visualization options?",
        confidence: 0.7
      };
    }
  }
  
  // Helper to describe different simulation modes
  describeModeEffect(mode) {
    const descriptions = {
      'default': 'natural quantum fluctuations in a field',
      'attractor': 'gravitational-like attraction between particles',
      'wave': 'quantum wave propagation through space',
      'vortex': 'quantum vorticity and angular momentum',
      'entanglement': 'quantum entanglement between particle pairs',
      'superposition': 'quantum superposition of multiple states',
      'interference': 'quantum wave interference patterns',
      'decoherence': 'quantum decoherence as particles interact with environment',
      'tunneling': 'quantum tunneling through potential barriers',
      'classicWave': 'classical wave mechanics'
    };
    
    return descriptions[mode] || 'complex quantum interactions';
  }
  
  // Disconnect from API
  disconnect() {
    this.updateStatus('disconnected');
  }
}

// Export the API interface
window.ChatAPI = ChatAPI;