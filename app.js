/**
 * AURA PRIME — Sovereign Land Atelier Engine
 * Exact Procedural Mathematics & GSAP Choreography from Kedhar Mehndi Atelier
 * Features:
 * - Algorithmic Mandalas, Paisleys, Filigrees, Brocades & Damask Grounds (100% Code-Generated SVGs)
 * - Live Morphing Cusped Mughal Arch Window on the Hero Panel
 * - GSAP ScrollTrigger Choreography (Stuck Navbar, Shimmer Gilt, Staggered Reveals)
 * - Portfolio Bag Drawer with Flying Gold Seal Micro-Interaction
 * - Compounding Yield Simulator & Archival Dossier Modal
 * - Multi-Currency Exchange (USD, EUR, AED, GBP)
 */

// ==========================================================================
// 1. PROCEDURAL SVG GENERATORS (EXACT KEDHAR MATHEMATICS)
// ==========================================================================

const fx = (n) => +n.toFixed(2);

function rng(seed) {
  let t = seed >>> 0 || 1;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function polar(r, a) {
  return [fx(r * Math.cos(a)), fx(r * Math.sin(a))];
}

function petalPath(r0, r1, a, spread) {
  const mid = (r0 + r1) / 2;
  const [x0, y0] = polar(r0, a);
  const [x1, y1] = polar(r1, a);
  const [cx1, cy1] = polar(mid, a + spread);
  const [cx2, cy2] = polar(mid, a - spread);
  return `M${x0},${y0}Q${cx1},${cy1} ${x1},${y1}Q${cx2},${cy2} ${x0},${y0}Z`;
}

function scallopPath(r, n, phase) {
  let d = "";
  const step = (Math.PI * 2) / n;
  const chord = 2 * r * Math.sin(step / 2);
  const ar = fx(chord * 0.56);
  for (let i = 0; i < n; i++) {
    const [x0, y0] = polar(r, phase + i * step);
    const [x1, y1] = polar(r, phase + (i + 1) * step);
    d += (i ? "" : `M${x0},${y0}`) + `A${ar},${ar} 0 0 1 ${x1},${y1}`;
  }
  return d + "Z";
}

function mandalaRings(seed, R) {
  const r = rng(seed);
  const kinds = ["petal", "dots", "scallop", "spike", "circle", "ticks"];
  const rings = [];
  let radius = R * 0.07;
  let last = "";
  rings.push({ kind: "circle", r: radius, r2: radius, n: 1, phase: 0, spread: 0 });
  while (radius < R * 0.96) {
    let kind = kinds[Math.floor(r() * kinds.length)];
    while (kind === last) kind = kinds[Math.floor(r() * kinds.length)];
    last = kind;
    const band = R * (kind === "petal" || kind === "spike" ? 0.09 + r() * 0.09 : kind === "dots" ? 0.035 : kind === "ticks" ? 0.04 : 0.03);
    const n = kind === "circle" ? 1 : 8 * (1 + Math.floor(r() * 4));
    const next = radius + band;
    rings.push({ kind, r: fx(radius + band * 0.08), r2: fx(next), n, phase: r() < 0.5 ? 0 : Math.PI / n, spread: fx(0.35 + r() * 0.3) });
    radius = next + R * 0.012;
  }
  return rings;
}

function ringMarks(ring) {
  const paths = [];
  const dots = [];
  const step = (Math.PI * 2) / ring.n;
  if (ring.kind === "circle") {
    paths.push(`M${fx(ring.r)},0A${fx(ring.r)},${fx(ring.r)} 0 1 1 ${fx(-ring.r)},0A${fx(ring.r)},${fx(ring.r)} 0 1 1 ${fx(ring.r)},0Z`);
  } else if (ring.kind === "scallop") {
    paths.push(scallopPath(ring.r, ring.n, ring.phase));
  } else if (ring.kind === "petal" || ring.kind === "spike") {
    const spread = ring.kind === "spike" ? step * 0.42 : step * ring.spread;
    for (let i = 0; i < ring.n; i++) paths.push(petalPath(ring.r, ring.r2, ring.phase + i * step, spread));
    if (ring.kind === "petal") {
      const inner = ring.r + (ring.r2 - ring.r) * 0.22;
      const innerTop = ring.r + (ring.r2 - ring.r) * 0.78;
      for (let i = 0; i < ring.n; i++) paths.push(petalPath(inner, innerTop, ring.phase + i * step, spread * 0.42));
    }
  } else if (ring.kind === "dots") {
    const rad = Math.max(0.6, (ring.r2 - ring.r) * 0.32);
    for (let i = 0; i < ring.n; i++) {
      const [x, y] = polar((ring.r + ring.r2) / 2, ring.phase + i * step);
      dots.push([x, y, fx(rad)]);
    }
  } else {
    for (let i = 0; i < ring.n; i++) {
      const [x0, y0] = polar(ring.r, ring.phase + i * step);
      const [x1, y1] = polar(ring.r2, ring.phase + i * step);
      paths.push(`M${x0},${y0}L${x1},${y1}`);
    }
  }
  return { paths, dots };
}

function leafPath(a, b, w) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const px = (-dy / l) * w;
  const py = (dx / l) * w;
  return `M${fx(a[0])},${fx(a[1])}Q${fx(mx + px)},${fx(my + py)} ${fx(b[0])},${fx(b[1])}Q${fx(mx - px)},${fx(my - py)} ${fx(a[0])},${fx(a[1])}Z`;
}

