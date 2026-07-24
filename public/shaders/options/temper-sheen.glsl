// Option D — "Temper Sheen"
// The iridescent oxide colors of heat-treated steel: a slowly rotating,
// domain-warped heat field banding from dark slate through deep teal, bright
// teal, and gold to a hot ember edge — mostly dark, quietly shifting.
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
    vec2 p = (uv - 0.5) * vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);

    // Slow rotation of the whole field
    float t = u_time * 0.05;
    float cs = cos(t);
    float sn = sin(t);
    p = mat2(cs, -sn, sn, cs) * p;

    // Domain-warped heat field
    vec2 q = vec2(fbm(p * 1.8 + t), fbm(p * 1.8 + vec2(4.7, 2.1) - t));
    float heat = fbm(p * 2.2 + 1.8 * q + vec2(0.0, t));

    // Jack palette
    vec3 steel    = vec3(0.165, 0.204, 0.216); // #2a3437 background
    vec3 deepTeal = vec3(0.059, 0.475, 0.525); // #0f7986 primary (light)
    vec3 teal     = vec3(0.149, 0.710, 0.741); // #26b5bd primary (dark)
    vec3 gold     = vec3(0.902, 0.769, 0.353); // #e6c45a chart-3
    vec3 ember    = vec3(1.000, 0.588, 0.439); // #ff9670 secondary

    // Temper bands, in the order oxide colors appear as steel heats
    vec3 color = steel;
    color = mix(color, deepTeal, smoothstep(0.25, 0.45, heat));
    color = mix(color, teal, smoothstep(0.45, 0.60, heat));
    color = mix(color, gold, smoothstep(0.60, 0.75, heat));
    color = mix(color, ember, smoothstep(0.75, 0.90, heat));

    // Keep it mostly dark and elegant
    color = mix(steel, color, 0.75);

    // Thin interference rings, like oxide film isolines
    float iso = abs(fract(heat * 7.0 + t) - 0.5);
    color += teal * smoothstep(0.08, 0.0, iso) * 0.08;

    // Grain (house style)
    float grain = random(uv * u_resolution + u_time) * 0.10;
    color += grain - 0.03;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
