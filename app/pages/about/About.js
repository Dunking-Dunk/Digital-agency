import Page from "../../classes/Page.js";

export default class About extends Page {
  constructor() {
    super({
      element: ".about",
      elements: {
        wrapper: ".about__container",
      },
      id: "about",
    });
  }
}
