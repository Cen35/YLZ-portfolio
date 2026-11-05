(() => {
  'use strict';

  const BLEED = 1.24;
  const VERTEX = `#version 300 es
in vec2 position;
out vec2 vUv;
void main() {
  vUv = vec2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const FRAGMENT = `#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform vec2 uSize;
uniform vec2 uCardSize;
uniform vec2 uImageSize;
uniform float uUnit;
uniform float uScale;
uniform float uIdle;
uniform float uFrequency;
uniform int uOctaves;
uniform float uSeed;
uniform float uRadius;
uniform float uTime;
uniform float uFlow;
uniform float uChroma;
uniform float uReady;
in vec2 vUv;
out vec4 fragColor;

vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n = 1.0 / 7.0;
  vec3 ns = n * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float turbulence(vec2 p, float z) {
  float sum = 0.0;
  float amp = 1.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uOctaves) break;
    sum += abs(snoise(vec3(p, z))) * amp;
    p = p * 2.0 + 19.19;
    amp *= 0.5;
  }
  return clamp(sum * 0.45 + 0.231, 0.0, 1.0);
}

float roundedBox(vec2 p, vec2 extent, float r) {
  vec2 q = abs(p) - extent + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 sampleImage(vec2 view) {
  vec2 uv = view / uCardSize;
  float card = uCardSize.x / uCardSize.y;
  float image = uImageSize.x / max(1.0, uImageSize.y);
  vec2 scale = card > image ? vec2(1.0, image / card) : vec2(card / image, 1.0);
  return texture(uImage, (uv - 0.5) * scale + 0.5).rgb;
}

void main() {
  vec2 view = uCardSize * 0.5 + (vUv * uSize - uSize * 0.5) / uUnit;
  float inside = min(min(view.x, uCardSize.x - view.x), min(view.y, uCardSize.y - view.y));
  float rim = 1.0 - smoothstep(0.0, min(uCardSize.x, uCardSize.y) * 0.22, inside);
  float drift = snoise(vec3(view * 0.004 + uSeed * 0.37, uTime * 0.12)) * 0.5 + 0.5;
  float idle = uIdle * mix(smoothstep(0.55, 0.95, drift) * 0.5, 0.25 + 0.75 * smoothstep(0.3, 0.8, drift), rim);
  float scale = uScale * mix(0.2, 1.0, rim) + idle * 92.0;
  vec2 offset = vec2(0.0);
  if (scale > 0.01) {
    vec2 p = view * uFrequency + vec2(uSeed * 17.31, uSeed * 9.17);
    float z = uTime * (uFlow * 0.35 + uIdle * 0.5) + uSeed * 3.1;
    float red = turbulence(p, z);
    float blue = turbulence(p + vec2(31.7, 47.3), z + 5.3);
    offset = scale * (vec2(red, blue) - 0.5);
  }
  vec2 source = view + offset;
  float edge = roundedBox(source - uCardSize * 0.5, uCardSize * 0.5, uRadius);
  float alpha = (1.0 - smoothstep(-0.75 / uUnit, 0.75 / uUnit, edge)) * uReady;
  vec3 color = sampleImage(source);
  if (uChroma > 0.0) {
    vec2 split = offset * uChroma * 0.08;
    color.r = sampleImage(source + split).r;
    color.b = sampleImage(source - split).b;
  }
  fragColor = vec4(color * alpha, alpha);
}`;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const soften = (value, bound) => {
    if (value > bound) return bound + (value - bound) * 0.2;
    if (value < -bound) return -bound + (value + bound) * 0.2;
    return value;
  };
  const compile = (gl, type, source) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };

  const makeTexture = () => {
    const source = document.createElement('canvas');
    source.width = 1024;
    source.height = 1024;
    const ctx = source.getContext('2d');
    const base = ctx.createLinearGradient(0, 0, source.width, source.height);
    base.addColorStop(0, '#fffaf4');
    base.addColorStop(.52, '#f8f0fb');
    base.addColorStop(1, '#eef7fb');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, source.width, source.height);
    const cyan = ctx.createRadialGradient(150, 110, 0, 150, 110, 520);
    cyan.addColorStop(0, 'rgba(122,218,231,.22)');
    cyan.addColorStop(1, 'rgba(96,225,255,0)');
    ctx.fillStyle = cyan;
    ctx.fillRect(0, 0, source.width, source.height);
    const violet = ctx.createRadialGradient(850, 760, 0, 850, 760, 660);
    violet.addColorStop(0, 'rgba(190,166,223,.22)');
    violet.addColorStop(1, 'rgba(190,166,223,0)');
    ctx.fillStyle = violet;
    ctx.fillRect(0, 0, source.width, source.height);
    const pink = ctx.createRadialGradient(830, 80, 0, 830, 80, 400);
    pink.addColorStop(0, 'rgba(255,190,216,.24)');
    pink.addColorStop(1, 'rgba(255,190,216,0)');
    ctx.fillStyle = pink;
    ctx.fillRect(0, 0, source.width, source.height);
    let seed = 41;
    for (let i = 0; i < 1800; i += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const x = (seed & 1023);
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const y = (seed & 1023);
      const alpha = .012 + ((seed >>> 20) / 4095) * .025;
      ctx.fillStyle = `rgba(78,62,96,${alpha * .55})`;
      ctx.fillRect(x, y, 1, 1);
    }
    return source;
  };

  class DecayCardEffect {
    constructor(root, canvas) {
      this.root = root;
      this.canvas = canvas;
      this.reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
      this.settings = {
        intensity: .5,
        sensitivity: .5,
        hoverDecay: .05,
        recovery: .6,
        frequency: .003 + .25 * .047,
        octaves: 5,
        seed: 4,
        idle: .35,
        flow: 0,
        chroma: 0,
        travel: 50,
        tilt: 10
      };
      this.state = {
        x: 0, y: 0, rotate: 0, level: 0, time: 0,
        cursorX: innerWidth / 2, cursorY: innerHeight / 2,
        lastX: innerWidth / 2, lastY: innerHeight / 2,
        seen: false, hovered: false, intersecting: true
      };
      this.raf = 0;
      this.last = performance.now();
      this.alive = true;
      this.init();
    }

    init() {
      const gl = this.canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
      this.gl = gl;
      if (!gl) {
        this.root.classList.add('is-decay-fallback');
        return;
      }
      const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
      if (!vertex || !fragment) return this.fallback();
      const program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.bindAttribLocation(program, 0, 'position');
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return this.fallback();
      this.program = program;
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const textureSource = makeTexture();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureSource);
      this.imageSize = [textureSource.width, textureSource.height];
      this.uniforms = {};
      ['uImage','uSize','uCardSize','uImageSize','uUnit','uScale','uIdle','uFrequency','uOctaves','uSeed','uRadius','uTime','uFlow','uChroma','uReady'].forEach(name => {
        this.uniforms[name] = gl.getUniformLocation(program, name);
      });
      this.onMove = event => {
        this.state.cursorX = event.clientX;
        this.state.cursorY = event.clientY;
        if (!this.state.seen) {
          this.state.seen = true;
          this.state.lastX = event.clientX;
          this.state.lastY = event.clientY;
        }
        this.wake();
      };
      this.onEnter = () => { this.state.hovered = true; this.wake(); };
      this.onLeave = () => { this.state.hovered = false; this.wake(); };
      addEventListener('pointermove', this.onMove, { passive: true });
      this.root.addEventListener('pointerenter', this.onEnter);
      this.root.addEventListener('pointerleave', this.onLeave);
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.root);
      this.intersection = new IntersectionObserver(entries => {
        this.state.intersecting = entries.some(entry => entry.isIntersecting);
        this.wake();
      });
      this.intersection.observe(this.root);
      this.mutation = new MutationObserver(() => this.wake());
      this.mutation.observe(this.root, { attributes: true, attributeFilter: ['class'] });
      this.resize();
      this.wake();
    }

    fallback() {
      this.root.classList.add('is-decay-fallback');
      if (this.program) this.gl.deleteProgram(this.program);
      this.program = null;
    }

    resize() {
      if (!this.gl || !this.program) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      this.dpr = dpr;
      const width = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      this.draw();
    }

    draw() {
      const gl = this.gl;
      if (!gl || !this.program) return;
      const width = this.canvas.width;
      const height = this.canvas.height;
      const cardWidth = Math.max(1, this.root.clientWidth * 2);
      const cardHeight = Math.max(1, this.root.clientHeight * 2);
      const unit = (this.dpr || 1) / 2;
      const u = this.uniforms;
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(u.uImage, 0);
      gl.uniform2f(u.uSize, width, height);
      gl.uniform2f(u.uCardSize, cardWidth, cardHeight);
      gl.uniform2f(u.uImageSize, this.imageSize[0], this.imageSize[1]);
      gl.uniform1f(u.uUnit, unit);
      gl.uniform1f(u.uScale, this.state.level * this.settings.intensity * 260);
      gl.uniform1f(u.uIdle, this.reduce ? 0 : this.settings.idle);
      gl.uniform1f(u.uFrequency, this.settings.frequency);
      gl.uniform1i(u.uOctaves, this.settings.octaves);
      gl.uniform1f(u.uSeed, this.settings.seed);
      gl.uniform1f(u.uRadius, 56);
      gl.uniform1f(u.uTime, this.state.time);
      gl.uniform1f(u.uFlow, this.reduce ? 0 : this.settings.flow);
      gl.uniform1f(u.uChroma, this.settings.chroma);
      gl.uniform1f(u.uReady, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    frame = now => {
      this.raf = 0;
      if (!this.alive || !this.root.classList.contains('is-visible') || !this.state.intersecting) return;
      const dt = clamp((now - this.last) / 1000, .001, .05);
      this.last = now;
      this.state.time += dt;
      const speed = Math.hypot(this.state.cursorX - this.state.lastX, this.state.cursorY - this.state.lastY) / dt;
      this.state.lastX = this.state.cursorX;
      this.state.lastY = this.state.cursorY;
      const nx = this.state.seen ? clamp((this.state.cursorX / Math.max(1, innerWidth)) * 2 - 1, -1, 1) : 0;
      const ny = this.state.seen ? clamp((this.state.cursorY / Math.max(1, innerHeight)) * 2 - 1, -1, 1) : 0;
      const follow = 1 - Math.exp(-dt / .16);
      const targetX = this.reduce ? 0 : soften(nx * 120, this.settings.travel) * .18;
      const targetY = this.reduce ? 0 : soften(ny * 120, this.settings.travel) * .18;
      const targetRotate = this.reduce ? 0 : nx * this.settings.tilt * .22;
      this.state.x += (targetX - this.state.x) * follow;
      this.state.y += (targetY - this.state.y) * follow;
      this.state.rotate += (targetRotate - this.state.rotate) * follow;
      let wanted = this.reduce ? 0 : clamp(speed / (2400 - 2100 * this.settings.sensitivity), 0, 1) ** 2;
      if (this.state.hovered) wanted = Math.max(wanted, this.settings.hoverDecay);
      const tau = wanted > this.state.level ? .08 : this.settings.recovery;
      this.state.level += (wanted - this.state.level) * (1 - Math.exp(-dt / tau));
      this.canvas.style.transform = `translate3d(${this.state.x.toFixed(2)}px,${this.state.y.toFixed(2)}px,0) rotate(${this.state.rotate.toFixed(3)}deg)`;
      this.draw();
      const settling = Math.abs(targetX - this.state.x) + Math.abs(targetY - this.state.y) + Math.abs(targetRotate - this.state.rotate) > .05 || Math.abs(wanted - this.state.level) > .002;
      if (!this.reduce && (settling || this.settings.idle > 0)) this.raf = requestAnimationFrame(this.frame);
    };

    wake() {
      if (!this.program || this.raf || !this.alive || !this.root.classList.contains('is-visible') || !this.state.intersecting) return;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  const cards = [...document.querySelectorAll('.about-sheet')].map(root => {
    const canvas = root.querySelector('[data-about-decay]');
    return canvas ? new DecayCardEffect(root, canvas) : null;
  }).filter(Boolean);
  window.YLZDecayCards = cards;
})();
