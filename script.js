// script.js

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.getElementById('back-to-top');
    // Query all sections that have an ID attribute to be tracked for nav highlighting
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
                // Check if the menu is active AND the click is on a link (not the toggle itself)
                if (navMenu.classList.contains('active') && link.closest('.nav-menu')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        });
    }

    // --- Sticky Navbar & Active Link Highlighting ---
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const navHeight = navbar ? navbar.offsetHeight : 70; // Fallback height

        // Sticky Navbar
        if (navbar && navbar.parentElement) { // Check parentElement exists
            if (scrollY > 50) {
                navbar.parentElement.classList.add('scrolled');
            } else {
                navbar.parentElement.classList.remove('scrolled');
            }
        }

        // Active Nav Link Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            // Adjust offset calculation to trigger highlight slightly earlier
            const sectionTop = section.offsetTop - navHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Check if current scroll position is within the section boundaries
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

         // If scrolled to the very top, activate 'Home'
        if (scrollY < sections[0].offsetTop - navHeight - 50) {
             currentSectionId = 'home';
        }
         // If scrolled to the very bottom, ensure the last section's link is active
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) { // Near bottom
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');

            // Check if the link's href corresponds to the current section ID
            if (linkHref === `#${currentSectionId}`) {
                 // Special handling for CTA button - don't add 'active' class styling
                 if (!link.classList.contains('cta')) {
                    link.classList.add('active');
                 }
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
         if (!slides || slides.length === 0 || !dots || dots.length === 0) return; // Guard clause

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if(dots[i]) dots[i].classList.remove('active'); // Check if dot exists
        });

        currentSlide = (index + slides.length) % slides.length; // Wrap around

        if(slides[currentSlide]) slides[currentSlide].classList.add('active');
        if(dots[currentSlide]) dots[currentSlide].classList.add('active');

        resetInterval(); // Reset auto-play timer on manual interaction
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startInterval() {
        clearInterval(slideInterval); // Clear existing interval
         // Only start if there's more than one slide
        if (slides && slides.length > 1) {
            slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
        }
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
                if (!isNaN(slideIndex)) { // Ensure it's a valid number
                     showSlide(slideIndex);
                }
            });
        });

        // Initial setup
        showSlide(0); // Show the first slide initially
        startInterval(); // Start auto-play
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 10% visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // --- Form Submission Handling (Placeholder) ---
    // const infoRequestForm = document.getElementById('info-request-form');
    
    // if (infoRequestForm) {
        //     infoRequestForm.addEventListener('submit', (e) => {
            //         e.preventDefault();
            //         console.log('Info request form submitted (placeholder).');
            //         // You would typically send form data to a server here using fetch()
            //         alert('Thank you for your request! We will be in touch soon.');
            //         infoRequestForm.reset();
            //     });
            // }
            
    const newsletterForm = document.querySelector('.newsletter-form');

            
    // ========================================================
    // --- NEW: Enroll Now Button & Payment Form Handling ---
    // ========================================================
    // Ensure this code runs primarily on courses.html where these elements exist

    const enrollButtons = document.querySelectorAll('.enroll-button'); // Buttons with class="enroll-button"
    const paymentFormSection = document.getElementById('payment-form-section'); // The section holding the iframe
    const closeFormButton = document.getElementById('close-form-button'); // Optional close button

    // Check if the necessary elements for this feature exist on the current page
    if (enrollButtons.length > 0 && paymentFormSection) {
        enrollButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault(); // Stop link navigation if href="#"

                // Show the payment form section
                paymentFormSection.style.display = 'block';

                // Scroll down to the form smoothly
                paymentFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Reminder: Make sure your Google Form asks which course the user is enrolling for,
                // as all 'Enroll Now' buttons currently lead to this single form instance.
            });
        });

        // Add event listener for the close button (if it exists)
        if (closeFormButton) {
            closeFormButton.addEventListener('click', function() {
                paymentFormSection.style.display = 'none'; // Hide the form section

                // Optional: Scroll back up to the top of the courses list
                // const coursesPageSection = document.getElementById('courses-page');
                // if (coursesPageSection) {
                //    coursesPageSection.scrollIntoView({ behavior: 'smooth' });
                // }
            });
        }
    }
    // --- End of Enroll Now Button Handling ---

    // --- Check URL hash to auto-display payment form ---
if (window.location.hash === '#payment-form-section' && paymentFormSection) {
    paymentFormSection.style.display = 'block';
    paymentFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

     if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            console.log(`Newsletter subscription attempt for: ${emailInput ? emailInput.value : 'N/A'} (placeholder).`);
             // You would typically send form data to a server here using fetch()
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        });
    }

}); // End DOMContentLoaded
