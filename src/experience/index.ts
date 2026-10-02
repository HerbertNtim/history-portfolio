import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GalleryCanvas } from "./canvas";
import {
  AboutScene,
  DetailScene,
  HorizontalScroll,
  IntroScene,
  PageLoader,
  SliderScene,
  WelcomeScene,
} from "./motion";

export function mountExperience() {
  const loader = new PageLoader();
  let scroll: HorizontalScroll | null = null;
  let welcome: WelcomeScene | null = null;
  let intro: IntroScene | null = null;
  let about: AboutScene | null = null;
  let slider: SliderScene | null = null;
  let detail: DetailScene | null = null;
  let canvas: GalleryCanvas | null = null;
  let frame = 0;
  let alive = true;

  const render = () => {
    if (!alive) return;
    if (scroll && slider) slider.updateNav(scroll.lenis.scroll);
    canvas?.render();
    frame = requestAnimationFrame(render);
  };

  loader.onLoadComplete = () => {
    if (!alive) return;
    scroll = new HorizontalScroll();
    welcome = new WelcomeScene();
    intro = new IntroScene();
    about = new AboutScene();
    slider = new SliderScene();
    detail = new DetailScene();
    try {
      canvas = new GalleryCanvas();
    } catch (error) {
      document.documentElement.dataset.webglFailed = "";
      console.warn("WebGL unavailable, falling back to DOM images", error);
    }
    welcome.init();
    intro.init();
    slider.init();
    about.init();
    detail.init();
    ScrollTrigger.refresh();
    scroll.lenis.resize();
    render();
  };

  loader.init();

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    welcome?.destroy();
    intro?.destroy();
    about?.destroy();
    slider?.destroy();
    detail?.destroy();
    canvas?.destroy();
    scroll?.destroy();
  };
}
