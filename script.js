document.addEventListener('DOMContentLoaded', function () {

  /* ============ STICKY HEADER ON SCROLL ============ */
  const header = document.getElementById('site-header');
  function handleHeaderScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ============ MOBILE NAV TOGGLE ============ */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============ SMOOTH SCROLL FOR NAV LINKS ============ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============ ACTIVE SECTION HIGHLIGHTING ============ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(function (link) {
          link.classList.toggle('active-link', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(function (section) { sectionObserver.observe(section); });

  /* ============ ANIMATE HERO STATUS PANEL BARS ON SCROLL INTO VIEW ============ */
  const statusFills = document.querySelectorAll('.status-fill');
  const statusPanel = document.querySelector('.status-panel');
  if (statusPanel) {
    // Bars are set inline via style width already; re-trigger the transition
    // once the panel enters view so the fill animates rather than snapping in.
    statusFills.forEach(function (fill) {
      fill.dataset.targetWidth = fill.style.width;
      fill.style.width = '0%';
    });
    const panelObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          statusFills.forEach(function (fill) {
            fill.style.width = fill.dataset.targetWidth;
          });
          panelObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    panelObserver.observe(statusPanel);
  }

  /* ============ CONTACT FORM VALIDATION ============ */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    const row = field.closest('.form-row');
    if (message) {
      row.classList.add('has-error');
      errorEl.textContent = message;
      return false;
    } else {
      row.classList.remove('has-error');
      errorEl.textContent = '';
      return true;
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successMsg.classList.remove('visible');

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const store = document.getElementById('cf-store').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    const nameOk = setError('cf-name', 'err-name', name.length < 2 ? 'Please enter your name.' : '');
    const emailOk = setError('cf-email', 'err-email', !isValidEmail(email) ? 'Please enter a valid email address.' : '');
    const storeOk = setError('cf-store', 'err-store', store.length < 3 ? 'Please add your store URL.' : '');
    const messageOk = setError('cf-message', 'err-message', message.length < 10 ? 'Please describe the issue in a bit more detail.' : '');

    if (nameOk && emailOk && storeOk && messageOk) {
      // No backend is wired up — replace this block with a fetch() call to your
      // form endpoint (e.g. Formspree, Netlify Forms, or your own API) to actually send it.
      successMsg.classList.add('visible');
      form.reset();
      setTimeout(function () { successMsg.classList.remove('visible'); }, 6000);
    }
  });

  /* ============ FOOTER YEAR ============ */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
