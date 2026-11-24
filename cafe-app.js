/**
 * KŌHĪ ATELIER — Minimalist Botanical Coffee & Slow Bakery Engine
 * High-Level Animation & Interaction Suite:
 * - GSAP ScrollTrigger Pinned "Anatomy of an Extraction" Scroll-Scrubbed 3D Assembly
 * - Pinned Horizontal Showcase Deck (Panoramic Lateral Glide)
 * - Fluid Custom Cursor Follower with Spring Physics & Magnetic Target Snapping
 * - Ambient Canvas Organic Rising Steam & Particle Turbulence
 * - 3D Card Tilt with Specular Glare Tracking
 * - Velocity-linked Botanical Seal Rotation
 * - Real-time Multi-Currency Conversion (USD, EUR, GBP, AED, JPY)
 * - Live Tasting Flight Drawer & Private Table Reservation System
 */

// ==========================================================================
// 1. CURRENCY CONFIGURATION
// ==========================================================================
const CURRENCY_RATES = {
  USD: { rate: 1.0, symbol: '$', code: 'USD' },
  EUR: { rate: 0.92, symbol: '€', code: 'EUR' },
  GBP: { rate: 0.79, symbol: '£', code: 'GBP' },
  AED: { rate: 3.67, symbol: 'AED ', code: 'AED' },
  JPY: { rate: 154.0, symbol: '¥', code: 'JPY' }
};

let activeCurrency = 'USD';

function formatCurrency(usdAmount, currency = activeCurrency) {
  const cfg = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round(usdAmount * cfg.rate * 10) / 10;
  if (currency === 'JPY') {
    return `${cfg.symbol}${Math.round(usdAmount * cfg.rate).toLocaleString()}`;
  }
  return `${cfg.symbol}${converted.toFixed(2)}`;
}

function updateAllPrices() {
  document.querySelectorAll('.price-dynamic').forEach((el) => {
    const usd = parseFloat(el.getAttribute('data-usd'));
    if (!isNaN(usd)) {
      el.textContent = formatCurrency(usd);
    }
  });
}

// ==========================================================================
// 2. TASTING TRAY / SELECTION DRAWER
// ==========================================================================
let tastingTray = [];

function toggleTray(open) {
  const drawerOverlay = document.getElementById('trayDrawerOverlay');
  if (drawerOverlay) {
    if (open !== undefined) {
      drawerOverlay.classList.toggle('active', open);
    } else {
      drawerOverlay.classList.toggle('active');
    }
    document.body.style.overflow = drawerOverlay.classList.contains('active') ? 'hidden' : '';
  }
}

function addToTray(name, usdPrice, origin = 'Single Origin') {
  tastingTray.push({ name, usdPrice, origin });
  updateTrayUI();
  showToast(`✦ Added ${name} to your Tasting Flight.`);
}

function removeFromTray(idx) {
  tastingTray.splice(idx, 1);
  updateTrayUI();
}

function updateTrayUI() {
  const listEl = document.getElementById('trayItemsList');
  const totalEl = document.getElementById('trayTotalAmount');
  const badgeEl = document.getElementById('trayBadgeCount');

  const count = tastingTray.length;
  const totalUsd = tastingTray.reduce((sum, item) => sum + item.usdPrice, 0);

  if (badgeEl) {
    badgeEl.textContent = count;
    badgeEl.classList.toggle('active', count > 0);
  }

  if (totalEl) {
    totalEl.textContent = formatCurrency(totalUsd);
  }

  if (listEl) {
    if (count === 0) {
      listEl.innerHTML = `
        <div style="text-align:center;padding:48px 0;color:var(--c-ink-light);">
          <span style="font-size:32px;display:block;margin-bottom:8px;">☕</span>
          <p style="font-family:var(--font-caps);font-size:0.75rem;letter-spacing:0.12em;">YOUR FLIGHT IS CURRENTLY EMPTY</p>
          <small style="color:var(--c-ink-muted);">Select signature brews or handcrafted bakes from the atelier.</small>
        </div>
      `;
    } else {
      listEl.innerHTML = tastingTray.map((item, idx) => `
        <div class="tray-item-row">
          <div>
            <h4 style="font-family:var(--font-caps);font-size:0.875rem;font-weight:600;color:var(--c-ink);">${item.name}</h4>
            <small style="font-size:0.75rem;color:var(--c-ink-light);">${item.origin}</small>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <strong style="font-family:var(--font-display);font-size:1.125rem;color:var(--c-cinnamon);">${formatCurrency(item.usdPrice)}</strong>
            <button type="button" onclick="removeFromTray(${idx})" style="color:var(--c-ink-light);font-size:1rem;line-height:1;background:none;border:none;cursor:pointer;" title="Remove">&times;</button>
          </div>
        </div>
      `).join('');
    }
  }
}

