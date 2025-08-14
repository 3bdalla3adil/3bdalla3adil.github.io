// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        let targetElement;
        
        if (targetId === '#') {
            return;
        } else if (targetId.startsWith('#')) {
            targetElement = document.querySelector(targetId);
        } else {
            // It's an external link, allow default behavior
            return;
        }
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
    
    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.getElementById('skills');
    
    if (skillsSection && skillBars.length > 0) {
        const sectionPosition = skillsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (sectionPosition < screenPosition) {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                if (width && !bar.style.width) {
                    bar.style.width = width;
                }
            });
        }
    }
}

// Initialize skill bar widths
document.querySelectorAll('.skill-progress').forEach(bar => {
    const width = bar.parentElement.previousElementSibling.querySelector('.skill-percent').textContent;
    bar.setAttribute('data-width', width);
});

// Set initial state for animated elements
document.querySelectorAll('.animate').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Trigger animations on load
window.addEventListener('load', () => {
    animateOnScroll();
    
    // Add width to skill bars for animation
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        }
    });
});

window.addEventListener('scroll', animateOnScroll);