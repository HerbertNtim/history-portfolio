import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { movements } from "../data/movements";
import { isCoarsePointer } from "./media";

gsap.registerPlugin(ScrollTrigger, Flip, SplitText);

const FONT_WEIGHTS: Record<string, number[]> = {
  Author: [200, 400, 500],
  "Chapman Test Extended": [400],
  "Bebas Neue": [400],
};

function clampMap(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const mapped = outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
  return Math.min(outMax, Math.max(outMin, mapped));
}

async function waitForFonts() {
  if (!document.fonts?.ready) return;
  await document.fonts.ready;
  const families = ["Author", "Chapman Test Extended", "Bebas Neue"];
  await Promise.all(
    families.flatMap((family) =>
      (FONT_WEIGHTS[family] ?? [400]).map((weight) =>
        document.fonts.load(`${weight} 1em "${family}"`).catch(() => undefined),
      ),
    ),
  );
}

export class PageLoader {
  private root = document.querySelector<HTMLElement>('[data-loader="container"]');
  private progress = document.querySelector<HTMLElement>('[data-loader="progress"]');
  private number = document.querySelector<HTMLElement>('[data-loader="progress-number"]');
  onLoadComplete?: () => void;

  init() {
    if (!this.progress || !this.number || !this.root) return;
    gsap.set(this.progress, { autoAlpha: 0 });
    void waitForFonts().then(() => this.startProgress());
  }

  private startProgress() {
    if (!this.progress || !this.number || !this.root) return;
    gsap.set(this.progress, { autoAlpha: 1 });
    const counter = { value: 0 };
    gsap.to(counter, {
      value: 100,
      duration: 1.15,
      ease: "power1.inOut",
      snap: { value: 2 },
      onUpdate: () => {
        if (!this.number) return;
        this.number.textContent = Math.floor(counter.value).toString().padStart(3, "0");
      },
      onComplete: () => {
        if (!this.number || !this.root) return;
        this.number.textContent = "100";
        this.root.dataset.state = "complete";
        this.onLoadComplete?.();
      },
    });
  }
}

export class HorizontalScroll {
  lenis: Lenis;
  private scrollY = 0;
  private onLayout: () => void;
  private onScrollTo: (event: Event) => void;
  private onShow: () => void;
  private onHide: () => void;
  private ticker: (time: number) => void;

  constructor() {
    const wrapper = document.querySelector<HTMLElement>('[data-scroll="wrapper"]');
    const fixed = document.querySelector<HTMLElement>('[data-scroll-fixed="wrapper"]');
    const about = document.querySelector<HTMLElement>('[data-about="container"]');
    if (!wrapper) throw new Error("Scroll wrapper missing");

    this.lenis = new Lenis({
      content: wrapper,
      orientation: "horizontal",
      gestureOrientation: "both",
      syncTouch: true,
      lerp: 0.1,
    });
    this.lenis.scrollTo(0, { immediate: true });

    const lenis = this.lenis;
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollLeft(value?: number) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    this.lenis.on("scroll", ScrollTrigger.update);
    this.ticker = (time) => {
      this.lenis.raf(time * 1000);
    };
    gsap.ticker.add(this.ticker);
    gsap.ticker.lagSmoothing(0);

    this.onLayout = () => this.lenis.resize();
    this.onScrollTo = (event) => {
      const detail = (event as CustomEvent<{ targetElement: HTMLElement; slideWidth: number }>).detail;
      this.lenis.scrollTo(detail.targetElement, {
        offset: -window.innerWidth / 2 + detail.slideWidth / 2,
      });
    };
    this.onShow = () => {
      gsap.delayedCall(0.5, () => {
        this.scrollY = this.lenis.targetScroll;
        this.lenis.stop();
      });
      wrapper.dataset.state = "hide";
      if (fixed) fixed.dataset.state = "show";
      wrapper.inert = true;
      if (about) about.inert = true;
    };
    this.onHide = () => {
      this.lenis.start();
      this.lenis.scrollTo(this.scrollY, { immediate: true });
      wrapper.dataset.state = "show";
      if (fixed) fixed.dataset.state = "hide";
      wrapper.inert = false;
      if (about) about.inert = false;
    };

    window.addEventListener("app:layout-change", this.onLayout);
    window.addEventListener("app:scroll-to", this.onScrollTo);
    window.addEventListener("app:show-detail", this.onShow);
    window.addEventListener("app:hide-detail", this.onHide);
    ScrollTrigger.refresh();
  }

