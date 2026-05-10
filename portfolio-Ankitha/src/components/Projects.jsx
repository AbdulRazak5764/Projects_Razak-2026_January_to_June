import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SectionHeader = ({ title, subtitle }) => (
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h3 style={{ color: 'var(--accent)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
            {subtitle}
        </h3>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{title}</h2>
        <div style={{ width: '60px', height: '4px', background: 'var(--accent)', margin: '1rem auto 0', borderRadius: '2px' }}></div>
    </div>
);

const projects = [
    {
        id: 1,
        title: 'HR Data Analysis',
        category: 'Dashboard',
        description: 'An interactive Power BI dashboard to analyze employee attrition, demographic trends, and performance metrics, providing actionable insights for HR retention strategies.',
        tech: ['Power BI', 'Excel', 'Data Modeling'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        link: '#',
    },
    {
        id: 2,
        title: 'Road Accident Analysis',
        category: 'Data Analysis',
        description: 'Comprehensive analysis of road accident data revealing spatial and temporal patterns, identifying high-risk zones, and contributing to potential safety recommendations.',
        tech: ['Python', 'Pandas', 'Folium', 'Seaborn'],
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        link: '#',
    },
    {
        id: 3,
        title: 'Blinkit Sales Analysis',
        category: 'Visualization',
        description: 'Analyzed Blinkit sales data to optimize inventory management and unearth critical sales trends across different regions and product categories.',
        tech: ['SQL', 'Tableau', 'Excel'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        link: '#',
    },
    {
        id: 4,
        title: 'Superstore Data Analysis',
        category: 'Forecasting',
        description: 'Developed a comprehensive data analysis pipeline for Superstore profit and regional sales data, identifying underperforming segments and profitability optimization strategies.',
        tech: ['Python', 'Scikit-Learn', 'Matplotlib'],
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        link: '#',
    },
];

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <section id="projects" style={{ padding: '100px 5%', position: 'relative' }}>
            <SectionHeader title="Recent Works" subtitle="Portfolio" />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                {projects.map((project, idx) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        style={{
                            background: 'var(--card-bg)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: 'var(--card-shadow)',
                            cursor: 'pointer',
                            position: 'relative',
                            border: '1px solid var(--glass-border)',
                        }}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        onClick={() => setSelectedProject(project)}
                    >
                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                            <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                opacity: 0.6
                            }}></div>
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>
                                {project.category}
                            </span>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{project.title}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {project.tech.map((t, i) => (
                                    <span key={i} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'var(--bg-secondary)', borderRadius: '15px', color: 'var(--text-secondary)' }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <button style={{
                                background: 'transparent',
                                color: 'var(--accent)',
                                border: 'none',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}>
                                View Details &rarr;
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal / Popup for Details */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem'
                        }}
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            style={{
                                background: 'var(--card-bg)',
                                maxWidth: '800px',
                                width: '100%',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: 'var(--card-shadow)',
                                position: 'relative'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                style={{
                                    position: 'absolute', top: '1rem', right: '1rem',
                                    background: 'rgba(0,0,0,0.5)', color: 'white',
                                    border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', zIndex: 10
                                }}
                            >
                                <X size={24} />
                            </button>

                            <img src={selectedProject.image} alt={selectedProject.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />

                            <div style={{ padding: '3rem' }}>
                                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{selectedProject.category}</span>
                                <h2 style={{ fontSize: '2rem', margin: '0.5rem 0 1.5rem 0', color: 'var(--text-primary)' }}>{selectedProject.title}</h2>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                    {selectedProject.description}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <a href={selectedProject.link} style={{
                                        padding: '0.8rem 1.5rem', background: 'var(--accent)', color: 'white', borderRadius: '8px', fontWeight: 'bold'
                                    }}>View Live Demo</a>
                                    <a href="#" style={{
                                        padding: '0.8rem 1.5rem', background: 'transparent', color: 'var(--text-primary)', border: '2px solid var(--accent)', borderRadius: '8px', fontWeight: 'bold'
                                    }}>View GitHub Repo</a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Projects;
