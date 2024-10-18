import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-earth',
  standalone: true,
  imports: [],
  templateUrl: './earth.component.html',
  styleUrls: ['./earth.component.scss'],
})
export class EarthComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private earthGroup!: THREE.Mesh;
  private earthMesh!: THREE.Mesh;
  private lightsMesh!: THREE.Mesh;
  private cloudsMesh!: THREE.Mesh;
  private glowMesh!: THREE.Mesh;

  constructor() {
    this.getStarfield();
    this.getFresnelMat();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.animate();
  }

  initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio for high DPI screens
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Earth Group
    const earthGroup = new THREE.Group(); // create a group to hold all the meshes
    this.scene.add(earthGroup);
    earthGroup.rotation.z = (-12.4 * Math.PI) / 180;
    const detail = 12;
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    // daytime earth
    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load('assets/textures/8081_earthmap10k.jpg'),
    });
    this.earthMesh = new THREE.Mesh(geometry, earthMat);
    earthGroup.add(this.earthMesh);
    // nightime earth
    const lightsMat = new THREE.MeshBasicMaterial({
      map: loader.load('assets/textures/8081_earthlights10k.jpg'),
      blending: THREE.AdditiveBlending,
    });
    this.lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(this.lightsMesh);
    // clouds on earth
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load('assets/textures/clouds.jpg'),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    this.cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    this.cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(this.cloudsMesh);
    // glow on earth
    const fresnelMat = this.getFresnelMat();
    this.glowMesh = new THREE.Mesh(geometry, fresnelMat);
    this.glowMesh.scale.setScalar(1.01);
    earthGroup.add(this.glowMesh);

    // lighting
    const stars = this.getStarfield({ numStars: 2000 });
    this.scene.add(stars);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    // sunLight.position.set(-1, 0.5, 1.5);
    sunLight.position.set(-3, 2, 5);
    this.scene.add(sunLight);

    // Resize listener
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    // Rotate the Earth
    this.earthMesh.rotation.y += 0.002;
    this.lightsMesh.rotation.y += 0.002;
    this.cloudsMesh.rotation.y += 0.003;

    // Update controls
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio); // Update pixel ratio on resize
  }

  getStarfield({ numStars = 500 } = {}) {
    function randomSpherePoint() {
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      let x = radius * Math.sin(phi) * Math.cos(theta);
      let y = radius * Math.sin(phi) * Math.sin(theta);
      let z = radius * Math.cos(phi);

      return {
        pos: new THREE.Vector3(x, y, z),
        hue: 0.6,
        minDist: radius,
      };
    }
    const verts = [];
    const colors = [];
    const positions = [];
    let col;
    for (let i = 0; i < numStars; i += 1) {
      let p = randomSpherePoint();
      const { pos, hue } = p;
      positions.push(p);
      col = new THREE.Color().setHSL(hue, 0.2, Math.random());
      verts.push(pos.x, pos.y, pos.z);
      colors.push(col.r, col.g, col.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      map: new THREE.TextureLoader().load('assets/textures/circle.png'),
    });
    const points = new THREE.Points(geo, mat);
    return points;
  }

  getFresnelMat({ rimHex = 0xadd8e6, facingHex = 0x000000 } = {}) {
    const uniforms = {
      color1: { value: new THREE.Color(rimHex) },
      color2: { value: new THREE.Color(facingHex) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    };
    const vs = `
  uniform float fresnelBias;
  uniform float fresnelScale;
  uniform float fresnelPower;

  varying float vReflectionFactor;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

    vec3 I = worldPosition.xyz - cameraPosition;

    vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );

    gl_Position = projectionMatrix * mvPosition;
  }
  `;
    const fs = `
  uniform vec3 color1;
  uniform vec3 color2;

  varying float vReflectionFactor;

  void main() {
    float f = clamp( vReflectionFactor, 0.0, 1.0 );
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
  }
  `;
    const fresnelMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
      // wireframe: true,
    });
    return fresnelMat;
  }
}
