// Option A — "Molten Veins"
// Molten metal flowing through dark cooling slag. Domain-warped ridged noise
// forms thin glowing channels (jack orange -> gold cores) that drift slowly
// downward through a slate/teal crust.
precision mediump float;

varying vec2 pos;
uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.0 + vec2(13.7, 7.3);
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = (pos + 1.0) * 0.5;
    vec2 p = uv * vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0) * 3.0;

    // Slow downward flow of the melt
    vec2 flow = vec2(0.0, u_time * 0.08);

    // Domain warp for organic channels
    vec2 q = vec2(fbm(p + flow), fbm(p + vec2(5.2, 1.3) - flow * 0.6));
    vec2 warped = p + 1.6 * q;

    // Ridged noise -> thin bright veins
    float ridge = 1.0 - abs(2.0 * fbm(warped + flow) - 1.0);
    float veins = smoothstep(0.72, 0.98, ridge);
    float halo  = smoothstep(0.45, 0.9, ridge);

    // Jack palette
    vec3 slag     = vec3(0.165, 0.204, 0.216); // #2a3437 background
    vec3 coolTeal = vec3(0.059, 0.475, 0.525); // #0f7986 primary (light)
    vec3 ember    = vec3(1.000, 0.588, 0.439); // #ff9670 secondary
    vec3 gold     = vec3(0.902, 0.769, 0.353); // #e6c45a chart-3

    // Cool crust with a faint teal mineral sheen
    vec3 color = mix(slag, coolTeal, 0.18 * fbm(p * 2.0 - flow));

    // Warm halo bleeding around the veins, hot gold cores inside them
    color = mix(color, ember * 0.55, halo * 0.5);
    vec3 hot = mix(ember, gold, smoothstep(0.85, 1.0, ridge));
    color = mix(color, hot, veins);

    // Slow pulse as fresh melt passes through
    color *= 0.85 + 0.15 * sin(u_time * 0.6 + q.x * 4.0);

    // Grain (house style)
    float grain = random(uv * u_resolution + u_time) * 0.10;
    color += grain - 0.03;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
