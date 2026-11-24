/**
 * AURA PRIME — Sovereign Land Atelier Engine
 * Interactions: Currency Switching, Category Filtering, Compounding Yield Simulator,
 * Archival Dossier Modal, Tactile Cursor, and Concierge Form.
 */

// 1. CURRENCY CONVERSION CONFIGURATION
const CURRENCY_RATES = {
  USD: { rate: 1.0, symbol: '$', code: 'USD' },
  EUR: { rate: 0.92, symbol: '€', code: 'EUR' },
  AED: { rate: 3.67, symbol: 'AED ', code: 'AED' },
  GBP: { rate: 0.79, symbol: '£', code: 'GBP' }
};

let activeCurrency = 'USD';

function formatCurrency(amountUsd, currency = activeCurrency) {
  const cfg = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round(amountUsd * cfg.rate);
  return `${cfg.symbol}${converted.toLocaleString('en-US')}`;
}

function updateAllPrices() {
  document.querySelectorAll('.price-dynamic').forEach(el => {
    const usd = parseFloat(el.getAttribute('data-usd'));
    if (!isNaN(usd)) {
      if (el.id === 'netGain') {
        el.textContent = `+${formatCurrency(usd)}`;
      } else {
        el.textContent = formatCurrency(usd);
      }
    }
  });
}

