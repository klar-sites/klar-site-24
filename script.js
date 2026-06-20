/**
 * Nordic Shoulder Clinic - Main JavaScript
 * 
 * Features:
 * - Mobile menu toggle
 * - Sticky navbar effects
 * - Scroll reveal animations (IntersectionObserver)
 * - FAQ accordion
 * - Active navigation highlighting
 * - Vanilla JS form validation
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * 1. Mobile Navigation Toggle
     */
    const initMobileNav = () => {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        if (!menuToggle || !navLinks) return;

        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        // Close mobile menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    };

    /**
     * 2. Sticky Navbar Scroll Effect
     */
    const initStickyHeader = () => {
        const header = document.getElementById('siteHeader');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Init on load
    };

    /**
     * 3. Scroll Reveal Animations
     */
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => observer.observe(el));
    };

    /**
     * 4. FAQ Accordion
     */
    const initAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (!accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (!header || !content) return;

            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other open items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        if (otherContent) otherContent.style.maxHeight = null;
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    };

    /**
     * 5. Active Navigation Highlighting
     */
    const initActiveNav = () => {
        const navLinks = document.querySelectorAll('.nav-links a:not(.btn)');
        if (!navLinks.length) return;

        let currentPath = window.location.pathname.split('/').pop();
        if (currentPath === '' || currentPath === '/') {
            currentPath = 'index.html';
        }

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    /**
     * 6. Form Validation (Contact Page)
     */
    const initFormValidation = () => {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');
        const successMsg = document.getElementById('formSuccess');

        const showError = (input, message) => {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;
            formGroup.classList.add('error');
            const errorSpan = formGroup.querySelector('.form-error');
            if (errorSpan) errorSpan.textContent = message;
        };

        const clearError = (input) => {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;
            formGroup.classList.remove('error');
        };

        const validators = {
            name: (val) => val.trim().length > 1 || 'Please enter your full name.',
            email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email address.',
            phone: (val) => /^[+]?[\d\s-]{7,}$/.test(val) || 'Please enter a valid phone number.',
            message: (val) => val.trim().length > 10 || 'Please provide a brief description (min. 10 characters).'
        };

        // Real-time validation on blur
        [name, email, phone, message].forEach(input => {
            if (!input) return;
            input.addEventListener('blur', () => {
                const validator = validators[input.id];
                const result = validator(input.value);
                if (result !== true) {
                    showError(input, result);
                } else {
                    clearError(input);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;

            [name, email, phone, message].forEach(input => {
                if (!input) return;
                const validator = validators[input.id];
                const result = validator(input.value);
                if (result !== true) {
                    showError(input, result);
                    isFormValid = false;
                } else {
                    clearError(input);
                }
            });

            if (isFormValid) {
                // Simulate form submission
                if (successMsg) {
                    successMsg.style.display = 'block';
                    form.reset();
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                }
            }
        });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initAccordion();
    initActiveNav();
    initFormValidation();
});
