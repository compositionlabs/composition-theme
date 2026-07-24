// Option B — "Rolling Mill"
// A brushed-steel sheet sliding through the mill: anisotropic grain stretched
// along x with a soft teal light sheen sweeping across the surface.
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

void main() {
    vec2 uv = (pos + 1.0) * 0.5;

    // Brushed grain: noise stretched hard along x while the sheet slides
    float brush = fbm(vec2(uv.x * 3.0 - u_time * 0.05, uv.y * 90.0));
    float fine  = noise(vec2(uv.x * 8.0 - u_time * 0.05, uv.y * 260.0));

    // Jack palette
    vec3 steelDark  = vec3(0.165, 0.204, 0.216); // #2a3437 background
    vec3 steelLight = vec3(0.204, 0.251, 0.259); // #344042 surface
    vec3 teal       = vec3(0.149, 0.710, 0.741); // #26b5bd primary (dark)

    vec3 color = mix(steelDark, steelLight, brush);
    color += (fine - 0.5) * 0.05;

    // Anisotropic teal sheen sweeping diagonally, like light over the sheet
    float sweep = sin(uv.x * 2.2 - uv.y * 0.8 - u_time * 0.35);
    float sheen = pow(max(sweep, 0.0), 3.0);
    color = mix(color, teal, sheen * 0.22 * (0.6 + 0.4 * brush));

    // Grain (house style)
    float grain = random(uv * u_resolution + u_time) * 0.12;
    color += grain - 0.04;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
