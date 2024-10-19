import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { WorkInfo } from '../models/work-info';

@Component({
  selector: 'app-earth',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './earth.component.html',
  styleUrls: ['./earth.component.scss'],
})
export class EarthComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private earthGroup!: THREE.Group;
  private earthMesh!: THREE.Mesh;
  private lightsMesh!: THREE.Mesh;
  private cloudsMesh!: THREE.Mesh;
  private glowMesh!: THREE.Mesh;
  private flashSpeed: number = 0.05; // Speed of the flashing
  private maxFlashIntensity: number = 1.0; // Maximum color intensity
  private minFlashIntensity: number = 0.3; // Minimum color intensity
  private flashDirection: number = 1; // Direction of the intensity change
  private raycaster: THREE.Raycaster = new THREE.Raycaster();
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private dialogOpen: boolean = false; // Flag to track dialog state

  constructor(private dialog: MatDialog) {
    this.getStarfield();
    this.getFresnelMat();
  }

  openDialog(info: any): void {
    console.log('Opening dialog with info:', info); // Add this line
    if (!this.dialogOpen) {
      // Check if the dialog is not already open
      this.dialogOpen = true; // Set flag to true when the dialog opens

      // Declare dialogRef here
      const dialogRef = this.dialog.open(PinDialogComponent, {
        data: { info },
        panelClass: 'dialog-wrapper',
      });

      // Reset dialogOpen to false when the dialog is closed
      dialogRef.afterClosed().subscribe(() => {
        this.dialogOpen = false; // Reset the flag
      });
    }
  }

  ngOnInit(): void {
    window.addEventListener('click', (event) => this.onClick(event));
  }

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.animate();
  }

  onClick(event: MouseEvent): void {
    // Convert mouse coordinates to normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(
      this.earthGroup.children
    );

    console.log('Intersects:', intersects); // Debugging line

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      console.log('Intersected Pin:', intersectedObject); // Debugging line

      // Check if the clicked object is a pin (you might need to adjust this based on how you're structuring your objects)
      // Check if the clicked object is a click box
      if (intersectedObject.name.startsWith('clickBox_')) {
        console.log('YOU DID IT!');
        const locationData = intersectedObject.userData; // Access userData from the click box
        console.log('On click log...');
        console.log(locationData);
        this.openDialog(locationData); // Open the dialog with the specific info
      }
    }
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
    this.camera.position.z = 3;
    this.camera.position.y = 1.5;

    // Area
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    // Set min and max distance for zoom
    this.controls.minDistance = 2; // Minimum distance to the globe
    this.controls.maxDistance = 4; // Optional: Maximum distance from the globe

    // Earth
    // Group
    this.earthGroup = new THREE.Group(); // create a group to hold all the meshes
    this.scene.add(this.earthGroup);
    this.earthGroup.rotation.z = (-10 * Math.PI) / 180;
    const detail = 12;
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    // daytime earth
    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load('assets/textures/8081_earthmap10k.jpg'),
      specularMap: loader.load('assets/textures/8081_earthspec10k.jpg'),
      bumpMap: loader.load('assets/textures/8081_earthbump10k.jpg'),
      bumpScale: 50,
    });
    this.earthMesh = new THREE.Mesh(geometry, earthMat);
    this.earthGroup.add(this.earthMesh);
    // nightime earth
    const lightsMat = new THREE.MeshBasicMaterial({
      map: loader.load('assets/textures/8081_earthlights10k.jpg'),
      blending: THREE.AdditiveBlending,
    });
    this.lightsMesh = new THREE.Mesh(geometry, lightsMat);
    this.earthGroup.add(this.lightsMesh);
    // clouds on earth
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load('assets/textures/clouds.jpg'),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    this.cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    this.cloudsMesh.scale.setScalar(1.005);
    this.earthGroup.add(this.cloudsMesh);
    // glow on earth
    const fresnelMat = this.getFresnelMat();
    this.glowMesh = new THREE.Mesh(geometry, fresnelMat);
    this.glowMesh.scale.setScalar(1.01);
    this.earthGroup.add(this.glowMesh);

    // map
    // pins
    // Create and add the map pin to the earthGroup
    this.addMapPins();

    // scene
    // lighting
    const stars = this.getStarfield({ numStars: 2000 });
    this.scene.add(stars);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(3, 4, 1);
    this.scene.add(sunLight);

    // Resize listener
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    this.cloudsMesh.rotation.y += -0.001; // negative number to make clouds slower
    this.earthGroup.rotation.y += 0.002;

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

  getStarfield({ numStars = 1500 } = {}) {
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

  // map pins as patches & photos
  addMapPins(): void {
    const locations = [
      {
        lat: 28.7416,
        lon: 183,
        info: {
          jobTitle: 'IT Apprentice',
          jobLocation: 'Biloxi, Mississippi',
          image: 'assets/patches/336.png',
        },
      }, // Mississippi
      {
        lat: 36.257,
        lon: 168,
        info: {
          jobTitle: 'Knowledge Manager',
          jobCompany: '55th Communications Squadron',
          jobLocation: 'Offutt AFB - Omaha, Nebraska',
          jobDates: '2017-2021',
          jobDetails: [
            {
              jobDuty: 'SharePoint Admin',
              jobDetails: [
                'Project lead for development of COVID-19 tracking site and Airman promotion dashboard',
                'Led monthly training for 200+ delegates on SharePoint best practices and security measures',
                'Promoted organization process improvement techniques with collaboration management tools',
              ],
            },
            {
              jobDuty: 'Records Manager',
              jobDetails: [
                "Conducted quarterly audits to ensure compliance with record's disposition schedules",
                'Managed data life-cycle; inventoried, destroyed and archived over 90,000 records',
              ],
            },
            {
              jobDuty: 'Cybersecurity Liaison',
              jobDetails: [
                'Administered AFNet domain access utilizing Information Assurance Officer (IAO) Express',
                'JPAS experience verifying security clearance information and certification',
              ],
            },
          ],
          image: 'assets/patches/55.png',
        },
      }, // Omaha
      {
        lat: 12,
        lon: 310,
        info: {
          jobTitle: 'Executive Admin',
          jobLocation: 'Djibouti, Africa',
          image: 'assets/patches/449.png',
        },
      }, // Djibouti
      {
        lat: 25,
        lon: 398,
        info: {
          jobTitle: 'Data Operations Supervisor',
          jobLocation: 'Okinawa, Japan',
          image: 'assets/patches/390.png',
        },
      }, // Okinawa
    ];

    locations.forEach((location, index) => {
      const { lat, lon, info } = location;

      // Convert latitude and longitude to radians
      const latRad = THREE.MathUtils.degToRad(lat);
      const lonRad = THREE.MathUtils.degToRad(lon);

      // Calculate the position on the sphere
      const radius = 1.1; // Adjust if needed based on the size of your Earth
      const x = radius * Math.cos(latRad) * Math.sin(lonRad);
      const y = radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.cos(lonRad);

      // Load the image for the sprite
      const texture = new THREE.TextureLoader().load(info.image);

      // Create the sprite material
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);

      // Set the position of the sprite
      sprite.position.set(x, y, z);

      // Scale the sprite to a suitable size
      sprite.scale.set(0.2, 0.2, 1); // Adjust the size as needed

      // Ensure the sprite faces outward from the globe's center
      sprite.lookAt(50, 10, 10);

      // Add user data to the sprite for interaction
      sprite.userData = info;

      // Name the sprite for identification in raycasting
      sprite.name = `clickBox_${info.jobLocation}`;

      // Add the sprite to the earthGroup
      this.earthGroup.add(sprite);
    });
  }
}
