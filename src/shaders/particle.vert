// particle.vert - Vertex shader for rendering particles
// This shader positions and sizes particles based on their computed positions

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float particleSize;
uniform float time;

attribute vec2 reference;

varying vec3 vColor;
varying float vSpeed;

void main() {
    // Get position and velocity from textures
    vec4 posTemp = texture2D(texturePosition, reference);
    vec4 velTemp = texture2D(textureVelocity, reference);
    
    // Calculate particle color based on velocity
    float speed = length(velTemp.xyz);
    vSpeed = speed;
    
    // Set position
    vec4 mvPosition = modelViewMatrix * vec4(posTemp.xyz, 1.0);
    
    // Calculate point size based on camera distance and particle size
    gl_PointSize = particleSize * (300.0 / -mvPosition.z);
    
    // Set position
    gl_Position = projectionMatrix * mvPosition;
}
