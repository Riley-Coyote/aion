import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';

// Import core modules
import { ParticleSystem } from './simulation/ParticleSystem';
import { ForceFieldManager } from './simulation/ForceFieldManager';
import { FluidDynamics } from './simulation/FluidDynamics';
import { CollisionSystem } from './simulation/CollisionSystem';
import { ConstraintSystem } from './simulation/ConstraintSystem';
import { SimulationManager } from './simulation/SimulationManager';
import { UIManager } from './components/UIManager';
import { AIInterface } from './ai/AIInterface';
import { StateManager } from './sync/StateManager';

class AionProtocol {
    constructor() {
        this.initializeScene();
        this.initializeStats();
        this.initializeDOMStructure();
        
        // Initialize core systems
        this.particleSystem = new ParticleSystem(this.scene, this.renderer);
        
        // Initialize subsystems
        this.forceFieldManager = new ForceFieldManager(this.particleSystem);
        this.fluidDynamics = new FluidDynamics(this.particleSystem);
        this.collisionSystem = new CollisionSystem(this.particleSystem);
        this.constraintSystem = new ConstraintSystem(this.particleSystem);
        
        // Initialize simulation manager
        this.simulationManager = new SimulationManager(
            this.scene, 
            this.renderer,
            this.particleSystem,
            this.forceFieldManager,
            this.fluidDynamics,
            this.collisionSystem,
            this.constraintSystem
        );
        
        // Initialize AI interface
        this.aiInterface = new AIInterface(this.simulationManager);
        
        // Initialize UI manager (after all systems are ready)
        this.uiManager = new UIManager(this.simulationManager, this.aiInterface);
        this.uiManager.initialize();
        
        // Initialize state manager
        this.stateManager = new StateManager(this.simulationManager, this.aiInterface);
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    
    initializeDOMStructure() {
        // Create required DOM containers if they don't exist
        if (!document.getElementById('canvas-container')) {
            const canvasContainer = document.createElement('div');
            canvasContainer.id = 'canvas-container';
            document.body.appendChild(canvasContainer);
        }
        
        if (!document.getElementById('ui-container')) {
            const uiContainer = document.createElement('div');
            uiContainer.id = 'ui-container';
            document.body.appendChild(uiContainer);
        }
    }
    
    initializeScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0c0c10);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 50;
        
        // Create renderer with better defaults
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add a light to the scene
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);
        
        // Initialize DOM structure before appending renderer
        this.initializeDOMStructure();
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Add orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 150;
        this.controls.maxPolarAngle = Math.PI / 1.5;
    }
    
    initializeStats() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.left = 'auto';
        this.stats.dom.style.right = '0px';
        this.stats.dom.style.top = 'auto';
        this.stats.dom.style.bottom = '0px';
        document.body.appendChild(this.stats.dom);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.stats.begin();
        
        // Update systems
        if (this.simulationManager) this.simulationManager.update(0.016); // Approximate time step
        if (this.controls) this.controls.update();
        if (this.uiManager) this.uiManager.update();
        
        // Render
        this.renderer.render(this.scene, this.camera);
        
        this.stats.end();
    }
}

// Initialize application when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const app = new AionProtocol();
});

export default AionProtocol;
