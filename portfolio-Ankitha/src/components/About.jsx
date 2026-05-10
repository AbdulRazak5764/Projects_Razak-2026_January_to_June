import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const SectionHeader = ({ title, subtitle }) => (
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h3 style={{ color: 'var(--accent)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
            {subtitle}
        </h3>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{title}</h2>
        <div style={{ width: '60px', height: '4px', background: 'var(--accent)', margin: '1rem auto 0', borderRadius: '2px' }}></div>
    </div>
);

const Counter = ({ end, label, suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start > end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.ceil(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [end]);

    return (
        <div style={{
            background: 'var(--card-bg)',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: 'var(--card-shadow)',
            textAlign: 'center',
            border: '1px solid var(--glass-border)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <h3 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>{count}{suffix}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '1.1rem' }}>{label}</p>
        </div>
    );
};

const About = () => {
    return (
        <section id="about" style={{ padding: '100px 5%', position: 'relative' }}>
            <SectionHeader title="About Me" subtitle="Get to know me" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto', alignItems: 'center' }}>

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '-20px',
                            right: '20px',
                            bottom: '20px',
                            border: '4px solid var(--accent)',
                            borderRadius: '20px',
                            zIndex: -1,
                        }}></div>
                        {/* Using a placeholder SVG or simple element if no real image is provided. We will generate one or use a modern stylized component */}
                        <div style={{
                            width: '100%',
                            paddingBottom: '100%',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            position: 'relative',
                            boxShadow: 'var(--card-shadow)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ankitha" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                        Transforming Complex Data into <span style={{ color: 'var(--accent)' }}>Actionable Intelligence</span>
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        I am a passionate Data Analyst with a B.Tech in Computer Science and Engineering (Data Science). I specialize in extracting meaningful patterns from complex datasets, creating intuitive visualizations, and building interactive dashboards that drive strategic decision-making.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                        With strong foundations in Python, SQL, and Power BI, I bridge the gap between technical data engineering and business strategy, ensuring that data doesn't just sit in databases, but actively contributes to organizational growth.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        <Counter end={10} label="Projects" suffix="+" />
                        <Counter end={20} label="Tools" suffix="+" />
                        <Counter end={5} label="Certifications" />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default About;
