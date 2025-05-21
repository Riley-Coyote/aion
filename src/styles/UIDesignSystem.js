// UIDesignSystem.js - Implements the monochromatic UI design system
import * as THREE from 'three';

export class UIDesignSystem {
    constructor() {
        // Color palette
        this.colors = {
            background: '#0c0c10',
            panelBackground: 'rgba(20, 20, 30, 0.65)',
            interactiveElements: 'rgba(25, 25, 35, 0.8)',
            activeElements: 'rgba(30, 30, 45, 0.85)',
            primaryAccent: '#62AADC',
            accentVariants: {
                v70: 'rgba(98, 170, 220, 0.7)',
                v40: 'rgba(98, 170, 220, 0.4)',
                v20: 'rgba(98, 170, 220, 0.2)',
                v10: 'rgba(98, 170, 220, 0.1)'
            },
            systemStatus: {
                success: '#4CAF50',
                warning: '#FF9800',
                alert: '#F44336',
                critical: '#D32F2F',
                info: '#2196F3'
            }
        };
        
        // Typography
        this.typography = {
            fontFamily: '"JetBrains Mono", monospace',
            weights: {
                regular: '400',
                medium: '500'
            },
            sizes: {
                systemTitle: '14px',
                sectionHeader: '12px',
                panelHeader: '11px',
                controlLabel: '9px',
                valuesAndData: '9px',
                terminalText: '9px'
            }
        };
        
        // UI Components
        this.components = {};
        
        // Glass effect parameters
        this.glassEffect = {
            standard: {
                blurRadius: '2.5px',
                opacity: '0.65'
            },
            compact: {
                blurRadius: '1.5px',
                opacity: '0.7'
            },
            modal: {
                blurRadius: '3px',
                opacity: '0.75'
            },
            borders: '1px solid rgba(255, 255, 255, 0.07)',
            cornerRadius: '4px'
        };
        
        // Initialize
        this.initialize();
    }
    
    initialize() {
        // Create CSS styles
        this.createGlobalStyles();
        this.createComponentStyles();
    }
    
