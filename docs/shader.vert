precision highp float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vPosition;
varying vec2 vUV;

void main() {

  vPosition = aPosition * 2.0 - 1.0;
  vUV = aTexCoord;

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vPosition, 1.0);
}
