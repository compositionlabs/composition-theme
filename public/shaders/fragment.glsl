// Fragment Shader - Animated Wavy Background
precision mediump float;

varying vec2 pos;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // Normalize coordinates
    vec2 uv = (pos + 1.0) * 0.5;
    
    // Create slow, layered seashore-like waves
    // Large, slow base wave
    float wave1 = sin(uv.x * 3.0 + u_time * 0.5) * 0.6;
    wave1 += sin(uv.y * 2.0 + u_time * 0.3) * 0.4;
    
    // Medium wave layer
    float wave2 = sin(uv.x * 5.0 - u_time * 0.7) * 0.4;
    wave2 += cos(uv.y * 4.0 + uv.x * 1.5 + u_time * 0.4) * 0.3;
    
    // Small ripple layer
    float wave3 = sin(uv.x * 8.0 + uv.y * 6.0 + u_time * 0.8) * 0.2;
    wave3 += cos(uv.x * 12.0 - uv.y * 3.0 - u_time * 0.6) * 0.15;
    
    // Gentle foam-like details
    float foam = sin(uv.x * 15.0 + u_time * 1.2) * sin(uv.y * 20.0 + u_time * 0.9) * 0.1;
    
    // Combine all wave layers
    float combinedWave = wave1 + wave2 + wave3 + foam;
    
    // Define 4 custom colors
    vec3 color1 = vec3(0.0, 0.106, 0.718);   // rgb(0, 27, 183)
    vec3 color2 = vec3(0.0, 0.275, 1.0);     // rgb(0, 70, 255)
    vec3 color3 = vec3(1.0, 0.502, 0.251);   // rgb(255, 128, 64)
    vec3 color4 = vec3(0.961, 0.945, 0.863); // rgb(245, 241, 220)
    
    // Create sharper wave-based color transitions with reduced blur
    float colorMix1 = smoothstep(-0.15, 0.15, wave1 + wave2 * 0.7);
    float colorMix2 = smoothstep(-0.2, 0.2, wave2 + wave3 * 1.0);
    float colorMix3 = smoothstep(-0.1, 0.1, wave3 + foam * 3.0);
    
    // Layer colors with more dramatic mixing
    vec3 baseColor = mix(color1, color2, colorMix1);
    vec3 midColor = mix(baseColor, color3, colorMix2 * 0.9);
    vec3 finalColor = mix(midColor, color4, colorMix3 * 0.8);
    
    // Keep colors within the specified palette range
    finalColor = clamp(finalColor, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
