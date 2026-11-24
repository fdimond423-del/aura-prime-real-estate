/**
 * OLIVIA & ADRIAN — WEDDING INTERACTIVE ENGINE
 * Features:
 * - 3D Wax Seal Opening Physics & Petal Burst
 * - Web Audio API Romantic Ambient Harp Arpeggiator
 * - Real-Time Live Wedding Countdown (08 August 2028)
 * - Organic Falling Rose Petals Canvas Simulation
 * - FAQ Accordion Expansion
 * - Interactive RSVP Form with Confetti Celebration
 * - Scroll-triggered Navigation Highlighting
 */

// ==========================================================================
// 1. WAX SEAL & INTRO INVITATION OPENING
// ==========================================================================
function openWeddingEnvelope() {
  const envelope = document.getElementById('envelopeWrapper');
  const introOverlay = document.getElementById('weddingIntroOverlay');

  if (envelope) {
    envelope.classList.add('flap-opened');
  }

  // Create gold sparkle particle burst at seal position
  createSealBurst();

  // Try starting ambient music smoothly
  playRomanticMusic();
}

function enterWeddingLanding() {
  const introOverlay = document.getElementById('weddingIntroOverlay');
  if (introOverlay) {
    introOverlay.classList.add('is-opened');
    document.body.style.overflow = '';
  }
}

function skipIntro() {
  enterWeddingLanding();
}

