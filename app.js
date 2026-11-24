/**
 * AURA PRIME — 21st.dev Signature Engine
 * 60 FPS Container Scroll, 3D Card Tilt, Spotlight Tracker, Magnetic Buttons, & Web Audio
 */

// ==========================================
// 1. DATA REPOSITORY & STATE
// ==========================================
const CURRENCY_RATES = {
  USD: { rate: 1.0, symbol: '$', code: 'USD' },
  EUR: { rate: 0.92, symbol: '€', code: 'EUR' },
  AED: { rate: 3.67, symbol: 'AED ', code: 'AED' },
  GBP: { rate: 0.79, symbol: '£', code: 'GBP' }
};

let currentCurrency = 'USD';
let soundEnabled = true;

// Enclave Dossiers Database
const DOSSIERS = {
  'amrutha-varshini': {
    title: 'Sri Sri Amrutha Varshini',
    badge: 'SIGNATURE MASTERPIECE // 40 ACRES',
    image: 'assets/images/amrutha-varshini-entrance.jpg',
    desc: 'An iconic sanctuary featuring a monumental entrance portico, manicured avenue boulevards, 24/7 security checkpoint, asphalt road hierarchy, underground electrical cabling, and comprehensive perimeter compound walling.',
    usdPrice: 2400000,
    meta: [
      { label: 'LOCATION', value: 'Prime South Growth Corridor' },
      { label: 'COORDINATES', value: '12° 58\' 44" N, 77° 35\' 12" E' },
      { label: 'TOTAL AREA', value: '40 Demarcated Acres' },
      { label: 'LEGAL STATUS', value: '100% Freehold Clear Title' },
      { label: 'ROAD WIDTH', value: '60 Ft Main / 40 Ft Internal' },
      { label: 'DELIVERY', value: 'Immediate Registration Ready' }
    ]
  },
  'sodhi-akru': {
    title: 'The Sodhi-Akru Master Grid',
    badge: '30 M.T. ARTERIAL COMMUNITY',
    image: 'assets/images/plot-master-plan.jpg',
    desc: 'Approved geometric master community with direct 30 M.T. future road access, internal 12 M.T. and 7.5 M.T. boulevard network, central water pavilion, clubhouse facility, and 266 demarcated plots.',
    usdPrice: 1850000,
    meta: [
      { label: 'ACCESS ROAD', value: '30 M.T. Future Expressway' },
      { label: 'INTERNAL ROADS', value: '12.00 & 7.50 M.T. Grid' },
      { label: 'PLOT COUNT', value: '266 Approved Plots' },
      { label: 'AMENITIES', value: 'Clubhouse, Swimming Pool, Park' },
      { label: 'ZONING', value: 'Residential Master Approved' },
      { label: 'LEGAL CUSTODY', value: 'Direct Escrow Settlement' }
    ]
  },
  'aerovista': {
    title: 'Aerovista Gated Township',
    badge: '3D PLOTTED TOWNSHIP',
    image: 'assets/images/plot-layout-3d.jpg',
    desc: 'Grand landmark entrance portico with bitumen asphalt roads, underground drainage, tree avenues, and solar perimeter security.',
    usdPrice: 3100000,
    meta: [
      { label: 'INFRASTRUCTURE', value: 'Asphalt & Underground Grid' },
      { label: 'SECURITY', value: '24/7 Monitored Access Gate' },
      { label: 'APPRECIATION', value: 'Projected 16.4% Historic CAGR' },
      { label: 'LEGAL', value: 'RERA & Town Planning Sanctioned' }
    ]
  },
  'highway': {
    title: 'Greenfield Highway Plots',
    badge: 'EXPRESSWAY CORRIDOR',
    image: 'assets/images/plot-highway-green.jpg',
    desc: '4-lane high-speed expressway frontage with high commercial appreciation, landscaped green medians, and scenic open buffer zones.',
    usdPrice: 2250000,
    meta: [
      { label: 'FRONTAGE', value: '4-Lane Highway Access' },
      { label: 'COMMERCIAL POTENTIAL', value: 'Hospitality / High-Yield Commercial' },
      { label: 'STATUS', value: 'Clear Boundary Fenced' },
      { label: 'TITLE', value: 'Single Owner Freehold' }
    ]
  },
  'emerald': {
    title: 'Emerald Horizon Land',
    badge: '50-ACRE PARCEL',
    image: 'assets/images/plot-land-boundary.jpg',
    desc: 'Scenic open valley land with precision geotagged boundary survey, clear ownership title, and clean panoramic views.',
    usdPrice: 1950000,
    meta: [
      { label: 'ACREAGE', value: '50 Continuous Acres' },
      { label: 'SURVEY', value: 'Satellite DGPS Geotagged' },
      { label: 'TITLE DEED', value: 'Verified 30-Year Chain' },
      { label: 'SUITABILITY', value: 'Private Estate / Eco-Retreat' }
    ]
  }
};

