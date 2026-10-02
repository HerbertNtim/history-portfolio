import {
  Group,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { MediaPlane } from "./media";

export class GalleryCanvas {
  renderer: WebGLRenderer;
  scene = new Scene();
  camera: PerspectiveCamera;
  group = new Group();
  geometry = new PlaneGeometry(1, 1, 32, 32);
  medias: MediaPlane[] = [];
  pointerTarget = new Vector2();
  screen = { width: window.innerWidth, height: window.innerHeight };
  private canvas: HTMLCanvasElement;
  private listeners: Record<string, EventListener>;
  private onPointerMove: (event: PointerEvent) => void;
  private onContextLost: () => void;
  private onContextRestored: () => void;
  private cameraZ = 100;

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>('[data-webgl="canvas"]');
    if (!canvas) throw new Error("WebGL canvas missing");
    this.canvas = canvas;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const fov =
      2 * Math.atan(this.screen.height / 2 / this.cameraZ) * (180 / Math.PI);
    this.camera = new PerspectiveCamera(
      fov,
      this.screen.width / this.screen.height,
      0.01,
      1000,
    );
    this.camera.position.set(0, 0, this.cameraZ);

    const images = gsapImages();
    this.medias = images.map(
      (element) =>
        new MediaPlane({
          scene: this.group,
          element,
          viewport: this.screen,
          camera: this.camera,
          geometry: this.geometry,
          renderer: this.renderer,
          index: element.dataset.index ?? "0",
          type: element.dataset.type ?? "slide",
          pointerTarget: this.pointerTarget,
        }),
    );
    this.scene.add(this.group);

    this.listeners = {
      "app:layout-change": () => this.onResize(),
      "app:slide-mouse-enter": (event) => {
        const index = (event as CustomEvent<{ index: number }>).detail.index;
        this.medias.forEach((media) => media.onSlideMouseEnter(index));
      },
      "app:slide-mouse-leave": (event) => {
        const index = (event as CustomEvent<{ index: number }>).detail.index;
        this.medias.forEach((media) => media.onSlideMouseLeave(index));
      },
      "app:show-detail": (event) => {
        const index = (event as CustomEvent<{ index: number }>).detail.index;
        this.medias.forEach((media) => media.onShowDetail(index));
      },
      "app:hide-detail": (event) => {
        const index = (event as CustomEvent<{ index: number }>).detail.index;
        this.medias.forEach((media) => media.onHideDetail(index));
      },
      "app:reveal-start": () => this.medias.forEach((media) => media.onRevealStart()),
      "app:reveal-end": () => this.medias.forEach((media) => media.onRevealEnd()),
    };

    Object.entries(this.listeners).forEach(([name, handler]) => {
      window.addEventListener(name, handler);
    });

    this.onPointerMove = (event) => {
      this.pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });

    this.onContextLost = () => {
      document.documentElement.dataset.webglFailed = "";
    };
    this.onContextRestored = () => {
      delete document.documentElement.dataset.webglFailed;
    };
    canvas.addEventListener("webglcontextlost", this.onContextLost);
    canvas.addEventListener("webglcontextrestored", this.onContextRestored);
  }

  onResize() {
    this.screen = { width: window.innerWidth, height: window.innerHeight };
    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.fov =
      2 * Math.atan(this.screen.height / 2 / this.cameraZ) * (180 / Math.PI);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.medias.forEach((media) => media.onResize(this.screen));
  }

  render() {
    this.medias.forEach((media) => media.render());
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    Object.entries(this.listeners).forEach(([name, handler]) => {
      window.removeEventListener(name, handler);
    });
    window.removeEventListener("pointermove", this.onPointerMove);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.medias.forEach((media) => media.destroy());
    this.geometry.dispose();
    this.renderer.dispose();
  }
}

function gsapImages() {
  return Array.from(document.querySelectorAll<HTMLImageElement>('[data-webgl="image"]'));
}
