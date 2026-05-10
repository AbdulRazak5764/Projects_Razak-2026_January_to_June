import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const [text, setText] = useState('');
    const skills = ['Python', 'SQL', 'Power BI', 'Excel'];
    const [skillIndex, setSkillIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        let timer;
        const currentSkill = skills[skillIndex];

        const handleTyping = () => {
            if (!isDeleting && text === currentSkill) {
                timer = setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setSkillIndex((prev) => (prev + 1) % skills.length);
            } else {
                const nextText = isDeleting
                    ? currentSkill.substring(0, text.length - 1)
                    : currentSkill.substring(0, text.length + 1);

                setText(nextText);
                setTypingSpeed(isDeleting ? 50 : 150);
            }
        };

        timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, skillIndex, typingSpeed, skills]);

    const containerStyles = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 10%',
        position: 'relative',
        overflow: 'hidden',
    };

    const bgStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 50% 50%, var(--accent-glow) 0%, transparent 50%)',
        opacity: 0.5,
        zIndex: -1,
    };

    return (
        <section id="hero" style={containerStyles}>
            <div style={bgStyles}></div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ maxWidth: '800px', zIndex: 1 }}
            >
                <h4 style={{ color: 'var(--accent)', fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '2px' }}>
                    WELCOME TO MY PORTFOLIO
                </h4>
                <h1 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '1rem', lineHeight: '1.2' }}>
                    Hi, I’m <span style={{ color: 'var(--accent)' }}>Ankitha Podili</span>
                </h1>
                <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Data Analyst | Turning Data into <span style={{ color: 'var(--text-primary)' }}>Insights</span>
                </h2>

                <div style={{ height: '40px', fontSize: '1.5rem', marginBottom: '3rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>Skilled in:</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{text}</span>
                    <span className="cursor" style={{ animation: 'blink 1s step-end infinite' }}>|</span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <a href="#projects" style={{
                        padding: '1rem 2rem',
                        background: 'var(--accent)',
                        color: 'white',
                        borderRadius: '30px',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px var(--accent-glow)',
                        transition: 'transform 0.3s ease',
                    }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        View Projects
                    </a>
                    <a href="#contact" style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        border: '2px solid var(--accent)',
                        borderRadius: '30px',
                        fontWeight: '600',
                        transition: 'transform 0.3s ease, background 0.3s ease',
                    }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.background = 'var(--accent-glow)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.background = 'transparent';
                        }}
                    >
                        Contact Me
                    </a>
                </div>
            </motion.div>
            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </section>
    );
};

export default Hero;