function createSealBurst() {
  const seal = document.getElementById('waxSealBtn');
  if (!seal) return;

  const rect = seal.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 24; i++) {
    const spark = document.createElement('div');
    spark.className = 'seal-spark-particle';
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 60;
    const color = i % 2 === 0 ? '#D4AF37' : '#8B2535';

    spark.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: ${4 + Math.random() * 4}px;
      height: ${4 + Math.random() * 4}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1005;
      transform: translate(0, 0);
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s;
    `;

    document.body.appendChild(spark);

    requestAnimationFrame(() => {
      spark.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 700);
  }
}

// ==========================================================================
// 2. ROMANTIC AMBIENT HARP & CHORD GENERATOR (WEB AUDIO API)
// ==========================================================================
let audioCtx = null;
let isAudioPlaying = false;
let audioInterval = null;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Soft romantic notes in D Major / F# Pentatonic scale
const HARP_NOTES = [
  293.66, // D4
  369.99, // F#4
  440.00, // A4
  587.33, // D5
  739.99, // F#5
  880.00, // A5
  659.25, // E5
  493.88  // B4
];

function playHarpPluck(freq, delay = 0) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

  // Warm filter
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, audioCtx.currentTime + delay);

  // Pluck envelope
  gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(0.045, audioCtx.currentTime + delay + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 2.4);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + 2.5);
}

function playRomanticPattern() {
  if (!audioCtx || !isAudioPlaying) return;

  const chords = [
    [HARP_NOTES[0], HARP_NOTES[2], HARP_NOTES[3], HARP_NOTES[4]], // D major
    [HARP_NOTES[7], HARP_NOTES[1], HARP_NOTES[3], HARP_NOTES[6]], // B min
    [HARP_NOTES[2], HARP_NOTES[4], HARP_NOTES[5], HARP_NOTES[6]], // A major
    [HARP_NOTES[1], HARP_NOTES[3], HARP_NOTES[4], HARP_NOTES[7]]  // G major
  ];

  let chordIndex = 0;

  function stepChord() {
    if (!isAudioPlaying) return;
    const chord = chords[chordIndex];
    chord.forEach((note, i) => {
      playHarpPluck(note, i * 0.45);
    });
    chordIndex = (chordIndex + 1) % chords.length;
  }

  stepChord();
  audioInterval = setInterval(stepChord, 3800);
}

function playRomanticMusic() {
  initAudioContext();
  isAudioPlaying = true;
  const bar = document.getElementById('floatingAudioBar');
  const btn = document.getElementById('audioToggleBtn');
  if (bar) bar.classList.add('is-playing');
  if (btn) btn.innerHTML = '⏸';

  if (audioInterval) clearInterval(audioInterval);
  playRomanticPattern();
}

function pauseRomanticMusic() {
  isAudioPlaying = false;
  if (audioInterval) clearInterval(audioInterval);
  const bar = document.getElementById('floatingAudioBar');
  const btn = document.getElementById('audioToggleBtn');
  if (bar) bar.classList.remove('is-playing');
  if (btn) btn.innerHTML = '▶';
}

function toggleRomanticMusic() {
  if (isAudioPlaying) {
    pauseRomanticMusic();
  } else {
    playRomanticMusic();
  }
}

// ==========================================================================
// 3. REAL-TIME COUNTDOWN TIMER (AUGUST 08, 2028)
// ==========================================================================
function initCountdown() {
  // Wedding Date: August 8, 2028 16:00:00 (EST)
  const weddingDate = new Date('2028-08-08T16:00:00').getTime();

  const daysEl = document.getElementById('countdownDays');
  const hoursEl = document.getElementById('countdownHours');
  const minsEl = document.getElementById('countdownMins');
  const secsEl = document.getElementById('countdownSecs');

  if (!daysEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 4. ORGANIC FALLING ROSE PETALS CANVAS SIMULATION
// ==========================================================================
function initPetalCanvas() {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalCount = 22;
  const petals = [];

  class RosePetal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20 - Math.random() * 40;
      this.size = 10 + Math.random() * 12;
      this.speedY = 0.6 + Math.random() * 0.9;
      this.speedX = -0.3 + Math.random() * 0.6;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = 0.01 + Math.random() * 0.02;
      this.flipAngle = Math.random() * Math.PI * 2;
      this.flipSpeed = 0.015 + Math.random() * 0.025;
      
      // Color palette: deep burgundy, blush pink, soft rose
      const colors = [
        'rgba(92, 29, 36, 0.75)',   // Deep burgundy
        'rgba(122, 40, 51, 0.65)',  // Soft burgundy
        'rgba(217, 155, 155, 0.8)', // Blush rose
        'rgba(232, 196, 200, 0.85)' // Pale pink
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.angle) * 0.6;
      this.angle += this.angularSpeed;
      this.flipAngle += this.flipSpeed;

      if (this.y > height + 30) {
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
      // Draw organic curved petal shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size, -this.size * 1.2, -this.size * 1.4, this.size * 0.8, 0, this.size * 1.5);
      ctx.bezierCurveTo(this.size * 1.4, this.size * 0.8, this.size, -this.size * 1.2, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new RosePetal());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ==========================================================================
// 5. FAQ ACCORDION HANDLER
// ==========================================================================
function initFAQ() {
  const triggers = document.querySelectorAll('.faq-trigger-btn');
  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.faq-card');
      const isActive = card.classList.contains('is-active');

      // Close all other cards for clean accordion feel
      document.querySelectorAll('.faq-card').forEach((c) => c.classList.remove('is-active'));

      if (!isActive) {
        card.classList.add('is-active');
      }
    });
  });
}

// ==========================================================================
// 6. RSVP FORM & CONFETTI CELEBRATION
// ==========================================================================
function handleRSVPSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('rsvpName').value;
  const email = document.getElementById('rsvpEmail').value;
  const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
  const guests = document.getElementById('rsvpGuests').value;

  // Persist response to localStorage
  const rsvpRecord = { name, email, attendance, guests, date: new Date().toISOString() };
  localStorage.setItem('wedding_rsvp_' + email, JSON.stringify(rsvpRecord));

  // Trigger celebration confetti
  triggerConfetti();

  // Show sweet confirmation modal
  showRSVPConfirmation(name, attendance, guests);
}

function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:1010;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#D4AF37', '#5C1D24', '#D99B9B', '#FFFFFF', '#C97A85'];

  for (let i = 0; i < 90; i++) {
    confettiPieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      vx: (Math.random() - 0.5) * 14,
      vy: -10 - Math.random() * 12,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      angularSpeed: (Math.random() - 0.5) * 0.2,
      gravity: 0.35,
      alpha: 1
    });
  }

  let frame = 0;
  function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    confettiPieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.angle += p.angularSpeed;
      p.alpha -= 0.009;

      if (p.alpha > 0) {
        alive = true;
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
    if (alive && frame < 180) {
      requestAnimationFrame(anim);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(anim);
}

function showRSVPConfirmation(name, attendance, guests) {
  const container = document.getElementById('rsvpWrapper');
  if (!container) return;

  const isJoyful = attendance.toLowerCase().includes('joyfully') || attendance.toLowerCase().includes('accept');

  container.innerHTML = `
    <div style="text-align:center;padding:30px 10px;">
      <span style="font-size:3rem;display:block;margin-bottom:12px;">${isJoyful ? '🥂' : '💌'}</span>
      <span style="font-family:var(--font-caps);font-size:0.6875rem;letter-spacing:0.25em;color:var(--c-gold);text-transform:uppercase;">RSVP RECEIVED WITH LOVE</span>
      <h3 style="font-family:var(--font-script);font-size:3.4rem;color:var(--c-burgundy-deep);margin:8px 0 16px;">Thank You, ${name}</h3>
      <p style="font-size:1rem;color:var(--c-text-muted);max-width:520px;margin:0 auto 24px;line-height:1.7;">
        ${isJoyful 
          ? `We are overjoyed that you will be joining us for our special day with <strong>${guests} guest(s)</strong>. We cannot wait to celebrate together under the Plaza chandeliers!` 
          : `We will warmly miss you on our wedding day, but your heartfelt love and blessings mean everything to us.`
        }
      </p>
      <div style="display:inline-block;border:1px dashed var(--c-border-gold);padding:12px 24px;border-radius:var(--radius-pill);background:var(--c-bg-subtle);">
        <span style="font-family:var(--font-caps);font-size:0.75rem;letter-spacing:0.14em;color:var(--c-burgundy);">CONFIRMATION STORED · AUGUST 08, 2028</span>
      </div>
    </div>
  `;
}

// ==========================================================================
// 7. REGISTRY GIFT MODAL / TOAST
// ==========================================================================
function openGiftModal(fundTitle) {
  showWeddingToast(`✦ Thank you for blessing our "${fundTitle}". Honeymoon link opened.`);
}

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
      border: 1px solid var(--c-border-gold);
      padding: 14px 24px;
      border-radius: var(--radius-pill);
      box-shadow: var(--shadow-md);
      z-index: 1000;
      font-size: 0.8125rem;
      font-family: var(--font-caps);
      letter-spacing: 0.1em;
      color: var(--c-burgundy);
      opacity: 0;
      transform: translateY(14px);
      transition: opacity 0.35s, transform 0.35s;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(14px)';
  }, 4200);
}

// ==========================================================================
// 8. SCROLL SPY & STICKY HEADER
// ==========================================================================
function initHeaderScroll() {
  const header = document.getElementById('weddingHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}

// ==========================================================================
// 9. INITIALIZE ON DOM LOAD
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initPetalCanvas();
  initFAQ();
  initHeaderScroll();

  // Wax seal click listener
  const waxBtn = document.getElementById('waxSealBtn');
  if (waxBtn) {
    waxBtn.addEventListener('click', openWeddingEnvelope);
  }

  // Audio Toggle listener
  const audioBtn = document.getElementById('audioToggleBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', toggleRomanticMusic);
  }
});
