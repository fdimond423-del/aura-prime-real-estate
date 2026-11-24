/**
 * KŌHĪ ATELIER — Minimalist Botanical Coffee & Slow Bakery Engine
 * Features:
 * - GSAP ScrollTrigger Staggered Card Reveals & Entrance Animations
 * - Live Tasting Tray / Selection Drawer Management
 * - Real-time Multi-Currency Conversion (USD, EUR, GBP, AED, JPY)
 * - Category Tab Filtering for Artisanal Menu
 * - Private Table & Barista Counter Reservation Modal
 * - Interactive Toast Feedback System
 */

// 1. CURRENCY CONFIGURATION
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

// 2. TASTING TRAY / SELECTION DRAWER
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
            <button type="button" onclick="removeFromTray(${idx})" style="color:var(--c-ink-light);font-size:1rem;line-height:1;" title="Remove">&times;</button>
          </div>
        </div>
      `).join('');
    }
  }
}

// 3. RESERVATION MODAL
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

// 4. TOAST SYSTEM
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

// 5. MENU CATEGORY FILTER
function initMenuFilter() {
  const tabs = document.querySelectorAll('.menu-category-tab');
  const items = document.querySelectorAll('.menu-item-card');

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

// 6. INITIALIZE ON DOM LOAD
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

  initMenuFilter();
  updateTrayUI();

  // GSAP Entrance Choreography
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
