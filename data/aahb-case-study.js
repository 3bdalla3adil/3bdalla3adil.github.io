export const aahbCaseStudy = {
  id: 'aahb-odoo-pos-arabic-printing',
  title: 'AAHB Brand — Odoo 19 POS Arabic Kitchen Printing',
  description: 'Hands-on Odoo 19 POS printing pipeline for Arabic kitchen receipts, dynamic order types, three-column layouts and direct Rongta RP325 ESC/POS raster printing.',
  longDescription: 'Built a browser-to-LAN thermal printing workflow in which Odoo POS prepares UTF-8 receipt data, a Python bridge handles Arabic shaping and pixel-level receipt rendering, and the Rongta RP325 receives printer-ready ESC/POS raster bytes over TCP.',
  category: 'odoo',
  tags: ['Odoo 19', 'OWL / JavaScript', 'Python', 'ESC/POS', 'Arabic RTL', 'Rongta RP325'],
  image: '/assets/img/odoo-module.jpg',
  github: null,
  demo: 'aahb-pos-printing.html',
  featured: true,
  year: 2026,
  client: 'AAHB Brand',
  status: 'completed',
  highlights: [
    'Arabic shaping with Python instead of printer code-page dependence',
    'Dynamic kitchen routing by Odoo POS order type',
    'Three-column kitchen receipt layout',
    '576px monochrome raster rendering for 80mm thermal output',
    'Direct ESC/POS TCP printing to Rongta RP325'
  ],
  caseStudy: 'aahb-pos-printing.html'
};
