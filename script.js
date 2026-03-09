/* ============================================================
   HIMALAYA JOURNEYS — script.js
   ============================================================ */

/* ── NAV: Sticky scroll effect ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MOBILE HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay    = document.getElementById('overlay');

function toggleMenu(open) {
  mobileMenu.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  toggleMenu(!mobileMenu.classList.contains('open'));
});
overlay.addEventListener('click', () => toggleMenu(false));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => toggleMenu(false))
);

/* ── SCROLL REVEAL (IntersectionObserver) ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ── PARALLAX HERO BACKGROUND ── */
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const scrolled = window.scrollY;
  // Offset vertically as user scrolls down
  heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.2}px)`;
});

/* ── TESTIMONIAL SLIDER ── */
let currentSlide = 0;
const totalSlides = 3;
const track = document.getElementById('testimonialTrack');
const dots   = document.querySelectorAll('.dot');

/**
 * Navigate to a specific slide index.
 * @param {number} n - Zero-based slide index
 */
function goToSlide(n) {
  currentSlide = (n + totalSlides) % totalSlides;          // wrap around
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide()  { goToSlide(currentSlide - 1); }

// Auto-advance every 5 seconds
let autoSlide = setInterval(nextSlide, 5000);

// Pause auto-advance when user interacts with arrows or dots
document.querySelectorAll('.arrow-btn, .dot').forEach(el => {
  el.addEventListener('click', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
  });
});

// Expose globally for inline onclick handlers in HTML
window.goToSlide = goToSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;

/* ── TOUCH / SWIPE SUPPORT FOR SLIDER ── */
let touchStartX = 0;

track.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

track.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? nextSlide() : prevSlide();
  }
}, { passive: true });

/* ── CONTACT FORM SUBMIT FEEDBACK ── */
const submitBtn = document.querySelector('.btn-submit');

if (submitBtn) {
  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const name    = document.querySelector('.form-input[type="text"]');
    const email   = document.querySelector('.form-input[type="email"]');
    const message = document.querySelector('.form-textarea');

    // Simple validation
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      submitBtn.textContent = '⚠ Please fill all fields';
      submitBtn.style.background = 'linear-gradient(135deg, #b04040, #e05050)';
      setTimeout(() => {
        submitBtn.textContent = 'Send Message →';
        submitBtn.style.background = '';
      }, 2500);
      return;
    }

    // Success state
    submitBtn.textContent = '✓ Message Sent!';
    submitBtn.style.background = 'linear-gradient(135deg, #3a9e6b, #5dc98e)';
    submitBtn.disabled = true;

    // Reset fields
    name.value = '';
    email.value = '';
    message.value = '';
    document.querySelectorAll('.form-input')[2].value = ''; // Tour of interest

    setTimeout(() => {
      submitBtn.textContent = 'Send Message →';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3500);
  });
}

/* ── SMOOTH ACTIVE NAV LINK HIGHLIGHT ── */
const sections  = document.querySelectorAll('section[id], footer');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.remove('active-nav');
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active-nav');
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));