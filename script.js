document.addEventListener('DOMContentLoaded', () => {

    // =========================================
// 1. FIXED CINEMATIC PRELOADER
// =========================================
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");

    // Remove the loading class so animations + video can play
    document.body.classList.remove("loading");

    // Allow scrolling again
    document.body.style.overflow = "auto";

    // Fade out + remove preloader
    preloader.style.opacity = "0";
    preloader.style.pointerEvents = "none";

    setTimeout(() => {
        preloader.style.display = "none";
    }, 800);
});


    // =========================================
    // 2. SCROLL REVEAL ENGINE (INTERSECTION OBSERVER)
    // =========================================
    // This watches elements and adds the 'active-reveal' class when they enter the screen
    const revealObserverOptions = {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target); // Play animation only once
            }
        });
    }, revealObserverOptions);

    // Target all animatable elements
    const revealElements = document.querySelectorAll(
        '.reveal-text, .reveal-up, .reveal-left, .reveal-right, .bento-box, .price-card, .section-title, .tagline'
    );
    
    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================
    // 3. UI STATE MANAGEMENT (NAVBAR & RIBBON)
    // =========================================
    const nav = document.getElementById('main-nav');
    const ribbon = document.getElementById('sticky-ribbon');
    const closeRibbon = document.querySelector('.close-ribbon');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.menu-list a');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // 1. Glass Navbar Effect
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // 2. Sticky Ribbon Reveal (Show after Hero section)
        if (scrollY > window.innerHeight * 0.8) {
            ribbon?.classList.add('visible');
        } else {
            ribbon?.classList.remove('visible');
        }

        // 3. Active Link Highlighter
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // logic to detect which section is currently centered on screen
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    });

    // Close Ribbon Logic
    if (closeRibbon) {
        closeRibbon.addEventListener('click', () => {
            ribbon.style.display = 'none';
        });
    }

    // =========================================
    // 4. 3D TILT PHYSICS (PREMIUM EFFECT)
    // =========================================
    // Applies a 3D rotation to Cards and Bento Boxes based on mouse position
    const tiltElements = document.querySelectorAll('.price-card, .bento-box');

    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile for performance

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // X position within element
            const y = e.clientY - rect.top;  // Y position within element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (Max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -8; 
            const rotateY = ((x - centerX) / centerX) * 8;

            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Move inner glow/shine if CSS supports it
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // =========================================
    // 5. HERO PARALLAX (MOUSE MOVEMENT)
    // =========================================
    const heroSection = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('#bg-video');

    if (heroSection && window.innerWidth > 1024) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 90;
            const y = (window.innerHeight - e.pageY * 2) / 90;
            
            // Text moves opposite to mouse
            if(heroContent) heroContent.style.transform = `translateX(${x}px) translateY(${y}px)`;
            
            // Background moves slightly with mouse (depth effect)
            if(heroVideo) heroVideo.style.transform = `translate(-50%, -50%) scale(1.1) translateX(${-x/2}px) translateY(${-y/2}px)`;
        });
    }

    // =========================================
    // 6. SMOOTH SCROLLING (ANCHOR LINKS)
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // =========================================
    // 7. WHATSAPP BOOKING LOGIC
    // =========================================
    const ownerNumber = "918870842827"; 

    document.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find parent card to get details
            const card = e.target.closest('.price-card');
            if (card) {
                const packageName = card.querySelector('h3').innerText;
                const price = card.querySelector('.price').innerText;
                
                // Format message
                const message = `Hi Studio 91! 👋 I am interested in booking the *${packageName}* (${price}). Is this date available?`;
                const url = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(message)}`;
                
                window.open(url, '_blank');
            } else {
                // Fallback for generic buttons
                window.open(`https://wa.me/${ownerNumber}`, '_blank');
            }
        });
    });

    // =========================================
    // 8. SIDEBAR INTERACTION
    // =========================================
    // Make social icons in sidebar bounce slightly on load
    const sidebarIcons = document.querySelectorAll('.social-icons-vertical a');
    sidebarIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => icon.style.transform = 'scale(1)', 200);
        }, 2500 + (index * 200)); // Start after preloader
    });

});