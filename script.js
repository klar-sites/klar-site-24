/* ==========================================================================
   ORTHOCORE SHOULDER CLINIC – SCRIPT.JS
   Vanilla JS: mobile menu, FAQ accordion, scroll reveal, sticky nav,
   smooth scroll, active nav highlight, form validation, theme toggle.
   ========================================================================== */
;(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Wait for DOM to be fully ready
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initFAQ();
    initScrollReveal();
    initStickyNav();
    initSmoothScroll();
    initActiveNav();
    initFormValidation();
    initThemeToggle();
  });

  // --------------------------------------------------------------------------
  // 1. MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks   = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
      // Toggle
      document.body.classList.toggle('menu-open');
      hamburger.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when a link inside is clicked (mobile behaviour)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (document.body.classList.contains('menu-open')) {
          document.body.classList.remove('menu-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. FAQ ACCORDION
  // --------------------------------------------------------------------------
  function initFAQ() {
    // Use event delegation for dynamic content and multiple pages
    document.addEventListener('click', function (e) {
      const question = e.target.closest('.faq-question');
      if (!question) return;

      const item = question.closest('.faq-item');
      if (!item) return;

      // Toggle active class on the whole item
      item.classList.toggle('active');

      // Update aria-expanded
      const expanded = item.classList.contains('active');
      question.setAttribute('aria-expanded', expanded);
    });
  }

  // --------------------------------------------------------------------------
  // 3. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Unobserve after reveal for performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --------------------------------------------------------------------------
  // 4. STICKY NAVIGATION (add background on scroll)
  // --------------------------------------------------------------------------
  function initStickyNav() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 10) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. SMOOTH SCROLLING FOR ANCHOR LINKS
  // --------------------------------------------------------------------------
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // --------------------------------------------------------------------------
  // 6. ACTIVE NAVIGATION HIGHLIGHT
  // --------------------------------------------------------------------------
  function initActiveNav() {
    // Compare the end of the link href with the current page filename
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
    if (!navLinks.length) return;

    navLinks.forEach(function (link) {
      const hrefFile = link.getAttribute('href').split('/').pop();
      if (hrefFile === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. FORM VALIDATION (Contact Form)
  // --------------------------------------------------------------------------
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Helper to show error
    function showError(fieldId, errorId, message) {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(errorId);
      if (!field || !error) return;
      const group = field.closest('.form-group');
      if (group) group.classList.add('error');
      error.textContent = message;
      error.style.display = 'block';
      field.setAttribute('aria-invalid', 'true');
    }

    // Helper to clear error
    function clearError(fieldId, errorId) {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(errorId);
      if (!field || !error) return;
      const group = field.closest('.form-group');
      if (group) group.classList.remove('error');
      error.style.display = 'none';
      field.removeAttribute('aria-invalid');
    }

    // Clear errors on input
    form.addEventListener('input', function (e) {
      if (e.target.matches('#firstName, #lastName, #email, #message')) {
        const id = e.target.id;
        const errorId = id + 'Error';
        clearError(id, errorId);
      }
    });

    // Validate on submit
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // First name
      const firstName = document.getElementById('firstName');
      if (!firstName.value.trim()) {
        showError('firstName', 'firstNameError', 'Please enter your first name.');
        isValid = false;
      } else {
        clearError('firstName', 'firstNameError');
      }

      // Last name
      const lastName = document.getElementById('lastName');
      if (!lastName.value.trim()) {
        showError('lastName', 'lastNameError', 'Please enter your last name.');
        isValid = false;
      } else {
        clearError('lastName', 'lastNameError');
      }

      // Email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        showError('email', 'emailError', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('email', 'emailError');
      }

      // Message
      const message = document.getElementById('message');
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError('message', 'messageError', 'Please tell us about your shoulder concern (minimum 10 characters).');
        isValid = false;
      } else {
        clearError('message', 'messageError');
      }

      if (!isValid) {
        // Focus first invalid field
        const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstError) firstError.focus();
      } else {
        // Form is valid – simulate submission (alert as placeholder)
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        setTimeout(function () {
          alert('Thank you for your enquiry! Our team will get back to you within one working day.');
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          // Clear any remaining errors
          form.querySelectorAll('.form-group.error').forEach(function (g) {
            g.classList.remove('error');
          });
          form.querySelectorAll('.form-error').forEach(function (e) {
            e.style.display = 'none';
          });
        }, 1000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. THEME TOGGLE (DARK MODE)
  // --------------------------------------------------------------------------
  function initThemeToggle() {
    const html = document.documentElement;

    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark/light mode');
    toggle.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;padding:0.5rem;font-size:1.2rem;background:none;border:none;cursor:pointer;color:var(--color-text);';

    // Current theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    function setTheme(theme) {
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      // Update button icon
      toggle.innerHTML = theme === 'dark' ? '&#9788;' : '&#9790;'; // moon / sun
    }

    toggle.addEventListener('click', function () {
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });

    // Insert toggle into header (before nav or after logo)
    const headerInner = document.querySelector('.header-inner');
    if (headerInner) {
      // Place it after the logo, before the nav
      const logo = headerInner.querySelector('.logo');
      if (logo && logo.nextSibling) {
        headerInner.insertBefore(toggle, logo.nextSibling);
      } else {
        headerInner.appendChild(toggle);
      }
    }
  }

})();
