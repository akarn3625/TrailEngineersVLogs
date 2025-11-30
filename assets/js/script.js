// ===== PAGE LOAD SEQUENCE - COORDINATED TIMING =====
let pageLoaded = false;
let animationsReady = false;

// Fix viewport height for mobile browsers
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Coordinated page load sequence
window.addEventListener('load', function() {
    // Step 1: Remove loading overlay (500ms)
    setTimeout(function() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        pageLoaded = true;
        
        // Mark the first slide as loaded (no animate class)
        const firstSlide = document.querySelector('.slide.active');
        if (firstSlide) {
            firstSlide.setAttribute('data-loaded', 'true');
        }
    }, 500);

    // Step 2: Initialize hero animations (800ms - after overlay is gone)
    setTimeout(function() {
        initializeHeroAnimations();
        animationsReady = true;
    }, 800);

    // Step 3: Start autoplay (3000ms - after everything is settled)
    setTimeout(() => {
        if (slides.length > 1) {
            setInterval(autoSlide, 5000);
        }
    }, 3000);
});

// Initialize hero animations properly
function initializeHeroAnimations() {
    const socialLinks = document.querySelector('.social-links');
    const firstSlide = document.querySelector('.slide.active');
    
    if (socialLinks) {
        // Force social links to be visible immediately
        socialLinks.style.opacity = '1';
        socialLinks.style.visibility = 'visible';
        socialLinks.style.animation = 'fadeInRight 0.8s ease-out forwards';
    }
    
    // Ensure first slide content is visible
    if (firstSlide) {
        const slideContent = firstSlide.querySelector('.slide-content');
        if (slideContent) {
            slideContent.style.opacity = '1';
            slideContent.style.transform = 'translateY(0)';
        }
    }
}

// ===== HEADER LOGO MANAGEMENT =====
const headerLogo = document.querySelector('.header-logo');
const independentLogo = document.querySelector('.independent-logo');
const heroSection = document.querySelector('.hero-slider');
const header = document.querySelector('header');

// Initialize header state
function initializeHeaderState() {
    if (!heroSection) return;
    
    const heroHeight = heroSection.offsetHeight;
    const scrollPosition = window.scrollY;
    const pastHero = scrollPosition > heroHeight - 100;
    
    // Set initial states without animation
    if (headerLogo) {
        if (pastHero) {
            headerLogo.classList.add('visible');
        } else {
            headerLogo.classList.remove('visible');
        }
    }
    
    // Set header visibility
    if (header) {
        if (scrollPosition > 100) {
            header.classList.add('header-visible');
        }
    }
}

// Initialize on load (after a brief delay to prevent flashing)
window.addEventListener('load', function() {
    setTimeout(initializeHeaderState, 100);
});

// Observe hero visibility for independent logo
if (independentLogo && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                independentLogo.classList.add('is-visible');
            } else {
                independentLogo.classList.remove('is-visible');
            }
        });
    }, { 
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px'
    });

    // Start observing after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            heroObserver.observe(heroSection);
        }, 200);
    });
}

function toggleHeaderLogo() {
    if (!heroSection || !pageLoaded) return;

    const heroHeight = heroSection.offsetHeight;
    const scrollPosition = window.scrollY;
    const pastHero = scrollPosition > heroHeight - 100;

    if (headerLogo) {
        if (pastHero) {
            headerLogo.classList.add('visible');
        } else {
            headerLogo.classList.remove('visible');
        }
    }
}

// ===== HEADER SCROLL BEHAVIOR =====
let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', function() {
    // Debounce scroll events slightly
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(function() {
        if (!pageLoaded) return;
        
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        toggleHeaderLogo();
        
        // Header hide/show on scroll
        if (st > lastScrollTop && st > 100) {
            header.classList.remove('header-visible');
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }
        lastScrollTop = st <= 0 ? 0 : st;
    }, 10);
});

// ===== HERO SLIDER =====
// ===== HERO SLIDER =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');

function changeSlide(index) {
    // Don't allow slide changes until animations are ready
    if (!animationsReady) return;
    
    const previousSlide = currentSlide;
    
    // Remove active and animate classes from current slide
    slides[currentSlide].classList.remove('active', 'animate');
    dots[currentSlide].classList.remove('active');

    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    // Add active class first
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Check if this slide has been loaded before
    const isFirstLoadOfSlide = !slides[currentSlide].getAttribute('data-loaded');
    
    if (isFirstLoadOfSlide) {
        // First time showing this slide - mark as loaded
        slides[currentSlide].setAttribute('data-loaded', 'true');
    }
    
    // Always add animate class for slide transitions (except the very first slide on page load)
    setTimeout(() => {
        slides[currentSlide].classList.add('animate');
        triggerSideAnimations();
    }, 50);
}

function triggerSideAnimations() {
    const socialLinks = document.querySelector('.social-links');

    if (socialLinks) {
        // Reset and replay animation
        socialLinks.style.animation = 'none';
        
        // Force reflow
        void socialLinks.offsetWidth;
        
        // Reapply animation
        socialLinks.style.animation = 'fadeInRight 0.8s ease-out forwards';
    }
}