  destroy() {
    window.removeEventListener("app:layout-change", this.onLayout);
    window.removeEventListener("app:scroll-to", this.onScrollTo);
    window.removeEventListener("app:show-detail", this.onShow);
    window.removeEventListener("app:hide-detail", this.onHide);
    gsap.ticker.remove(this.ticker);
    this.lenis.destroy();
  }
}

export class WelcomeScene {
  private container = document.querySelector<HTMLElement>('[data-welcome="container"]');
  private imageContainer = document.querySelector<HTMLElement>('[data-welcome="image-container"]');
  private images = gsap.utils.toArray<HTMLElement>('[data-welcome="image-container"] img');
  private scrollIndicator = document.querySelector<HTMLElement>('[data-welcome="scroll-indicator"]');
  private title = document.querySelector<HTMLElement>('[data-welcome="title"]');
  private description = document.querySelector<HTMLElement>('[data-welcome="description"]');
  private titleAnimation?: gsap.core.Timeline;
  private descriptionAnimation?: gsap.core.Timeline;
  private titleSplit?: SplitText;
  private descriptionSplit?: SplitText;
  private indicatorTrigger?: ScrollTrigger;

  constructor() {
    this.prepareText();
  }

  private prepareText() {
    if (!this.title || !this.description) return;
    this.titleSplit = new SplitText(this.title, {
      type: "lines, chars",
      linesClass: "line-wrapper",
    });
    this.titleAnimation = gsap
      .timeline({
        paused: true,
        onComplete: () => this.titleSplit?.revert(),
      })
      .from(this.titleSplit.chars, {
        ease: "expo.out",
        duration: 0.75,
        yPercent: 100,
        autoAlpha: 0,
        stagger: 0.025,
        delay: 0.5,
      });

    this.descriptionSplit = new SplitText(this.description, {
      type: "lines",
      linesClass: "line-wrapper",
    });
    this.descriptionAnimation = gsap
      .timeline({
        paused: true,
        onComplete: () => this.descriptionSplit?.revert(),
      })
      .from(this.descriptionSplit.lines, {
        ease: "expo.out",
        duration: 1,
        yPercent: 100,
        autoAlpha: 0,
        stagger: 0.025,
        delay: 0.6,
      });
  }

  init() {
    this.reveal();
    if (!this.container || !this.scrollIndicator) return;
    this.indicatorTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: "top top",
      horizontal: true,
      onEnter: () => {
        if (this.scrollIndicator) this.scrollIndicator.dataset.state = "hide";
      },
      onLeaveBack: () => {
        if (this.scrollIndicator) this.scrollIndicator.dataset.state = "";
      },
    });
  }

  private reveal() {
    if (!this.imageContainer || !this.scrollIndicator) return;
    const first = Flip.getState(this.images);
    this.imageContainer.dataset.state = "initial-in";
    Flip.from(first, {
      duration: 1.25,
      ease: "expo.inOut",
      absolute: true,
      stagger: 0.05,
      onStart: () => window.dispatchEvent(new CustomEvent("app:reveal-start")),
      onComplete: () => {
        const next = Flip.getState(this.images);
        if (this.imageContainer) delete this.imageContainer.dataset.state;
        Flip.from(next, {
          duration: 1.25,
          ease: "expo.inOut",
          absolute: true,
          onStart: () => {
            if (this.scrollIndicator) this.scrollIndicator.dataset.state = "";
            this.titleAnimation?.play();
            this.descriptionAnimation?.play();
          },
          onComplete: () => window.dispatchEvent(new CustomEvent("app:reveal-end")),
        });
      },
    });
  }

  destroy() {
    this.indicatorTrigger?.kill();
    this.titleAnimation?.kill();
    this.descriptionAnimation?.kill();
    this.titleSplit?.revert();
    this.descriptionSplit?.revert();
  }
}

export class IntroScene {
  private container = document.querySelector<HTMLElement>('[data-intro="container"]');
  private description = document.querySelector<HTMLElement>('[data-intro="description"]');
  private split?: SplitText;
  private tween?: gsap.core.Timeline;

