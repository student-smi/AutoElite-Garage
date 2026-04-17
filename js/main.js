/* ====================================
   AUTOELITE GARAGE — MAIN JAVASCRIPT
   ==================================== */

'use strict';

/* ─── PRELOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initReveal();
    initCounters();
  }, 2200);
});
document.body.style.overflow = 'hidden';

/* ─── PARTICLE CANVAS ───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? '#FF6B00' : '#ffffff';
    };
    this.reset();
  }

  function init() {
    resize();
    particles = [];
    const count = Math.floor((W * H) / 12000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) p.reset();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();

/* ─── SCROLL PROGRESS BAR ───────────────────────────────────── */
(function() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ─── NAVBAR ────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn && scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn && scrollTopBtn.classList.remove('visible');
  }
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  const sections = document.querySelectorAll('.page-section');
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.4) current = sec.id;
  });
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === current);
  });
}

/* ─── HAMBURGER / MOBILE MENU ───────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('[data-close]').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ─── SMOOTH SCROLL HELPER ──────────────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').substring(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* ─── COUNTER ANIMATION ─────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 2000;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = target.toLocaleString('en-IN');
      }
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
}

/* ─── SERVICE CATEGORY FILTER ───────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.service-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ─── SYMPTOM CHECKER ───────────────────────────────────────── */
const symptoms = {
  'check-engine': {
    icon: '🔴',
    title: 'Check Engine Light On',
    causes: 'Possible causes: Loose/faulty O2 sensor, catalytic converter failure, mass airflow sensor issue, spark plug/coil fault, loose fuel cap, EVAP system leak, or engine misfires.',
    action: 'Action: Do NOT ignore this. Schedule a free OBD-II scan immediately. If the light is flashing (not steady), pull over safely — this indicates a severe misfire that can damage the catalytic converter.'
  },
  'vibration': {
    icon: '🌀',
    title: 'Vibration While Driving',
    causes: 'Possible causes: Unbalanced or worn tyres, bent wheel rim, faulty CV joint, worn engine/transmission mounts, brake rotor warping, or suspension component wear.',
    action: 'Action: Have wheels balanced and inspected. If vibration occurs under braking, your brake rotors need checking urgently.'
  },
  'overheating': {
    icon: '🌡️',
    title: 'Engine Overheating',
    causes: 'Possible causes: Low coolant level, leaking radiator or hose, faulty thermostat, broken water pump, blocked radiator, or blown head gasket.',
    action: 'URGENT: Pull over immediately and switch off the engine. Do NOT open the radiator cap when hot. Driving an overheating engine can cause catastrophic, irreparable damage.'
  },
  'hard-start': {
    icon: '🔑',
    title: 'Hard to Start / Won\'t Start',
    causes: 'Possible causes: Weak or dead battery, faulty alternator not charging battery, bad starter motor, fuel delivery issue (fuel pump/filter), spark plug failure, or ECU fault.',
    action: 'Action: Try jump-starting first. If the car starts with a jump but dies again within 30 mins, the alternator is likely failing. Book a battery and charging system test.'
  },
  'smoke': {
    icon: '☁️',
    title: 'White or Blue Smoke from Exhaust',
    causes: 'White smoke: Coolant burning (head gasket crack). Blue smoke: Engine oil burning (worn piston rings, valve seals). Grey smoke: Excess fuel burning.',
    action: 'Action: White smoke is serious — a blown head gasket can seize your engine if ignored. Blue smoke indicates internal oil burning. Book an engine diagnostic immediately.'
  },
  'brake-noise': {
    icon: '🛑',
    title: 'Brake Squealing or Grinding',
    causes: 'Squealing: Brake pad wear indicators touching rotor — pads nearly finished. Grinding: Metal-on-metal contact — pads completely worn, damaging the rotor.',
    action: 'Action: Grinding brakes are a safety emergency. Do not drive the vehicle until inspected. Even squeal should be addressed within 1–2 weeks.'
  },
  'poor-mileage': {
    icon: '⛽',
    title: 'Poor Fuel Economy',
    causes: 'Possible causes: Dirty air filter, faulty O2 or MAF sensor, clogged fuel injectors, under-inflated tyres, spark plug misfire, or stuck brake caliper dragging.',
    action: 'Action: Start with an air filter check and tyre pressure check. If those do not help, book a fuel system diagnostic.'
  },
  'ac-warm': {
    icon: '❄️',
    title: 'AC Blowing Warm Air',
    causes: 'Possible causes: Low/depleted refrigerant (leak), faulty AC compressor, blocked condenser, failed expansion valve, clogged cabin air filter, or electrical fault in AC system.',
    action: 'Action: First check and replace the cabin air filter (DIY). If still warm, the system needs refrigerant testing. We do a free AC pressure test to check refrigerant level.'
  },
  'oil-leak': {
    icon: '🔩',
    title: 'Oil Leak Under Car',
    causes: 'Possible causes: Worn valve cover gasket, degraded oil pan gasket, leaking oil filter, crankshaft/camshaft seal failure, or loose drain plug.',
    action: 'Action: Check the oil level immediately with the dipstick. Running low on oil can destroy the engine. If you see dark, oily puddles under the car, book an inspection today.'
  },
  'steering': {
    icon: '🚗',
    title: 'Steering Pulling to One Side',
    causes: 'Possible causes: Wheels out of alignment, uneven tyre wear or pressure difference, stuck brake caliper, worn tie rod or ball joint, or steering rack leak.',
    action: 'Action: Check tyre pressures first. A 3D wheel alignment check (from Rs. 799 at AutoElite) often fixes this. If it pulls under braking, a stuck caliper needs urgent attention.'
  }
};

function showSymptom(id) {
  const data = symptoms[id];
  if (!data) return;

  document.querySelectorAll('.symptom-btn').forEach(b => b.classList.remove('selected'));
  if (event && event.target) event.target.classList.add('selected');

  const result = document.getElementById('symptom-result');
  document.getElementById('symptom-icon').textContent = data.icon;
  document.getElementById('symptom-title').textContent = data.title;
  document.getElementById('symptom-causes').textContent = data.causes;
  document.getElementById('symptom-action').textContent = data.action;
  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ─── BOOKING & PAYMENT LOGIC ───────────────────────────────── */
const bookingForm = document.getElementById('booking-form');

// Load prices from Admin settings or use defaults
const defaultServicePrices = {
  'Engine Repair & Rebuild': 5000,
  'Oil & Fluid Service': 800,
  'Electrical & ECU Repair': 2000,
  'Battery Service': 1500,
  'AC Service & Repair': 1200,
  'Denting & Painting': 3500,
  'Tyre & Wheel Service': 400,
  'Brake System Service': 1800,
  'Scheduled Servicing': 2500,
  'Car Detailing & Wash': 1500,
  'Free Diagnostic Scan': 0,
  'Other (describe below)': 500
};

const PICKUP_CHARGE = 250;

const getServicePrices = () => {
  return JSON.parse(localStorage.getItem('aeServicePrices') || JSON.stringify(defaultServicePrices));
};

// Update Price on Service Change
const serviceSelect = document.getElementById('booking-service');
if (serviceSelect) {
  serviceSelect.addEventListener('change', () => {
    const prices = getServicePrices();
    const priceDisplay = document.getElementById('booking-price-display');
    const priceAmount = document.getElementById('booking-price-amount');
  });
}

// Global Init
document.addEventListener('DOMContentLoaded', () => {
  initServiceGrid();
  initBooking();
  if (typeof checkAutoTrack === 'function') checkAutoTrack();
});

/* ─── BOOKING FLOW ────────────────────────────────────────── */
let selectedServices = [];

function initServiceGrid() {
  const container = document.getElementById('service-selection-grid');
  if (!container) return;

  const prices = getServicePrices();
  container.innerHTML = Object.keys(prices).map(name => `
    <div class="service-card" data-name="${name}" data-price="${prices[name]}">
      <div class="svc-icon">🛠️</div>
      <div class="svc-name">${name}</div>
      <div class="svc-price">₹${prices[name].toLocaleString('en-IN')}</div>
    </div>
  `).join('');

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('selected');
      updateSelectedServices();
    });
  });
}

