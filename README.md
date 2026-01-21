# Portfolio Website - Modular Architecture

A high-performance, accessible portfolio website built with Vanilla HTML5, CSS3, and Modern JavaScript (ES6+ Modules).

## Architecture Overview

This portfolio follows strict **separation of concerns** principles:

- **Data Layer**: `data/projects.js` - Single source of truth for all content
- **JavaScript Modules**: ES6+ modules for maintainability
- **CSS Architecture**: Modular CSS with BEM methodology
- **Design System**: Bento-grid layout with glassmorphism effects

## File Structure

```
portfolio/
├── index-modular.html      # Main HTML entry point
├── SPEC.md                 # Architecture specification
├── README.md               # This file
│
├── data/
│   └── projects.js         # Project, skill, and certificate data
│
├── js/
│   ├── app.js              # Main application entry point
│   ├── ui-renderer.js      # DOM manipulation & rendering
│   ├── animations.js       # Scroll effects & transitions
│   └── utils.js            # Helper functions
│
├── css/
│   ├── variables.css       # Design tokens (CSS custom properties)
│   ├── reset.css           # Modern CSS reset
│   ├── base.css            # Typography & global styles
│   ├── layout.css          # Grid, containers, spacing
│   ├── components.css      # Reusable UI components (BEM)
│   ├── bento-grid.css      # Bento-grid layout styles
│   ├── glassmorphism.css   # Glassmorphism effects
│   └── responsive.css      # Media queries & responsive utilities
│
└── assets/
    ├── img/                # Images, certificates, logos
    ├── fonts/              # Custom fonts (if any)
    └── icons/              # SVG icons
```

## Getting Started

### Prerequisites

- A modern web server (or use a local development server)
- Modern browser with ES6+ module support

### Local Development

1. **Start a local server** (choose one):

   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (http-server)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

2. **Open in browser**:
   ```
   http://localhost:8000/index-modular.html
   ```

### Why a Local Server?

ES6 modules require a server due to CORS restrictions. Opening the HTML file directly in a browser (`file://`) will not work.

## Features

### ✨ Design Features
- **Bento-Grid Layout**: Asymmetric grid with varying card sizes
- **Glassmorphism Effects**: Modern glass-like UI elements
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Smooth Animations**: Scroll-triggered animations with IntersectionObserver

### ♿ Accessibility
- **WCAG 2.2 AA Compliant**: Color contrast, keyboard navigation, screen reader support
- **Semantic HTML**: Proper heading hierarchy, landmarks, ARIA labels
- **Reduced Motion Support**: Respects `prefers-reduced-motion`
- **Focus Indicators**: Clear focus states for keyboard navigation

### ⚡ Performance
- **No Build Step**: Vanilla JavaScript/CSS - no compilation needed
- **ES6 Modules**: Tree-shakeable, modern JavaScript
- **Lazy Loading**: Images load on demand
- **Optimized Animations**: GPU-accelerated transforms

## Customization

### Adding Projects

Edit `data/projects.js`:

```javascript
export const projects = [
  {
    id: 'unique-id',
    title: 'Project Title',
    description: 'Brief description',
    category: 'python',  // 'python' | 'odoo' | 'android' | 'devops'
    tags: ['Python', 'Django'],
    image: '/assets/img/project.jpg',
    featured: true,  // Makes it prominent in bento-grid
    // ... more properties
  },
  // Add more projects...
];
```

### Modifying Styles

1. **Colors & Theme**: Edit `css/variables.css`
2. **Components**: Edit `css/components.css` (BEM methodology)
3. **Layout**: Edit `css/bento-grid.css` for grid behavior

### Adding Features

1. **New JavaScript feature**: Add to appropriate module or create new module
2. **Import in `app.js`**: Import and initialize your feature
3. **Add styles**: Add CSS in appropriate module

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Features gracefully degrade for older browsers.

## Project Structure Details

### Data Layer (`data/projects.js`)
- Single source of truth for all content
- No hardcoded HTML - all UI generated from data
- Easy to maintain and extend

### JavaScript Modules

**`app.js`**
- Application initialization
- Event listener setup
- Coordinates between modules

**`ui-renderer.js`**
- Renders projects, skills, certificates
- Template generation
- DOM manipulation

**`animations.js`**
- Scroll animations (IntersectionObserver)
- Parallax effects
- Smooth scrolling

**`utils.js`**
- Helper functions
- Theme toggle
- Mobile menu
- XSS prevention utilities

### CSS Architecture

**Variables** (`variables.css`)
- Design tokens (colors, spacing, typography)
- Dark theme support
- CSS custom properties

**Components** (`components.css`)
- BEM methodology
- Reusable UI elements (buttons, cards, tags)
- Consistent styling

**Bento-Grid** (`bento-grid.css`)
- Responsive grid layout
- Card sizing logic
- Hover effects

**Glassmorphism** (`glassmorphism.css`)
- Glass effect utilities
- Modal styles
- Certificate viewer

## Accessibility Features

- ✅ Semantic HTML5 elements
- ✅ ARIA labels and landmarks
- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ Color contrast compliance (WCAG AA)
- ✅ Focus indicators
- ✅ Skip to main content link
- ✅ Reduced motion support

## Performance Optimizations

- Lazy-loaded images (`loading="lazy"`)
- IntersectionObserver for animations (no scroll listeners)
- CSS containment for better rendering
- Optimized font loading
- Minimal JavaScript footprint

## Testing

### Manual Testing Checklist

- [ ] All projects render from `data/projects.js`
- [ ] Bento-grid layout works on all screen sizes
- [ ] Glassmorphism effects display correctly
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible (test with NVDA/JAWS)
- [ ] Color contrast meets WCAG AA standards
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Images lazy load properly
- [ ] No console errors

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Possible additions (not in current scope):
- Service Worker / PWA support
- Advanced filtering/search
- Animation library integration (GSAP)
- TypeScript migration
- Unit tests
- Dark mode toggle UI enhancement

## License

This portfolio template is for personal use. Customize as needed.

## Credits

Built with modern web standards and best practices:
- **Fonts**: Inter (Google Fonts)
- **Icons**: Font Awesome 6.5.0
- **No frameworks**: Pure Vanilla JavaScript/CSS

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-27