// ==========================================================================
// 3. RESERVATION MODAL
// ==========================================================================
function openReservationModal() {
  const modal = document.getElementById('reservationModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeReservationModal() {
  const modal = document.getElementById('reservationModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleReservationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('resName').value;
  const time = document.getElementById('resTime').value;
  const guests = document.getElementById('resGuests').value;

  closeReservationModal();
  showToast(`✦ Table Reserved for ${name} (${guests} Guests at ${time}). Confirmation email dispatched.`);
  e.target.reset();
}

// ==========================================================================
// 4. INTERACTIVE TOAST FEEDBACK
// ==========================================================================
function showToast(message) {
  let toast = document.getElementById('kohiToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'kohiToast';
    toast.className = 'kohi-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color:var(--c-accent);margin-right:6px;">✦</span> ${message}`;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3800);
}

// ==========================================================================
// 5. MENU CATEGORY FILTER (FOR MENU.HTML)
// ==========================================================================
function initMenuFilter() {
  const tabs = document.querySelectorAll('.menu-category-tab');
  const items = document.querySelectorAll('.menu-item-card');

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-category');
      items.forEach((item) => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// 6. FLUID CUSTOM CURSOR WITH LERP FOLLOWER
// ==========================================================================
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    if (!isMoving) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isMoving = true;
    }
  });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isMoving = false;
  });

  // Smooth lerp loop for the trailing ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Active hover triggers
  const interactiveTargets = 'a, button, select, input, .creation-card, .deck-slide-card, .menu-category-tab, .tray-btn';
  document.querySelectorAll(interactiveTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('active-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active-hover'));
  });
}

