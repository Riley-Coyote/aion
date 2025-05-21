// AIInterface.js - Natural language interface for the Aion Protocol
import * as THREE from 'three';

export class AIInterface {
    constructor(simulationManager) {
        this.simulationManager = simulationManager;
        
        // Chat history
        this.chatHistory = [];
        
        // Command recognition
        this.commands = this.initializeCommands();
        
        // UI elements
        this.chatContainer = null;
        this.inputField = null;
        
        // Initialize UI
        this.initializeUI();
    }
    
    initializeUI() {
        // Create chat container
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'chat-container';
        this.chatContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            overflow-y: auto;
            background: rgba(20, 20, 30, 0.65);
            backdrop-filter: blur(2.5px);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 4px;
            padding: 15px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            display: flex;
            flex-direction: column;
        `;
        
        // Create chat history
        this.chatHistoryElement = document.createElement('div');
        this.chatHistoryElement.className = 'chat-history';
        this.chatHistoryElement.style.cssText = `
            flex-grow: 1;
            margin-bottom: 10px;
            overflow-y: auto;
            max-height: 400px;
        `;
        
        // Create input container
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.style.cssText = `
            display: flex;
            background: rgba(25, 25, 35, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 4px;
        `;
        
        // Create input field
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.placeholder = 'Ask a question or give a command...';
        this.inputField.style.cssText = `
            flex-grow: 1;
            background: transparent;
            border: none;
            padding: 10px;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            outline: none;
        `;
        
        // Create send button
        const sendButton = document.createElement('button');
        sendButton.innerHTML = '&#10148;'; // Right arrow
        sendButton.style.cssText = `
            background: rgba(30, 30, 45, 0.85);
            border: none;
            border-radius: 0 4px 4px 0;
            color: #62AADC;
            padding: 0 15px;
            cursor: pointer;
            font-size: 12px;
        `;
        
        // Add event listeners
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processInput();
            }
        });
        
        sendButton.addEventListener('click', () => {
            this.processInput();
        });
        
        // Assemble UI
        inputContainer.appendChild(this.inputField);
        inputContainer.appendChild(sendButton);
        
        this.chatContainer.appendChild(this.chatHistoryElement);
        this.chatContainer.appendChild(inputContainer);
        
        // Add to DOM
        document.getElementById('ui-container').appendChild(this.chatContainer);
        
        // Add welcome message
        this.addMessage('AI', 'Welcome to the Aion Protocol. How can I assist you with the particle simulation?');
    }
    
    processInput() {
        const input = this.inputField.value.trim();
        if (input === '') return;
        
        // Add user message to chat
        this.addMessage('User', input);
        
        // Process command
        this.processCommand(input);
        
        // Clear input field
        this.inputField.value = '';
    }
    
    addMessage(sender, text) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender.toLowerCase()}`;
        messageElement.style.cssText = `
            margin-bottom: 10px;
            animation: fadeIn 0.3s ease-out;
        `;
        
        // Create sender element
        const senderElement = document.createElement('div');
        senderElement.className = 'sender';
        senderElement.textContent = sender;
        senderElement.style.cssText = `
            font-weight: 500;
            font-size: 11px;
            text-transform: uppercase;
            color: ${sender === 'AI' ? '#62AADC' : '#FFFFFF'};
            margin-bottom: 3px;
        `;
        
        // Create text element
        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.textContent = text;
        textElement.style.cssText = `
            font-size: 9px;
            line-height: 1.4;
            word-wrap: break-word;
        `;
        
        // Assemble message
        messageElement.appendChild(senderElement);
        messageElement.appendChild(textElement);
        
        // Add to chat history
        this.chatHistoryElement.appendChild(messageElement);
        
        // Scroll to bottom
        this.chatHistoryElement.scrollTop = this.chatHistoryElement.scrollHeight;
        
        // Add to chat history array
        this.chatHistory.push({
            sender,
            text,
            timestamp: new Date()
        });
    }
    
    processCommand(input) {
        // Convert to lowercase for case-insensitive matching
        const lowerInput = input.toLowerCase();
        
        // Check for exact command matches
        for (const command of this.commands) {
            if (command.patterns.some(pattern => {
                if (typeof pattern === 'string') {
                    return lowerInput === pattern.toLowerCase();
                } else if (pattern instanceof RegExp) {
                    return pattern.test(lowerInput);
                }
                return false;
            })) {
                // Execute command
                command.action(input);
                return;
            }
        }
        
        // If no exact match, try natural language understanding
        this.processNaturalLanguage(input);
    }
    
    processNaturalLanguage(input) {
        // In a full implementation, we would use NLP techniques
        // For now, we'll use simple keyword matching
        
        const lowerInput = input.toLowerCase();
        
        // Check for particle-related commands
        if (lowerInput.includes('particle') && lowerInput.includes('count')) {
            if (lowerInput.includes('increase') || lowerInput.includes('more')) {
                // Increase particle count
                this.addMessage('AI', 'Increasing particle count. The simulation may slow down with more particles.');
                // In a real implementation: this.simulationManager.setParticleCount(currentCount * 2);
                return;
            } else if (lowerInput.includes('decrease') || lowerInput.includes('less') || lowerInput.includes('fewer')) {
                // Decrease particle count
                this.addMessage('AI', 'Decreasing particle count for better performance.');
                // In a real implementation: this.simulationManager.setParticleCount(currentCount / 2);
                return;
            }
        }
        
        // Check for force field commands
        if (lowerInput.includes('force') || lowerInput.includes('field')) {
            if (lowerInput.includes('add') || lowerInput.includes('create')) {
                if (lowerInput.includes('gravity') || lowerInput.includes('gravitational')) {
                    this.addMessage('AI', 'Creating a gravitational force field. Click in the simulation to place it.');
                    // In a real implementation: this.simulationManager.prepareToAddForceField('gravitational');
                    return;
                } else if (lowerInput.includes('vortex')) {
                    this.addMessage('AI', 'Creating a vortex force field. Click in the simulation to place it.');
                    // In a real implementation: this.simulationManager.prepareToAddForceField('vortex');
                    return;
                }
            }
        }
        
        // Check for time control commands
        if (lowerInput.includes('time') || lowerInput.includes('simulation')) {
            if (lowerInput.includes('pause') || lowerInput.includes('stop')) {
                this.addMessage('AI', 'Pausing the simulation.');
                // In a real implementation: this.simulationManager.pause();
                return;
            } else if (lowerInput.includes('play') || lowerInput.includes('start') || lowerInput.includes('resume')) {
                this.addMessage('AI', 'Resuming the simulation.');
                // In a real implementation: this.simulationManager.play();
                return;
            } else if (lowerInput.includes('faster') || lowerInput.includes('speed up')) {
                this.addMessage('AI', 'Increasing simulation speed.');
                // In a real implementation: this.simulationManager.setTimeScale(currentScale * 1.5);
                return;
            } else if (lowerInput.includes('slower') || lowerInput.includes('slow down')) {
                this.addMessage('AI', 'Decreasing simulation speed.');
                // In a real implementation: this.simulationManager.setTimeScale(currentScale / 1.5);
                return;
            }
        }
        
        // If no command was recognized
        this.addMessage('AI', 'I\'m not sure how to help with that. Try asking about particles, force fields, or simulation controls.');
    }
    
    initializeCommands() {
        return [
            {
                name: 'help',
                description: 'Show available commands',
                patterns: ['help', 'commands', 'what can you do', /\bhelp\b/],
                action: () => {
                    this.addMessage('AI', `
                        Available commands:
                        - help: Show this help message
                        - particles [count]: Change particle count
                        - add [type] force field: Add a force field
                        - pause/play: Control simulation
                        - faster/slower: Adjust simulation speed
                        - reset: Reset the simulation
                        
                        You can also ask questions about the simulation or use natural language to control it.
                    `);
                }
            },
            {
                name: 'reset',
                description: 'Reset the simulation',
                patterns: ['reset', 'restart', 'clear', /\breset\b/],
                action: () => {
                    this.addMessage('AI', 'Resetting the simulation to its initial state.');
                    // In a real implementation: this.simulationManager.reset();
                }
            },
            {
                name: 'about',
                description: 'Show information about Aion Protocol',
                patterns: ['about', 'what is aion', /\babout\b/],
                action: () => {
                    this.addMessage('AI', `
                        The Aion Protocol is a decentralized research funding infrastructure using blockchain technology.
                        This simulation serves as both a visualization tool and an intuitive interface for interacting
                        with the underlying blockchain infrastructure.
                    `);
                }
            }
        ];
    }
    
    // Methods for simulation state awareness
    updateFromSimulationState(state) {
        // In a full implementation, this would receive updates from the simulation
        // and potentially generate messages based on significant events
    }
    
    // Method to suggest visualization configurations
    suggestConfiguration() {
        const suggestions = [
            'Try adding a vortex field to create spiral patterns',
            'Increase particle count for more detailed fluid dynamics',
            'Add a gravitational field to simulate orbital mechanics',
            'Try using the constraint system to create stable structures',
            'Adjust the time scale to see different emergent behaviors'
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        this.addMessage('AI', `Suggestion: ${randomSuggestion}`);
    }
}
