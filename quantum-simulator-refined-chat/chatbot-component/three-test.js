/**
 * Three.js Test Script
 * Tests that Three.js is loaded properly and can create a basic scene
 */

function testThreeJs() {
  try {
    if (typeof THREE === 'undefined') {
      console.error('THREE is not defined - library failed to load');
      return false;
    }
    
    // Create a simple test scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Try to create a renderer (this would fail if WebGL is not supported)
    const testRenderer = new THREE.WebGLRenderer({antialias: true});
    
    // Create a simple mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    
    // Try to add to scene
    scene.add(cube);
    
    console.log('Three.js test passed successfully');
    return true;
  } catch (error) {
    console.error('Three.js test failed:', error);
    return false;
  }
}

// Run test when window loads
window.addEventListener('load', function() {
  setTimeout(function() {
    const result = testThreeJs();
    if (!result) {
      // Display error in UI
      const loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen) {
        loadingScreen.innerHTML = '<div style="color: #ff5555; padding: 20px; max-width: 80%; text-align: center;">' +
          '<h3>Three.js Error</h3>' +
          '<p>Failed to initialize Three.js. This app requires WebGL support.</p>' +
          '<p>Try using a different browser or updating your graphics drivers.</p>' +
          '<button onclick="location.reload()">Reload</button>' +
          '</div>';
      }
    }
  }, 1000); // Wait 1 second to ensure Three.js has loaded
});