function updateSelectedServices() {
  selectedServices = [];
  let total = 0;
  document.querySelectorAll('.service-card.selected').forEach(card => {
    selectedServices.push(card.getAttribute('data-name'));
    total += parseInt(card.getAttribute('data-price'));
  });

  const priceDisplay = document.getElementById('booking-price-display');
  const priceAmount = document.getElementById('booking-price-amount');
  const inputData = document.getElementById('selected-services-data');

  if (selectedServices.length > 0) {
    priceDisplay.classList.remove('hidden');
    priceAmount.textContent = `₹${total.toLocaleString('en-IN')}`;
    inputData.value = selectedServices.join(', ');
  } else {
    priceDisplay.classList.add('hidden');
    inputData.value = "";
  }
}

function initBooking() {
  const bookingForm = document.getElementById('booking-form');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      showToast('Please select at least one service.', 'error');
      return;
    }

    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;
    const vehicle = document.getElementById('booking-vehicle').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;

    const btn = document.getElementById('booking-submit');
    const btnText = btn.querySelector('span');
    const loader = btn.querySelector('.btn-loader');

    btnText.textContent = 'Processing...';
    loader.classList.remove('hidden');
    btn.disabled = true;

    await delay(1500);

    const ref = 'AE' + Date.now().toString().slice(-7);
    const prices = getServicePrices();
    
    // Calculate total for multiple services
    let serviceTotal = 0;
    selectedServices.forEach(svc => {
        serviceTotal += (prices[svc] || 0);
    });

    const hasPickup = document.getElementById('pickup-drop').checked;
    const pickupFee = hasPickup ? PICKUP_CHARGE : 0;
    
    const totalPrice = serviceTotal + pickupFee;
    const advancePrice = Math.round(totalPrice * 0.3); // 30% Advance

    pendingBooking = { 
      ref, name, phone, vehicle, 
      service: selectedServices.join(', '), 
      date, time, 
      totalPrice,
      advancePaid: advancePrice,
      hasPickup,
      paid: false,
      timestamp: new Date().toISOString()
    };

    // Note: Data is NOT saved to localStorage here anymore.
    // It will only be saved in completePayment() after money is 'processed'.

    // Show Payment Modal with Advance Calculation
    document.getElementById('pay-ref').textContent = ref;
    
    const summaryHtml = `
      <div class="pay-row"><span>Services:</span> <strong>${selectedServices.length} Selected</strong></div>
      <div class="pay-row" style="font-size:0.75rem; color:var(--grey-2); margin-bottom:0.5rem">
        ${selectedServices.join(' + ')}
      </div>
      <div class="pay-row"><span>Services Total:</span> <span>₹${serviceTotal.toLocaleString('en-IN')}</span></div>
      ${hasPickup ? `<div class="pay-row"><span>Pickup & Drop:</span> <span>₹${PICKUP_CHARGE}</span></div>` : ''}
      <div class="pay-row" style="border-top:1px solid var(--dark-border); padding-top:0.5rem; margin-top:0.5rem">
        <span>Total Estimate:</span> <strong>₹${totalPrice.toLocaleString('en-IN')}</strong>
      </div>
      <div class="pay-row" style="color:var(--orange); font-size:1.1rem; margin-top:0.5rem; background:rgba(255,107,0,0.1); padding:0.5rem; border-radius:8px">
        <span>Pay 30% Advance Now:</span> <strong>₹${advancePrice.toLocaleString('en-IN')}</strong>
      </div>
    `;
    const summaryEl = document.querySelector('.pay-summary');
    if (summaryEl) summaryEl.innerHTML = summaryHtml;
    document.getElementById('payment-modal').classList.remove('hidden');
    
    btnText.textContent = 'Confirm Booking & Proceed';
    loader.classList.add('hidden');
    btn.disabled = false;
  });
}

async function completePayment() {
  const payBtn = document.querySelector('.payment-modal .btn-primary');
  payBtn.textContent = 'Processing Payment...';
  payBtn.disabled = true;

  await delay(2000);

  // Save Final Booking to Database ONLY NOW
  const allBookings = JSON.parse(localStorage.getItem('aeBookings') || '[]');
  const finalBooking = { 
    ...pendingBooking, 
    paid: true, 
    paymentId: 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase() 
  };
  allBookings.push(finalBooking);
  localStorage.setItem('aeBookings', JSON.stringify(allBookings));

  // Update local success UI
  document.getElementById('payment-modal').classList.add('hidden');
  document.getElementById('booking-form').classList.add('hidden');
  document.getElementById('booking-price-display').classList.add('hidden');
  document.getElementById('booking-success').classList.remove('hidden');
  document.getElementById('booking-ref-num').textContent = finalBooking.ref;
  document.getElementById('payment-id').textContent = finalBooking.paymentId;
  
  // Clear the form for next time
  document.getElementById('booking-form').reset();

  // Create WhatsApp message with Live Tracking Link
  const trackingUrl = `${window.location.origin}${window.location.pathname}#tracking?ref=${finalBooking.ref}`;
  const waMsg = `Hello AutoElite! 🚗\n\nI just booked a service for my *${finalBooking.vehicle}*.\n\n📍 *Booking Ref:* ${finalBooking.ref}\n🔗 *Live Tracking:* ${trackingUrl}\n\nPlease confirm my appointment!`;
  const waUrl = `https://wa.me/919510516503?text=${encodeURIComponent(waMsg)}`;
  
  // Show advance paid in success message + WA link
  const successP = document.querySelector('#booking-success p');
  if (successP) {
    successP.innerHTML = `
      Your appointment is scheduled. <strong>₹${finalBooking.advancePaid.toLocaleString('en-IN')} advance paid</strong> successfully.<br>
      <a href="${waUrl}" target="_blank" class="wa-btn" style="display:inline-block; margin-top:1rem; background:#25D366; color:white; padding:0.5rem 1rem; border-radius:30px; text-decoration:none; font-weight:bold;">
        💬 Track on WhatsApp
      </a>
    `;
  }

  showToast('Advance Payment Successful!', 'success');
}

// Add interactive payment methods
document.querySelectorAll('.pay-method').forEach(method => {
  method.addEventListener('click', function() {
    document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
    this.classList.add('active');
    
    // Toggle card inputs based on selection
    const cardSection = document.querySelector('.card-inputs');
    if (this.textContent.includes('Card')) {
      cardSection.style.display = 'block';
    } else {
      cardSection.style.display = 'none';
      showToast('Redirecting to ' + this.textContent.trim() + ' app on Click...', 'info');
    }
  });
});

