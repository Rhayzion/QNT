
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize GSAP plugins
            gsap.registerPlugin(ScrollTrigger);
            
            // =============================================
            // 1. LENIS SMOOTH SCROLL WITH HAPTIC FEEDBACK
            // =============================================
            const lenis = new Lenis({
                lerp: 0.1,
                smoothWheel: true,
                syncTouch: true
            });

            // RAF loop for smooth scrolling
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            // Haptic feedback on section enter
            const sections = document.querySelectorAll('section');
            let lastActiveIndex = -1;

            lenis.on('scroll', ({ scroll }) => {
                const viewportMiddle = scroll + window.innerHeight / 2;
                
                sections.forEach((section, index) => {
                    const rect = section.getBoundingClientRect();
                    const sectionTop = scroll + rect.top;
                    const sectionBottom = scroll + rect.bottom;
                    
                    if (viewportMiddle > sectionTop && viewportMiddle < sectionBottom) {
                        if (index !== lastActiveIndex) {
                            // Trigger haptic on mobile
                            if ('vibrate' in navigator && window.innerWidth < 768) {
                                navigator.vibrate(30);
                            }
                            lastActiveIndex = index;
                        }
                    }
                });
                
                // Header scroll effect
                const header = document.getElementById('header');
                if (scroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // =============================================
            // 2. VOICE NAVIGATION SYSTEM
            // =============================================
            const voiceBtn = document.getElementById('voice-btn');
            const voiceFeedback = document.getElementById('voice-feedback');
            let recognition;

            if ('webkitSpeechRecognition' in window) {
                recognition = new webkitSpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;

                recognition.onstart = () => {
                    voiceBtn.innerHTML = '<i class="fas fa-circle" style="color: #ff6b6b;"></i>';
                    voiceFeedback.style.display = 'block';
                    gsap.to(voiceBtn, {
                        scale: 1.2,
                        duration: 0.3
                    });
                };

                recognition.onend = () => {
                    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                    gsap.to(voiceBtn, {
                        scale: 1,
                        duration: 0.3
                    });
                    setTimeout(() => voiceFeedback.style.display = 'none', 2000);
                };

                recognition.onresult = (event) => {
                    const command = event.results[0][0].transcript.toLowerCase();
                    
                    // Visual feedback
                    const feedback = document.createElement('div');
                    feedback.textContent = `Heard: "${command}"`;
                    feedback.style.position = 'absolute';
                    feedback.style.bottom = '70px';
                    feedback.style.right = '0';
                    feedback.style.background = 'rgba(255,255,255,0.1)';
                    feedback.style.padding = '0.5rem 1rem';
                    feedback.style.borderRadius = '20px';
                    voiceFeedback.appendChild(feedback);
                    
                    gsap.from(feedback, { y: 20, opacity: 0, duration: 0.3 });
                    gsap.to(feedback, {
                        y: -10,
                        opacity: 0,
                        delay: 2,
                        duration: 0.5,
                        onComplete: () => feedback.remove()
                    });

                    // Process voice commands
                    if (command.includes('feature')) {
                        lenis.scrollTo('#features', { duration: 1.5 });
                    } 
                    else if (command.includes('token')) {
                        lenis.scrollTo('#token', { duration: 1.5 });
                    }
                    else if (command.includes('roadmap') || command.includes('plan')) {
                        lenis.scrollTo('#roadmap', { duration: 1.5 });
                    }
                    else if (command.includes('team')) {
                        lenis.scrollTo('#team', { duration: 1.5 });
                    }
                    else if (command.includes('connect') || command.includes('wallet')) {
                        document.getElementById('connectWallet').click();
                    }
                    else if (command.includes('home') || command.includes('top')) {
                        lenis.scrollTo(0, { duration: 1.5 });
                    }
                };

                voiceBtn.addEventListener('click', () => {
                    recognition.start();
                });
            } else {
                voiceBtn.style.display = 'none';
            }

            // =============================================
            // 3. BACKGROUND GRID CREATION
            // =============================================
            const createGrid = () => {
                const grid = document.createElement('div');
                grid.className = 'background-grid';
                document.body.appendChild(grid);
                
                const size = 50;
                const cols = Math.ceil(window.innerWidth / size);
                const rows = Math.ceil(window.innerHeight / size);
                
                for (let i = 0; i < cols * rows; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    grid.appendChild(cell);
                    
                    gsap.set(cell, {
                        width: size,
                        height: size,
                        border: '1px solid rgba(255,255,255,0.03)',
                        position: 'absolute',
                        x: (i % cols) * size,
                        y: Math.floor(i / cols) * size
                    });
                    
                    // Animate cells on scroll
                    ScrollTrigger.create({
                        trigger: cell,
                        start: 'top bottom',
                        end: 'bottom top',
                        onEnter: () => animateCell(cell),
                        onEnterBack: () => animateCell(cell)
                    });
                }
                
                function animateCell(cell) {
                    gsap.to(cell, {
                        backgroundColor: 'rgba(110, 69, 226, 0.1)',
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power1.out'
                    });
                }
            };
            
            createGrid();

            // =============================================
            // 4. FLOATING CRYPTO SYMBOLS
            // =============================================
            const cryptoContainer = document.createElement('div');
            cryptoContainer.className = 'crypto-symbols-container';
            document.body.appendChild(cryptoContainer);
            
            const symbols = ['₿', 'Ξ', '◆', '◊', '⧫', '◎', '◈', 'Ⓢ'];
            for (let i = 0; i < 30; i++) {
                const symbol = document.createElement('div');
                symbol.className = 'crypto-symbol';
                symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                cryptoContainer.appendChild(symbol);
                
                const size = gsap.utils.random(20, 50);
                const x = gsap.utils.random(0, window.innerWidth);
                const y = gsap.utils.random(0, window.innerHeight);
                const duration = gsap.utils.random(10, 20);
                const delay = gsap.utils.random(0, 5);
                
                gsap.set(symbol, {
                    position: 'fixed',
                    fontSize: size + 'px',
                    opacity: 0.1,
                    color: i % 2 === 0 ? '#6e45e2' : '#88d3ce',
                    zIndex: 0,
                    x,
                    y
                });
                
                gsap.to(symbol, {
                    y: '+=100',
                    rotation: '+=360',
                    duration,
                    delay,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }

            // =============================================
            // 5. HERO SECTION ANIMATIONS
            // =============================================
            const heroTimeline = gsap.timeline();
            
            heroTimeline.from('.hero h1', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })
            .from('.hero p', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.5')
            .from('.cta-buttons', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            }, '-=0.4')
            .from('.hero-image', {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.8')
            .from('.floating-element', {
                scale: 0,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=1');

            // Floating elements continuous animation
            gsap.to('.floating-1', {
                y: '+=20',
                x: '+=10',
                rotation: '+=5',
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            
            gsap.to('.floating-2', {
                y: '+=30',
                x: '-=15',
                rotation: '-=3',
                duration: 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            
            gsap.to('.floating-3', {
                y: '-=25',
                x: '+=20',
                rotation: '+=7',
                duration: 7,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // =============================================
            // 6. TOKEN VISUAL ANIMATION
            // =============================================
           // Token particle emission
        const tokenVisual = document.querySelector('.token-visual');
        
        tokenVisual.addEventListener('mouseenter', () => {
            // Create particles when hovering token visual
            const particleInterval = setInterval(() => {
                const particle = document.createElement('div');
                particle.className = 'token-particle';
                tokenVisual.appendChild(particle);
                
                const size = Math.random() * 8 + 2;
                const startX = Math.random() * tokenVisual.offsetWidth;
                const startY = Math.random() * tokenVisual.offsetHeight;
                const endX = startX + (Math.random() * 100 - 50);
                const endY = startY + (Math.random() * 100 - 50);
                const duration = Math.random() * 2 + 1;
                
                gsap.set(particle, {
                    width: size,
                    height: size,
                    x: startX,
                    y: startY,
                    background: `radial-gradient(circle, white, transparent)`
                });
                
                gsap.to(particle, {
                    x: endX,
                    y: endY,
                    opacity: 0,
                    duration: duration,
                    onComplete: () => particle.remove()
                });
            }, 100);
            
            tokenVisual.dataset.particleInterval = particleInterval;
        });
        
        tokenVisual.addEventListener('mouseleave', () => {
            clearInterval(tokenVisual.dataset.particleInterval);
        });
        
        // Rotate token visual on hover
        tokenVisual.addEventListener('mousemove', (e) => {
            const rect = tokenVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 20;
            const rotateX = (centerY - y) / 20;
            
            gsap.to(tokenVisual, {
                rotateY: rotateY,
                rotateX: rotateX,
                duration: 0.5
            });
        });
        
        tokenVisual.addEventListener('mouseleave', () => {
            gsap.to(tokenVisual, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5
            });
        });
        
        // Continuous rotation when not hovering
        const tokenRotation = gsap.to(tokenVisual, {
            rotationY: 360,
            duration: 20,
            repeat: -1,
            ease: 'none',
            paused: true
        });
        
        tokenVisual.addEventListener('mouseenter', () => tokenRotation.pause());
        tokenVisual.addEventListener('mouseleave', () => tokenRotation.play());
        
            
            // Create particles for token visual
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'token-particle';
                tokenVisual.appendChild(particle);
                
                gsap.set(particle, {
                    position: 'absolute',
                    width: '5px',
                    height: '5px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    x: gsap.utils.random(0, 300),
                    y: gsap.utils.random(0, 300)
                });
                
                gsap.to(particle, {
                    x: 'random(0, 300)',
                    y: 'random(0, 300)',
                    duration: 'random(3, 6)',
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }

            // =============================================
            // 7. FEATURE CARDS ANIMATIONS
            // =============================================
            gsap.utils.toArray('.feature-card').forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top top%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: 'back.out(1.7)'
                });
            });

            // =============================================
            // 8. ROADMAP ITEMS ANIMATION
            // Roadmap line animation
        gsap.to('.roadmap-line', {
            height: '100%',
            scrollTrigger: {
                trigger: '.roadmap',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: true,
            }
        });

        // Roadmap items animation
        gsap.utils.toArray('.roadmap-item').forEach((item, index) => {
            const direction = index % 2 === 0 ? -100 : 100;
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                },
                x: direction,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });
        });


            // =============================================
            // 9. TEAM MEMBER ANIMATIONS
            // =============================================
            gsap.utils.toArray('.team-member').forEach((member, i) => {
                gsap.from(member, {
                    scrollTrigger: {
                        trigger: member,
                        start: 'top 100%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 100,
                    opacity: 0,
                    duration: 0.6,
                    delay: i * 0.15,
                    ease: 'back.out(1.7)'
                });
                
                // Hover effect
                member.addEventListener('mouseenter', () => {
                    gsap.to(member, {
                        y: -10,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
                
                member.addEventListener('mouseleave', () => {
                    gsap.to(member, {
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });

            // =============================================
            // 10. STATS COUNTER ANIMATION
            // =============================================
            const statsSection = document.querySelector('.stats');
            ScrollTrigger.create({
                trigger: statsSection,
                start: 'top 80%',
                onEnter: () => {
                    gsap.utils.toArray('.stat-item h3').forEach(stat => {
                        const target = parseFloat(stat.textContent.replace(/[^0-9.]/g, ''));
                        const suffix = stat.textContent.match(/[^0-9.]/g)?.join('') || '';
                        
                        gsap.fromTo(stat, 
                            { textContent: 0 },
                            { 
                                textContent: target,
                                duration: 2,
                                ease: 'power1.out',
                                snap: { textContent: 1 },
                                onUpdate: function() {
                                    stat.textContent = Math.floor(this.targets()[0].textContent) + suffix;
                                }
                            }
                        );
                    });
                }
            });

            // =============================================
            // 11. WALLET MODAL INTERACTIONS
            // =============================================
            const connectBtn = document.getElementById('connectWallet');
            const closeModal = document.getElementById('closeModal');
            const modal = document.getElementById('walletModal');

            connectBtn.addEventListener('click', function() {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Animate modal entrance with GSAP
                gsap.fromTo(modal, 
                    { opacity: 0, backdropFilter: 'blur(0px)' },
                    { opacity: 1, backdropFilter: 'blur(10px)', duration: 0.5, ease: 'power2.out' }
                );
                gsap.fromTo('.modal-content', 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', delay: 0.1 }
                );
                
                // Stagger wallet options animation
                gsap.fromTo('.wallet-option', {
                    y: 50,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    delay: 0.3,
                    ease: 'back.out(1.7)'
                },{
                    y:0,
                    opacity: 1

                });
            });

            closeModal.addEventListener('click', function() {
                gsap.to(modal, {
                    opacity: 0,
                    backdropFilter: 'blur(0px)',
                    duration: 0.3,
                    onComplete: () => {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                });
            });

            // Mock wallet connection
            document.querySelectorAll('.wallet-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.getElementById('connectedWallet').style.display = 'block';
                    
                    // Animate wallet connection
                    gsap.from('#connectedWallet', {
                        height: 0,
                        opacity: 0,
                        padding: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                    
                    // Animate balance counter
                    gsap.from('#walletBalance', {
                        textContent: 0,
                        duration: 2,
                        ease: 'power1.out',
                        snap: { textContent: 0.1 },
                        onUpdate: function() {
                            document.getElementById('walletBalance').textContent = 
                                Math.floor(this.targets()[0].textContent * 100) / 100 + ' QNT';
                        }
                    });
                });
            });

            // =============================================
            // 12. CONNECT BUTTON PULSE EFFECT
            // =============================================
            gsap.to(connectBtn, {
                boxShadow: '0 0 20px 5px rgba(110, 69, 226, 0.6)',
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // =============================================
            // 13. MOUSE FOLLOWER EFFECT
            // =============================================
            const follower = document.createElement('div');
            follower.className = 'mouse-follower';
            document.body.appendChild(follower);
            
            window.addEventListener('mousemove', (e) => {
                gsap.to(follower, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            // =============================================
            // 14. CLICK EXPLOSION EFFECT
            // =============================================
            document.addEventListener('click', (e) => {
                const particles = [];
                const colors = ['#6e45e2', '#88d3ce', '#ff6b6b', '#ffffff'];
                
                for (let i = 0; i < 10; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'click-particle';
                    document.body.appendChild(particle);
                    particles.push(particle);
                    
                    gsap.set(particle, {
                        position: 'fixed',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        x: e.clientX,
                        y: e.clientY,
                        zIndex: 9999,
                        pointerEvents: 'none'
                    });
                    
                    gsap.to(particle, {
                        x: e.clientX + gsap.utils.random(-100, 100),
                        y: e.clientY + gsap.utils.random(-100, 100),
                        opacity: 0,
                        scale: 0,
                        duration: 1,
                        onComplete: () => particle.remove()
                    });
                }
            });

            // =============================================
            // 15. TEXT SCRAMBLE EFFECT FOR HERO SUBTITLE
            // =============================================
            const heroSubtitle = document.querySelector('.hero p');
            const originalText = heroSubtitle.textContent;
            const chars = "!<>-_\\/[]{}—=+*^?#________";
            
            function scrambleText(element, newText) {
                let queue = [];
                
                for (let i = 0; i < Math.max(originalText.length, newText.length); i++) {
                    const from = originalText[i] || '';
                    const to = newText[i] || '';
                    const start = Math.floor(Math.random() * 40);
                    const end = start + Math.floor(Math.random() * 40);
                    queue.push({ from, to, start, end });
                }
                
                let frame = 0;
                const update = () => {
                    let output = '';
                    let complete = 0;
                    
                    for (let i = 0; i < queue.length; i++) {
                        let { from, to, start, end, char } = queue[i];
                        
                        if (frame >= end) {
                            complete++;
                            output += to;
                        } else if (frame >= start) {
                            if (!char || Math.random() < 0.28) {
                                char = chars[Math.floor(Math.random() * chars.length)];
                                queue[i].char = char;
                            }
                            output += `<span class="scramble-char">${char}</span>`;
                        } else {
                            output += from;
                        }
                    }
                    
                    element.innerHTML = output;
                    
                    if (complete < queue.length) {
                        requestAnimationFrame(update);
                        frame++;
                    }
                };
                
                update();
            }
            
            // Randomly change the subtitle text periodically
            const subtitles = [
                "Nexus is revolutionizing decentralized applications with cutting-edge blockchain technology.",
                "Experience seamless interoperability and user-friendly Web3 experiences.",
                "Join the future of decentralized finance and applications today.",
                "Built for speed, security, and scalability. The blockchain evolved."
            ];
            
            let currentSubtitle = 0;
            setInterval(() => {
                currentSubtitle = (currentSubtitle + 1) % subtitles.length;
                scrambleText(heroSubtitle, subtitles[currentSubtitle]);
            }, 5000);
        });
    
