// particle.frag - Fragment shader for rendering particles
// This shader determines the color and appearance of each particle

uniform vec3 color;
uniform float time;

varying float vSpeed;

void main() {
    // Calculate distance from center of point (for circular particles)
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    // Discard pixels outside of circle
    if (dist > 0.5) discard;
    
    // Base color from uniform
    vec3 particleColor = color;
    
    // Adjust color based on velocity (speed)
    float speedFactor = min(vSpeed * 2.0, 1.0);
    
    // Create a blue to white gradient based on speed
    vec3 speedColor = mix(particleColor, vec3(1.0), speedFactor * 0.7);
    
    // Add a subtle pulsing glow effect
    float pulse = 0.05 * sin(time * 3.0) + 0.95;
    
    // Fade alpha at edges for soft particles
    float alpha = smoothstep(0.5, 0.2, dist);
    
    // Output final color
    gl_FragColor = vec4(speedColor * pulse, alpha);
}
