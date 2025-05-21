/**
 * Chatbot Component for Quantum Particle Network Simulator
 * Provides the main interface for user interaction with the AI assistant
 */

class QuantumChatbot {
  constructor(options = {}) {
    // Store options
    this.options = Object.assign({
      containerId: 'chatContainer',
      messagesId: 'chatMessages',
      inputId: 'chatInput',
      sendButtonId: 'chatSend',
      toggleButtonId: 'chatToggle',
      apiOptions: {},
      systemPrompt: "You are a quantum physics assistant helping users understand the quantum particle simulation they're viewing.",
      maxMemory: 10, // Remember last 10 exchanges
      useDebug: true
    }, options);
    
    // Initialize components
    this.container = document.getElementById(this.options.containerId);
    this.messagesElement = document.getElementById(this.options.messagesId);
    this.inputElement = document.getElementById(this.options.inputId);
    this.sendButton = document.getElementById(this.options.sendButtonId);
    this.toggleButton = document.getElementById(this.options.toggleButtonId);
    
    // Message history
    this.messageHistory = [];
    
    // Initialize API
    this.api = new ChatAPI(this.options.apiOptions);
    
    // Store reference to debug interface if enabled
    this.debug = this.options.useDebug && window.debugInterface ? 
      window.debugInterface : { log: () => {} };
    
    // Initialize connection manager
    this.connection = new ConnectionManager({
      api: this.api,
      onStatusChange: this.handleStatusChange.bind(this)
    });
    
    // Bind event handlers
    this.handleInputKeypress = this.handleInputKeypress.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
    
    // Add event listeners
    this.attachEventListeners();
    
    // Initialize
    this.initialize();
  }
  
  // Initialize the chatbot
  async initialize() {
    this.debug.log('Initializing quantum chatbot...');
    
    // Initialize chat container visibility
    this.isChatVisible = false;
    
    // Send welcome message
    this.addSystemMessage("Welcome to the Quantum Particle Network Simulator. How can I assist you today?");
    
    // Connect to API
    await this.connection.establishConnection();
  }
  
