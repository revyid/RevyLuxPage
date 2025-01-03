        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Loading Animation
        window.addEventListener('load', () => {
            const loader = document.querySelector('.loader');
            loader.classList.add('hidden');
        });

        // Create Particles
        function createParticles() {
            const container = document.querySelector('.particles-container');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random size between 2 and 6px
                const size = Math.random() * 4 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random position
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Random animation
                const duration = Math.random() * 10 + 10;
                const delay = Math.random() * 5;
                particle.style.animation = `float ${duration}s ${delay}s infinite alternate`;
                
                container.appendChild(particle);
            }
        }

        // Initialize particles
        createParticles();

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        const header = document.getElementById('header');
        const hero = document.querySelector('.hero');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Scroll Effects
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Header transform
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hero shrink effect
            if (currentScroll > 0) {
                hero.classList.add('scrolled');
            } else {
                hero.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });

        // GSAP Animations
        // Header fade in
        gsap.from('.header', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });

        // Hero content animation
        gsap.from('.hero-content > *', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power4.out'
        });

        // Scroll Animations
        gsap.utils.toArray('.package-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power4.out'
            });
        });

        gsap.utils.toArray('.feature-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power4.out'
            });
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
<script type="module">
    import { updateAndDisplayViews, calculateUptime } from "./static/js/activity.js";

    // Panggil fungsi untuk memperbarui dan menampilkan views
    updateAndDisplayViews("totalViews");

    // Panggil fungsi untuk menghitung dan menampilkan uptime
    calculateUptime("uptime");
