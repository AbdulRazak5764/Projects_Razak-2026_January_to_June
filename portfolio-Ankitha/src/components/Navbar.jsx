import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: isScrolled ? '15px 5%' : '20px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        backgroundColor: isScrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: isScrolled ? 'var(--nav-backdrop)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
    };

    const linkStyles = {
        marginLeft: '2rem',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'color 0.3s ease',
    };

    const navLinks = ['About', 'Skills', 'Projects', 'Education', 'Contact'];

    return (
        <nav style={navStyles}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: "'Outfit', sans-serif" }}>
                Ankitha<span style={{ color: 'var(--accent)' }}>.</span>
            </div>

            {/* Desktop Menu */}
            <div style={{ display: 'flex', alignItems: 'center' }} className="desktop-menu">
                <div style={{ display: 'flex' }}>
                    {navLinks.map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            style={linkStyles}
                            onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
                            onMouseLeave={(e) => (e.target.style.color = 'var(--text-primary)')}
                        >
                            {link}
                        </a>
                    ))}
                </div>
                <button
                    onClick={toggleTheme}
                    style={{ marginLeft: '2rem', background: 'transparent', color: 'var(--text-primary)' }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Add responsive styles dynamically or just assume basic layout for now */}
            <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
