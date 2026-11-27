---
name: webild-3d-ai
description: Generates high-converting, award-level websites with 3D modes, cinematic motion graphics, scroll-driven storytelling, and agency-grade design inspired by Webild.io. Use whenever the user asks for Webild websites, 3D interactive web experiences, luxury templates, or prompt-to-website vibe-coding.
---

# Webild AI Website & 3D Engineering Skill

This skill reproduces the complete website generation architecture, design intelligence, and 3D mode of **Webild.io** for free.

## Core Capabilities
1. **Natural Language to Full Production Website**: Turns single-line business prompts into 8-10 section modern websites.
2. **3D Mode by Default**: Implements interactive Three.js WebGL scenes with camera parallax damping, GLTF 3D model loaders, and procedural floating geometric forms.
3. **59 Industry Templates**: Pre-configured design tokens, color systems, and component structures across 25+ industries (Real Estate, Cafe, Detailing, Agency, Roofing, Portfolio, SaaS, Med Spa, etc.).
4. **Cinematic Micro-Interactions**:
   - `ProcessTiltTrack`: 3D card tilt on hover (`perspective(1000px) rotateX/Y`).
   - `FluidGrain`: Analog filmic noise overlay.
   - `LenisSmoothScroll`: Inertia 60 FPS scrolling.
   - `ScrollObject`: Scrubbing 3D object rotation to scroll position.

---

## 1. Webild Aesthetic & Color Systems

Webild designs avoid generic corporate white-and-blue layouts. Instead, choose one of these two signature design palettes:

### A. Dark Obsidian Luxury (Agency, Detailing, Tech, SaaS, Nightlife)
- **Background**: `#050608` or `#0a0b0e`
- **Surface / Card**: `#111318` with hairline border `rgba(255, 255, 255, 0.08)`
- **Foreground / Text**: `#ffffff` (primary), `rgba(255, 255, 255, 0.65)` (muted)
- **Electric Accents**:
  - Cyber Lime: `#98f014`
  - Cobalt Blue: `#1f5fe0`
  - Neon Cyan: `#00f0ff`
  - Champagne Gold: `#d4af37`

### B. Warm Editorial Cream (Boutique, Cafe, Med Spa, Beauty, Real Estate)
- **Background**: `#faf8f5` or `#f5efe6`
- **Card**: `#ffffff` with warm border `#e8e0d5`
- **Text**: `#1a1a1a`
- **Accent**: `#c9a96e` (warm gold) or `#3d2b1f` (espresso)

---

## 2. Standard 8-Section Architecture

Every generated Webild site MUST follow this high-converting storytelling structure:

1. **Floating Navigation Header**:
   - Blur backdrop (`backdrop-filter: blur(16px)`)
   - Logo + Links + "Book Now / Get Started" pill button
2. **Hero Section (with 3D Canvas or Video Scroll)**:
   - Left / Top: Eyebrow badge, massive display headline (e.g. `text-[7vw]` or `clamp(40px, 8vw, 84px)`), subtext, primary CTA
   - Right / Background: Live Three.js 3D Canvas with procedural glossy knot or 3D model
3. **Interactive Marquee / Ticker Rail**:
   - Infinite horizontal scrolling brand badges, partners, or verified metrics
4. **Bento Grid Showcase / Services**:
   - Multi-span asymmetrical cards featuring 3D hover tilt (`ProcessTiltTrack`)
5. **Interactive Feature / Storytelling Section**:
   - Sticky scroll reveal, tabbed folders (`PricingFolderTabs`), or video reel
6. **Social Proof & Metrics**:
   - Animated count-up counters, client reviews with star ratings
7. **Conversion Funnel / Booking Form**:
   - One-tap WhatsApp or booking inquiry form with instant feedback
8. **Master Footer (`FooterRulerIndex`)**:
   - Full branding, links, copyright, and subtle ambient glow

---

## 3. Webild 3D Mode Code Template

When building or embedding the 3D mode into any webpage, include this Three.js canvas engine:

```html
<div id="webild-3d-stage" class="absolute inset-0 pointer-events-none z-0"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function initWebild3D() {
  const container = document.getElementById('webild-3d-stage');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // Studio Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(5, 5, 5);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x98f014, 2.5); // Accent light
  rim.position.set(-5, -3, -2);
  scene.add(rim);

  // Webild Procedural Glossy Knot
  const geo = new THREE.TorusKnotGeometry(1.0, 0.32, 120, 32);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x1f5fe0,
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1.0,
    reflectivity: 0.9
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Floating Dust Particles
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(100 * 3);
  for (let i = 0; i < 300; i++) pPos[i] = (Math.random() - 0.5) * 10;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.4 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Mouse & Scroll Parallax
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function render(time) {
    requestAnimationFrame(render);
    const t = time * 0.001;

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    camera.position.x = mouse.x * 0.7;
    camera.position.y = mouse.y * 0.4;
    camera.lookAt(0, 0, 0);

    mesh.rotation.y = t * 0.35 + scrollY * Math.PI * 3;
    mesh.rotation.x = Math.sin(t * 0.3) * 0.2 + mouse.y * 0.2;
    mesh.position.y = Math.sin(t * 1.4) * 0.1;

    particles.rotation.y = t * 0.04;

    renderer.render(scene, camera);
  }
  render(0);
})();
</script>
```

---

## 4. Top Webild Templates Reference

Consult `references/templates-catalog.json` for all 59 templates. Key highlights:
- **Luxury Real Estate**: Video scroll hero, text fill about, parallax property cards.
- **Coffee Shop / Cafe**: Floating cards, cursor trail, filterable menu, warm crema palette.
- **Detailing Studio**: Cinematic dark, hotspot interactive 3D, before/after slider.
- **Digital Agency**: Vertical marquee hero, bento services, work showcase carousel.
- **SaaS Platform**: Isometric mockups, animated metrics count-up, pricing toggle.

---

## 5. Output Format When Prompted

When the user asks to build or generate a website using Webild style:
1. Deliver clean, ready-to-run HTML5 with Tailwind CSS + Three.js.
2. Include the real interactive 3D WebGL canvas.
3. Add the Lenis smooth scrolling engine and 3D card tilt physics.
4. Ensure full mobile responsiveness and accessibility.
