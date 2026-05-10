import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Code2 } from "lucide-react";

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Research", href: "#publications" },
    { label: "Certs", href: "#certifications" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [active, setActive] = useState("");

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = navLinks.map(l => l.href.slice(1));
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i]);
                if (el && window.scrollY >= el.offsetTop - 120) {
                    setActive("#" + sections[i]);
                    break;
                }
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = (href) => {
        setMobileOpen(false);
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "glass-strong shadow-2xl shadow-black/30"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                {/* Logo */}
                <a
                    href="#hero"
                    onClick={(e) => { e.preventDefault(); handleClick("#hero"); }}
                    className="flex items-center gap-2 group"
                >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                        <Code2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-space font-bold text-lg text-foreground">
                        SAR<span className="text-primary">.</span>
                    </span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => { e.preventDefault(); handleClick(link.href); }}
                            className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${active === link.href
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {active === link.href && (
                                <motion.span
                                    layoutId="navpill"
                                    className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                                />
                            )}
                            <span className="relative z-10">{link.label}</span>
                        </a>
                    ))}
                    <a
                        href="https://media.base44.com/files/public/69f2116675139d3a9ac41158/55a8453ee_RAZAK_CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Resume
                    </a>
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-lg text-foreground hover:bg-secondary/50 transition-colors"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-strong border-t border-border/30 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => { e.preventDefault(); handleClick(link.href); }}
                                    className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${active === link.href
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="https://media.base44.com/files/public/69f2116675139d3a9ac41158/55a8453ee_RAZAK_CV.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-primary"
                            >
                                <Download className="w-4 h-4" />
                                Download Resume
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}