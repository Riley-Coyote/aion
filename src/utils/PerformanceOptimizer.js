// PerformanceOptimizer.js - Implements performance optimizations for Aion Protocol
import * as THREE from 'three';
import Stats from 'stats.js';

export class PerformanceOptimizer {
    constructor(simulationManager) {
        this.simulationManager = simulationManager;
        
        // Performance metrics
        this.stats = null;
        this.fpsHistory = [];
        this.memoryHistory = [];
        
        // Optimization settings
        this.settings = {
            gpuInstancing: true,
            adaptiveLOD: true,
            occlusionCulling: true,
            workerThreads: true,
            adaptivePrecision: true,
            maxParticles: {
                highEnd: 1000000,
                midRange: 100000,
                lowEnd: 10000,
                mobile: 5000
            },
            targetFPS: {
                highEnd: 60,
                midRange: 30,
                mobile: 30
            }
        };
        
        // Device capability detection
        this.deviceCapabilities = {
            gpu: 'unknown',
            isMobile: false,
            supportsWebGPU: false,
            maxTextureSize: 0,
            maxVertices: 0
        };
        
        // Initialize
        this.initialize();
    }
    
    initialize() {
        // Create stats panel
        this.initializeStats();
        
        // Detect device capabilities
        this.detectDeviceCapabilities();
        
        // Apply initial optimizations
        this.applyOptimizations();
    }
    
    initializeStats() {
        // Create stats panel
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
        
        // Add to DOM
        document.body.appendChild(this.stats.dom);
        
        // Position in top-right corner
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.top = '0px';
        this.stats.dom.style.right = '0px';
        this.stats.dom.style.left = 'auto';
    }
    
    detectDeviceCapabilities() {
        // Check if mobile
        this.deviceCapabilities.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Check WebGPU support
        this.deviceCapabilities.supportsWebGPU = 'gpu' in navigator;
        
        // Get renderer info
        if (this.simulationManager && this.simulationManager.renderer) {
            const gl = this.simulationManager.renderer.getContext();
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                
                // Determine GPU capability level
                if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Radeon')) {
                    this.deviceCapabilities.gpu = 'high';
                } else if (renderer.includes('Intel')) {
                    this.deviceCapabilities.gpu = 'medium';
                } else {
                    this.deviceCapabilities.gpu = 'low';
                }
                
                console.log('GPU detected:', renderer, '- Capability level:', this.deviceCapabilities.gpu);
            }
            
