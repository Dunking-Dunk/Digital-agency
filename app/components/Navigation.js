import { each, map } from "lodash";
import GSAP from "gsap";
import Component from "../classes/Component.js";
import HoverLink from "../animations/HoverLink.js";

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      element: ".navigation",
      elements: {
        items: ".navigation__list__item",
        links: ".navigation__list__link",
      },
    });
    this.onChange(template);
    this.createAnimations();
  }

  onChange(template) {}

  createAnimations() {
    this.animations = map(this.elements.links, (selector) => {
      return new HoverLink({ element: selector });
    });
  }

  onResize() {
    each(this.animations, (selector) => {
      selector.onResize();
    });
  }

  onMouseMove(event) {
    each(this.animations, (selector) => {
      selector.onMouseMove(event);
    });
  }
}
