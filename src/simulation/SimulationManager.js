// SimulationManager.js - Integrates all simulation components
import * as THREE from 'three';

export class SimulationManager {
    constructor(
        scene, 
        renderer, 
        particleSystem,
        forceFieldManager,
        fluidDynamics,
        collisionSystem,
        constraintSystem
    ) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = scene.camera;
        
        // Store subsystems
        this.particleSystem = particleSystem;
        this.forceFieldManager = forceFieldManager;
        this.fluidDynamics = fluidDynamics;
        this.collisionSystem = collisionSystem;
        this.constraintSystem = constraintSystem;
        
        // Time control
        this.timeScale = 1.0;
        this.paused = false;
        this.stepMode = false;
        this.pendingStep = false;
        this.running = true;
        
        // Recording and playback
        this.recording = false;
        this.keyframes = [];
        this.playbackMode = false;
        this.loopPlayback = false;
        
        // Event listeners
        this.listeners = {
            update: [],
            pause: [],
            play: [],
            reset: [],
            recordingStart: [],
            recordingStop: [],
            playbackStart: [],
            playbackStop: []
        };
        
        // Initialize keyframe system
        this.initKeyframeSystem();
        
        // Internal state
        this.clock = new THREE.Clock();
        this.accumulatedTime = 0;
        this.fixedTimeStep = 1/60; // 60 Hz physics update
    }
    
    initKeyframeSystem() {
        // Keyframe recording and playback
        this.keyframeInterval = 1.0; // seconds between keyframes
        this.lastKeyframeTime = 0;
        this.currentKeyframe = 0;
    }
    
    update(externalDeltaTime) {
        const deltaTime = externalDeltaTime || this.clock.getDelta();
        
        // Dispatch update event
        this.dispatchEvent('update', { deltaTime });
        
        // Skip update if simulation is paused
        if (this.paused && !this.pendingStep) {
            return;
        }
        
        // Reset pending step flag
        if (this.pendingStep) {
            this.pendingStep = false;
        }
        
        // Apply time scaling
        const scaledDelta = deltaTime * this.timeScale;
        
        // Use fixed timestep for physics
        this.accumulatedTime += scaledDelta;
        
        while (this.accumulatedTime >= this.fixedTimeStep) {
            this.updatePhysics(this.fixedTimeStep);
            this.accumulatedTime -= this.fixedTimeStep;
        }
    }
    
    updatePhysics(deltaTime) {
        // Update subsystems with fixed timestep
        if (this.playbackMode) {
            this.updatePlayback(deltaTime);
        } else {
            // Update force fields
            if (this.forceFieldManager) {
                this.forceFieldManager.update(deltaTime);
            }
            
            // Update fluid dynamics
            if (this.fluidDynamics && this.fluidDynamics.enabled) {
                this.fluidDynamics.update(deltaTime);
            }
            
            // Update collision system (before particle update)
            if (this.collisionSystem && this.collisionSystem.enableCollisions) {
                this.collisionSystem.update(deltaTime);
            }
            
            // Update particle system (core physics)
            if (this.particleSystem) {
                this.particleSystem.update(deltaTime);
            }
            
            // Update constraint system (after particle update)
            if (this.constraintSystem) {
                this.constraintSystem.update(deltaTime);
            }
            
            // Record keyframe if needed
            if (this.recording) {
                this.recordKeyframe(deltaTime);
            }
        }
    }
    
    recordKeyframe(deltaTime) {
        const currentTime = performance.now() / 1000;
        
        if (currentTime - this.lastKeyframeTime >= this.keyframeInterval) {
            this.lastKeyframeTime = currentTime;
            
            // Get particle positions and velocities
            const positions = this.particleSystem.getParticlePositions();
            const velocities = this.particleSystem.getParticleVelocities();
            
            // Create keyframe object
            const keyframe = {
                time: currentTime,
                positions: positions ? positions.slice() : [],
                velocities: velocities ? velocities.slice() : [],
                forceFields: this.forceFieldManager ? [...this.forceFieldManager.forceFields] : []
            };
            
            this.keyframes.push(keyframe);
            
            console.log(`Recorded keyframe ${this.keyframes.length} at time ${currentTime.toFixed(2)}`);
        }
    }
    
    updatePlayback(deltaTime) {
        if (this.keyframes.length < 2) return;
        
        // Advance current keyframe based on delta time
        this.currentKeyframe += deltaTime / this.keyframeInterval;
        
        // Check if we've reached the end of the keyframes
        if (this.currentKeyframe >= this.keyframes.length - 1) {
            if (this.loopPlayback) {
                // Loop back to beginning
                this.currentKeyframe = 0;
            } else {
                // Stop at the end
                this.currentKeyframe = this.keyframes.length - 1;
                this.stopPlayback();
                return;
            }
        }
        
        // Find the two keyframes to interpolate between
        const frameIndex = Math.floor(this.currentKeyframe);
        const nextFrameIndex = Math.min(frameIndex + 1, this.keyframes.length - 1);
        
        const frame1 = this.keyframes[frameIndex];
        const frame2 = this.keyframes[nextFrameIndex];
        
        // Calculate interpolation factor (0-1)
        const alpha = this.currentKeyframe - frameIndex;
        
        // Apply interpolated state to the simulation
        this.interpolateSimulationState(frame1, frame2, alpha);
    }
    
    interpolateSimulationState(frame1, frame2, alpha) {
        // Interpolate particle positions and velocities
        if (frame1.positions && frame2.positions && 
            frame1.velocities && frame2.velocities &&
            this.particleSystem) {
            
            // Get mutable arrays from particle system
            const positions = this.particleSystem.getParticlePositions();
            const velocities = this.particleSystem.getParticleVelocities();
            
            if (positions && velocities) {
                // Perform interpolation for each particle
                const particleCount = Math.min(
                    frame1.positions.length / 3,
                    frame2.positions.length / 3,
                    positions.length / 3
                );
                
                for (let i = 0; i < particleCount; i++) {
                    const idx = i * 3;
                    
                    // Interpolate position
                    positions[idx] = frame1.positions[idx] * (1 - alpha) + frame2.positions[idx] * alpha;
                    positions[idx + 1] = frame1.positions[idx + 1] * (1 - alpha) + frame2.positions[idx + 1] * alpha;
                    positions[idx + 2] = frame1.positions[idx + 2] * (1 - alpha) + frame2.positions[idx + 2] * alpha;
                    
                    // Interpolate velocity
                    velocities[idx] = frame1.velocities[idx] * (1 - alpha) + frame2.velocities[idx] * alpha;
                    velocities[idx + 1] = frame1.velocities[idx + 1] * (1 - alpha) + frame2.velocities[idx + 1] * alpha;
                    velocities[idx + 2] = frame1.velocities[idx + 2] * (1 - alpha) + frame2.velocities[idx + 2] * alpha;
                }
                
                // Update particle system with interpolated values
                this.particleSystem.updateParticlesFromArrays(positions, velocities);
            }
        }
        
        // Interpolate force fields (if implemented)
        if (frame1.forceFields && frame2.forceFields && this.forceFieldManager) {
            // Implement force field interpolation if needed
        }
    }
    
    // Event system
    addEventListener(eventType, callback) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].push(callback);
            return true;
        }
        return false;
    }
    
    removeEventListener(eventType, callback) {
        if (this.listeners[eventType]) {
            this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
            return true;
        }
        return false;
    }
    
    dispatchEvent(eventType, data) {
        if (this.listeners[eventType]) {
            for (const callback of this.listeners[eventType]) {
                callback(data);
            }
        }
    }
    
    // Time control methods
    pause() {
        if (!this.paused) {
            this.paused = true;
            this.dispatchEvent('pause', {});
        }
    }
    
    play() {
        if (this.paused) {
            this.paused = false;
            this.dispatchEvent('play', {});
        }
    }
    
    stepSimulation() {
        if (this.paused) {
            this.pendingStep = true;
            this.dispatchEvent('step', {});
        }
    }
    
    setTimeScale(scale) {
        this.timeScale = Math.max(0.1, Math.min(10.0, scale));
    }
    
    reverse() {
        this.timeScale = -this.timeScale;
    }
    
    resetSimulation() {
        // Reset particle system
        if (this.particleSystem) {
            this.particleSystem.resetParticles();
        }
        
        // Reset other subsystems as needed
        
        // Reset time and playback state
        this.recording = false;
        this.playbackMode = false;
        this.accumulatedTime = 0;
        
        this.dispatchEvent('reset', {});
    }
    
    // Keyframe recording methods
    startRecording() {
        this.recording = true;
        this.keyframes = [];
        this.lastKeyframeTime = performance.now() / 1000;
        
        this.dispatchEvent('recordingStart', {});
        console.log('Started recording keyframes');
    }
    
    stopRecording() {
        this.recording = false;
        this.dispatchEvent('recordingStop', { frameCount: this.keyframes.length });
        console.log(`Stopped recording. Captured ${this.keyframes.length} keyframes`);
    }
    
    startPlayback(loop = false) {
        if (this.keyframes.length > 1) {
            this.playbackMode = true;
            this.currentKeyframe = 0;
            this.loopPlayback = loop;
            
            this.dispatchEvent('playbackStart', { 
                frameCount: this.keyframes.length,
                loop: loop
            });
            
            console.log(`Started playback of ${this.keyframes.length} keyframes ${loop ? '(looping)' : ''}`);
        } else {
            console.warn('Cannot start playback: not enough keyframes recorded');
        }
    }
    
    stopPlayback() {
        if (this.playbackMode) {
            this.playbackMode = false;
            this.dispatchEvent('playbackStop', {});
            console.log('Stopped playback');
        }
    }
    
    // Force field methods
    addGravitationalField(position, strength, radius) {
        if (this.forceFieldManager) {
            return this.forceFieldManager.createGravitationalField(position, strength, radius);
        }
        return -1;
    }
    
    addVortexField(position, strength, radius) {
        if (this.forceFieldManager) {
            return this.forceFieldManager.createVortexField(position, strength, radius);
        }
        return -1;
    }
    
    addMagneticField(position, strength, radius) {
        if (this.forceFieldManager) {
            return this.forceFieldManager.createMagneticField(position, strength, radius);
        }
        return -1;
    }
    
    addCustomField(position, strength, radius) {
        if (this.forceFieldManager) {
            return this.forceFieldManager.createCustomField(position, strength, radius);
        }
        return -1;
    }
    
    removeForceField(index) {
        if (this.forceFieldManager) {
            return this.forceFieldManager.removeField(index);
        }
        return false;
    }
    
    // Constraint methods
    addSpring(p1, p2, restLength, stiffness, damping) {
        if (this.constraintSystem) {
            return this.constraintSystem.addSpring(p1, p2, restLength, stiffness, damping);
        }
        return -1;
    }
    
    addDistanceConstraint(p1, p2, distance, strength) {
        if (this.constraintSystem) {
            return this.constraintSystem.addDistanceConstraint(p1, p2, distance, strength);
        }
        return -1;
    }
    
    createSpringNetwork(particles, restLength, stiffness, damping) {
        if (this.constraintSystem) {
            return this.constraintSystem.createSpringNetwork(particles, restLength, stiffness, damping);
        }
        return [];
    }
    
    // Fluid dynamics methods
    setFluidParameters(params) {
        if (this.fluidDynamics) {
            this.fluidDynamics.setParameters(params);
        }
    }
    
    // Collision methods
    setCollisionParameters(params) {
        if (this.collisionSystem) {
            this.collisionSystem.setCollisionParameters(params);
        }
    }
    
    setBoundaries(min, max) {
        if (this.collisionSystem) {
            this.collisionSystem.setBoundaries(min, max);
        }
    }
    
    // Particle system methods
    setParticleCount(count) {
        if (this.particleSystem) {
            this.particleSystem.setParticleCount(count);
        }
    }
    
    setParticleSize(size) {
        if (this.particleSystem) {
            this.particleSystem.setParticleSize(size);
        }
    }
    
    setParticleColor(color) {
        if (this.particleSystem) {
            this.particleSystem.setParticleColor(color);
        }
    }
}