    createGlobalStyles() {
        // Create style element
        const style = document.createElement('style');
        style.type = 'text/css';
        
        // Define global styles
        const css = `
            /* Global styles for Aion Protocol UI */
            body {
                margin: 0;
                padding: 0;
                background-color: ${this.colors.background};
                color: white;
                font-family: ${this.typography.fontFamily};
                font-weight: ${this.typography.weights.regular};
                font-size: ${this.typography.sizes.valuesAndData};
                overflow: hidden;
            }
            
            /* Typography styles */
            .system-title {
                font-size: ${this.typography.sizes.systemTitle};
                font-weight: ${this.typography.weights.medium};
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .section-header {
                font-size: ${this.typography.sizes.sectionHeader};
                font-weight: ${this.typography.weights.medium};
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .panel-header {
                font-size: ${this.typography.sizes.panelHeader};
                font-weight: ${this.typography.weights.medium};
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .control-label {
                font-size: ${this.typography.sizes.controlLabel};
                font-weight: ${this.typography.weights.regular};
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            
            .values-data {
                font-size: ${this.typography.sizes.valuesAndData};
                font-weight: ${this.typography.weights.regular};
            }
            
            .terminal-text {
                font-size: ${this.typography.sizes.terminalText};
                font-weight: ${this.typography.weights.regular};
                font-family: ${this.typography.fontFamily};
            }
            
            /* Animation and transitions */
            .transition-all {
                transition: all 150ms ease-out;
            }
            
            .transition-appear {
                transition: all 150ms ease-out;
            }
            
            .transition-change {
                transition: all 150ms ease-in-out;
            }
            
            /* Hover and active states */
            .hover-state {
                filter: brightness(1.1);
            }
            
            .active-state {
                filter: brightness(0.9);
            }
        `;
        
        // Add styles to document
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    
    createComponentStyles() {
        // Create style element
        const style = document.createElement('style');
        style.type = 'text/css';
        
        // Define component styles
        const css = `
            /* Panel components */
            .panel-standard {
                background: ${this.colors.panelBackground};
                backdrop-filter: blur(${this.glassEffect.standard.blurRadius});
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                padding: 15px;
                margin-bottom: 10px;
            }
            
            .panel-compact {
                background: ${this.colors.panelBackground};
                backdrop-filter: blur(${this.glassEffect.compact.blurRadius});
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                padding: 10px;
                margin-bottom: 8px;
            }
            
            .panel-toolbar {
                background: ${this.colors.interactiveElements};
                backdrop-filter: blur(${this.glassEffect.compact.blurRadius});
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                padding: 8px;
                display: flex;
                align-items: center;
            }
            
            .panel-modal {
                background: ${this.colors.panelBackground};
                backdrop-filter: blur(${this.glassEffect.modal.blurRadius});
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            
            .panel-accented {
                background: ${this.colors.panelBackground};
                backdrop-filter: blur(${this.glassEffect.standard.blurRadius});
                border: 1px solid ${this.colors.primaryAccent};
                border-radius: ${this.glassEffect.cornerRadius};
                padding: 15px;
                margin-bottom: 10px;
            }
            
            /* Control components */
            .button-primary {
                background: ${this.colors.primaryAccent};
                border: none;
                border-radius: ${this.glassEffect.cornerRadius};
                color: white;
                font-family: ${this.typography.fontFamily};
                font-size: ${this.typography.sizes.controlLabel};
                font-weight: ${this.typography.weights.medium};
                text-transform: uppercase;
                padding: 8px 16px;
                cursor: pointer;
                transition: all 150ms ease-out;
            }
            
            .button-primary:hover {
                filter: brightness(1.1);
            }
            
            .button-primary:active {
                filter: brightness(0.9);
            }
            
            .button-secondary {
                background: ${this.colors.interactiveElements};
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                color: white;
                font-family: ${this.typography.fontFamily};
                font-size: ${this.typography.sizes.controlLabel};
                font-weight: ${this.typography.weights.medium};
                text-transform: uppercase;
                padding: 8px 16px;
                cursor: pointer;
                transition: all 150ms ease-out;
            }
            
            .button-secondary:hover {
                filter: brightness(1.1);
            }
            
            .button-secondary:active {
                filter: brightness(0.9);
            }
            
            .button-icon {
                background: ${this.colors.interactiveElements};
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                color: white;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 150ms ease-out;
            }
            
            .button-icon:hover {
                filter: brightness(1.1);
            }
            
            .button-icon:active {
                filter: brightness(0.9);
            }
            
            .button-text {
                background: transparent;
                border: none;
                color: ${this.colors.primaryAccent};
                font-family: ${this.typography.fontFamily};
                font-size: ${this.typography.sizes.controlLabel};
                font-weight: ${this.typography.weights.medium};
                text-transform: uppercase;
                padding: 4px 8px;
                cursor: pointer;
                transition: all 150ms ease-out;
            }
            
            .button-text:hover {
                filter: brightness(1.1);
            }
            
            .button-text:active {
                filter: brightness(0.9);
            }
            
            .slider-container {
                width: 100%;
                padding: 10px 0;
            }
            
            .slider {
                -webkit-appearance: none;
                width: 100%;
                height: 4px;
                background: ${this.colors.interactiveElements};
                border-radius: 2px;
                outline: none;
            }
            
            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 12px;
                height: 12px;
                background: ${this.colors.primaryAccent};
                border-radius: 50%;
                cursor: pointer;
            }
            
            .slider::-moz-range-thumb {
                width: 12px;
                height: 12px;
                background: ${this.colors.primaryAccent};
                border-radius: 50%;
                cursor: pointer;
            }
            
            .input-field {
                background: ${this.colors.interactiveElements};
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                color: white;
                font-family: ${this.typography.fontFamily};
                font-size: ${this.typography.sizes.valuesAndData};
                padding: 8px 12px;
                width: 100%;
                box-sizing: border-box;
                outline: none;
            }
            
            .input-search {
                background: ${this.colors.interactiveElements};
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                color: white;
                font-family: ${this.typography.fontFamily};
                font-size: ${this.typography.sizes.valuesAndData};
                padding: 8px 12px 8px 30px;
                width: 100%;
                box-sizing: border-box;
                outline: none;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
                background-repeat: no-repeat;
                background-position: 8px center;
                background-size: 14px;
            }
            
            .dropdown {
                background: ${this.colors.interactiveElements};
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                color: white;
                font-family: ${this.typography.fontFamily};
                font-size: ${this.typography.sizes.valuesAndData};
                padding: 8px 12px;
                width: 100%;
                box-sizing: border-box;
                outline: none;
                cursor: pointer;
                appearance: none;
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>');
                background-repeat: no-repeat;
                background-position: right 8px center;
                background-size: 14px;
            }
            
            .checkbox-container {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .checkbox {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                background: ${this.colors.interactiveElements};
                border: ${this.glassEffect.borders};
                border-radius: 3px;
                outline: none;
                cursor: pointer;
                margin-right: 8px;
                position: relative;
            }
            
            .checkbox:checked {
                background: ${this.colors.primaryAccent};
            }
            
            .checkbox:checked:after {
                content: '';
                position: absolute;
                left: 5px;
                top: 2px;
                width: 4px;
                height: 8px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
            
            .toggle-container {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .toggle {
                position: relative;
                display: inline-block;
                width: 36px;
                height: 20px;
                margin-right: 8px;
            }
            
            .toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${this.colors.interactiveElements};
                border-radius: 10px;
                transition: all 150ms ease-in-out;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                border-radius: 50%;
                transition: all 150ms ease-in-out;
            }
            
            .toggle input:checked + .toggle-slider {
                background-color: ${this.colors.primaryAccent};
            }
            
            .toggle input:checked + .toggle-slider:before {
                transform: translateX(16px);
            }
            
            /* Visualization elements */
            .corner-bracket {
                position: absolute;
                width: 10px;
                height: 10px;
                border-color: ${this.colors.primaryAccent};
                border-style: solid;
                border-width: 0;
            }
            
            .corner-bracket-top-left {
                top: 0;
                left: 0;
                border-top-width: 1px;
                border-left-width: 1px;
            }
            
            .corner-bracket-top-right {
                top: 0;
                right: 0;
                border-top-width: 1px;
                border-right-width: 1px;
            }
            
            .corner-bracket-bottom-left {
                bottom: 0;
                left: 0;
                border-bottom-width: 1px;
                border-left-width: 1px;
            }
            
            .corner-bracket-bottom-right {
                bottom: 0;
                right: 0;
                border-bottom-width: 1px;
                border-right-width: 1px;
            }
            
            .digital-readout {
                font-family: ${this.typography.fontFamily};
                font-size: ${this.typography.sizes.valuesAndData};
                background: ${this.colors.interactiveElements};
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                padding: 4px 8px;
                display: inline-block;
            }
            
            .targeting-element {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid ${this.colors.primaryAccent};
                border-radius: 50%;
                pointer-events: none;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .targeting-element:before, .targeting-element:after {
                content: '';
                position: absolute;
                background-color: ${this.colors.primaryAccent};
            }
            
            .targeting-element:before {
                width: 1px;
                height: 10px;
            }
            
            .targeting-element:after {
                width: 10px;
                height: 1px;
            }
            
            /* Terminal interface */
            .terminal {
                background: rgba(12, 12, 16, 0.9);
                border: ${this.glassEffect.borders};
                border-radius: ${this.glassEffect.cornerRadius};
                padding: 15px;
                font-family: ${this.typography.fontFamily};
                font-size: ${this.typography.sizes.terminalText};
                color: white;
                overflow-y: auto;
                max-height: 300px;
            }
            
            .terminal-prompt {
                color: ${this.colors.primaryAccent};
                margin-right: 8px;
            }
            
            .terminal-command {
                color: white;
            }
            
            .terminal-response {
                color: rgba(255, 255, 255, 0.7);
                margin-top: 4px;
                margin-bottom: 12px;
            }
        `;
        
        // Add styles to document
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    
    // Component creation methods
    createPanel(type = 'standard', title = null) {
        const panel = document.createElement('div');
        panel.className = `panel-${type}`;
        
        if (title) {
            const titleElement = document.createElement('div');
            titleElement.className = 'panel-header';
            titleElement.textContent = title;
            panel.appendChild(titleElement);
            
            // Add separator
            const separator = document.createElement('div');
            separator.style.cssText = `
                height: 1px;
                background: rgba(255, 255, 255, 0.1);
                margin: 10px 0 15px 0;
            `;
            panel.appendChild(separator);
        }
        
        return panel;
    }
    
    createButton(text, type = 'primary', onClick = null) {
        const button = document.createElement('button');
        button.className = `button-${type}`;
        button.textContent = text;
        
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        
        return button;
    }
    
    createIconButton(icon, onClick = null) {
        const button = document.createElement('button');
        button.className = 'button-icon';
        button.innerHTML = icon;
        
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        
        return button;
    }
    
    createSlider(min, max, value, step = 1, onChange = null) {
        const container = document.createElement('div');
        container.className = 'slider-container';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'slider';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.step = step;
        
        if (onChange) {
            slider.addEventListener('input', (e) => onChange(parseFloat(e.target.value)));
        }
        
        container.appendChild(slider);
        return container;
    }
    
    createInputField(placeholder = '', value = '', onChange = null) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-field';
        input.placeholder = placeholder;
        input.value = value;
        
        if (onChange) {
            input.addEventListener('input', (e) => onChange(e.target.value));
        }
        
        return input;
    }
    
    createSearchField(placeholder = 'Search...', onChange = null) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-search';
        input.placeholder = placeholder;
        
        if (onChange) {
            input.addEventListener('input', (e) => onChange(e.target.value));
        }
        
        return input;
    }
    
