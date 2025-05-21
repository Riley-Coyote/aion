/**
 * Connection Manager for Quantum Particle Network Simulator Chat
 * Handles API connectivity and session management
 */

class ConnectionManager {
  constructor(options = {}) {
    this.api = options.api;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 2000; // 2 seconds
    this.onStatusChange = options.onStatusChange || function() {};
    this.connectionAttempts = 0;
    this.connected = false;
    
    // Pass through status changes from the API
    if (this.api && typeof this.api.onStatusChange === 'function') {
      const originalStatusChange = this.api.onStatusChange;
      this.api.onStatusChange = (status) => {
        originalStatusChange(status);
        this.onStatusChange(status);
      };
    }
  }
  
  // Establish connection to the API
  async establishConnection() {
    if (!this.api) {
      console.error('No API instance provided');
      this.onStatusChange('error');
      return false;
    }
    
    // Reset connection attempts counter
    this.connectionAttempts = 0;
    
    try {
      return await this.connectWithRetry();
    } catch (error) {
      console.error('Failed to establish connection after retries:', error);
      this.onStatusChange('error');
      return false;
    }
  }
  
  // Connect with retry logic
  async connectWithRetry() {
    while (this.connectionAttempts < this.maxRetries) {
      this.connectionAttempts++;
      
      try {
        // Attempt to connect
        const success = await this.api.connect();
        
        if (success) {
          this.connected = true;
          return true;
        }
      } catch (error) {
        console.warn(`Connection attempt ${this.connectionAttempts} failed:`, error);
      }
      
      // If we're going to retry, wait before the next attempt
      if (this.connectionAttempts < this.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    
    // If we get here, all connection attempts failed
    throw new Error('Maximum connection attempts reached');
  }
  
  // Check if the connection is still active
  async checkConnection() {
    if (!this.connected) {
      return await this.establishConnection();
    }
    
    return true;
  }
  
  // Reconnect if disconnected
  async reconnect() {
    this.connected = false;
    return await this.establishConnection();
  }
  
  // Disconnect from the API
  disconnect() {
    if (this.api && typeof this.api.disconnect === 'function') {
      this.api.disconnect();
    }
    
    this.connected = false;
    this.onStatusChange('disconnected');
  }
}

// Export the connection manager
window.ConnectionManager = ConnectionManager;