function dotPath(c, r) {
  return `M${fx(c[0] - r)},${fx(c[1])}a${fx(r)},${fx(r)} 0 1 0 ${fx(2 * r)},0a${fx(r)},${fx(r)} 0 1 0 ${fx(-2 * r)},0`;
}

function spiral(start, heading, r0, turns, dir, steps) {
  const cx = start[0] + Math.cos(heading + (dir * Math.PI) / 2) * r0;
  const cy = start[1] + Math.sin(heading + (dir * Math.PI) / 2) * r0;
  const a0 = Math.atan2(start[1] - cy, start[0] - cx);
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = r0 * (1 - 0.82 * t);
    const a = a0 + dir * t * turns * Math.PI * 2;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}

function smoothPath(pts, closed) {
  const n = pts.length;
  if (n < 2) return "";
  const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${fx(pts[0][0])},${fx(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    d += `C${fx(p1[0] + (p2[0] - p0[0]) / 6)},${fx(p1[1] + (p2[1] - p0[1]) / 6)} ${fx(p2[0] - (p3[0] - p1[0]) / 6)},${fx(p2[1] - (p3[1] - p1[1]) / 6)} ${fx(p2[0])},${fx(p2[1])}`;
  }
  return d + (closed ? "Z" : "");
}

function filigreeArm(len, amp, waves, seed) {
  const r = rng(seed);
  const N = 64;
  const vine = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    vine.push([t * len, amp * Math.sin(t * waves * Math.PI) * (1 - 0.45 * t)]);
  }
  const end = vine[N];
  const pre = vine[N - 1];
  const endSide = Math.sin(waves * Math.PI - 0.01) >= 0 ? 1 : -1;
  const curl = spiral(end, Math.atan2(end[1] - pre[1], end[0] - pre[0]), amp * 0.5, 1.15, endSide, 26);
  const tendrils = [];
  const leaves = [];
  const dots = [];
  for (let k = 0; k < waves; k++) {
    const i = Math.round(((k + 0.5) / waves) * N);
    const p = vine[i];
    const q = vine[Math.min(N, i + 1)];
    const h = Math.atan2(q[1] - p[1], q[0] - p[0]);
    const side = p[1] >= 0 ? 1 : -1;
    const out = h + side * (0.75 + r() * 0.25);
    const sp = spiral(p, out, amp * (0.42 + r() * 0.16) * (1 - 0.35 * (k / waves)), 1.05 + r() * 0.25, -side, 24);
    tendrils.push(smoothPath(sp, false));
    dots.push(dotPath(sp[sp.length - 1], 1.3));

    const j = Math.round((k / waves) * N + N / waves / 5);
    const lp = vine[Math.min(N - 1, j)];
    const lq = vine[Math.min(N, j + 1)];
    const lh = Math.atan2(lq[1] - lp[1], lq[0] - lp[0]);
    const ls = lp[1] >= 0 ? -1 : 1;
    const L = amp * (0.62 + r() * 0.2);
    leaves.push(leafPath(lp, [lp[0] + Math.cos(lh + ls * 0.7) * L, lp[1] + Math.sin(lh + ls * 0.7) * L], L * 0.26));
    leaves.push(leafPath(lp, [lp[0] + Math.cos(lh + ls * 1.5) * L * 0.7, lp[1] + Math.sin(lh + ls * 1.5) * L * 0.7], L * 0.2));
  }
  dots.push(dotPath(curl[curl.length - 1], 1.6));
  return { vine: smoothPath(vine.concat(curl.slice(1)), false), tendrils, leaves: leaves.join(""), dots: dots.join("") };
}

