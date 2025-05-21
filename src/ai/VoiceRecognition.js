// VoiceRecognition.js - Implements voice command capabilities for the AI interface
import * as THREE from 'three';

export class VoiceRecognition {
    constructor(aiInterface, commandProcessor) {
        this.aiInterface = aiInterface;
        this.commandProcessor = commandProcessor;
        
        // Recognition state
        this.isListening = false;
        this.recognition = null;
        this.wakeWord = 'aion';
        
        // UI elements
        this.voiceButton = null;
        this.statusIndicator = null;
        
        // Initialize if supported
        this.initialize();
    }
    
    initialize() {
        // Check for browser support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported in this browser');
            return;
        }
        
        // Create recognition object
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        // Set up event handlers
        this.recognition.onstart = this.handleRecognitionStart.bind(this);
        this.recognition.onresult = this.handleRecognitionResult.bind(this);
        this.recognition.onerror = this.handleRecognitionError.bind(this);
        this.recognition.onend = this.handleRecognitionEnd.bind(this);
        
        // Create UI elements
        this.createUI();
    }
    
    createUI() {
        // Create voice button
        this.voiceButton = document.createElement('button');
        this.voiceButton.className = 'voice-button';
        this.voiceButton.innerHTML = '🎤';
        this.voiceButton.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            background: rgba(20, 20, 30, 0.65);
            backdrop-filter: blur(2.5px);
            border: 1px solid rgba(255, 255, 255, 0.07);
            color: #62AADC;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease-out;
        `;
        
        // Create status indicator
        this.statusIndicator = document.createElement('div');
        this.statusIndicator.className = 'voice-status';
        this.statusIndicator.style.cssText = `
            position: absolute;
            bottom: 75px;
            left: 20px;
            width: 50px;
            height: 20px;
            border-radius: 10px;
            background: rgba(20, 20, 30, 0.65);
            backdrop-filter: blur(2.5px);
            border: 1px solid rgba(255, 255, 255, 0.07);
            color: white;
            font-size: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.15s ease-out;
            font-family: 'JetBrains Mono', monospace;
        `;
        this.statusIndicator.textContent = 'Listening';
        
        // Add event listeners
        this.voiceButton.addEventListener('click', this.toggleListening.bind(this));
        
        // Add to DOM
        document.getElementById('ui-container').appendChild(this.voiceButton);
        document.getElementById('ui-container').appendChild(this.statusIndicator);
    }
    
    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }
    
    startListening() {
        if (!this.recognition) return;
        
        try {
            this.recognition.start();
            this.isListening = true;
            this.voiceButton.style.backgroundColor = 'rgba(98, 170, 220, 0.3)';
            this.statusIndicator.style.opacity = '1';
        } catch (e) {
            console.error('Error starting speech recognition:', e);
        }
    }
    
    stopListening() {
        if (!this.recognition) return;
        
        try {
            this.recognition.stop();
            this.isListening = false;
            this.voiceButton.style.backgroundColor = 'rgba(20, 20, 30, 0.65)';
            this.statusIndicator.style.opacity = '0';
        } catch (e) {
            console.error('Error stopping speech recognition:', e);
        }
    }
    
    handleRecognitionStart() {
        console.log('Speech recognition started');
    }
    
    handleRecognitionResult(event) {
        const result = event.results[0][0].transcript.trim().toLowerCase();
        console.log('Speech recognition result:', result);
        
        // Check for wake word
        if (result.includes(this.wakeWord)) {
            // Remove wake word from command
            const command = result.replace(this.wakeWord, '').trim();
            
            if (command) {
                // Process command
                this.aiInterface.addMessage('User', command);
                const response = this.commandProcessor.processCommand(command);
                this.aiInterface.addMessage('AI', response);
            } else {
                // Just wake word, prompt for command
                this.aiInterface.addMessage('AI', 'I\'m listening. How can I help you?');
            }
        } else {
            // No wake word, process directly if already in conversation
            this.aiInterface.addMessage('User', result);
            const response = this.commandProcessor.processCommand(result);
            this.aiInterface.addMessage('AI', response);
        }
    }
    
    handleRecognitionError(event) {
        console.error('Speech recognition error:', event.error);
        this.stopListening();
    }
    
    handleRecognitionEnd() {
        console.log('Speech recognition ended');
        this.isListening = false;
        this.voiceButton.style.backgroundColor = 'rgba(20, 20, 30, 0.65)';
        this.statusIndicator.style.opacity = '0';
    }
    
    setWakeWord(word) {
        this.wakeWord = word.toLowerCase();
    }
}
