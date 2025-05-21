// UIManager.js - Controls the user interface for the Aion Protocol
import * as THREE from 'three';
import * as dat from 'dat.gui';

export class UIManager {
    constructor(simulationManager, aiInterface) {
        this.simulationManager = simulationManager;
        this.aiInterface = aiInterface;
        this.scene = simulationManager.scene;
        this.renderer = simulationManager.renderer;
        this.camera = simulationManager.camera;
        
        // UI components
        this.controlPanels = {};
        this.datGUI = null;
        this.statsPanel = null;
        this.helpOverlay = null;
        this.toast = null;
        
        // UI state
        this.isControlsPanelVisible = true;
        this.activeTab = 'particles';
        this.isDragging = false;
        this.draggingField = null;
        
        // Initialize UI components
        this.initGUI();
        this.initControlPanels();
        this.initHelpOverlay();
        this.initToast();
        this.initEventListeners();
    }
    
    initGUI() {
        // Create dat.GUI for parameter adjustment
        this.datGUI = new dat.GUI({ autoPlace: false });
        this.datGUI.domElement.id = 'gui-container';
        
        // Add GUI to the document
        const guiContainer = document.createElement('div');
        guiContainer.className = 'dat-gui-container';
        guiContainer.appendChild(this.datGUI.domElement);
        document.getElementById('ui-container').appendChild(guiContainer);
        
        // Create folders for different parameter categories
        const particleFolder = this.datGUI.addFolder('Particle System');
        const forceFieldFolder = this.datGUI.addFolder('Force Fields');
        const fluidDynamicsFolder = this.datGUI.addFolder('Fluid Dynamics');
        const collisionsFolder = this.datGUI.addFolder('Collisions');
        const constraintsFolder = this.datGUI.addFolder('Constraints');
        const visualFolder = this.datGUI.addFolder('Visualization');
        
        // Particle system parameters
        particleFolder.add(this.simulationManager.particleSystem, 'particleCount', 1000, 1000000).step(1000).name('Particle Count').onChange(value => {
            this.simulationManager.setParticleCount(Math.floor(value));
        });
        
        particleFolder.add(this.simulationManager.particleSystem, 'particleSize', 0.01, 0.5).name('Particle Size').onChange(value => {
            this.simulationManager.setParticleSize(value);
        });
        
        const particleColor = { color: '#62AADC' };
        particleFolder.addColor(particleColor, 'color').name('Particle Color').onChange(value => {
            this.simulationManager.setParticleColor(value);
        });
        
        // Force field parameters
        const fieldTypes = {
            'Gravitational': () => this.createForceField('gravitational'),
            'Vortex': () => this.createForceField('vortex'),
            'Magnetic': () => this.createForceField('magnetic'),
            'Custom': () => this.createForceField('custom')
        };
        
        forceFieldFolder.add({ addField: () => {} }, 'addField', fieldTypes).name('Add Force Field');
        
        // Fluid dynamics parameters
        const fluidParams = this.simulationManager.fluidDynamics;
        fluidDynamicsFolder.add(fluidParams, 'smoothingRadius', 0.1, 5.0).name('Smoothing Radius').onChange(value => {
            this.simulationManager.setFluidParameters({ smoothingRadius: value });
        });
        
        fluidDynamicsFolder.add(fluidParams, 'viscosity', 0.01, 1.0).name('Viscosity').onChange(value => {
            this.simulationManager.setFluidParameters({ viscosity: value });
        });
        
        fluidDynamicsFolder.add(fluidParams, 'surfaceTension', 0.0, 1.0).name('Surface Tension').onChange(value => {
            this.simulationManager.setFluidParameters({ surfaceTension: value });
        });
        
        // Collision parameters
        const collisionParams = this.simulationManager.collisionSystem;
        collisionsFolder.add(collisionParams, 'enableCollisions').name('Enable Collisions').onChange(value => {
            this.simulationManager.setCollisionParameters({ enableCollisions: value });
        });
        
        collisionsFolder.add(collisionParams, 'collisionDamping', 0.0, 1.0).name('Elasticity').onChange(value => {
            this.simulationManager.setCollisionParameters({ collisionDamping: value });
        });
        
        collisionsFolder.add(collisionParams, 'particleRadius', 0.01, 0.5).name('Collision Radius').onChange(value => {
            this.simulationManager.setCollisionParameters({ particleRadius: value });
        });
        
        // Visual parameters
        const visualParams = { 
            showForceFields: true,
            showVelocities: false,
            showConstraints: true,
            backgroundOpacity: 1.0
        };
        
        visualFolder.add(visualParams, 'showForceFields').name('Show Force Fields').onChange(value => {
            this.setForceFieldVisibility(value);
        });
        
        visualFolder.add(visualParams, 'showVelocities').name('Show Velocities').onChange(value => {
            this.setVelocityVisibility(value);
        });
        
        visualFolder.add(visualParams, 'showConstraints').name('Show Constraints').onChange(value => {
            this.setConstraintVisibility(value);
        });
        
        visualFolder.add(visualParams, 'backgroundOpacity', 0.0, 1.0).name('Background Opacity').onChange(value => {
            this.setBackgroundOpacity(value);
        });
        
        // Open the particle folder by default
        particleFolder.open();
    }
    
