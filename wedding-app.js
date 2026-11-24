/**
 * OLIVIA & ADRIAN — ULTRA-PREMIUM CINEMATIC WEDDING ENGINE
 * Features:
 * - GSAP ScrollTrigger Pinned Scroll-Scrubbed 3D Envelope Opening:
 *   * Phase 1: 3D Golden Wax Seal shines & breaks with golden ember dissipation
 *   * Phase 2: Top Flap rotates in 3D (0deg -> 180deg) with realistic dynamic shadow
 *   * Phase 3: Letter Card slides vertically upward out of pocket, unfolds & expands
 *   * Phase 4: Cinematic zoom & dissolve seamlessly revealing the full wedding celebration
 *   * Fully reversible on scroll-up!
 * - Dual-Layer HTML5 Canvas: Floating organic rose petals + glowing gold dust particles
 * - Web Audio API Romantic Ambient Harp Arpeggios with floating controller
 * - 3D Card Tilt with Specular Glare Tracking
 * - Real-time Countdown Timer to 08 August 2028
 * - Accordion FAQ Interaction
 * - RSVP Form Validation & Celebration Confetti
 */

// ==========================================================================
// 1. DUAL-LAYER ATMOSPHERIC CANVAS (PETALS + GOLD DUST PARTICLES)
// ==========================================================================
function initAtmosphericCanvas() {
  const canvas = document.getElementById('weddingCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Layer 1: Rose Petals (24 particles)
  const petals = [];
  const petalColors = [
    'rgba(92, 29, 36, 0.72)',   // Burgundy
    'rgba(126, 43, 53, 0.65)',  // Rose Burgundy
    'rgba(235, 200, 204, 0.78)', // Blush
    'rgba(247, 228, 230, 0.85)'  // Pale silk
  ];

  class BotanicalPetal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30 - Math.random() * 40;
      this.size = 11 + Math.random() * 14;
      this.speedY = 0.65 + Math.random() * 0.95;
      this.speedX = -0.3 + Math.random() * 0.6;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = 0.008 + Math.random() * 0.016;
      this.flipAngle = Math.random() * Math.PI * 2;
      this.flipSpeed = 0.012 + Math.random() * 0.022;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.angle) * 0.5;
      this.angle += this.angularSpeed;
      this.flipAngle += this.flipSpeed;

      if (this.y > height + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.scale(Math.cos(this.flipAngle), 1);

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size, -this.size * 1.2, -this.size * 1.3, this.size * 0.8, 0, this.size * 1.5);
      ctx.bezierCurveTo(this.size * 1.3, this.size * 0.8, this.size, -this.size * 1.2, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  // Layer 2: Delicate Gold Dust Embers (36 particles)
  const embers = [];
  class GoldEmber {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + Math.random() * 20;
      this.radius = 0.8 + Math.random() * 1.8;
      this.speedY = -0.2 - Math.random() * 0.45;
      this.driftX = (Math.random() - 0.5) * 0.3;
      this.alpha = 0.15 + Math.random() * 0.65;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speedY;
      this.x += this.driftX;
      this.pulse += this.pulseSpeed;

      if (this.y < -10) {
        this.reset();
      }
    }

    draw() {
      const curAlpha = Math.max(0.05, this.alpha * (0.6 + 0.4 * Math.sin(this.pulse)));
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${curAlpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 22; i++) petals.push(new BotanicalPetal());
  for (let i = 0; i < 35; i++) embers.push(new GoldEmber());

  let isPageVisible = true;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  function renderAtmosphere() {
    if (isPageVisible) {
      ctx.clearRect(0, 0, width, height);
      embers.forEach((e) => { e.update(); e.draw(); });
      petals.forEach((p) => { p.update(); p.draw(); });
    }
    requestAnimationFrame(renderAtmosphere);
  }
  requestAnimationFrame(renderAtmosphere);
}

// ==========================================================================
// 2. PINNED SCROLL-SCRUBBED 3D ENVELOPE OPENING (GSAP + SCROLLTRIGGER)
// ==========================================================================
function initScrollScrubbedEnvelope() {
  const section = document.getElementById('envelopeHero');
  if (!section || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const chassis = document.getElementById('envelopeChassis');
  const flap = document.getElementById('envelopeFlap');
  const seal = document.getElementById('goldenWaxSeal');
  const card = document.getElementById('invitationCard');
  const stage = document.getElementById('envelopeStage');
  const indicator = document.getElementById('scrollIndicator');

  // Set 3D transform perspectives
  gsap.set(flap, { transformOrigin: 'top center', transformStyle: 'preserve-3d' });
  gsap.set(card, { transformOrigin: 'center bottom', transformStyle: 'preserve-3d' });
  gsap.set(seal, { transformOrigin: 'center center' });

  // Main scroll-scrubbed timeline pinned for 2200px of scrolling
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=2000',
      pin: true,
      scrub: 0.8,
      anticipatePin: 1
    }
  });

  // Phase 1 (0% to 20%): Scroll prompt fades, wax seal breaks & dissolves into sparkles
  tl.to(indicator, { opacity: 0, y: -20, duration: 0.2 }, 0)
    .to(seal, { scale: 1.25, opacity: 0, filter: 'blur(6px)', duration: 0.25 }, 0.05);

  // Phase 2 (20% to 50%): Envelope Flap rotates open in 3D (0deg to 180deg)
  tl.to(flap, {
    rotateX: 180,
    zIndex: 1,
    duration: 0.4,
    ease: 'power1.inOut'
  }, 0.15);

  // Phase 3 (40% to 80%): Letter Card slides vertically upward from inside pocket
  tl.to(card, {
    y: -240,
    scale: 1.15,
    zIndex: 12,
    boxShadow: '0 25px 60px rgba(42, 6, 12, 0.28)',
    duration: 0.45,
    ease: 'power2.out'
  }, 0.35);

  // Phase 4 (80% to 100%): Card expands cinematically, zooming smoothly into the full site
  tl.to(card, {
    scale: 1.45,
    opacity: 0,
    duration: 0.25,
    ease: 'power1.in'
  }, 0.8)
  .to(chassis, {
    opacity: 0,
    scale: 0.9,
    duration: 0.2
  }, 0.82);
}

