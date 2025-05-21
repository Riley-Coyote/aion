// StateManager.js - Bidirectional link between simulation and AI systems
import * as THREE from 'three';

export class StateManager {
    constructor(simulationManager, aiInterface) {
        this.simulationManager = simulationManager;
        this.aiInterface = aiInterface;
        
        // Shared context
        this.simulationState = {
            particleCount: 0,
            particleSize: 0,
            forceFields: [],
            timeScale: 1.0,
            isPaused: false,
            isRecording: false,
            isPlayback: false,
            fluidParameters: {},
            boundaries: {},
            events: []
        };
        
        // Event tracking
        this.eventQueue = [];
        this.eventThresholds = this.initializeEventThresholds();
        
        // Data integration
        this.dataIntegration = {
            scientificData: null,
            blockchainData: null,
            networkMetrics: null
        };
        
        // Initialize
        this.initialize();
    }
    
    initialize() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial state sync
        this.syncSimulationState();
        
        // Start update loop
        this.startUpdateLoop();
    }
    
    setupEventListeners() {
        // In a full implementation, we would set up event listeners
        // for various simulation events
        
        // Example event listeners:
        // this.simulationManager.addEventListener('forceFieldAdded', this.handleForceFieldAdded.bind(this));
        // this.simulationManager.addEventListener('particleCountChanged', this.handleParticleCountChanged.bind(this));
    }
    
    startUpdateLoop() {
        // Update state periodically
        setInterval(() => {
            this.syncSimulationState();
            this.processEventQueue();
        }, 1000); // Update every second
    }
    
    syncSimulationState() {
        // Get current state from simulation
        if (!this.simulationManager) return;
        
        const particleSystem = this.simulationManager.particleSystem;
        if (!particleSystem) return;
        
        // Update state object
        this.simulationState.particleCount = particleSystem.particleCount;
        this.simulationState.particleSize = particleSystem.particleSize;
        this.simulationState.forceFields = this.simulationManager.forceFieldManager ? 
            [...this.simulationManager.forceFieldManager.forceFields] : [];
        this.simulationState.timeScale = this.simulationManager.timeScale;
        this.simulationState.isPaused = this.simulationManager.paused;
        this.simulationState.isRecording = this.simulationManager.recording;
        this.simulationState.isPlayback = this.simulationManager.playbackMode;
        
        // Check for significant changes and add to event queue
        this.detectSignificantChanges();
    }
    
    detectSignificantChanges() {
        // Detect changes that would be interesting to narrate
        
        // Example: Detect particle clustering
        this.detectParticleClustering();
        
        // Example: Detect force field interactions
        this.detectForceFieldInteractions();
        
        // Example: Detect unusual particle behavior
        this.detectUnusualParticleBehavior();
    }
    
    detectParticleClustering() {
        // In a full implementation, we would analyze particle positions
        // to detect clustering patterns
        
        // For now, we'll use a placeholder that occasionally adds events
        if (Math.random() < 0.05) { // 5% chance each update
            this.addEvent({
                type: 'clustering',
                description: 'Particles are forming distinct clusters',
                importance: 0.7
            });
        }
    }
    
    detectForceFieldInteractions() {
        // In a full implementation, we would analyze force field interactions
        
        // For now, we'll use a placeholder
        if (this.simulationState.forceFields.length > 1 && Math.random() < 0.1) {
            this.addEvent({
                type: 'fieldInteraction',
                description: 'Force fields are creating complex interaction patterns',
                importance: 0.8
            });
        }
    }
    
    detectUnusualParticleBehavior() {
        // In a full implementation, we would analyze particle velocities
        // to detect unusual behavior
        
        // For now, we'll use a placeholder
        if (Math.random() < 0.03) { // 3% chance each update
            this.addEvent({
                type: 'unusualBehavior',
                description: 'Some particles are exhibiting chaotic behavior',
                importance: 0.6
            });
        }
    }
    
    addEvent(event) {
        // Add timestamp
        event.timestamp = Date.now();
        
        // Add to queue
        this.eventQueue.push(event);
        
        // Add to state history
        this.simulationState.events.push(event);
        
        // Limit history size
        if (this.simulationState.events.length > 20) {
            this.simulationState.events.shift();
        }
    }
    
    processEventQueue() {
        // Process events in queue
        if (this.eventQueue.length === 0) return;
        
        // Sort by importance
        this.eventQueue.sort((a, b) => b.importance - a.importance);
        
        // Get most important event
        const event = this.eventQueue.shift();
        
        // Check if we should narrate this event
        if (event.importance >= this.eventThresholds.narration) {
            this.narrateEvent(event);
        }
    }
    
    narrateEvent(event) {
        // Send event to AI interface for narration
        if (this.aiInterface) {
            this.aiInterface.addMessage('AI', `Observation: ${event.description}`);
        }
    }
    
    initializeEventThresholds() {
        return {
            narration: 0.7, // Minimum importance for narration
            notification: 0.5, // Minimum importance for notification
            logging: 0.3 // Minimum importance for logging
        };
    }
    
    // Command parsing from natural language to simulation controls
    parseCommand(command) {
        // In a full implementation, this would be handled by the CommandProcessor
        // This is a placeholder for the state synchronization layer
        return {
            recognized: true,
            action: 'placeholder',
            parameters: {}
        };
    }
    
    // Data integration methods
    importScientificData(data) {
        this.dataIntegration.scientificData = data;
        
        // In a full implementation, we would:
        // 1. Parse the data
        // 2. Map data properties to particle properties
        // 3. Update the simulation
        
        return {
            success: true,
            message: 'Scientific data imported successfully',
            affectedParticles: 0
        };
    }
    
    importBlockchainData(data) {
        this.dataIntegration.blockchainData = data;
        
        // In a full implementation, we would:
        // 1. Parse the blockchain data
        // 2. Map transactions to particle interactions
        // 3. Update the simulation
        
        return {
            success: true,
            message: 'Blockchain data imported successfully',
            mappedTransactions: 0
        };
    }
    
    updateNetworkMetrics(metrics) {
        this.dataIntegration.networkMetrics = metrics;
        
        // In a full implementation, we would:
        // 1. Parse the network metrics
        // 2. Adjust force fields and particle behavior
        // 3. Update the simulation
        
        return {
            success: true,
            message: 'Network metrics updated successfully',
            adjustedParameters: []
        };
    }
    
    // Export capabilities
    exportSimulationState() {
        // Create a copy of the current state
        const exportState = JSON.parse(JSON.stringify(this.simulationState));
        
        // Add export metadata
        exportState.exportTime = new Date().toISOString();
        exportState.version = '1.0';
        
        return exportState;
    }
    
    importSimulationState(state) {
        // Validate state
        if (!state || !state.version) {
            return {
                success: false,
                message: 'Invalid state format'
            };
        }
        
        // In a full implementation, we would:
        // 1. Validate the state format
        // 2. Apply the state to the simulation
        // 3. Update the UI
        
        return {
            success: true,
            message: 'Simulation state imported successfully'
        };
    }
    
    // AI awareness of simulation parameters
    getSimulationParameters() {
        return {
            particleCount: this.simulationState.particleCount,
            particleSize: this.simulationState.particleSize,
            forceFieldCount: this.simulationState.forceFields.length,
            timeScale: this.simulationState.timeScale,
            isPaused: this.simulationState.isPaused,
            isRecording: this.simulationState.isRecording,
            isPlayback: this.simulationState.isPlayback
        };
    }
    
    // Event notification system
    subscribeToEvents(eventType, callback) {
        // In a full implementation, we would:
        // 1. Register the callback for the specified event type
        // 2. Call the callback when events of that type occur
        
        return {
            success: true,
            message: `Subscribed to ${eventType} events`
        };
    }
    
    unsubscribeFromEvents(eventType, callback) {
        // In a full implementation, we would:
        // 1. Remove the callback for the specified event type
        
        return {
            success: true,
            message: `Unsubscribed from ${eventType} events`
        };
    }
}
