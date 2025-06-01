attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec4 coords;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform sampler2D uSampler3;

uniform float timeFactor;

varying vec3 offset;


void main() {
	vTextureCoord = aTextureCoord;
	vec4 color = texture2D(uSampler2, vTextureCoord * 1.5 + 0.001*timeFactor);
	vec4 color2 = texture2D(uSampler2, vTextureCoord * 1.5 - 0.001*timeFactor);

	offset=vec3(0.0,0.0,(color.r*0.03 + color2.r*0.02) / 2.);
	
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}

