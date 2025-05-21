import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'stats.js';
import * as dat from 'dat.gui';
import { gsap } from 'gsap';

// Import core modules
import { ParticleSystem } from './simulation/ParticleSystem';
import { UIManager } from './components/UIManager';
import { AIInterface } from './ai/AIInterface';
import { StateManager } from './sync/StateManager';

class AionProtocol {
    constructor() {
        this.initializeScene();
        this.initializeStats();
        this.initializeGUI();
        
        // Initialize core systems
        this.particleSystem = new ParticleSystem(this.scene, this.renderer);
        this.uiManager = new UIManager();
        this.aiInterface = new AIInterface();
        this.stateManager = new StateManager(this.particleSystem, this.aiInterface);
        
        // Start animation loop
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
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
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // Add orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
    }
    
    initializeStats() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }
    
    initializeGUI() {
        this.gui = new dat.GUI();
        this.gui.close(); // Start with closed GUI
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
        if (this.particleSystem) this.particleSystem.update();
        if (this.controls) this.controls.update();
        
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
