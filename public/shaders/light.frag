#version 300 es

precision highp float;

in vec2 vert;

uniform vec4 color;
uniform float intensity;

out vec4 fragColor;

void main() {
    float l = 1.0f - pow(length(vert), intensity);
    fragColor = vec4(color.rgb * l,1);
}