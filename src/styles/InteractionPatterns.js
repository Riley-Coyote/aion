// InteractionPatterns.js - Implements interaction patterns for the Aion Protocol
import * as THREE from 'three';

export class InteractionPatterns {
    constructor(simulationManager, uiDesignSystem) {
        this.simulationManager = simulationManager;
        this.uiDesignSystem = uiDesignSystem;
        
        // DOM elements
        this.canvas = null;
        this.uiContainer = null;
        
        // Interaction state
        this.mousePosition = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.selectedObject = null;
        this.isDragging = false;
        this.isRotating = false;
        this.lastTouchDistance = 0;
        
        // Initialize
        this.initialize();
    }
    
    initialize() {
        // Get DOM elements
        this.canvas = document.querySelector('#canvas-container canvas');
        this.uiContainer = document.getElementById('ui-container');
        
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        // Set up event listeners
        this.setupMouseInteractions();
        this.setupTouchInteractions();
        this.setupKeyboardInteractions();
        
        // Set up transition durations
        document.documentElement.style.setProperty('--transition-duration', '150ms');
    }
    
    setupMouseInteractions() {
        // Mouse move
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Mouse down
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        
        // Mouse up
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Right click
        this.canvas.addEventListener('contextmenu', this.handleRightClick.bind(this));
        
        // Mouse wheel
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
    }
    
