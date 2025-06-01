attribute vec2 aPosition;

uniform vec3 uWorldPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

void main() {
    vec3 right = vec3(uMVMatrix[0][0], uMVMatrix[1][0], uMVMatrix[2][0]);
    vec3 up    = vec3(uMVMatrix[0][1], uMVMatrix[1][1], uMVMatrix[2][1]);

    vec3 pos = uWorldPosition + aPosition.x * right + aPosition.y * up;

    vTextureCoord = aPosition * 0.5 + 0.5;

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
}
