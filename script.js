// =========================================
// Apex Shoulder Clinic - script.js
// Vanilla JavaScript for all interactivity
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. Theme Toggle (Dark/Light Mode)
    // =========================================
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const iconMoon = document.getElementById('iconMoon');
    const iconSun = document.getElementById('iconSun');

    // Function to apply theme based on preference
    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            iconMoon.style.display = 'none';
            iconSun.style.display = 'block';
        } else {
            iconMoon.style.display = 'block';
            iconSun.style.display = 'none';
        }
    };

    // Initialize theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // =========================================
    // 2. Mobile Navigation Toggle
    // =========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // =========================================
    // 3. Sticky Navbar Effect on Scroll
    // =========================================
    const siteHeader = document.getElementById('siteHeader');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load in case page is refreshed mid-scroll

    // =========================================
    // 4. Active Navigation Highlighting
    // =========================================
    const navLinks = document.querySelectorAll('.nav-link');
    // Get current page filename (e.g., 'index.html', 'about.html')
    let currentPath = window.location.pathname.split('/').pop();
    
    // Fallback for local environments where path might be empty
    if (currentPath === '' || currentPath === undefined) {
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

    // =========================================
    // 5. Scroll Reveal Animations
    // =========================================
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a slight delay based on index for staggering effect within grids
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // =========================================
    // 6. FAQ Accordion
    // =========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all currently open items
            faqItems.forEach(openItem => {
                openItem.classList.remove('active');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open the clicked item if it was previously closed
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                // Set max-height to scrollHeight to trigger CSS transition
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // =========================================
    // 7. Form Validation (Contact Page)
    // =========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Helper function to show error
            const showError = (inputId, errorId, message = null) => {
                const input = document.getElementById(inputId);
                const errorElement = document.getElementById(errorId);
                input.classList.add('error');
                if (message) {
                    errorElement.textContent = message;
                }
                errorElement.style.display = 'block';
                isValid = false;
            };

            // Helper function to clear error
            const clearError = (inputId, errorId) => {
                const input = document.getElementById(inputId);
                const errorElement = document.getElementById(errorId);
                input.classList.remove('error');
                errorElement.style.display = 'none';
            };

            // Clear all previous errors
            clearError('name', 'nameError');
            clearError('email', 'emailError');
            clearError('phone', 'phoneError');
            clearError('message', 'messageError');

            // Validate Name
            const name = document.getElementById('name').value.trim();
            if (name === '' || name.length < 2) {
                showError('name', 'nameError', 'Please enter your full name.');
            }

            // Validate Email
            const email = document.getElementById('email').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('email', 'emailError', 'Please enter a valid email address.');
            }

            // Validate Phone
            const phone = document.getElementById('phone').value.trim();
            const phoneRegex = /^[+]?[\d\s\-()]{7,}$/; // Basic phone validation
            if (!phoneRegex.test(phone)) {
                showError('phone', 'phoneError', 'Please enter a valid phone number.');
            }

            // Validate Message
            const message = document.getElementById('message').value.trim();
            if (message === '' || message.length < 10) {
                showError('message', 'messageError', 'Please provide a brief description (min 10 characters).');
            }

            // If valid, show success message
            if (isValid) {
                document.getElementById('formSuccess').style.display = 'block';
                contactForm.reset(); // Clear form fields
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    document.getElementById('formSuccess').style.display = 'none';
                }, 5000);
            }
        });
    }

    // =========================================
    // 8. Smooth Scrolling for Anchor Links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Ignore empty hashes or placeholder links
            if (targetId === '#' || targetId === '') return; 
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight - 20; // 20px extra padding
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