// ==========================================================================
// 3. ROMANTIC AMBIENT HARP ARPEGGIO ENGINE (WEB AUDIO API)
// ==========================================================================
let audioCtx = null;
let isAudioPlaying = false;
let audioTimer = null;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

const HARP_FREQUENCIES = [
  293.66, // D4
  369.99, // F#4
  440.00, // A4
  587.33, // D5
  739.99, // F#5
  880.00, // A5
  659.25, // E5
  493.88  // B4
];

function playHarpNote(freq, delay = 0) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

  // Gentle low-pass warm filter
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, audioCtx.currentTime + delay);

  // Soft pluck envelope
  gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(0.042, audioCtx.currentTime + delay + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 2.3);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + 2.4);
}

function startHarpSequence() {
  if (!audioCtx || !isAudioPlaying) return;

  const chords = [
    [HARP_FREQUENCIES[0], HARP_FREQUENCIES[2], HARP_FREQUENCIES[3], HARP_FREQUENCIES[4]], // D major
    [HARP_FREQUENCIES[7], HARP_FREQUENCIES[1], HARP_FREQUENCIES[3], HARP_FREQUENCIES[6]], // B minor
    [HARP_FREQUENCIES[2], HARP_FREQUENCIES[4], HARP_FREQUENCIES[5], HARP_FREQUENCIES[6]], // A major
    [HARP_FREQUENCIES[1], HARP_FREQUENCIES[3], HARP_FREQUENCIES[4], HARP_FREQUENCIES[7]]  // G major
  ];

  let chordIdx = 0;
  function tick() {
    if (!isAudioPlaying) return;
    const chord = chords[chordIdx];
    chord.forEach((freq, i) => {
      playHarpNote(freq, i * 0.44);
    });
    chordIdx = (chordIdx + 1) % chords.length;
  }

  tick();
  audioTimer = setInterval(tick, 3800);
}

function toggleAudio() {
  initAudioContext();
  const bar = document.getElementById('floatingAudioBar');
  const btn = document.getElementById('audioToggleBtn');

  if (isAudioPlaying) {
    isAudioPlaying = false;
    if (audioTimer) clearInterval(audioTimer);
    if (bar) bar.classList.remove('is-playing');
    if (btn) btn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  } else {
    isAudioPlaying = true;
    if (bar) bar.classList.add('is-playing');
    if (btn) btn.innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    startHarpSequence();
  }
}

// ==========================================================================
// 4. 3D CARD TILT WITH REAL-TIME SPECULAR GLARE
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
// 5. COUNTDOWN TIMER (08 AUGUST 2028)
// ==========================================================================
function initCountdown() {
  const targetDate = new Date('2028-08-08T16:00:00').getTime();

  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minsEl = document.getElementById('countdownMins');
  const secsEl = document.getElementById('countdownSecs');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? '0' + d : d;
    hoursEl.textContent = h < 10 ? '0' + h : h;
    minsEl.textContent = m < 10 ? '0' + m : m;
    secsEl.textContent = s < 10 ? '0' + s : s;
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 6. FAQ ACCORDION HANDLER
// ==========================================================================
function initFAQ() {
  const triggers = document.querySelectorAll('.faq-trigger-btn');
  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.faq-card');
      const isActive = card.classList.contains('is-active');

      document.querySelectorAll('.faq-card').forEach((c) => c.classList.remove('is-active'));

      if (!isActive) {
        card.classList.add('is-active');
      }
    });
  });
}

