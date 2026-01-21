// js/ui-renderer.js
// DOM manipulation and template rendering

import { escapeHtml, formatDate } from './utils.js';

/**
 * Render all projects in bento-grid layout
 * @param {Array} projects - Array of project objects
 * @param {string} container - CSS selector for container
 */
export function renderProjects(projects, container = '.bento-grid') {
  const grid = document.querySelector(container);
  if (!grid) {
    console.warn(`Container ${container} not found`);
    return;
  }

  grid.innerHTML = projects.map(project => createProjectCard(project)).join('');
  
  // Add event listeners to cards
  attachProjectCardListeners();
}

/**
 * Create HTML for a single project card
 * @param {Object} project - Project object
 * @returns {string} HTML string
 */
export function createProjectCard(project) {
  const featuredClass = project.featured ? 'bento-card--featured' : '';
  const categoryClass = `bento-card--${project.category}`;
  const statusBadge = project.status === 'completed' 
    ? '<span class="status-badge status-badge--completed">Completed</span>' 
    : project.status === 'in-progress'
    ? '<span class="status-badge status-badge--in-progress">In Progress</span>'
    : '';

  return `
    <article class="bento-card ${featuredClass} ${categoryClass} animate-on-scroll" 
             data-project-id="${project.id}" 
             data-category="${project.category}"
             role="listitem">
      <div class="bento-card__image">
        <img src="${escapeHtml(project.image)}" 
             alt="${escapeHtml(project.title)}" 
             loading="lazy"
             decoding="async">
        ${statusBadge}
      </div>
      <div class="bento-card__content glass glass--subtle">
        <div class="bento-card__header">
          <h3 class="bento-card__title">${escapeHtml(project.title)}</h3>
          ${project.year ? `<span class="bento-card__year">${project.year}</span>` : ''}
        </div>
        <p class="bento-card__description">${escapeHtml(project.description)}</p>
        <div class="bento-card__tags">
          ${project.tags.map(tag => `<span class="tag tag--${project.category}">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="bento-card__actions">
          ${project.github ? `<a href="${escapeHtml(project.github)}" class="btn btn--ghost btn--sm" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHtml(project.title)} on GitHub"><i class="fab fa-github" aria-hidden="true"></i> Code</a>` : ''}
          ${project.demo ? `<a href="${escapeHtml(project.demo)}" class="btn btn--outline btn--sm" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHtml(project.title)} demo"><i class="fas fa-external-link-alt" aria-hidden="true"></i> Demo</a>` : ''}
          <button class="btn btn--text btn--sm project-details-btn" 
                  data-project-id="${project.id}"
                  aria-label="View details for ${escapeHtml(project.title)}">
            Details
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Attach event listeners to project cards
 */
function attachProjectCardListeners() {
  const detailButtons = document.querySelectorAll('.project-details-btn');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.currentTarget.dataset.projectId;
      showProjectDetails(projectId);
    });
  });
}

/**
 * Show project details modal
 * @param {string} projectId - Project ID
 */
function showProjectDetails(projectId) {
  // This would open a modal with full project details
  // For now, just scroll to the project
  const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
  if (projectCard) {
    projectCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Filter projects by category
 * @param {string} category - Category to filter by
 * @param {Array} allProjects - All projects array
 */
export function filterProjects(category, allProjects) {
  if (category === 'all') {
    renderProjects(allProjects);
    return;
  }

  const filtered = allProjects.filter(project => project.category === category);
  renderProjects(filtered);

  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('filter-btn--active', btn.dataset.category === category);
  });
}

/**
 * Render skills section
 * @param {Array} skills - Array of skill objects
 * @param {string} container - CSS selector for container
 */
export function renderSkills(skills, container = '.skills-grid') {
  const grid = document.querySelector(container);
  if (!grid) {
    console.warn(`Container ${container} not found`);
    return;
  }

  const skillsByCategory = groupSkillsByCategory(skills);
  let html = '';

  Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
    html += `
      <div class="skills-category">
        <h3 class="skills-category__title">${escapeHtml(capitalize(category))}</h3>
        <div class="skills-list">
          ${categorySkills.map(skill => createSkillCard(skill)).join('')}
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

/**
 * Create HTML for a skill card
 * @param {Object} skill - Skill object
 * @returns {string} HTML string
 */
function createSkillCard(skill) {
  const levelClass = `skill-level--${skill.level}`;
  
  return `
    <div class="skill-card glass glass--subtle animate-on-scroll">
      <div class="skill-card__icon">${skill.icon}</div>
      <div class="skill-card__content">
        <h4 class="skill-card__name">${escapeHtml(skill.name)}</h4>
        <div class="skill-card__level">
          <span class="skill-level ${levelClass}">${escapeHtml(skill.level)}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Group skills by category
 * @param {Array} skills - Array of skill objects
 * @returns {Object} Grouped skills
 */
function groupSkillsByCategory(skills) {
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});
}

/**
 * Render certificates section
 * @param {Array} certificates - Array of certificate objects
 * @param {string} container - CSS selector for container
 */
export function renderCertificates(certificates, container = '.certificates-grid') {
  const grid = document.querySelector(container);
  if (!grid) {
    console.warn(`Container ${container} not found`);
    return;
  }

  grid.innerHTML = certificates.map(cert => createCertificateCard(cert)).join('');
  
  // Attach certificate click handlers
  attachCertificateListeners();
}

/**
 * Create HTML for a certificate card
 * @param {Object} cert - Certificate object
 * @returns {string} HTML string
 */
function createCertificateCard(cert) {
  return `
    <div class="cert-card glass glass--subtle animate-on-scroll" 
         data-cert-id="${cert.id}"
         role="listitem">
      <div class="cert-card__image">
        <img src="${escapeHtml(cert.image)}" 
             alt="${escapeHtml(cert.title)}" 
             loading="lazy"
             decoding="async">
      </div>
      <div class="cert-card__content">
        <h3 class="cert-card__title">${escapeHtml(cert.title)}</h3>
        <p class="cert-card__issuer">${escapeHtml(cert.issuer)}</p>
        ${cert.date ? `<p class="cert-card__date">${formatDate(cert.date)}</p>` : ''}
      </div>
    </div>
  `;
}

/**
 * Attach click listeners to certificate cards
 */
function attachCertificateListeners() {
  const certCards = document.querySelectorAll('.cert-card');
  const modal = document.getElementById('cert-modal');
  const modalImage = document.getElementById('cert-modal-image');
  const modalTitle = document.getElementById('cert-modal-title');
  const closeBtn = document.querySelector('.cert-modal__close');

  if (!modal || !modalImage) return;

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.cert-card__title')?.textContent;
      
      if (img) {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        if (modalTitle) modalTitle.textContent = title || '';
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');
  };

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Update filter button states
 * @param {string} activeCategory - Currently active category
 */
export function updateFilterButtons(activeCategory) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.dataset.category === activeCategory;
    btn.classList.toggle('filter-btn--active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}
