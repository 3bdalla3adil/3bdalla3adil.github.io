# Portfolio Website Architecture Specification

## Project Overview
**Goal:** Create a high-performance, accessible portfolio website using Vanilla HTML5, CSS3, and Modern JavaScript (ES6+ Modules) with strict separation of concerns.

---

## 1. File Structure

```
portfolio/
│
├── index.html                 # Main HTML entry point
├── SPEC.md                    # This specification document
│
├── data/
│   └── projects.js            # Project data (exported array of objects)
│
├── js/
│   ├── app.js                 # Main entry point, initializes modules
│   ├── ui-renderer.js         # DOM manipulation & template rendering
│   ├── animations.js          # Scroll effects, transitions, animations
│   └── utils.js               # Helper functions, validators, formatters
│
├── css/
│   ├── variables.css          # CSS custom properties (theme tokens)
│   ├── reset.css              # Modern CSS reset
│   ├── base.css               # Typography, global styles
│   ├── layout.css             # Grid, containers, spacing
│   ├── components.css         # Reusable UI components (BEM methodology)
│   ├── bento-grid.css         # Bento-grid layout styles
│   ├── glassmorphism.css      # Glassmorphism effect utilities
│   └── responsive.css         # Media queries & responsive utilities
│
├── assets/
│   ├── img/                   # Images, certificates, logos
│   ├── fonts/                 # Custom fonts (if any)
│   └── icons/                 # SVG icons
│
└── README.md                  # Setup & documentation
```

---

## 2. Data Layer (`data/projects.js`)

### Structure
```javascript
// data/projects.js
export const projects = [
  {
    id: 'unique-id',
    title: 'Project Title',
    description: 'Brief description',
    longDescription: 'Detailed description...',
    category: 'python' | 'odoo' | 'android' | 'devops',
    tags: ['Python', 'Django', 'PostgreSQL'],
    image: '/assets/img/project-thumb.jpg',
    github: 'https://github.com/...',
    demo: 'https://demo-url.com',
    featured: true,              // For bento-grid prominence
    year: 2024,
    client: 'Client Name',
    status: 'completed' | 'in-progress' | 'archived'
  },
  // ... more projects
];

export const skills = [
  { name: 'Python', level: 'expert', icon: '🐍' },
  { name: 'Odoo', level: 'advanced', icon: '📦' },
  // ... more skills
];

export const certificates = [
  {
    id: 'cert-1',
    title: 'Certificate Title',
    issuer: 'Issuer Name',
    date: '2024-01-01',
    image: '/assets/img/cert.png',
    url: 'https://certificate-url.com'
  },
  // ... more certificates
];
```

### Principles
- **Data-Driven UI:** All project cards, filters, and listings are generated from this data
- **Single Source of Truth:** No duplicate project information in HTML
- **Type-Safe Structure:** Clear, consistent object schema
- **Easy to Extend:** Adding new projects = adding objects to array

---

## 3. JavaScript Architecture (ES6+ Modules)

### 3.1 `app.js` (Main Entry Point)
**Responsibility:** Application bootstrap and orchestration

```javascript
// js/app.js
import { renderProjects, renderSkills, renderCertificates } from './ui-renderer.js';
import { initScrollAnimations, initParallax } from './animations.js';
import { projects, skills, certificates } from '../data/projects.js';
import { setupThemeToggle, setupMobileMenu } from './utils.js';

class PortfolioApp {
  constructor() {
    this.projects = projects;
    this.skills = skills;
    this.certificates = certificates;
  }

  init() {
    // Initialize UI
    renderProjects(this.projects);
    renderSkills(this.skills);
    renderCertificates(this.certificates);
    
    // Initialize animations
    initScrollAnimations();
    initParallax();
    
    // Initialize utilities
    setupThemeToggle();
    setupMobileMenu();
    
    // Event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Filter projects, search, etc.
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();
  app.init();
});
```

### 3.2 `ui-renderer.js` (View Layer)
**Responsibility:** All DOM manipulation and template rendering

