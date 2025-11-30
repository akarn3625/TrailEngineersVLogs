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
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');

function changeSlide(index) {
    if (!animationsReady) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Only trigger animations for slide changes after initial load
    if (pageLoaded) {
        triggerSideAnimations();
    }
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
            640: { slidesPerView: 'auto', spaceBetween: 24 },
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

// ===== EXPO SECTIONS =====
// Background slider for Expo 2022
let currentExpoBg = 0;
const expoBgSlides = document.querySelectorAll('#testimonials .expo-background .bg-slide');

function changeExpoBg() {
    if (expoBgSlides.length > 0) {
        expoBgSlides[currentExpoBg].classList.remove('active');
        currentExpoBg = (currentExpoBg + 1) % expoBgSlides.length;
        expoBgSlides[currentExpoBg].classList.add('active');
    }
}

if (expoBgSlides.length > 1) {
    setInterval(changeExpoBg, 6000);
}

// Background slider for Expo 2024
let currentExpoBg2024 = 0;
const expoBgSlides2024 = document.querySelectorAll('#expo-2024 .expo-background .bg-slide');

function changeExpoBg2024() {
    if (expoBgSlides2024.length > 0) {
        expoBgSlides2024[currentExpoBg2024].classList.remove('active');
        currentExpoBg2024 = (currentExpoBg2024 + 1) % expoBgSlides2024.length;
        expoBgSlides2024[currentExpoBg2024].classList.add('active');
    }
}

if (expoBgSlides2024.length > 1) {
    setInterval(changeExpoBg2024, 6000);
}

// Expo 2022 dropdown handlers
const expoEventsContainer = document.getElementById('expoEventsContainer');
const expoEventsDropdown = document.getElementById('expoEventsDropdown');

if (expoEventsContainer && expoEventsDropdown) {
    let isExpoDropdownOpen = false;

    expoEventsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropdown-item')) return;
        
        e.stopPropagation();
        isExpoDropdownOpen = !isExpoDropdownOpen;
        expoEventsDropdown.classList.toggle('active', isExpoDropdownOpen);
    });

    document.addEventListener('click', function(e) {
        if (expoEventsContainer && !expoEventsContainer.contains(e.target)) {
            isExpoDropdownOpen = false;
            expoEventsDropdown.classList.remove('active');
        }
    });
}

// Expo 2024 dropdown handlers
const expoEventsContainer2024 = document.getElementById('expoEventsContainer2024');
const expoEventsDropdown2024 = document.getElementById('expoEventsDropdown2024');

if (expoEventsContainer2024 && expoEventsDropdown2024) {
    let isExpoDropdownOpen2024 = false;

    expoEventsContainer2024.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropdown-item')) return;
        
        e.stopPropagation();
        isExpoDropdownOpen2024 = !isExpoDropdownOpen2024;
        expoEventsDropdown2024.classList.toggle('active', isExpoDropdownOpen2024);
    });

    document.addEventListener('click', function(e) {
        if (expoEventsContainer2024 && !expoEventsContainer2024.contains(e.target)) {
            isExpoDropdownOpen2024 = false;
            expoEventsDropdown2024.classList.remove('active');
        }
    });
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

// ===== CHATBOT =====
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const notificationBadge = document.querySelector('.notification-badge');

let isFirstMessage = true;
let userContactInfo = { name: '', email: '', phone: '', message: '' };

