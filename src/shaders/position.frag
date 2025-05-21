// position.frag - Fragment shader for updating particle positions
// This shader updates the position of each particle based on its velocity

uniform float time;
uniform float delta;

void main() {
    // Get current position and velocity
    vec4 position = texture2D(texturePosition, gl_FragCoord.xy / resolution.xy);
    vec4 velocity = texture2D(textureVelocity, gl_FragCoord.xy / resolution.xy);
    
    // Update position based on velocity and delta time
    position.xyz += velocity.xyz * delta;
    
    // Output updated position
    gl_FragColor = position;
}