    setupTouchInteractions() {
        // Touch start
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        
        // Touch move
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        
        // Touch end
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    setupKeyboardInteractions() {
        // Key down
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Key up
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    
    // Mouse event handlers
    handleMouseMove(event) {
        // Update mouse position
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Handle rotation if dragging
        if (this.isRotating) {
            // In a full implementation, we would:
            // 1. Calculate rotation delta
            // 2. Apply rotation to camera or scene
            
            // For now, we'll use OrbitControls which handles this automatically
        }
        
        // Handle object dragging
        if (this.isDragging && this.selectedObject) {
            // In a full implementation, we would:
            // 1. Calculate new position based on mouse movement
            // 2. Update object position
            
            // For now, this is a placeholder
        }
        
        // Update hover states
        this.updateHoverStates();
    }
    
    handleMouseDown(event) {
        // Left click
        if (event.button === 0) {
            // Check for object selection
            const intersects = this.getIntersects();
            
            if (intersects.length > 0) {
                // Select object
                this.selectedObject = intersects[0].object;
                this.isDragging = true;
                
                // Notify simulation manager of selection
                if (this.simulationManager) {
                    this.simulationManager.handleObjectSelection(this.selectedObject);
                }
            } else {
                // Start rotation
                this.isRotating = true;
            }
        }
    }
    
    handleMouseUp(event) {
        // End dragging and rotation
        this.isDragging = false;
        this.isRotating = false;
        
        // If object was selected but not dragged, trigger click
        if (this.selectedObject && !this.isDragging) {
            this.handleObjectClick(this.selectedObject);
        }
        
        this.selectedObject = null;
    }
    
    handleRightClick(event) {
        // Prevent default context menu
        event.preventDefault();
        
        // Create force field at mouse position
        if (this.simulationManager) {
            // Convert mouse position to 3D space
            const position = this.getMousePositionIn3D();
            
            if (position) {
                // Create force field
                this.simulationManager.addGravitationalField(position, 10, 20);
            }
        }
    }
    
    handleWheel(event) {
        // Prevent default scrolling
        event.preventDefault();
        
        // Zoom camera
        if (this.simulationManager && this.simulationManager.camera) {
            // In a full implementation, we would:
            // 1. Calculate zoom delta
            // 2. Update camera position or field of view
            
            // For now, we'll use OrbitControls which handles this automatically
        }
    }
    
    // Touch event handlers
    handleTouchStart(event) {
        // Prevent default touch actions
        event.preventDefault();
        
        // Single touch
        if (event.touches.length === 1) {
            // Convert touch to mouse position
            const touch = event.touches[0];
            this.mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            // Check for object selection
            const intersects = this.getIntersects();
            
            if (intersects.length > 0) {
                // Select object
                this.selectedObject = intersects[0].object;
                
                // Start long press timer for force field creation
                this.longPressTimer = setTimeout(() => {
                    // Create force field at touch position
                    const position = this.getMousePositionIn3D();
                    
                    if (position && this.simulationManager) {
                        this.simulationManager.addGravitationalField(position, 10, 20);
                    }
                    
                    this.selectedObject = null;
                }, 500);
            } else {
                // Start rotation
                this.isRotating = true;
            }
        }
        // Multi-touch (pinch zoom)
        else if (event.touches.length === 2) {
            // Calculate initial touch distance
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            this.lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
        }
    }
    
    handleTouchMove(event) {
        // Prevent default touch actions
        event.preventDefault();
        
        // Clear long press timer if touch moves
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        
        // Single touch (rotation)
        if (event.touches.length === 1 && this.isRotating) {
            // Convert touch to mouse position
            const touch = event.touches[0];
            const newX = (touch.clientX / window.innerWidth) * 2 - 1;
            const newY = -(touch.clientY / window.innerHeight) * 2 + 1;
            
            // Calculate delta
            const deltaX = newX - this.mousePosition.x;
            const deltaY = newY - this.mousePosition.y;
            
            // Update mouse position
            this.mousePosition.x = newX;
            this.mousePosition.y = newY;
            
            // In a full implementation, we would:
            // 1. Apply rotation to camera or scene based on delta
            
            // For now, we'll use OrbitControls which handles this automatically
        }
        // Multi-touch (pinch zoom)
        else if (event.touches.length === 2) {
            // Calculate new touch distance
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const newTouchDistance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate zoom factor
            const zoomDelta = newTouchDistance / this.lastTouchDistance;
            
            // Update last touch distance
            this.lastTouchDistance = newTouchDistance;
            
            // Apply zoom
            if (this.simulationManager && this.simulationManager.camera) {
                // In a full implementation, we would:
                // 1. Update camera position or field of view based on zoom delta
                
                // For now, we'll use OrbitControls which handles this automatically
            }
        }
    }
    
    handleTouchEnd(event) {
        // Clear long press timer
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        
        // End rotation
        this.isRotating = false;
        
        // If object was selected but not dragged, trigger click
        if (this.selectedObject) {
            this.handleObjectClick(this.selectedObject);
            this.selectedObject = null;
        }
    }
    
    // Keyboard event handlers
    handleKeyDown(event) {
        // Handle keyboard shortcuts
        switch (event.key) {
            case ' ':
                // Space: Toggle pause
                if (this.simulationManager) {
                    if (this.simulationManager.paused) {
                        this.simulationManager.play();
                    } else {
                        this.simulationManager.pause();
                    }
                }
                break;
                
            case 'r':
                // R: Reset simulation
                if (this.simulationManager) {
                    // Reset simulation
                }
                break;
                
            case '+':
            case '=':
                // +: Increase time scale
                if (this.simulationManager) {
                    const newScale = Math.min(10, this.simulationManager.timeScale * 1.5);
                    this.simulationManager.setTimeScale(newScale);
                }
                break;
                
            case '-':
                // -: Decrease time scale
                if (this.simulationManager) {
                    const newScale = Math.max(0.1, this.simulationManager.timeScale / 1.5);
                    this.simulationManager.setTimeScale(newScale);
                }
                break;
                
            case 'g':
                // G: Toggle gravity
                // In a full implementation, we would toggle gravity
                break;
        }
    }
    
    handleKeyUp(event) {
        // Handle key up events if needed
    }
    
    // Helper methods
    getIntersects() {
        if (!this.simulationManager || !this.simulationManager.camera) {
            return [];
        }
        
        this.raycaster.setFromCamera(this.mousePosition, this.simulationManager.camera);
        
        // In a full implementation, we would:
        // 1. Get all objects in the scene
        // 2. Filter for interactive objects
        // 3. Return intersections
        
        // For now, this is a placeholder
        return this.raycaster.intersectObjects(this.simulationManager.scene.children, true);
    }
    
    getMousePositionIn3D() {
        if (!this.simulationManager || !this.simulationManager.camera) {
            return null;
        }
        
        this.raycaster.setFromCamera(this.mousePosition, this.simulationManager.camera);
        
        // Create a plane at z=0
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        
        // Calculate intersection
        const intersection = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, intersection);
        
        return intersection;
    }
    
    handleObjectClick(object) {
        // Notify simulation manager of object click
        if (this.simulationManager) {
            this.simulationManager.handleObjectClick(object);
        }
    }
    
    updateHoverStates() {
        // In a full implementation, we would:
        // 1. Get intersects
        // 2. Update hover states for interactive objects
        
        // For now, this is a placeholder
    }
    
    // State transition methods
    applyTransition(element, properties, duration = 150) {
        // Apply transition
        element.style.transition = `all ${duration}ms ease-out`;
        
        // Apply properties
        for (const [property, value] of Object.entries(properties)) {
            element.style[property] = value;
        }
        
        // Remove transition after completion
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }
    
    applyHoverState(element) {
        this.applyTransition(element, {
            filter: 'brightness(1.1)'
        });
    }
    
    applyActiveState(element) {
        this.applyTransition(element, {
            filter: 'brightness(0.9)'
        });
    }
    
    applyFeedback(element, type = 'success') {
        // Get color based on type
        let color;
        
        switch (type) {
            case 'success':
                color = this.uiDesignSystem.colors.systemStatus.success;
                break;
            case 'warning':
                color = this.uiDesignSystem.colors.systemStatus.warning;
                break;
            case 'alert':
                color = this.uiDesignSystem.colors.systemStatus.alert;
                break;
            case 'critical':
                color = this.uiDesignSystem.colors.systemStatus.critical;
                break;
            case 'info':
                color = this.uiDesignSystem.colors.systemStatus.info;
                break;
            default:
                color = this.uiDesignSystem.colors.primaryAccent;
        }
        
        // Apply feedback
        this.applyTransition(element, {
            boxShadow: `0 0 10px ${color}`
        });
        
        // Remove feedback after 500ms
        setTimeout(() => {
            this.applyTransition(element, {
                boxShadow: 'none'
            });
        }, 500);
    }
}