function autoSlide() {
    if (!animationsReady) return;
    let next = (currentSlide + 1) % slides.length;
    changeSlide(next);
}
// ===== MOBILE MENU =====
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const navDropdown = document.querySelector('.nav-dropdown');
    const isActive = navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active');
    
    if (!isActive && navDropdown) {
        navDropdown.classList.remove('active');
    }
}

// Dropdown Toggle
const dropdownToggle = document.querySelector('.dropdown-toggle');
const navDropdown = document.querySelector('.nav-dropdown');

if (dropdownToggle && navDropdown) {
    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (window.innerWidth <= 768) {
            e.stopPropagation();
            navDropdown.classList.toggle('active');
        }
    });

    const dropdownLinks = document.querySelectorAll('nav .dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    navDropdown.classList.remove('active');
                    document.getElementById('navMenu').classList.remove('active');
                }, 100);
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (navDropdown && !navDropdown.contains(e.target)) {
                navDropdown.classList.remove('active');
            }
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navDropdown.classList.remove('active');
        }
    });
}

// Close menu when clicking nav links
document.querySelectorAll('.nav-center a:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            document.getElementById('navMenu').classList.remove('active');
            if (navDropdown) {
                navDropdown.classList.remove('active');
            }
        }
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const navMenu = document.getElementById('navMenu');
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// ===== COUNTER ANIMATIONS =====
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

function animateCounterWithDecimal(element, target, suffix) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = '2.5' + suffix + '+';
            clearInterval(timer);
        } else {
            const displayValue = (current / 1000000).toFixed(1);
            element.textContent = displayValue + suffix;
        }
    }, 20);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = document.querySelectorAll('.about-stats-container .stat-item h2');
            if (statItems.length >= 4) {
                animateCounter(statItems[0], 59000);
                animateCounterWithDecimal(statItems[1], 2500000, 'M');
                animateCounter(statItems[2], 255);
                animateCounter(statItems[3], 115);
            }
            counterObserver.disconnect();
        }
    });
}, {
    threshold: 0.2
});

const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
    counterObserver.observe(aboutSection);
}

// ===== SWIPER INITIALIZATION =====
if (document.querySelector('.services-swiper')) {
    const swiperServices = new Swiper('.services-swiper', {
        loop: true,
        spaceBetween: 32,
        slidesPerView: 'auto',
        grabCursor: true,
        speed: 600,
        centeredSlides: false,
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: '1.5', spaceBetween: 24 },
            1024: { slidesPerView: 'auto', spaceBetween: 32 }
        }
    });
}

// ===== PARTNERS MARQUEE =====
const partnerTracks = document.querySelectorAll('.partners__content');
partnerTracks.forEach(track => {
    const cards = [...track.children];
    for (const card of cards) {
        track.appendChild(card.cloneNode(true));
    }
});

// ===== Expo section ====== //
// Background slideshow for single Expo section
let currentExpoBg = 0;
const expoBgSlides = document.querySelectorAll('.expo-background .bg-slide');

function changeExpoBg() {
    if (expoBgSlides.length > 0) {
        expoBgSlides[currentExpoBg].classList.remove('active');
        currentExpoBg = (currentExpoBg + 1) % expoBgSlides.length;
        expoBgSlides[currentExpoBg].classList.add('active');
    }
}

// Change background every 4 seconds
if (expoBgSlides.length > 1) {
    setInterval(changeExpoBg, 4000);
}

// Dropdown navigation handlers
const expoDropdownItems = document.querySelectorAll('.dropdown-item');
expoDropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.stopPropagation();
        const link = this.getAttribute('data-link');
        if (link) window.location.href = link;
    });
});

const expoHighlightsContainer = document.getElementById('expoHighlightsContainer');
const expoPartnersContainer = document.getElementById('expoPartnersContainer');
const expoHighlightsContainer2024 = document.getElementById('expoHighlightsContainer2024');
const expoPartnersContainer2024 = document.getElementById('expoPartnersContainer2024');

if (expoHighlightsContainer) {
    expoHighlightsContainer.addEventListener('click', function() {
        const link = this.getAttribute('data-link');
        if (link) window.location.href = link;
    });
}

if (expoPartnersContainer) {
    expoPartnersContainer.addEventListener('click', function() {
        const link = this.getAttribute('data-link');
        if (link) window.location.href = link;
    });
}

if (expoHighlightsContainer2024) {
    expoHighlightsContainer2024.addEventListener('click', function() {
        const link = this.getAttribute('data-link');
        if (link) window.location.href = link;
    });
}

if (expoPartnersContainer2024) {
    expoPartnersContainer2024.addEventListener('click', function() {
        const link = this.getAttribute('data-link');
        if (link) window.location.href = link;
    });
}

document.querySelectorAll('.learn-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'assets/Extra HTMLs/serviceslearnmore.html'; // put your link here
    });
});
