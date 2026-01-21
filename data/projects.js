// data/projects.js
// Single source of truth for all portfolio data

export const projects = [
  {
    id: 'odoo-assembly-disassembly',
    title: 'Odoo Assembly/Disassembly Module',
    description: 'Revolutionary Odoo 16 module for managing product bundles with precise quantity tracking and comprehensive history.',
    longDescription: 'A brand-new Odoo 16 module designed to revolutionize assembly and disassembly processes for products. Simplifies creating and breaking down product bundles (e.g., 2 LED batteries → 1 pack), with accurate quantity calculations and detailed action history for enhanced traceability.',
    category: 'odoo',
    tags: ['Odoo 16', 'Python', 'Inventory Management', 'ERP'],
    image: '/assets/img/odoo-module.jpg',
    github: null,
    demo: null,
    featured: true,
    year: 2024,
    client: 'Enterprise Client',
    status: 'completed',
    highlights: [
      'Seamless Assembly/Disassembly operations',
      'Precise Quantity Tracking',
      'Comprehensive History monitoring'
    ]
  },
  {
    id: 'odoo-account-filter',
    title: 'Odoo 17 Account Reports Filter',
    description: 'New report filter feature for Account Reports module, merged into default Odoo 17 framework.',
    longDescription: 'Successfully created a new filter for the Account Reports module in Odoo 17. Allows users to select accounts from a list, filter reports based on selected accounts, and admins can choose whether to display or hide this filter. This contribution has been added to the default Odoo 17 framework.',
    category: 'odoo',
    tags: ['Odoo 17', 'Reporting', 'Python', 'Contributor'],
    image: '/assets/img/odoo-filter.jpg',
    github: 'https://github.com/3bdalla3adil/product-odoo-restrictions',
    demo: null,
    featured: false,
    year: 2024,
    client: 'Odoo Community',
    status: 'completed'
  },
  {
    id: 'odoo-attendance-api',
    title: 'Automatic Attendance + TeleWork API',
    description: 'Automated attendance tracking with TeleWork API integration for HR and payroll modules.',
    longDescription: 'Created an Odoo module for automatic attendance tracking for specified employees. Includes TeleWork Odoo API & HR modules integration, payroll with accounting customization. Enhanced testing using Odoo interactive shell for increased reliability. Includes API for integrating B2B client Odoo website with teleworkers\' reports.',
    category: 'odoo',
    tags: ['Odoo', 'REST API', 'HR', 'Payroll', 'PostgreSQL'],
    image: '/assets/img/odoo-hr.jpg',
    github: null,
    demo: null,
    featured: false,
    year: 2024,
    client: 'Corporate Client',
    status: 'completed'
  },
  {
    id: 'raspberry-pi-chat',
    title: 'Raspberry Pi Chat Application',
    description: 'Real-time chat application for Raspberry Pi clients and server, optimized for embedded devices.',
    longDescription: 'Developed a chat application for a French client with client/server architecture for Raspberry Pi devices. Ensured optimal performance and user experience for embedded hardware. Delivered on time with excellent client feedback, earning a 5-star review and recommendation letter.',
    category: 'python',
    tags: ['Python', 'Sockets', 'Raspberry Pi', 'Linux', 'Real-time'],
    image: '/assets/img/raspberry-chat.jpg',
    github: null,
    demo: null,
    featured: true,
    year: 2023,
    client: 'French Client',
    status: 'completed'
  },
  {
    id: 'cybersecurity-tool',
    title: 'Cybersecurity Information Gathering Tool',
    description: 'Pure Python port of Golang code for cybersecurity information gathering with Django REST API.',
    longDescription: 'Ported Golang code to pure Python without using any external Python packages. The tool accepts text keywords as input and outputs JSON responses via API. Built with Django REST framework to populate database with keywords and provide web framework for data retrieval.',
    category: 'python',
    tags: ['Python', 'Django REST', 'PostgreSQL', 'Cybersecurity', 'API'],
    image: '/assets/img/cyber-tool.jpg',
    github: null,
    demo: null,
    featured: false,
    year: 2023,
    client: 'American Client',
    status: 'completed'
  },
  {
    id: 'linux-odoo-management',
    title: 'Linux Administration & Odoo Deployments',
    description: 'Managed multiple Odoo server instances with Docker, sub-domains, and custom invoice layouts.',
    longDescription: 'Managed multiple Odoo server instances with multiple sub-domains, dockerized them all with Bash scripts. Redesigned invoice layout with Arabic font support (TAJAWAL). Configured reverse proxies, SSL certificates, and automated deployment processes.',
    category: 'devops',
    tags: ['Docker', 'Nginx', 'Bash', 'Linux', 'DevOps'],
    image: '/assets/img/linux-odoo.jpg',
    github: null,
    demo: null,
    featured: false,
    year: 2024,
    client: 'Multiple Clients',
    status: 'completed'
  },
  {
    id: 'android-prayer-times',
    title: 'Android Prayer Times App',
    description: 'Comprehensive prayer times application with Qibla direction, Hijri calendar, and magnetometer integration.',
    longDescription: 'An innovative Android application for timely prayer reminders, Qibla direction determination through API integration, and both Hijri and Gregorian calendars. Meticulously computes prayer times and harnesses device magnetometer capabilities for accurate direction measurement.',
    category: 'android',
    tags: ['Android', 'Kotlin', 'Java', 'API Integration', 'Mobile'],
    image: '/assets/img/prayer-app.jpg',
    github: null,
    demo: null,
    featured: true,
    year: 2023,
    client: 'Personal Project',
    status: 'completed'
  },
  {
    id: 'android-queue-app',
    title: 'Digital Queue Management App',
    description: 'Queue management system for local bakery with SQLite database and first-come-first-served logic.',
    longDescription: 'Android application for managing bakery queue in Bahry. Uses SQLite3 database to store and manage queue order data in a timely manner, facilitating first-come-first-served service to reduce conflicts between customers.',
    category: 'android',
    tags: ['Android', 'SQLite', 'Java', 'UX Design', 'Mobile'],
    image: '/assets/img/queue-app.jpg',
    github: null,
    demo: null,
    featured: false,
    year: 2023,
    client: 'Local Business',
    status: 'completed'
  },
  {
    id: 'vpn-efood-setup',
    title: 'VPN & Efood Multivendor Deployment',
    description: 'Complete infrastructure setup including SoftEther VPN and Efood multivendor platform on DigitalOcean.',
    longDescription: 'Installed and configured SoftEther VPN server with excellent client feedback. Deployed Efood multivendor website on DigitalOcean with domain and subdomain configuration, MySQL database setup, Nginx reverse proxy, PHP 7 on Ubuntu 20.04 LTS, and Docker container configuration for Nginx reverse proxy.',
    category: 'devops',
    tags: ['SoftEther VPN', 'DigitalOcean', 'Nginx', 'MySQL', 'PHP', 'Docker'],
    image: '/assets/img/infra-setup.jpg',
    github: null,
    demo: null,
    featured: false,
    year: 2023,
    client: 'Multiple Clients',
    status: 'completed'
  }
];

