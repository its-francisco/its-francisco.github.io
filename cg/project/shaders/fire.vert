attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec4 coords;

uniform float timeFactor;
uniform float phase;
uniform vec2 topRotation;
uniform vec2 middleRotation;
uniform vec2 bottomRotation;

void main() {
    vTextureCoord = aTextureCoord;
    coords = vec4(aVertexPosition, 1.0);
    
    vec3 position = aVertexPosition;
    
    // Elliptical movement based on vertex height
    vec2 offset = vec2(0.0, 0.0);
    
    if (aVertexPosition.y > 0.7) {
        // Top 
        offset.x = topRotation.x * sin(timeFactor + phase);
        offset.y = topRotation.y * cos(timeFactor * 1.2 + phase);
    } else if (aVertexPosition.y > 0.3) {
        // Middle
        offset.x = middleRotation.x * sin(timeFactor * 0.8 + phase);
        offset.y = middleRotation.y * cos(timeFactor * 0.9 + phase);
    } else {
        // Bottom
        offset.x = bottomRotation.x * sin(timeFactor * 0.5 + phase);
        offset.y = bottomRotation.y * cos(timeFactor * 0.6 + phase);
    }
    
    position.x += offset.x;
    position.z += offset.y;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}