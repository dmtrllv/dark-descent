#version 300 es

precision highp float;

uniform float ambientOcculision;

out vec4 fragColor;

void main() {
    fragColor = vec4(0, 0, 0, 1) * ambientOcculision;
}