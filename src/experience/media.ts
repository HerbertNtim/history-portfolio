import gsap from "gsap";
import {
  DoubleSide,
  MathUtils,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  type Camera,
  type Group,
  type WebGLRenderer,
} from "three";
import { fragmentShader, vertexShader } from "./shaders";

const loader = new TextureLoader();

export function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

type Uniforms = {
  uTexture: { value: Texture | null };
  uResolution: { value: Vector2 };
  uImageResolution: { value: Vector2 };
  uVelocity: { value: Vector2 };
  uHoverProgress: { value: number };
  uExpandProgress: { value: number };
  uTime: { value: number };
  uOpacity: { value: number };
  uZBendEffect: { value: number };
  uBendIntensity: { value: number };
};

export class MediaPlane {
  index: number;
  type: string;
  element: HTMLImageElement;
  scene: Group;
  camera: Camera;
  geometry: PlaneGeometry;
  renderer: WebGLRenderer;
  viewport: { width: number; height: number };
  pointerTarget: Vector2;
  pointerCurrent = new Vector2();
  material: ShaderMaterial;
  mesh: Mesh;
  texture: Texture;
  bounds = new DOMRect();
  previousCoord: { x: number; y: number } | null = null;
  velocity = { x: 0, y: 0 };
  parallaxIntensity = 0.4;
  parallaxSmoothing = 0.08;
  bendIntensity = 0.002;
  parallaxValue = 0;
  randomXY: number;
  randomZ: number;
  private elapsed = 0;
  private start = performance.now();

  constructor(options: {
    scene: Group;
    element: HTMLImageElement;
    viewport: { width: number; height: number };
    camera: Camera;
    geometry: PlaneGeometry;
    renderer: WebGLRenderer;
    index: string;
    type: string;
    pointerTarget: Vector2;
  }) {
    this.index = Number(options.index);
    this.scene = options.scene;
    this.element = options.element;
    this.viewport = options.viewport;
    this.camera = options.camera;
    this.geometry = options.geometry;
    this.renderer = options.renderer;
    this.type = options.type;
    this.pointerTarget = options.pointerTarget;
    this.randomXY = Math.floor(Math.random() * 20) + 1;
    this.randomZ = Math.floor(Math.random() * 20) + 1;
    this.bounds = this.element.getBoundingClientRect();

    const uniforms: Uniforms = {
      uTexture: { value: null },
      uResolution: {
        value: new Vector2(this.bounds.width || 1, this.bounds.height || 1),
      },
      uImageResolution: { value: new Vector2(1, 1) },
      uVelocity: { value: new Vector2(0, 0) },
      uHoverProgress: { value: 0 },
      uExpandProgress: { value: 0 },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uZBendEffect: { value: 1 },
      uBendIntensity: { value: isCoarsePointer() ? 0.1 : 1 },
    };

    this.material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
    this.updateScale();

    this.texture = loader.load(
      this.element.getAttribute("src") ?? "",
      (texture) => {
        texture.colorSpace = SRGBColorSpace;
        this.material.uniforms.uImageResolution.value.set(
          texture.image.width,
          texture.image.height,
        );
      },
      undefined,
      () => {
        this.mesh.visible = false;
        this.element.dataset.webglTextureFailed = "";
      },
    );
    this.texture.colorSpace = SRGBColorSpace;
    this.material.uniforms.uTexture.value = this.texture;
  }

  onSlideMouseEnter(index: number) {
    if (this.type !== "slide" || isCoarsePointer()) return;
    const target = this.index === index && Math.abs(this.velocity.x) < 30 ? 1 : 0;
    gsap.to(this.material.uniforms.uHoverProgress, {
      value: target,
      ease: "sine.out",
      duration: this.index === index ? 0.5 : 0.75,
    });
  }

  onSlideMouseLeave(index: number) {
    if (this.type !== "slide" || this.index !== index) return;
    gsap.to(this.material.uniforms.uHoverProgress, {
      value: 0,
      ease: "sine.out",
      duration: 0.75,
    });
  }

  onShowDetail(index: number) {
    if (this.type !== "slide") return;
    if (this.index !== index) {
      if (this.material.uniforms.uOpacity.value === 1) {
        gsap.to(this.material.uniforms.uOpacity, {
          value: 0,
          ease: "power1.out",
          duration: 0.7,
        });
      }
      return;
    }
    if (this.material.uniforms.uExpandProgress.value === 0) {
      gsap.to(this.material.uniforms.uExpandProgress, {
        value: 1,
        ease: "power1.inOut",
        duration: 1.25,
      });
    }
  }