export const skills = [
  { name: 'Python', level: 'expert', icon: '🐍', category: 'language' },
  { name: 'Odoo', level: 'expert', icon: '📦', category: 'framework' },
  { name: 'Django', level: 'advanced', icon: '🌐', category: 'framework' },
  { name: 'Django REST', level: 'advanced', icon: '🔌', category: 'framework' },
  { name: 'PostgreSQL', level: 'advanced', icon: '🐘', category: 'database' },
  { name: 'MySQL', level: 'advanced', icon: '🗄️', category: 'database' },
  { name: 'Docker', level: 'advanced', icon: '🐳', category: 'devops' },
  { name: 'Nginx', level: 'advanced', icon: '⚡', category: 'devops' },
  { name: 'Linux', level: 'expert', icon: '🐧', category: 'devops' },
  { name: 'AWS', level: 'intermediate', icon: '☁️', category: 'cloud' },
  { name: 'Android', level: 'advanced', icon: '🤖', category: 'mobile' },
  { name: 'Kotlin', level: 'intermediate', icon: '📱', category: 'language' },
  { name: 'JavaScript', level: 'intermediate', icon: '💛', category: 'language' },
  { name: 'HTML/CSS', level: 'advanced', icon: '🎨', category: 'frontend' },
  { name: 'Bash', level: 'advanced', icon: '💻', category: 'scripting' }
];

export const certificates = [
  {
    id: 'isc2',
    title: 'ISC2 Certificate',
    issuer: 'ISC2',
    date: '2024-01-01',
    image: '/assets/img/isc2_cert.png',
    url: null
  },
  {
    id: 'backend-cert',
    title: 'Backend Development Certificate',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/backend_cert.png',
    url: null
  },
  {
    id: 'linux-fundamentals',
    title: 'Linux Fundamentals',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/linux_cert.png',
    url: null
  },
  {
    id: 'linux-cloud-devops',
    title: 'Linux Cloud & DevOps',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/linux_cloud_and_devops_cert.png',
    url: null
  },
  {
    id: 'managing-linux',
    title: 'Managing Linux Systems',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/managing_linux_system_cert.png',
    url: null
  },
  {
    id: 'securing-linux',
    title: 'Securing Linux Systems',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/securing_linux_system_cert.png',
    url: null
  },
  {
    id: 'linux-specialization',
    title: 'Linux Specialization',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/linux_specialization_cert.png',
    url: null
  },
  {
    id: 'os-foundation',
    title: 'Operating System Foundation',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/operating_system_foundation_cert.png',
    url: null
  },
  {
    id: 'hardware-software',
    title: 'Computer Hardware and Software',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/computer_hardware_and_software_cert.png',
    url: null
  },
  {
    id: 'cybersecurity-foundations',
    title: 'Cybersecurity Foundations Specialization',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/cybersecurity_foundations_specialization_cert.png',
    url: null
  },
  {
    id: 'cybersecurity-policy',
    title: 'Cybersecurity Policy Foundation',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/cybersecurity_policy_foundation_cert.png',
    url: null
  },
  {
    id: 'brand-cert',
    title: 'Brand Certificate',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/brand_cert.png',
    url: null
  },
  {
    id: 'comptia-project',
    title: 'CompTIA Project+ Certificate',
    issuer: 'CompTIA',
    date: '2023-01-01',
    image: '/assets/img/comptia_project_cert.png',
    url: null
  },
  {
    id: 'canva',
    title: 'Canva Certificate',
    issuer: 'Canva',
    date: '2023-01-01',
    image: '/assets/img/canva_cert.png',
    url: null
  },
  {
    id: 'python-flask',
    title: 'Python Flask Certificate',
    issuer: 'Educational Institution',
    date: '2023-01-01',
    image: '/assets/img/python_flask_cert.png',
    url: null
  }
];

// Filter helpers
export function getProjectsByCategory(category) {
  return projects.filter(project => project.category === category);
}

export function getFeaturedProjects() {
  return projects.filter(project => project.featured);
}

export function getSkillsByCategory(category) {
  return skills.filter(skill => skill.category === category);
}
