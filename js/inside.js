// Scroll-aware top menu without initial animation
let lastScroll = 0;
const topMenu = document.querySelector('.inside-menu');
const scrollThreshold = 200; // Pixels to scroll before hiding

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // At very top - ensure menu is visible
    if (currentScroll <= 10) {
        topMenu.classList.remove('hidden');
        return;
    }
    
    // Scrolling down - hide menu
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        topMenu.classList.add('hidden');
    } 
    // Scrolling up - show menu
    else if (currentScroll < lastScroll) {
        topMenu.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
});

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
const portfolioItems = document.querySelectorAll('.midia-card');

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

// Initialize Google Maps
function initMap() {
    document.querySelectorAll('.midia-map').forEach(mapDiv => {
        const lat = parseFloat(mapDiv.dataset.lat);
        const lng = parseFloat(mapDiv.dataset.lng);
        const title = mapDiv.dataset.title;
        
        const map = new google.maps.Map(mapDiv, {
            center: {lat, lng},
            zoom: 15,
            disableDefaultUI: true,
            styles: [
                {
                    "featureType": "poi",
                    "stylers": [{"visibility": "off"}]
                }
            ]
        });
        
        new google.maps.Marker({
            position: {lat, lng},
            map,
            title
        });
    });
}

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