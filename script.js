document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations (fade-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // Network Canvas Background Implementation
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        // Setup canvas size
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        window.addEventListener('resize', resize);
        
        // Mouse interaction for hidden depth
        let mouse = { x: null, y: null, radius: 180 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Calm, slow structured movement
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2 + 0.5;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges to maintain structural integrity
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(44, 53, 57, 0.25)'; // Clearer slate dots
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Structural density
            let numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateNetwork() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Strong internal connections
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 110) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(44, 53, 57, ${0.2 * (1 - distance/110)})`; // Clearer slate internal lines
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                // Hidden depth (connecting to mouse with glowing yellow accent)
                if (mouse.x != null && mouse.y != null) {
                    const dxMouse = particles[i].x - mouse.x;
                    const dyMouse = particles[i].y - mouse.y;
                    const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                    
                    if (distanceMouse < mouse.radius) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 192, 0, ${0.3 * (1 - distanceMouse/mouse.radius)})`; // Banana yellow hidden depth
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                        
                        // Very subtle gravitation towards mysterious depth (mouse core)
                        particles[i].x -= dxMouse * 0.003;
                        particles[i].y -= dyMouse * 0.003;
                    }
                }
            }
            requestAnimationFrame(animateNetwork);
        }
        
        resize();
        animateNetwork();
    }
});