  // Attach event listeners to UI elements
  attachEventListeners() {
    if (this.inputElement) {
      this.inputElement.addEventListener('keypress', this.handleInputKeypress);
    }
    
    if (this.sendButton) {
      this.sendButton.addEventListener('click', this.handleSendClick);
    }
    
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', this.handleToggleClick);
    }
  }
  
  // Handle input keypress events (enter key)
  handleInputKeypress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }
  
  // Handle send button clicks
  handleSendClick() {
    this.sendMessage();
  }
  
  // Handle visibility toggle button clicks
  handleToggleClick() {
    this.toggleChatVisibility();
  }
  
  // Handle API status changes
  handleStatusChange(status) {
    const statusIndicator = document.querySelector('.api-status');
    if (statusIndicator) {
      // Remove all existing status classes
      statusIndicator.classList.remove('connected', 'connecting', 'disconnected', 'error', 'processing');
      
      // Add current status class
      statusIndicator.classList.add(status);
      
      // Update status text
      const statusText = {
        'connected': 'Connected',
        'connecting': 'Connecting...',
        'disconnected': 'Disconnected',
        'error': 'Connection Error',
        'processing': 'Processing...'
      };
      
      statusIndicator.setAttribute('title', statusText[status] || status);
    }
  }
  
  // Toggle chat visibility
  toggleChatVisibility() {
    const chatOverlay = document.querySelector('.chat-overlay');
    if (chatOverlay) {
      if (this.isChatVisible) {
        chatOverlay.classList.remove('visible');
      } else {
        chatOverlay.classList.add('visible');
      }
      
      this.isChatVisible = !this.isChatVisible;
      
      // Focus input when chat becomes visible
      if (this.isChatVisible && this.inputElement) {
        setTimeout(() => this.inputElement.focus(), 300);
      }
    }
  }
  
  // Send message to API
  async sendMessage() {
    if (!this.inputElement) return;
    
    const messageText = this.inputElement.value.trim();
    if (!messageText) return;
    
    // Clear input
    this.inputElement.value = '';
    
    // Add user message to chat
    this.addUserMessage(messageText);
    
    // Get current simulation context to provide to the API
    const simulationContext = this.getSimulationContext();
    
    try {
      // Send to API with context
      const response = await this.api.sendMessage(messageText, simulationContext);
      
      // Add response to chat
      if (response && response.text) {
        this.addBotMessage(response.text);
      } else {
        this.addSystemMessage("Sorry, I couldn't generate a response. Please try again.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.addSystemMessage("An error occurred while processing your message. Please try again later.");
    }
  }
  
  // Get current simulation context to enhance responses
  getSimulationContext() {
    // This will be populated with data from the simulation
    const context = {
      particleCount: window.simulator ? window.simulator.particleCount : 1000,
      activeMode: document.getElementById('shapeMode') ? 
        document.getElementById('shapeMode').value : 'default',
      colorMode: document.getElementById('colorMode') ? 
        document.getElementById('colorMode').value : 'default',
      simulationTime: window.simulationTime || 0
    };
    
    return context;
  }
  
  // Add user message to chat
  addUserMessage(text) {
    if (!this.messagesElement) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    
    const timestamp = this.formatTimestamp(new Date());
    
    messageElement.innerHTML = `
      <div class="message-content">${this.escapeHtml(text)}</div>
      <div class="message-timestamp">${timestamp}</div>
    `;
    
    this.messagesElement.appendChild(messageElement);
    this.scrollToBottom();
    
    // Add to history
    this.addToHistory('user', text);
  }
  
  // Add bot message to chat
  addBotMessage(text) {
    if (!this.messagesElement) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    
    const timestamp = this.formatTimestamp(new Date());
    
    // Format markdown-like syntax
    const formattedText = this.formatMessageText(text);
    
    messageElement.innerHTML = `
      <div class="message-content">${formattedText}</div>
      <div class="message-timestamp">${timestamp}</div>
    `;
    
    this.messagesElement.appendChild(messageElement);
    this.scrollToBottom();
    
    // Add to history
    this.addToHistory('bot', text);
  }
  
  // Add system message to chat
  addSystemMessage(text) {
    if (!this.messagesElement) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message system-message';
    
    messageElement.innerHTML = `
      <div class="message-content">${this.escapeHtml(text)}</div>
    `;
    
    this.messagesElement.appendChild(messageElement);
    this.scrollToBottom();
  }
  
  // Format message text (handle markdown-like syntax)
  formatMessageText(text) {
    // Escape HTML first to prevent injection
    let formattedText = this.escapeHtml(text);
    
    // Bold: **text**
    formattedText = formattedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    formattedText = formattedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Code: `text`
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // New lines
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    return formattedText;
  }
  
  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Format timestamp
  formatTimestamp(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // Scroll chat to bottom
  scrollToBottom() {
    if (this.messagesElement) {
      this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
    }
  }
  
  // Add message to history
  addToHistory(role, content) {
    this.messageHistory.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });
    
    // Trim history if it exceeds maximum
    if (this.messageHistory.length > this.options.maxMemory) {
      this.messageHistory.shift();
    }
  }
  
  // Get message history
  getMessageHistory() {
    return this.messageHistory;
  }
  
  // Clear chat history
  clearHistory() {
    this.messageHistory = [];
    
    if (this.messagesElement) {
      // Remove all messages except system messages
      const messages = this.messagesElement.querySelectorAll('.user-message, .bot-message');
      messages.forEach(msg => msg.remove());
      
      // Add system message
      this.addSystemMessage("Chat history cleared.");
    }
  }
}

// Export the chatbot interface
window.QuantumChatbot = QuantumChatbot;