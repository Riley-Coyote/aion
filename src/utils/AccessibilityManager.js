// AccessibilityManager.js - Implements accessibility features for Aion Protocol
import * as THREE from 'three';

export class AccessibilityManager {
    constructor(simulationManager, uiDesignSystem) {
        this.simulationManager = simulationManager;
        this.uiDesignSystem = uiDesignSystem;
        
        // Accessibility settings
        this.settings = {
            highContrastMode: false,
            screenReaderSupport: true,
            alternativeInputs: true,
            reducedMotion: false,
            largeText: false
        };
        
        // ARIA roles and labels
        this.ariaLabels = {};
        
        // Alternative input methods
        this.voiceControl = null;
        this.eyeTracking = null;
        
        // Initialize
        this.initialize();
    }
    
    initialize() {
        // Set up accessibility features
        this.setupAccessibilityControls();
        this.setupARIARoles();
        this.setupKeyboardNavigation();
        
        // Check for user preferences
        this.checkUserPreferences();
    }
    
    setupAccessibilityControls() {
        // Create accessibility controls panel
        const panel = document.createElement('div');
        panel.className = 'panel-compact';
        panel.setAttribute('aria-label', 'Accessibility Controls');
        panel.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
            display: none; // Hidden by default, toggle with keyboard shortcut
        `;
        
        // Create high contrast mode toggle
        const highContrastToggle = this.createToggle('High Contrast Mode', this.settings.highContrastMode, (checked) => {
            this.setHighContrastMode(checked);
        });
        
        // Create reduced motion toggle
        const reducedMotionToggle = this.createToggle('Reduced Motion', this.settings.reducedMotion, (checked) => {
            this.setReducedMotion(checked);
        });
        
        // Create large text toggle
        const largeTextToggle = this.createToggle('Large Text', this.settings.largeText, (checked) => {
            this.setLargeText(checked);
        });
        
        // Add toggles to panel
        panel.appendChild(highContrastToggle);
        panel.appendChild(reducedMotionToggle);
        panel.appendChild(largeTextToggle);
        
        // Add panel to DOM
        document.body.appendChild(panel);
        
        // Store reference
        this.accessibilityPanel = panel;
        
        // Add keyboard shortcut to toggle panel
        document.addEventListener('keydown', (e) => {
            // Alt + A to toggle accessibility panel
            if (e.altKey && e.key === 'a') {
                this.toggleAccessibilityPanel();
            }
        });
    }
    
    createToggle(label, initialState, onChange) {
        const container = document.createElement('div');
        container.className = 'toggle-container';
        
        const toggle = document.createElement('label');
        toggle.className = 'toggle';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = initialState;
        
        const slider = document.createElement('span');
        slider.className = 'toggle-slider';
        
        const labelElement = document.createElement('label');
        labelElement.className = 'control-label';
        labelElement.textContent = label;
        
        if (onChange) {
            input.addEventListener('change', (e) => onChange(e.target.checked));
        }
        
        toggle.appendChild(input);
        toggle.appendChild(slider);
        
        container.appendChild(toggle);
        container.appendChild(labelElement);
        
        return container;
    }
    
    toggleAccessibilityPanel() {
        if (this.accessibilityPanel) {
            this.accessibilityPanel.style.display = this.accessibilityPanel.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    setupARIARoles() {
        // Add ARIA roles to main containers
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) {
            canvasContainer.setAttribute('role', 'application');
            canvasContainer.setAttribute('aria-label', 'Aion Protocol Particle Simulation');
        }
        
        const uiContainer = document.getElementById('ui-container');
        if (uiContainer) {
            uiContainer.setAttribute('role', 'region');
            uiContainer.setAttribute('aria-label', 'User Interface Controls');
        }
        
        // Add ARIA live regions for important updates
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.className = 'sr-only'; // Screen reader only
        liveRegion.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(liveRegion);
        
        // Store reference
        this.liveRegion = liveRegion;
    }
    
    setupKeyboardNavigation() {
        // Add keyboard navigation for UI elements
        document.addEventListener('keydown', (e) => {
            // Tab key for navigation is handled by browser
            
            // Escape key to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Space or Enter to activate focused element
            if ((e.key === ' ' || e.key === 'Enter') && document.activeElement !== document.body) {
                e.preventDefault();
                document.activeElement.click();
            }
        });
    }
    
    closeAllModals() {
        // Find and close all modal panels
        const modals = document.querySelectorAll('.panel-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    checkUserPreferences() {
        // Check for prefers-reduced-motion
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotionQuery.matches) {
            this.setReducedMotion(true);
        }
        
        // Check for prefers-contrast
        const highContrastQuery = window.matchMedia('(prefers-contrast: more)');
        if (highContrastQuery.matches) {
            this.setHighContrastMode(true);
        }
        
        // Check for prefers-color-scheme
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        // Already in dark mode, but could adjust contrast
        
        // Listen for changes
        reducedMotionQuery.addEventListener('change', (e) => {
            this.setReducedMotion(e.matches);
        });
        
        highContrastQuery.addEventListener('change', (e) => {
            this.setHighContrastMode(e.matches);
        });
    }
    
    // High contrast mode
    setHighContrastMode(enabled) {
        this.settings.highContrastMode = enabled;
        
        if (enabled) {
            // Apply high contrast styles
            const style = document.createElement('style');
            style.id = 'high-contrast-styles';
            style.textContent = `
                body {
                    --high-contrast-bg: #000000;
                    --high-contrast-text: #ffffff;
                    --high-contrast-accent: #ffff00;
                    --high-contrast-border: #ffffff;
                }
                
                .panel-standard, .panel-compact, .panel-modal {
                    background: var(--high-contrast-bg) !important;
                    color: var(--high-contrast-text) !important;
                    border: 2px solid var(--high-contrast-border) !important;
                }
                
                .button-primary, .button-secondary {
                    background: var(--high-contrast-bg) !important;
                    color: var(--high-contrast-text) !important;
                    border: 2px solid var(--high-contrast-border) !important;
                    outline: 2px solid transparent !important;
                }
                
                .button-primary:focus, .button-secondary:focus {
                    outline: 2px solid var(--high-contrast-accent) !important;
                }
                
                input, select {
                    background: var(--high-contrast-bg) !important;
                    color: var(--high-contrast-text) !important;
                    border: 2px solid var(--high-contrast-border) !important;
                }
            `;
            document.head.appendChild(style);
            
            // Update particle colors if needed
            if (this.simulationManager && this.simulationManager.particleSystem) {
                this.simulationManager.particleSystem.setParticleColor(0xffff00); // Yellow
            }
        } else {
            // Remove high contrast styles
            const style = document.getElementById('high-contrast-styles');
            if (style) {
                style.remove();
            }
            
            // Restore particle colors
            if (this.simulationManager && this.simulationManager.particleSystem) {
                this.simulationManager.particleSystem.setParticleColor(0x62AADC); // Original blue
            }
        }
        
        // Announce change to screen readers
        this.announceToScreenReader(`High contrast mode ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    // Reduced motion
    setReducedMotion(enabled) {
        this.settings.reducedMotion = enabled;
        
        if (enabled) {
            // Slow down animations
            if (this.simulationManager) {
                this.simulationManager.setTimeScale(0.3);
            }
            
            // Reduce particle motion
            if (this.simulationManager && this.simulationManager.particleSystem) {
                // In a full implementation, we would reduce particle velocity
            }
            
            // Add CSS for reduced motion
            const style = document.createElement('style');
            style.id = 'reduced-motion-styles';
            style.textContent = `
                * {
                    animation-duration: 0.001s !important;
                    transition-duration: 0.001s !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            // Restore normal animation speed
            if (this.simulationManager) {
                this.simulationManager.setTimeScale(1.0);
            }
            
            // Remove reduced motion styles
            const style = document.getElementById('reduced-motion-styles');
            if (style) {
                style.remove();
            }
        }
        
        // Announce change to screen readers
        this.announceToScreenReader(`Reduced motion ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    // Large text
    setLargeText(enabled) {
        this.settings.largeText = enabled;
        
        if (enabled) {
            // Apply large text styles
            const style = document.createElement('style');
            style.id = 'large-text-styles';
            style.textContent = `
                .system-title {
                    font-size: 18px !important;
                }
                
                .section-header {
                    font-size: 16px !important;
                }
                
                .panel-header {
                    font-size: 14px !important;
                }
                
                .control-label {
                    font-size: 12px !important;
                }
                
                .values-data, .terminal-text {
                    font-size: 12px !important;
                }
                
                button, input, select {
                    font-size: 12px !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            // Remove large text styles
            const style = document.getElementById('large-text-styles');
            if (style) {
                style.remove();
            }
        }
        
        // Announce change to screen readers
        this.announceToScreenReader(`Large text ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    // Screen reader support
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }
    
    // Simulation state narration
    narrateSimulationState(state) {
        if (!this.settings.screenReaderSupport) return;
        
        // Create a human-readable description of the current simulation state
        let description = `Aion Protocol simulation with ${state.particleCount} particles.`;
        
        if (state.forceFields.length > 0) {
            description += ` ${state.forceFields.length} force fields active.`;
        }
        
        if (state.isPaused) {
            description += ' Simulation is paused.';
        } else {
            description += ` Running at ${state.timeScale}x speed.`;
        }
        
        // Add recent events if available
        if (state.events && state.events.length > 0) {
            const latestEvent = state.events[state.events.length - 1];
            description += ` Recent event: ${latestEvent.description}`;
        }
        
        // Announce to screen reader
        this.announceToScreenReader(description);
    }
    
    // Alternative input methods
    setupVoiceControl() {
        // In a full implementation, we would:
        // 1. Initialize voice recognition
        // 2. Set up command processing
        
        console.log('Voice control initialized');
    }
    
    setupEyeTracking() {
        // In a full implementation, we would:
        // 1. Initialize eye tracking API
        // 2. Set up gaze-based interaction
        
        console.log('Eye tracking initialized');
    }
    
    // Update method called each frame
    update() {
        // Update accessibility features as needed
        
        // Periodically narrate simulation state for screen readers
        if (this.settings.screenReaderSupport && this.simulationManager) {
            // Limit narration frequency
            const now = Date.now();
            if (!this.lastNarration || now - this.lastNarration > 5000) { // Every 5 seconds
                this.narrateSimulationState(this.simulationManager.getState());
                this.lastNarration = now;
            }
        }
    }
}
