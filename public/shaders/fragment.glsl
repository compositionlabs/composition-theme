// Fragment Shader - Animated Wavy Background
precision mediump float;

varying vec2 pos;
uniform float u_time;
uniform vec2 u_resolution;

// Simple noise function for grain effect
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    // Normalize coordinates
    vec2 uv = (pos + 1.0) * 0.5;
    
    // Create slow, layered seashore-like waves (reduced amplitude for better contrast)
    // Large, slow base wave
    float wave1 = sin(uv.x * 3.0 + u_time * 0.5) * 0.35;
    wave1 += sin(uv.y * 2.0 + u_time * 0.3) * 0.25;
    
    // Medium wave layer
    float wave2 = sin(uv.x * 5.0 - u_time * 0.7) * 0.25;
    wave2 += cos(uv.y * 4.0 + uv.x * 1.5 + u_time * 0.4) * 0.18;
    
    // Small ripple layer
    float wave3 = sin(uv.x * 8.0 + uv.y * 6.0 + u_time * 0.8) * 0.12;
    wave3 += cos(uv.x * 12.0 - uv.y * 3.0 - u_time * 0.6) * 0.09;
    
    // Gentle foam-like details
    float foam = sin(uv.x * 15.0 + u_time * 1.2) * sin(uv.y * 20.0 + u_time * 0.9) * 0.06;
    
    // Combine all wave layers
    float combinedWave = wave1 + wave2 + wave3 + foam;
    
    // Jack UI v2 palette (dark): bright teal highlight, deep teal mid, dark slate base
    vec3 color1 = vec3(0.149, 0.710, 0.741); // #26b5bd (primary, dark)
    vec3 color2 = vec3(0.059, 0.475, 0.525); // #0f7986 (primary, light)
    vec3 color3 = vec3(0.165, 0.204, 0.216); // #2a3437 (background, dark)
    
    // Create sharper wave-based color transitions with reduced blur
    float colorMix1 = smoothstep(-0.15, 0.15, wave1 + wave2 * 0.7);
    float colorMix2 = smoothstep(-0.2, 0.2, wave2 + wave3 * 1.0);
    
    // Layer colors with more dramatic mixing
    vec3 baseColor = mix(color1, color2, colorMix1);
    vec3 finalColor = mix(baseColor, color3, colorMix2 * 0.9);
    
    // Keep colors within the specified palette range
    finalColor = clamp(finalColor, 0.0, 1.0);
    
    // Add grain effect
    float grain = random(uv * u_resolution + u_time) * 0.14;
    finalColor += grain - 0.04;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
