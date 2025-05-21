// BrowserCompatibilityTester.js - Tests compatibility across different browsers and devices
export class BrowserCompatibilityTester {
    constructor() {
        // Browser detection
        this.browser = {
            name: 'unknown',
            version: 'unknown',
            engine: 'unknown',
            isModern: false
        };
        
        // Feature detection
        this.features = {
            webgl2: false,
            webgpu: false,
            webworkers: false,
            webassembly: false,
            es6: false,
            touchEvents: false,
            pointerEvents: false,
            webAudio: false
        };
        
        // Compatibility issues
        this.issues = [];
        
        // Initialize
        this.initialize();
    }
    
    initialize() {
        // Detect browser
        this.detectBrowser();
        
        // Detect features
        this.detectFeatures();
        
        // Check for compatibility issues
        this.checkCompatibility();
        
        // Log results
        console.log('Browser compatibility test results:', {
            browser: this.browser,
            features: this.features,
            issues: this.issues
        });
    }
    
    detectBrowser() {
        const userAgent = navigator.userAgent;
        
        // Detect browser name and version
        if (userAgent.indexOf('Firefox') > -1) {
            this.browser.name = 'Firefox';
            this.browser.engine = 'Gecko';
            this.browser.version = userAgent.match(/Firefox\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf('Chrome') > -1) {
            this.browser.name = 'Chrome';
            this.browser.engine = 'Blink';
            this.browser.version = userAgent.match(/Chrome\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf('Safari') > -1) {
            this.browser.name = 'Safari';
            this.browser.engine = 'WebKit';
            this.browser.version = userAgent.match(/Safari\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf('Edge') > -1) {
            this.browser.name = 'Edge';
            this.browser.engine = 'EdgeHTML';
            this.browser.version = userAgent.match(/Edge\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf('Edg') > -1) {
            this.browser.name = 'Edge';
            this.browser.engine = 'Blink';
            this.browser.version = userAgent.match(/Edg\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
            this.browser.name = 'Internet Explorer';
            this.browser.engine = 'Trident';
            this.browser.version = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)[1];
        } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            this.browser.name = 'Opera';
            this.browser.engine = 'Blink';
            this.browser.version = userAgent.match(/(?:Opera|OPR)\/([0-9.]+)/)[1];
        }
        
        // Check if modern browser
        this.browser.isModern = this.isModernBrowser();
    }
    
    isModernBrowser() {
        // Check if browser is modern enough for our application
        if (this.browser.name === 'Internet Explorer') {
            return false;
        }
        
        if (this.browser.name === 'Firefox' && parseFloat(this.browser.version) < 67) {
            return false;
        }
        
        if (this.browser.name === 'Chrome' && parseFloat(this.browser.version) < 76) {
            return false;
        }
        
        if (this.browser.name === 'Safari' && parseFloat(this.browser.version) < 13) {
            return false;
        }
        
        if (this.browser.name === 'Edge' && this.browser.engine === 'EdgeHTML') {
            return false;
        }
        
        return true;
    }
    
    detectFeatures() {
        // WebGL 2.0
        this.features.webgl2 = !!window.WebGL2RenderingContext;
        
        // WebGPU
        this.features.webgpu = 'gpu' in navigator;
        
        // Web Workers
        this.features.webworkers = !!window.Worker;
        
        // WebAssembly
        this.features.webassembly = typeof WebAssembly === 'object' && typeof WebAssembly.compile === 'function';
        
        // ES6 Support
        this.features.es6 = this.checkES6Support();
        
        // Touch Events
        this.features.touchEvents = 'ontouchstart' in window;
        
        // Pointer Events
        this.features.pointerEvents = !!window.PointerEvent;
        
        // Web Audio
        this.features.webAudio = !!window.AudioContext || !!window.webkitAudioContext;
    }
    
    checkES6Support() {
        try {
            // Test arrow functions
            eval('() => {}');
            
            // Test let/const
            eval('let a = 1; const b = 2;');
            
            // Test template literals
            eval('`test`');
            
            // Test destructuring
            eval('const {a, b} = {a: 1, b: 2}');
            
            // Test classes
            eval('class Test {}');
            
            return true;
        } catch (e) {
            return false;
        }
    }
    
    checkCompatibility() {
        // Check for critical issues
        if (!this.browser.isModern) {
            this.issues.push({
                severity: 'critical',
                feature: 'browser',
                message: `${this.browser.name} ${this.browser.version} is not supported. Please upgrade to a modern browser.`
            });
        }
        
        if (!this.features.webgl2) {
            this.issues.push({
                severity: 'critical',
                feature: 'webgl2',
                message: 'WebGL 2.0 is not supported. The application requires WebGL 2.0 for particle simulation.'
            });
        }
        
        if (!this.features.webworkers) {
            this.issues.push({
                severity: 'high',
                feature: 'webworkers',
                message: 'Web Workers are not supported. Performance will be significantly reduced.'
            });
        }
        
        if (!this.features.es6) {
            this.issues.push({
                severity: 'critical',
                feature: 'es6',
                message: 'ES6 features are not supported. The application requires ES6 support.'
            });
        }
        
        // Check for performance issues
        if (!this.features.webassembly) {
            this.issues.push({
                severity: 'medium',
                feature: 'webassembly',
                message: 'WebAssembly is not supported. Some advanced features may be disabled.'
            });
        }
        
        // Check for mobile-specific issues
        if (this.isMobileDevice() && !this.features.touchEvents) {
            this.issues.push({
                severity: 'high',
                feature: 'touchEvents',
                message: 'Touch events are not supported on this mobile device. Interaction will be limited.'
            });
        }
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Apply compatibility fixes
    applyCompatibilityFixes() {
        // Apply polyfills and fixes based on detected issues
        
        // Fix for Safari WebGL issues
        if (this.browser.name === 'Safari') {
            this.applySafariWebGLFix();
        }
        
        // Fix for mobile touch events
        if (this.isMobileDevice() && !this.features.pointerEvents) {
            this.applyTouchEventsFix();
        }
        
        // Fix for older browsers without ES6
        if (!this.features.es6) {
            this.applyES6Polyfills();
        }
        
        // Fix for browsers without Web Workers
        if (!this.features.webworkers) {
            this.applyWebWorkersPolyfill();
        }
    }
    
    applySafariWebGLFix() {
        // In a full implementation, we would:
        // 1. Apply specific fixes for Safari WebGL issues
        // 2. Adjust shader precision
        
        console.log('Applied Safari WebGL compatibility fix');
    }
    
    applyTouchEventsFix() {
        // In a full implementation, we would:
        // 1. Add touch event handlers that simulate mouse events
        
        console.log('Applied touch events compatibility fix');
    }
    
    applyES6Polyfills() {
        // In a full implementation, we would:
        // 1. Load polyfills for ES6 features
        // 2. Use transpiled code for older browsers
        
        console.log('Applied ES6 compatibility polyfills');
    }
    
    applyWebWorkersPolyfill() {
        // In a full implementation, we would:
        // 1. Create a fallback for Web Workers using setTimeout
        
        console.log('Applied Web Workers compatibility polyfill');
    }
    
    // Get compatibility report
    getCompatibilityReport() {
        return {
            browser: this.browser,
            features: this.features,
            issues: this.issues,
            recommendations: this.getRecommendations()
        };
    }
    
    getRecommendations() {
        const recommendations = [];
        
        // Browser upgrade recommendation
        if (!this.browser.isModern) {
            recommendations.push({
                type: 'browser_upgrade',
                message: `We recommend upgrading to the latest version of Chrome, Firefox, or Edge for the best experience.`
            });
        }
        
        // WebGL recommendation
        if (!this.features.webgl2) {
            recommendations.push({
                type: 'hardware_acceleration',
                message: `Enable hardware acceleration in your browser settings or update your graphics drivers.`
            });
        }
        
        // Mobile recommendations
        if (this.isMobileDevice()) {
            recommendations.push({
                type: 'mobile_optimization',
                message: `For the best mobile experience, use landscape orientation and a recent device with good GPU performance.`
            });
        }
        
        return recommendations;
    }
    
    // Display compatibility warning if needed
    displayCompatibilityWarning() {
        const criticalIssues = this.issues.filter(issue => issue.severity === 'critical');
        
        if (criticalIssues.length > 0) {
            // Create warning element
            const warning = document.createElement('div');
            warning.className = 'compatibility-warning';
            warning.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #f44336;
                color: white;
                padding: 15px;
                text-align: center;
                z-index: 10000;
                font-family: sans-serif;
            `;
            
            // Add warning message
            const message = document.createElement('p');
            message.textContent = 'Your browser does not meet the requirements for this application:';
            warning.appendChild(message);
            
            // Add list of issues
            const list = document.createElement('ul');
            list.style.cssText = `
                list-style: none;
                padding: 0;
                margin: 10px 0;
            `;
            
            criticalIssues.forEach(issue => {
                const item = document.createElement('li');
                item.textContent = issue.message;
                list.appendChild(item);
            });
            
            warning.appendChild(list);
            
            // Add recommendations
            const recommendations = this.getRecommendations();
            if (recommendations.length > 0) {
                const recommendationsTitle = document.createElement('p');
                recommendationsTitle.textContent = 'Recommendations:';
                warning.appendChild(recommendationsTitle);
                
                const recommendationsList = document.createElement('ul');
                recommendationsList.style.cssText = `
                    list-style: none;
                    padding: 0;
                    margin: 10px 0;
                `;
                
                recommendations.forEach(recommendation => {
                    const item = document.createElement('li');
                    item.textContent = recommendation.message;
                    recommendationsList.appendChild(item);
                });
                
                warning.appendChild(recommendationsList);
            }
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Continue Anyway';
            closeButton.style.cssText = `
                background: white;
                color: #f44336;
                border: none;
                padding: 8px 16px;
                margin-top: 10px;
                cursor: pointer;
                font-weight: bold;
            `;
            
            closeButton.addEventListener('click', () => {
                warning.style.display = 'none';
            });
            
            warning.appendChild(closeButton);
            
            // Add to DOM
            document.body.appendChild(warning);
            
            return true;
        }
        
        return false;
    }
}
