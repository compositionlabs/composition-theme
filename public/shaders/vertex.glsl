// Vertex Shader
// This shader processes each vertex of your geometry

attribute vec2 a_position;
varying vec2 pos;

void main() {
    // Pass position to fragment shader
    pos = a_position;
    
    // Transform the vertex position
    gl_Position = vec4(a_position, 0.0, 1.0);
}
