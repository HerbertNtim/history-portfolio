export const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uTexture;
uniform vec2 uVelocity;
uniform float uOpacity;

void main() {
  vec4 finalColor = texture2D(uTexture, vUv);
  vec4 color = vec4(finalColor.rgb, finalColor.a);

  color.rgb *= mix(0.75, 1.1, smoothstep(-5.0, 5.0, vPosition.z))
    * smoothstep(1.0, 0.0, abs(uVelocity.x));

  gl_FragColor = vec4(color.rgb * uOpacity, finalColor.a * uOpacity);
}
`;

export const vertexShader = /* glsl */ `
#define PI 3.1415926535897932384626433832795
precision highp float;

uniform vec2 uVelocity;
uniform vec2 uResolution;
uniform float uHoverProgress;
uniform float uExpandProgress;
uniform float uTime;
uniform float uOpacity;
uniform float uBendIntensity;

varying vec2 vUv;
varying vec3 vPosition;

const float CLOSEST_CORNER = 0.0;

float getActivation(vec2 uv) {
  float y = mod(CLOSEST_CORNER, 2.0) * 2.0 - 1.0;
  float x = (floor(CLOSEST_CORNER / 2.0) * 2.0 - 1.0) * -1.0;
  float xAct = abs(min(0.0, x)) + uv.x * x;
  float yAct = abs(min(0.0, y)) + uv.y * y;
  return (xAct + yAct) / 2.0;
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float multipler = (pos.x + 2.5) / 5.0;
  float wave1 = 0.5 * sin(10.0 * pos.x + uTime * 3.0);
  float wave2 = 0.2 * sin(5.0 * pos.x + uTime * 5.0);
  float wave3 = 0.2 * sin(2.0 * pos.x + uTime * 1.0);

  pos.z += (wave1 + wave2 + wave3) * multipler * uHoverProgress * 10.0 * uOpacity * (1.0 - uExpandProgress);
  pos.z -= (1.0 - uOpacity);

  if (uOpacity == 0.0) pos.z -= 4.0;

  float latestStart = 0.5;
  float activation = getActivation(uv);
  float startAt = activation * latestStart;
  float vertexProgress = smoothstep(startAt, 1.0, uExpandProgress);

  float flippedX = -pos.x;
  pos.x = mix(pos.x, flippedX, vertexProgress);

  float aspectRatio = uResolution.x / uResolution.y;
  float stepFormula = 0.5 - (latestStart * latestStart * latestStart) * aspectRatio;
  vUv.x = mix(vUv.x, 1.0 - vUv.x, step(stepFormula, vertexProgress));

  float bendY = cos((uv.y - 0.5) * PI);
  float bendX = cos((uv.x - 0.5) * PI);

  vec3 bentPosition = pos;
  bentPosition.x += bendY * uVelocity.x * 0.75;
  bentPosition.y += bendX * uVelocity.y * 1.0;
  bentPosition.z -= 150.0 * (uv.x - 0.5) * uVelocity.x * uBendIntensity;
  bentPosition.y *= 1.0 - (uv.x - 0.5) * uVelocity.x * 1.0;

  vPosition = bentPosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(bentPosition, 1.0);
}
`;
