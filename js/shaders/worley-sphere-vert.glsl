precision mediump float;

attribute vec3 aPosition;

varying vec3 vPosition;

uniform mat4 uProjection;
uniform mat4 uView;
uniform float time;

void main() {
  vPosition = position;
  vPosition.x *= 1.0 + (pow(abs(sin(time / 350.0)), 1.5) * .4);
  vPosition.y *= 1.0 + (pow(abs(cos(time / 350.0)), 2.0) * .4);
  vPosition.z *= 1.0 + (pow(abs(sin(time / 350.0)), 2.5) * .4);
  // vPosition.z *= (tan(time) + 1.5) * .2;

  vPosition.y += time;

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

	gl_Position = projectionMatrix * mvPosition;
}