    initControlPanels() {
        // Create main control panel
        const controlPanel = document.createElement('div');
        controlPanel.className = 'control-panel';
        controlPanel.innerHTML = `
            <div class="panel-header">
                <h2>Aion Protocol</h2>
                <button class="minimize-button">−</button>
            </div>
            <div class="panel-tabs">
                <button class="tab-button active" data-tab="particles">Particles</button>
                <button class="tab-button" data-tab="forces">Forces</button>
                <button class="tab-button" data-tab="simulation">Simulation</button>
                <button class="tab-button" data-tab="blockchain">Blockchain</button>
            </div>
            <div class="panel-content">
                <div class="tab-content active" data-tab="particles">
                    <div class="control-group">
                        <label>Particle Count</label>
                        <div class="slider-container">
                            <input type="range" min="1000" max="100000" step="1000" value="10000" id="particle-count-slider">
                            <span class="slider-value">10,000</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Particle Size</label>
                        <div class="slider-container">
                            <input type="range" min="0.01" max="0.2" step="0.01" value="0.05" id="particle-size-slider">
                            <span class="slider-value">0.05</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Particle Color</label>
                        <input type="color" value="#62AADC" id="particle-color-picker">
                    </div>
                    <div class="button-row">
                        <button class="action-button" id="reset-particles-button">Reset Particles</button>
                        <button class="action-button" id="randomize-particles-button">Randomize</button>
                    </div>
                </div>
                <div class="tab-content" data-tab="forces">
                    <div class="control-group">
                        <label>Force Fields</label>
                        <select id="force-field-type">
                            <option value="gravitational">Gravitational</option>
                            <option value="vortex">Vortex</option>
                            <option value="magnetic">Magnetic</option>
                            <option value="custom">Custom</option>
                        </select>
                        <button class="action-button" id="add-force-field-button">Add Force Field</button>
                    </div>
                    <div class="force-field-list" id="force-field-list">
                        <!-- Force fields will be added here dynamically -->
                    </div>
                    <div class="button-row">
                        <button class="action-button danger" id="clear-force-fields-button">Clear All</button>
                    </div>
                </div>
                <div class="tab-content" data-tab="simulation">
                    <div class="control-group">
                        <label>Simulation Speed</label>
                        <div class="slider-container">
                            <input type="range" min="0.1" max="2" step="0.1" value="1" id="simulation-speed-slider">
                            <span class="slider-value">1.0x</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Physics</label>
                        <div class="checkbox-row">
                            <label>
                                <input type="checkbox" id="enable-collisions-checkbox" checked>
                                Collisions
                            </label>
                            <label>
                                <input type="checkbox" id="enable-fluid-dynamics-checkbox" checked>
                                Fluid Dynamics
                            </label>
                        </div>
                    </div>
                    <div class="button-row simulation-controls">
                        <button class="action-button" id="pause-button">Pause</button>
                        <button class="action-button" id="step-button">Step</button>
                        <button class="action-button" id="reset-button">Reset</button>
                    </div>
                    <div class="button-row">
                        <button class="action-button" id="record-button">Record</button>
                        <button class="action-button" id="playback-button" disabled>Playback</button>
                    </div>
                </div>
                <div class="tab-content" data-tab="blockchain">
                    <div class="control-group">
                        <label>Visualization Mode</label>
                        <select id="blockchain-visualization-mode">
                            <option value="transactions">Transactions</option>
                            <option value="funding">Research Funding</option>
                            <option value="governance">Governance</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Active Nodes</label>
                        <div class="slider-container">
                            <input type="range" min="5" max="50" step="1" value="10" id="node-count-slider">
                            <span class="slider-value">10</span>
                        </div>
                    </div>
                    <div class="blockchain-visualization-controls">
                        <!-- Dynamic content based on selected mode -->
                    </div>
                    <div class="button-row">
                        <button class="action-button" id="generate-transaction-button">Generate Transaction</button>
                        <button class="action-button" id="clear-transactions-button">Clear All</button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('ui-container').appendChild(controlPanel);
        this.controlPanels.main = controlPanel;
        
        // Add event listeners for control panel
        this.addControlPanelEventListeners(controlPanel);
    }
    
    addControlPanelEventListeners(panel) {
        // Tab switching
        const tabButtons = panel.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Minimize button
        const minimizeButton = panel.querySelector('.minimize-button');
        minimizeButton.addEventListener('click', () => {
            this.toggleControlPanel();
        });
        
        // Particle controls
        const particleCountSlider = panel.querySelector('#particle-count-slider');
        particleCountSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            panel.querySelector('#particle-count-slider + .slider-value').textContent = value.toLocaleString();
            this.simulationManager.setParticleCount(value);
        });
        
        const particleSizeSlider = panel.querySelector('#particle-size-slider');
        particleSizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            panel.querySelector('#particle-size-slider + .slider-value').textContent = value.toFixed(2);
            this.simulationManager.setParticleSize(value);
        });
        
        const particleColorPicker = panel.querySelector('#particle-color-picker');
        particleColorPicker.addEventListener('change', (e) => {
            this.simulationManager.setParticleColor(e.target.value);
        });
        
        const resetParticlesButton = panel.querySelector('#reset-particles-button');
        resetParticlesButton.addEventListener('click', () => {
            this.simulationManager.particleSystem.resetParticles();
        });
        
        const randomizeParticlesButton = panel.querySelector('#randomize-particles-button');
        randomizeParticlesButton.addEventListener('click', () => {
            this.simulationManager.particleSystem.randomizeParticles();
        });
        
        // Force field controls
        const addForceFieldButton = panel.querySelector('#add-force-field-button');
        addForceFieldButton.addEventListener('click', () => {
            const fieldType = panel.querySelector('#force-field-type').value;
            this.createForceField(fieldType);
        });
        
        const clearForceFieldsButton = panel.querySelector('#clear-force-fields-button');
        clearForceFieldsButton.addEventListener('click', () => {
            this.clearForceFields();
        });
        
        // Simulation controls
        const simulationSpeedSlider = panel.querySelector('#simulation-speed-slider');
        simulationSpeedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            panel.querySelector('#simulation-speed-slider + .slider-value').textContent = value.toFixed(1) + 'x';
            this.simulationManager.setTimeScale(value);
        });
        
        const enableCollisionsCheckbox = panel.querySelector('#enable-collisions-checkbox');
        enableCollisionsCheckbox.addEventListener('change', (e) => {
            this.simulationManager.setCollisionParameters({ enableCollisions: e.target.checked });
        });
        
        const enableFluidDynamicsCheckbox = panel.querySelector('#enable-fluid-dynamics-checkbox');
        enableFluidDynamicsCheckbox.addEventListener('change', (e) => {
            this.simulationManager.fluidDynamics.enabled = e.target.checked;
        });
        
        const pauseButton = panel.querySelector('#pause-button');
        pauseButton.addEventListener('click', () => {
            if (this.simulationManager.paused) {
                this.simulationManager.play();
                pauseButton.textContent = 'Pause';
            } else {
                this.simulationManager.pause();
                pauseButton.textContent = 'Play';
            }
        });
        
        const stepButton = panel.querySelector('#step-button');
        stepButton.addEventListener('click', () => {
            this.simulationManager.stepSimulation();
        });
        
        const resetButton = panel.querySelector('#reset-button');
        resetButton.addEventListener('click', () => {
            this.simulationManager.resetSimulation();
        });
        
        const recordButton = panel.querySelector('#record-button');
        recordButton.addEventListener('click', () => {
            if (this.simulationManager.recording) {
                this.simulationManager.stopRecording();
                recordButton.textContent = 'Record';
                panel.querySelector('#playback-button').disabled = false;
            } else {
                this.simulationManager.startRecording();
                recordButton.textContent = 'Stop Recording';
            }
        });
        
        const playbackButton = panel.querySelector('#playback-button');
        playbackButton.addEventListener('click', () => {
            if (this.simulationManager.playbackMode) {
                this.simulationManager.stopPlayback();
                playbackButton.textContent = 'Playback';
            } else {
                this.simulationManager.startPlayback();
                playbackButton.textContent = 'Stop Playback';
            }
        });
        
        // Blockchain controls
        const blockchainVisualizationMode = panel.querySelector('#blockchain-visualization-mode');
        blockchainVisualizationMode.addEventListener('change', (e) => {
            this.setBlockchainVisualizationMode(e.target.value);
        });
        
        const nodeCountSlider = panel.querySelector('#node-count-slider');
        nodeCountSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            panel.querySelector('#node-count-slider + .slider-value').textContent = value.toString();
            this.simulationManager.blockchainVisualization.setNodeCount(value);
        });
        
        const generateTransactionButton = panel.querySelector('#generate-transaction-button');
        generateTransactionButton.addEventListener('click', () => {
            this.simulationManager.blockchainVisualization.generateTransaction();
        });
        
        const clearTransactionsButton = panel.querySelector('#clear-transactions-button');
        clearTransactionsButton.addEventListener('click', () => {
            this.simulationManager.blockchainVisualization.clearTransactions();
        });
    }
    
    initHelpOverlay() {
        const helpOverlay = document.createElement('div');
        helpOverlay.className = 'help-overlay hidden';
        helpOverlay.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h2>Aion Protocol Help</h2>
                    <button class="close-button">×</button>
                </div>
                <div class="help-body">
                    <h3>Navigation Controls</h3>
                    <ul>
                        <li><strong>Rotate:</strong> Left click + drag</li>
                        <li><strong>Pan:</strong> Right click + drag</li>
                        <li><strong>Zoom:</strong> Scroll wheel</li>
                    </ul>
                    
                    <h3>Force Field Creation</h3>
                    <ul>
                        <li><strong>Add Force Field:</strong> Select type and click "Add Force Field" button</li>
                        <li><strong>Position Field:</strong> Left click in space to place</li>
                        <li><strong>Move Field:</strong> Drag existing field</li>
                        <li><strong>Remove Field:</strong> Right click on field</li>
                    </ul>
                    
                    <h3>Keyboard Shortcuts</h3>
                    <ul>
                        <li><strong>Space:</strong> Pause/Play simulation</li>
                        <li><strong>R:</strong> Reset simulation</li>
                        <li><strong>H:</strong> Show/hide this help</li>
                        <li><strong>C:</strong> Show/hide control panel</li>
                        <li><strong>G:</strong> Show/hide GUI</li>
                        <li><strong>1-4:</strong> Switch tabs (Particles, Forces, Simulation, Blockchain)</li>
                    </ul>
                    
                    <h3>AI Interface</h3>
                    <p>
                        You can use natural language commands to control the simulation.
                        Try phrases like "add a gravitational field", "increase particle count",
                        or "show me fluid dynamics".
                    </p>
                </div>
            </div>
        `;
        
        document.getElementById('ui-container').appendChild(helpOverlay);
        this.helpOverlay = helpOverlay;
        
        // Add event listener for close button
        const closeButton = helpOverlay.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            this.toggleHelpOverlay();
        });
    }
    
    initToast() {
        const toast = document.createElement('div');
        toast.className = 'toast hidden';
        document.getElementById('ui-container').appendChild(toast);
        this.toast = toast;
    }
    
    initEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ': // Space
                    if (this.simulationManager.paused) {
                        this.simulationManager.play();
                        this.controlPanels.main.querySelector('#pause-button').textContent = 'Pause';
                    } else {
                        this.simulationManager.pause();
                        this.controlPanels.main.querySelector('#pause-button').textContent = 'Play';
                    }
                    break;
                    
                case 'r': // R
                case 'R':
                    this.simulationManager.resetSimulation();
                    break;
                    
                case 'h': // H
                case 'H':
                    this.toggleHelpOverlay();
                    break;
                    
                case 'c': // C
                case 'C':
                    this.toggleControlPanel();
                    break;
                    
                case 'g': // G
                case 'G':
                    this.toggleGUI();
                    break;
                    
                case '1':
                    this.switchTab('particles');
                    break;
                    
                case '2':
                    this.switchTab('forces');
                    break;
                    
                case '3':
                    this.switchTab('simulation');
                    break;
                    
                case '4':
                    this.switchTab('blockchain');
                    break;
            }
        });
        
        // Mouse interaction for force field placement
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.handleMouseDown(e);
            }
        });
        
        canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // Left click
                this.handleMouseUp(e);
            } else if (e.button === 2) { // Right click
                this.handleRightClick(e);
            }
        });
        
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Prevent default context menu
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    switchTab(tab) {
        const tabButtons = this.controlPanels.main.querySelectorAll('.tab-button');
        const tabContents = this.controlPanels.main.querySelectorAll('.tab-content');
        
        // Remove active class from all tabs
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to selected tab
        this.controlPanels.main.querySelector(`.tab-button[data-tab="${tab}"]`).classList.add('active');
        this.controlPanels.main.querySelector(`.tab-content[data-tab="${tab}"]`).classList.add('active');
        
        this.activeTab = tab;
    }
    
    toggleControlPanel() {
        const panel = this.controlPanels.main;
        this.isControlsPanelVisible = !this.isControlsPanelVisible;
        
        if (this.isControlsPanelVisible) {
            panel.classList.remove('minimized');
            panel.querySelector('.minimize-button').textContent = '−';
        } else {
            panel.classList.add('minimized');
            panel.querySelector('.minimize-button').textContent = '+';
        }
    }
    
    toggleHelpOverlay() {
        this.helpOverlay.classList.toggle('hidden');
    }
    
    toggleGUI() {
        const guiContainer = document.querySelector('.dat-gui-container');
        guiContainer.classList.toggle('hidden');
    }
    
    showToast(message, duration = 3000) {
        this.toast.textContent = message;
        this.toast.classList.remove('hidden');
        
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            this.toast.classList.add('hidden');
        }, duration);
    }
    
    createForceField(type) {
        this.showToast(`Click in the simulation to place a ${type} force field`);
        
        // Set mode for next click
        this.activeForceFieldType = type;
    }
    
    clearForceFields() {
        // Clear all force fields
        this.simulationManager.forceFieldManager.clearAllFields();
        
        // Update the force field list UI
        const forceFieldList = this.controlPanels.main.querySelector('#force-field-list');
        forceFieldList.innerHTML = '';
        
        this.showToast('All force fields cleared');
    }
    
    setForceFieldVisibility(visible) {
        const forceFieldVisualizers = this.simulationManager.forceFieldManager.visualizers;
        
        for (let i = 0; i < forceFieldVisualizers.length; i++) {
            if (forceFieldVisualizers[i]) {
                forceFieldVisualizers[i].visible = visible;
            }
        }
    }
    
    setVelocityVisibility(visible) {
        // TODO: Implement when velocity visualization is added
    }
    
    setConstraintVisibility(visible) {
        if (this.simulationManager.constraintSystem.springLines) {
            this.simulationManager.constraintSystem.springLines.visible = visible;
        }
        
        if (this.simulationManager.constraintSystem.constraintLines) {
            this.simulationManager.constraintSystem.constraintLines.visible = visible;
        }
    }
    
    setBackgroundOpacity(opacity) {
        const bgColor = this.scene.background;
        bgColor.setRGB(bgColor.r, bgColor.g, bgColor.b);
        this.renderer.setClearAlpha(opacity);
    }
    
    setBlockchainVisualizationMode(mode) {
        if (this.simulationManager.blockchainVisualization) {
            this.simulationManager.blockchainVisualization.setVisualizationMode(mode);
            
            // Update UI based on mode
            const controlsContainer = this.controlPanels.main.querySelector('.blockchain-visualization-controls');
            
            switch (mode) {
                case 'transactions':
                    controlsContainer.innerHTML = `
                        <div class="control-group">
                            <label>Transaction Rate</label>
                            <div class="slider-container">
                                <input type="range" min="1" max="50" step="1" value="10" id="transaction-rate-slider">
                                <span class="slider-value">10/min</span>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'funding':
                    controlsContainer.innerHTML = `
                        <div class="control-group">
                            <label>Research Projects</label>
                            <div class="slider-container">
                                <input type="range" min="1" max="20" step="1" value="5" id="project-count-slider">
                                <span class="slider-value">5</span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Funding Pool Size</label>
                            <div class="slider-container">
                                <input type="range" min="100000" max="10000000" step="100000" value="1000000" id="funding-pool-slider">
                                <span class="slider-value">1,000,000</span>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'governance':
                    controlsContainer.innerHTML = `
                        <div class="control-group">
                            <label>Active Proposals</label>
                            <div class="slider-container">
                                <input type="range" min="1" max="10" step="1" value="3" id="proposal-count-slider">
                                <span class="slider-value">3</span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Voting Period</label>
                            <div class="slider-container">
                                <input type="range" min="10" max="120" step="10" value="60" id="voting-period-slider">
                                <span class="slider-value">60 seconds</span>
                            </div>
                        </div>
                    `;
                    break;
            }
            
            // Add event listeners to new controls
            this.addModeSpecificEventListeners(mode);
        }
    }
    
    addModeSpecificEventListeners(mode) {
        const controlsContainer = this.controlPanels.main.querySelector('.blockchain-visualization-controls');
        
        switch (mode) {
            case 'transactions':
                const transactionRateSlider = controlsContainer.querySelector('#transaction-rate-slider');
                if (transactionRateSlider) {
                    transactionRateSlider.addEventListener('input', (e) => {
                        const value = parseInt(e.target.value);
                        controlsContainer.querySelector('#transaction-rate-slider + .slider-value').textContent = value + '/min';
                        this.simulationManager.blockchainVisualization.setTransactionRate(value);
                    });
                }
                break;
                
            case 'funding':
                const projectCountSlider = controlsContainer.querySelector('#project-count-slider');
                if (projectCountSlider) {
                    projectCountSlider.addEventListener('input', (e) => {
                        const value = parseInt(e.target.value);
                        controlsContainer.querySelector('#project-count-slider + .slider-value').textContent = value.toString();
                        this.simulationManager.blockchainVisualization.setProjectCount(value);
                    });
                }
                
                const fundingPoolSlider = controlsContainer.querySelector('#funding-pool-slider');
                if (fundingPoolSlider) {
                    fundingPoolSlider.addEventListener('input', (e) => {
                        const value = parseInt(e.target.value);
                        controlsContainer.querySelector('#funding-pool-slider + .slider-value').textContent = value.toLocaleString();
                        this.simulationManager.blockchainVisualization.setFundingPool(value);
                    });
                }
                break;
                
            case 'governance':
                const proposalCountSlider = controlsContainer.querySelector('#proposal-count-slider');
                if (proposalCountSlider) {
                    proposalCountSlider.addEventListener('input', (e) => {
                        const value = parseInt(e.target.value);
                        controlsContainer.querySelector('#proposal-count-slider + .slider-value').textContent = value.toString();
                        this.simulationManager.blockchainVisualization.setProposalCount(value);
                    });
                }
                
                const votingPeriodSlider = controlsContainer.querySelector('#voting-period-slider');
                if (votingPeriodSlider) {
                    votingPeriodSlider.addEventListener('input', (e) => {
                        const value = parseInt(e.target.value);
                        controlsContainer.querySelector('#voting-period-slider + .slider-value').textContent = value + ' seconds';
                        this.simulationManager.blockchainVisualization.setVotingPeriod(value);
                    });
                }
                break;
        }
    }
    
    handleMouseDown(event) {
        event.preventDefault();
        
        // Get normalized device coordinates
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Raycasting
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        
        // Check for intersection with force fields
        const intersects = raycaster.intersectObjects(
            this.simulationManager.forceFieldManager.visualizers.filter(v => v !== null)
        );
        
        if (intersects.length > 0) {
            // Clicked on a force field, start dragging
            this.isDragging = true;
            this.draggingField = intersects[0].object;
            this.draggingFieldIndex = this.simulationManager.forceFieldManager.visualizers.indexOf(this.draggingField);
        } else if (this.activeForceFieldType) {
            // Clicked in empty space, create a new force field
            
            // Get intersection with a plane at z=0
            const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
            const intersection = new THREE.Vector3();
            raycaster.ray.intersectPlane(planeZ, intersection);
            
            // If no intersection with z-plane, try a ray into the scene
            if (!intersection.x && !intersection.y && !intersection.z) {
                // Default distance
                intersection.copy(raycaster.ray.direction).multiplyScalar(20).add(raycaster.ray.origin);
            }
            
            // Create force field
            let fieldIndex;
            switch (this.activeForceFieldType) {
                case 'gravitational':
                    fieldIndex = this.simulationManager.addGravitationalField(intersection, 10, 10);
                    break;
                    
                case 'vortex':
                    fieldIndex = this.simulationManager.addVortexField(intersection, 5, 8);
                    break;
                    
                case 'magnetic':
                    fieldIndex = this.simulationManager.addMagneticField(intersection, 8, 12);
                    break;
                    
                case 'custom':
                    fieldIndex = this.simulationManager.addCustomField(intersection, 3, 6);
                    break;
            }
            
            // Add to force field list
            this.addForceFieldToList(fieldIndex, this.activeForceFieldType);
            
            // Clear active force field type
            this.activeForceFieldType = null;
        }
    }
    
    handleMouseMove(event) {
        if (!this.isDragging || !this.draggingField) return;
        
        event.preventDefault();
        
        // Get normalized device coordinates
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Raycasting
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        
        // Get intersection with a plane at z=0
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersection = new THREE.Vector3();
        raycaster.ray.intersectPlane(planeZ, intersection);
        
        // If no intersection with z-plane, try a ray into the scene
        if (!intersection.x && !intersection.y && !intersection.z) {
            // Default distance
            intersection.copy(raycaster.ray.direction).multiplyScalar(20).add(raycaster.ray.origin);
        }
        
        // Update force field position
        this.draggingField.position.copy(intersection);
        
        // Update force field in the manager
        this.simulationManager.forceFieldManager.updateFieldPosition(this.draggingFieldIndex, intersection);
    }
    
    handleMouseUp(event) {
        this.isDragging = false;
        this.draggingField = null;
        this.draggingFieldIndex = -1;
    }
    
    handleRightClick(event) {
        event.preventDefault();
        
        // Get normalized device coordinates
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Raycasting
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        
        // Check for intersection with force fields
        const intersects = raycaster.intersectObjects(
            this.simulationManager.forceFieldManager.visualizers.filter(v => v !== null)
        );
        
        if (intersects.length > 0) {
            // Clicked on a force field, remove it
            const fieldIndex = this.simulationManager.forceFieldManager.visualizers.indexOf(intersects[0].object);
            this.simulationManager.removeForceField(fieldIndex);
            
            // Remove from force field list
            this.removeForceFieldFromList(fieldIndex);
            
            this.showToast('Force field removed');
        }
    }
    
    handleResize() {
        // Update UI to match new window size
        // This is handled automatically by THREE.js for the renderer and camera
    }
    
    addForceFieldToList(index, type) {
        const forceFieldList = this.controlPanels.main.querySelector('#force-field-list');
        
        const fieldItem = document.createElement('div');
        fieldItem.className = 'force-field-item';
        fieldItem.setAttribute('data-index', index);
        
        // Get field color based on type
        let color;
        switch (type) {
            case 'gravitational':
                color = '#62AADC';
                break;
            case 'vortex':
                color = '#DC62AA';
                break;
            case 'magnetic':
                color = '#AADC62';
                break;
            case 'custom':
                color = '#DCA62A';
                break;
            default:
                color = '#FFFFFF';
        }
        
        fieldItem.innerHTML = `
            <div class="force-field-icon" style="background-color: ${color}"></div>
            <div class="force-field-name">${type.charAt(0).toUpperCase() + type.slice(1)} Field</div>
            <button class="remove-force-field-button">×</button>
        `;
        
        forceFieldList.appendChild(fieldItem);
        
        // Add event listener for remove button
        const removeButton = fieldItem.querySelector('.remove-force-field-button');
        removeButton.addEventListener('click', () => {
            this.simulationManager.removeForceField(index);
            this.removeForceFieldFromList(index);
        });
    }
    
    removeForceFieldFromList(index) {
        const forceFieldList = this.controlPanels.main.querySelector('#force-field-list');
        const fieldItem = forceFieldList.querySelector(`.force-field-item[data-index="${index}"]`);
        
        if (fieldItem) {
            forceFieldList.removeChild(fieldItem);
        }
        
        // Update indices of remaining items
        const items = forceFieldList.querySelectorAll('.force-field-item');
        items.forEach(item => {
            const itemIndex = parseInt(item.getAttribute('data-index'));
            if (itemIndex > index) {
                item.setAttribute('data-index', itemIndex - 1);
            }
        });
    }
    
    update() {
        // Update UI elements that need regular updates
        
        // Update simulation stats if enabled
        if (this.statsPanel) {
            this.statsPanel.update();
        }
    }
    
    // Add CSS styles to the document
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Control Panel Styles */
            .control-panel {
                position: absolute;
                top: 20px;
                left: 20px;
                width: 300px;
                background: rgba(20, 20, 30, 0.8);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(70, 130, 180, 0.5);
                border-radius: 8px;
                color: white;
                font-family: 'JetBrains Mono', monospace;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                overflow: hidden;
                z-index: 1000;
            }
            
            .control-panel.minimized {
                height: 40px;
                overflow: hidden;
            }
            
            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: rgba(30, 30, 45, 0.9);
                border-bottom: 1px solid rgba(70, 130, 180, 0.5);
            }
            
            .panel-header h2 {
                margin: 0;
                font-size: 16px;
                font-weight: 500;
            }
            
            .minimize-button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                width: 24px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
            }
            
            .minimize-button:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .panel-tabs {
                display: flex;
                border-bottom: 1px solid rgba(70, 130, 180, 0.5);
            }
            
            .tab-button {
                flex: 1;
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                padding: 8px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .tab-button:hover {
                background: rgba(255, 255, 255, 0.05);
                color: white;
            }
            
            .tab-button.active {
                background: rgba(70, 130, 180, 0.3);
                color: white;
                border-bottom: 2px solid #62AADC;
            }
            
            .panel-content {
                padding: 15px;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .control-group {
                margin-bottom: 15px;
            }
            
            .control-group label {
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .slider-container {
                display: flex;
                align-items: center;
            }
            
            .slider-container input[type="range"] {
                flex: 1;
                height: 4px;
                appearance: none;
                background: rgba(70, 130, 180, 0.3);
                border-radius: 2px;
                margin-right: 10px;
            }
            
            .slider-container input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 12px;
                height: 12px;
                background: #62AADC;
                border-radius: 50%;
                cursor: pointer;
            }
            
            .slider-value {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                width: 60px;
                text-align: right;
            }
            
            input[type="color"] {
                width: 100%;
                height: 30px;
                background: none;
                border: 1px solid rgba(70, 130, 180, 0.5);
                border-radius: 4px;
                cursor: pointer;
            }
            
            .checkbox-row {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .checkbox-row label {
                display: flex;
                align-items: center;
                font-size: 12px;
                cursor: pointer;
            }
            
            .checkbox-row input[type="checkbox"] {
                margin-right: 5px;
            }
            
            .button-row {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            
            .action-button {
                flex: 1;
                background: rgba(70, 130, 180, 0.5);
                border: none;
                color: white;
                padding: 8px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .action-button:hover {
                background: rgba(70, 130, 180, 0.7);
            }
            
            .action-button.danger {
                background: rgba(180, 70, 70, 0.5);
            }
            
            .action-button.danger:hover {
                background: rgba(180, 70, 70, 0.7);
            }
            
            select {
                width: 100%;
                padding: 8px;
                background: rgba(30, 30, 45, 0.9);
                border: 1px solid rgba(70, 130, 180, 0.5);
                border-radius: 4px;
                color: white;
                font-size: 12px;
                margin-bottom: 10px;
            }
            
            /* Force Field List */
            .force-field-list {
                max-height: 200px;
                overflow-y: auto;
                margin-top: 10px;
                border: 1px solid rgba(70, 130, 180, 0.3);
                border-radius: 4px;
                padding: 5px;
            }
            
            .force-field-item {
                display: flex;
                align-items: center;
                padding: 5px;
                border-radius: 4px;
                margin-bottom: 5px;
                background: rgba(30, 30, 45, 0.6);
            }
            
            .force-field-icon {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .force-field-name {
                flex: 1;
                font-size: 12px;
            }
            
            .remove-force-field-button {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                cursor: pointer;
                font-size: 14px;
                width: 20px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
            }
            
            .remove-force-field-button:hover {
                background: rgba(180, 70, 70, 0.5);
                color: white;
            }
            
            /* Simulation Controls */
            .simulation-controls {
                border-bottom: 1px solid rgba(70, 130, 180, 0.3);
                padding-bottom: 10px;
                margin-bottom: 10px;
            }
            
            /* Help Overlay */
            .help-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                backdrop-filter: blur(5px);
            }
            
            .help-overlay.hidden {
                display: none;
            }
            
            .help-content {
                width: 600px;
                max-width: 90%;
                max-height: 80vh;
                background: rgba(20, 20, 30, 0.95);
                border: 1px solid rgba(70, 130, 180, 0.5);
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }
            
            .help-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                background: rgba(30, 30, 45, 0.9);
                border-bottom: 1px solid rgba(70, 130, 180, 0.5);
            }
            
            .help-header h2 {
                margin: 0;
                font-size: 18px;
            }
            
            .close-button {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
            }
            
            .close-button:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .help-body {
                padding: 15px;
                overflow-y: auto;
                max-height: calc(80vh - 60px);
            }
            
            .help-body h3 {
                font-size: 16px;
                margin: 15px 0 10px;
                color: #62AADC;
            }
            
            .help-body ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .help-body li {
                margin-bottom: 5px;
                font-size: 14px;
            }
            
            .help-body p {
                font-size: 14px;
                line-height: 1.5;
            }
            
            /* Toast Notification */
            .toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(30, 30, 45, 0.9);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                border-left: 4px solid #62AADC;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 1500;
                transition: all 0.3s ease;
            }
            
            .toast.hidden {
                opacity: 0;
                transform: translate(-50%, 20px);
                pointer-events: none;
            }
            
            /* dat.GUI customization */
            .dat-gui-container {
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .dat-gui-container.hidden {
                display: none;
            }
            
            /* General Utility Classes */
            .hidden {
                display: none !important;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    initialize() {
        // Add CSS styles
        this.addStyles();
        
        // Initialize UI
        this.showToast('UI initialized successfully', 2000);
    }
}