// ==========================================
// 2. WEB AUDIO ACOUSTIC SYNTHESIZER
// ==========================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playHapticTick(freq = 800, duration = 0.03, gainVal = 0.03) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio restrictions
  }
}

// Sound toggle button
const soundToggleBtn = document.getElementById('soundToggleBtn');
if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const textSpan = soundToggleBtn.querySelector('.sound-state');
    if (textSpan) {
      textSpan.textContent = soundEnabled ? 'Sound: ON' : 'Sound: OFF';
    }
    soundToggleBtn.style.borderColor = soundEnabled ? 'var(--gold)' : 'var(--border-subtle)';
    if (soundEnabled) playHapticTick(1000, 0.05, 0.05);
  });
}

// ==========================================
// 3. INTERACTIVE CUSTOM CURSOR
// ==========================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = -100;
let mouseY = -100;
let ringX = -100;
let ringY = -100;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }
}, { passive: true });

function renderCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(renderCursor);
}
requestAnimationFrame(renderCursor);

// Add hover class to body when over interactive elements
const interactiveElements = 'a, button, input, select, .bento-card, .scroll-3d-card';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(interactiveElements)) {
    document.body.classList.add('cursor-hover');
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(interactiveElements)) {
    document.body.classList.remove('cursor-hover');
  }
});

// ==========================================
// 4. 21ST.DEV SIGNATURE 3D CONTAINER SCROLL
// ==========================================
const heroSection = document.getElementById('hero');
const scroll3dCard = document.getElementById('scroll3dCard');

function updateContainerScroll() {
  if (!heroSection || !scroll3dCard) return;

  const rect = heroSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Compute scroll progress: 0 at top, 1 when hero scrolls through
  const scrollDistance = -rect.top;
  const maxScroll = rect.height * 0.65;
  const progress = Math.min(Math.max(scrollDistance / maxScroll, 0), 1);

  // Map progress: rotateX(16deg -> 0deg), scale(0.93 -> 1.0), translateY(20px -> 0px)
  const rotateX = (1 - progress) * 16;
  const scale = 0.93 + progress * 0.07;
  const translateY = (1 - progress) * 20;

  scroll3dCard.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
}

window.addEventListener('scroll', updateContainerScroll, { passive: true });
updateContainerScroll();

// ==========================================
// 5. RADIAL SPOTLIGHT TRACKING (CSS Variables)
// ==========================================
const spotlightCards = document.querySelectorAll('.bento-card, .scroll-3d-card, .yield-calculator-card, .advisory-form-panel');

spotlightCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ==========================================
// 6. 3D CARD TILT ON POINTER MOVE (Physics)
// ==========================================
const tiltCards = document.querySelectorAll('.bento-tilt-card');

tiltCards.forEach((card) => {
  let isHovered = false;

  card.addEventListener('mouseenter', () => {
    isHovered = true;
    playHapticTick(600, 0.02, 0.02);
  });

  card.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = 8; // degrees
    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
  });

  card.addEventListener('mouseleave', () => {
    isHovered = false;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

// ==========================================
// 7. MAGNETIC BUTTON PHYSICS
// ==========================================
const magneticButtons = document.querySelectorAll('.btn-magnetic');

magneticButtons.forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    // Magnetic pull strength: 0.25
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });

  btn.addEventListener('mouseenter', () => {
    playHapticTick(750, 0.02, 0.03);
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px)';
  });

  btn.addEventListener('click', () => {
    playHapticTick(1100, 0.04, 0.05);
  });
});

