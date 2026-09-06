// ===== Shivshakti Sport — shared UI behaviours =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');
const scrollProgress = document.getElementById('scrollProgress');

function closeNav() {
  document.body.classList.remove('nav-open');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}
if (navLinks) navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});
window.addEventListener('resize', () => { if (window.innerWidth > 768) closeNav(); });

let ticking = false;
function onScroll() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (header) header.classList.toggle('scrolled', scrollY > 60);
  if (scrollProgress) scrollProgress.style.width = (docHeight > 0 ? (scrollY / docHeight) * 100 : 0) + '%';
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// Smooth in-page scroll with header offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = (header ? header.offsetHeight : 0) + 12;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('visible'));
} else {
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); o.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => obs.observe(el));
}

// Hero stat count-up
const counters = document.querySelectorAll('.sp-hero-stats b[data-count]');
counters.forEach(el => {
  const target = parseInt(el.getAttribute('data-count'), 10);
  if (!Number.isFinite(target) || prefersReducedMotion) { el.textContent = String(target); return; }
  const start = performance.now();
  const dur = 1000;
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * target));
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = String(target);
  }
  requestAnimationFrame(step);
});

// Footer year
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
