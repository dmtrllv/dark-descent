#version 300 es

in vec2 vertex;
in vec2 uv;

// per object
uniform vec2 position;
uniform bool flip;

// per sprite
uniform vec2 spriteSize;

// per scene
uniform vec2 screenResolution;
uniform float pixelsPerUnit;
uniform float zoom;
uniform vec2 cameraPosition;

out highp vec2 textureCoord;

void main() {
    vec2 p = (position - cameraPosition) * pixelsPerUnit;
    vec2 v = (p + (vertex * (spriteSize / 2.0f))) / screenResolution;
    gl_Position = vec4(v * zoom, 0, 1.0f);
    if(flip) {
        textureCoord = vec2(1.0 - uv.x, uv.y);
    } else {
        textureCoord = uv;
    }
}