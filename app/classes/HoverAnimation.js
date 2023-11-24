import gsap from "gsap";

export default class HoverAnimation {
  constructor({ element }) {
    this.element = element;
    this.hover = false;
    this.onResize();
  }

  onResize() {
    gsap.set(this.element, {
      x: 0,
      y: 0,
      scale: 1,
    });
    const box = this.element.getBoundingClientRect();
    this.x = box.left + box.width * 0.5;
    this.y = box.top + box.height * 0.5;

    this.width = box.width;
    this.height = box.height;
  }

  onMouseMove(e) {
    let hover = false;
    let hoverArea = 1;
    let x = e.clientX - this.x;
    let y = e.clientY - this.y;
    let distance = Math.sqrt(x * x + y * y);

    if (distance < this.width * hoverArea) {
      hover = true;
      if (!this.hover) {
        this.hover = true;
      }
      this.onHover(e.clientX, e.clientY);
    }

    if (!hover && this.hover) {
      this.onLeave();
      this.hover = false;
    }
  }

  onHover(x, y) {}

  onLeave() {}
}
