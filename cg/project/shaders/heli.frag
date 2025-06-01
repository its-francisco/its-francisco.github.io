#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec4 coords;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;
uniform float u_mixFactor;      // Blend factor (0.0 to 1.0)

varying vec2 v_texCoords;

void main() {
    vec4 color1 = texture2D(uSampler, vTextureCoord);
    vec4 color2 = texture2D(uSampler2, vTextureCoord);
    
    vec4 finalColor = mix(color1, color2, u_mixFactor);
    finalColor.a = max(color1.a, color2.a)* mix(color1.a, color2.a, u_mixFactor);
    gl_FragColor = finalColor;
}
