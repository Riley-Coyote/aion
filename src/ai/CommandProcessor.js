// CommandProcessor.js - Processes natural language commands for the AI interface
import * as THREE from 'three';

export class CommandProcessor {
    constructor(aiInterface, simulationManager) {
        this.aiInterface = aiInterface;
        this.simulationManager = simulationManager;
        
        // Command patterns
        this.commandPatterns = this.initializeCommandPatterns();
        
        // Context tracking
        this.context = {
            lastCommand: null,
            lastTopic: null,
            pendingAction: null
        };
    }
    
    initializeCommandPatterns() {
        return [
            // Particle system commands
            {
                category: 'particles',
                patterns: [
                    /particles? (count|number|amount) (\d+)/i,
                    /set (\d+) particles?/i,
                    /change particles? to (\d+)/i
                ],
                action: (matches) => {
                    const count = parseInt(matches[1] || matches[2]);
                    if (isNaN(count)) return false;
                    
                    this.simulationManager.setParticleCount(count);
                    return `Setting particle count to ${count}.`;
                }
            },
            {
                category: 'particles',
                patterns: [
                    /(increase|more|add) particles?/i,
                    /particles? (up|increase)/i
                ],
                action: () => {
                    // Double the current count
                    const newCount = this.simulationManager.particleSystem.particleCount * 2;
                    this.simulationManager.setParticleCount(newCount);
                    return `Increasing particle count to ${newCount}.`;
                }
            },
            {
                category: 'particles',
                patterns: [
                    /(decrease|fewer|less|reduce) particles?/i,
                    /particles? (down|decrease)/i
                ],
                action: () => {
                    // Halve the current count
                    const newCount = Math.max(1000, Math.floor(this.simulationManager.particleSystem.particleCount / 2));
                    this.simulationManager.setParticleCount(newCount);
                    return `Decreasing particle count to ${newCount}.`;
                }
            },
            {
                category: 'particles',
                patterns: [
                    /particles? (size|radius) (\d+(\.\d+)?)/i,
                    /set particles? (size|radius) to (\d+(\.\d+)?)/i
                ],
                action: (matches) => {
                    const size = parseFloat(matches[2] || matches[3]);
                    if (isNaN(size)) return false;
                    
                    this.simulationManager.setParticleSize(size);
                    return `Setting particle size to ${size}.`;
                }
            },
            {
                category: 'particles',
                patterns: [
                    /particles? color (#[0-9a-f]{6}|#[0-9a-f]{3}|\w+)/i,
                    /set particles? color to (#[0-9a-f]{6}|#[0-9a-f]{3}|\w+)/i,
                    /change particles? color to (#[0-9a-f]{6}|#[0-9a-f]{3}|\w+)/i
                ],
                action: (matches) => {
                    const color = matches[1] || matches[2] || matches[3];
                    this.simulationManager.setParticleColor(color);
                    return `Setting particle color to ${color}.`;
                }
            },
            
            // Force field commands
            {
                category: 'forceFields',
                patterns: [
                    /add (a |an )?(gravitational|gravity) (force )?field/i,
                    /create (a |an )?(gravitational|gravity) (force )?field/i
                ],
                action: () => {
                    this.context.pendingAction = {
                        type: 'addForceField',
                        fieldType: 'gravitational'
                    };
                    return "Click in the simulation to place a gravitational force field.";
                }
            },
            {
                category: 'forceFields',
                patterns: [
                    /add (a |an )?(vortex) (force )?field/i,
                    /create (a |an )?(vortex) (force )?field/i
                ],
                action: () => {
                    this.context.pendingAction = {
                        type: 'addForceField',
                        fieldType: 'vortex'
                    };
                    return "Click in the simulation to place a vortex force field.";
                }
            },
            {
                category: 'forceFields',
                patterns: [
                    /add (a |an )?(magnetic) (force )?field/i,
                    /create (a |an )?(magnetic) (force )?field/i
                ],
                action: () => {
                    this.context.pendingAction = {
                        type: 'addForceField',
                        fieldType: 'magnetic'
                    };
                    return "Click in the simulation to place a magnetic force field.";
                }
            },
            {
                category: 'forceFields',
                patterns: [
                    /add (a |an )?(custom) (force )?field/i,
                    /create (a |an )?(custom) (force )?field/i
                ],
                action: () => {
                    this.context.pendingAction = {
                        type: 'addForceField',
                        fieldType: 'custom'
                    };
                    return "Click in the simulation to place a custom force field.";
                }
            },
            {
                category: 'forceFields',
                patterns: [
                    /remove (force )?field/i,
                    /delete (force )?field/i
                ],
                action: () => {
                    this.context.pendingAction = {
                        type: 'removeForceField'
                    };
                    return "Click on a force field to remove it.";
                }
            },
            
            // Time control commands
            {
                category: 'timeControl',
                patterns: [
                    /pause( simulation)?/i,
                    /stop( simulation)?/i
                ],
                action: () => {
                    this.simulationManager.pause();
                    return "Simulation paused.";
                }
            },
            {
                category: 'timeControl',
                patterns: [
                    /play( simulation)?/i,
                    /start( simulation)?/i,
                    /resume( simulation)?/i
                ],
                action: () => {
                    this.simulationManager.play();
                    return "Simulation resumed.";
                }
            },
            {
                category: 'timeControl',
                patterns: [
                    /speed up/i,
                    /faster/i,
                    /increase speed/i
                ],
                action: () => {
                    const currentScale = this.simulationManager.timeScale;
                    const newScale = Math.min(10, currentScale * 1.5);
                    this.simulationManager.setTimeScale(newScale);
                    return `Increasing simulation speed to ${newScale.toFixed(1)}x.`;
                }
            },
            {
                category: 'timeControl',
                patterns: [
                    /slow down/i,
                    /slower/i,
                    /decrease speed/i
                ],
                action: () => {
                    const currentScale = this.simulationManager.timeScale;
                    const newScale = Math.max(0.1, currentScale / 1.5);
                    this.simulationManager.setTimeScale(newScale);
                    return `Decreasing simulation speed to ${newScale.toFixed(1)}x.`;
                }
            },
            {
                category: 'timeControl',
                patterns: [
                    /set speed to (\d+(\.\d+)?)/i,
                    /speed (\d+(\.\d+)?)/i
                ],
                action: (matches) => {
                    const speed = parseFloat(matches[1]);
                    if (isNaN(speed)) return false;
                    
                    const newScale = Math.max(0.1, Math.min(10, speed));
                    this.simulationManager.setTimeScale(newScale);
                    return `Setting simulation speed to ${newScale.toFixed(1)}x.`;
                }
            },
            {
                category: 'timeControl',
                patterns: [
                    /reverse/i,
                    /backwards/i,
                    /reverse time/i
                ],
                action: () => {
                    this.simulationManager.reverse();
                    return "Reversing simulation direction.";
                }
            },
            {
                category: 'timeControl',
                patterns: [
                    /record/i,
                    /start recording/i
                ],
                action: () => {
                    this.simulationManager.startRecording();
                    return "Started recording simulation keyframes.";
                }
            },
            {
                category: 'timeControl',
                patterns: [
                    /stop recording/i
                ],
                action: () => {
                    this.simulationManager.stopRecording();
                    return "Stopped recording simulation keyframes.";
                }
            },
            {
                category: 'timeControl',
                patterns: [
                    /playback/i,
                    /play recording/i,
                    /play keyframes/i
                ],
                action: () => {
                    this.simulationManager.startPlayback();
                    return "Playing back recorded keyframes.";
                }
            },
            
            // Fluid dynamics commands
            {
                category: 'fluidDynamics',
                patterns: [
                    /increase viscosity/i,
                    /more viscous/i,
                    /thicker fluid/i
                ],
                action: () => {
                    const params = { viscosity: this.simulationManager.fluidDynamics.viscosity * 1.5 };
                    this.simulationManager.setFluidParameters(params);
                    return "Increasing fluid viscosity.";
                }
            },
            {
                category: 'fluidDynamics',
                patterns: [
                    /decrease viscosity/i,
                    /less viscous/i,
                    /thinner fluid/i
                ],
                action: () => {
                    const params = { viscosity: this.simulationManager.fluidDynamics.viscosity / 1.5 };
                    this.simulationManager.setFluidParameters(params);
                    return "Decreasing fluid viscosity.";
                }
            },
            
            // Constraint system commands
            {
                category: 'constraints',
                patterns: [
                    /add spring/i,
                    /create spring/i
                ],
                action: () => {
                    this.context.pendingAction = {
                        type: 'addSpring',
                        step: 1
                    };
                    return "Click on the first particle to connect with a spring.";
                }
            },
            {
                category: 'constraints',
                patterns: [
                    /add constraint/i,
                    /create constraint/i
                ],
                action: () => {
                    this.context.pendingAction = {
                        type: 'addConstraint',
                        step: 1
                    };
                    return "Click on the first particle to connect with a distance constraint.";
                }
            },
            
            // General commands
            {
                category: 'general',
                patterns: [
                    /reset/i,
                    /restart/i,
                    /clear/i
                ],
                action: () => {
                    // Reset simulation
                    // In a full implementation, this would reset all systems
                    return "Resetting simulation to initial state.";
                }
            },
            {
                category: 'general',
                patterns: [
                    /help/i,
                    /commands/i,
                    /what can (you|i) do/i
                ],
                action: () => {
                    return `
                        Available commands:
                        - Particles: change count, size, color
                        - Force Fields: add/remove gravitational, vortex, magnetic, custom fields
                        - Time Control: pause/play, speed up/slow down, reverse, record/playback
                        - Fluid Dynamics: adjust viscosity, density
                        - Constraints: add springs, distance constraints
                        - General: reset, help
                        
                        You can use natural language to control the simulation.
                    `;
                }
            },
            {
                category: 'general',
                patterns: [
                    /about/i,
                    /what is aion/i,
                    /explain aion/i
                ],
                action: () => {
                    return `
                        The Aion Protocol is a decentralized research funding infrastructure using blockchain technology.
                        This simulation serves as both a visualization tool and an intuitive interface for interacting
                        with the underlying blockchain infrastructure. The particle system visualizes transactions,
                        funding pools, and network behavior in an intuitive and interactive way.
                    `;
                }
            }
        ];
    }
    
    processCommand(input) {
        // Track context
        this.context.lastCommand = input;
        
        // Check for matches against command patterns
        for (const command of this.commandPatterns) {
            for (const pattern of command.patterns) {
                const matches = input.match(pattern);
                if (matches) {
                    this.context.lastTopic = command.category;
                    const result = command.action(matches);
                    
                    if (result === false) {
                        continue; // Try next pattern
                    }
                    
                    return result || "Command processed.";
                }
            }
        }
        
        // If no direct match, try to understand based on context
        return this.processNaturalLanguage(input);
    }
    
    processNaturalLanguage(input) {
        const lowerInput = input.toLowerCase();
        
        // Check for follow-up commands based on context
        if (this.context.lastTopic) {
            // Handle follow-ups to particle commands
            if (this.context.lastTopic === 'particles') {
                if (lowerInput.includes('bigger') || lowerInput.includes('larger')) {
                    this.simulationManager.setParticleSize(this.simulationManager.particleSystem.particleSize * 1.5);
                    return "Increasing particle size.";
                } else if (lowerInput.includes('smaller')) {
                    this.simulationManager.setParticleSize(this.simulationManager.particleSystem.particleSize / 1.5);
                    return "Decreasing particle size.";
                }
            }
            
            // Handle follow-ups to force field commands
            if (this.context.lastTopic === 'forceFields') {
                if (lowerInput.includes('stronger')) {
                    return "To make force fields stronger, you can add more fields or adjust their strength by clicking on them.";
                } else if (lowerInput.includes('weaker')) {
                    return "To make force fields weaker, you can remove fields or adjust their strength by clicking on them.";
                }
            }
        }
        
        // Check for questions about the simulation
        if (lowerInput.includes('how') && lowerInput.includes('work')) {
            return "This simulation uses GPU-accelerated physics to model particle behavior. Force fields influence particle movement, and you can control various aspects of the simulation through commands.";
        }
        
        if (lowerInput.includes('what') && lowerInput.includes('see')) {
            return "You're seeing a particle simulation that visualizes the Aion Protocol. Each particle represents a data point or transaction, and force fields represent nodes or validators in the network.";
        }
        
        // If we still can't understand, provide a helpful response
        return "I'm not sure how to help with that. Try asking about particles, force fields, or simulation controls. Type 'help' for a list of commands.";
    }
    
    // Handle simulation clicks for pending actions
    handleSimulationClick(position, particleIndex) {
        if (!this.context.pendingAction) return null;
        
        const action = this.context.pendingAction;
        
        // Handle force field placement
        if (action.type === 'addForceField') {
            let result;
            
            switch (action.fieldType) {
                case 'gravitational':
                    this.simulationManager.addGravitationalField(position, 10, 20);
                    result = "Gravitational force field added.";
                    break;
                case 'vortex':
                    this.simulationManager.addVortexField(position, 5, 15);
                    result = "Vortex force field added.";
                    break;
                case 'magnetic':
                    this.simulationManager.addMagneticField(position, 8, 18);
                    result = "Magnetic force field added.";
                    break;
                case 'custom':
                    this.simulationManager.addCustomField(position, 7, 15);
                    result = "Custom force field added.";
                    break;
            }
            
            this.context.pendingAction = null;
            return result;
        }
        
        // Handle force field removal
        if (action.type === 'removeForceField') {
            // In a full implementation, we would identify the clicked force field
            // For now, we'll just remove the first one
            this.simulationManager.removeForceField(0);
            this.context.pendingAction = null;
            return "Force field removed.";
        }
        
        // Handle spring creation (first click)
        if (action.type === 'addSpring' && action.step === 1) {
            if (particleIndex !== undefined) {
                this.context.pendingAction = {
                    type: 'addSpring',
                    step: 2,
                    firstParticle: particleIndex
                };
                return "Now click on the second particle to connect with a spring.";
            }
            return "Please click directly on a particle.";
        }
        
        // Handle spring creation (second click)
        if (action.type === 'addSpring' && action.step === 2) {
            if (particleIndex !== undefined) {
                this.simulationManager.addSpring(
                    action.firstParticle,
                    particleIndex,
                    1.0, // rest length
                    0.5, // stiffness
                    0.1  // damping
                );
                this.context.pendingAction = null;
                return "Spring created between particles.";
            }
            return "Please click directly on a particle.";
        }
        
        // Handle constraint creation (first click)
        if (action.type === 'addConstraint' && action.step === 1) {
            if (particleIndex !== undefined) {
                this.context.pendingAction = {
                    type: 'addConstraint',
                    step: 2,
                    firstParticle: particleIndex
                };
                return "Now click on the second particle to connect with a distance constraint.";
            }
            return "Please click directly on a particle.";
        }
        
        // Handle constraint creation (second click)
        if (action.type === 'addConstraint' && action.step === 2) {
            if (particleIndex !== undefined) {
                this.simulationManager.addDistanceConstraint(
                    action.firstParticle,
                    particleIndex,
                    1.0, // distance
                    1.0  // strength
                );
                this.context.pendingAction = null;
                return "Distance constraint created between particles.";
            }
            return "Please click directly on a particle.";
        }
        
        return null;
    }
    
    // Check if there's a pending action
    hasPendingAction() {
        return this.context.pendingAction !== null;
    }
    
    // Get the type of pending action
    getPendingActionType() {
        return this.context.pendingAction ? this.context.pendingAction.type : null;
    }
}
