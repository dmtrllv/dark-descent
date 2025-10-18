#version 300 es

in vec2 vertex;
in vec2 uv;

uniform vec2 position;
uniform vec2 screenResolution;
uniform float zIndex;
uniform float zoom;

out highp vec2 textureCoord;

void main() {
    float aspectRatio = screenResolution.x / screenResolution.y;
    vec2 p = (position + vertex) * zoom;
    p.x /= aspectRatio;
    gl_Position = vec4(p.xy, zIndex, 1.0);
    textureCoord = uv;
}