/* ─── REPAIR TRACKING ───────────────────────────────────────── */
function demoTrack() {
  document.getElementById('tracking-input').value = 'AE2024001';
  trackRepair();
}

function trackRepair() {
  const val = document.getElementById('tracking-input').value.trim().toUpperCase();
  if (!val) { showToast('Please enter a booking reference or registration number.', 'error'); return; }

  // Load repairs from localStorage
  const allRepairs = JSON.parse(localStorage.getItem('aeRepairs') || '[]');
  const repair = allRepairs.find(r => r.id === val || r.reg === val);

  if (!repair) {
    showToast('No repair record found for this ID/Registration. Please check and try again.', 'error');
    document.getElementById('tracking-result').classList.add('hidden');
    return;
  }

  // Show result section
  document.getElementById('tracking-result').classList.remove('hidden');

  // Update Tracking UI with real data
  document.getElementById('track-vehicle-name').textContent = repair.vehicle;
  document.getElementById('track-reg').textContent = repair.reg;
  document.getElementById('track-status-badge').textContent = repair.status.charAt(0).toUpperCase() + repair.status.slice(1);
  
  // Status mapping
  const statuses = ['received', 'inspection', 'work', 'qc', 'ready'];
  const currentIndex = statuses.indexOf(repair.status);
  
  // Update steps
  const steps = ['step-received', 'step-inspection', 'step-work', 'step-qc', 'step-ready'];
  steps.forEach((id, index) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active', 'completed');
    if (index < currentIndex) el.classList.add('completed');
    else if (index === currentIndex) el.classList.add('active');
  });

  // Update description and progress
  const workStep = document.getElementById('step-work');
  if (workStep) {
    const descEl = workStep.querySelector('.track-step-desc');
    const barFill = workStep.querySelector('.progress-bar-fill');
    const barText = workStep.querySelector('.progress-bar-wrap span');
    
    if (descEl) descEl.innerHTML = `Current Job: <strong>${repair.desc}</strong>`;
    if (barFill) barFill.style.width = repair.progress + '%';
    if (barText) barText.textContent = repair.progress + '% Complete';
  }

  // Update Invoice
  const totalRow = document.querySelector('.total-row strong:last-child');
  if (totalRow) totalRow.textContent = '₹' + repair.price.toLocaleString('en-IN');

  const result = document.getElementById('tracking-result');
  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  setTimeout(() => {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => el.classList.add('in-view'));
  }, 100);
}

/* ─── PARTS SHOP ────────────────────────────────────────────── */
const partsData = [
  { id: 1, category: 'engine', icon: '⚙️', brand: 'Bosch', name: 'Engine Oil Filter', compat: 'Universal – Honda / Toyota / Maruti', price: 380 },
  { id: 2, category: 'engine', icon: '🔩', brand: 'Gates', name: 'Timing Belt Kit', compat: 'Honda City, Jazz, Amaze 1.5L', price: 3200 },
  { id: 3, category: 'engine', icon: '🔥', brand: 'NGK', name: 'Iridium Spark Plugs (Set of 4)', compat: 'Most 1.0L – 2.0L Petrol Engines', price: 1800 },
  { id: 4, category: 'engine', icon: '💧', brand: 'Castrol', name: 'Edge 5W-40 Synthetic Oil (4L)', compat: 'Universal Petrol/Diesel', price: 2600 },
  { id: 5, category: 'brakes', icon: '🛑', brand: 'Brembo', name: 'Front Brake Pad Set', compat: 'Hyundai i20, i10, Verna', price: 2400 },
  { id: 6, category: 'brakes', icon: '🔴', brand: 'TVS', name: 'Brake Disc (Front) Pair', compat: 'Maruti Swift, Dzire, Baleno', price: 3800 },
  { id: 7, category: 'brakes', icon: '🟠', brand: 'Motul', name: 'Brake Fluid DOT 4 (500ml)', compat: 'Universal', price: 450 },
  { id: 8, category: 'electrical', icon: '🔋', brand: 'Amaron', name: 'Car Battery 45Ah / MF', compat: 'Maruti, Hyundai, Tata – Small Cars', price: 4800 },
  { id: 9, category: 'electrical', icon: '💡', brand: 'Osram', name: 'LED Headlight Bulb H4 (Pair)', compat: 'Universal H4 Fitment', price: 1200 },
  { id: 10, category: 'electrical', icon: '⚡', brand: 'Bosch', name: 'Starter Motor', compat: 'Maruti 1.0/1.2L Engines', price: 5500 },
  { id: 11, category: 'filters', icon: '🌬️', brand: 'K&N', name: 'High-Flow Air Filter', compat: 'Honda City 2014–2023', price: 1400 },
  { id: 12, category: 'filters', icon: '🍃', brand: 'Bosch', name: 'Cabin Air Filter (Pollen)', compat: 'Hyundai Creta / i20 / Venue', price: 680 },
  { id: 13, category: 'filters', icon: '⛽', brand: 'WIX', name: 'Fuel Filter (Inline)', compat: 'Universal Petrol – 8mm', price: 520 },
  { id: 14, category: 'fluids', icon: '🟢', brand: 'Castrol', name: 'ATF Transmax Z (1L)', compat: 'Universal Automatic Transmission', price: 850 },
  { id: 15, category: 'fluids', icon: '🔵', brand: 'Prestone', name: 'Coolant / Antifreeze (1L)', compat: 'Universal', price: 420 },
  { id: 16, category: 'fluids', icon: '🫧', brand: 'Liqui Moly', name: 'Power Steering Fluid (500ml)', compat: 'Universal Hydraulic Power Steering', price: 680 },
  { id: 17, category: 'suspension', icon: '🔧', brand: 'Monroe', name: 'Front Shock Absorber (Each)', compat: 'Maruti Swift, Dzire', price: 2800 },
  { id: 18, category: 'suspension', icon: '🟡', brand: 'Moog', name: 'Ball Joint (Front Lower)', compat: 'Honda City, Amaze 2nd Gen', price: 1650 },
  { id: 19, category: 'suspension', icon: '⭕', brand: 'SKF', name: 'Wheel Bearing (Front)', compat: 'Hyundai i20, Elite i20', price: 1900 },
  { id: 20, category: 'engine', icon: '🌊', brand: 'Aisin', name: 'Water Pump Assembly', compat: 'Toyota Innova / Fortuner 2.7L', price: 4200 }
];

let cart = JSON.parse(localStorage.getItem('aeCart') || '[]');

