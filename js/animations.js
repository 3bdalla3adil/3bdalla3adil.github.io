// js/animations.js
// Scroll effects, transitions, and animations

import { prefersReducedMotion, debounce } from './utils.js';

/**
 * Initialize scroll animations using IntersectionObserver
 */
export function initScrollAnimations() {
  if (prefersReducedMotion()) {
    // If user prefers reduced motion, add visible class immediately
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Initialize parallax effects for hero section
 */
export function initParallax() {
  if (prefersReducedMotion()) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroContent = hero.querySelector('.hero__content');
  if (!heroContent) return;

  const handleParallax = throttle(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    
    if (heroContent) {
      heroContent.style.transform = `translateY(${rate}px)`;
    }
  }, 10);

  window.addEventListener('scroll', handleParallax, { passive: true });
}

/**
 * Initialize fade-in animations
 * @param {HTMLElement} element - Element to animate
 */
export function fadeInOnScroll(element) {
  if (!element || prefersReducedMotion()) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(element);
}

/**
 * Initialize smooth scroll behavior
 */
export function initSmoothScroll() {
  // Modern browsers support CSS scroll-behavior: smooth
  // This is a fallback for older browsers
  if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

/**
 * Animate counter numbers
 * @param {HTMLElement} element - Element containing number
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
export function animateCounter(element, target, duration = 2000) {
  if (prefersReducedMotion()) {
    element.textContent = target;
    return;
  }

  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

/**
 * Initialize number counter animations
 */
export function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/**
 * Stagger animation for grid items
 * @param {NodeList} items - Collection of items to stagger
 * @param {number} delay - Delay between items in ms
 */
export function staggerAnimation(items, delay = 100) {
  if (prefersReducedMotion()) {
    Array.from(items).forEach(item => item.classList.add('is-visible'));
    return;
  }

  Array.from(items).forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('is-visible');
    }, index * delay);
  });
}

/**
 * Initialize navbar scroll behavior
 */
export function initNavbarScroll() {
  const navbar = document.querySelector('.header');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 100;

  const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > scrollThreshold) {
      navbar.classList.add('header--scrolled');
    } else {
      navbar.classList.remove('header--scrolled');
    }

    // Hide/show navbar on scroll direction (optional)
    if (Math.abs(lastScroll - currentScroll) < 5) return;

    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      navbar.classList.add('header--hidden');
    } else {
      navbar.classList.remove('header--hidden');
    }

    lastScroll = currentScroll;
  }, 10);

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Initialize hover effects for interactive elements
 */
export function initHoverEffects() {
  const cards = document.querySelectorAll('.bento-card, .skill-card, .cert-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!prefersReducedMotion()) {
        this.style.transform = 'translateY(-8px)';
      }
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

/**
 * Throttle function for scroll handlers
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