  init() {
    if (!this.container || !this.description) return;
    this.split = new SplitText(this.description, {
      type: "words, chars",
      wordsClass: "word",
      charsClass: "char",
    });
    gsap.set(this.split.words, { whiteSpace: "nowrap" });
    this.tween = gsap
      .timeline({
        scrollTrigger: {
          trigger: this.container,
          scrub: 1.5,
          start: "top-=50%",
          end: "top top",
          horizontal: true,
        },
      })
      .set(this.description, { visibility: "visible" })
      .fromTo(
        this.split.chars,
        { opacity: 0, yPercent: 10 },
        { opacity: 1, yPercent: 0, duration: 60, stagger: 2.5, ease: "sine.inOut" },
      );
  }

  destroy() {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
    this.split?.revert();
  }
}

export class AboutScene {
  private lastSlide = document.querySelector<HTMLElement>('[data-slide="container"]:last-of-type');
  private container = document.querySelector<HTMLElement>('[data-about="container"]');
  private tween?: gsap.core.Timeline;

  init() {
    if (!this.lastSlide || !this.container) return;
    const slide = this.lastSlide;
    const scrollFor = (edge: "center" | "after") => {
      const rect = slide.getBoundingClientRect();
      const left = rect.left + window.scrollX;
      if (edge === "center") return left + rect.width / 2 - window.innerWidth / 2;
      return left + rect.width + window.innerWidth * 0.2;
    };
    this.tween = gsap
      .timeline({
        scrollTrigger: {
          trigger: slide,
          scrub: 1.15,
          horizontal: true,
          invalidateOnRefresh: true,
          start: () => scrollFor("center"),
          end: () => scrollFor("after"),
        },
      })
      .fromTo(
        this.container,
        { clipPath: "inset(0% 0% 0% 100%)", xPercent: 25 },
        { clipPath: "inset(0% 0% 0% 0%)", xPercent: 0 },
      );
  }

  destroy() {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
  }
}