function renderShop(items) {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;
  if (items.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--grey-3);padding:3rem">No parts found matching your search.</div>';
    return;
  }
  grid.innerHTML = items.map(item => `
    <div class="shop-item" data-category="${item.category}" data-id="${item.id}">
      <div class="shop-item-img">${item.icon}</div>
      <div class="shop-item-body">
        <div class="shop-item-brand">${item.brand}</div>
        <div class="shop-item-name">${item.name}</div>
        <div class="shop-item-compat">Fits: ${item.compat}</div>
        <div class="shop-item-footer">
          <div class="shop-item-price">Rs. ${item.price.toLocaleString('en-IN')}</div>
          <button class="add-to-cart-btn" onclick="addToCart(${item.id})">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

let currentCategory = 'all';
let searchQuery = '';

function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyShopFilter();
}

function filterParts() {
  searchQuery = document.getElementById('shop-search').value.toLowerCase();
  applyShopFilter();
}

function applyShopFilter() {
  const filtered = partsData.filter(p => {
    const matchCat = currentCategory === 'all' || p.category === currentCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery) || p.compat.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });
  renderShop(filtered);
}

function addToCart(id) {
  const item = partsData.find(p => p.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(item.name + ' added to cart!', 'success');
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('aeCart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total-price');

  const total = cart.reduce((sum, c) => sum + c.price * (c.qty || 1), 0);
  const count = cart.reduce((sum, c) => sum + (c.qty || 1), 0);

  if (cartCount) cartCount.textContent = count;

  if (cartItems) {
    cartItems.innerHTML = cart.length === 0
      ? '<div style="text-align:center;color:var(--grey-3);padding:2rem">Your cart is empty</div>'
      : cart.map(c => `
          <div class="cart-item">
            <div class="cart-item-icon">${c.icon}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${c.name} ${c.qty > 1 ? '(x' + c.qty + ')' : ''}</div>
              <div class="cart-item-price">Rs. ${(c.price * c.qty).toLocaleString('en-IN')}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${c.id})">X</button>
          </div>
        `).join('');
  }

  if (cartTotal) cartTotal.textContent = 'Rs. ' + total.toLocaleString('en-IN');
}

function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

/* ─── SETTINGS SYNC (Dynamic Site Info) ───────────────────────── */
function syncSettings() {
  const settings = JSON.parse(localStorage.getItem('aeSettings'));
  if (!settings) return;

  // Update navbar phone
  const navPhone = document.querySelector('.nav-phone');
  if (navPhone) navPhone.textContent = '📞 ' + settings.phone;
  if (navPhone) navPhone.href = 'tel:' + settings.phone.replace(/\s/g, '');

  // Update footer info
  const footerPhone = document.querySelector('.footer-links-col a[href^="tel:"]');
  if (footerPhone) {
    footerPhone.textContent = settings.phone;
    footerPhone.href = 'tel:' + settings.phone.replace(/\s/g, '');
  }

  const footerAddress = document.querySelector('.footer-links-col p[style*="#aaa"]');
  if (footerAddress) footerAddress.textContent = settings.address;

  // Update working hours in booking section
  const hoursTable = document.querySelector('.hours-table');
  if (hoursTable) {
    const rows = hoursTable.querySelectorAll('tr');
    if (rows[0] && rows[0].cells[1]) rows[0].cells[1].innerHTML = `<strong>${settings.hoursWeek}</strong>`;
    if (rows[1] && rows[1].cells[1]) rows[1].cells[1].innerHTML = `<strong>${settings.hoursSat}</strong>`;
  }
}

// Initial sync
syncSettings();

/* ─── FEATURE 9: PARTS SHOP CHECKOUT FLOW ──────────────────── */
function checkoutCart() {
  if (cart.length === 0) { showToast('Your cart is empty!', 'error'); return; }
  document.getElementById('cart-sidebar').classList.remove('open');
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;
  // Populate order summary
  const total = cart.reduce((sum, c) => sum + c.price * (c.qty || 1), 0);
  document.getElementById('checkout-items-list').innerHTML = cart.map(c =>
    `<div class="co-item"><span>${c.name} ${c.qty > 1 ? 'x' + c.qty : ''}</span><span>₹${(c.price * c.qty).toLocaleString('en-IN')}</span></div>`
  ).join('');
  document.getElementById('checkout-total-amt').textContent = '₹' + total.toLocaleString('en-IN');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function placeOrder() {
  const name = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const address = document.getElementById('co-address').value.trim();
  const pincode = document.getElementById('co-pincode').value.trim();
  if (!name || !phone || !address || !pincode) {
    showToast('Please fill in all delivery details.', 'error'); return;
  }
  const orderId = 'ORD-' + Date.now().toString().slice(-8);
  const total = cart.reduce((sum, c) => sum + c.price * (c.qty || 1), 0);
  const order = {
    orderId, name, phone, address, pincode,
    items: [...cart], total,
    payment: document.getElementById('co-payment').value,
    timestamp: new Date().toISOString()
  };
  const orders = JSON.parse(localStorage.getItem('aeOrders') || '[]');
  orders.push(order);
  localStorage.setItem('aeOrders', JSON.stringify(orders));

  // Clear cart
  cart = []; saveCart(); updateCartUI();

  // Show confirmation
  document.getElementById('checkout-form-wrap').classList.add('hidden');
  document.getElementById('checkout-success').classList.remove('hidden');
  document.getElementById('order-id-display').textContent = orderId;
  showToast('Order placed successfully! 🎉', 'success');
}

// Init repairs with demo data if empty
if (!localStorage.getItem('aeRepairs')) {
  localStorage.setItem('aeRepairs', JSON.stringify([{
    id: 'AE2024001',
    reg: 'MH 01 AB 2024',
    vehicle: 'Honda City 2022',
    owner: 'Rohan Gupta',
    status: 'work',
    progress: 75,
    desc: 'Engine oil change, air filter replacement, brake pad inspection.',
    price: 4950,
    updated: new Date().toISOString()
  }]));
}

// Init shop
applyShopFilter();
updateCartUI();

/* ─── GALLERY ───────────────────────────────────────────────── */
const galleryItems = [
  { category: 'workshop', icon: '🔧', label: 'Main Workshop Bay', bg: '#1A1A2A' },
  { category: 'workshop', icon: '🖥️', label: 'Diagnostic Station', bg: '#12121A' },
  { category: 'workshop', icon: '🏗️', label: 'Hydraulic Lift Bay', bg: '#0F1428' },
  { category: 'cars', icon: '🏎️', label: 'BMW M3 – Full Service', bg: '#1A0A0A' },
  { category: 'cars', icon: '🚗', label: 'Honda City – Restored', bg: '#0A1A10' },
  { category: 'cars', icon: '🚙', label: 'Mahindra XUV700 – PPF', bg: '#1A1206' },
  { category: 'before-after', icon: '✨', label: 'Dent Removal – Hood', bg: '#0A0A1A' },
  { category: 'before-after', icon: '🎨', label: 'Full Repaint – Silver to Black', bg: '#0F0F18' },
  { category: 'workshop', icon: '🔩', label: 'Wheel Alignment Center', bg: '#101020' },
  { category: 'cars', icon: '⚡', label: 'Tata Nexon EV – Battery Check', bg: '#0A1510' },
  { category: 'before-after', icon: '🔄', label: 'Rust Repair – Before/After', bg: '#18100A' },
  { category: 'workshop', icon: '🏆', label: 'Awards and Certifications Wall', bg: '#14140A' },
];

let currentGalleryFilter = 'all';
let currentLightboxItems = [];

function switchGallery(cat, btn) {
  currentGalleryFilter = cat;
  document.querySelectorAll('.gallery-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderGallery();
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  currentLightboxItems = galleryItems.filter(g => currentGalleryFilter === 'all' || g.category === currentGalleryFilter);
  grid.innerHTML = currentLightboxItems.map((g, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})" style="background:${g.bg}">
      <div class="gallery-item-bg" style="background:${g.bg}">${g.icon}</div>
      <div class="gallery-caption">${g.label}</div>
    </div>
  `).join('');
}