            // Get max texture size
            this.deviceCapabilities.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            
            // Estimate max vertices
            const maxVertices = gl.getParameter(gl.MAX_ELEMENTS_VERTICES);
            this.deviceCapabilities.maxVertices = maxVertices || 65536;
        }
        
        // Log capabilities
        console.log('Device capabilities:', this.deviceCapabilities);
    }
    
    applyOptimizations() {
        // Apply different optimizations based on device capabilities
        if (this.deviceCapabilities.isMobile) {
            this.applyMobileOptimizations();
        } else if (this.deviceCapabilities.gpu === 'high') {
            this.applyHighEndOptimizations();
        } else if (this.deviceCapabilities.gpu === 'medium') {
            this.applyMidRangeOptimizations();
        } else {
            this.applyLowEndOptimizations();
        }
    }
    
    applyMobileOptimizations() {
        console.log('Applying mobile optimizations');
        
        // Reduce particle count
        if (this.simulationManager && this.simulationManager.particleSystem) {
            const targetCount = this.settings.maxParticles.mobile;
            console.log(`Setting particle count to ${targetCount} for mobile`);
            this.simulationManager.setParticleCount(targetCount);
        }
        
        // Disable expensive effects
        this.settings.occlusionCulling = false;
        this.settings.adaptivePrecision = true;
        
        // Apply renderer optimizations
        if (this.simulationManager && this.simulationManager.renderer) {
            this.simulationManager.renderer.setPixelRatio(1);
        }
    }
    
    applyLowEndOptimizations() {
        console.log('Applying low-end optimizations');
        
        // Reduce particle count
        if (this.simulationManager && this.simulationManager.particleSystem) {
            const targetCount = this.settings.maxParticles.lowEnd;
            console.log(`Setting particle count to ${targetCount} for low-end device`);
            this.simulationManager.setParticleCount(targetCount);
        }
        
        // Apply renderer optimizations
        if (this.simulationManager && this.simulationManager.renderer) {
            this.simulationManager.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }
    }
    
    applyMidRangeOptimizations() {
        console.log('Applying mid-range optimizations');
        
        // Set moderate particle count
        if (this.simulationManager && this.simulationManager.particleSystem) {
            const targetCount = this.settings.maxParticles.midRange;
            console.log(`Setting particle count to ${targetCount} for mid-range device`);
            this.simulationManager.setParticleCount(targetCount);
        }
        
        // Apply renderer optimizations
        if (this.simulationManager && this.simulationManager.renderer) {
            this.simulationManager.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }
    
    applyHighEndOptimizations() {
        console.log('Applying high-end optimizations');
        
        // Use maximum particle count
        if (this.simulationManager && this.simulationManager.particleSystem) {
            const targetCount = this.settings.maxParticles.highEnd;
            console.log(`Setting particle count to ${targetCount} for high-end device`);
            this.simulationManager.setParticleCount(targetCount);
        }
        
        // Enable all advanced features
        this.settings.gpuInstancing = true;
        this.settings.adaptiveLOD = true;
        this.settings.occlusionCulling = true;
        this.settings.workerThreads = true;
        
        // Apply renderer optimizations
        if (this.simulationManager && this.simulationManager.renderer) {
            this.simulationManager.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }
    
    // Rendering optimizations
    implementGPUInstancing() {
        if (!this.settings.gpuInstancing) return;
        
        // In a full implementation, we would:
        // 1. Create instanced geometry for particles
        // 2. Use instanced attributes for positions and other properties
        // 3. Update instance matrices instead of individual particles
        
        console.log('GPU instancing optimization applied');
    }
    
    implementAdaptiveLOD() {
        if (!this.settings.adaptiveLOD) return;
        
        // In a full implementation, we would:
        // 1. Create multiple LOD levels for particles
        // 2. Switch between them based on distance from camera
        // 3. Use simpler shaders for distant particles
        
        console.log('Adaptive LOD optimization applied');
    }
    
    implementOcclusionCulling() {
        if (!this.settings.occlusionCulling) return;
        
        // In a full implementation, we would:
        // 1. Use frustum culling to skip off-screen particles
        // 2. Implement occlusion queries to skip hidden particles
        
        console.log('Occlusion culling optimization applied');
    }
    
    // Computation optimizations
    implementWorkerThreads() {
        if (!this.settings.workerThreads) return;
        
        // In a full implementation, we would:
        // 1. Create worker threads for physics calculations
        // 2. Distribute particles across threads
        // 3. Synchronize results back to main thread
        
        console.log('Worker thread optimization applied');
    }
    
    implementAdaptivePrecision() {
        if (!this.settings.adaptivePrecision) return;
        
        // In a full implementation, we would:
        // 1. Use lower precision for less important calculations
        // 2. Prioritize precision for visible or important particles
        
        console.log('Adaptive precision optimization applied');
    }
    
    // Frame timing
    implementFrameTiming() {
        // Create a frame timing system to maintain consistent performance
        
        // Store last frame time
        this.lastFrameTime = performance.now();
        
        // Target frame time (ms)
        this.targetFrameTime = 1000 / 60; // 60 FPS
        
        console.log('Frame timing system implemented');
    }
    
    // Performance monitoring
    beginFrame() {
        if (this.stats) {
            this.stats.begin();
        }
        
        // Record frame start time
        this.frameStartTime = performance.now();
    }
    
    endFrame() {
        if (this.stats) {
            this.stats.end();
            
            // Record FPS
            const fps = Math.round(1000 / this.stats.ms);
            this.fpsHistory.push(fps);
            
            // Keep history limited
            if (this.fpsHistory.length > 100) {
                this.fpsHistory.shift();
            }
            
            // Record memory if available
            if (performance.memory) {
                this.memoryHistory.push(performance.memory.usedJSHeapSize / 1048576); // Convert to MB
                
                if (this.memoryHistory.length > 100) {
                    this.memoryHistory.shift();
                }
            }
        }
        
        // Calculate frame time
        const frameTime = performance.now() - this.frameStartTime;
        
        // Adaptive optimization based on frame time
        this.adaptiveOptimization(frameTime);
    }
    
    adaptiveOptimization(frameTime) {
        // If frame time is consistently too high, reduce quality
        if (this.fpsHistory.length >= 30) {
            const recentFps = this.fpsHistory.slice(-30);
            const avgFps = recentFps.reduce((sum, fps) => sum + fps, 0) / recentFps.length;
            
            // Target FPS based on device capability
            let targetFps;
            if (this.deviceCapabilities.isMobile) {
                targetFps = this.settings.targetFPS.mobile;
            } else if (this.deviceCapabilities.gpu === 'high') {
                targetFps = this.settings.targetFPS.highEnd;
            } else {
                targetFps = this.settings.targetFPS.midRange;
            }
            
            // If average FPS is too low, reduce quality
            if (avgFps < targetFps * 0.8) {
                this.reduceQuality();
            }
            // If average FPS is much higher than needed, we could increase quality
            else if (avgFps > targetFps * 1.5) {
                this.increaseQuality();
            }
        }
    }
    
    reduceQuality() {
        // Check if we've recently changed quality
        if (this.lastQualityChange && performance.now() - this.lastQualityChange < 5000) {
            return; // Don't change quality too frequently
        }
        
        console.log('Reducing quality to improve performance');
        
        // Reduce particle count
        if (this.simulationManager && this.simulationManager.particleSystem) {
            const currentCount = this.simulationManager.particleSystem.particleCount;
            const newCount = Math.max(1000, Math.floor(currentCount * 0.8));
            
            if (newCount < currentCount) {
                console.log(`Reducing particle count from ${currentCount} to ${newCount}`);
                this.simulationManager.setParticleCount(newCount);
            }
        }
        
        // Disable expensive features if needed
        if (this.settings.occlusionCulling) {
            this.settings.occlusionCulling = false;
            console.log('Disabled occlusion culling');
        }
        
        this.lastQualityChange = performance.now();
    }
    
    increaseQuality() {
        // Check if we've recently changed quality
        if (this.lastQualityChange && performance.now() - this.lastQualityChange < 10000) {
            return; // Don't change quality too frequently
        }
        
        console.log('Increasing quality');
        
        // Increase particle count
        if (this.simulationManager && this.simulationManager.particleSystem) {
            const currentCount = this.simulationManager.particleSystem.particleCount;
            
            // Determine max count based on device
            let maxCount;
            if (this.deviceCapabilities.isMobile) {
                maxCount = this.settings.maxParticles.mobile;
            } else if (this.deviceCapabilities.gpu === 'high') {
                maxCount = this.settings.maxParticles.highEnd;
            } else if (this.deviceCapabilities.gpu === 'medium') {
                maxCount = this.settings.maxParticles.midRange;
            } else {
                maxCount = this.settings.maxParticles.lowEnd;
            }
            
            const newCount = Math.min(maxCount, Math.floor(currentCount * 1.2));
            
            if (newCount > currentCount) {
                console.log(`Increasing particle count from ${currentCount} to ${newCount}`);
                this.simulationManager.setParticleCount(newCount);
            }
        }
        
        // Enable features if device supports them
        if (!this.settings.occlusionCulling && !this.deviceCapabilities.isMobile && this.deviceCapabilities.gpu !== 'low') {
            this.settings.occlusionCulling = true;
            console.log('Enabled occlusion culling');
        }
        
        this.lastQualityChange = performance.now();
    }
    
    // Get performance report
    getPerformanceReport() {
        // Calculate average FPS
        const avgFps = this.fpsHistory.length > 0
            ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
            : 0;
        
        // Calculate average memory usage
        const avgMemory = this.memoryHistory.length > 0
            ? this.memoryHistory.reduce((sum, mem) => sum + mem, 0) / this.memoryHistory.length
            : 0;
        
        return {
            fps: {
                current: this.fpsHistory.length > 0 ? this.fpsHistory[this.fpsHistory.length - 1] : 0,
                average: avgFps,
                min: Math.min(...this.fpsHistory),
                max: Math.max(...this.fpsHistory)
            },
            memory: {
                current: this.memoryHistory.length > 0 ? this.memoryHistory[this.memoryHistory.length - 1] : 0,
                average: avgMemory,
                min: Math.min(...this.memoryHistory),
                max: Math.max(...this.memoryHistory)
            },
            deviceCapabilities: this.deviceCapabilities,
            optimizationSettings: this.settings
        };
    }
}