export class SliderScene {
  private navContainer = document.querySelector<HTMLElement>('[data-nav="container"]');
  private navProgressState = document.querySelector<HTMLElement>('[data-nav="progress-state"]');
  private navButtons = gsap.utils.toArray<HTMLElement>('[data-nav="button"]');
  private sliderContainer = document.querySelector<HTMLElement>('[data-slider="container"]');
  private slidePlaceholder = document.querySelector<HTMLElement>('[data-slide="placeholder"]');
  private slides = gsap.utils.toArray<HTMLElement>('[data-slide="container"]');
  private slidesImage = gsap.utils.toArray<HTMLElement>('[data-slide="container"] [data-slide="image"]');
  private slidesImageContainer = gsap.utils.toArray<HTMLElement>(
    '[data-slide="container"] [data-slide="image-container"]',
  );
  private sliderLines = gsap.utils.toArray<HTMLElement>('[data-slider="line"]');
  private slidesTextsAnimation: gsap.core.Timeline[] = [];
  private slidesImageAnimation: gsap.core.Tween[] = [];
  private splits: SplitText[] = [];
  private navScrollTrigger?: ScrollTrigger;
  private slideWidth = 0;
  private lastScroll = 0;
  private lastNavTransform = "";
  private navButtonStates: string[] = [];
  private viewportWidth = window.innerWidth;
  private progressStateLeft = 0;
  private progressStateWidth = 1;
  private navButtonsLeft: number[] = [];
  private sliderStaticLeft = 0;
  private sliderWidth = 1;
  private resizeTimer = 0;
  private onResize = () => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.handleResize(), 150);
  };
  private onHideDetail = (event: Event) => {
    const index = (event as CustomEvent<{ index: number }>).detail.index;
    gsap.delayedCall(0.8, () => this.toggleVisibility(true, index));
  };

  constructor() {
    this.slidesImageContainer.forEach((element, index) => {
      element.addEventListener("click", () => this.handleClick(index));
      element.addEventListener("mouseenter", () => this.handleMouseEnter(index));
      element.addEventListener("mouseleave", () => this.handleMouseLeave(index));
      element.addEventListener("focus", () => {
        if (!element.matches(":focus-visible")) return;
        requestAnimationFrame(() => {
          window.dispatchEvent(
            new CustomEvent("app:scroll-to", {
              detail: { targetElement: this.slides[index], slideWidth: this.slideWidth },
            }),
          );
        });
      });
    });

    this.slides.forEach((slide, index) => {
      const texts = slide.querySelectorAll<HTMLElement>('[data-slide="text"]');
      const split = new SplitText(texts, { type: "lines", linesClass: "line" });
      this.splits.push(split);
      this.slidesTextsAnimation[index] = gsap
        .timeline()
        .set(texts, { visibility: "visible" })
        .fromTo(
          split.lines,
          { opacity: 0, yPercent: 100 },
          { opacity: 1, yPercent: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
        );
      this.slidesImageAnimation[index] = gsap.fromTo(
        this.slidesImage[index],
        { autoAlpha: 0, yPercent: 25 },
        { autoAlpha: 1, yPercent: 0, duration: 0.55, ease: "power3.out" },
      );
    });
  }

  init() {
    this.navButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const target = button.dataset.target;
        const element = target ? document.getElementById(target) : null;
        if (!element) return;
        window.dispatchEvent(
          new CustomEvent("app:scroll-to", {
            detail: { targetElement: element, slideWidth: this.slideWidth },
          }),
        );
      });
    });
    this.setSlideWidth();
    this.measureNav();
    this.setNavObserver();
    window.addEventListener("resize", this.onResize);
    window.addEventListener("app:hide-detail", this.onHideDetail);
  }

  private handleResize() {
    this.setSlideWidth();
    this.measureNav();
    this.setNavObserver();
    ScrollTrigger.refresh();
  }

  private measureNav() {
    if (!this.navProgressState || !this.sliderContainer) return;
    this.viewportWidth = window.innerWidth;
    this.progressStateLeft = this.navProgressState.getBoundingClientRect().left;
    this.progressStateWidth = this.navProgressState.offsetWidth || 1;
    this.navButtonsLeft = this.navButtons.map((button) => button.getBoundingClientRect().left);
    const rect = this.sliderContainer.getBoundingClientRect();
    this.sliderStaticLeft = rect.left + this.lastScroll;
    this.sliderWidth = rect.width;
  }

  private setSlideWidth() {
    this.slides.forEach((slide) => {
      slide.style.width = "";
    });
    const widths = this.slides.map((slide) => slide.getBoundingClientRect().width);
    const max = widths.reduce((largest, width) => Math.max(largest, width), 0);
    this.slides.forEach((slide) => {
      slide.style.width = `${max}px`;
    });
    if (this.slidePlaceholder) {
      const screens = isCoarsePointer() ? 2 : 1;
      this.slidePlaceholder.style.width = `${max + window.innerWidth * screens}px`;
    }
    this.slideWidth = max;
    window.dispatchEvent(new Event("app:layout-change"));
  }

  private setNavObserver() {
    if (!this.sliderContainer) return;
    this.navScrollTrigger?.kill();
    const start = isCoarsePointer()
      ? `top-=${this.slideWidth / 2}`
      : `top-=${window.innerWidth / 2 + this.slideWidth / 2}`;
    this.navScrollTrigger = ScrollTrigger.create({
      trigger: this.sliderContainer,
      start,
      horizontal: true,
      onEnter: () => {
        if (this.navContainer) this.navContainer.dataset.state = "";
        this.sliderLines.forEach((line) => {
          line.dataset.state = "";
        });
      },
      onLeaveBack: () => {
        if (this.navContainer) this.navContainer.dataset.state = "hide";
        this.sliderLines.forEach((line) => {
          line.dataset.state = "hide";
        });
      },
    });
  }

  toggleVisibility(visible = true, index = -1) {
    if (this.navContainer) this.navContainer.dataset.state = visible ? "" : "hide";
    this.sliderLines.forEach((line) => {
      line.dataset.state = visible ? "" : "hide";
    });
    this.slidesTextsAnimation.forEach((animation) => (visible ? animation.play() : animation.reverse()));
    this.slidesImageAnimation.forEach((animation, imageIndex) => {
      if (imageIndex === index && index !== -1) return;
      visible ? animation.play() : animation.reverse();
    });
  }

  private handleClick(index: number) {
    this.toggleVisibility(false, index);
    window.dispatchEvent(new CustomEvent("app:show-detail", { detail: { index } }));
  }

  private handleMouseEnter(index: number) {
    window.dispatchEvent(new CustomEvent("app:slide-mouse-enter", { detail: { index } }));
  }

  private handleMouseLeave(index: number) {
    window.dispatchEvent(new CustomEvent("app:slide-mouse-leave", { detail: { index } }));
  }

  updateNav(scroll = 0) {
    if (!this.navProgressState) return;
    this.lastScroll = scroll;
    const traveled =
      -(this.sliderStaticLeft - scroll) + this.viewportWidth / 2 + this.slideWidth / 2;
    const progress = clampMap(traveled, 0, this.sliderWidth + this.slideWidth, 0, 1);
    const transform = `scale3d(${progress}, 1, 1)`;
    if (transform !== this.lastNavTransform) {
      this.navProgressState.style.transform = transform;
      this.lastNavTransform = transform;
    }
    const cursor = this.progressStateLeft + this.progressStateWidth * progress;
    this.navButtons.forEach((button, index) => {
      const state = cursor > this.navButtonsLeft[index] ? "passed" : "not-passed";
      if (state !== this.navButtonStates[index]) {
        button.dataset.state = state;
        this.navButtonStates[index] = state;
      }
    });
  }

  destroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("app:hide-detail", this.onHideDetail);
    this.navScrollTrigger?.kill();
    this.splits.forEach((split) => split.revert());
    this.slidesTextsAnimation.forEach((animation) => animation.kill());
    this.slidesImageAnimation.forEach((animation) => animation.kill());
  }
}

