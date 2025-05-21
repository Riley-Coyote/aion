/**
 * Debug Interface for Quantum Particle Network Simulator
 * Provides debugging tools and logging for development and troubleshooting
 */

class DebugInterface {
  constructor(options = {}) {
    this.options = Object.assign({
      enabled: true,
      logToConsole: true,
      logToUI: true,
      maxLogEntries: 100,
      containerId: 'debugContainer',
      logLevels: ['info', 'warn', 'error', 'debug'],
      showTimestamp: true
    }, options);
    
    // Initialize log container
    this.logEntries = [];
    this.debugContainer = null;
    
    if (this.options.logToUI) {
      this.debugContainer = document.getElementById(this.options.containerId);
      
      // Create debug container if it doesn't exist
      if (!this.debugContainer && this.options.createContainer) {
        this.createDebugContainer();
      }
    }
    
    // Register global error handler
    if (this.options.catchErrors) {
      this.registerErrorHandler();
    }
    
    // Initialize
    this.log('Debug interface initialized', 'info');
  }
  
  // Create debug container if it doesn't exist
  createDebugContainer() {
    const container = document.createElement('div');
    container.id = this.options.containerId;
    container.className = 'debug-container';
    container.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      width: 500px;
      max-height: 300px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 5px;
      z-index: 9999;
      overflow-y: auto;
      display: none;
    `;
    
    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Debug';
    toggleButton.style.cssText = `
      position: fixed;
      bottom: 10px;
      left: 10px;
      z-index: 10000;
      background: #333;
      color: #00ff00;
      border: 1px solid #00ff00;
      border-radius: 4px;
      padding: 5px 10px;
      font-family: monospace;
      cursor: pointer;
    `;
    
    toggleButton.addEventListener('click', () => {
      const isVisible = container.style.display !== 'none';
      container.style.display = isVisible ? 'none' : 'block';
    });
    
    document.body.appendChild(container);
    document.body.appendChild(toggleButton);
    
    this.debugContainer = container;
  }
  
  // Register global error handler
  registerErrorHandler() {
    window.addEventListener('error', (event) => {
      this.log(`Uncaught error: ${event.message} at ${event.filename}:${event.lineno}`, 'error');
      // Don't prevent default error handling
      return false;
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.log(`Unhandled promise rejection: ${event.reason}`, 'error');
    });
  }
  
  // Log a message
  log(message, level = 'debug') {
    if (!this.options.enabled || !this.options.logLevels.includes(level)) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const entry = {
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      level,
      timestamp
    };
    
    // Add to log entries
    this.logEntries.push(entry);
    
    // Trim log if it exceeds max size
    if (this.logEntries.length > this.options.maxLogEntries) {
      this.logEntries.shift();
    }
    
    // Log to console
    if (this.options.logToConsole) {
      const consoleMethod = level === 'error' ? 'error' : 
                          level === 'warn' ? 'warn' : 
                          level === 'info' ? 'info' : 'log';
      
      console[consoleMethod](`[${level.toUpperCase()}] ${this.options.showTimestamp ? timestamp + ' - ' : ''}${entry.message}`);
    }
    
    // Log to UI
    if (this.options.logToUI && this.debugContainer) {
      this.updateDebugUI();
    }
  }
  
  // Update debug UI with latest logs
  updateDebugUI() {
    if (!this.debugContainer) return;
    
    // Clear existing content
    this.debugContainer.innerHTML = '';
    
    // Add each log entry
    this.logEntries.forEach(entry => {
      const logElement = document.createElement('div');
      logElement.className = `log-entry log-${entry.level}`;
      
      const timestamp = this.options.showTimestamp ? 
        `<span class="log-timestamp">${new Date(entry.timestamp).toLocaleTimeString()}</span>` : '';
      
      logElement.innerHTML = `
        ${timestamp}
        <span class="log-level">[${entry.level.toUpperCase()}]</span>
        <span class="log-message">${entry.message}</span>
      `;
      
      this.debugContainer.appendChild(logElement);
    });
    
    // Scroll to bottom
    this.debugContainer.scrollTop = this.debugContainer.scrollHeight;
  }
  
  // Clear all logs
  clear() {
    this.logEntries = [];
    
    if (this.options.logToConsole) {
      console.clear();
    }
    
    if (this.options.logToUI && this.debugContainer) {
      this.debugContainer.innerHTML = '';
    }
    
    this.log('Logs cleared', 'info');
  }
  
  // Get all log entries
  getLogs() {
    return this.logEntries;
  }
  
  // Toggle debug visibility
  toggle() {
    this.options.enabled = !this.options.enabled;
    this.log(`Debug ${this.options.enabled ? 'enabled' : 'disabled'}`, 'info');
    
    if (this.debugContainer) {
      this.debugContainer.style.display = this.options.enabled ? 'block' : 'none';
    }
  }
}

// Export the debug interface
window.DebugInterface = DebugInterface;

// Create global debug instance
window.debugInterface = new DebugInterface({
  enabled: true,
  createContainer: true,
  catchErrors: true
});