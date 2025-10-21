#version 300 es

precision highp float;

uniform sampler2D lightMap;
uniform sampler2D pixels;

in vec2 textureCoord;

out vec4 fragColor;

void main() {
    vec4 light = texture(lightMap, textureCoord);
    vec4 t = texture(pixels, textureCoord);

    float x = (light.r + light.g + light.b) / 3.0;
    fragColor = vec4(t.rgb, pow(x, .8));
}