/**
 * Pointed two-centred Mughal arch cut into lobes (Parametric morph k)
 */
function archPath(x, y, w, h, k, lobes) {
  w = Math.max(w, 0.001);
  h = Math.max(h, 0);
  k = Math.min(1, Math.max(0, k));
  const want = Math.min(w * 0.62, h * 0.72);
  const riseU = Math.max(want, w / 2 + 1e-6);
  const squash = (want / riseU) * k;
  const d = (riseU * riseU - (w * w) / 4) / w;
  const R = w / 2 + d;
  const sy = y + want * k;
  const th1 = Math.atan2(riseU, -d);
  const left = [];
  for (let i = 0; i <= lobes; i++) {
    const th = Math.PI + ((th1 - Math.PI) * i) / lobes;
    left.push([x + R + R * Math.cos(th), sy - R * Math.sin(th) * squash]);
  }
  const right = left.slice(0, -1).reverse().map((p) => [2 * x + w - p[0], p[1]]);
  const crown = left.concat(right);
  let p = `M${fx(x)},${fx(y + h)}L${fx(x)},${fx(sy)}`;
  for (let i = 1; i < crown.length; i++) {
    const a = crown[i - 1];
    const b = crown[i];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const bulge = 0.34 * k;
    p += `Q${fx((a[0] + b[0]) / 2 + dy * bulge)},${fx((a[1] + b[1]) / 2 - dx * bulge)} ${fx(b[0])},${fx(b[1])}`;
  }
  return p + `L${fx(x + w)},${fx(y + h)}Z`;
}

// ==========================================================================
// 2. ORNAMENT RENDERERS INTO DOM
// ==========================================================================

function renderMandala(el, seed, fill = true, strokeWidth = 0.55) {
  const rings = mandalaRings(seed, 98).map((ring) => ({ ring, ...ringMarks(ring) }));
  let html = `<svg viewBox="-100 -100 200 200" aria-hidden="true" style="width:100%;height:100%;overflow:visible;">`;
  rings.forEach(({ ring, paths, dots }) => {
    html += `<g class="mat-ring">`;
    paths.forEach((d) => {
      const f = fill && ring.kind === "petal" ? "currentColor" : "none";
      const fOp = fill && ring.kind === "petal" ? "0.16" : "0";
      html += `<path d="${d}" pathLength="1" fill="${f}" fill-opacity="${fOp}" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`;
    });
    dots.forEach(([x, y, r]) => {
      html += `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor"/>`;
    });
    html += `</g>`;
  });
  html += `<circle r="2.2" fill="currentColor"/></svg>`;
  el.innerHTML = html;
}

