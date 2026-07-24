// Flat dark background with film grain (jack dark palette)
precision mediump float;

varying vec2 pos;
uniform float u_time;
uniform vec2 u_resolution;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = (pos + 1.0) * 0.5;

    vec3 color = vec3(0.165, 0.204, 0.216); // #2a3437 background

    // Grain (house style)
    float grain = random(uv * u_resolution + u_time) * 0.12;
    color += grain - 0.04;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
