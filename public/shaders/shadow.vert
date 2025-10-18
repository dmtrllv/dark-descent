#version 300 es

in vec2 vertex;

uniform vec2 position;
uniform vec2 screenResolution;
uniform float zoom;

void main() {
    float aspectRatio = screenResolution.x / screenResolution.y;
    vec2 p = (position + vertex) * zoom;
    p.x /= aspectRatio;
    gl_Position = vec4(p.xy, 0, 1.0);
}