    createDropdown(options, selectedIndex = 0, onChange = null) {
        const select = document.createElement('select');
        select.className = 'dropdown';
        
        options.forEach((option, index) => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value || option;
            optionElement.textContent = option.label || option;
            optionElement.selected = index === selectedIndex;
            select.appendChild(optionElement);
        });
        
        if (onChange) {
            select.addEventListener('change', (e) => onChange(e.target.value, e.target.selectedIndex));
        }
        
        return select;
    }
    
    createCheckbox(label, checked = false, onChange = null) {
        const container = document.createElement('div');
        container.className = 'checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = checked;
        
        const labelElement = document.createElement('label');
        labelElement.className = 'control-label';
        labelElement.textContent = label;
        
        if (onChange) {
            checkbox.addEventListener('change', (e) => onChange(e.target.checked));
        }
        
        container.appendChild(checkbox);
        container.appendChild(labelElement);
        
        return container;
    }
    
    createToggle(label, checked = false, onChange = null) {
        const container = document.createElement('div');
        container.className = 'toggle-container';
        
        const toggle = document.createElement('label');
        toggle.className = 'toggle';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = checked;
        
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
    
    createDigitalReadout(value, label = null) {
        const container = document.createElement('div');
        container.style.display = 'inline-flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        
        if (label) {
            const labelElement = document.createElement('div');
            labelElement.className = 'control-label';
            labelElement.textContent = label;
            labelElement.style.marginBottom = '4px';
            container.appendChild(labelElement);
        }
        
        const readout = document.createElement('div');
        readout.className = 'digital-readout';
        readout.textContent = value;
        
        container.appendChild(readout);
        
        return {
            container,
            update: (newValue) => {
                readout.textContent = newValue;
            }
        };
    }
    
    createTerminal() {
        const terminal = document.createElement('div');
        terminal.className = 'terminal';
        
        const addCommand = (command) => {
            const line = document.createElement('div');
            
            const prompt = document.createElement('span');
            prompt.className = 'terminal-prompt';
            prompt.textContent = '>';
            
            const commandText = document.createElement('span');
            commandText.className = 'terminal-command';
            commandText.textContent = command;
            
            line.appendChild(prompt);
            line.appendChild(commandText);
            terminal.appendChild(line);
            
            terminal.scrollTop = terminal.scrollHeight;
            
            return {
                addResponse: (response) => {
                    const responseElement = document.createElement('div');
                    responseElement.className = 'terminal-response';
                    responseElement.textContent = response;
                    terminal.appendChild(responseElement);
                    terminal.scrollTop = terminal.scrollHeight;
                }
            };
        };
        
        return {
            element: terminal,
            addCommand
        };
    }
    
    // Helper methods
    applyCornerBrackets(element) {
        const topLeft = document.createElement('div');
        topLeft.className = 'corner-bracket corner-bracket-top-left';
        
        const topRight = document.createElement('div');
        topRight.className = 'corner-bracket corner-bracket-top-right';
        
        const bottomLeft = document.createElement('div');
        bottomLeft.className = 'corner-bracket corner-bracket-bottom-left';
        
        const bottomRight = document.createElement('div');
        bottomRight.className = 'corner-bracket corner-bracket-bottom-right';
        
        element.style.position = 'relative';
        element.appendChild(topLeft);
        element.appendChild(topRight);
        element.appendChild(bottomLeft);
        element.appendChild(bottomRight);
        
        return element;
    }
    
    createTargetingElement() {
        const targeting = document.createElement('div');
        targeting.className = 'targeting-element';
        
        return targeting;
    }
}
