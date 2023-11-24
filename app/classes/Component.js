import { each } from "lodash";

export default class Component {
  constructor({ element, elements }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
    };

    this.create();
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
  }
}
