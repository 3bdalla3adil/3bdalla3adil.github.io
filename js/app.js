// js/app.js
// Main entry point - Application initialization and orchestration

import { renderProjects, renderSkills, renderCertificates, filterProjects, updateFilterButtons } from './ui-renderer.js';
import { 
  initScrollAnimations, 
  initParallax, 
  initSmoothScroll, 
  initNavbarScroll,
  initHoverEffects,
  initCounters
} from './animations.js';
import { setupThemeToggle, setupMobileMenu, setupSmoothScroll } from './utils.js';
import { projects, skills, certificates, getProjectsByCategory, getFeaturedProjects } from '../data/projects.js';
import { aahbCaseStudy } from '../data/aahb-case-study.js';

/**
 * Main Portfolio Application Class
 */
class PortfolioApp {
  constructor() {
    // Keep the existing portfolio data source and add the new hands-on case study.
    this.projects = [...projects, aahbCaseStudy];
    this.skills = skills;
    this.certificates = certificates;
    this.activeFilter = 'all';
  }

  /**
   * Initialize the application
   */
  init() {
    // Initialize UI rendering
    this.renderUI();
    
    // Initialize animations
    this.initAnimations();
    
    // Initialize utilities
    this.initUtilities();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize accessibility features
    this.initAccessibility();
    
    console.log('Portfolio app initialized successfully');
  }

  /**
   * Render all UI components
   */
  renderUI() {
    renderProjects(this.projects);
    renderSkills(this.skills);
    renderCertificates(this.certificates);
  }

  /**
   * Initialize all animations
   */
  initAnimations() {
    initScrollAnimations();
    initSmoothScroll();
    initNavbarScroll();
    initHoverEffects();
    initCounters();
    
    if (document.querySelector('.hero')) {
      initParallax();
    }
  }

  /**
   * Initialize utility features
   */
  initUtilities() {
    setupThemeToggle();
    setupMobileMenu();
    setupSmoothScroll();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this.setupProjectFilters();
    this.setupSearch();
    this.setupContactForm();
  }

  /**
   * Setup project category filters
   */
  setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.currentTarget.dataset.category || 'all';
        this.activeFilter = category;
        
        if (category === 'all') {
          renderProjects(this.projects);
        } else {
          const filtered = this.projects.filter(project => project.category === category);
          renderProjects(filtered);
        }
        
        updateFilterButtons(category);
        
        const projectsSection = document.querySelector('#projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /**
   * Setup search functionality
   */
  setupSearch() {
    const searchInput = document.getElementById('project-search');
    if (!searchInput) return;

    const handleSearch = (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query === '') {
        const projectsToShow = this.activeFilter === 'all' 
          ? this.projects 
          : this.projects.filter(project => project.category === this.activeFilter);
        renderProjects(projectsToShow);
        return;
      }

      const filtered = this.projects.filter(project => {
        const searchableText = `
          ${project.title} 
          ${project.description} 
          ${project.tags.join(' ')} 
          ${project.category}
        `.toLowerCase();
        
        return searchableText.includes(query);
      });

      renderProjects(filtered);
    };

    searchInput.addEventListener('input', handleSearch);
  }

  /**
   * Setup contact form handler
   */
  setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
      const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}\n\n---\nSent from portfolio website`);
      const mailtoLink = `mailto:3bdalla995@gmail.com?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoLink;
    });
  }

  /**
   * Initialize accessibility features
   */
  initAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    const cards = document.querySelectorAll('.bento-card, .cert-card');
    cards.forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    this.setupAriaLive();
  }

  /**
   * Setup ARIA live regions for screen readers
   */
  setupAriaLive() {
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'sr-only';
    ariaLive.id = 'aria-live-region';
    document.body.appendChild(ariaLive);
  }

  announceToScreenReader(message) {
    const ariaLive = document.getElementById('aria-live-region');
    if (ariaLive) {
      ariaLive.textContent = message;
      setTimeout(() => {
        ariaLive.textContent = '';
      }, 1000);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
  });
} else {
  const app = new PortfolioApp();
  app.init();
}

export default PortfolioApp;
