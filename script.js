// script.js

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('section[id]');
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    // --- Mobile Menu Toggle ---
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        });
    }

    // --- Sticky Navbar & Active Link Highlighting ---
    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Sticky Navbar
        if (navbar) {
            if (scrollY > 50) {
                navbar.parentElement.classList.add('scrolled'); // Add scrolled class to header
            } else {
                navbar.parentElement.classList.remove('scrolled');
            }
        }

        // Active Nav Link Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 50; // Adjusted offset
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section OR if it's the home link and we are near the top
            if (link.getAttribute('href') === `#${currentSectionId}` || (currentSectionId === '' && scrollY < 200 && link.getAttribute('href') === '#home')) {
                link.classList.add('active');
            }
             // Highlight 'Enroll Now' if enrollment section is active
            if (currentSectionId === 'enrollment' && link.classList.contains('cta')) {
                // Keep the default CTA style, don't add 'active' underline style
            } else if (link.getAttribute('href') === `#${currentSectionId}`) {
                 link.classList.add('active');
            }
        });


        // Back to Top Button Visibility
        if (backToTopButton) {
            if (scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // --- Back to Top Button Click ---
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Testimonial Slider ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });

        currentSlide = (index + slides.length) % slides.length; // Wrap around

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        resetInterval(); // Reset auto-play timer on manual interaction
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startInterval() {
        clearInterval(slideInterval); // Clear existing interval before starting new one
         slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }


    if (slides.length > 0 && dots.length > 0 && prevBtn && nextBtn) {
        // Event Listeners for buttons
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Event Listeners for dots
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                showSlide(slideIndex);
            });
        });

        // Initial setup
        showSlide(0); // Show the first slide initially
        startInterval(); // Start auto-play
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: Stop observing once visible
            }
            // Optional: Remove 'visible' class if element scrolls out of view
            // else {
            //     entry.target.classList.remove('visible');
            // }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // --- Form Submission Handling (Placeholder) ---
    const infoRequestForm = document.getElementById('info-request-form');
    const newsletterForm = document.querySelector('.newsletter-form'); // Select by class

    if (infoRequestForm) {
        infoRequestForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission
            console.log('Info request form submitted (placeholder).');
            // Add validation or actual submission logic here (e.g., using fetch)
            alert('Thank you for your request! We will be in touch soon.'); // Simple feedback
            infoRequestForm.reset(); // Clear the form
        });
    }

     if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            console.log(`Newsletter subscription attempt for: ${emailInput.value} (placeholder).`);
            // Add validation or actual submission logic here
            alert('Thank you for subscribing to our newsletter!'); // Simple feedback
            newsletterForm.reset(); // Clear the form
        });
    }


}); // End DOMContentLoaded