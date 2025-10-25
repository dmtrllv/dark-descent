#version 300 es

precision highp float;

uniform sampler2D sampler;

in vec2 textureCoord;

out vec4 fragColor;

void main() {
    fragColor = texture(sampler, textureCoord);
}