export class DetailScene {
  private container = document.querySelector<HTMLElement>('[data-slide-detail="container"]');
  private imageContainer = document.querySelector<HTMLElement>('[data-slide-detail="image"]');
  private dateStart = document.querySelector<HTMLElement>('[data-slide-detail="date-start"]');
  private dateEnd = document.querySelector<HTMLElement>('[data-slide-detail="date-end"]');
  private title = document.querySelector<HTMLElement>('[data-slide-detail="title"]');
  private description = document.querySelector<HTMLElement>('[data-slide-detail="description"]');
  private context = document.querySelector<HTMLElement>('[data-slide-detail="context"]');
  private influences = document.querySelector<HTMLElement>('[data-slide-detail="influences"]');
  private closeBtn = document.querySelector<HTMLElement>('[data-slide-detail="close"]');
  private introContainer = document.querySelector<HTMLElement>('[data-intro="container"]');
  private lines = document.querySelectorAll<HTMLElement>(
    '[data-slide-detail="separator"], [data-slide-detail="line"]',
  );
  private slidesImageContainer = gsap.utils.toArray<HTMLElement>('[data-slide="image-container"]');
  private slidesImage = gsap.utils.toArray<HTMLImageElement>('[data-slide="container"] [data-slide="image"]');
  private currentIndex = -1;
  private splits: SplitText[] = [];
  private animations: gsap.core.Timeline[] = [];
  private textsA: HTMLElement[] = [];
  private textsB: HTMLElement[] = [];
  private textsC: HTMLElement[] = [];
  private onShow = (event: Event) => {
    this.open((event as CustomEvent<{ index: number }>).detail.index);
  };
  private onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.container?.dataset.state === "show") this.close();
  };
  private onClose = () => this.close();

  init() {
    this.closeBtn?.addEventListener("click", this.onClose);
    window.addEventListener("keydown", this.onKey);
    window.addEventListener("app:show-detail", this.onShow);
  }

  private open(index: number) {
    if (!this.container || !this.imageContainer || !this.title || !this.closeBtn) return;
    const movement = movements[index];
    if (!movement) return;
    this.currentIndex = index;
    this.container.style.setProperty("--color-line-light", movement.colorLineLight);
    this.container.style.setProperty("--color-line-dark", movement.colorLineDark);
    this.title.textContent = movement.name;
    if (this.description) this.description.textContent = movement.description;
    if (this.dateStart) this.dateStart.textContent = String(movement.dateBegin);
    if (this.dateEnd) this.dateEnd.textContent = String(movement.dateEnd);
    if (this.context) this.context.textContent = movement.historicalContext;
    if (this.influences) {
      this.influences.innerHTML = movement.keyInfluences.map((item) => `<div>${item}</div>`).join("");
    }

    const date = document.querySelectorAll<HTMLElement>('[data-slide-detail="date"]');
    const title = document.querySelectorAll<HTMLElement>('[data-slide-detail="title"]');
    this.textsA = Array.from(document.querySelectorAll<HTMLElement>('[data-slide-detail="description"]'));
    this.textsB = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slide-detail="context"], [data-slide-detail="context-wrapper"] .slide-detail-subtitle'),
    );
    this.textsC = Array.from(
      this.influences?.querySelectorAll<HTMLElement>("div") ?? [],
    );
    const influenceSubtitle = document.querySelector<HTMLElement>(
      '[data-slide-detail="influences-wrapper"] .slide-detail-subtitle',
    );
    if (influenceSubtitle) this.textsC = [influenceSubtitle, ...this.textsC];

    const splitDate = new SplitText(date, { type: "chars", mask: "lines", maskClass: "line-wrapper" });
    const splitTitle = new SplitText(title, { type: "chars", mask: "lines", maskClass: "line-wrapper" });
    const splitA = new SplitText(this.textsA, { type: "lines", linesClass: "line-wrapper", deepSlice: true });
    const splitB = new SplitText(this.textsB, { type: "lines", linesClass: "line-wrapper", deepSlice: true });
    const splitC = new SplitText(this.textsC, { type: "lines", linesClass: "line-wrapper", deepSlice: true });
    this.splits = [splitDate, splitTitle, splitA, splitB, splitC];

    const rise = (targets: Element[], parts: Element[]) =>
      gsap
        .timeline({ paused: true })
        .set(targets, { visibility: "visible" })
        .fromTo(
          parts,
          { opacity: 0, yPercent: 100 },
          { opacity: 1, yPercent: 0, duration: 0.5, stagger: 0.025, ease: "power3.out" },
        );

    this.animations = [
      rise(Array.from(date), splitDate.chars),
      rise(Array.from(title), splitTitle.chars),
      rise(this.textsA, splitA.lines),
      rise(this.textsB, splitB.lines),
      rise(this.textsC, splitC.lines),
    ];

    if (this.introContainer) {
      gsap.to(this.introContainer, { autoAlpha: 0, duration: 0.75, ease: "power3.out" });
    }
    gsap.from(this.closeBtn, { autoAlpha: 0, duration: 0.75, ease: "power3.in" });

    const source = this.slidesImage[index];
    const slot = this.slidesImageContainer[index];
    const bounds = source.getBoundingClientRect();
    const state = Flip.getState(source);
    this.imageContainer.appendChild(source);
    slot.style.width = `${bounds.width}px`;
    Flip.from(state, { duration: 1.25, ease: "power4.inOut" });

    gsap.delayedCall(0.75, () => {
      this.animations.forEach((animation) => animation.play());
      this.lines.forEach((line) => {
        line.dataset.state = "";
      });
    });

    this.container.dataset.state = "show";
    this.closeBtn.focus({ preventScroll: true });
  }

  private close() {
    if (this.currentIndex < 0 || !this.container) return;
    const image = this.imageContainer?.querySelector("img");
    const slot = this.slidesImageContainer[this.currentIndex];
    if (!image || !slot) return;
    const state = Flip.getState(image);
    slot.appendChild(image);
    Flip.from(state, {
      duration: 1.25,
      ease: "power4.inOut",
      onStart: () => {
        this.animations.forEach((animation, index) => {
          if (index < 2) animation.reverse();
        });
        this.lines.forEach((line) => {
          line.dataset.state = "hide";
        });
        gsap.to([...this.textsA, ...this.textsB, ...this.textsC, this.closeBtn], {
          autoAlpha: 0,
          duration: 0.5,
          ease: "expo.in",
        });
        if (this.introContainer) {
          gsap.to(this.introContainer, { autoAlpha: 1, duration: 0.75, ease: "power3.in" });
        }
        window.dispatchEvent(
          new CustomEvent("app:hide-detail", { detail: { index: this.currentIndex } }),
        );
      },
      onComplete: () => {
        if (!this.container) return;
        this.container.dataset.state = "hide";
        slot.style.width = "";
        this.splits.forEach((split) => split.revert());
        this.splits = [];
        gsap.set(
          [this.closeBtn, ...this.textsA, ...this.textsB, ...this.textsC, this.dateStart, this.title],
          { clearProps: "all" },
        );
        if (this.title) this.title.textContent = "";
        if (this.description) this.description.textContent = "";
        if (this.dateStart) this.dateStart.textContent = "";
        if (this.dateEnd) this.dateEnd.textContent = "";
        if (this.context) this.context.textContent = "";
        if (this.influences) this.influences.innerHTML = "";
        slot.focus({ preventScroll: true });
        this.currentIndex = -1;
      },
    });
  }

  destroy() {
    this.closeBtn?.removeEventListener("click", this.onClose);
    window.removeEventListener("keydown", this.onKey);
    window.removeEventListener("app:show-detail", this.onShow);
    this.splits.forEach((split) => split.revert());
  }
}