function renderFiligree(el, corner = "tl", seed = 1) {
  const a = filigreeArm(178, 20, 3, seed);
  const b = filigreeArm(178, 20, 3, seed + 1);
  const c = filigreeArm(104, 11, 2, seed + 2);
  const d = filigreeArm(104, 11, 2, seed + 3);

  const flip = corner === "tr" ? "translate(200,0) scale(-1,1)" : corner === "bl" ? "translate(0,200) scale(1,-1)" : corner === "br" ? "translate(200,200) scale(-1,-1)" : "";

  function armSvg(arm, t, w) {
    let s = `<g transform="${t}">`;
    s += `<path class="mat-dr" d="${arm.vine}" pathLength="1" fill="none" stroke="currentColor" stroke-width="${2 * w}" stroke-linecap="round"/>`;
    arm.tendrils.forEach((d) => {
      s += `<path class="mat-dr" d="${d}" pathLength="1" fill="none" stroke="currentColor" stroke-width="${1.4 * w}" stroke-linecap="round"/>`;
    });
    s += `<path class="mat-fl" d="${arm.leaves}" fill="currentColor" fill-opacity="0.7" stroke="currentColor" stroke-width="0.7"/>`;
    s += `<path class="mat-fl" d="${arm.dots}" fill="currentColor"/>`;
    s += `</g>`;
    return s;
  }

  let html = `<svg viewBox="0 0 200 200" aria-hidden="true" style="width:100%;height:100%;overflow:visible;">`;
  html += `<g transform="${flip}">`;
  html += armSvg(a, "translate(12,12)", 1);
  html += armSvg(b, "translate(12,12) rotate(90) scale(1,-1)", 1);
  html += armSvg(c, "translate(46,42)", 0.7);
  html += armSvg(d, "translate(42,46) rotate(90) scale(1,-1)", 0.7);
  html += `<g transform="translate(12,12)">`;
  [0.12, 0.36, 0.6, 0.785, 0.97, 1.21, 1.45].forEach((ang, i) => {
    html += `<path class="mat-fl" d="${petalPath(6, i === 3 ? 56 : i % 2 ? 30 : 44, ang, i === 3 ? 0.16 : 0.2)}" fill="currentColor" fill-opacity="0.32" stroke="currentColor" stroke-width="1"/>`;
  });
  html += `<circle class="mat-fl" r="9" fill="none" stroke="currentColor" stroke-width="1.2"/>`;
  html += `<circle class="mat-fl" r="5" fill="currentColor"/>`;
  for (let i = 0; i < 5; i++) {
    const [x, y] = polar(64, 0.785 + (i - 2) * 0.16);
    html += `<circle class="mat-fl" cx="${x}" cy="${y}" r="${i === 2 ? 2.6 : 1.6}" fill="currentColor"/>`;
  }
  html += `</g></g></svg>`;
  el.innerHTML = html;
}

function renderFlourish(el, seed = 4) {
  const a = filigreeArm(150, 8, 2, seed);
  function side(t) {
    let s = `<g transform="${t}">`;
    s += `<path class="mat-dr" d="${a.vine}" pathLength="1" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>`;
    a.tendrils.forEach((d) => {
      s += `<path class="mat-dr" d="${d}" pathLength="1" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>`;
    });
    s += `<path class="mat-fl" d="${a.leaves}" fill="currentColor" fill-opacity="0.6"/>`;
    s += `<path class="mat-fl" d="${a.dots}" fill="currentColor"/>`;
    s += `</g>`;
    return s;
  }
  let html = `<svg viewBox="-200 -26 400 52" aria-hidden="true" style="width:100%;height:auto;overflow:visible;">`;
  html += side("translate(22,0)");
  html += side("translate(-22,0) scale(-1,1)");
  html += `<g class="mat-fl">`;
  [-1.5708, -0.95, -2.19, 1.5708].forEach((ang, i) => {
    html += `<path d="${petalPath(3, i === 3 ? 12 : i === 0 ? 20 : 15, ang, 0.36)}" fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="0.9"/>`;
  });
  html += `<circle r="3.6" fill="currentColor"/></g></svg>`;
  el.innerHTML = html;
}

// ==========================================================================
// 3. CURRENCY SYSTEM
// ==========================================================================
const CURRENCY_RATES = {
  USD: { rate: 1.0, symbol: '$', code: 'USD' },
  EUR: { rate: 0.92, symbol: '€', code: 'EUR' },
  AED: { rate: 3.67, symbol: 'AED ', code: 'AED' },
  GBP: { rate: 0.79, symbol: '£', code: 'GBP' }
};

let activeCurrency = 'USD';

