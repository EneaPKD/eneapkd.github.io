document.addEventListener('DOMContentLoaded', function() {
    // adds scroll functionality to content, hero, and nav sections
    const sections = document.querySelectorAll('.content-section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // update active nav link based on scroll position
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
    
    window.addEventListener('scroll', updateActiveNav);
    
    // smooth scrolling for nav links
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
    
    // header styling on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(255, 255, 255, 0.10)';
        }
    });
    
    // contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
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
    
    // initialize projects carousel
    function initProjectsCarousel() {
        const projectsContainer = document.querySelector('.projects-container');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.carousel-dots-container');
        
        if (!projectsContainer || !prevBtn || !nextBtn || !dotsContainer) return;
        
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length === 0) return;
        
        const cardWidth = projectCards[0].offsetWidth + 32;
        let scrollPosition = 0;
        const visibleCards = 3;
        
        // create dots for carousel navigation
        function createDots() {
            dotsContainer.innerHTML = '';
            const dotsWrapper = document.createElement('div');
            dotsWrapper.className = 'carousel-dots';
            dotsContainer.appendChild(dotsWrapper);
            
            for (let i = 0; i < projectCards.length; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.setAttribute('data-index', i);
                dotsWrapper.appendChild(dot);
            }
            
            addDotEventListeners();
        }
        
        // add click event listeners to dots
        function addDotEventListeners() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const projectIndex = parseInt(dot.getAttribute('data-index'));
                    centerProject(projectIndex);
                });
            });
        }
        
        // update navigation buttons and dots state
        function updateNavigation() {
            const maxScroll = projectsContainer.scrollWidth - projectsContainer.clientWidth;
            
            prevBtn.disabled = scrollPosition <= 0;
            nextBtn.disabled = scrollPosition >= maxScroll;
            
            const centerPoint = scrollPosition + (projectsContainer.clientWidth / 2);
            const centerProjectIndex = Math.floor(centerPoint / cardWidth);
            
            let startIndex = Math.max(0, centerProjectIndex - 1);
            let endIndex = Math.min(projectCards.length - 1, centerProjectIndex + 1);
            
            if (startIndex === 0) {
                endIndex = Math.min(2, projectCards.length - 1);
            } else if (endIndex === projectCards.length - 1) {
                startIndex = Math.max(projectCards.length - 3, 0);
            }
            
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                
                if (index >= startIndex && index <= endIndex) {
                    dot.classList.add('active');
                }
            });
        }
        
        // center a specific project in the view
        function centerProject(index) {
            const targetPosition = index * cardWidth;
            const maxScroll = projectsContainer.scrollWidth - projectsContainer.clientWidth;
            
            scrollPosition = Math.max(0, Math.min(targetPosition, maxScroll));
            
            projectsContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            updateNavigation();
        }
        
        // handles previous button
        prevBtn.addEventListener('click', () => {
            if (prevBtn.disabled) return;
            scrollPosition = Math.max(0, scrollPosition - cardWidth);
            
            projectsContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            setTimeout(updateNavigation, 300);
        });
        
        // handles next button
        nextBtn.addEventListener('click', () => {
            const maxScroll = projectsContainer.scrollWidth - projectsContainer.clientWidth;
            if (nextBtn.disabled) return;
            scrollPosition = Math.min(maxScroll, scrollPosition + cardWidth);
            
            projectsContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            setTimeout(updateNavigation, 300);
        });
        
        // handle scroll events to update navigation
        projectsContainer.addEventListener('scroll', () => {
            scrollPosition = projectsContainer.scrollLeft;
            updateNavigation();
        });
        
        // handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const newCardWidth = projectCards[0].offsetWidth + 32;
                const currentProject = Math.round(scrollPosition / cardWidth);
                scrollPosition = currentProject * newCardWidth;
                
                projectsContainer.scrollTo({
                    left: scrollPosition,
                    behavior: 'auto'
                });
                
                updateNavigation();
            }, 250);
        });
        
        // set up dots and initial nav state
        createDots();
        updateNavigation();
    }
    
    // start the projects carousel functionality
    initProjectsCarousel();
    
    // initialize active navigation
    updateActiveNav();
});