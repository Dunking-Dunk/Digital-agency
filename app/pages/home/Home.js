import Page from "../../classes/Page.js";

export default class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        wrapper: ".home__container",
      },
      id: "home",
    });
  }
}