function openLightbox(index) {
  const item = currentLightboxItems[index];
  if (!item) return;
  document.getElementById('lightbox-content').textContent = item.icon;
  document.getElementById('lightbox-caption').textContent = item.label;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

renderGallery();

/* ─── TESTIMONIALS SLIDER ───────────────────────────────────── */
const testimonials = [
  { name: 'Arjun Mehra', initials: 'AM', car: 'BMW 3 Series', service: 'Engine Oil and Full Service', rating: 5, text: 'AutoElite completely transformed my experience of car servicing. The team found an issue with my turbocharger my BMW dealer had missed for 2 years. Fixed in 4 hours, at a fraction of dealer cost. These guys are phenomenal.' },
  { name: 'Kavita Rao', initials: 'KR', car: 'Hyundai Creta', service: 'AC Repair and Gas Refill', rating: 5, text: 'My Creta AC was blowing warm air in the peak of summer. AutoElite diagnosed a refrigerant leak, fixed the seal, recharged the gas, and had me ice-cold same day. Excellent work at a fair price.' },
  { name: 'Rohan Gupta', initials: 'RG', car: 'Maruti Brezza', service: 'Brake Pad Replacement + Alignment', rating: 5, text: 'I was getting a scary grinding noise from my brakes. Booked online at midnight, they called me at 9 AM, picked up my car, fixed everything and dropped it back cleaner than when it left. The real-time tracking is a game changer.' },
  { name: 'Sunita Patel', initials: 'SP', car: 'Tata Nexon', service: 'Electrical and ECU Diagnostics', rating: 5, text: 'My Nexon had a mysterious flat battery issue every 2 weeks. Dealers kept replacing the battery without fixing the cause. AutoElite traced it to a faulty infotainment module drawing current overnight. Permanently solved!' },
  { name: 'Vikram Singh', initials: 'VS', car: 'Honda City', service: 'Car Detailing – Ceramic Coating', rating: 5, text: 'Got a 9H ceramic coating done on my new City. The team spent 2 full days on paint correction before applying the coating. The car literally looks like a mirror. 6 months later, water still beads off perfectly.' },
  { name: 'Deepika Nair', initials: 'DN', car: 'Mercedes C-Class', service: 'Full Annual Service', rating: 5, text: 'As a Mercedes owner I was nervous trusting an independent garage, but AutoElite completely won me over. They have the same diagnostic software as the dealer, use only OEM parts, and charge 30% less. My C-class is in perfect health.' },
];

let currentSlide = 0;

function renderTestimonials() {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('slider-dots');
  if (!track) return;

  track.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testi-stars">${'★'.repeat(t.rating)}</div>
      <div class="testi-text">"${t.text}"</div>
      <div class="testi-author">
        <div class="testi-avatar">${t.initials}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-details">${t.car}</div>
          <div class="testi-service">Service: ${t.service}</div>
        </div>
      </div>
    </div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = testimonials.map((_, i) =>
      '<div class="dot ' + (i === 0 ? 'active' : '') + '" onclick="goToSlide(' + i + ')"></div>'
    ).join('');
  }
}

function slideTestimonials(direction) {
  currentSlide = (currentSlide + direction + testimonials.length) % testimonials.length;
  goToSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  const track = document.getElementById('testimonials-track');
  if (!track) return;
  const cardWidth = track.querySelector('.testimonial-card') ? track.querySelector('.testimonial-card').offsetWidth : 400;
  track.style.transform = 'translateX(-' + (index * (cardWidth + 24)) + 'px)';
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === index));
}

renderTestimonials();

// Auto-slide testimonials
let autoSlide = setInterval(() => slideTestimonials(1), 5000);
const tesSld = document.getElementById('testimonials-slider');
if (tesSld) {
  tesSld.addEventListener('mouseenter', () => clearInterval(autoSlide));
  tesSld.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => slideTestimonials(1), 5000);
  });
}