// ==========================================
// 8. SLIDING PILL NAVIGATION INDICATOR
// ==========================================
const pillNav = document.getElementById('pillNav');
const navPillIndicator = document.getElementById('navActivePill');
const pillItems = document.querySelectorAll('.pill-nav-item');

function setPillPosition(element) {
  if (!navPillIndicator || !element) return;
  const navRect = pillNav.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();
  navPillIndicator.style.width = `${elemRect.width}px`;
  navPillIndicator.style.transform = `translateX(${elemRect.left - navRect.left - 4}px)`;
}

// Initial position
if (pillItems.length > 0) {
  const activeItem = document.querySelector('.pill-nav-item.active') || pillItems[0];
  setPillPosition(activeItem);
}

pillItems.forEach((item) => {
  item.addEventListener('mouseenter', () => {
    setPillPosition(item);
  });

  item.addEventListener('click', () => {
    pillItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    setPillPosition(item);
  });
});

if (pillNav) {
  pillNav.addEventListener('mouseleave', () => {
    const activeItem = document.querySelector('.pill-nav-item.active');
    if (activeItem) setPillPosition(activeItem);
  });
}

// Scrollspy for pill nav
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset + 200;
  sections.forEach((sec) => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      pillItems.forEach((p) => {
        if (p.getAttribute('data-nav') === id) {
          pillItems.forEach(i => i.classList.remove('active'));
          p.classList.add('active');
          setPillPosition(p);
        }
      });
    }
  });
}, { passive: true });

// ==========================================
// 9. LIVE MULTI-CURRENCY CONVERTER
// ==========================================
const currencySelect = document.getElementById('currencySelect');

function formatCurrency(amountUSD, currencyCode) {
  const config = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.USD;
  const converted = Math.round(amountUSD * config.rate);

  if (currencyCode === 'AED') {
    return `AED ${converted.toLocaleString('en-US')}`;
  }
  return `${config.symbol}${converted.toLocaleString('en-US')}`;
}

function updateAllPrices() {
  const priceElements = document.querySelectorAll('.price-dynamic');
  priceElements.forEach((el) => {
    const usdVal = parseFloat(el.getAttribute('data-usd'));
    if (!isNaN(usdVal)) {
      el.textContent = formatCurrency(usdVal, currentCurrency);
    }
  });
}

if (currencySelect) {
  currencySelect.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    updateAllPrices();
    updateYieldCalculator();
    playHapticTick(900, 0.03, 0.03);
  });
}

// ==========================================
// 10. INTERACTIVE CAPITAL YIELD CALCULATOR
// ==========================================
const allocSlider = document.getElementById('allocSlider');
const yearsSlider = document.getElementById('yearsSlider');
const cagrSlider = document.getElementById('cagrSlider');

const allocVal = document.getElementById('allocVal');
const yearsVal = document.getElementById('yearsVal');
const cagrVal = document.getElementById('cagrVal');

const maturityCapital = document.getElementById('maturityCapital');
const netGain = document.getElementById('netGain');

function updateYieldCalculator() {
  if (!allocSlider || !yearsSlider || !cagrSlider) return;

  const P = parseFloat(allocSlider.value);
  const years = parseInt(yearsSlider.value, 10);
  const cagr = parseFloat(cagrSlider.value) / 100;

  // Compound Interest: A = P * (1 + r)^n
  const A = Math.round(P * Math.pow(1 + cagr, years));
  const gain = A - P;

  if (allocVal) {
    allocVal.setAttribute('data-usd', P);
    allocVal.textContent = formatCurrency(P, currentCurrency);
  }
  if (yearsVal) {
    yearsVal.textContent = `${years} Years`;
  }
  if (cagrVal) {
    cagrVal.textContent = `${(cagr * 100).toFixed(1)}%`;
  }

  if (maturityCapital) {
    maturityCapital.setAttribute('data-usd', A);
    maturityCapital.textContent = formatCurrency(A, currentCurrency);
  }
  if (netGain) {
    netGain.setAttribute('data-usd', gain);
    netGain.textContent = `+${formatCurrency(gain, currentCurrency)}`;
  }
}

