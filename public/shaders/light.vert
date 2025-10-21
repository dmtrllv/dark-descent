#version 300 es

in vec2 vertex;

uniform vec2 position;

// per sprite
uniform float radius;

// per scene
uniform vec2 screenResolution;
uniform float pixelsPerUnit;
uniform float zoom;

out vec2 vert;

void main() {
    vec2 p = position * pixelsPerUnit;
    vec2 v = (p + (vertex * (radius * pixelsPerUnit))) / screenResolution;
    gl_Position = vec4(v * zoom, 0, 1.0f);
    vert = vertex;
}