/* ─── FAQ ACCORDION ─────────────────────────────────────────── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ─── BLOG MODAL ────────────────────────────────────────────── */
const blogPosts = {
  'oil-signs': {
    title: '10 Signs Your Engine Oil Needs Changing Right Now',
    content: '<p>Engine oil is the lifeblood of your engine. When degraded or depleted — your engine pays the price. Here are 10 warning signs to never ignore:</p><h3>1. Dark, Black Oil on the Dipstick</h3><p>Fresh oil is amber/honey coloured. If your dipstick shows black, gritty oil, it needs changing immediately.</p><h3>2. Ticking or Knocking Engine Sounds</h3><p>Oil provides a protective film between metal components. When it breaks down, metal-on-metal contact creates ticking or knocking sounds.</p><h3>3. Low Oil Level Repeatedly</h3><p>If you frequently top up oil between changes, you have a consumption or leak problem that needs investigation.</p><h3>4. Oil Pressure Warning Light</h3><p>If the oil pressure light illuminates, pull over immediately and switch off the engine. Running with low oil pressure even briefly can permanently damage the engine.</p><h3>5. Smoky Exhaust</h3><p>Blue-tinted exhaust smoke means oil is burning in the combustion chamber — a sign of worn piston rings or valve seals.</p><h3>6. Burning Oil Smell in Cabin</h3><p>If you smell burning oil while driving, oil may be leaking onto hot engine components. This is also a fire risk.</p><h3>7. Overheating Engine</h3><p>Old oil loses viscosity and its ability to carry heat away from engine components, contributing to overheating.</p><h3>8. Rough Idle or Poor Performance</h3><p>Degraded oil causes friction, making the engine work harder. You will notice reduced smoothness and power.</p><h3>9. Over 10,000 km or 6 Months Since Last Change</h3><p>Even without symptoms, follow the manufacturer service interval. Most modern cars use 10,000 km or 6 months for synthetic oil.</p><h3>10. Milky or Foamy Oil</h3><p>Milky-looking oil means coolant has mixed with it — usually from a blown head gasket. This is a serious engine emergency requiring immediate attention.</p>'
  },
  'tyre-pressure': {
    title: 'Tyre Pressure 101: Why It Matters More Than You Think',
    content: '<p>Tyre pressure is one of the most overlooked maintenance items — yet it affects safety, fuel economy, tyre life, and handling simultaneously.</p><h3>Effects of Under-Inflation</h3><p>Running tyres even 6 PSI below recommended causes 3% worse fuel economy, increased tyre wear on the edges, poor braking distance, increased risk of blowout at highway speeds, and dangerous heat buildup.</p><h3>Effects of Over-Inflation</h3><p>Over-inflation causes accelerated centre tread wear, reduced traction especially on wet roads, and increased risk of tyre damage from road debris.</p><h3>Finding the Correct Pressure</h3><p>Check the sticker inside your driver door jamb or your owner manual. Never use the number on the tyre itself — that is the maximum pressure, not the recommended.</p><h3>How Often to Check</h3><p>Check monthly and before any long journey. Always check when tyres are cold. Tyre pressure drops approximately 1 PSI for every 5°C temperature drop.</p>'
  },
  'battery-winter': {
    title: 'Why Your Car Battery Dies in Winter — and How to Prevent It',
    content: '<p>Cold weather is brutally hard on car batteries. A battery that tested good in September can fail completely when temperatures drop.</p><h3>Why Cold Weather Kills Batteries</h3><p>Lead-acid batteries generate power through chemical reactions that are dramatically slowed by low temperatures — reducing available cranking power by up to 40% at 0°C. Meanwhile, thick cold engine oil requires more power to crank.</p><h3>Warning Signs Before Complete Failure</h3><ul><li>Slow, sluggish cranking when starting</li><li>Dim headlights when the engine is idling</li><li>Battery warning light appearing occasionally</li><li>Battery older than 3 to 4 years</li></ul><h3>Prevention</h3><p>Get a free battery health test before winter. A proper test measures Cold Cranking Amps. If below 70% of rated CCA, replace proactively. Keep battery terminals clean. If parking outdoors in extreme cold, consider a battery blanket heater.</p>'
  },
  'ac-not-cooling': {
    title: 'AC Running But Not Cooling? 7 Common Causes Explained',
    content: '<p>The AC compressor runs and you hear the fan — but the air is just not cold. Here are the 7 most common reasons:</p><h3>1. Low Refrigerant (Most Common)</h3><p>AC systems slowly lose refrigerant through microscopic seal leaks. Low refrigerant means warm air. Requires professional recharge and a leak test.</p><h3>2. Clogged Cabin Air Filter</h3><p>A blocked cabin filter restricts airflow dramatically. Check and replace yours — it is a DIY job costing Rs. 400 to 700.</p><h3>3. Faulty Compressor Clutch</h3><p>The clutch engages and disengages the compressor. A worn clutch may slip, preventing adequate refrigerant compression.</p><h3>4. Condenser Blockage</h3><p>The condenser at the front of the car dissipates heat. Road debris can block it, reducing cooling efficiency dramatically.</p><h3>5. Failed Condenser Fan</h3><p>If you get warm air when stationary but cold air when moving — the condenser fan has likely failed.</p><h3>6. Expansion Valve Issues</h3><p>The expansion valve regulates refrigerant flow. If stuck, refrigerant cannot flow correctly through the system.</p><h3>7. Electrical Faults</h3><p>A blown fuse, faulty pressure switch, or AC relay can prevent the system engaging even when all mechanical parts are fine.</p>'
  },
  'squeaky-brakes': {
    title: 'Squeaky Brakes: When to Ignore It and When to Panic',
    content: '<p>Brake noise is one of the most anxiety-inducing sounds for drivers. Here is how to decode what your brakes are telling you.</p><h3>Morning Squeal — Usually Harmless</h3><p>Light surface rust builds on rotors overnight. The first few stops may squeal as pads clean this rust off. This is normal and not a concern.</p><h3>Consistent Squealing — Act Soon</h3><p>Brake pads have built-in wear indicators — small metal tabs that contact the rotor when pads reach 15 to 20% remaining, creating a deliberate high-pitched squeal. Book a brake inspection within 1 to 2 weeks.</p><h3>Grinding or Metal Scraping — URGENT</h3><p>Grinding means pads are completely worn through and the metal backing plate is grinding against the rotor. This is dangerous and expensive. The grinding will score your rotors, turning a Rs. 1,800 pad job into a Rs. 5,000+ pad and rotor replacement. Stop driving and call us immediately.</p><h3>Squeal Under Hard Braking Only</h3><p>High-performance semi-metallic brake pads can squeal under aggressive braking. This is normal for performance-oriented compounds and not a safety concern.</p>'
  },
  'diy-checks': {
    title: '5 Car Checks You Can Do Yourself Every Month',
    content: '<p>You do not need a mechanic for everything. These 5 checks take under 10 minutes and can prevent major breakdowns.</p><h3>1. Engine Oil Level (2 minutes)</h3><p>With engine cold or after 10 minutes switched off, pull the dipstick, wipe clean, re-insert, pull again. Oil should sit between MIN and MAX marks. Top up if below MIN. Amber colour means healthy oil. Black means it is due for a change.</p><h3>2. Tyre Pressures (5 minutes)</h3><p>Buy a tyre pressure gauge for around Rs. 200. Check all 4 tyres when cold. Compare against the target on the door jamb sticker. Inflate at any petrol station with an air pump.</p><h3>3. All Lights Working (2 minutes)</h3><p>Walk around the car and check headlights, taillights, indicators, brake lights, and reverse lights. A Rs. 50 bulb replacement can prevent a police fine or worse — a collision.</p><h3>4. Windscreen Washer Fluid (1 minute)</h3><p>Open the bonnet, find the washer fluid reservoir with a blue cap. Top up with diluted washer fluid — not plain water, which can freeze and grow bacteria.</p><h3>5. Windscreen Wipers (1 minute)</h3><p>Spray washer fluid and activate wipers. They should clear cleanly without streaking or skipping. Damaged wiper blades dangerously compromise visibility in rain and should be replaced every 12 months.</p>'
  }
};

