// Option C — "Forge Embers"
// Sparks rising off the melt: three parallax layers of drifting embers over a
// breathing furnace glow at the bottom, cooling into teal air at the top.
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
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.0 + vec2(13.7, 7.3);
        a *= 0.5;
    }
    return v;
}

// One layer of embers on a hashed grid; each live cell holds a flickering
// spark that rises with the layer and wobbles sideways as it climbs.
float emberLayer(vec2 uv, float scale, float speed, float t) {
    vec2 p = vec2(uv.x, uv.y - t * speed) * scale;
    vec2 cell = floor(p);
    vec2 f = fract(p);
    float rnd = random(cell);
    vec2 center = vec2(
        0.2 + 0.6 * fract(rnd * 7.13) + 0.06 * sin(t * (0.5 + rnd) + rnd * 6.28),
        0.2 + 0.6 * fract(rnd * 3.71)
    );
    float d = length(f - center);
    float radius = 0.045 + 0.05 * fract(rnd * 9.77);
    float alive = step(0.35, rnd);
    float flicker = 0.6 + 0.4 * sin(t * (1.5 + 2.0 * rnd) + rnd * 40.0);
    return alive * flicker * smoothstep(radius, 0.0, d);
}

void main() {
    vec2 uv = (pos + 1.0) * 0.5;
    vec2 auv = vec2(uv.x * u_resolution.x / max(u_resolution.y, 1.0), uv.y);

    // Jack palette
    vec3 bg    = vec3(0.165, 0.204, 0.216); // #2a3437 background
    vec3 teal  = vec3(0.059, 0.475, 0.525); // #0f7986 primary (light)
    vec3 ember = vec3(1.000, 0.588, 0.439); // #ff9670 secondary
    vec3 gold  = vec3(0.902, 0.769, 0.353); // #e6c45a chart-3

    // Furnace glow along the bottom, breathing slowly
    float breath = fbm(vec2(auv.x * 2.0, u_time * 0.1));
    float floorGlow = smoothstep(0.55, 0.0, uv.y) * (0.35 + 0.2 * breath);
    vec3 color = mix(bg, bg + ember * 0.35, floorGlow);

    // Cool teal air up top
    color = mix(color, mix(bg, teal, 0.25), smoothstep(0.5, 1.0, uv.y) * 0.5);

    // Three parallax ember layers: near = big/slow/bright, far = small/fast/dim
    float e = 0.0;
    e += emberLayer(auv, 6.0, 0.05, u_time) * 0.9;
    e += emberLayer(auv + 3.1, 10.0, 0.09, u_time) * 0.6;
    e += emberLayer(auv + 7.7, 16.0, 0.14, u_time) * 0.35;

    color += mix(ember, gold, 0.35) * e;

    // Grain (house style)
    float grain = random(uv * u_resolution + u_time) * 0.10;
    color += grain - 0.03;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