```javascript
// js/ui-renderer.js
export function renderProjects(projects, container = '.bento-grid') {
  const grid = document.querySelector(container);
  grid.innerHTML = projects.map(project => createProjectCard(project)).join('');
}

export function createProjectCard(project) {
  return `
    <article class="bento-card bento-card--${project.category}" data-project-id="${project.id}">
      <div class="bento-card__image">
        <img src="${project.image}" alt="${project.title}" loading="lazy">
      </div>
      <div class="bento-card__content">
        <h3 class="bento-card__title">${escapeHtml(project.title)}</h3>
        <p class="bento-card__description">${escapeHtml(project.description)}</p>
        <div class="bento-card__tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}

// Additional render functions for skills, certificates, etc.
```

**Key Functions:**
- `renderProjects(projects, container)`
- `renderSkills(skills)`
- `renderCertificates(certificates)`
- `createProjectCard(project)` - Template generator
- `filterProjects(category)` - Filter logic
- `escapeHtml(str)` - XSS prevention

### 3.3 `animations.js` (Animation Layer)
**Responsibility:** Scroll animations, transitions, parallax effects

```javascript
// js/animations.js
export function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

export function initParallax() {
  // Parallax effects for hero section
}

export function initSmoothScroll() {
  // Smooth scroll for anchor links
}

export function fadeInOnScroll(element) {
  // Custom fade-in animation
}
```

**Features:**
- IntersectionObserver API for performance
- CSS-driven animations (transform, opacity)
- Reduced motion support (prefers-reduced-motion)
- GPU-accelerated transforms

### 3.4 `utils.js` (Utility Functions)
**Responsibility:** Helper functions, formatters, validators

```javascript
// js/utils.js
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function debounce(func, wait) {
  // Debounce implementation
}

export function setupThemeToggle() {
  // Dark/light theme toggle
}

export function setupMobileMenu() {
  // Mobile navigation menu
}
```

---

## 4. CSS Architecture (Modular + BEM)

### 4.1 `css/variables.css` (Design Tokens)
```css
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: blur(20px);
  
  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  
  /* Typography */
  --font-family-base: 'Inter', -apple-system, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;
  
  /* Borders */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.15);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}
```

### 4.2 `css/base.css`
- Typography (headings, paragraphs, lists)
- Global resets
- Body styles
- Focus styles for accessibility

### 4.3 `css/components.css` (BEM Methodology)
```css
/* Button Component */
.btn { }
.btn--primary { }
.btn--secondary { }
.btn--outline { }
.btn__icon { }
.btn__text { }

/* Card Component */
.card { }
.card__header { }
.card__body { }
.card__footer { }
.card--hover { }

/* Tag Component */
.tag { }
.tag--primary { }
.tag--secondary { }
```

### 4.4 `css/bento-grid.css`
**Bento-Grid Layout:**
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
  padding: var(--space-xl);
}

.bento-card {
  /* Base card styles */
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--transition-base);
}

.bento-card--featured {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-card--wide {
  grid-column: span 2;
}

.bento-card--tall {
  grid-row: span 2;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .bento-card--featured,
  .bento-card--wide {
    grid-column: span 1;
  }
}
```

### 4.5 `css/glassmorphism.css`
```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-lg);
}

.glass--strong {
  background: rgba(255, 255, 255, 0.15);
}

.glass--subtle {
  background: rgba(255, 255, 255, 0.05);
}
```

### 4.6 `css/responsive.css`
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1280px
- Container max-widths
- Flexible typography (clamp())

---

## 5. Design System

### 5.1 Bento-Grid Layout
- **Layout Style:** Asymmetric grid with varying card sizes
- **Featured Projects:** 2x2 grid span for prominence
- **Standard Projects:** 1x1 cards
- **Wide Cards:** 2x1 for horizontal emphasis
- **Tall Cards:** 1x2 for vertical emphasis

### 5.2 Glassmorphism Effects
- **Hero Section:** Strong glass effect with gradient background
- **Cards:** Subtle glass with hover states
- **Navigation:** Glass navbar with backdrop blur
- **Modals:** Glass overlays for certificate views