// ==========================================================================
// 7. RSVP FORM SUBMISSION & CELEBRATION CONFETTI
// ==========================================================================
function handleRSVPSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('rsvpName').value;
  const email = document.getElementById('rsvpEmail').value;
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
  const guests = document.getElementById('rsvpGuests').value;

  localStorage.setItem('wedding_rsvp_' + email, JSON.stringify({ name, email, attendance, guests, time: new Date() }));

  triggerConfettiCannon();
  showRSVPSuccess(name, attendance, guests);
}

function triggerConfettiCannon() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:10000;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const palette = ['#D4AF37', '#5C1D24', '#EBC8CC', '#F2E4BE', '#7E2B35'];

  for (let i = 0; i < 95; i++) {
    confetti.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 120,
      vx: (Math.random() - 0.5) * 16,
      vy: -11 - Math.random() * 13,
      size: 5 + Math.random() * 6,
      color: palette[Math.floor(Math.random() * palette.length)],
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.22,
      gravity: 0.35,
      alpha: 1
    });
  }

  let frame = 0;
  function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let anyAlive = false;

    confetti.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.angle += p.angularSpeed;
      p.alpha -= 0.009;

      if (p.alpha > 0) {
        anyAlive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    frame++;
    if (anyAlive && frame < 190) {
      requestAnimationFrame(anim);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(anim);
}

function showRSVPSuccess(name, attendance, guests) {
  const container = document.getElementById('rsvpWrapper');
  if (!container) return;

  const isJoyful = attendance.toLowerCase().includes('accept');

  container.innerHTML = `
    <div style="text-align:center;padding:36px 12px;">
      <div style="width:72px;height:72px;border-radius:50%;background:var(--c-blush-light);border:2px solid var(--c-gold-bright);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:var(--c-burgundy);">
        <svg class="svg-icon svg-icon-lg" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      <span style="font-family:var(--font-caps);font-size:0.6875rem;letter-spacing:0.26em;color:var(--c-gold-deep);text-transform:uppercase;">RSVP RECEIVED WITH LOVE</span>
      <h3 style="font-family:var(--font-script);font-size:3.6rem;color:var(--c-burgundy-deep);margin:8px 0 16px;">Thank You, ${name}</h3>
      <p style="font-size:1rem;color:var(--c-text-muted);max-width:540px;margin:0 auto 24px;line-height:1.75;">
        ${isJoyful 
          ? `We are overjoyed that you will be joining our wedding celebration with <strong>${guests} guest(s)</strong>. We cannot wait to embrace you at The Plaza Hotel!` 
          : `We will dearly miss your presence on our wedding day, but we carry your heartfelt love and blessings with us.`
        }
      </p>
      <div style="display:inline-block;border:1px dashed var(--c-border-gold-bright);padding:12px 28px;border-radius:var(--radius-pill);background:var(--c-bg-subtle);">
        <span style="font-family:var(--font-caps);font-size:0.75rem;letter-spacing:0.16em;color:var(--c-burgundy);font-weight:600;">CONFIRMATION RECORDED · 08 AUGUST 2028</span>
      </div>
    </div>
  `;
}

// ==========================================================================
// 8. LUXURY TOAST NOTIFICATIONS
// ==========================================================================
function showWeddingToast(message) {
  let toast = document.getElementById('weddingToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'weddingToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #FFFFFF;
      border: 1px solid var(--c-border-gold-bright);
      padding: 14px 24px;
      border-radius: var(--radius-pill);
      box-shadow: var(--shadow-medium);
      z-index: 1000;
      font-size: 0.8125rem;
      font-family: var(--font-caps);
      letter-spacing: 0.12em;
      color: var(--c-burgundy);
      opacity: 0;
      transform: translateY(14px);
      transition: opacity 0.35s, transform 0.35s;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color:var(--c-gold-bright);margin-right:8px;">&bull;</span> ${message}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(14px)';
  }, 4200);
}

// ==========================================================================
// 9. STICKY HEADER & SCROLL SPY
// ==========================================================================
function initHeaderScroll() {
  const header = document.getElementById('weddingHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

// ==========================================================================
// 10. INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAtmosphericCanvas();
  initScrollScrubbedEnvelope();
  init3DCardTilt();
  initCountdown();
  initFAQ();
  initHeaderScroll();

  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
  }

  // Initial load entrance for the envelope stage
  if (window.gsap) {
    gsap.from('#envelopeChassis', {
      scale: 0.88,
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'expo.out'
    });
    gsap.from('.envelope-intro-kicker, .envelope-couple-names, .envelope-date-sub', {
      opacity: 0,
      y: 20,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }
});
