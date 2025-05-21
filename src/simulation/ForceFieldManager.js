// ForceFieldManager.js - Manages different types of force fields for the particle system
import * as THREE from 'three';

export class ForceFieldManager {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.forceFields = [];
        
        // Force field types
        this.TYPES = {
            GRAVITATIONAL: 0,
            VORTEX: 1,
            MAGNETIC: 2,
            CUSTOM: 3
        };
        
        // Visual representations of force fields
        this.visualizers = [];
    }
    
    createGravitationalField(position, strength, radius) {
        const field = {
            type: this.TYPES.GRAVITATIONAL,
            position: position.clone(),
            strength: strength,
            radius: radius
        };
        
        const index = this.particleSystem.addForceField(
            this.TYPES.GRAVITATIONAL,
            position,
            strength,
            radius
        );
        
        this.forceFields.push(field);
        this.createVisualizer(field, index);
        
        return index;
    }
    
    createVortexField(position, strength, radius) {
        const field = {
            type: this.TYPES.VORTEX,
            position: position.clone(),
            strength: strength,
            radius: radius
        };
        
        const index = this.particleSystem.addForceField(
            this.TYPES.VORTEX,
            position,
            strength,
            radius
        );
        
        this.forceFields.push(field);
        this.createVisualizer(field, index);
        
        return index;
    }
    
    createMagneticField(position, strength, radius) {
        const field = {
            type: this.TYPES.MAGNETIC,
            position: position.clone(),
            strength: strength,
            radius: radius
        };
        
        const index = this.particleSystem.addForceField(
            this.TYPES.MAGNETIC,
            position,
            strength,
            radius
        );
        
        this.forceFields.push(field);
        this.createVisualizer(field, index);
        
        return index;
    }
    
    createCustomField(position, strength, radius) {
        const field = {
            type: this.TYPES.CUSTOM,
            position: position.clone(),
            strength: strength,
            radius: radius
        };
        
        const index = this.particleSystem.addForceField(
            this.TYPES.CUSTOM,
            position,
            strength,
            radius
        );
        
        this.forceFields.push(field);
        this.createVisualizer(field, index);
        
        return index;
    }
    
    removeField(index) {
        if (index >= 0 && index < this.forceFields.length) {
            // Remove from particle system
            this.particleSystem.removeForceField(index);
            
            // Remove visualizer
            if (this.visualizers[index]) {
                this.particleSystem.scene.remove(this.visualizers[index]);
                this.visualizers[index].geometry.dispose();
                this.visualizers[index].material.dispose();
                this.visualizers[index] = null;
            }
            
            // Remove from arrays
            this.forceFields.splice(index, 1);
            this.visualizers.splice(index, 1);
            
            return true;
        }
        return false;
    }
    
    createVisualizer(field, index) {
        let geometry, material, mesh;
        
        switch (field.type) {
            case this.TYPES.GRAVITATIONAL:
                // Sphere for gravitational fields
                geometry = new THREE.SphereGeometry(0.5, 16, 16);
                material = new THREE.MeshBasicMaterial({
                    color: 0x62AADC,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                break;
                
            case this.TYPES.VORTEX:
                // Torus for vortex fields
                geometry = new THREE.TorusGeometry(1, 0.2, 16, 32);
                material = new THREE.MeshBasicMaterial({
                    color: 0xDC62AA,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                break;
                
            case this.TYPES.MAGNETIC:
                // Cylinder for magnetic fields
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
                material = new THREE.MeshBasicMaterial({
                    color: 0xAADC62,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                break;
                
            case this.TYPES.CUSTOM:
                // Icosahedron for custom fields
                geometry = new THREE.IcosahedronGeometry(0.7, 1);
                material = new THREE.MeshBasicMaterial({
                    color: 0xDCAA62,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                break;
        }
        
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(field.position);
        
        // Add radius indicator
        const radiusGeometry = new THREE.SphereGeometry(field.radius, 16, 16);
        const radiusMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const radiusMesh = new THREE.Mesh(radiusGeometry, radiusMaterial);
        mesh.add(radiusMesh);
        
        // Add to scene
        this.particleSystem.scene.add(mesh);
        this.visualizers[index] = mesh;
        
        return mesh;
    }
    
    update() {
        // Update visualizers (e.g., for animations)
        for (let i = 0; i < this.visualizers.length; i++) {
            if (this.visualizers[i]) {
                // Rotate vortex fields
                if (this.forceFields[i].type === this.TYPES.VORTEX) {
                    this.visualizers[i].rotation.y += 0.01;
                    this.visualizers[i].rotation.z += 0.005;
                }
                
                // Pulse magnetic fields
                if (this.forceFields[i].type === this.TYPES.MAGNETIC) {
                    const scale = 0.9 + 0.2 * Math.sin(Date.now() * 0.002);
                    this.visualizers[i].scale.set(scale, 1, scale);
                }
            }
        }
    }
}
