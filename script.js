/* ═══════════════════════════════════════════
   DENTAL CARE — JAVASCRIPT
   Features: Nav scroll, Mobile menu, Scroll
   reveal, Form validation, Active nav links,
   Year footer
═══════════════════════════════════════════ */

'use strict';

/* ─── DOM READY ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
  initActiveNav();
  initAppointmentForm();
  setFooterYear();
});


/* ─── 1. NAVIGATION SCROLL EFFECT ───────── */
function initNav() {
  const header = document.getElementById('navbar');
  const SCROLL_THRESHOLD = 50;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on init
}


/* ─── 2. MOBILE HAMBURGER MENU ───────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  if (!hamburger || !navMenu) return;

  const toggle = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);

  // Close menu when a nav link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
}


/* ─── 3. SCROLL REVEAL ANIMATION ────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const options = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, options);

  elements.forEach(el => observer.observe(el));
}


/* ─── 4. SMOOTH SCROLL ───────────────────── */
function initSmoothScroll() {
  // CSS scroll-behavior handles it, but we add nav offset correction
  // for browsers that don't support scroll-padding-top:
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ─── 5. ACTIVE NAV LINK HIGHLIGHTING ───── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link:not(.nav-cta)');
  if (!sections.length || !navLinks.length) return;

  const navH = 80;

  const setActive = () => {
    let current = '';
    const scrollPos = window.scrollY + navH + 40;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}


/* ─── 6. APPOINTMENT FORM ────────────────── */
function initAppointmentForm() {
  const form        = document.getElementById('appointment-form');
  const submitBtn   = document.getElementById('submit-btn');
  const successMsg  = document.getElementById('success-message');
  const successName = document.getElementById('success-name');
  const resetBtn    = document.getElementById('reset-form-btn');

  if (!form) return;

  /* ── Validators ── */
  const validators = {
    name(value) {
      if (!value.trim())          return 'Please enter your full name.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email(value) {
      if (!value.trim()) return 'Please enter your email address.';
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return 'Please enter a valid email address.';
      return '';
    },
    phone(value) {
      if (!value.trim()) return 'Please enter your phone number.';
      const clean = value.replace(/[\s\-().+]/g, '');
      if (!/^\d{7,15}$/.test(clean)) return 'Please enter a valid phone number.';
      return '';
    },
  };

  /* ── Show / clear error per field ── */
  const showError = (fieldId, message) => {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    if (input)  input.classList.toggle('error', !!message);
    if (error)  error.textContent = message;
  };

  const clearError = (fieldId) => showError(fieldId, '');

  /* ── Live validation on blur ── */
  ['name', 'email', 'phone'].forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (!input) return;

    input.addEventListener('blur', () => {
      const error = validators[fieldId](input.value);
      showError(fieldId, error);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        const error = validators[fieldId](input.value);
        showError(fieldId, error);
      }
    });
  });

  /* ── Form submit ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all required fields
    let hasErrors = false;
    const requiredFields = ['name', 'email', 'phone'];

    requiredFields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      const error = validators[fieldId](input ? input.value : '');
      showError(fieldId, error);
      if (error) hasErrors = true;
    });

    if (hasErrors) {
      // Focus first error field
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate API call
    submitBtn.classList.add('loading');

    await simulateRequest(1400);

    // Success
    const nameVal = document.getElementById('name').value.trim().split(' ')[0];
    successName.textContent = nameVal;

    form.style.display = 'none';
    successMsg.removeAttribute('aria-hidden');
    successMsg.classList.add('visible');
    submitBtn.classList.remove('loading');

    successMsg.focus();
  });

  /* ── Reset form ── */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      successMsg.classList.remove('visible');
      successMsg.setAttribute('aria-hidden', 'true');
      ['name', 'email', 'phone'].forEach(clearError);

      // Focus the first input
      const firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    });
  }
}

/* Simulates a server delay */
function simulateRequest(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* ─── 7. FOOTER YEAR ─────────────────────── */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}