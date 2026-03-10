// ================================
// GALLERY FUNCTIONALITY
// ================================
class Gallery {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.gallery-slide');
        this.dotsContainer = document.querySelector('.gallery-dots');
        this.prevBtn = document.querySelector('.gallery-prev');
        this.nextBtn = document.querySelector('.gallery-next');
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Create dots
        this.createDots();
        
        // Event listeners
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/swipe support
        this.addSwipeSupport();
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause autoplay on hover
        const galleryContainer = document.querySelector('.gallery-container');
        galleryContainer?.addEventListener('mouseenter', () => this.stopAutoplay());
        galleryContainer?.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer?.appendChild(dot);
        });
    }
    
    goToSlide(n) {
        this.slides[this.currentSlide].classList.remove('active');
        document.querySelectorAll('.gallery-dot')[this.currentSlide]?.classList.remove('active');
        
        this.currentSlide = (n + this.slides.length) % this.slides.length;
        
        this.slides[this.currentSlide].classList.add('active');
        document.querySelectorAll('.gallery-dot')[this.currentSlide]?.classList.add('active');
    }
    
    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    startAutoplay() {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = setInterval(() => this.nextSlide(), 4000);
    }
    
    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }
    
    addSwipeSupport() {
        const container = document.querySelector('.gallery-container');
        if (!container) return;
        
        let startX = 0;
        let endX = 0;
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
}

// ================================
// MOBILE MENU
// ================================
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.nav = document.querySelector('.main-nav');
        this.dropdowns = document.querySelectorAll('.dropdown');
        
        this.init();
    }
    
    init() {
        if (!this.toggle) return;
        
        // Toggle mobile menu
        this.toggle.addEventListener('click', () => {
            this.nav.classList.toggle('active');
            this.toggle.classList.toggle('active');
            document.body.style.overflow = this.nav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Handle dropdowns on mobile
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            toggle?.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
                this.nav.classList.remove('active');
                this.toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.nav.classList.remove('active');
                this.toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ================================
// SMOOTH SCROLL
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================
// LAZY LOADING IMAGES
// ================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ================================
// SCROLL ANIMATIONS
// ================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.about-card, .thumb-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => observer.observe(el));
}

// ================================
// CURRENT YEAR IN FOOTER
// ================================
function setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ================================
// HEADER SCROLL EFFECT
// ================================
function initHeaderScroll() {
    const header = document.querySelector('.main-nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// ================================
// INITIALIZE ON DOM LOAD
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const gallery = new Gallery();
    new MobileMenu();

    setCurrentYear();
    initSmoothScroll();
    initLazyLoading();
    initScrollAnimations();
    initHeaderScroll();

    // Add loaded class for CSS animations
    document.body.classList.add('loaded');

    // Pause gallery when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            gallery.stopAutoplay();
        } else {
            gallery.startAutoplay();
        }
    });
});
