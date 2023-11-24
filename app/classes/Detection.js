class Detection {
  isMobile() {
    if (!this.isMobileChecked) {
      this.isMobileChecked = true;

      this.isMobileCheck =
        document.documentElement.classList.contains("mobile");
    }

    return this.isMobileCheck;
  }
}

const DetectionManager = new Detection();

export default DetectionManager;
