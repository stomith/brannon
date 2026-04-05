// ================================
// NAV SCROLL BEHAVIOR
// ================================
function initNavScroll() {
    const nav = document.getElementById('mainNav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
}

// ================================
// MOBILE MENU
// ================================
function initMobileMenu() {
    const btn = document.getElementById('navHamburger');
    const links = document.getElementById('navLinks');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            btn.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
            links.classList.remove('open');
            btn.classList.remove('open');
        }
    });
}

// ================================
// CAROUSEL CLASS
// ================================
class Carousel {
    constructor(options) {
        this.container   = options.container;
        this.dotsEl      = options.dotsEl;
        this.prevBtn     = options.prevBtn || null;
        this.nextBtn     = options.nextBtn || null;
        this.interval    = options.interval || 5000;
        this.dotsVertical = options.dotsVertical || false;

        this.slides      = this.container.querySelectorAll('.hero-slide, .gallery-slide');
        this.current     = 0;
        this.timer       = null;

        if (this.slides.length === 0) return;
        this.buildDots();
        this.bindEvents();
        this.start();
    }

    buildDots() {
        if (!this.dotsEl) return;
        this.slides.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
            // reuse hero-dot class; gallery dots use gallery-dot class
            if (this.dotsEl.id === 'galleryDots') {
                btn.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            }
            btn.setAttribute('aria-label', `Slide ${i + 1}`);
            btn.addEventListener('click', () => { this.goTo(i); this.restart(); });
            this.dotsEl.appendChild(btn);
        });
    }

    dots() { return this.dotsEl ? this.dotsEl.querySelectorAll('button') : []; }

    goTo(n) {
        this.slides[this.current].classList.remove('active');
        this.dots()[this.current]?.classList.remove('active');
        this.current = (n + this.slides.length) % this.slides.length;
        this.slides[this.current].classList.add('active');
        this.dots()[this.current]?.classList.add('active');
    }

    next() { this.goTo(this.current + 1); }
    prev() { this.goTo(this.current - 1); }

    start() {
        this.timer = setInterval(() => this.next(), this.interval);
    }

    stop() { clearInterval(this.timer); }

    restart() { this.stop(); this.start(); }

    bindEvents() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.prev(); this.restart(); });
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.next(); this.restart(); });

        // Touch / swipe
        let startX = 0;
        this.container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        this.container.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 45) { diff > 0 ? this.next() : this.prev(); this.restart(); }
        });

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stop());
        this.container.addEventListener('mouseleave', () => this.start());

        // Pause when tab hidden
        document.addEventListener('visibilitychange', () => {
            document.hidden ? this.stop() : this.start();
        });
    }
}

// ================================
// SCROLL FADE ANIMATIONS
// ================================
function initFadeUp() {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
}

// ================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
                const top = target.getBoundingClientRect().top + window.scrollY - (id === '#hero' ? 0 : navH);
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

// ================================
// YEAR
// ================================
function setCurrentYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

// ================================
// INIT
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initMobileMenu();
    initFadeUp();
    initSmoothScroll();
    setCurrentYear();

    // Hero carousel
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        new Carousel({
            container:  heroCarousel,
            dotsEl:     document.getElementById('heroDots'),
            interval:   5500,
        });
    }

    // Gallery carousel
    const galleryCarousel = document.getElementById('galleryCarousel');
    if (galleryCarousel) {
        new Carousel({
            container: galleryCarousel,
            dotsEl:    document.getElementById('galleryDots'),
            prevBtn:   document.querySelector('.gallery-prev'),
            nextBtn:   document.querySelector('.gallery-next'),
            interval:  4000,
        });
    }
});
