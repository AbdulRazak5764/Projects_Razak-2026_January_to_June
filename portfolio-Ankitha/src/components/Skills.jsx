import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const SectionHeader = ({ title, subtitle }) => (
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h3 style={{ color: 'var(--accent)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
            {subtitle}
        </h3>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{title}</h2>
        <div style={{ width: '60px', height: '4px', background: 'var(--accent)', margin: '1rem auto 0', borderRadius: '2px' }}></div>
    </div>
);

const Skills = () => {
    const data = [
        { name: 'Python', level: 90, color: 'var(--chart-1)' },
        { name: 'SQL', level: 85, color: 'var(--chart-2)' },
        { name: 'Power BI', level: 88, color: 'var(--chart-3)' },
        { name: 'Excel', level: 95, color: 'var(--chart-4)' },
        { name: 'Tableau', level: 75, color: 'var(--accent-hover)' },
    ];

    const categories = [
        {
            title: 'Programming & Databases',
            skills: ['Python', 'SQL (MySQL, PostgreSQL)', 'R (Basic)', 'C++'],
            icon: '💻',
        },
        {
            title: 'Tools & Platforms',
            skills: ['Power BI', 'Microsoft Excel', 'Tableau', 'Jupyter', 'Git'],
            icon: '🛠️',
        },
        {
            title: 'Data Science & Machine Learning',
            skills: ['Pandas, NumPy', 'Scikit-Learn', 'Matplotlib, Seaborn', 'Data Preprocessing'],
            icon: '📊',
        },
    ];

    return (
        <section id="skills" style={{ padding: '100px 5%', background: 'var(--bg-secondary)', position: 'relative' }}>
            <SectionHeader title="Technical Arsenal" subtitle="My Skills" />

            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>

                {/* Interactive Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '20px', boxShadow: 'var(--card-shadow)' }}
                >
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Proficiency Levels</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-primary)', fontSize: 14 }} width={80} />
                                <Tooltip
                                    cursor={{ fill: 'var(--bg-secondary)' }}
                                    contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                />
                                <Bar dataKey="level" radius={[0, 10, 10, 0]} animationDuration={1500}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Skill Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ display: 'grid', gap: '2rem' }}
                >
                    {categories.map((cat, idx) => (
                        <div key={idx} style={{
                            background: 'var(--card-bg)',
                            padding: '1.5rem',
                            borderRadius: '15px',
                            borderLeft: `4px solid var(--chart-${(idx % 4) + 1})`,
                            boxShadow: 'var(--card-shadow)',
                            transition: 'transform 0.3s ease',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.8rem', marginRight: '1rem' }}>{cat.icon}</span>
                                <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{cat.title}</h4>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {cat.skills.map((skill, sIdx) => (
                                    <span key={sIdx} style={{
                                        background: 'var(--bg-secondary)',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default Skills;
