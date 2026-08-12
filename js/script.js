const projects = [
  {
    title: 'Assembly/Disassembly Module',
    desc: 'Simplifies creating and breaking down product bundles. Precise quantity tracking with full action history for inventory accuracy.',
    tags: ['Odoo', 'Inventory', 'Python'],
    icon: 'fa-cubes',
    link: 'https://apps.odoo.com/apps/modules/16.0/product-odoo-da'
  },
  {
    title: 'Ekram Medical Center Management System',
    desc: 'Patient, appointment, procedure, lab, and consultation workflows in one Odoo system.',
    tags: ['Odoo', 'Contacts', 'Python', 'JavaScript'],
    icon: 'fa-file-medical',
    link: 'https://apps.odoo.com/apps/modules/19.0/ekram_medical'
  },
  {
    title: 'Account Reports Filter',
    desc: 'Report filter merged into Odoo 17/18 framework with account selection and visibility controls.',
    tags: ['Odoo', 'Reporting', 'JavaScript'],
    icon: 'fa-filter',
    link: 'https://apps.odoo.com/apps/modules/19.0/finance-odoo-filter'
  },
  {
    title: 'Automatic Attendance + TeleWork API',
    desc: 'Automated attendance and HR payroll integration for selected employees and teleworkers.',
    tags: ['Odoo', 'REST', 'PostgreSQL'],
    icon: 'fa-user-check',
    link: null
  },
  {
    title: 'Raspberry Pi Chat',
    desc: 'Client/server chat app for a French client with optimized embedded-device experience.',
    tags: ['Sockets', 'Linux', 'Raspberry Pi'],
    icon: 'fa-comments',
    link: null
  },
  {
    title: 'Cybersecurity Info-Gathering Tool',
    desc: 'Pure-Python cybersecurity tool with Django REST output and keyword-driven database processing.',
    tags: ['Python', 'Django REST', 'PostgreSQL'],
    icon: 'fa-shield-halved',
    link: null
  },
  {
    title: 'Linux Administration & Deployments',
    desc: 'Managed Odoo instances, Dockerized services, and custom invoice branding for production workloads.',
    tags: ['Docker', 'Nginx', 'Bash'],
    icon: 'fa-server',
    link: null
  },
  {
    title: 'Prayer Times App',
    desc: 'Prayer reminders, Qibla direction, and Hijri/Gregorian calendar support for Android users.',
    tags: ['Android', 'Java', 'APIs'],
    icon: 'fa-mobile-screen',
    link: null
  },
  {
    title: 'Digital Queue App',
    desc: 'Customer queue management with SQLite storage and first-come-first-served logic.',
    tags: ['Android', 'SQLite', 'UX'],
    icon: 'fa-list-ol',
    link: null
  },
  {
    title: 'VPN & Efood Multivendor Setup',
    desc: 'SoftEther VPN and Efood deployment with domain, MySQL, Nginx, and Ubuntu server setup.',
    tags: ['SoftEther', 'DigitalOcean', 'Nginx'],
    icon: 'fa-network-wired',
    link: null
  }
];

const skills = [
  'Python', 'Odoo', 'Django', 'FastAPI',
  'PostgreSQL', 'MySQL', 'Docker', 'Linux',
  'AWS', 'Nginx', 'Git', 'Android',
  'JavaScript', 'REST APIs', 'QWeb', 'Bash'
];

const certificates = [
  { title: 'Introduction to Linux', org: 'The Linux Foundation LFS101', img: '/assets/img/lfs101.png' },
  { title: 'Introduction to Kubernetes', org: 'The Linux Foundation LFS158', img: '/assets/img/lfs158.png' },
  { title: 'Kubernetes Cloud Native Essentials', org: 'The Linux Foundation LF250', img: '/assets/img/lfs250.png' },
  { title: 'Linux Fundamentals', org: 'Coursera', img: '/assets/img/linux_cert.png' },
  { title: 'Backend Development', org: 'Meta / Coursera', img: '/assets/img/backend_cert.png' },
  { title: 'Cybersecurity', org: 'Coursera', img: '/assets/img/isc2_cert.png' },
  { title: 'Linux Cloud & DevOps', org: 'Coursera', img: '/assets/img/linux_cloud_and_devops_cert.png' },
  { title: 'Managing Linux Systems', org: 'Coursera', img: '/assets/img/managing_linux_system_cert.png' },
  { title: 'Securing Linux Systems', org: 'Coursera', img: '/assets/img/securing_linux_system_cert.png' },
  { title: 'Linux Specialization', org: 'Coursera', img: '/assets/img/linux_specialization_cert.png' },
  { title: 'OS Foundations', org: 'Coursera', img: '/assets/img/operating_system_foundation_cert.png' },
  { title: 'Python Flask', org: 'Coursera', img: '/assets/img/python_flask_cert.png' }
];

