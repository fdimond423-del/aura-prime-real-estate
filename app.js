/**
 * AURA PRIME — Heirloom Luxury Atelier Engine
 * Harmonious Warm Gold & Archival Typography Interactions
 */

// CURRENCY CONFIGURATION
const CURRENCY_RATES = {
  USD: { rate: 1.0, symbol: '$', code: 'USD' },
  EUR: { rate: 0.92, symbol: '€', code: 'EUR' },
  AED: { rate: 3.67, symbol: 'AED ', code: 'AED' },
  GBP: { rate: 0.79, symbol: '£', code: 'GBP' }
};

let activeCurrency = 'USD';

// SANCTUARIES DATASET
const ENCLAVES_DATA = {
  'amrutha-varshini': {
    title: 'Sri Sri Amrutha Varshini',
    badge: 'SIGNATURE GATED SANCTUARY // 40 ACRES',
    image: 'assets/images/amrutha-varshini-entrance.jpg',
    desc: 'An iconic residential sanctuary featuring a monumental entrance portico, 24/7 security checkpoint, avenue tree boulevards, asphalt road network, underground drainage, and comprehensive perimeter boundary security.',
    usdPrice: 2400000,
    specs: [
      { label: 'LOCATION', value: 'South Growth Corridor' },
      { label: 'COORDINATES', value: '12° 58\' 44" N, 77° 35\' 12" E' },
      { label: 'TOTAL ACREAGE', value: '40 Demarcated Acres' },
      { label: 'LEGAL CUSTODY', value: '100% Freehold Vetted Deed' },
      { label: 'ROAD NETWORK', value: '60 Ft Main / 40 Ft Arterial' },
      { label: 'REGISTRATION', value: 'Immediate Execution Ready' }
    ]
  },
  'sodhi-akru': {
    title: 'The Sodhi-Akru Master Grid',
    badge: '30 M.T. ARTERIAL COMMUNITY // 266 PLOTS',
    image: 'assets/images/plot-master-plan.jpg',
    desc: 'Approved geometric master community with direct 30 M.T. future road access, internal 12 M.T. and 7.5 M.T. boulevard grid, central water pavilion, clubhouse facility, and 266 approved demarcated residential plots.',
    usdPrice: 1850000,
    specs: [
      { label: 'ARTERIAL ACCESS', value: '30 M.T. Future Road' },
      { label: 'INTERNAL GRID', value: '12.00 & 7.50 M.T. Boulevards' },
      { label: 'PLOT COUNT', value: '266 Approved Plots' },
      { label: 'AMENITIES', value: 'Clubhouse, Pool, Central Park' },
      { label: 'APPROVAL', value: 'Master Layout Sanctioned' },
      { label: 'ESCROW', value: 'Tier-1 Banking Settlement' }
    ]
  },
  'aerovista': {
    title: 'Aerovista Gated Township',
    badge: '3D PLOTTED TOWNSHIP',
    image: 'assets/images/plot-layout-3d.jpg',
    desc: 'Grand landmark entrance arch with asphalt road network, underground storm drainage, tree avenues, and 24/7 solar perimeter security in the aerotropolis corridor.',
    usdPrice: 3100000,
    specs: [
      { label: 'INFRASTRUCTURE', value: 'Bitumen Asphalt & Drainage' },
      { label: 'SECURITY', value: '24/7 Monitored Access Gate' },
      { label: 'HISTORIC CAGR', value: '16.2% Appreciation Rate' },
      { label: 'STATUTORY', value: 'Town Planning & RERA Approved' }
    ]
  },
  'highway': {
    title: 'Greenfield Highway Plots',
    badge: 'EXPRESSWAY CORRIDOR FRONTAGE',
    image: 'assets/images/plot-highway-green.jpg',
    desc: 'Direct 4-lane high-speed expressway frontage with high commercial appreciation, landscaped green medians, and scenic open buffer zones suitable for mixed-use or trophy residential estates.',
    usdPrice: 2250000,
    specs: [
      { label: 'FRONTAGE', value: '300 Ft Wide Expressway Edge' },
      { label: 'SUITABILITY', value: 'Commercial / Hospitality / Estate' },
      { label: 'BOUNDARY', value: 'Clear DGPS Fenced Perimeter' },
      { label: 'TITLE CHAIN', value: 'Single Owner Freehold Chain' }
    ]
  },
  'emerald': {
    title: 'Emerald Horizon Land',
    badge: '50-ACRE SCENIC PARCEL',
    image: 'assets/images/plot-land-boundary.jpg',
    desc: 'Scenic open valley land with precision satellite DGPS boundary survey, clear single ownership title, and panoramic valley views ideal for private generational compounds.',
    usdPrice: 1950000,
    specs: [
      { label: 'ACREAGE', value: '50 Continuous Acres' },
      { label: 'SURVEY DATA', value: 'Satellite DGPS Geotagged' },
      { label: 'TITLE CHAIN', value: '30-Year Forensic Search Clear' },
      { label: 'PURPOSE', value: 'Private Estate / Agricultural Buffer' }
    ]
  },
  'serene': {
    title: 'Serene Palms Layout',
    badge: 'ECO RESIDENTIAL GRID // 180 PLOTS',
    image: 'assets/images/plot-green-township.png',
    desc: '180 demarcated residential plots surrounded by agricultural buffer trees, central community parkland, solar street lighting, and rainwater catchment systems.',
    usdPrice: 1600000,
    specs: [
      { label: 'COMMUNITY', value: '180 Demarcated Plots' },
      { label: 'GREEN SPACE', value: '30% Dedicated Open Reserve' },
      { label: 'SERVICES', value: 'Solar Grid & Rainwater Network' },
      { label: 'LEGAL', value: 'Green Zone Sanctioned Freehold' }
    ]
  }
};