// 2. SANCTUARIES MASTER REPOSITORY
const ENCLAVES_DATA = {
  'amrutha-varshini': {
    title: 'Sri Sri Amrutha Varshini',
    badge: 'SIGNATURE GATED SANCTUARY // 40 ACRES',
    image: 'assets/images/amrutha-varshini-entrance.jpg',
    desc: 'Monumental architectural entrance gatehouse, 24/7 security watchtower portico, manicured avenue trees, asphalt roadways, rainwater percolation grid, and clear 30-year forensic title documentation ready for immediate deed registry.',
    usdPrice: 2400000,
    specs: [
      { label: 'LOCATION', value: 'South Growth Corridor' },
      { label: 'COORDINATES', value: '12° 58\' 44" N, 77° 35\' 12" E' },
      { label: 'TOTAL ACREAGE', value: '40 Demarcated Acres' },
      { label: 'ROAD WIDTH', value: '60 Ft Main / 40 Ft Arterial' },
      { label: 'LEGAL STATUS', value: '100% Freehold Vetted Deed' },
      { label: 'REGISTRY', value: 'Immediate Execution Ready' }
    ]
  },
  'sodhi-akru': {
    title: 'The Sodhi-Akru Master Grid',
    badge: '30 M.T. ARTERIAL COMMUNITY // 266 PLOTS',
    image: 'assets/images/plot-master-plan.jpg',
    desc: 'Approved geometric master community with direct 30 M.T. future road access, internal 12 M.T. and 7.5 M.T. boulevards, clubhouse pavilion, swimming pool, and 266 approved plotted parcels with complete underground services.',
    usdPrice: 1850000,
    specs: [
      { label: 'ACCESS ROAD', value: '30 M.T. Future Arterial' },
      { label: 'INTERNAL ROADS', value: '12.00 & 7.50 M.T. Boulevards' },
      { label: 'ALLOCATION', value: '266 Approved Plots' },
      { label: 'AMENITIES', value: 'Clubhouse & Swimming Pavilion' },
      { label: 'STATUTORY', value: 'Master Layout Sanctioned' },
      { label: 'ESCROW', value: 'Tier-1 Banking Settlement' }
    ]
  },
  'aerovista': {
    title: 'Aerovista Gated Township',
    badge: '3D PLOTTED TOWNSHIP',
    image: 'assets/images/plot-layout-3d.jpg',
    desc: 'Grand landmark entrance arch with bitumen asphalt roadways, underground storm drainage, avenue trees, and 24/7 solar perimeter security located directly in the aerotropolis high-growth corridor.',
    usdPrice: 3100000,
    specs: [
      { label: 'CORRIDOR', value: 'Aerotropolis High-Speed Zone' },
      { label: 'INFRASTRUCTURE', value: 'Bitumen Asphalt & Drainage' },
      { label: 'SECURITY', value: '24/7 Monitored Access Gate' },
      { label: 'HISTORIC CAGR', value: '16.2% Annual Appreciation' },
      { label: 'ZONING', value: 'Town Planning Sanctioned' },
      { label: 'TENURE', value: 'Perpetual Freehold' }
    ]
  },
  'highway': {
    title: 'Greenfield Highway Plots',
    badge: 'EXPRESSWAY CORRIDOR // 300 FT FRONTAGE',
    image: 'assets/images/plot-highway-green.jpg',
    desc: 'Prime plotted frontage facing 4-lane high-speed national expressway. Features wide median greenery, high-volume commercial accessibility, heavy transport turning circles, and high equity appreciation trajectory.',
    usdPrice: 2250000,
    specs: [
      { label: 'FRONTAGE', value: '300 Ft Direct Expressway Edge' },
      { label: 'ZONING', value: 'Commercial / High-Yield Estate' },
      { label: 'CONNECTIVITY', value: 'National Expressway Interchange' },
      { label: 'TITLE', value: 'Unencumbered Commercial Sanction' }
    ]
  },
  'emerald': {
    title: 'Emerald Horizon Land',
    badge: '50-ACRE SCENIC PARCEL',
    image: 'assets/images/plot-land-boundary.jpg',
    desc: 'Pristine 50-acre land parcel with satellite DGPS coordinates, surveyed fencing, clear single ownership title, natural gentle grading, and uninhibited panoramic valley views ideal for private sanctuaries.',
    usdPrice: 1950000,
    specs: [
      { label: 'ACREAGE', value: '50 Continuous Acres' },
      { label: 'SURVEY', value: 'Satellite DGPS Demarcated' },
      { label: 'BOUNDARY', value: 'Stone Pillar Fencing Complete' },
      { label: 'OWNERSHIP', value: 'Single Owner Freehold Title' }
    ]
  },
  'serene': {
    title: 'Serene Palms Layout',
    badge: 'ECO RESIDENTIAL GRID // 180 PLOTS',
    image: 'assets/images/plot-green-township.png',
    desc: 'Eco-conscious master community with 180 demarcated residential plots, 30% dedicated green open reserves, solar street illumination, rainwater percolation pits, and boundary security.',
    usdPrice: 1600000,
    specs: [
      { label: 'PLOTS COUNT', value: '180 Demarcated Units' },
      { label: 'GREEN BUFFER', value: '30% Dedicated Open Reserve' },
      { label: 'SERVICES', value: 'Solar Grid & Rainwater Harvesting' },
      { label: 'CUSTODY', value: 'Forensic Bar Counsel Certified' }
    ]
  }
};

