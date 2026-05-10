import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
    <h3 style={{ color: 'var(--accent)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>
      {subtitle}
    </h3>
    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{title}</h2>
    <div style={{ width: '60px', height: '4px', background: 'var(--accent)', margin: '1rem auto 0', borderRadius: '2px' }}></div>
  </div>
);

const educationData = [
  {
    title: 'B.Tech in Computer Science and Engineering (Data Science)',
    institution: 'Vignana Bharathi Institute of Technology',
    score: 'CGPA 9.4',
    year: '2021 - Present',
    description: 'Specializing in machine learning, database management, and big data technologies. Active member of coding clubs and continuously engaged in hands-on data analytics projects.'
  },
  {
    title: '12th Grade (Intermediate)',
    institution: 'Sri Chaitanya Junior College',
    score: '97.2%',
    year: '2019 - 2021',
    description: 'Secured high academic standing with a focus on Mathematics, Physics, and Chemistry, laying a strong quantitative foundation for a career in data science.'
  },
  {
    title: 'Secondary School Leaving Certificate (SSLC)',
    institution: 'Krishnaveni Talent School',
    score: 'CGPA 10.0',
    year: '2019',
    description: 'Achieved a perfect CGPA, demonstrating consistent academic excellence and dedication to foundational learning.'
  }
];

const Education = () => {
  return (
    <section id="education" style={{ padding: '100px 5%', background: 'var(--bg-secondary)', position: 'relative' }}>
      <SectionHeader title="Academic Journey" subtitle="Education" />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          background: 'var(--accent-glow)',
          zIndex: 0
        }}></div>

        {educationData.map((edu, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            style={{
              display: 'flex',
              justifyContent: idx % 2 === 0 ? 'flex-start' : 'flex-end',
              paddingLeft: idx % 2 === 0 ? '0' : '50%',
              paddingRight: idx % 2 === 0 ? '50%' : '0',
              position: 'relative',
              marginBottom: '3rem',
              width: '100%',
              zIndex: 1
            }}
          >
            {/* Timeline Dot */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '20px',
              background: 'var(--accent)',
              borderRadius: '50%',
              border: '4px solid var(--bg-secondary)',
              boxShadow: '0 0 0 4px var(--accent-glow)',
              zIndex: 2
            }}></div>

            {/* Content Card */}
            <div style={{
              background: 'var(--card-bg)',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: 'var(--card-shadow)',
              width: '90%',
              marginLeft: idx % 2 === 0 ? '0' : '10%',
              marginRight: idx % 2 === 0 ? '10%' : '0',
              border: '1px solid var(--glass-border)',
              transition: 'transform 0.3s ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{
                color: 'var(--accent)',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                {edu.year}
              </span>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title}</h3>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>{edu.institution}</h4>
              <div style={{
                display: 'inline-block',
                padding: '0.4rem 1rem',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderRadius: '20px',
                fontWeight: 'bold',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                Score: {edu.score}
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {edu.description}
              </p>
            </div>
          </motion.div>
        ))}

        <style>{`
          @media (max-width: 768px) {
            #education > div > div:first-child {
              left: 20px !important;
              transform: none !important;
            }
            #education > div > div > div:nth-child(1) {
              left: 20px !important;
              transform: translateX(-50%) !important;
            }
            #education > div > div {
              justify-content: flex-end !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            #education > div > div > div:nth-child(2) {
              width: calc(100% - 40px) !important;
              margin-left: 40px !important;
              margin-right: 0 !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Education;