// ==========================================
// 1. TACTILE CURSOR TRACKER
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

function animateCursor() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }
  requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

// Add active state on hover
const interactiveSelector = 'a, button, input, select, .enclave-card, .heirloom-feature-frame';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(interactiveSelector)) {
    document.body.classList.add('cursor-active');
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(interactiveSelector)) {
    document.body.classList.remove('cursor-active');
  }
});

// ==========================================
// 2. LIVE MULTI-CURRENCY CONVERTER
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

function updatePrices() {
  const priceElements = document.querySelectorAll('.price-dynamic');
  priceElements.forEach((el) => {
    const usdVal = parseFloat(el.getAttribute('data-usd'));
    if (!isNaN(usdVal)) {
      el.textContent = formatCurrency(usdVal, activeCurrency);
    }
  });
}

if (currencySelect) {
  currencySelect.addEventListener('change', (e) => {
    activeCurrency = e.target.value;
    updatePrices();
    updateSimulator();
  });
}

// ==========================================
// 3. ENCLAVE CATEGORY FILTER TABS
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const enclaveCards = document.querySelectorAll('.enclave-card');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterVal = btn.getAttribute('data-filter');

    enclaveCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      if (filterVal === 'all' || cardCategory === filterVal) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 20);
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==========================================
// 4. CAPITAL YIELD SIMULATOR
// ==========================================
const allocSlider = document.getElementById('allocSlider');
const yearsSlider = document.getElementById('yearsSlider');
const cagrSlider = document.getElementById('cagrSlider');

const allocVal = document.getElementById('allocVal');
const yearsVal = document.getElementById('yearsVal');
const cagrVal = document.getElementById('cagrVal');

const maturityCapital = document.getElementById('maturityCapital');
const netGain = document.getElementById('netGain');

function updateSimulator() {
  if (!allocSlider || !yearsSlider || !cagrSlider) return;

  const P = parseFloat(allocSlider.value);
  const years = parseInt(yearsSlider.value, 10);
  const cagr = parseFloat(cagrSlider.value) / 100;

  // Compounded Capital: A = P * (1 + r)^n
  const A = Math.round(P * Math.pow(1 + cagr, years));
  const gain = A - P;

  if (allocVal) {
    allocVal.setAttribute('data-usd', P);
    allocVal.textContent = formatCurrency(P, activeCurrency);
  }
  if (yearsVal) {
    yearsVal.textContent = `${years} Years`;
  }
  if (cagrVal) {
    cagrVal.textContent = `${(cagr * 100).toFixed(1)}%`;
  }

  if (maturityCapital) {
    maturityCapital.setAttribute('data-usd', A);
    maturityCapital.textContent = formatCurrency(A, activeCurrency);
  }
  if (netGain) {
    netGain.setAttribute('data-usd', gain);
    netGain.textContent = `+${formatCurrency(gain, activeCurrency)}`;
  }
}

