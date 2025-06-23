// Mobile menu
const hamburger = document.querySelectorAll('.hamburger');
const closeBtn = document.querySelector('.close-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.overlay');

function toggleMenu() {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    hamburger.forEach(btn => {
        if (btn !== closeBtn) {
            btn.classList.toggle('active');
        }
    });
}
hamburger.forEach(btn => {
    btn.addEventListener('click', toggleMenu);
});
overlay.addEventListener('click', toggleMenu);
document.querySelectorAll('.mobile-links a').forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Sticky menu
const stickyMenu = document.querySelector('.sticky-menu');
const header = document.querySelector('.hero');
const headerHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
    if (window.scrollY > headerHeight) {
        stickyMenu.classList.add('visible');
    } else {
        stickyMenu.classList.remove('visible');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Portfolio Filter
const filterButtons = document.querySelectorAll('.filter-button');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        // Filter items
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Clients Carousel
const clientsCarousel = document.querySelector('.clients-carousel');
const clientsTrack = document.querySelector('.clients-track');
const carouselDots = document.querySelectorAll('.carousel-dot');
let currentCarouselSlide = 0;
const totalSlides = 3;
let carouselInterval;
function initCarousel() {
    moveToSlide(0);
    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        currentCarouselSlide = (currentCarouselSlide + 1) % totalSlides;
        moveToSlide(currentCarouselSlide);
    }, 5000);
}
function moveToSlide(index) {
    currentCarouselSlide = index;
    const slideWidth = 100;
    clientsTrack.style.transform = `translateX(-${currentCarouselSlide * slideWidth}%)`;
    carouselDots.forEach(dot => dot.classList.remove('active'));
    carouselDots[currentCarouselSlide].classList.add('active');
}
initCarousel();
carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        moveToSlide(index);
    });
});
clientsCarousel.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});
clientsTrack.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(() => {
        currentCarouselSlide = (currentCarouselSlide + 1) % totalSlides;
        moveToSlide(currentCarouselSlide);
    }, 5000);
});

// Sticky header on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Form submission
const ctaForm = document.querySelector('.cta-form');
ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = ctaForm.querySelector('input[type="email"]');
    const messageInput = ctaForm.querySelector('textarea');
    alert(`Agradecemos seu interesse! Entraremos em contato em breve.`);
    emailInput.value = '';
    messageInput.value = '';
}); 