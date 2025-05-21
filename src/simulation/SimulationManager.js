// SimulationManager.js - Integrates all simulation components
import * as THREE from 'three';
import { ParticleSystem } from './ParticleSystem';
import { ForceFieldManager } from './ForceFieldManager';
import { FluidDynamics } from './FluidDynamics';
import { CollisionSystem } from './CollisionSystem';
import { ConstraintSystem } from './ConstraintSystem';

export class SimulationManager {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        
        // Initialize core particle system
        this.particleSystem = new ParticleSystem(scene, renderer);
        
        // Initialize subsystems
        this.forceFieldManager = new ForceFieldManager(this.particleSystem);
        this.fluidDynamics = new FluidDynamics(this.particleSystem);
        this.collisionSystem = new CollisionSystem(this.particleSystem);
        this.constraintSystem = new ConstraintSystem(this.particleSystem);
        
        // Time control
        this.timeScale = 1.0;
        this.paused = false;
        this.recording = false;
        this.keyframes = [];
        
        // Initialize keyframe system
        this.initKeyframeSystem();
    }
    
    initKeyframeSystem() {
        // Keyframe recording and playback
        this.keyframeInterval = 1.0; // seconds between keyframes
        this.lastKeyframeTime = 0;
        this.currentKeyframe = 0;
        this.playbackMode = false;
    }
    
    update(deltaTime) {
        if (this.paused) return;
        
        // Apply time scaling
        const scaledDelta = deltaTime * this.timeScale;
        
        // Update subsystems
        if (this.playbackMode) {
            this.updatePlayback(scaledDelta);
        } else {
            // Update force fields
            this.forceFieldManager.update();
            
            // Update fluid dynamics
            this.fluidDynamics.update();
            
            // Update particle system (core physics)
            this.particleSystem.update();
            
            // Update collision system
            this.collisionSystem.update();
            
            // Update constraint system
            this.constraintSystem.update();
            
            // Record keyframe if needed
            if (this.recording) {
                this.recordKeyframe(scaledDelta);
            }
        }
    }
    
    recordKeyframe(deltaTime) {
        const currentTime = performance.now() / 1000;
        
        if (currentTime - this.lastKeyframeTime >= this.keyframeInterval) {
            // In a full implementation, we would:
            // 1. Capture the current state of all particles
            // 2. Store it in the keyframes array
            
            this.lastKeyframeTime = currentTime;
            
            // Placeholder for keyframe recording
            const keyframe = {
                time: currentTime,
                // We would store particle positions, velocities, etc.
            };
            
            this.keyframes.push(keyframe);
        }
    }
    
    updatePlayback(deltaTime) {
        // In a full implementation, we would:
        // 1. Interpolate between keyframes
        // 2. Update particle positions and velocities
        
        // Placeholder for keyframe playback
        if (this.keyframes.length > 1) {
            this.currentKeyframe += deltaTime / this.keyframeInterval;
            
            if (this.currentKeyframe >= this.keyframes.length - 1) {
                if (this.loopPlayback) {
                    this.currentKeyframe = 0;
                } else {
                    this.currentKeyframe = this.keyframes.length - 1;
                    this.pausePlayback();
                }
            }
        }
    }
    
    // Time control methods
    pause() {
        this.paused = true;
    }
    
    play() {
        this.paused = false;
    }
    
    setTimeScale(scale) {
        this.timeScale = Math.max(0.1, Math.min(10.0, scale));
    }
    
    reverse() {
        this.timeScale = -this.timeScale;
    }
    
    // Keyframe methods
    startRecording() {
        this.recording = true;
        this.keyframes = [];
        this.lastKeyframeTime = performance.now() / 1000;
    }
    
    stopRecording() {
        this.recording = false;
    }
    
    startPlayback(loop = false) {
        if (this.keyframes.length > 1) {
            this.playbackMode = true;
            this.currentKeyframe = 0;
            this.loopPlayback = loop;
        }
    }
    
    stopPlayback() {
        this.playbackMode = false;
    }
    
    // Force field methods
    addGravitationalField(position, strength, radius) {
        return this.forceFieldManager.createGravitationalField(position, strength, radius);
    }
    
    addVortexField(position, strength, radius) {
        return this.forceFieldManager.createVortexField(position, strength, radius);
    }
    
    addMagneticField(position, strength, radius) {
        return this.forceFieldManager.createMagneticField(position, strength, radius);
    }
    
    addCustomField(position, strength, radius) {
        return this.forceFieldManager.createCustomField(position, strength, radius);
    }
    
    removeForceField(index) {
        return this.forceFieldManager.removeField(index);
    }
    
    // Constraint methods
    addSpring(p1, p2, restLength, stiffness, damping) {
        return this.constraintSystem.addSpring(p1, p2, restLength, stiffness, damping);
    }
    
    addDistanceConstraint(p1, p2, distance, strength) {
        return this.constraintSystem.addDistanceConstraint(p1, p2, distance, strength);
    }
    
    createSpringNetwork(particles, restLength, stiffness, damping) {
        return this.constraintSystem.createSpringNetwork(particles, restLength, stiffness, damping);
    }
    
    // Fluid dynamics methods
    setFluidParameters(params) {
        this.fluidDynamics.setParameters(params);
    }
    
    // Collision methods
    setCollisionParameters(params) {
        this.collisionSystem.setCollisionParameters(params);
    }
    
    setBoundaries(min, max) {
        this.collisionSystem.setBoundaries(min, max);
    }
    
    // Particle system methods
    setParticleCount(count) {
        this.particleSystem.setParticleCount(count);
    }
    
    setParticleSize(size) {
        this.particleSystem.setParticleSize(size);
    }
    
    setParticleColor(color) {
        this.particleSystem.setParticleColor(color);
    }
}
