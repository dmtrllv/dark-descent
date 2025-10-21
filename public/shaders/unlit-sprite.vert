#version 300 es

in vec2 vertex;
in vec2 uv;

// per object
uniform vec2 position;
uniform float zIndex;

// per sprite
uniform vec2 spriteSize;

// per scene
uniform vec2 screenResolution;
uniform float pixelsPerUnit;
uniform float zoom;

out highp vec2 textureCoord;

void main() {
    vec2 p = position * pixelsPerUnit;
    vec2 v = (p + (vertex * (spriteSize / 2.0f))) / screenResolution;
    gl_Position = vec4(v * zoom, zIndex, 1.0f);
    textureCoord = uv;
}