  onHideDetail(index: number) {
    if (this.type !== "slide") return;
    if (this.index !== index) {
      if (this.material.uniforms.uOpacity.value === 0) {
        gsap.to(this.material.uniforms.uOpacity, {
          value: 1,
          ease: "power3.out",
          duration: 0.75,
          delay: 0.8,
        });
      }
      return;
    }
    if (this.material.uniforms.uExpandProgress.value === 1) {
      gsap.to(this.material.uniforms.uExpandProgress, {
        value: 0,
        ease: "power1.inOut",
        duration: 1.25,
      });
    }
  }

  onRevealStart() {
    if (this.type === "welcome") this.material.uniforms.uZBendEffect.value = 0;
  }

  onRevealEnd() {
    if (this.type === "welcome") this.material.uniforms.uZBendEffect.value = 1;
  }

  updateScale() {
    this.bounds = this.element.getBoundingClientRect();
    this.mesh.scale.set(
      Math.max(this.bounds.width, 1),
      Math.max(this.bounds.height, 1),
      1,
    );
    this.material.uniforms.uResolution.value.set(
      this.bounds.width || 1,
      this.bounds.height || 1,
    );
  }

  updatePosition() {
    this.bounds = this.element.getBoundingClientRect();
    const x = this.bounds.left - this.viewport.width / 2 + this.bounds.width / 2;
    const y = -this.bounds.top + this.viewport.height / 2 - this.bounds.height / 2;
    const next = { x, y };

    if (this.previousCoord) {
      const delta = {
        x: next.x - this.previousCoord.x,
        y: next.y - this.previousCoord.y,
      };
      this.velocity.x = MathUtils.clamp(
        MathUtils.lerp(this.velocity.x, delta.x, 0.1),
        -50,
        50,
      );
      this.velocity.y = MathUtils.clamp(
        MathUtils.lerp(this.velocity.y, delta.y, 0.1),
        -50,
        50,
      );
    } else {
      this.velocity = { x: 0, y: 0 };
    }

    this.previousCoord = next;
    this.material.uniforms.uVelocity.value.set(
      this.velocity.x * this.bendIntensity,
      this.velocity.y * this.bendIntensity,
    );
    this.mesh.scale.set(
      Math.max(this.bounds.width, 1),
      Math.max(this.bounds.height, 1),
      1,
    );

    if (this.type === "slide") {
      this.mesh.position.set(x + this.parallaxValue * 15 * -this.velocity.x, y, 0);
    } else {
      this.mesh.position.set(x, y, this.index);
    }

    if (
      !isCoarsePointer() &&
      this.type === "welcome" &&
      this.material.uniforms.uZBendEffect.value === 1
    ) {
      this.pointerCurrent.lerp(this.pointerTarget, this.parallaxSmoothing);
      this.mesh.position.x += this.pointerCurrent.x * 5 * this.randomXY;
      this.mesh.position.y += this.pointerCurrent.y * 5 * this.randomXY;
      this.mesh.position.z +=
        this.pointerCurrent.y + this.pointerCurrent.x * this.randomZ;
    }
  }

  updateParallax() {
    const center = this.bounds.left + this.bounds.width / 2;
    const progress = (center - window.innerWidth / 2) / window.innerWidth;
    this.parallaxValue = progress * this.parallaxIntensity;
  }

  render() {
    this.updateParallax();
    this.updatePosition();
    if (
      Math.abs(this.velocity.x) > 10 &&
      this.material.uniforms.uHoverProgress.value === 1
    ) {
      gsap.to(this.material.uniforms.uHoverProgress, {
        value: 0,
        ease: "expo.out",
        duration: 0.5,
      });
    }
    this.elapsed = (performance.now() - this.start) / 1000;
    this.material.uniforms.uTime.value = this.elapsed;
  }

  onResize(viewport: { width: number; height: number }) {
    this.viewport = viewport;
    this.updateScale();
    this.material.uniforms.uBendIntensity.value = isCoarsePointer() ? 0.1 : 1;
  }

  destroy() {
    gsap.killTweensOf(this.material.uniforms.uHoverProgress);
    gsap.killTweensOf(this.material.uniforms.uExpandProgress);
    gsap.killTweensOf(this.material.uniforms.uOpacity);
    this.scene.remove(this.mesh);
    this.material.dispose();
    this.texture.dispose();
  }
}
