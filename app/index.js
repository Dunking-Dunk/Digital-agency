import AutoBind from "auto-bind";
import { each } from "lodash";
import normalizeWheel from "normalize-wheel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

import Navigation from "./components/Navigation.js";
import Canvas from "./components/canvas/index.js";

import Home from "./pages/home/Home.js";
import About from "./pages/about/About.js";

class App {
  constructor() {
    AutoBind(this);

    this.createContent();
    this.createNavigation();
    this.createCanvas();
    this.createPages();

    this.addLinkListeners();
    this.addEventListeners();

    this.onResize();
    this.update();
  }

  createPreloader() { }

  createNavigation() {
    this.navigation = new Navigation({ template: this.template });
  }

  createCanvas() {
    this.canvas = new Canvas();
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  createPages() {
    this.pages = {
      home: new Home(),
      about: new About(),
    };

    this.page = this.pages[this.template];

    this.page.create();
  }

  async onChange(url, push = true) {
    await this.page.hide();

    const request = await window.fetch(url);

    if (request.status === 200) {
      const html = await request.text();
      const div = document.createElement("div");

      if (push) {
        window.history.pushState({}, "", url);
      }

      div.innerHTML = html;

      const divContent = div.querySelector(".content");
      this.template = divContent.getAttribute("data-template");
      this.content.setAttribute("data-template", this.template);

      this.navigation.onChange(this.template);

      this.content.innerHTML = divContent.innerHTML;

      this.navigation.onChange(this.template);

      this.page = this.pages[this.template];
      this.page.create();
      this.page.createScrollTrigger()
      this.onResize();

      this.page.show();
      this.addLinkListeners();
    }
  }

  createScrollTrigger() {
    gsap.registerPlugin(ScrollTrigger)
  }

  addLinkListeners() {
    const links = document.querySelectorAll("a");
    each(links, (link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const { href } = link;
        this.onChange(href);
      };
    });
  }

  addEventListeners() {
    window.addEventListener("mousedown", this.onTouchDown, { passive: true });
    window.addEventListener("mousemove", this.onTouchMove, { passive: true });
    window.addEventListener("mouseup", this.onTouchUp, { passive: true });

    window.addEventListener("touchstart", this.onTouchDown, { passive: true });
    window.addEventListener("touchmove", this.onTouchMove, { passive: true });
    window.addEventListener("touchend", this.onTouchUp, { passive: true });

    window.addEventListener("pointermove", this.onMouseMove.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  onTouchDown(event) {
    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }
  }

  onTouchMove(event) {
    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event);
    }
  }

  onTouchUp(event) {
    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event);
    }
  }

  onMouseMove(event) {
    if (this.navigation && this.navigation.onMouseMove) {
      this.navigation.onMouseMove(event);
    }
    if (this.page && this.page.onMouseMove) {
      this.page.onMouseMove(event);
    }
    if (this.canvas && this.canvas.onMouseMove) {
      this.canvas.onMouseMove(event);
    }
  }

  onWheel(event) {
    const scrollwheel = normalizeWheel(event);
    if (this.page && this.page.onWheel) {
      this.page.onWheel(scrollwheel);
    }
    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(scrollwheel);
    }
  }

  onResize(event) {
    if (this.page && this.page.onResize) {
      this.page.onResize(event);
    }
    if (this.navigation && this.navigation.onResize) {
      this.navigation.onResize();
    }
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }
  }

  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }
    if (this.canvas && this.canvas.update) {
      this.canvas.update();
    }
    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }
}

new App();
