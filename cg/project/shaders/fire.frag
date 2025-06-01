#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec4 coords;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;


void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	vec4 colorShape = texture2D(uSampler2, vTextureCoord);
	if (colorShape.a > 0.1 ) {
		color=vec4(color.r, color.g, color.b, 1.0);
		gl_FragColor = color;
	}
	else {
		discard;
	}
}