### 5.3 Color Palette
- **Primary:** Indigo (#6366f1)
- **Secondary:** Purple (#8b5cf6)
- **Accent:** Amber (#f59e0b)
- **Neutral:** Slate scale for text and backgrounds

### 5.4 Typography
- **Primary Font:** Inter (Google Fonts)
- **Fallback:** System font stack
- **Heading Scale:** 3rem, 2.5rem, 2rem, 1.5rem, 1.25rem
- **Body:** 1rem (16px base)

---

## 6. Accessibility (WCAG 2.2 AA)

### Requirements
1. **Semantic HTML:** Proper heading hierarchy (h1-h6), landmarks (nav, main, footer)
2. **ARIA Labels:** Descriptive labels for interactive elements
3. **Keyboard Navigation:** Full keyboard accessibility, visible focus indicators
4. **Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
5. **Alt Text:** All images have descriptive alt attributes
6. **Reduced Motion:** Respect `prefers-reduced-motion` media query
7. **Screen Reader Support:** Proper ARIA attributes, skip links
8. **Form Labels:** All form inputs have associated labels

### Implementation
```css
/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Focus indicators */
*:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Performance Optimizations

### 7.1 JavaScript
- ES6+ Modules (tree-shakeable)
- Lazy loading for non-critical scripts
- Debounced scroll handlers
- IntersectionObserver for animations (no scroll listeners)

### 7.2 CSS
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded asynchronously
- CSS containment for better rendering performance
- Use `will-change` sparingly and only when needed

### 7.3 Images
- Lazy loading (`loading="lazy"`)
- Responsive images (`srcset`, `sizes`)
- WebP format with fallbacks
- Proper aspect ratios to prevent layout shift

### 7.4 Fonts
- Font-display: swap
- Preload critical fonts
- Subset fonts if possible

---

## 8. HTML Structure (Semantic)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abdulla AAHB - Portfolio</title>
  
  <!-- Critical CSS -->
  <link rel="stylesheet" href="/css/variables.css">
  <link rel="stylesheet" href="/css/reset.css">
  <link rel="stylesheet" href="/css/base.css">
  
  <!-- Preload -->
  <link rel="preload" href="/css/components.css" as="style">
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <header class="header">
    <nav class="nav" aria-label="Main navigation">
      <!-- Navigation -->
    </nav>
  </header>
  
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <!-- Hero content -->
    </section>
    
    <section class="projects" aria-labelledby="projects-title">
      <h2 id="projects-title">Projects</h2>
      <div class="bento-grid" role="list">
        <!-- Dynamically generated project cards -->
      </div>
    </section>
    
    <!-- More sections -->
  </main>
  
  <footer class="footer">
    <!-- Footer content -->
  </footer>
  
  <script type="module" src="/js/app.js"></script>
</body>
</html>
```

---

## 9. Browser Support

- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features Used:**
  - CSS Grid
  - CSS Custom Properties
  - ES6 Modules
  - IntersectionObserver
  - Backdrop-filter (with graceful degradation)

---

## 10. Build & Deployment

### Development
- No build step required (vanilla JS/CSS)
- Local development server (Live Server, Python http.server, etc.)

### Optional Optimizations
- Minify CSS/JS (if needed for production)
- Image optimization pipeline
- Service Worker for offline support (future enhancement)

---

## 11. Testing Checklist

- [ ] All projects render from `data/projects.js`
- [ ] Bento-grid layout works on all screen sizes
- [ ] Glassmorphism effects work (with fallbacks)
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Images lazy load properly
- [ ] Performance: Lighthouse score > 90
- [ ] No console errors

---

## 12. Future Enhancements (Out of Scope)

- Service Worker / PWA
- Dark mode toggle
- Multi-language support
- Advanced filtering/search
- Animation library (GSAP) integration
- TypeScript migration
- Unit tests

---

## Approval Status

**Status:** ⏳ Awaiting Approval

**Next Steps:**
1. Review this specification
2. Approve or request modifications
3. Upon approval, code generation will begin

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-27  
**Author:** Senior Frontend Architect
