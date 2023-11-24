import HoverAnimation from "../classes/HoverAnimation.js";
import gsap from "gsap";

export default class HoverLink extends HoverAnimation {
  constructor({ element }) {
    super({ element });
    this.element = element;
  }

  onHover(x, y) {
    gsap.to(this.element, {
      x: (x - this.x) * 0.7,
      y: (y - this.y) * 0.7,
      scale: 1.15,
      ease: "power2.out",
      duration: 0.4,
    });
    this.element.style.zIndex = 10;
  }

  onLeave() {
    gsap.to(this.element, {
      x: 0,
      y: 0,
      scale: 1,
      ease: "elastic.out(1.2, 0.4)",
      duration: 0.7,
    });
    this.element.style.zIndex = 1;
  }
}