// 3. CATEGORY FILTER TABS
function initCategoryFilter() {
  const tabs = document.querySelectorAll('.tab-pill');
  const cards = document.querySelectorAll('.sanctuary-paper-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. CAPITAL YIELD SIMULATOR
function initYieldSimulator() {
  const allocSlider = document.getElementById('allocSlider');
  const yearsSlider = document.getElementById('yearsSlider');
  const cagrSlider = document.getElementById('cagrSlider');

  const allocVal = document.getElementById('allocVal');
  const yearsVal = document.getElementById('yearsVal');
  const cagrVal = document.getElementById('cagrVal');

  const maturityEl = document.getElementById('maturityCapital');
  const netGainEl = document.getElementById('netGain');

  function calculateYield() {
    const principalUsd = parseFloat(allocSlider.value);
    const years = parseInt(yearsSlider.value, 10);
    const cagr = parseFloat(cagrSlider.value) / 100;

    // Compound Interest: A = P * (1 + r)^t
    const maturityUsd = Math.round(principalUsd * Math.pow(1 + cagr, years));
    const netGainUsd = maturityUsd - principalUsd;

    allocVal.setAttribute('data-usd', principalUsd);
    allocVal.textContent = formatCurrency(principalUsd);

    yearsVal.textContent = `${years} Years`;
    cagrVal.textContent = `${(cagr * 100).toFixed(1)}%`;

    maturityEl.setAttribute('data-usd', maturityUsd);
    maturityEl.textContent = formatCurrency(maturityUsd);

    netGainEl.setAttribute('data-usd', netGainUsd);
    netGainEl.textContent = `+${formatCurrency(netGainUsd)}`;
  }

  if (allocSlider && yearsSlider && cagrSlider) {
    allocSlider.addEventListener('input', calculateYield);
    yearsSlider.addEventListener('input', calculateYield);
    cagrSlider.addEventListener('input', calculateYield);
    calculateYield();
  }
}

// 5. ARCHIVAL DOSSIER MODAL
function openDossierModal(key) {
  const data = ENCLAVES_DATA[key];
  if (!data) return;

  const modal = document.getElementById('dossierModal');
  const modalImg = document.getElementById('modalImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalHeading = document.getElementById('modalHeading');
  const modalText = document.getElementById('modalText');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalPrice = document.getElementById('modalPrice');

  modalImg.src = data.image;
  modalImg.alt = data.title;
  modalBadge.textContent = data.badge;
  modalHeading.textContent = data.title;
  modalText.textContent = data.desc;
  modalPrice.textContent = formatCurrency(data.usdPrice);

  // Generate specs
  modalSpecs.innerHTML = data.specs.map(s => `
    <div class="modal-spec-item">
      <span class="s-label">${s.label}</span>
      <span class="s-value">${s.value}</span>
    </div>
  `).join('');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDossierModal() {
  const modal = document.getElementById('dossierModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('dossierModal');
  if (e.target === modal) {
    closeDossierModal();
  }
});

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDossierModal();
  }
});

// 6. CUSTOM TACTILE CURSOR
function initTactileCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states
  const interactives = document.querySelectorAll('a, button, select, input, .sanctuary-paper-card, .heirloom-showcase-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('active-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active-hover'));
  });
}

// 7. PRIVATE VIEWING CONCIERGE FORM HANDLER
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('fullName').value;
  const email = document.getElementById('emailAddr').value;
  const target = document.getElementById('sanctuaryTarget').selectedOptions[0].text;

  // Create subtle toast notification
  showAtelierToast(`Dossier Request Dispatched for ${name}. Legal deed dossier for ${target} will arrive at ${email} within 2 hours.`);
  
  e.target.reset();
}

function showAtelierToast(message) {
  let toast = document.getElementById('atelierToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'atelierToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '28px';
    toast.style.right = '28px';
    toast.style.maxWidth = '420px';
    toast.style.backgroundColor = '#241a15';
    toast.style.color = '#f5f0e8';
    toast.style.border = '1px solid #6b1d22';
    toast.style.borderRadius = '6px';
    toast.style.padding = '16px 22px';
    toast.style.fontFamily = "'Jost', sans-serif";
    toast.style.fontSize = '0.875rem';
    toast.style.lineHeight = '1.5';
    toast.style.boxShadow = '0 12px 32px rgba(36, 26, 21, 0.25)';
    toast.style.zIndex = '10000';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<strong style="color: #dfd3c3; font-family: 'Cinzel', serif; display: block; margin-bottom: 4px; font-size: 0.75rem; letter-spacing: 0.1em;">✦ DISPATCH CONFIRMATION</strong>${message}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
  }, 6000);
}

// 8. INITIALIZE ON LOAD
document.addEventListener('DOMContentLoaded', () => {
  // Currency switcher
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      activeCurrency = e.target.value;
      updateAllPrices();
      // Also update yield calculator
      const allocSlider = document.getElementById('allocSlider');
      if (allocSlider) {
        allocSlider.dispatchEvent(new Event('input'));
      }
    });
  }

  initCategoryFilter();
  initYieldSimulator();
  initTactileCursor();

  // Active navigation highlight
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.atelier-menu .menu-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.pageYOffset >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
