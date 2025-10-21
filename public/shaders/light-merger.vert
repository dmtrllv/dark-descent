#version 300 es

in vec2 vertex;
in vec2 uv;

out highp vec2 textureCoord;

void main() {
    gl_Position = vec4(vertex * vec2(1, -1), 0, 1);
    textureCoord = uv;
}