if (allocSlider && yearsSlider && cagrSlider) {
  [allocSlider, yearsSlider, cagrSlider].forEach((slider) => {
    slider.addEventListener('input', () => {
      updateYieldCalculator();
      playHapticTick(450, 0.015, 0.015);
    });
  });
}

// ==========================================
// 11. 60 FPS METRIC NUMBER COUNTERS
// ==========================================
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.counter-num');
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        let start = 0;
        const duration = 1600; // ms
        const startTime = performance.now();

        function updateNumber(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = start + easeProgress * (target - start);
          counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            counter.textContent = target;
          }
        }
        requestAnimationFrame(updateNumber);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const metricsSection = document.querySelector('.metrics-ticker-container');
if (metricsSection) {
  counterObserver.observe(metricsSection);
}

// ==========================================
// 12. INTERACTIVE DOSSIER MODAL
// ==========================================
const dossierModal = document.getElementById('dossierModal');
const modalMainImg = document.getElementById('modalMainImg');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalMetaGrid = document.getElementById('modalMetaGrid');
const modalPrice = document.getElementById('modalPrice');

window.openDossierModal = function(enclaveKey) {
  const data = DOSSIERS[enclaveKey] || DOSSIERS['amrutha-varshini'];
  if (!dossierModal) return;

  if (modalMainImg) modalMainImg.src = data.image;
  if (modalBadge) modalBadge.textContent = data.badge;
  if (modalTitle) modalTitle.textContent = data.title;
  if (modalDesc) modalDesc.textContent = data.desc;

  if (modalPrice) {
    modalPrice.textContent = formatCurrency(data.usdPrice, currentCurrency);
  }

  if (modalMetaGrid) {
    modalMetaGrid.innerHTML = data.meta.map(m => `
      <div class="meta-item">
        <span class="meta-label" style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); display: block;">${m.label}</span>
        <span class="meta-val" style="font-size: 13px; font-weight: 600; color: #fff;">${m.value}</span>
      </div>
    `).join('');
  }

  dossierModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  playHapticTick(900, 0.04, 0.04);
};

window.closeDossierModal = function() {
  if (!dossierModal) return;
  dossierModal.classList.remove('active');
  document.body.style.overflow = '';
  playHapticTick(600, 0.02, 0.02);
};

if (dossierModal) {
  dossierModal.addEventListener('click', (e) => {
    if (e.target === dossierModal) {
      closeDossierModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDossierModal();
});

// ==========================================
// 13. VIP INQUIRY FORM SUBMISSION
// ==========================================
window.handleVipSubmit = function(event) {
  event.preventDefault();
  const name = document.getElementById('patronName')?.value;
  const email = document.getElementById('patronEmail')?.value;
  const tier = document.getElementById('allocationTier')?.value;
  const enclave = document.getElementById('targetEnclave')?.value;

  playHapticTick(1200, 0.08, 0.06);

  const formPanel = document.querySelector('.advisory-form-panel');
  if (formPanel) {
    formPanel.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(152, 240, 20, 0.15); border: 1.5px solid var(--cyber-lime); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; color: var(--cyber-lime); font-size: 24px;">✓</div>
        <h3 style="font-family: var(--font-display); font-size: 24px; color: #fff; margin-bottom: 12px;">Allocation Dossier Dispatched</h3>
        <p style="font-size: 14px; color: var(--text-secondary); max-width: 440px; margin: 0 auto 24px auto; line-height: 1.6;">
          Thank you, <strong>${name}</strong>. The authenticated title package and private viewing coordinates for <strong>${enclave.toUpperCase()}</strong> have been sent to <strong>${email}</strong>.
        </p>
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--gold); background: rgba(212, 175, 55, 0.08); padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-gold);">
          PATRON ID // AP-2026-${Math.floor(1000 + Math.random() * 9000)}
        </span>
      </div>
    `;
  }
};

// INITIALIZE ON LOAD
document.addEventListener('DOMContentLoaded', () => {
  updateAllPrices();
  updateYieldCalculator();
});