function formatPrice(usd, currency = activeCurrency) {
  const cfg = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const val = Math.round(usd * cfg.rate);
  return `${cfg.symbol}${val.toLocaleString('en-US')}`;
}

function updatePrices() {
  document.querySelectorAll('.price-dynamic').forEach((el) => {
    const usd = parseFloat(el.getAttribute('data-usd'));
    if (!isNaN(usd)) {
      el.textContent = formatPrice(usd);
    }
  });
}

// ==========================================================================
// 4. SANCTUARIES MASTER REPOSITORY
// ==========================================================================
const ENCLAVES_DATA = {
  'amrutha-varshini': {
    title: 'Sri Sri Amrutha Varshini',
    badge: 'SIGNATURE GATED SANCTUARY',
    image: 'assets/images/amrutha-varshini-entrance.jpg',
    desc: 'Grand monumental entrance gatehouse, 24/7 security watchtower portico, avenue trees, asphalt roadways, rainwater percolation grid, and clear 30-year forensic title documentation ready for immediate deed registry.',
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
    badge: '30 M.T. ARTERIAL GRID',
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
    badge: 'EXPRESSWAY CORRIDOR',
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
    badge: 'ECO RESIDENTIAL GRID',
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

// ==========================================================================
// 5. PORTFOLIO BAG DRAWER & ALLOCATION STATE
// ==========================================================================
let portfolioBag = [];

function toggleDrawer(open) {
  const wrap = document.getElementById('bagDrawerWrap');
  if (wrap) {
    if (open !== undefined) {
      wrap.classList.toggle('is-open', open);
    } else {
      wrap.classList.toggle('is-open');
    }
  }
}

function updateBagUI() {
  const listEl = document.getElementById('drawerList');
  const emptyEl = document.getElementById('drawerEmpty');
  const countEl = document.getElementById('drawerCount');
  const totalEl = document.getElementById('drawerTotal');
  const badgeEl = document.getElementById('bandBagBadge');
  const bandTotalEl = document.getElementById('bandTotal');

  const count = portfolioBag.length;
  const total = portfolioBag.reduce((sum, item) => sum + item.usdPrice, 0);

  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = formatPrice(total);
  if (bandTotalEl) bandTotalEl.textContent = formatPrice(total);

  if (badgeEl) {
    badgeEl.textContent = count;
    badgeEl.classList.toggle('is-on', count > 0);
  }

  if (listEl && emptyEl) {
    if (count === 0) {
      listEl.style.display = 'none';
      emptyEl.style.display = 'flex';
    } else {
      emptyEl.style.display = 'none';
      listEl.style.display = 'block';
      listEl.innerHTML = portfolioBag.map((item, idx) => `
        <li>
          <div>
            <p>${item.title}</p>
            <small>${item.badge}</small>
          </div>
          <button type="button" onclick="removeFromPortfolio(${idx})" style="color:var(--maroon);font-size:12px;font-family:var(--caps);letter-spacing:0.1em;">REMOVE</button>
          <b>${formatPrice(item.usdPrice)}</b>
        </li>
      `).join('');
    }
  }
}

function addToPortfolio(key, fromEl) {
  const data = ENCLAVES_DATA[key];
  if (!data) return;

  if (!portfolioBag.some(item => item.key === key)) {
    portfolioBag.push({ ...data, key });
  }

  updateBagUI();
  showToast(`✦ ${data.title} added to Sovereign Portfolio.`);

  // Flying seal micro-interaction to bag icon
  if (fromEl && window.gsap) {
    const bagBtn = document.querySelector('.mat-icon-btn.mat-bag-btn');
    if (bagBtn) {
      const a = fromEl.getBoundingClientRect();
      const z = bagBtn.getBoundingClientRect();
      const drop = document.createElement('span');
      drop.style.position = 'fixed';
      drop.style.zIndex = '9999';
      drop.style.width = '18px';
      drop.style.height = '18px';
      drop.style.borderRadius = '50%';
      drop.style.background = 'var(--gold)';
      drop.style.boxShadow = '0 0 10px rgba(198,154,72,0.8)';
      drop.style.left = `${a.left + a.width / 2}px`;
      drop.style.top = `${a.top + a.height / 2}px`;
      document.body.appendChild(drop);

      gsap.timeline({ onComplete: () => drop.remove() })
        .to(drop, { x: z.left - a.left, duration: 0.7, ease: "power1.in" }, 0)
        .to(drop, { y: z.top - a.top, duration: 0.7, ease: "back.in(2)" }, 0)
        .to(drop, { scale: 0.4, opacity: 0, duration: 0.7 }, 0);
    }
  }
}

function removeFromPortfolio(idx) {
  portfolioBag.splice(idx, 1);
  updateBagUI();
}

function showToast(text) {
  const toast = document.getElementById('matToast');
  if (toast) {
    toast.textContent = text;
    toast.classList.add('is-on');
    setTimeout(() => {
      toast.classList.remove('is-on');
    }, 3200);
  }
}

// ==========================================================================
// 6. ARCHIVAL DOSSIER MODAL
// ==========================================================================
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
  modalPrice.textContent = formatPrice(data.usdPrice);

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

// ==========================================================================
// 7. COMPOUNDING YIELD SIMULATOR
// ==========================================================================
const YIELD_TIERS = [
  { name: "Arterial Highway Frontage", cagr: 16.5, years: 5, price: 2250000 },
  { name: "Sovereign Gated Enclave", cagr: 14.8, years: 7, price: 2400000 },
  { name: "Master Geometric Grid", cagr: 15.2, years: 6, price: 1850000 },
  { name: "Scenic Valley Acreage", cagr: 13.5, years: 8, price: 1950000 }
];

let selectedYieldIndex = 1;

function selectYieldTier(idx) {
  selectedYieldIndex = idx;
  document.querySelectorAll('.mat-design-row').forEach((row, i) => {
    row.classList.toggle('is-on', i === idx);
  });
  const t = YIELD_TIERS[idx];
  const maturity = Math.round(t.price * Math.pow(1 + t.cagr / 100, t.years));
  const sumEl = document.getElementById('designSumVal');
  if (sumEl) {
    sumEl.innerHTML = `<b>${formatPrice(maturity)}</b> · ${t.years} Years @ ${t.cagr}% CAGR`;
  }
}

// ==========================================================================
// 8. HERO ARCH WINDOW RESIZING & SCROLL MORPH
// ==========================================================================
const winState = { W: 0, H: 0, grow: 1, open: 0 };

function paintHeroArch() {
  const panel = document.getElementById('heroPanelR');
  const img = document.getElementById('heroWinImg');
  const svg = document.getElementById('heroWinSvg');
  const outer = document.getElementById('heroWinOuter');
  const inner = document.getElementById('heroWinInner');

  if (!panel || !img || !winState.W) return;
  const { W, H, grow, open } = winState;
  const ah0 = Math.min(H * 0.6, (W * 0.66) / 0.76);
  const aw0 = ah0 * 0.76;
  const ax0 = (W - aw0) / 2;
  const ay0 = Math.max(28, H * 0.085);
  const g = Math.min(1, Math.max(0, grow));

  const x = ax0 + (0 - ax0) * open;
  const y = (ay0 + ah0 * (1 - g)) + (0 - (ay0 + ah0 * (1 - g))) * open;
  const w = aw0 + (W - aw0) * open;
  const hh = (ah0 * g) + (H - (ah0 * g)) * open;
  const k = 1 - open;

  img.style.clipPath = `path("${archPath(x, y, w, hh, k, 4)}")`;
  panel.style.setProperty("--open", open.toFixed(3));

  if (svg) svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  if (outer) outer.setAttribute("d", archPath(x - 12, y - 16, w + 24, hh + 16 + 12 * g, k, 4));
  if (inner) inner.setAttribute("d", archPath(x + 8, y + 10, Math.max(0, w - 16), Math.max(0, hh - 18), k, 4));
}

function initHeroArchMorph() {
  const panel = document.getElementById('heroPanelR');
  if (!panel) return;

  const measure = () => {
    winState.W = panel.clientWidth;
    winState.H = panel.clientHeight;
    paintHeroArch();
  };
  measure();

  const ro = new ResizeObserver(measure);
  ro.observe(panel);

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const heroH = panel.clientHeight || 700;
    const openProgress = Math.min(1, Math.max(0, scrollY / (heroH * 0.75)));
    winState.open = openProgress;
    paintHeroArch();
  }, { passive: true });
}

