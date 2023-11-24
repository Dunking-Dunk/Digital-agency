import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

import Home from "./home/index.js";

export default class Three {
  constructor() {
    this.canvas = document.querySelector(".webgl");

    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.createScene();
    this.createCamera();
    this.createControl();
    this.createClock();
    this.createLight();
    this.createRayCaster();
    this.createRenderer();
    this.createEffectComposer();
    this.createHome();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.size.width / this.size.height,
      0.1,
      1000
    );
  }

  createHome() {
    this.home = new Home({
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      composer: this.composer,
      raycaster: this.raycaster,
    });
  }

  createControl() {
    this.control = new OrbitControls(this.camera, this.canvas);
    this.control.enableDamping = true;
  }

  createClock() {
    this.clock = new THREE.Clock();
  }

  createLight() {
    this.light = new THREE.AmbientLight("white", 10);
    this.scene.add(this.light);
  }

  createRayCaster() {
    this.raycaster = new THREE.Raycaster();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor("#000000");
  }

  createEffectComposer() {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
  }

  onMouseMove(event) {
    if (this.home.onMouseMove) {
      this.home.onMouseMove(event);
    }
  }

  onWheel(event) {
    if (this.home.onWheel && this.home) {
      this.home.onWheel(event);
    }
  }

  onResize() {
    this.size.width = window.innerWidth;
    this.size.height = window.innerHeight;

    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.size.width, this.size.height);
    this.composer.setSize(this.size.width, this.size.height);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();

    if (this.control) {
      this.control.update();
    }

    if (this.home && this.home.update) {
      this.home.update(elapsedTime);
    }

    // this.raycaster.setFromCamera(this.pointer, this.camera);
    this.composer.render();
  }
}
