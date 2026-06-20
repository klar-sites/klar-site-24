/**
 * Nordic Shoulder Clinic - Vanilla JavaScript
 * Handles: Navigation, Theme Toggling, Accordion, 
 * Scroll Reveal, Sticky Nav, Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const siteHeader = document.getElementById('site-header');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && siteHeader) {
    navToggle.addEventListener('click', () => {
      siteHeader.classList.toggle('nav-open');
    });

    // Close menu when a link is clicked
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (siteHeader.classList.contains('nav-open')) {
            siteHeader.classList.remove('nav-open');
          }
        });
      });
    }
  }

  // 2. Theme Toggle (Dark / Light Mode)
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      root.removeAttribute('data-theme');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  // 3. Active Navigation Highlighting
  // Compares current URL path with nav links
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      const linkPath = link.getAttribute('href').split('/').pop();
      if (linkPath === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active'); // Ensure no duplicates if hardcoded in HTML
      }
    });
  }

  // 4. Sticky Navbar Scroll Effect
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        siteHeader.style.boxShadow = 'var(--shadow-md)';
        siteHeader.style.borderBottomColor = 'var(--color-border)';
      } else {
        siteHeader.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init on load
  }

  // 5. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 6. FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.parentElement;
      
      // Close other open items
      document.querySelectorAll('.accordion-item').forEach(item => {
        if (item !== accordionItem && item.classList.contains('active')) {
          item.classList.remove('active');
        }
      });

      // Toggle current item
      accordionItem.classList.toggle('active');
    });
  });

  // 7. Form Validation
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    const validateField = (field) => {
      const formGroup = field.parentElement;
      let isValid = true;

      if (!field.value.trim()) {
        isValid = false;
      } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          isValid = false;
        }
      }

      if (isValid) {
        formGroup.classList.remove('error');
      } else {
        formGroup.classList.add('error');
      }

      return isValid;
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const message = document.getElementById('message');

      let isFormValid = true;
      
      isFormValid = validateField(name) && isFormValid;
      isFormValid = validateField(email) && isFormValid;
      isFormValid = validateField(phone) && isFormValid;
      isFormValid = validateField(message) && isFormValid;

      if (isFormValid) {
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.setAttribute('role', 'alert');
        }
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          if (formSuccess) formSuccess.style.display = 'none';
        }, 5000);
      }
    });

    // Real-time error clearing on input
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.parentElement.classList.remove('error');
        }
      });
    });
  }

  // 8. Smooth Scrolling for internal anchor links
  // (CSS handles scroll-behavior: smooth, but JS ensures offset for sticky header if needed)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

}); // End DOMContentLoaded