function renderProjects() {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  container.innerHTML = projects.map((project) => `
    <article class="project-card">
      <div class="project-thumb"><i class="fas ${project.icon}"></i></div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
        <div class="project-meta">
          <div>${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
          ${project.link ? `<a href="${project.link}" target="_blank" rel="noreferrer" class="project-link">View <i class="fas fa-arrow-up-right-from-square" style="font-size:0.75rem;"></i></a>` : ''}
        </div>
      </div>
    </article>
  `).join('');
}

function renderSkills() {
  const container = document.getElementById('skillsGrid');
  if (!container) return;

  container.innerHTML = skills.map((skill) => `<div class="skill-item">${skill}</div>`).join('');
}

function renderCertificates() {
  const track = document.getElementById('certTrack');
  const certCount = document.getElementById('certCount');
  if (track) {
    const items = [...certificates, ...certificates].map((certificate, index) => `
      <article class="cert-card" data-index="${index % certificates.length}" aria-label="${certificate.title}">
        <img src="${certificate.img}" alt="${certificate.title}" loading="lazy">
        <div class="cert-card-info">
          <h4>${certificate.title}</h4>
          <p>${certificate.org}</p>
        </div>
      </article>
    `).join('');
    track.innerHTML = items;

    track.querySelectorAll('.cert-card').forEach((card) => {
      card.addEventListener('click', () => {
        const modal = document.getElementById('certModal');
        const modalImage = document.getElementById('modalImage');
        const modalCounter = document.getElementById('modalCounter');
        const index = Number(card.dataset.index);
        const selected = certificates[index];
        if (!modal || !modalImage || !modalCounter || !selected) return;
        modal.classList.add('show');
        modalImage.src = selected.img;
        modalImage.alt = selected.title;
        modalCounter.textContent = `${index + 1} / ${certificates.length}`;
      });
    });
  }

  if (certCount) {
    certCount.textContent = `${certificates.length} certificates`;
  }
}

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('active');
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const subject = encodeURIComponent(`Project inquiry from ${name}`);
  const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
  window.location.href = `mailto:3bdalla995@gmail.com?subject=${subject}&body=${body}`;
}

function setupNavigation() {
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const toggleButton = document.querySelector('.mobile-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleMenu);
  }

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      const navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.remove('active');
    });
  });
}

function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit);
  }
}

function setupCertificateModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  const closeButton = modal.querySelector('.cert-modal-close');
  const prevButton = modal.querySelector('.cert-modal-prev');
  const nextButton = modal.querySelector('.cert-modal-next');
  const modalImage = document.getElementById('modalImage');
  const modalCounter = document.getElementById('modalCounter');

  const closeModal = () => modal.classList.remove('show');
  const openIndex = (index) => {
    if (!modalImage || !modalCounter) return;
    const safeIndex = (index + certificates.length) % certificates.length;
    const selected = certificates[safeIndex];
    modalImage.src = selected.img;
    modalImage.alt = selected.title;
    modalCounter.textContent = `${safeIndex + 1} / ${certificates.length}`;
    modal.dataset.index = String(safeIndex);
  };

  if (closeButton) closeButton.addEventListener('click', closeModal);
  if (prevButton) prevButton.addEventListener('click', () => openIndex(Number(modal.dataset.index || 0) - 1));
  if (nextButton) nextButton.addEventListener('click', () => openIndex(Number(modal.dataset.index || 0) + 1));

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('show')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowRight') openIndex(Number(modal.dataset.index || 0) + 1);
    if (event.key === 'ArrowLeft') openIndex(Number(modal.dataset.index || 0) - 1);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderSkills();
  renderCertificates();
  setupNavigation();
  setupContactForm();
  setupCertificateModal();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});