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

// Mobile menu functionality
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

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Combined filter system for media cards
const filterButtons = document.querySelectorAll('.filter-button');
const placeCheckboxes = document.querySelectorAll('.place-checkbox');
const midiaCards = document.querySelectorAll('.midia-card');

function filterMediaCards() {
    const activeFilter = document.querySelector('.filter-button.active').getAttribute('data-filter');
    const selectedPlaces = Array.from(placeCheckboxes)
        .filter(checkbox => checkbox.checked && checkbox.value !== 'all')
        .map(checkbox => checkbox.value);

    midiaCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardPlace = card.getAttribute('data-place');
        
        // Check category filter
        const matchesCategory = activeFilter === 'all' || cardCategory === activeFilter;
        
        // Check place filter
        const matchesPlace = selectedPlaces.length === 0 || selectedPlaces.includes(cardPlace);
        
        // Show/hide based on both filters
        card.style.display = (matchesCategory && matchesPlace) ? 'block' : 'none';
    });
}

// Initialize filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterMediaCards();
    });
});

// Initialize place checkboxes
placeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        // Handle "All" checkbox behavior
        if (this.value === 'all' && this.checked) {
            placeCheckboxes.forEach(cb => {
                if (cb.value !== 'all') cb.checked = false;
            });
        } else if (this.value !== 'all' && this.checked) {
            // Uncheck "All" if any specific place is selected
            document.querySelector('.place-checkbox[value="all"]').checked = false;
        }
        
        filterMediaCards();
    });
});

// Form submission handler
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = ctaForm.querySelector('input[type="email"]');
        const messageInput = ctaForm.querySelector('textarea');
        alert(`Agradecemos seu interesse! Entraremos em contato em breve.`);
        emailInput.value = '';
        messageInput.value = '';
    });
}

// Initialize filters on page load
document.addEventListener('DOMContentLoaded', function() {
    filterMediaCards();
});
