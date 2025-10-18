#version 300 es

precision highp float;

uniform sampler2D sampler;
uniform float ambientOcculision;

in vec2 textureCoord;

out vec4 fragColor;

void main() {
    vec4 c = texture(sampler, textureCoord);
    fragColor = vec4(c.rgb, c.a) * ambientOcculision;
}