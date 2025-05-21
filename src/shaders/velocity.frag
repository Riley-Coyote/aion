// velocity.frag - Fragment shader for updating particle velocities
// This shader updates the velocity of each particle based on force fields and other factors

uniform float time;
uniform float delta;
uniform float forceFields[60]; // Each force field uses 6 values: type, posX, posY, posZ, strength, radius
uniform int forceFieldCount;

// Force field types
#define GRAVITATIONAL 0
#define VORTEX 1
#define MAGNETIC 2
#define CUSTOM 3

void main() {
    // Get current position and velocity
    vec4 position = texture2D(texturePosition, gl_FragCoord.xy / resolution.xy);
    vec4 velocity = texture2D(textureVelocity, gl_FragCoord.xy / resolution.xy);
    
    // Apply force fields
    vec3 acceleration = vec3(0.0);
    
    for (int i = 0; i < 10; i++) { // Limit to 10 force fields for performance
        if (i >= forceFieldCount) break;
        
        int idx = i * 6;
        int type = int(forceFields[idx]);
        vec3 fieldPos = vec3(forceFields[idx + 1], forceFields[idx + 2], forceFields[idx + 3]);
        float strength = forceFields[idx + 4];
        float radius = forceFields[idx + 5];
        
        // Vector from field to particle
        vec3 direction = position.xyz - fieldPos;
        float distance = length(direction);
        
        // Skip if outside radius
        if (distance > radius && radius > 0.0) continue;
        
        // Normalize direction
        direction = normalize(direction);
        
        // Calculate force based on type
        if (type == GRAVITATIONAL) {
            // Gravitational force (inverse square law)
            float forceMagnitude = strength / max(distance * distance, 0.1);
            acceleration -= direction * forceMagnitude;
        }
        else if (type == VORTEX) {
            // Vortex force (perpendicular to direction)
            vec3 perpendicular = normalize(cross(direction, vec3(0.0, 1.0, 0.0)));
            float forceMagnitude = strength / max(distance, 0.1);
            acceleration += perpendicular * forceMagnitude;
        }
        else if (type == MAGNETIC) {
            // Magnetic force (perpendicular to velocity and direction)
            vec3 perpendicular = normalize(cross(velocity.xyz, direction));
            float forceMagnitude = strength / max(distance, 0.1);
            acceleration += perpendicular * forceMagnitude;
        }
        else if (type == CUSTOM) {
            // Custom vector field (example: sine wave pattern)
            float forceMagnitude = strength * sin(distance * 0.5 + time);
            acceleration += direction * forceMagnitude;
        }
    }
    
    // Apply acceleration to velocity
    velocity.xyz += acceleration * delta;
    
    // Apply damping (fluid resistance)
    velocity.xyz *= 0.99;
    
    // Limit maximum velocity
    float maxVelocity = 10.0;
    float currentVelocity = length(velocity.xyz);
    if (currentVelocity > maxVelocity) {
        velocity.xyz = normalize(velocity.xyz) * maxVelocity;
    }
    
    // Output updated velocity
    gl_FragColor = velocity;
}
