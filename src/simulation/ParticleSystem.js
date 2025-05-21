// ParticleSystem.js - Core particle simulation system for Aion Protocol
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import positionFragmentShader from '../shaders/position.frag';
import velocityFragmentShader from '../shaders/velocity.frag';
import particleVertexShader from '../shaders/particle.vert';
import particleFragmentShader from '../shaders/particle.frag';

export class ParticleSystem {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.clock = new THREE.Clock();
        
        // Configuration
        this.particleCount = 100000; // Start with 100k particles, can scale up to 1M+
        this.particleSize = 0.05;
        
        // Force fields
        this.forceFields = [];
        
        // Initialize the system
        this.initGPUCompute();
        this.initParticles();
    }
    
    initGPUCompute() {
        // Create computation renderer
        const width = Math.sqrt(this.particleCount);
        this.gpuCompute = new GPUComputationRenderer(width, width, this.renderer);
        
        // Create textures
        const dtPosition = this.gpuCompute.createTexture();
        const dtVelocity = this.gpuCompute.createTexture();
        
        // Fill textures with initial data
        this.fillPositionTexture(dtPosition);
        this.fillVelocityTexture(dtVelocity);
        
        // Create computation variables
        this.positionVariable = this.gpuCompute.addVariable('texturePosition', positionFragmentShader, dtPosition);
        this.velocityVariable = this.gpuCompute.addVariable('textureVelocity', velocityFragmentShader, dtVelocity);
        
        // Set variable dependencies
        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
        
        // Add custom uniforms
        this.positionUniforms = this.positionVariable.material.uniforms;
        this.velocityUniforms = this.velocityVariable.material.uniforms;
        
        this.positionUniforms.time = { value: 0.0 };
        this.positionUniforms.delta = { value: 0.0 };
        
        this.velocityUniforms.time = { value: 0.0 };
        this.velocityUniforms.delta = { value: 0.0 };
        this.velocityUniforms.forceFields = { value: [] };
        this.velocityUniforms.forceFieldCount = { value: 0 };
        
        // Check for errors
        const error = this.gpuCompute.init();
        if (error !== null) {
            console.error(error);
        }
    }
    
    initParticles() {
        // Create geometry
        const geometry = new THREE.BufferGeometry();
        
        // Create positions for vertices
        const positions = new Float32Array(this.particleCount * 3);
        const references = new Float32Array(this.particleCount * 2);
        
        for (let i = 0; i < this.particleCount; i++) {
            const x = (i % Math.sqrt(this.particleCount)) / Math.sqrt(this.particleCount);
            const y = Math.floor(i / Math.sqrt(this.particleCount)) / Math.sqrt(this.particleCount);
            
            references[i * 2] = x;
            references[i * 2 + 1] = y;
            
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
        }
        
        // Add attributes to geometry
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('reference', new THREE.BufferAttribute(references, 2));
        
        // Create material
        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                texturePosition: { value: null },
                textureVelocity: { value: null },
                particleSize: { value: this.particleSize },
                time: { value: 0.0 },
                color: { value: new THREE.Color(0x62AADC) }
            },
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // Create particle system
        this.particleMesh = new THREE.Points(geometry, this.particleMaterial);
        this.scene.add(this.particleMesh);
    }
    
    fillPositionTexture(texture) {
        const theArray = texture.image.data;
        
        for (let i = 0; i < theArray.length; i += 4) {
            // Random position in sphere
            const radius = 10 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            theArray[i] = radius * Math.sin(phi) * Math.cos(theta);     // x
            theArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
            theArray[i + 2] = radius * Math.cos(phi);                   // z
            theArray[i + 3] = 1.0;                                      // w (not used)
        }
    }
    
    fillVelocityTexture(texture) {
        const theArray = texture.image.data;
        
        for (let i = 0; i < theArray.length; i += 4) {
            // Random initial velocity
            theArray[i] = (Math.random() - 0.5) * 0.2;     // x
            theArray[i + 1] = (Math.random() - 0.5) * 0.2; // y
            theArray[i + 2] = (Math.random() - 0.5) * 0.2; // z
            theArray[i + 3] = 1.0;                         // w (not used)
        }
    }
    
    addForceField(type, position, strength, radius) {
        const forceField = {
            type: type, // 0: gravitational, 1: vortex, 2: magnetic, 3: custom
            position: position,
            strength: strength,
            radius: radius
        };
        
        this.forceFields.push(forceField);
        this.updateForceFieldUniforms();
        
        return this.forceFields.length - 1; // Return index for later reference
    }
    
    removeForceField(index) {
        if (index >= 0 && index < this.forceFields.length) {
            this.forceFields.splice(index, 1);
            this.updateForceFieldUniforms();
            return true;
        }
        return false;
    }
    
    updateForceFieldUniforms() {
        // Convert force fields to flat array for shader
        const forceFieldsArray = [];
        
        for (let i = 0; i < this.forceFields.length; i++) {
            const field = this.forceFields[i];
            forceFieldsArray.push(
                field.type,
                field.position.x, field.position.y, field.position.z,
                field.strength,
                field.radius
            );
        }
        
        this.velocityUniforms.forceFields.value = forceFieldsArray;
        this.velocityUniforms.forceFieldCount.value = this.forceFields.length;
    }
    
    update() {
        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        
        // Update uniforms
        this.positionUniforms.time.value = time;
        this.positionUniforms.delta.value = delta;
        
        this.velocityUniforms.time.value = time;
        this.velocityUniforms.delta.value = delta;
        
        // Compute new position and velocity
        this.gpuCompute.compute();
        
        // Update particle material uniforms
        this.particleMaterial.uniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
        this.particleMaterial.uniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
        this.particleMaterial.uniforms.time.value = time;
    }
    
    setParticleCount(count) {
        // This would require recreating the entire system
        console.warn('Changing particle count requires system reinitialization');
    }
    
    setParticleSize(size) {
        this.particleSize = size;
        this.particleMaterial.uniforms.particleSize.value = size;
    }
    
    setParticleColor(color) {
        this.particleMaterial.uniforms.color.value = new THREE.Color(color);
    }
}