if (allocSlider && yearsSlider && cagrSlider) {
  [allocSlider, yearsSlider, cagrSlider].forEach((slider) => {
    slider.addEventListener('input', updateSimulator);
  });
}

// ==========================================
// 5. INTERACTIVE DOSSIER MODAL
// ==========================================
const dossierModal = document.getElementById('dossierModal');
const modalImg = document.getElementById('modalImg');
const modalBadge = document.getElementById('modalBadge');
const modalHeading = document.getElementById('modalHeading');
const modalText = document.getElementById('modalText');
const modalSpecs = document.getElementById('modalSpecs');
const modalPrice = document.getElementById('modalPrice');

window.openDossierModal = function(key) {
  const item = ENCLAVES_DATA[key] || ENCLAVES_DATA['amrutha-varshini'];
  if (!dossierModal) return;

  if (modalImg) modalImg.src = item.image;
  if (modalBadge) modalBadge.textContent = item.badge;
  if (modalHeading) modalHeading.textContent = item.title;
  if (modalText) modalText.textContent = item.desc;

  if (modalPrice) {
    modalPrice.textContent = formatCurrency(item.usdPrice, activeCurrency);
  }

  if (modalSpecs) {
    modalSpecs.innerHTML = item.specs.map(s => `
      <div class="spec-cell">
        <span style="display: block; font-size: 10px; letter-spacing: 0.12em; color: var(--t-muted);">${s.label}</span>
        <strong style="font-size: 13px; color: var(--t-ivory); font-weight: 500;">${s.value}</strong>
      </div>
    `).join('');
  }

  dossierModal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeDossierModal = function() {
  if (!dossierModal) return;
  dossierModal.classList.remove('active');
  document.body.style.overflow = '';
};

if (dossierModal) {
  dossierModal.addEventListener('click', (e) => {
    if (e.target === dossierModal) closeDossierModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDossierModal();
});

// ==========================================
// 6. VIP ALLOCATION FORM SUBMISSION
// ==========================================
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('fullName')?.value;
  const email = document.getElementById('emailAddr')?.value;
  const enclave = document.getElementById('sanctuaryTarget')?.value;

  const formCol = document.querySelector('.viewing-form-col');
  if (formCol) {
    formCol.innerHTML = `
      <div style="background: var(--c-surface); border: 1px solid var(--b-gold-hover); border-radius: var(--radius-lg); padding: 50px 36px; text-align: center;">
        <div style="width: 52px; height: 52px; border-radius: 50%; border: 1.5px solid var(--c-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; color: var(--c-gold); font-size: 22px;">✦</div>
        <h3 style="font-family: var(--font-roman); font-size: 24px; color: var(--t-ivory); margin-bottom: 12px;">Sovereign Package Dispatched</h3>
        <p style="font-size: 14.5px; color: var(--t-sand); line-height: 1.65; max-width: 440px; margin: 0 auto 24px auto;">
          Thank you, <strong>${name}</strong>. The authenticated title deed chain and private site inspection credentials for <strong>${enclave.toUpperCase()}</strong> have been dispatched to <strong>${email}</strong>.
        </p>
        <span style="font-size: 11px; letter-spacing: 0.15em; color: var(--c-gold); border: 1px solid var(--b-gold-subtle); padding: 6px 14px; border-radius: 20px;">
          PATRON RECORD // AP-2026-${Math.floor(1000 + Math.random() * 9000)}
        </span>
      </div>
    `;
  }
};

// INITIALIZE ON LOAD
document.addEventListener('DOMContentLoaded', () => {
  updatePrices();
  updateSimulator();
});
