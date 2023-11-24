import * as THREE from "three";
import * as dat from "dat.gui";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import VertexShader from "../../../shaders/home-particle/vertexShader.glsl";
import FragmentShader from "../../../shaders/home-particle/fragmentShader.glsl";
import { lerp, clamp } from "../../../utils/math.js";
import ParticleTexture from "../../../../shared/ParticleTexture.png";
import gsap from "gsap";

import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export default class Home {
  constructor({ scene, camera, renderer, composer, raycaster }) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;
    this.raycaster = raycaster;

    this.mouse = {
      current: 0,
      target: 0,
      limit: 1000,
      ease: 0.5,
    };

    this.params = {
      threshold: 0,
      strength: 0.4,
      radius: 0.5,
      exposure: 1,
    };

    this.particleSetting = {
      radius: 5,
      count: 15000,
      innerColor: "rgb(256,0,0)",
      outsideColor: "rgb(34, 4, 2)",
      lerp: 0.8,
    };

    this.points = null;
    this.pointer = new THREE.Vector3();

    this.setCamera();

    this.createLightBall();

    this.createParticleEffect();
    this.createEffects();

    this.createDatGui();
  }

  setCamera() {
    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 8,
    });
  }

  createLightBall() {
    this.lightBall = new THREE.Group();
    const sphere = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      emissive: 0xff0000,
      roughness: 0.5,
      metalness: 0.5,
    });
    const sphereMesh = new THREE.Mesh(sphere, sphereMaterial);

    this.lightBall.add(sphereMesh);

    const pointLight = new THREE.PointLight(0xff0000, 1, 10);
    this.lightBall.add(pointLight);
    this.scene.add(this.lightBall);
    this.lightBall.position.set(2, 0, 0);
  }

  createParticleEffect() {
    if (this.points !== null) {
      this.particlePointGeometry.dispose();
      this.particleMaterial.dispose();
      this.scene.remove(this.points);
    }

    this.particleCount = this.particleSetting.count;
    this.minRadius = 0.3;
    this.maxRadius = this.particleSetting.radius;

    this.particleGeometry = new THREE.PlaneBufferGeometry();
    this.particlePointGeometry = new THREE.InstancedBufferGeometry();
    this.particlePointGeometry.instanceCount = this.particleCount;
    this.particlePointGeometry.setAttribute(
      "position",
      this.particleGeometry.getAttribute("position")
    );
    this.particlePointGeometry.index = this.particleGeometry.index;

    this.particlePosition = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      let insideColor = new THREE.Color(this.particleSetting.innerColor);
      let outsideColor = new THREE.Color(this.particleSetting.outsideColor);

      let theta = Math.random() * 2 * Math.PI;
      let r = lerp(this.minRadius, this.maxRadius, Math.random());
      let x = r * Math.sin(theta);
      let y = Math.cos(theta) * Math.sin(theta) * r * 2;
      let z = r * Math.cos(theta);

      this.particlePosition.set([x, y, z], i * 3);

      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, r);
      this.particleColors.set(
        [mixedColor.r, mixedColor.g, mixedColor.b],
        i * 3
      );
    }
    this.particlePointGeometry.setAttribute(
      "pos",
      new THREE.InstancedBufferAttribute(this.particlePosition, 3, false)
    );
    this.particlePointGeometry.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(this.particleColors, 3, false)
    );

    this.particleMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      uniforms: {
        uTexture: {
          value: new THREE.TextureLoader().load(ParticleTexture),
        },
        uTime: {
          value: 0,
        },
        uLerp: {
          value: this.particleSetting.lerp,
        },
        resolution: {
          value: new THREE.Vector4(),
        },
        uMouse: { value: new THREE.Vector3() },
      },
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
    });

    this.points = new THREE.Mesh(
      this.particlePointGeometry,
      this.particleMaterial
    );

    this.scene.add(this.points);
    this.points.position.set(1, 0, 0);
  }

  createEffects() {
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.params.threshold;
    this.bloomPass.strength = this.params.strength;
    this.bloomPass.radius = this.params.radius;

    this.composer.addPass(this.bloomPass);
    // this.outputPass = new OutputPass(THREE.ReinhardToneMapping);
    // // this.composer.addPass(this.outputPass);
  }

  createDatGui() {
    var gui = new dat.GUI({ name: "hursun" });
    const folder1 = gui.addFolder("Bloom");
    folder1.add(this.params, "threshold", 0, 5).onChange((value) => {
      this.bloomPass.threshold = value;
    });
    folder1.add(this.params, "strength", 0, 10).onChange((value) => {
      this.bloomPass.strength = value;
    });
    folder1.add(this.params, "radius", 0, 100).onChange((value) => {
      this.bloomPass.radius = value;
    });
    folder1.add(this.params, "exposure", 0, 10).onChange((value) => {
      this.outputPass.toneMappingExposure = Math.pow(value, 4.0);
    });

    const particleEffect = gui.addFolder("Particle");
    particleEffect
      .add(this.particleSetting, "radius", 0, 10)
      .onFinishChange(this.createParticleEffect.bind(this));
    particleEffect
      .add(this.particleSetting, "count", 0, 100000)
      .onFinishChange(this.createParticleEffect.bind(this));
    particleEffect
      .add(this.particleSetting, "lerp", 0, 1)
      .onFinishChange(this.createParticleEffect.bind(this));
    particleEffect
      .addColor(this.particleSetting, "innerColor")
      .onFinishChange(this.createParticleEffect.bind(this));
    particleEffect
      .addColor(this.particleSetting, "outsideColor")
      .onFinishChange(this.createParticleEffect.bind(this));
  }

 
  onMouseMove(event) {
    this.pointer.x =
      ((2 * (event.clientX - window.innerWidth / 2)) / (window.innerWidth / 2)) + 1; 
    this.pointer.y =
      (-2 * (event.clientY - window.innerHeight / 2)) /
      (window.innerHeight / 2);
    this.pointer.z = 0;
    // console.log(this.pointer);
  }

  onWheel(event) {
    this.mouse.target += event.pixelY;
  }

  update(elapsedTime) {
    this.mouse.target = clamp(0, this.mouse.limit, this.mouse.target);
    this.mouse.current = lerp(
      this.mouse.current,
      this.mouse.target,
      this.mouse.ease
    );
    if (this.mouse.current < 0) {
      this.mouse.current = 0;
    }


    this.camera.lookAt(this.lightBall.position);
    this.particleMaterial.uniforms.uTime.value = elapsedTime;
    this.particleMaterial.uniforms.uMouse.value = this.pointer;
  }
}
