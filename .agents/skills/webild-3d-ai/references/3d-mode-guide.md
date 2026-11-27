# Webild 3D Mode Architecture & Implementation Guide

This guide documents the exact 3D architecture, components, and shader pipeline reverse-engineered from **Webild.io**.

---

## 1. Core Architecture Overview

Webild's "3D Mode" elevates standard web pages into Awwwards-style interactive experiences. It combines:
1. **Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`)**: The primary WebGL scene graph.
2. **GLTF/GLB Loader**: Dynamically loads 3D assets (`.glb` / `model/gltf-binary`) with Draco/Meshopt compression.
3. **Procedural Fallback Meshes**: When no custom `.glb` is uploaded, it procedurally generates floating metallic/glass geometric forms (Glossy Torus Knot, Icosahedron, or Origami Polyhedra).
4. **Camera Rig & Mouse Damping**: A smoothed cursor-following camera that adds organic parallax depth.
5. **Scroll Scrubbing**: Hooks 3D transforms (`rotation.y`, `position.y`, `scale`) directly to page scroll progress (using Lenis or ScrollTrigger).
6. **Fluid Grain & Shaders**: Post-processing or canvas overlay applying subtle film grain and chromatic aberration.

---

## 2. 3D Mode Canvas Engine (Three.js Vanilla & R3F)

### Vanilla Three.js Implementation (Zero-dependency & Framework-agnostic)

```javascript
class Webild3DScene {
  constructor(container, options = {}) {
    this.container = container;
    this.modelUrl = options.modelUrl || null;
    this.theme = options.theme || { primary: 0x1f5fe0, accent: 0x98f014, bg: 0x050608 };
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;

    this.init();
  }

  init() {
    // 1. Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 100);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 2. Lighting Rig (Studio Quality)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 5, 5);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(this.theme.accent, 3.0);
    rimLight.position.set(-5, -3, -2);
    this.scene.add(rimLight);

    // 3. Object Setup (Custom GLB or Procedural Glossy Knot)
    if (this.modelUrl && window.GLTFLoader) {
      new THREE.GLTFLoader().load(this.modelUrl, (gltf) => {
        this.mesh = gltf.scene;
        this.scene.add(this.mesh);
      });
    } else {
      // Webild Procedural Glossy Knot
      const geometry = new THREE.TorusKnotGeometry(1.1, 0.35, 128, 32, 2, 3);
      const material = new THREE.MeshPhysicalMaterial({
        color: this.theme.primary,
        metalness: 0.85,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        wireframe: false
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);

      // Particle Field
      this.addParticles();
    }

    // 4. Events
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('scroll', this.onScroll.bind(this));

    this.animate(0);
  }

  addParticles() {
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.035,
      transparent: true,
      opacity: 0.45
    });
    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  onMouseMove(e) {
    this.pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }

  onResize() {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate(time) {
    requestAnimationFrame(this.animate.bind(this));

    const t = time * 0.001;

    // Smooth camera damping
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.05;

    this.camera.position.x = this.pointer.x * 0.8;
    this.camera.position.y = this.pointer.y * 0.5;
    this.camera.lookAt(0, 0, 0);

    // 3D Object rotation + scroll scrub
    if (this.mesh) {
      this.mesh.rotation.y = t * 0.4 + this.scrollProgress * Math.PI * 4;
      this.mesh.rotation.x = Math.sin(t * 0.3) * 0.2 + this.pointer.y * 0.3;
      this.mesh.position.y = Math.sin(t * 1.2) * 0.12;
    }

    if (this.particles) {
      this.particles.rotation.y = t * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
```

---

## 3. Interactive Motion Components

### A. 3D Process Tilt Track (`ProcessTiltTrack`)
Applies authentic 3D perspective tilt to interactive cards as the mouse moves over them:
```css
.webild-card-3d {
  transform-style: preserve-3d;
  transition: transform 0.15s ease-out, box-shadow 0.3s ease;
  perspective: 1000px;
}
```
```javascript
function applyCard3DTilt(element) {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}
```

### B. Fluid Film Grain Overlay (`FluidGrain`)
Gives modern websites an analog, filmic agency quality:
```css
.fluid-grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
```

### C. Lenis Smooth Scrolling Engine
```html
<script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
<script>
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
</script>
```
