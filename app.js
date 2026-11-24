/**
 * AURA PRIME - ARCHITECTURAL REAL ESTATE APPLICATION ENGINE
 * Powered by 21st.dev MCP component patterns & ui-ux-pro-max guidelines
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. DATA REPOSITORY (ESTATES DOSSIER)
  // ==========================================
  const PROPERTIES_DATA = {
    1: {
      id: 1,
      title: "Sri Sri Amrutha Varshini",
      category: "waterfront",
      location: "Prime Gated Residential Sector",
      usdPrice: 74500000,
      beds: "Gated Enclave",
      baths: "Grand Portal",
      sqft: "Monumental Entrance Gate with Security Checkpoint",
      architect: "Sri Sri Infrastructure & Town Planners",
      yearBuilt: "2024",
      features: [
        "Iconic modern white & graphite canopy entrance portal with custom lettering",
        "24/7 manned security outpost with boom barrier access control",
        "Direct access road with pedestrian zebra crossing & traffic safety markings",
        "Curated roadside palm & flora plantations with decorative water features",
        "Fully demarcated premium residential plots with clear title conveyance"
      ],
      description: "Sri Sri Amrutha Varshini stands as an iconic plotted residential landmark. Characterized by its monumental white entrance portico with custom typography, wide tarmac avenues, 24/7 security booth, and tranquil green verges, this gated enclave offers an elite standard of private community living.",
      gallery: [
        "assets/images/amrutha-varshini-entrance.jpg"
      ]
    },
    2: {
      id: 2,
      title: "Sodhi-Akru Master Planned Layout",
      category: "island",
      location: "Way to Sodhi & Akru Expressway Corridor",
      usdPrice: 58000000,
      beds: "260+ Plots",
      baths: "Club House",
      sqft: "30 M.T. Future Road · 12 M.T. & 7.5 M.T. Internal Network",
      architect: "Town Planning Authority & Sudha 3D Works",
      yearBuilt: "2025",
      features: [
        "30 M.T. wide future arterial road connectivity",
        "12.00 M.T. and 7.50 M.T. asphalt internal road grid",
        "Centrally located swimming pool and sports club house",
        "Landscaped green open spaces and children's park",
        "Clear demarcation with Vastu-compliant plot orientations"
      ],
      description: "A meticulously engineered residential plotted township featuring multi-tier blacktop roads, sports arenas, clubhouse amenities, and high-yielding investment plot divisions ready for immediate construction.",
      gallery: [
        "assets/images/plot-master-plan.jpg",
        "assets/images/plot-layout-3d.jpg",
        "assets/images/plot-highway-green.jpg"
      ]
    },
    3: {
      id: 3,
      title: "Aerovista Gated Plotted Township",
      category: "alpine",
      location: "Prime Arterial Access Highway Sector",
      usdPrice: 42800000,
      beds: "Demarcated",
      baths: "Amenities",
      sqft: "40ft Bitumen Roads · Grand Entrance Arch",
      architect: "Master Infrastructure Consortium",
      yearBuilt: "2024",
      features: [
        "Grand security entrance portal with 24/7 CCTV surveillance",
        "Full compound boundary wall around entire township",
        "Underground cabling, water pipeline, and stormwater drains",
        "Curated avenue tree plantations along every road",
        "100% clear title with immediate registration conveyance"
      ],
      description: "An ultra-modern gated plotted community featuring a landmark entry portal, wide blacktop roads with pedestrian curbs, lush avenue landscaping, and premium residential plot demarcations.",
      gallery: [
        "assets/images/plot-layout-3d.jpg",
        "assets/images/plot-gated-enclave.jpg",
        "assets/images/plot-green-township.png"
      ]
    },
    4: {
      id: 4,
      title: "Greenfield Grand Highway Plots",
      category: "waterfront",
      location: "4-Lane High-Speed Arterial Corridor",
      usdPrice: 96000000,
      beds: "Highway Frontage",
      baths: "Commercial/NA",
      sqft: "4-Lane Highway Access with Green Buffer",
      architect: "Urban Infrastructure Authority",
      yearBuilt: "2024",
      features: [
        "Direct frontage on 4-lane major multi-lane highway",
        "Multi-row landscaped green buffer and central divider trees",
        "Ideal for commercial hubs, logistics, or premium residential layout",
        "Heavy vehicle access and signal-free interchange access",
        "High capital appreciation corridor with accelerated growth"
      ],
      description: "Prime highway-facing commercial and residential plots offering unmatched logistics connectivity, broad arterial frontage, and expansive landscaped greens.",
      gallery: [
        "assets/images/plot-highway-green.jpg",
        "assets/images/plot-land-boundary.jpg",
        "assets/images/plot-master-plan.jpg"
      ]
    },
    5: {
      id: 5,
      title: "Emerald Horizon Demarcated Land",
      category: "island",
      location: "Scenic Valley Investment Sector",
      usdPrice: 67000000,
      beds: "Clear Boundary",
      baths: "Geo-tagged",
      sqft: "50 Contiguous Acres",
      architect: "Landscape & Environmental Surveyors",
      yearBuilt: "2024",
      features: [
        "Precise satellite geo-tagged boundary markers",
        "Lush fertile green terrain suitable for farm villas or resort development",
        "Clear title ownership with clean legal history",
        "Perennial natural water source and electricity connectivity",
        "Zero-encumbrance certificate verified by legal counsel"
      ],
      description: "Expansive green land parcels featuring clear boundary demarcations, high agricultural or residential conversion potential, and stunning natural vistas.",
      gallery: [
        "assets/images/plot-land-boundary.jpg",
        "assets/images/plot-green-township.png",
        "assets/images/plot-layout-3d.jpg"
      ]
    },
    6: {
      id: 6,
      title: "Serene Palms Residential Layout",
      category: "alpine",
      location: "Lush Valley Plotted Gated Enclave",
      usdPrice: 52000000,
      beds: "180 Plots",
      baths: "Central Park",
      sqft: "Eco-Designed Layout Grid",
      architect: "Eco-Urban Living Architects",
      yearBuilt: "2023",
      features: [
        "Eco-friendly layout with extensive tree cover and parklands",
        "Well-planned internal street network with solar streetlamps",
        "Dedicated children's play area and senior citizen pavilion",
        "Rainwater percolation pits and eco-drainage channels",
        "Ready for immediate home construction"
      ],
      description: "A tranquil, eco-planned residential community with demarcated plots, lush avenue trees, community facilities, and top-tier infrastructure for family living.",
      gallery: [
        "assets/images/plot-green-township.png",
        "assets/images/plot-gated-enclave.jpg",
        "assets/images/plot-master-plan.jpg"
      ]
    }
  };

  // ==========================================
  // 2. CURRENCY CONVERSION ENGINE
  // ==========================================
  const CURRENCY_CONFIG = {
    USD: { symbol: '$', rate: 1.0, suffix: '' },
    EUR: { symbol: '€', rate: 0.92, suffix: '' },
    AED: { symbol: 'د.إ ', rate: 3.67, suffix: '' },
    GBP: { symbol: '£', rate: 0.79, suffix: '' }
  };

  let currentCurrency = 'USD';

  function formatCurrency(amountUSD) {
    const config = CURRENCY_CONFIG[currentCurrency];
    const converted = amountUSD * config.rate;
    return `${config.symbol}${Math.round(converted).toLocaleString()}${config.suffix}`;
  }

  function updateAllPricesOnPage() {
    // 1. Trophy Cards
    document.querySelectorAll('.price-pill-float').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-usd'));
      if (usd) el.textContent = formatCurrency(usd);
    });

    // 2. Inventory Cards
    document.querySelectorAll('.prop-price').forEach(el => {
      const usd = parseFloat(el.getAttribute('data-usd'));
      if (usd) el.textContent = formatCurrency(usd);
    });

    // 3. Update Calculator
    runCalculatorSim();
  }

  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      updateAllPricesOnPage();
      showToast(`Currency converted to ${currentCurrency}`);
    });
  }

  // ==========================================
  // 3. TOAST SYSTEM
  // ==========================================
  const toastHub = document.getElementById('toastHub');
  function showToast(message) {
    if (!toastHub) return;
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#98f014" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    toastHub.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ==========================================
  // 4. HERO SEARCH & FILTER BAR (21ST.DEV PATTERN)
  // ==========================================
  const searchTabs = document.querySelectorAll('.search-tab');
  searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const type = tab.getAttribute('data-type');
      showToast(`Catalog mode switched: ${tab.textContent.trim()}`);
    });
  });

  const executeSearchBtn = document.getElementById('executeSearchBtn');
  if (executeSearchBtn) {
    executeSearchBtn.addEventListener('click', () => {
      const loc = document.getElementById('filterLocation').value;
      const type = document.getElementById('filterType').value;
      const price = document.getElementById('filterPrice').value;

      const cards = document.querySelectorAll('.prop-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cardLoc = card.getAttribute('data-location');
        const cardPrice = parseFloat(card.getAttribute('data-price'));

        let matchLoc = (loc === 'all' || cardLoc === loc);
        let matchPrice = true;

        if (price === 'tier1') matchPrice = (cardPrice >= 15000000 && cardPrice <= 35000000);
        else if (price === 'tier2') matchPrice = (cardPrice > 35000000 && cardPrice <= 75000000);
        else if (price === 'tier3') matchPrice = (cardPrice > 75000000);

        if (matchLoc && matchPrice) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Scroll to inventory smoothly
      const inventorySection = document.getElementById('inventory');
      if (inventorySection) {
        inventorySection.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`Showing ${visibleCount} matching private estate(s)`);
    });
  }

  // ==========================================
  // 5. INVENTORY FILTER CHIPS
  // ==========================================
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');
      const cards = document.querySelectorAll('.prop-card');
      let count = 0;

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          count++;
        } else {
          card.style.display = 'none';
        }
      });
      showToast(`Filtered: ${chip.textContent.trim()}`);
    });
  });

  // Save to Watchlist buttons
  document.querySelectorAll('.btn-card-save').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('saved');
      if (btn.classList.contains('saved')) {
        showToast("Asset appended to your encrypted portfolio watchlist");
      } else {
        showToast("Asset removed from watchlist");
      }
    });
  });

  // ==========================================
  // 6. PROPERTY DOSSIER MODAL
  // ==========================================
  const propertyModal = document.getElementById('propertyModal');
  const modalDynamicContent = document.getElementById('modalDynamicContent');
  const closePropertyModalBtn = document.getElementById('closePropertyModalBtn');

  function openPropertyModal(propId) {
    const prop = PROPERTIES_DATA[propId];
    if (!prop || !modalDynamicContent || !propertyModal) return;

    modalDynamicContent.innerHTML = `
      <div class="dossier-grid">
        <div class="dossier-gallery">
          <img src="${prop.gallery[0]}" alt="${prop.title}" id="mainDossierImg" class="main-dossier-img">
          <div class="dossier-thumbs">
            ${prop.gallery.map((img, idx) => `
              <img src="${img}" alt="Thumbnail ${idx+1}" class="thumb-item ${idx===0?'active':''}" onclick="document.getElementById('mainDossierImg').src='${img}'; document.querySelectorAll('.thumb-item').forEach(t=>t.classList.remove('active')); this.classList.add('active');">
            `).join('')}
          </div>
        </div>

        <div class="dossier-info">
          <div class="confidential-badge mb-2">SOVEREIGN ESCROW DOSSIER</div>
          <h2 class="dossier-title">${prop.title}</h2>
          <div class="location-tag mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${prop.location}
          </div>
          <div class="dossier-price">${formatCurrency(prop.usdPrice)}</div>

          <div class="dossier-specs-list">
            <div class="dossier-spec-item">
              <span>Bedrooms / Suites</span>
              <strong>${prop.beds} Private Suites</strong>
            </div>
            <div class="dossier-spec-item">
              <span>Bathrooms</span>
              <strong>${prop.baths} Marble Baths</strong>
            </div>
            <div class="dossier-spec-item">
              <span>Living Area / Acreage</span>
              <strong>${prop.sqft}</strong>
            </div>
            <div class="dossier-spec-item">
              <span>Architectural Firm</span>
              <strong>${prop.architect}</strong>
            </div>
          </div>

          <p class="dossier-desc">${prop.description}</p>

          <h4 class="text-sm font-bold tracking-wider uppercase mb-2 text-white">KEY STRUCTURAL SPECIFICATIONS:</h4>
          <ul class="step-features mb-4">
            ${prop.features.map(f => `<li>${f}</li>`).join('')}
          </ul>

          <div class="flex gap-3 mt-4">
            <button class="btn-primary w-full" id="dossierBookViewingBtn">Schedule Private Helicopter Viewing</button>
          </div>
        </div>
      </div>
    `;

    propertyModal.classList.add('active');

    // Wire up button inside dynamic content
    const dossierBookBtn = document.getElementById('dossierBookViewingBtn');
    if (dossierBookBtn) {
      dossierBookBtn.addEventListener('click', () => {
        propertyModal.classList.remove('active');
        openConsultationModal(prop.title);
      });
    }
  }

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      openPropertyModal(id);
    });
  });

  if (closePropertyModalBtn) {
    closePropertyModalBtn.addEventListener('click', () => {
      propertyModal.classList.remove('active');
    });
  }

  // ==========================================
  // 7. PRIVATE VIEWING CONSULTATION MODAL
  // ==========================================
  const consultModal = document.getElementById('consultModal');
  const closeConsultModalBtn = document.getElementById('closeConsultModalBtn');
  const consultPropertyName = document.getElementById('consultPropertyName');

  function openConsultationModal(propertyName = "Villa Céleste & Marine Sanctuary") {
    if (!consultModal) return;
    if (consultPropertyName) {
      consultPropertyName.value = propertyName;
    }
    consultModal.classList.add('active');
  }

  document.querySelectorAll('.book-tour-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title');
      openConsultationModal(title);
    });
  });

  const openConsultModalBtn = document.getElementById('openConsultModalBtn');
  if (openConsultModalBtn) {
    openConsultModalBtn.addEventListener('click', () => openConsultationModal());
  }

  const mobileConsultBtn = document.getElementById('mobileConsultBtn');
  if (mobileConsultBtn) {
    mobileConsultBtn.addEventListener('click', () => {
      document.getElementById('mobileDrawer')?.classList.remove('active');
      openConsultationModal();
    });
  }

  const consultAdvisorBtn = document.getElementById('consultAdvisorBtn');
  if (consultAdvisorBtn) {
    consultAdvisorBtn.addEventListener('click', () => openConsultationModal("Portfolio Financing Mandate"));
  }

  if (closeConsultModalBtn) {
    closeConsultModalBtn.addEventListener('click', () => {
      consultModal.classList.remove('active');
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === propertyModal) propertyModal.classList.remove('active');
    if (e.target === consultModal) consultModal.classList.remove('active');
  });

  // Handle consultation form submit
  const quickConsultForm = document.getElementById('quickConsultForm');
  if (quickConsultForm) {
    quickConsultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      consultModal.classList.remove('active');
      showToast("Viewing dispatch confirmed. Private counsel will connect via encrypted channel.");
      quickConsultForm.reset();
    });
  }

  // ==========================================
  // 8. CAPITAL YIELD & FINANCING SIMULATOR
  // ==========================================
  const propValSlider = document.getElementById('propValSlider');
  const downSlider = document.getElementById('downSlider');
  const rateSlider = document.getElementById('rateSlider');
  const termSlider = document.getElementById('termSlider');
  const yieldSlider = document.getElementById('yieldSlider');

  const valDisplay = document.getElementById('valDisplay');
  const downDisplay = document.getElementById('downDisplay');
  const rateDisplay = document.getElementById('rateDisplay');
  const termDisplay = document.getElementById('termDisplay');
  const yieldDisplay = document.getElementById('yieldDisplay');

  const monthlyMortgageResult = document.getElementById('monthlyMortgageResult');
  const monthlyRentResult = document.getElementById('monthlyRentResult');
  const annualRentResult = document.getElementById('annualRentResult');
  const netMonthlyResult = document.getElementById('netMonthlyResult');
  const tenYearEquityResult = document.getElementById('tenYearEquityResult');

  function runCalculatorSim() {
    if (!propValSlider || !downSlider || !rateSlider || !termSlider || !yieldSlider) return;

    const valUSD = parseFloat(propValSlider.value);
    const downPct = parseFloat(downSlider.value) / 100;
    const ratePct = parseFloat(rateSlider.value) / 100;
    const termYears = parseInt(termSlider.value);
    const yieldPct = parseFloat(yieldSlider.value) / 100;

    // Displays
    valDisplay.textContent = formatCurrency(valUSD);
    const downEquityUSD = valUSD * downPct;
    downDisplay.textContent = `${Math.round(downPct * 100)}% (${formatCurrency(downEquityUSD)})`;
    rateDisplay.textContent = `${(ratePct * 100).toFixed(2)}%`;
    termDisplay.textContent = `${termYears} Years`;
    yieldDisplay.textContent = `${(yieldPct * 100).toFixed(1)}%`;

    // Loan calculations
    const loanPrincipalUSD = valUSD * (1 - downPct);
    const monthlyRate = ratePct / 12;
    const totalPayments = termYears * 12;

    let monthlyPaymentUSD = 0;
    if (monthlyRate > 0) {
      monthlyPaymentUSD = loanPrincipalUSD * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPaymentUSD = loanPrincipalUSD / totalPayments;
    }

    // Rental yield
    const annualRentUSD = valUSD * yieldPct;
    const monthlyRentUSD = annualRentUSD / 12;
    const netCashflowUSD = monthlyRentUSD - monthlyPaymentUSD;

    // 10-Year appreciation projection (5.2% compounded)
    const tenYearValueUSD = valUSD * Math.pow(1 + 0.052, 10);
    // Approximate remaining loan after 10 years
    const remainingLoanRatio = Math.max(0, (totalPayments - 120) / totalPayments);
    const remainingLoanUSD = loanPrincipalUSD * remainingLoanRatio;
    const netTenYearEquityUSD = tenYearValueUSD - remainingLoanUSD;

    // Render results
    monthlyMortgageResult.textContent = `${formatCurrency(monthlyPaymentUSD)} /mo`;
    monthlyRentResult.textContent = `${formatCurrency(monthlyRentUSD)} /mo`;
    annualRentResult.textContent = `(${formatCurrency(annualRentUSD)} /yr)`;

    if (netCashflowUSD >= 0) {
      netMonthlyResult.textContent = `+${formatCurrency(netCashflowUSD)} /mo`;
      netMonthlyResult.className = 'sub-metric-val positive';
    } else {
      netMonthlyResult.textContent = `-${formatCurrency(Math.abs(netCashflowUSD))} /mo`;
      netMonthlyResult.className = 'sub-metric-val text-red-400';
    }

    tenYearEquityResult.textContent = formatCurrency(netTenYearEquityUSD);
  }

  [propValSlider, downSlider, rateSlider, termSlider, yieldSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', runCalculatorSim);
    }
  });

  // Initial Calculation Run
  runCalculatorSim();

  // ==========================================
  // 9. CONFIDENTIAL INQUIRY FORM
  // ==========================================
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('clientName').value;
      showToast(`Mandate registered for ${clientName}. Encrypted dispatch sent to Swiss desk.`);
      inquiryForm.reset();
    });
  }

  // ==========================================
  // 10. MOBILE NAVIGATION & BACK TO TOP
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('active');
    });
  });

  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