function openBlogPost(id) {
  const post = blogPosts[id];
  if (!post) return;
  const modal = document.getElementById('blog-modal');
  document.getElementById('blog-modal-content').innerHTML =
    '<h2>' + post.title + '</h2>' +
    post.content +
    '<div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--dark-border)">' +
    '<a href="#booking" class="btn-primary" onclick="closeBlogModal()">Book a Service</a>' +
    '</div>';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

const blogModal = document.getElementById('blog-modal');
if (blogModal) {
  blogModal.addEventListener('click', function(e) {
    if (e.target === this) closeBlogModal();
  });
}

/* ─── CONTACT FORM ──────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    const origText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    await delay(1800);

    const successEl = document.getElementById('contact-success');
    if (successEl) successEl.classList.remove('hidden');
    contactForm.classList.add('hidden');
    showToast('Message sent! We will reply within 2 hours.', 'success');
  });
}

/* ─── TOAST NOTIFICATIONS ───────────────────────────────────── */
function showToast(message, type) {
  type = type || 'success';
  const existing = document.querySelector('.ae-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'ae-toast';
  toast.innerHTML = '<span>' + (type === 'success' ? '✅' : '⚠️') + '</span> ' + message;
  toast.style.cssText = [
    'position:fixed', 'bottom:6rem', 'left:50%',
    'transform:translateX(-50%) translateY(20px)',
    'background:' + (type === 'success' ? 'var(--success)' : 'var(--error)'),
    'color:white', 'padding:1rem 1.75rem', 'border-radius:50px',
    'font-size:0.9rem', 'font-weight:600', 'z-index:9999',
    'display:flex', 'align-items:center', 'gap:0.75rem',
    'box-shadow:0 8px 32px rgba(0,0,0,0.4)',
    'transition:all 0.3s ease', 'opacity:0',
    'max-width:90vw', 'white-space:nowrap'
  ].join(';');
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ─── UTILITY FUNCTIONS ─────────────────────────────────────── */
function delay(ms) { return new Promise(function(resolve) { setTimeout(resolve, ms); }); }
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

/* ─── KEYBOARD NAVIGATION ───────────────────────────────────── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
    closeBlogModal();
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
  }
});

/* ─── TOUCH SWIPE FOR TESTIMONIALS ─────────────────────────── */
(function() {
  const slider = document.getElementById('testimonials-slider');
  if (!slider) return;
  let touchStartX = 0;
  slider.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  slider.addEventListener('touchend', function(e) {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) slideTestimonials(diff > 0 ? 1 : -1);
  });
})();

console.log('%cAutoElite Garage', 'color:#FF6B00;font-size:1.5rem;font-weight:bold');
console.log('%cPremium Automotive Care', 'color:#888');

/* ─── SERVICE COST ESTIMATOR ────────────────────────────────── */
const estimatorPrices = {
  // [parts, labour] in INR base
  oil:     { hatch: [800, 300],  sedan: [1200, 350],  suv: [1800, 400],  luxury: [4200, 600]  },
  full:    { hatch: [2200, 800], sedan: [3000, 1000], suv: [4500, 1200], luxury: [9000, 2000] },
  brakes:  { hatch: [1200, 600], sedan: [1800, 700],  suv: [2400, 800],  luxury: [6000, 1200] },
  ac:      { hatch: [900, 400],  sedan: [1100, 450],  suv: [1400, 500],  luxury: [2800, 800]  },
  tyres:   { hatch: [800, 400],  sedan: [1200, 500],  suv: [1600, 600],  luxury: [3000, 800]  },
  align:   { hatch: [0, 699],    sedan: [0, 799],     suv: [0, 999],     luxury: [0, 1499]    },
  battery: { hatch: [3500, 400], sedan: [4200, 450],  suv: [5500, 500],  luxury: [9500, 600]  },
  diag:    { hatch: [0, 599],    sedan: [0, 699],     suv: [0, 799],     luxury: [0, 1299]    },
  detail:  { hatch: [800, 1200], sedan: [1000, 1500], suv: [1200, 2000], luxury: [2000, 3500] },
  ceramic: { hatch: [3000, 4000],sedan: [4000, 5000], suv: [5500, 7000], luxury: [10000,12000]}
};

function calcEstimate() {
  const vType = document.getElementById('est-type');
  const sType = document.getElementById('est-service');
  const pickup  = document.getElementById('addon-pickup');
  const express = document.getElementById('addon-express');
  const wash    = document.getElementById('addon-wash');

  if (!vType || !sType) return;

  const v = vType.value;
  const s = sType.value;
  const base = estimatorPrices[s] && estimatorPrices[s][v] ? estimatorPrices[s][v] : [0, 0];

  let parts  = base[0];
  let labour = base[1];

  if (pickup  && pickup.checked)  labour += 200;
  if (express && express.checked) labour += 500;
  if (wash    && wash.checked)    parts  += 299;

  const gst   = Math.round((parts + labour) * 0.18);
  const total  = parts + labour + gst;
  const low    = Math.round(total * 0.9);
  const high   = Math.round(total * 1.15);

  const fmt = n => '\u20b9' + n.toLocaleString('en-IN');

  const amountEl  = document.getElementById('estimate-amount');
  const partsEl   = document.getElementById('est-parts');
  const labourEl  = document.getElementById('est-labour');
  const totalEl   = document.getElementById('est-total');

  if (amountEl) {
    amountEl.style.opacity = '0.4';
    amountEl.style.transform = 'translateY(-6px)';
    setTimeout(function() {
      amountEl.textContent = fmt(low) + ' \u2013 ' + fmt(high);
      if (partsEl)  partsEl.textContent  = fmt(parts);
      if (labourEl) labourEl.textContent = fmt(labour) + ' + ' + fmt(gst) + ' GST';
      if (totalEl)  totalEl.textContent  = fmt(total);
      amountEl.style.opacity = '1';
      amountEl.style.transform = 'translateY(0)';
    }, 180);
  }
}

// Init estimator on page load
(function() {
  const et = document.getElementById('est-type');
  if (et) calcEstimate();
})();

/* ─── FEATURE 4: LEAVE A REVIEW / STAR RATING ────────────────── */
let selectedRating = 0;

function setRating(star) {
  selectedRating = star;
  document.querySelectorAll('.star-btn').forEach((s, i) => {
    s.classList.toggle('active', i < star);
  });
}

function submitReview() {
  const name = document.getElementById('review-name').value.trim();
  const car  = document.getElementById('review-car').value.trim();
  const text = document.getElementById('review-text').value.trim();
  if (!name || !text || selectedRating === 0) {
    showToast('Please fill name, rating and comment.', 'error'); return;
  }
  const review = {
    name, car, text, rating: selectedRating,
    initials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
    timestamp: Date.now()
  };
  const reviews = JSON.parse(localStorage.getItem('aeReviews') || '[]');
  reviews.unshift(review);
  localStorage.setItem('aeReviews', JSON.stringify(reviews));

  // Reset form
  document.getElementById('review-name').value = '';
  document.getElementById('review-car').value = '';
  document.getElementById('review-text').value = '';
  selectedRating = 0;
  document.querySelectorAll('.star-btn').forEach(s => s.classList.remove('active'));

  renderUserReviews();
  showToast('Thank you for your review! ⭐', 'success');
}

function renderUserReviews() {
  const container = document.getElementById('user-reviews-list');
  if (!container) return;
  const reviews = JSON.parse(localStorage.getItem('aeReviews') || '[]');
  if (reviews.length === 0) {
    container.innerHTML = '<p style="color:var(--grey-3);text-align:center;padding:2rem">No reviews yet — be the first! 🌟</p>';
    return;
  }
  container.innerHTML = reviews.slice(0, 9).map(r => `
    <div class="user-review-card">
      <div class="ur-header">
        <div class="ur-avatar">${r.initials}</div>
        <div>
          <div class="ur-name">${r.name}</div>
          <div class="ur-car">${r.car || 'AutoElite Customer'}</div>
        </div>
        <div class="ur-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      </div>
      <p class="ur-text">"${r.text}"</p>
      <div class="ur-date">${r.date}</div>
    </div>
  `).join('');
}

// Init reviews on load
document.addEventListener('DOMContentLoaded', renderUserReviews);

/* ─── FEATURE 5: VEHICLE HISTORY CHECKER ─────────────────────── */
function checkVehicleHistory() {
  const reg = (document.getElementById('history-input').value || '').trim().toUpperCase();
  const name = (document.getElementById('history-name').value || '').trim();
  if (!reg && !name) { showToast('Enter Reg Number or your Name.', 'error'); return; }

  const bookings = JSON.parse(localStorage.getItem('aeBookings') || '[]');
  const repairs  = JSON.parse(localStorage.getItem('aeRepairs')  || '[]');

  let results = [];
  if (reg)  results = [...bookings.filter(b => b.vehicle && b.vehicle.toUpperCase().includes(reg)),
                        ...repairs.filter(r => r.reg && r.reg.toUpperCase().includes(reg))];
  if (name) results = [...results, ...bookings.filter(b => b.name && b.name.toLowerCase().includes(name.toLowerCase()))];

  // dedupe
  results = [...new Map(results.map(r => [r.ref || r.id, r])).values()];

  const container = document.getElementById('history-result');
  if (results.length === 0) {
    container.innerHTML = '<p style="color:var(--grey-3);text-align:center;padding:2rem">No service history found. Book your first service above!</p>';
  } else {
    container.innerHTML = results.map(r => `
      <div class="history-card">
        <div class="hc-top">
          <span class="hc-ref">${r.ref || r.id}</span>
          <span class="hc-status status-${r.paid ? 'received' : 'inprogress'}">${r.paid ? '✅ Confirmed' : '⏳ Pending'}</span>
        </div>
        <div class="hc-vehicle">🚗 ${r.vehicle} ${r.reg ? '· ' + r.reg : ''}</div>
        <div class="hc-service">🔧 ${r.service || r.desc || 'Service'}</div>
        <div class="hc-date">📅 ${r.date || 'Booked'} ${r.time ? '@ ' + r.time : ''}</div>
        <div class="hc-amount">💰 Total: ₹${(r.totalPrice || r.price || 0).toLocaleString('en-IN')}</div>
      </div>
    `).join('');
  }
  container.classList.remove('hidden');
}

/* ─── FEATURE 6: LIVE CHAT WIDGET ─────────────────────────────── */
(function initChat() {
  const autoReplies = [
    { keys: ['hello', 'hi', 'hey', 'namaste'], reply: "Hello! 👋 Welcome to AutoElite. How can I help you today? You can ask about services, pricing, or book an appointment!" },
    { keys: ['book', 'appointment', 'schedule'], reply: "📅 To book a service, scroll up and click **Book Now** in the menu, or <a href='#booking' onclick='toggleChat()'>click here</a>. We confirm within 5 minutes!" },
    { keys: ['price', 'cost', 'charge', 'rate', 'fee'], reply: "💰 Use our **Cost Estimator** to get instant quotes! <a href='#estimator' onclick='toggleChat()'>Click here →</a>. Prices start from ₹400 for tyre service and ₹800 for oil change." },
    { keys: ['track', 'status', 'repair', 'update'], reply: "🔍 Track your vehicle status instantly! Go to **Track Repair** section or enter your Booking Ref / Reg Number." },
    { keys: ['emergency', 'breakdown', 'road', 'stuck'], reply: "🚨 Emergency? Call us NOW: <strong>+91 95105 16503</strong>. We reach you within 45 minutes, 24/7!" },
    { keys: ['ac', 'air', 'cool', 'cooling'], reply: "❄️ AC issues? We handle gas recharge, compressor repair, and cabin filter replacement. First AC pressure test is FREE! Book at ₹1,200 onwards." },
    { keys: ['oil', 'engine', 'service'], reply: "⚙️ Oil change starts from ₹800. Full service from ₹2,500. We use OEM-grade synthetic and semi-synthetic oils from Shell, Castrol & Mobil 1." },
    { keys: ['tyre', 'tire', 'puncture', 'flat', 'wheel'], reply: "🛞 Tyre services start at ₹400. We offer fitting, 3D alignment, balancing, and puncture repair for all brands. Same-day service available!" },
    { keys: ['brake'], reply: "🛑 Brake pad replacement from ₹1,800. Safety is our priority — all brake work comes with a 6-month warranty!" },
    { keys: ['warranty', 'guarantee'], reply: "🛡️ All our repairs come with a **6-month / 10,000 km warranty** on parts and labour. No questions asked." },
    { keys: ['time', 'hour', 'open', 'timing'], reply: "🕐 We're open Mon–Fri 8AM–7PM, Sat 8AM–6PM, Sun 10AM–4PM. Emergency service is available 24/7!" },
    { keys: ['location', 'address', 'where', 'map'], reply: "📍 AutoElite Garage Complex, Plot No. 15, Industrial Area Phase 2, Near Highway Flyover, City – 400001. <a href='https://maps.google.com' target='_blank'>Open in Maps →</a>" },
    { keys: ['whatsapp', 'wa', 'chat'], reply: "💬 Chat with us on WhatsApp: <a href='https://wa.me/919510516503' target='_blank'>+91 95105 16503</a>. Typical response in under 5 minutes!" },
    { keys: ['thanks', 'thank', 'great', 'good'], reply: "😊 You're welcome! Is there anything else I can help you with? You can also call us at +91 95105 16503." },
  ];

  window.toggleChat = function() {
    const win = document.getElementById('chat-window');
    const bubble = document.getElementById('chat-bubble');
    if (!win) return;
    const isOpen = win.classList.toggle('open');
    bubble.classList.toggle('pulsing', !isOpen);
    if (isOpen && document.getElementById('chat-messages').children.length === 0) {
      addBotMsg("👋 Hi there! I'm AutoBot, AutoElite's virtual assistant. How can I help you today?", 600);
      addBotMsg("You can ask me about <strong>services, pricing, booking, tracking</strong> or anything car-related!", 1400);
    }
  };

  window.sendChat = function() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    addUserMsg(msg);
    input.value = '';
    const lower = msg.toLowerCase();
    const match = autoReplies.find(ar => ar.keys.some(k => lower.includes(k)));
    setTimeout(() => {
      addBotMsg(match ? match.reply : "🤔 I'm not sure about that, but our team knows! Call us at <strong>+91 95105 16503</strong> or WhatsApp us. We typically respond in 5 minutes during business hours.");
    }, 700);
  };

  window.handleChatKey = function(e) {
    if (e.key === 'Enter') sendChat();
  };

  function addUserMsg(text) {
    const msgs = document.getElementById('chat-messages');
    msgs.innerHTML += `<div class="chat-msg user-msg">${text}</div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addBotMsg(html, delay = 0) {
    const msgs = document.getElementById('chat-messages');
    setTimeout(() => {
      msgs.innerHTML += `<div class="chat-msg bot-msg"><span class="bot-dot"></span>${html}</div>`;
      msgs.scrollTop = msgs.scrollHeight;
    }, delay);
  }
})();

/* ─── FEATURE 7: PRINTABLE INVOICE / RECEIPT ─────────────────── */
function printReceipt() {
  const booking = JSON.parse(localStorage.getItem('aeBookings') || '[]').slice(-1)[0];
  const printArea = document.getElementById('print-receipt');
  if (!printArea) return;
  if (booking) {
    printArea.innerHTML = `
      <div class="print-header">
        <h1>AutoElite Garage</h1>
        <p>Plot No. 15, Industrial Area Phase 2, City – 400001</p>
        <p>Phone: +91 95105 16503 | hello@autoelitegarage.com</p>
        <hr/>
        <h2>SERVICE RECEIPT</h2>
      </div>
      <table class="print-table">
        <tr><td>Booking Ref</td><td><strong>${booking.ref}</strong></td></tr>
        <tr><td>Payment ID</td><td>${booking.paymentId || '—'}</td></tr>
        <tr><td>Customer Name</td><td>${booking.name}</td></tr>
        <tr><td>Phone</td><td>${booking.phone}</td></tr>
        <tr><td>Vehicle</td><td>${booking.vehicle}</td></tr>
        <tr><td>Registration</td><td>${booking.reg || '—'}</td></tr>
        <tr><td>Service Date</td><td>${booking.date} at ${booking.time}</td></tr>
        <tr><td>Services</td><td>${booking.service}</td></tr>
        <tr><td>Total Estimate</td><td>₹${(booking.totalPrice || 0).toLocaleString('en-IN')}</td></tr>
        <tr><td>Advance Paid (30%)</td><td><strong>₹${(booking.advancePaid || 0).toLocaleString('en-IN')}</strong></td></tr>
        <tr><td>Balance Due</td><td>₹${((booking.totalPrice || 0) - (booking.advancePaid || 0)).toLocaleString('en-IN')}</td></tr>
      </table>
      <p style="margin-top:1.5rem">All repairs are covered by a <strong>6-month / 10,000 km warranty</strong>.</p>
      <p>Thank you for choosing AutoElite Garage! 🏎️</p>
      <p style="margin-top:1rem;font-size:0.8rem;color:#666">Generated: ${new Date().toLocaleString('en-IN')}</p>
    `;
  } else {
    printArea.innerHTML = '<p>No booking found to print.</p>';
  }
  window.print();
}
