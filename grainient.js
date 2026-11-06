import { Renderer } from './vendor/ogl/src/core/Renderer.js';
import { Program } from './vendor/ogl/src/core/Program.js';
import { Mesh } from './vendor/ogl/src/core/Mesh.js';
import { Triangle } from './vendor/ogl/src/extras/Triangle.js';

const container = document.querySelector('#projectGrainient');

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uLightMode;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));
  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);
  if(uLightMode>0.5){
    float energy=max(max(col.r,col.g),col.b);
    vec3 hue=col/max(energy,0.001);
    float chroma=length(col-vec3(dot(col,vec3(0.333333))));
    float coverage=clamp(0.12+chroma*1.15+energy*0.18,0.0,0.88);
    col=mix(vec3(1.0),clamp(hue*0.58+col*0.18,0.0,1.0),coverage);
  }
  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

const config = {
  color1: '#C56BC8',
  color2: '#3E22B8',
  color3: '#706080',
  timeSpeed: 0.25,
  colorBalance: 0.0,
  warpStrength: 1.0,
  warpFrequency: 5.0,
  warpSpeed: 2.0,
  warpAmplitude: 50.0,
  blendAngle: 0.0,
  blendSoftness: 0.05,
  rotationAmount: 500.0,
  noiseScale: 2.0,
  grainAmount: 0.1,
  grainScale: 2.0,
  grainAnimated: false,
  contrast: 1.35,
  gamma: 1.0,
  saturation: 0.92,
  centerX: 0.0,
  centerY: 0.0,
  zoom: 0.9
};

if (container) {
  try {
    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.25)
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: config.timeSpeed },
        uColorBalance: { value: config.colorBalance },
        uWarpStrength: { value: config.warpStrength },
        uWarpFrequency: { value: config.warpFrequency },
        uWarpSpeed: { value: config.warpSpeed },
        uWarpAmplitude: { value: config.warpAmplitude },
        uBlendAngle: { value: config.blendAngle },
        uBlendSoftness: { value: config.blendSoftness },
        uRotationAmount: { value: config.rotationAmount },
        uNoiseScale: { value: config.noiseScale },
        uGrainAmount: { value: config.grainAmount },
        uGrainScale: { value: config.grainScale },
        uGrainAnimated: { value: config.grainAnimated ? 1 : 0 },
        uContrast: { value: config.contrast },
        uGamma: { value: config.gamma },
        uSaturation: { value: config.saturation },
        uCenterOffset: { value: new Float32Array([config.centerX, config.centerY]) },
        uZoom: { value: config.zoom },
        uColor1: { value: new Float32Array(hexToRgb(config.color1)) },
        uColor2: { value: new Float32Array(hexToRgb(config.color2)) },
        uColor3: { value: new Float32Array(hexToRgb(config.color3)) },
        uLightMode: { value: 0 }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      const resolution = program.uniforms.iResolution.value;
      resolution[0] = gl.drawingBufferWidth;
      resolution[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    setSize();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let isVisible = false;
    let isPageVisible = !document.hidden;
    let suspended = document.documentElement.classList.contains('case-study-reading');
    const startedAt = performance.now();
    let lastRenderAt = 0;
    const renderInterval = 1000 / 30;

    const loop = time => {
      if (time - lastRenderAt >= renderInterval) {
        program.uniforms.iTime.value = (time - startedAt) * 0.001;
        renderer.render({ scene: mesh });
        lastRenderAt = time;
      }
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const start = () => {
      if (reducedMotion.matches) {
        program.uniforms.iTime.value = 0;
        renderer.render({ scene: mesh });
        return;
      }
      if (isVisible && isPageVisible && !suspended && !frame) frame = requestAnimationFrame(loop);
    };
    const syncPlayback = () => {
      if (isVisible && isPageVisible && !suspended) start();
      else stop();
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    intersectionObserver.observe(container);

    document.addEventListener('visibilitychange', () => {
      isPageVisible = !document.hidden;
      syncPlayback();
    });
    document.addEventListener('ylz:case-study-mode', event => {
      suspended = Boolean(event.detail?.expanded);
      syncPlayback();
    });
    reducedMotion.addEventListener?.('change', () => {
      stop();
      start();
    });
  } catch (error) {
    console.warn('Grainient background could not start.', error);
  }
}
