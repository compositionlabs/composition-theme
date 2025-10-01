import {
  CanvasTexture,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  FloatType,
  Vector2,
  WebGLRenderTarget,
  WebGLRenderer,
  NearestFilter,
} from 'three';

type PointerState = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

interface PingPongTarget {
  read: WebGLRenderTarget;
  write: WebGLRenderTarget;
  swap: () => void;
  dispose: () => void;
}

const BASE_VERTEX = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export class GPUFluid {
  private renderer: WebGLRenderer;
  private resolution: Vector2;
  private texelSize: Vector2;
  private camera: OrthographicCamera;
  private scene: Scene;
  private quad: Mesh;
  private obstacleText: string | null;

  private velocity: PingPongTarget;
  private dye: PingPongTarget;
  private pressure: PingPongTarget;
  private divergence: WebGLRenderTarget;
  private curl: WebGLRenderTarget;
  private obstacleTexture: CanvasTexture;

  private advectMaterial: ShaderMaterial;
  private divergenceMaterial: ShaderMaterial;
  private pressureMaterial: ShaderMaterial;
  private gradientMaterial: ShaderMaterial;
  private curlMaterial: ShaderMaterial;
  private vorticityMaterial: ShaderMaterial;
  private clearMaterial: ShaderMaterial;
  private splatMaterial: ShaderMaterial;

  private pointerRadius = 0.03;
  private vorticityStrength = 18.0;

  constructor(renderer: WebGLRenderer, width: number, height: number, obstacleText: string | null = 'JACOBIAN') {
    this.renderer = renderer;
    this.resolution = new Vector2(width, height);
    this.texelSize = new Vector2(1 / width, 1 / height);
    this.obstacleText = obstacleText;

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new Scene();
    this.quad = new Mesh(new PlaneGeometry(2, 2));
    this.scene.add(this.quad);

    const renderTargetParams = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };

    this.velocity = this.createPingPong(renderTargetParams);
    this.dye = this.createPingPong(renderTargetParams);
    this.pressure = this.createPingPong(renderTargetParams);
    this.divergence = this.createRenderTarget(renderTargetParams);
    this.curl = this.createRenderTarget(renderTargetParams);

    this.obstacleTexture = this.createObstacleTexture(this.obstacleText);

    this.advectMaterial = this.createAdvectMaterial();
    this.divergenceMaterial = this.createDivergenceMaterial();
    this.pressureMaterial = this.createPressureMaterial();
    this.gradientMaterial = this.createGradientMaterial();
    this.curlMaterial = this.createCurlMaterial();
    this.vorticityMaterial = this.createVorticityMaterial();
    this.clearMaterial = this.createClearMaterial();
    this.splatMaterial = this.createSplatMaterial();

    this.clearAllTargets();
  }

  // No separate output material; display is handled in the scene

  step(dt: number, pointer: PointerState | null) {
    const clampedDt = Math.min(dt, 0.016);
    const substeps = 2;
    const subDt = clampedDt / substeps;

    for (let i = 0; i < substeps; i++) {
      // Handle pointer interaction on movement (no click required)
      if (pointer) {
        const movement = Math.hypot(pointer.dx, pointer.dy);
        if (movement > 0.0005) {
          const force = Math.min(60.0, movement * 120.0);
          this.applySplat(this.velocity, {
            x: pointer.x,
            y: pointer.y,
            value: [pointer.dx * force, pointer.dy * force, 0, 0],
            radius: this.pointerRadius,
          });
          this.applySplat(this.dye, {
            x: pointer.x,
            y: pointer.y,
            value: [0.3647, 0.5255, 0.4235, 1],
            radius: this.pointerRadius * 1.5,
          });
        }
      }

      // Advect velocity
      this.advect(this.velocity, this.velocity, subDt, 0.99);

      // Vorticity confinement for smoother, lively detail
      this.computeCurl();
      this.applyVorticity(subDt);

      // Project to make velocity divergence-free
      this.computeDivergence();
      this.solvePressure(20);
      this.subtractGradient();

      // Advect dye using the projected velocity
      this.advect(this.dye, this.velocity, subDt, 0.985);
    }
  }

  get dyeTexture() {
    return this.dye.read.texture;
  }

  get obstacleMaskTexture() {
    return this.obstacleTexture;
  }

  resize(width: number, height: number) {
    if (width === this.resolution.x && height === this.resolution.y) return;
    this.resolution.set(width, height);
    this.texelSize.set(1 / width, 1 / height);

    this.velocity.read.setSize(width, height);
    this.velocity.write.setSize(width, height);
    this.dye.read.setSize(width, height);
    this.dye.write.setSize(width, height);
    this.pressure.read.setSize(width, height);
    this.pressure.write.setSize(width, height);
    this.divergence.setSize(width, height);
    this.curl.setSize(width, height);

    this.obstacleTexture.dispose();
    this.obstacleTexture = this.createObstacleTexture(this.obstacleText);
    this.clearAllTargets();
  }

  dispose() {
    this.velocity.dispose();
    this.dye.dispose();
    this.pressure.dispose();
    this.divergence.dispose();
    this.curl.dispose();
    this.obstacleTexture.dispose();
    this.quad.geometry.dispose();
    this.advectMaterial.dispose();
    this.divergenceMaterial.dispose();
    this.pressureMaterial.dispose();
    this.gradientMaterial.dispose();
    this.curlMaterial.dispose();
    this.vorticityMaterial.dispose();
    this.clearMaterial.dispose();
    this.splatMaterial.dispose();
  }

  private createRenderTarget(params: any) {
    return new WebGLRenderTarget(this.resolution.x, this.resolution.y, params);
  }

  private createPingPong(params: any): PingPongTarget {
    const target: PingPongTarget = {
      read: this.createRenderTarget(params),
      write: this.createRenderTarget(params),
      swap() {
        const temp = target.read;
        target.read = target.write;
        target.write = temp;
      },
      dispose() {
        target.read.dispose();
        target.write.dispose();
      },
    };

    return target;
  }

  private createObstacleTexture(text: string | null) {
    const canvas = document.createElement('canvas');
    canvas.width = this.resolution.x;
    canvas.height = this.resolution.y;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to acquire 2D context for obstacle texture');
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (text) {
      const fontSize = Math.min(canvas.width * 0.18, canvas.height * 0.14);
      const letterSpacing = fontSize * 0.45;

      ctx.fillStyle = 'white';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;

      const letters = Array.from(text);
      const widths = letters.map((ch) => ctx.measureText(ch).width);
      const totalWidth = widths.reduce((a, b) => a + b, 0) + Math.max(letters.length - 1, 0) * letterSpacing;
      let x = (canvas.width - totalWidth) * 0.5;
      const y = canvas.height * 0.5;

      ctx.textAlign = 'left';
      for (let i = 0; i < letters.length; i++) {
        const ch = letters[i];
        ctx.fillText(ch, x, y);
        x += widths[i] + (i < letters.length - 1 ? letterSpacing : 0);
      }
    }

    const texture = new CanvasTexture(canvas);
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;
    texture.needsUpdate = true;
    return texture;
  }

  private setUniforms(material: ShaderMaterial, uniforms: Record<string, unknown>) {
    Object.entries(uniforms).forEach(([key, value]) => {
      if (material.uniforms[key]) {
        material.uniforms[key].value = value;
      }
    });
  }

  private renderTo(target: WebGLRenderTarget | null, material: ShaderMaterial) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
  }

  private advect(target: PingPongTarget, velocity: PingPongTarget, dt: number, dissipation: number) {
    this.setUniforms(this.advectMaterial, {
      uVelocity: velocity.read.texture,
      uSource: target.read.texture,
      uTexelSize: this.texelSize,
      uDt: dt,
      uDissipation: dissipation,
      uObstacle: this.obstacleTexture,
    });
    this.renderTo(target.write, this.advectMaterial);
    target.swap();
  }

  private computeDivergence() {
    this.setUniforms(this.divergenceMaterial, {
      uVelocity: this.velocity.read.texture,
      uTexelSize: this.texelSize,
      uObstacle: this.obstacleTexture,
    });
    this.renderTo(this.divergence, this.divergenceMaterial);
  }

  private solvePressure(iterations = 20) {
    for (let i = 0; i < iterations; i++) {
      this.setUniforms(this.pressureMaterial, {
        uPressure: this.pressure.read.texture,
        uDivergence: this.divergence.texture,
        uTexelSize: this.texelSize,
        uObstacle: this.obstacleTexture,
      });
      this.renderTo(this.pressure.write, this.pressureMaterial);
      this.pressure.swap();
    }
  }

  private subtractGradient() {
    this.setUniforms(this.gradientMaterial, {
      uVelocity: this.velocity.read.texture,
      uPressure: this.pressure.read.texture,
      uTexelSize: this.texelSize,
      uObstacle: this.obstacleTexture,
    });
    this.renderTo(this.velocity.write, this.gradientMaterial);
    this.velocity.swap();
  }

  private applySplat(target: PingPongTarget, { x, y, value, radius }: { x: number; y: number; value: [number, number, number, number]; radius: number; }) {
    this.setUniforms(this.splatMaterial, {
      uTexture: target.read.texture,
      uPoint: new Vector2(x, y),
      uValue: value,
      uRadius: radius,
      uObstacle: this.obstacleTexture,
    });
    this.renderTo(target.write, this.splatMaterial);
    target.swap();
  }

  private createAdvectMaterial() {
    return new ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        uTexelSize: { value: this.texelSize.clone() },
        uDt: { value: 0.016 },
        uDissipation: { value: 0.99 },
        uObstacle: { value: this.obstacleTexture },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;

        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform sampler2D uObstacle;
        uniform vec2 uTexelSize;
        uniform float uDt;
        uniform float uDissipation;

        vec4 bilerp(sampler2D sam, vec2 uv) {
          vec2 st = uv / uTexelSize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * uTexelSize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * uTexelSize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * uTexelSize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * uTexelSize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main() {
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          vec2 coord = vUv - uDt * velocity;
          coord = clamp(coord, vec2(0.0) + uTexelSize, vec2(1.0) - uTexelSize);
          
          vec4 result = bilerp(uSource, coord) * uDissipation;
          float obstacle = texture2D(uObstacle, vUv).r;
          
          gl_FragColor = mix(result, vec4(0.5, 0.5, 0.5, 1.0), obstacle);
        }
      `,
    });
  }

  private createDivergenceMaterial() {
    return new ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uTexelSize: { value: this.texelSize.clone() },
        uObstacle: { value: this.obstacleTexture },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;

        uniform sampler2D uVelocity;
        uniform sampler2D uObstacle;
        uniform vec2 uTexelSize;

        void main() {
          vec2 velocityL = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).xy;
          vec2 velocityR = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).xy;
          vec2 velocityB = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).xy;
          vec2 velocityT = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).xy;

          float divergence = 0.5 * ((velocityR.x - velocityL.x) + (velocityT.y - velocityB.y));
          
          float obstacle = texture2D(uObstacle, vUv).r;
          gl_FragColor = vec4(divergence * (1.0 - obstacle), 0.0, 0.0, 1.0);
        }
      `,
    });
  }

  private createPressureMaterial() {
    return new ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uDivergence: { value: null },
        uTexelSize: { value: this.texelSize.clone() },
        uObstacle: { value: this.obstacleTexture },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;

        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;
        uniform sampler2D uObstacle;
        uniform vec2 uTexelSize;

        void main() {
          float obstacle = texture2D(uObstacle, vUv).r;
          
          if (obstacle > 0.5) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
          }
          
          float pressureL = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
          float pressureR = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
          float pressureB = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
          float pressureT = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;

          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (pressureL + pressureR + pressureB + pressureT - divergence) * 0.25;
          
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `,
    });
  }

  private createGradientMaterial() {
    return new ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uPressure: { value: null },
        uTexelSize: { value: this.texelSize.clone() },
        uObstacle: { value: this.obstacleTexture },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;

        uniform sampler2D uVelocity;
        uniform sampler2D uPressure;
        uniform sampler2D uObstacle;
        uniform vec2 uTexelSize;

        void main() {
          float obstacle = texture2D(uObstacle, vUv).r;
          
          if (obstacle > 0.5) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
          }
          
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          
          float pressureL = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
          float pressureR = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
          float pressureB = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
          float pressureT = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;

          vec2 gradient = 0.5 * vec2(pressureR - pressureL, pressureT - pressureB);
          vec2 newVelocity = velocity - gradient;
          
          gl_FragColor = vec4(newVelocity, 0.0, 1.0);
        }
      `,
    });
  }

  private createCurlMaterial() {
    return new ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uTexelSize: { value: this.texelSize.clone() },
        uObstacle: { value: this.obstacleTexture },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uObstacle;
        uniform vec2 uTexelSize;

        void main() {
          vec2 vL = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).xy;
          vec2 vR = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).xy;
          vec2 vB = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).xy;
          vec2 vT = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).xy;

          float curl = 0.5 * ((vR.y - vL.y) - (vT.x - vB.x));
          float obstacle = texture2D(uObstacle, vUv).r;
          gl_FragColor = vec4(curl * (1.0 - obstacle), 0.0, 0.0, 1.0);
        }
      `,
    });
  }

  private createVorticityMaterial() {
    return new ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uCurl: { value: null },
        uTexelSize: { value: this.texelSize.clone() },
        uEpsilon: { value: this.vorticityStrength },
        uDt: { value: 0.016 },
        uObstacle: { value: this.obstacleTexture },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform sampler2D uObstacle;
        uniform vec2 uTexelSize;
        uniform float uEpsilon;
        uniform float uDt;

        void main() {
          float cL = abs(texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x);
          float cR = abs(texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x);
          float cB = abs(texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x);
          float cT = abs(texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x);

          vec2 grad = 0.5 * vec2(cR - cL, cT - cB);
          float magnitude = length(grad) + 1e-5;
          vec2 N = grad / magnitude;

          float curl = texture2D(uCurl, vUv).x;
          vec2 v = texture2D(uVelocity, vUv).xy;

          // 2D vorticity confinement force
          vec2 force = uEpsilon * vec2(N.y * curl, -N.x * curl);
          v += force * uDt;

          float obstacle = texture2D(uObstacle, vUv).r;
          gl_FragColor = vec4(mix(v, vec2(0.0), obstacle), 0.0, 1.0);
        }
      `,
    });
  }

  private createClearMaterial() {
    return new ShaderMaterial({
      uniforms: {
        uValue: { value: [0, 0, 0, 0] as unknown as number[] },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: `
        precision highp float;
        uniform vec4 uValue;
        void main() {
          gl_FragColor = uValue;
        }
      `,
    });
  }

  private clearTarget(target: WebGLRenderTarget, value: [number, number, number, number] = [0, 0, 0, 0]) {
    this.clearMaterial.uniforms.uValue.value = value as unknown as number[];
    this.renderTo(target, this.clearMaterial);
  }

  private clearAllTargets() {
    this.clearTarget(this.velocity.read);
    this.clearTarget(this.velocity.write);
    this.clearTarget(this.dye.read);
    this.clearTarget(this.dye.write);
    this.clearTarget(this.pressure.read);
    this.clearTarget(this.pressure.write);
    this.clearTarget(this.divergence);
    this.clearTarget(this.curl);
  }

  private computeCurl() {
    this.setUniforms(this.curlMaterial, {
      uVelocity: this.velocity.read.texture,
      uTexelSize: this.texelSize,
      uObstacle: this.obstacleTexture,
    });
    this.renderTo(this.curl, this.curlMaterial);
  }

  private applyVorticity(dt: number) {
    this.setUniforms(this.vorticityMaterial, {
      uVelocity: this.velocity.read.texture,
      uCurl: this.curl.texture,
      uTexelSize: this.texelSize,
      uEpsilon: this.vorticityStrength,
      uDt: dt,
      uObstacle: this.obstacleTexture,
    });
    this.renderTo(this.velocity.write, this.vorticityMaterial);
    this.velocity.swap();
  }

  private createSplatMaterial() {
    return new ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uPoint: { value: new Vector2(0.5, 0.5) },
        uValue: { value: [0, 0, 0, 0] },
        uRadius: { value: 0.02 },
        uObstacle: { value: this.obstacleTexture },
      },
      vertexShader: BASE_VERTEX,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;

        uniform sampler2D uTexture;
        uniform sampler2D uObstacle;
        uniform vec2 uPoint;
        uniform vec4 uValue;
        uniform float uRadius;

        void main() {
          vec4 base = texture2D(uTexture, vUv);
          float obstacle = texture2D(uObstacle, vUv).r;

          vec2 diff = vUv - uPoint;
          float dist = length(diff);
          float radius = uRadius;
          
          float splat = exp(-dist * dist / (radius * radius));
          vec4 result = base + uValue * splat;
          
          gl_FragColor = mix(result, base, obstacle);
        }
      `,
    });
  }

}

export type { PointerState };

