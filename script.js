/* =============================================
   MUSTAFA ABBAS — PORTFOLIO SCRIPTS
   ============================================= */

/* ---- 1. PARTICLE / NODE NETWORK BACKGROUND ---- */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  const CONFIG = {
    count: 55,
    color: '45, 106, 79',       // Forest green RGB
    lineColor: '45, 106, 79',
    maxDist: 140,
    speed: 0.35,
    mouseRadius: 120,
    dotSize: 2.5,
  };

  let W, H, particles, mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    this.r = CONFIG.dotSize;
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Subtle mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius * 0.008;
        p.vx += dx * force;
        p.vy += dy * force;
        // Cap speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) { p.vx = (p.vx / speed) * 1.2; p.vy = (p.vy / speed) * 1.2; }
      }
    });

    // Draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const alpha = (1 - dist / CONFIG.maxDist) * 0.2;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${CONFIG.lineColor}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color}, 0.35)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('touchmove', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  init();
  draw();
})();


/* ---- 2. NAV SCROLL EFFECT ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ---- 3. MOBILE NAV TOGGLE ---- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});


/* ---- 4. SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-scroll').forEach((el, i) => {
  // Stagger siblings in the same parent
  const siblings = el.parentElement.querySelectorAll('.reveal-scroll');
  let delay = 0;
  siblings.forEach((sib, idx) => { if (sib === el) delay = idx * 0.07; });
  el.style.transitionDelay = delay + 's';
  revealObserver.observe(el);
});


/* ---- 5. LANGUAGE BAR ANIMATION ---- */
const langObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.lang-fill').forEach(fill => {
        const target = fill.getAttribute('data-width');
        fill.style.width = target + '%';
      });
      langObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.lang-section').forEach(el => langObserver.observe(el));


/* ---- 6. GRADE TOGGLES ---- */
document.querySelectorAll('.grades-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const grades = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    grades.classList.toggle('collapsed', expanded);
    btn.querySelector('span') && (btn.querySelector('span').textContent = expanded ? 'View Grades' : 'Hide Grades');
    // Update button text content (keep SVG intact)
    const textNode = [...btn.childNodes].find(n => n.nodeType === 3);
    if (textNode) textNode.textContent = expanded ? 'View Grades ' : 'Hide Grades ';
  });
});


/* ---- 7. WORK EXPAND / COLLAPSE ---- */
document.querySelectorAll('.btn-expand, .btn-expand-sm').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const detail = document.getElementById(targetId);
    if (!detail) return;

    const isOpen = detail.classList.contains('open');
    detail.classList.toggle('open', !isOpen);
    detail.classList.toggle('collapsed', isOpen);
    btn.setAttribute('aria-expanded', !isOpen);

    // Update button text for featured card
    if (btn.classList.contains('btn-expand')) {
      const textEl = btn.querySelector('.btn-expand-text');
      if (textEl) textEl.textContent = isOpen ? 'View Full Case Study' : 'Close Case Study';
    }
  });
});


/* ---- 8. CREATIVES VIEW MORE / LESS ---- */
const creativesToggle = document.getElementById('creativesToggle');
const creativesGrid = document.getElementById('creativesGrid');

if (creativesToggle && creativesGrid) {
  creativesToggle.addEventListener('click', () => {
    const hidden = creativesGrid.querySelectorAll('.creative-hidden');
    const isOpen = creativesToggle.classList.contains('open');
    const textEl = document.getElementById('creativesToggleText');
    const iconEl = document.getElementById('creativesToggleIcon');

    hidden.forEach((card, i) => {
      if (isOpen) {
        card.classList.remove('show');
      } else {
        // Staggered reveal
        setTimeout(() => card.classList.add('show'), i * 60);
      }
    });

    creativesToggle.classList.toggle('open', !isOpen);
    if (textEl) textEl.textContent = isOpen ? '+ View All Work' : '− Show Less';
  });
}


/* ---- 9. ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));


/* ---- 10. SMOOTH STAGGER ON CARDS (work cards, achieve cards) ---- */
document.querySelectorAll('.work-cards-grid .work-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.08) + 's';
});
document.querySelectorAll('.achieve-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.08) + 's';
});
document.querySelectorAll('.cap-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.07) + 's';
});