// ==========================================================================
// 9. INITIALIZE ON DOM LOAD
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Render Procedural SVGs
  document.querySelectorAll('.mat-mandala[data-seed]').forEach((el) => {
    const s = parseInt(el.getAttribute('data-seed'), 10) || 7;
    renderMandala(el, s);
  });

  document.querySelectorAll('.mat-filigree[data-seed]').forEach((el) => {
    const s = parseInt(el.getAttribute('data-seed'), 10) || 1;
    const c = el.getAttribute('data-corner') || 'tl';
    renderFiligree(el, c, s);
  });

  document.querySelectorAll('.mat-flourish[data-seed]').forEach((el) => {
    const s = parseInt(el.getAttribute('data-seed'), 10) || 4;
    renderFlourish(el, s);
  });

  // Setup Product Arches
  document.querySelectorAll('.mat-arch[data-arch]').forEach((el) => {
    const clipId = `archClip_${Math.random().toString(36).substr(2, 9)}`;
    const W = 300;
    const H = 390;
    const d = archPath(0, 0, W, H, 1, 4);
    const dOuter = archPath(-10, -14, W + 20, H + 24, 1, 4);
    const dInner = archPath(7, 9, W - 14, H - 16, 1, 4);
    const imgSrc = el.getAttribute('data-img');
    const imgAlt = el.getAttribute('data-alt') || '';

    el.innerHTML = `
      <svg viewBox="-14 -18 ${W + 28} ${H + 30}" role="img" aria-label="${imgAlt}">
        <defs>
          <clipPath id="${clipId}">
            <path d="${d}"/>
          </clipPath>
        </defs>
        <g clip-path="url(#${clipId})">
          <rect width="${W}" height="${H}" fill="var(--mat-sand)"/>
          <image class="mat-arch-img" href="${imgSrc}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
          <rect class="mat-arch-tint" width="${W}" height="${H}"/>
        </g>
        <path class="mat-dr mat-arch-line" d="${dOuter}" pathLength="1" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path class="mat-dr mat-arch-line" d="${dInner}" pathLength="1" fill="none" stroke="currentColor" stroke-width="0.8"/>
      </svg>
      ${el.innerHTML}
    `;
  });

  // Initialize Hero Arch Morph
  initHeroArchMorph();

  // Currency Select
  const currSelect = document.getElementById('currencySelect');
  if (currSelect) {
    currSelect.addEventListener('change', (e) => {
      activeCurrency = e.target.value;
      updatePrices();
      selectYieldTier(selectedYieldIndex);
      updateBagUI();
    });
  }

  // Sticky Navbar & Progress
  const navbar = document.getElementById('atelierNavbar');
  const band = document.getElementById('brandBand');
  const progBar = document.getElementById('progressBar');

  window.addEventListener('scroll', () => {
    if (band && navbar) {
      const rect = band.getBoundingClientRect();
      navbar.classList.toggle('is-stuck', rect.bottom <= 0);
    }
    if (progBar) {
      const winH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = winH > 0 ? (window.pageYOffset / winH) : 0;
      progBar.style.transform = `scaleX(${pct.toFixed(4)})`;
    }
  }, { passive: true });

  // Yield Tier Default
  selectYieldTier(1);

  // Modal Backdrop Click
  const modal = document.getElementById('dossierModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeDossierModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDossierModal();
      toggleDrawer(false);
    }
  });

  // GSAP Entrance
  if (window.gsap) {
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".mat-strip-in > *", { y: -12, opacity: 0, duration: 0.8, stagger: 0.08 }, 0)
      .from(".mat-word-ch", { y: 30, opacity: 0, duration: 1.2, stagger: 0.04 }, 0.1)
      .from(".mat-tab", { y: -16, opacity: 0, duration: 0.8, stagger: 0.05 }, 0.3);
  }
});
