#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float timeFactor; 

void main() {
    float wave = sin((vTextureCoord.x + timeFactor * 0.2) * 20.0) * 0.01;
    float wave2 = cos((vTextureCoord.y + timeFactor * 0.3) * 25.0) * 0.01;

    vec2 distortedCoord = vTextureCoord + vec2(wave, wave2);

    vec4 color = texture2D(uSampler, distortedCoord);

    color.rgb = mix(color.rgb, vec3(0.1, 0.4, 0.8), 0.3); // blue tint
    color.a *= 0.6; 

    // specular
    float highlight = pow(max(dot(vec2(0.5), distortedCoord - 0.5), 0.0), 10.0);
    color.rgb += vec3(0.1, 0.1, 0.15) * highlight;

    if (color.a < 0.05) discard;

    gl_FragColor = color;
}
