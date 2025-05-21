// ForceFieldManager.js - Manages different types of force fields for the particle system
import * as THREE from 'three';

export class ForceFieldManager {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.scene = particleSystem.scene;
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
        
        // For mouse interaction
        this.raycaster = new THREE.Raycaster();
        this.selectedField = null;
        this.hoveredField = null;
        
        // Field colors
        this.fieldColors = {
            [this.TYPES.GRAVITATIONAL]: 0x62AADC, // Blue
            [this.TYPES.VORTEX]: 0xDC62AA,         // Pink
            [this.TYPES.MAGNETIC]: 0xAADC62,       // Green
            [this.TYPES.CUSTOM]: 0xDCAA62          // Orange
        };
        
        // Event listeners
        this.listeners = {
            fieldAdded: [],
            fieldRemoved: [],
            fieldUpdated: []
        };
    }
    
    createGravitationalField(position, strength = 10, radius = 5) {
        const field = {
            type: this.TYPES.GRAVITATIONAL,
            position: position instanceof THREE.Vector3 ? position.clone() : new THREE.Vector3(position.x, position.y, position.z),
            strength: strength,
            radius: radius,
            color: this.fieldColors[this.TYPES.GRAVITATIONAL],
            active: true,
            userData: {}
        };
        
        // Add to particle system
        const index = this.particleSystem.addForceField(
            this.TYPES.GRAVITATIONAL,
            field.position,
            strength,
            radius
        );
        
        if (index !== -1) {
            // Add to our collection and create visualizer
            field.id = `field_${Date.now()}_${this.forceFields.length}`;
            this.forceFields.push(field);
            this.createVisualizer(field, this.forceFields.length - 1);
            
            // Dispatch event
            this.dispatchEvent('fieldAdded', { field, index: this.forceFields.length - 1 });
            
            return this.forceFields.length - 1;
        }
        
        return -1;
    }
    
    createVortexField(position, strength = 8, radius = 8) {
        const field = {
            type: this.TYPES.VORTEX,
            position: position instanceof THREE.Vector3 ? position.clone() : new THREE.Vector3(position.x, position.y, position.z),
            strength: strength,
            radius: radius,
            color: this.fieldColors[this.TYPES.VORTEX],
            active: true,
            userData: {}
        };
        
        // Add to particle system
        const index = this.particleSystem.addForceField(
            this.TYPES.VORTEX,
            field.position,
            strength,
            radius
        );
        
        if (index !== -1) {
            // Add to our collection and create visualizer
            field.id = `field_${Date.now()}_${this.forceFields.length}`;
            this.forceFields.push(field);
            this.createVisualizer(field, this.forceFields.length - 1);
            
            // Dispatch event
            this.dispatchEvent('fieldAdded', { field, index: this.forceFields.length - 1 });
            
            return this.forceFields.length - 1;
        }
        
        return -1;
    }
    
    createMagneticField(position, strength = 12, radius = 10) {
        const field = {
            type: this.TYPES.MAGNETIC,
            position: position instanceof THREE.Vector3 ? position.clone() : new THREE.Vector3(position.x, position.y, position.z),
            strength: strength,
            radius: radius,
            color: this.fieldColors[this.TYPES.MAGNETIC],
            active: true,
            userData: {}
        };
        
        // Add to particle system
        const index = this.particleSystem.addForceField(
            this.TYPES.MAGNETIC,
            field.position,
            strength,
            radius
        );
        
        if (index !== -1) {
            // Add to our collection and create visualizer
            field.id = `field_${Date.now()}_${this.forceFields.length}`;
            this.forceFields.push(field);
            this.createVisualizer(field, this.forceFields.length - 1);
            
            // Dispatch event
            this.dispatchEvent('fieldAdded', { field, index: this.forceFields.length - 1 });
            
            return this.forceFields.length - 1;
        }
        
        return -1;
    }
    
    createCustomField(position, strength = 6, radius = 7) {
        const field = {
            type: this.TYPES.CUSTOM,
            position: position instanceof THREE.Vector3 ? position.clone() : new THREE.Vector3(position.x, position.y, position.z),
            strength: strength,
            radius: radius,
            color: this.fieldColors[this.TYPES.CUSTOM],
            active: true,
            userData: {}
        };
        
        // Add to particle system
        const index = this.particleSystem.addForceField(
            this.TYPES.CUSTOM,
            field.position,
            strength,
            radius
        );
        
        if (index !== -1) {
            // Add to our collection and create visualizer
            field.id = `field_${Date.now()}_${this.forceFields.length}`;
            this.forceFields.push(field);
            this.createVisualizer(field, this.forceFields.length - 1);
            
            // Dispatch event
            this.dispatchEvent('fieldAdded', { field, index: this.forceFields.length - 1 });
            
            return this.forceFields.length - 1;
        }
        
        return -1;
    }
    
    removeField(index) {
        if (index >= 0 && index < this.forceFields.length) {
            const field = this.forceFields[index];
            
            // Remove from particle system
            this.particleSystem.removeForceField(index);
            
            // Remove visualizer
            if (this.visualizers[index]) {
                this.scene.remove(this.visualizers[index]);
                
                // Dispose of geometry and materials to prevent memory leaks
                if (this.visualizers[index].geometry) {
                    this.visualizers[index].geometry.dispose();
                }
                
                if (this.visualizers[index].material) {
                    if (Array.isArray(this.visualizers[index].material)) {
                        this.visualizers[index].material.forEach(m => m.dispose());
                    } else {
                        this.visualizers[index].material.dispose();
                    }
                }
                
                // Dispose of radius indicator
                if (this.visualizers[index].children.length > 0) {
                    const radiusMesh = this.visualizers[index].children[0];
                    if (radiusMesh.geometry) radiusMesh.geometry.dispose();
                    if (radiusMesh.material) radiusMesh.material.dispose();
                }
                
                this.visualizers[index] = null;
            }
            
            // Dispatch event before removing from arrays
            this.dispatchEvent('fieldRemoved', { field, index });
            
            // Remove from arrays
            this.forceFields.splice(index, 1);
            this.visualizers.splice(index, 1);
            
            // Update indices in particle system
            this.updateFieldIndices();
            
            return true;
        }
        return false;
    }
    
    clearAllFields() {
        // Remove all fields in reverse order to avoid index issues
        for (let i = this.forceFields.length - 1; i >= 0; i--) {
            this.removeField(i);
        }
        
        // Make sure arrays are empty
        this.forceFields = [];
        this.visualizers = [];
    }
    
    createVisualizer(field, index) {
        let geometry, material, mesh;
        
        switch (field.type) {
            case this.TYPES.GRAVITATIONAL:
                // Sphere for gravitational fields
                geometry = new THREE.SphereGeometry(0.5, 16, 16);
                material = new THREE.MeshBasicMaterial({
                    color: field.color,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                break;
                
            case this.TYPES.VORTEX:
                // Torus for vortex fields
                geometry = new THREE.TorusGeometry(1, 0.2, 16, 32);
                material = new THREE.MeshBasicMaterial({
                    color: field.color,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                break;
                
            case this.TYPES.MAGNETIC:
                // Cylinder for magnetic fields
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
                material = new THREE.MeshBasicMaterial({
                    color: field.color,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                break;
                
            case this.TYPES.CUSTOM:
                // Icosahedron for custom fields
                geometry = new THREE.IcosahedronGeometry(0.7, 1);
                material = new THREE.MeshBasicMaterial({
                    color: field.color,
                    transparent: true,
                    opacity: 0.7,
                    wireframe: true
                });
                break;
        }
        
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(field.position);
        
        // Store field data for raycasting identification
        mesh.userData.fieldIndex = index;
        mesh.userData.fieldType = field.type;
        mesh.userData.fieldId = field.id;
        
        // Add radius indicator
        const radiusGeometry = new THREE.SphereGeometry(field.radius, 16, 16);
        const radiusMaterial = new THREE.MeshBasicMaterial({
            color: field.color,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const radiusMesh = new THREE.Mesh(radiusGeometry, radiusMaterial);
        mesh.add(radiusMesh);
        
        // Add to scene
        this.scene.add(mesh);
        this.visualizers[index] = mesh;
        
        return mesh;
    }
    
    updateFieldIndices() {
        // Update field indices in visualizers after removing a field
        for (let i = 0; i < this.visualizers.length; i++) {
            if (this.visualizers[i]) {
                this.visualizers[i].userData.fieldIndex = i;
            }
        }
    }
    
    updateFieldPosition(index, position) {
        if (index >= 0 && index < this.forceFields.length) {
            // Update model
            this.forceFields[index].position.copy(position);
            
            // Update visualizer
            if (this.visualizers[index]) {
                this.visualizers[index].position.copy(position);
            }
            
            // Update in particle system
            this.particleSystem.updateForceFieldPosition(index, position);
            
            // Dispatch event
            this.dispatchEvent('fieldUpdated', { 
                field: this.forceFields[index], 
                index, 
                property: 'position', 
                value: position 
            });
            
            return true;
        }
        return false;
    }
    
    updateFieldStrength(index, strength) {
        if (index >= 0 && index < this.forceFields.length) {
            // Update model
            this.forceFields[index].strength = strength;
            
            // Update in particle system
            this.particleSystem.updateForceFieldStrength(index, strength);
            
            // Dispatch event
            this.dispatchEvent('fieldUpdated', { 
                field: this.forceFields[index], 
                index, 
                property: 'strength', 
                value: strength 
            });
            
            return true;
        }
        return false;
    }
    
    updateFieldRadius(index, radius) {
        if (index >= 0 && index < this.forceFields.length) {
            // Update model
            this.forceFields[index].radius = radius;
            
            // Update visualizer
            if (this.visualizers[index] && this.visualizers[index].children.length > 0) {
                // Update radius sphere
                const radiusMesh = this.visualizers[index].children[0];
                
                // Remove old radius sphere
                this.visualizers[index].remove(radiusMesh);
                if (radiusMesh.geometry) radiusMesh.geometry.dispose();
                if (radiusMesh.material) radiusMesh.material.dispose();
                
                // Create new radius sphere
                const radiusGeometry = new THREE.SphereGeometry(radius, 16, 16);
                const radiusMaterial = new THREE.MeshBasicMaterial({
                    color: this.forceFields[index].color,
                    transparent: true,
                    opacity: 0.1,
                    wireframe: true
                });
                const newRadiusMesh = new THREE.Mesh(radiusGeometry, radiusMaterial);
                this.visualizers[index].add(newRadiusMesh);
            }
            
            // Update in particle system
            this.particleSystem.updateForceFieldRadius(index, radius);
            
            // Dispatch event
            this.dispatchEvent('fieldUpdated', { 
                field: this.forceFields[index], 
                index, 
                property: 'radius', 
                value: radius 
            });
            
            return true;
        }
        return false;
    }
    
    update(deltaTime) {
        // Update visualizers (e.g., for animations)
        for (let i = 0; i < this.visualizers.length; i++) {
            if (this.visualizers[i]) {
                // Rotate vortex fields
                if (this.forceFields[i].type === this.TYPES.VORTEX) {
                    this.visualizers[i].rotation.y += 0.01 * deltaTime * 60;
                    this.visualizers[i].rotation.z += 0.005 * deltaTime * 60;
                }
                
                // Pulse magnetic fields
                if (this.forceFields[i].type === this.TYPES.MAGNETIC) {
                    const scale = 0.9 + 0.2 * Math.sin(Date.now() * 0.002);
                    this.visualizers[i].scale.set(scale, 1, scale);
                }
                
                // Highlight selected field
                if (this.selectedField === i) {
                    // Increase intensity or add glow effect
                    if (this.visualizers[i].material) {
                        // Pulse opacity for selected field
                        this.visualizers[i].material.opacity = 0.7 + 0.3 * Math.sin(Date.now() * 0.005);
                    }
                }
                // Highlight hovered field
                else if (this.hoveredField === i) {
                    if (this.visualizers[i].material) {
                        // Higher opacity for hovered field
                        this.visualizers[i].material.opacity = 0.85;
                    }
                }
                // Reset to normal appearance
                else {
                    if (this.visualizers[i].material) {
                        this.visualizers[i].material.opacity = 0.7;
                    }
                }
            }
        }
    }
    
    // Mouse interaction
    handleMouseMove(camera, normalizedX, normalizedY) {
        // Update raycaster
        this.raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
        
        // Check for intersection with force fields
        const intersects = this.raycaster.intersectObjects(
            this.visualizers.filter(v => v !== null)
        );
        
        // Reset hovered field
        const previousHovered = this.hoveredField;
        this.hoveredField = null;
        
        // Find first intersection that isn't the selected field
        if (intersects.length > 0) {
            const fieldIndex = intersects[0].object.userData.fieldIndex;
            if (fieldIndex !== this.selectedField) {
                this.hoveredField = fieldIndex;
            }
        }
        
        // Return true if hovered field changed
        return previousHovered !== this.hoveredField;
    }
    
    handleMouseDown(camera, normalizedX, normalizedY) {
        // Update raycaster
        this.raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
        
        // Check for intersection with force fields
        const intersects = this.raycaster.intersectObjects(
            this.visualizers.filter(v => v !== null)
        );
        
        if (intersects.length > 0) {
            const fieldIndex = intersects[0].object.userData.fieldIndex;
            this.selectedField = fieldIndex;
            return true;
        }
        
        this.selectedField = null;
        return false;
    }
    
    handleMouseUp() {
        // Clear selected field
        const wasSelected = this.selectedField !== null;
        this.selectedField = null;
        return wasSelected;
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
    
    // Utility methods
    getFieldTypeString(typeValue) {
        for (const [key, value] of Object.entries(this.TYPES)) {
            if (value === typeValue) {
                return key.toLowerCase();
            }
        }
        return 'unknown';
    }
}
