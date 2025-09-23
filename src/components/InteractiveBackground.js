// src/components/InteractiveBackground.js

import React, { useRef, useEffect } from 'react';

const InteractiveBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // --- Configuration ---
        const config = {
            particleColor: `rgba(0, 168, 232, 0.7)`, // Matches your --accent-color
            lineColor: `rgba(0, 168, 232, 0.2)`,
            particleAmount: 100,
            defaultSpeed: 0.3,
            variantSpeed: 0.3,
            defaultRadius: 2.5,
            variantRadius: 1,
            linkRadius: 180, // Max distance to connect lines
            mouseRadius: 120, // Radius of mouse interaction
        };

        // --- Set canvas size ---
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // --- Mouse object ---
        let mouse = { x: null, y: null };
        const handleMouseMove = (event) => {
            mouse.x = event.pageX;
            mouse.y = event.pageY;
        };
        const handleMouseOut = () => {
            mouse.x = null;
            mouse.y = null;
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        // --- Particle class ---
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.speed = config.defaultSpeed + Math.random() * config.variantSpeed;
                this.directionAngle = Math.floor(Math.random() * 360);
                this.color = config.particleColor;
                this.radius = config.defaultRadius + Math.random() * config.variantRadius;
                this.vx = Math.cos(this.directionAngle) * this.speed;
                this.vy = Math.sin(this.directionAngle) * this.speed;
            }

            update() {
                this.border();
                this.x += this.vx;
                this.y += this.vy;
            }

            border() {
                if (this.x >= canvas.width || this.x <= 0) this.vx *= -1;
                if (this.y >= canvas.height || this.y <= 0) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        let particles = [];
        const createParticles = () => {
            particles = Array.from({ length: config.particleAmount }, () => new Particle());
        };
        createParticles();

        // --- Utility function ---
        const checkDistance = (x1, y1, x2, y2) => {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        };

        const linkParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const distance = checkDistance(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    if (distance < config.linkRadius) {
                        const opacity = 1 - distance / config.linkRadius;
                        ctx.lineWidth = 0.5;
                        ctx.strokeStyle = `rgba(0, 168, 232, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const repelParticles = () => {
            if (mouse.x === null || mouse.y === null) return;
            particles.forEach(particle => {
                const distance = checkDistance(mouse.x, mouse.y, particle.x, particle.y);
                if (distance < config.mouseRadius) {
                    const force = (config.mouseRadius - distance) / config.mouseRadius;
                    const angle = Math.atan2(particle.y - mouse.y, particle.x - mouse.x);
                    particle.x += Math.cos(angle) * force * 2;
                    particle.y += Math.sin(angle) * force * 2;
                }
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            repelParticles();
            particles.forEach(p => { p.update(); p.draw(); });
            linkParticles();
            animationFrameId = window.requestAnimationFrame(animate);
        };
        animate();

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Note the zIndex is 1 to appear behind the content (zIndex: 2) but in front of the base background.
    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />;
};

export default InteractiveBackground;