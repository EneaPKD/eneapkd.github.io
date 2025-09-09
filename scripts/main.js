document.addEventListener('DOMContentLoaded', function() {
    // cache DOM elements for better performance
    const sections = document.querySelectorAll('.content-section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('header');
    const contactForm = document.getElementById('contactForm');
    
    // update active navigation link based on scroll position
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }
    
    // initialize smooth scrolling for navigation links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // add scroll effect to header
    function initHeaderScrollEffect() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                header.style.background = 'rgba(255, 255, 255, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
                header.style.background = 'rgba(255, 255, 255, 0.10)';
            }
        });
    }
    
    // handle contact form submission
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('https://formspree.io/f/xdkldazr', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Thank you for your message! I will get back to you soon.');
                    this.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                alert('There was a problem sending your message. Please try again later.');
                console.error('Error:', error);
            });
        });
    }
    
    // adjust content padding to account for fixed header
    function adjustContentPadding() {
        const headerHeight = header.offsetHeight;
        const hero = document.querySelector('.hero');
        
        // adjust hero section padding
        if (hero) {
            hero.style.paddingTop = headerHeight + 'px';
            hero.style.marginTop = '-' + headerHeight + 'px';
        }
        
        // adjust all sections to account for header height
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.scrollMarginTop = headerHeight + 'px';
        });
        
        // update body padding to prevent header overlap
        document.body.style.paddingTop = headerHeight + 'px';
    }
    
    // initialize projects carousel functionality
    function initProjectsCarousel() {
        const projectsContainer = document.querySelector('.projects-container');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.carousel-dots-container');
        
        if (!projectsContainer || !prevBtn || !nextBtn || !dotsContainer) return;
        
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length === 0) return;
        
        let currentIndex = 0;
        let itemsPerView = calculateItemsPerView();
        let cardWidth = projectCards[0].offsetWidth + parseInt(getComputedStyle(projectsContainer).gap);
        
        // calculate how many items are visible based on screen size
        function calculateItemsPerView() {
            if (window.innerWidth <= 576) {
                return 1; // extra small screens
            } else if (window.innerWidth <= 992) {
                return 2; // medium screens
            } else {
                // for larger screens, calculate based on container width
                const containerWidth = projectsContainer.offsetWidth;
                const projectCardWidth = projectCards[0].offsetWidth;
                const gap = parseInt(getComputedStyle(projectsContainer).gap) || 0;
                
                // calculate how many full cards fit with proper spacing
                return Math.floor((containerWidth + gap) / (projectCardWidth + gap));
            }
        }

        // also update the cardWidth calculation to be more precise:
        cardWidth = projectCards[0].offsetWidth + parseInt(getComputedStyle(projectsContainer).gap);
        
        // create dots for carousel navigation
        function createDots() {
            dotsContainer.innerHTML = '';
            const dotsWrapper = document.createElement('div');
            dotsWrapper.className = 'carousel-dots';
            dotsContainer.appendChild(dotsWrapper);
            
            // create one dot per project
            for (let i = 0; i < projectCards.length; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.setAttribute('data-index', i);
                dotsWrapper.appendChild(dot);
            }
            
            addDotEventListeners();
            updateDots();
        }
        
        // add click event listeners to dots
        function addDotEventListeners() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const projectIndex = parseInt(dot.getAttribute('data-index'));
                    scrollToProject(projectIndex);
                });
            });
        }
        
        // update dot states based on current view
        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.remove('active', 'partial');
                
                // highlight dots for the currently visible projects
                if (index >= currentIndex && index < currentIndex + itemsPerView) {
                    dot.classList.add('active');
                }
            });
        }
        
        // scroll to a specific project
        function scrollToProject(index) {
            // ensure we don't scroll past the last project
            const maxIndex = Math.max(0, projectCards.length - itemsPerView);
            currentIndex = Math.min(Math.max(0, index), maxIndex);
            
            const scrollPosition = currentIndex * cardWidth;
            
            projectsContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            updateNavigation();
        }
        
        // update navigation buttons and dots state
        function updateNavigation() {
            const maxIndex = Math.max(0, projectCards.length - itemsPerView);
            
            // update button states
            prevBtn.disabled = currentIndex <= 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            // update dot states
            updateDots();
        }
        
        // handle previous button click
        prevBtn.addEventListener('click', () => {
            if (prevBtn.disabled) return;
            scrollToProject(currentIndex - 1);
        });
        
        // handle next button click
        nextBtn.addEventListener('click', () => {
            if (nextBtn.disabled) return;
            scrollToProject(currentIndex + 1);
        });
        
        // handle scroll events to update navigation
        let scrollTimeout;
        projectsContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // calculate which project is currently in view
                const scrollPos = projectsContainer.scrollLeft;
                const newIndex = Math.round(scrollPos / cardWidth);
                
                if (newIndex !== currentIndex) {
                    currentIndex = newIndex;
                    updateNavigation();
                }
            }, 100);
        });
        
        // handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // recalculate values
                const oldItemsPerView = itemsPerView;
                itemsPerView = calculateItemsPerView();
                cardWidth = projectCards[0].offsetWidth + parseInt(getComputedStyle(projectsContainer).gap);
                
                // adjust current index if needed
                const maxIndex = Math.max(0, projectCards.length - itemsPerView);
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                    scrollToProject(currentIndex);
                } else {
                    updateNavigation();
                }
            }, 250);
        });
        
        // set up initial state
        createDots();
        updateNavigation();
        
        // enable swipe on touch devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        projectsContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        projectsContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // swipe left - go to next project
                const maxIndex = Math.max(0, projectCards.length - itemsPerView);
                if (currentIndex >= maxIndex) return;
                scrollToProject(currentIndex + 1);
            }
            
            if (touchEndX > touchStartX + 50) {
                // swipe right - go to previous project
                if (currentIndex <= 0) return;
                scrollToProject(currentIndex - 1);
            }
        }
    }
    
    // initialize all functionality
    function init() {
        initSmoothScrolling();
        initHeaderScrollEffect();
        initContactForm();
        adjustContentPadding();
        initProjectsCarousel();
        
        // set up scroll events
        window.addEventListener('scroll', updateActiveNav);
        
        // initial calls
        updateActiveNav();
        
        // re-adjust on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                adjustContentPadding();
            }, 250);
        });
    }
    
    // start initialization
    init();
});