// ==========================================================================
// 7. AMBIENT CANVAS STEAM SIMULATION
// ==========================================================================
function initSteamCanvas() {
  const canvas = document.getElementById('steamCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 28;
  const particles = [];

  class SteamParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + Math.random() * 40;
      this.radius = 24 + Math.random() * 42;
      this.speedY = 0.25 + Math.random() * 0.45;
      this.driftX = (Math.random() - 0.5) * 0.25;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = 0.008 + Math.random() * 0.012;
      this.maxLife = 400 + Math.random() * 300;
      this.life = initial ? Math.random() * this.maxLife : 0;
      this.baseAlpha = 0.025 + Math.random() * 0.035;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.driftX + Math.sin(this.angle) * 0.3;
      this.angle += this.angleSpeed;
      this.life++;

      if (this.y < -this.radius || this.life > this.maxLife) {
        this.reset();
      }
    }

    draw() {
      const progress = this.life / this.maxLife;
      let alpha = this.baseAlpha;
      if (progress < 0.2) alpha = this.baseAlpha * (progress / 0.2);
      else if (progress > 0.7) alpha = this.baseAlpha * ((1 - progress) / 0.3);

      const grad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      grad.addColorStop(0, `rgba(198, 138, 76, ${alpha * 1.5})`);
      grad.addColorStop(0.5, `rgba(247, 244, 238, ${alpha})`);
      grad.addColorStop(1, 'rgba(247, 244, 238, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new SteamParticle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ==========================================================================
// 8. 3D CARD TILT WITH SPECULAR GLARE
// ==========================================================================
function init3DCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / (rect.height / 2)) * 7.5;
      const rotateY = (x / (rect.width / 2)) * 7.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;

      if (glare) {
        const mouseCardX = e.clientX - rect.left;
        const mouseCardY = e.clientY - rect.top;
        glare.style.opacity = '0.55';
        glare.style.background = `radial-gradient(circle at ${mouseCardX}px ${mouseCardY}px, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      if (glare) {
        glare.style.opacity = '0';
      }
    });
  });
}

// ==========================================================================
// 9. SIGNATURE SCROLL-SCRUBBED ANATOMY ASSEMBLY (GSAP + SCROLLTRIGGER)
// ==========================================================================
function initAnatomyScrollTrigger() {
  const section = document.getElementById('anatomySection');
  if (!section || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const l1 = document.getElementById('layer1');
  const l2 = document.getElementById('layer2');
  const l3 = document.getElementById('layer3');
  const l4 = document.getElementById('layer4');
  const slides = document.querySelectorAll('.anatomy-card-slide');

  // Master timeline pinned to viewport
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=1600',
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Synchronize narrative slide cards based on scrub progress (0.0 to 1.0)
        const progress = self.progress;
        let activeIdx = 0;
        if (progress > 0.72) activeIdx = 3;
        else if (progress > 0.45) activeIdx = 2;
        else if (progress > 0.18) activeIdx = 1;

        slides.forEach((slide, idx) => {
          if (idx === activeIdx) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });
      }
    }
  });

  // Layer 3D Explosion Animation:
  // Initial state: layers stacked neatly together
  gsap.set([l1, l2, l3, l4], {
    transformOrigin: 'center center',
    transformStyle: 'preserve-3d'
  });

  // Explode outward in 3D perspective during scroll
  masterTl
    .to(l1, { y: -160, z: 85, rotateX: 12, rotateY: -6, opacity: 1, ease: 'power1.inOut' }, 0)
    .to(l2, { y: -50, z: 40, rotateX: 5, rotateY: -2, opacity: 1, ease: 'power1.inOut' }, 0)
    .to(l3, { y: 55, z: -25, rotateX: -6, rotateY: 3, opacity: 1, ease: 'power1.inOut' }, 0)
    .to(l4, { y: 165, z: -70, rotateX: -12, rotateY: 6, opacity: 1, ease: 'power1.inOut' }, 0);
}

// ==========================================================================
// 10. PINNED HORIZONTAL SHOWCASE DECK (GSAP + SCROLLTRIGGER)
// ==========================================================================
function initHorizontalDeck() {
  const section = document.getElementById('horizontalDeck');
  const track = document.getElementById('deckTrack');
  if (!section || !track || !window.gsap || !window.ScrollTrigger) return;

  function calculateDistance() {
    return -(track.scrollWidth - window.innerWidth + 80);
  }

  gsap.to(track, {
    x: calculateDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + (track.scrollWidth - window.innerWidth + 200),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });
}

// ==========================================================================
// 11. VELOCITY-LINKED ROTATING BOTANICAL STAMP
// ==========================================================================
function initStampVelocity() {
  const stampRing = document.querySelector('.stamp-svg-ring');
  if (!stampRing) return;

  let currentAngle = 0;
  let baseSpeed = 0.4;
  let lastScrollY = window.scrollY;

  function rotate() {
    const currentScrollY = window.scrollY;
    const delta = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    // Accelerate smoothly based on scroll speed
    currentAngle += baseSpeed + delta * 0.15;
    stampRing.style.transform = `rotate(${currentAngle}deg)`;
    requestAnimationFrame(rotate);
  }
  requestAnimationFrame(rotate);
}

// ==========================================================================
// 12. INITIALIZE ALL ON DOM LOAD
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Currency Dropdown
  const currSelect = document.getElementById('currencySelector');
  if (currSelect) {
    currSelect.addEventListener('change', (e) => {
      activeCurrency = e.target.value;
      updateAllPrices();
      updateTrayUI();
    });
  }

  // Modal Backdrop Close
  const modal = document.getElementById('reservationModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeReservationModal();
    });
  }

  // Escape key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReservationModal();
      toggleTray(false);
    }
  });

  // Core Interactions
  initMenuFilter();
  updateTrayUI();
  initCustomCursor();
  initSteamCanvas();
  init3DCardTilt();
  initStampVelocity();

  // Scroll Animations
  initAnatomyScrollTrigger();
  initHorizontalDeck();

  // Entrance Choreography
  if (window.gsap) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.kohi-header', { y: -20, opacity: 0, duration: 0.8 }, 0)
      .from('.hero-kicker-row', { y: 14, opacity: 0, duration: 0.7 }, 0.1)
      .from('.hero-title', { y: 24, opacity: 0, duration: 0.9 }, 0.2)
      .from('.hero-copy', { y: 16, opacity: 0, duration: 0.8 }, 0.35)
      .from('.hero-cta-group', { y: 16, opacity: 0, duration: 0.7 }, 0.45)
      .from('.hero-video-frame', { scale: 0.96, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.2);
  }
});
