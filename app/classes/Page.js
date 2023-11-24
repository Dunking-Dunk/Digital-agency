import { each } from "lodash";
import gsap from "gsap";
import Prefix from "prefix";
import { clamp, lerp } from "../utils/math.js";
import DetectionManager from "./Detection.js";

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      loading: document.querySelector(".loading__container"),
      loadingSub: document.querySelector(".loading__sub"),
    };
    this.id = id;

    this.transformPrefix = Prefix("transform");
    this.transformMousePrefix = Prefix("transform");

    this.scroll = {
      current: 0,
      target: 0,
      limit: 0,
      ease: 0.05,
      position: 0,
    };
    this.mouse = {
      clientX: 0,
      clientY: 0,
    };
  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    each(this.selectorChildren, (selector, key) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList ||
        Array.isArray(selector)
      ) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = this.element.querySelectorAll(selector);
        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector);
        }
      }
    });
    this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight;
  }

  show() {
    return new Promise((resolve) => {
      this.animateIn = gsap.timeline();

      this.animateIn.fromTo(
        this.elements.loading,
        {
          scale: 3,
        },
        {
          duration: 1,
          scale: 0,
          ease: "power4.in",
        }
      );

      this.animateIn.call(() => {
        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();
      this.animateOut = gsap.timeline();
      this.animateOut.to(this.elements.loading, {
        duration: 1,
        scale: 3,
        ease: "power1.out",
        onComplete: resolve,
      });
    });
  }

  onTouchDown(event) {
    if (!DetectionManager.isMobile()) return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (!DetectionManager.isMobile()) return;

    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (this.start - y) * 3;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp(event) {
    if (!DetectionManager.isMobile()) return;

    this.isDown = false;
  }

  onResize() {
    if (this.elements?.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }
  }

  onWheel(event) {
    const speed = event.pixelY;
    this.scroll.target += speed;

    return speed;
  }

  onMouseMove(e) {
    this.mouse = {
      clientX: e.clientX - window.innerWidth * 0.5,
      clientY: e.clientY - window.innerHeight * 0.5,
    };

    this.elements.loading.style[
      this.transformMousePrefix
    ] = `translate3d(${this.mouse.clientX}px,${this.mouse.clientY}px,0) scale(0)`;
  }

  transform(element, y) {
    element.style[this.transformPrefix] = `translate3d(0, ${-Math.round(
      y
    )}px, 0)`;
  }

  update() {
    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    this.scroll.current = Math.floor(this.scroll.current);

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.transform(this.elements.wrapper, this.scroll.current);
    }

    this.scroll.last = this.scroll.current;
  }

  removeEventListeners() {
    // window.removeEventListener("mousewheel", this.onWheel);
    // window.removeEventListener("mousemove", this.onMouseMove);
  }

  destroy() {
    this.removeEventListeners();
  }
}