chatButton.addEventListener('click', () => {
    if (chatWindow.classList.contains('active')) {
        chatWindow.classList.add('closing');
        setTimeout(() => {
            chatWindow.classList.remove('active', 'closing');
            chatButton.classList.remove('active');
        }, 400);
    } else {
        chatWindow.classList.add('active');
        chatButton.classList.add('active');
        
        if (isFirstMessage) {
            setTimeout(() => {
                sendBotMessage();
                isFirstMessage = false;
                if (notificationBadge) notificationBadge.style.display = 'none';
            }, 500);
        }
    }
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.add('closing');
    setTimeout(() => {
        chatWindow.classList.remove('active', 'closing');
        chatButton.classList.remove('active');
    }, 400);
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    addMessage(message, 'user');
    chatInput.value = '';
    typingIndicator.classList.add('active');

    setTimeout(() => {
        typingIndicator.classList.remove('active');
        respondToMessage(message);
    }, 1500);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function respondToMessage(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        addMessage("Hello! How can I help you today?", 'bot');
        setTimeout(() => addContactOptions(), 1000);
    } else if (lowerMessage.includes('hours') || lowerMessage.includes('time') || lowerMessage.includes('open')) {
        addMessage("Our business hours are Monday to Friday, 9:00 AM - 6:00 PM (NPT). We're closed on weekends and public holidays.", 'bot');
        setTimeout(() => addContactOptions(), 1000);
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
        addMessage("You can reach us at info.engineersvlogs@gmail.com or visit us at Bafal, Kathmandu, Nepal.", 'bot');
        setTimeout(() => addContactOptions(), 1000);
    } else if (lowerMessage.includes('service') || lowerMessage.includes('training') || lowerMessage.includes('program')) {
        addMessage("We offer Robotics Training, STEAM Education, Engineering Media, Software Training, Civil Engineering Training, and Digital Marketing services.", 'bot');
        setTimeout(() => addContactOptions(), 1000);
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        addMessage("You're welcome! Feel free to reach out if you have any other questions. 😊", 'bot');
        setTimeout(() => addContactOptions(), 1000);
    } else {
        addMessage("I'd love to help you with that! Let me connect you with our team.", 'bot');
        setTimeout(() => addContactOptions(), 1000);
    }
}

function sendBotMessage() {
    addMessage("👋 Hello! Welcome to Engineers Vlogs!", 'bot');
    setTimeout(() => {
        addMessage("Our business hours are Monday to Friday, 9:00 AM - 6:00 PM (Nepal Time).", 'bot');
    }, 1000);
    setTimeout(() => {
        addMessage("Our team will be happy to assist you! How can we help you today?", 'bot');
        addQuickActions();
    }, 2000);
}

function addContactOptions() {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'message bot-message';
    optionsDiv.innerHTML = `
        <div class="message-content"><strong>Choose how to continue:</strong></div>
        <div class="contact-actions">
            <a href="#" class="contact-action-btn whatsapp" onclick="openWhatsApp(); return false;">
                <i class="ri-whatsapp-line"></i> WhatsApp
            </a>
            <a href="mailto:akarn3625@gmail.com?subject=Website%20Inquiry&body=Hello%20Engineers%20Vlogs%20Team,%0D%0A%0D%0AI%20am%20contacting%20you%20from%20the%20website%20chatbot.%20%0D%0A%0D%0ARegards,%0D%0A" class="contact-action-btn email">
                <i class="ri-mail-line"></i> Email Us
            </a>
        </div>
        <div class="quick-actions">
            <button class="quick-action-btn" onclick="showContactForm()">📋 Leave Your Details</button>
        </div>
    `;
    chatBody.appendChild(optionsDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showContactForm() {
    const formDiv = document.createElement('div');
    formDiv.className = 'message bot-message';
    formDiv.innerHTML = `
        <div class="contact-form-container">
            <h4>📝 Leave Your Contact Details</h4>
            <form id="contactForm" onsubmit="submitContactForm(event)">
                <div class="form-group"><label>Your Name *</label><input type="text" id="userName" required placeholder="Enter your name"></div>
                <div class="form-group"><label>Email Address *</label><input type="email" id="userEmail" required placeholder="your@email.com"></div>
                <div class="form-group"><label>Phone Number</label><input type="tel" id="userPhone" placeholder="+977 98XXXXXXXX"></div>
                <div class="form-group"><label>Your Message *</label><textarea id="userMessage" required placeholder="What can we help you with?"></textarea></div>
                <button type="submit" class="form-submit-btn"><i class="ri-send-plane-fill"></i> Send Details</button>
            </form>
        </div>
    `;
    chatBody.appendChild(formDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function submitContactForm(event) {
    event.preventDefault();
    
    userContactInfo.name = document.getElementById('userName').value;
    userContactInfo.email = document.getElementById('userEmail').value;
    userContactInfo.phone = document.getElementById('userPhone').value;
    userContactInfo.message = document.getElementById('userMessage').value;
    
    const successDiv = document.createElement('div');
    successDiv.className = 'message bot-message';
    successDiv.innerHTML = `
        <div class="success-message">
            <i class="ri-checkbox-circle-line"></i>
            <p><strong>Thank you, ${userContactInfo.name}!</strong></p>
            <p>We've received your details. Our team will contact you within 24 hours during business hours.</p>
        </div>
    `;

    try {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxJ1ePAc5y3GburBmFVphLGrEg4tBQ-7LI0S6Diclw5C2yJSvtjQ9mYbywJtzQRsxzB/exec';
        fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                name: userContactInfo.name,
                email: userContactInfo.email,
                phone: userContactInfo.phone,
                message: userContactInfo.message,
                source: 'chatbot'
            })
        }).catch(err => console.error('Submission failed', err));
    } catch (e) {
        console.error('Submission error', e);
    }
    
    chatBody.appendChild(successDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    setTimeout(() => {
        addMessage("In the meantime, feel free to explore our services on the website or reach out directly via WhatsApp/Email!", 'bot');
    }, 1500);
}

function openWhatsApp() {
    const phoneNumber = "9779864215769";
    const message = "Hi! I was chatting on your website and I'm interested in learning more about Engineers Vlogs services.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    addMessage("Great! Opening WhatsApp for you... 💬", 'bot');
}

function addQuickActions() {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message bot-message';
    const quickActionsDiv = document.createElement('div');
    quickActionsDiv.className = 'quick-actions';
    
    ['Business Hours', 'Our Services', 'Contact Us'].forEach(action => {
        const button = document.createElement('button');
        button.className = 'quick-action-btn';
        button.textContent = action;
        button.onclick = () => {
            chatInput.value = action;
            sendMessage();
        };
        quickActionsDiv.appendChild(button);
    });
    
    actionsDiv.appendChild(quickActionsDiv);
    chatBody.appendChild(actionsDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
