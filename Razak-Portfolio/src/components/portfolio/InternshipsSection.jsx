import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Github, Linkedin, Mail } from "lucide-react";

const roles = ["Machine Learning Engineer", "AI Researcher", "Full-Stack Developer", "Data Scientist"];

export default function HeroSection() {
    const [roleIndex, setRoleIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = roles[roleIndex];
        let t;
        if (!isDeleting && text === current) {
            t = setTimeout(() => setIsDeleting(true), 2200);
        } else if (isDeleting && text === "") {
            setIsDeleting(false);
            setRoleIndex((p) => (p + 1) % roles.length);
        } else {
            t = setTimeout(() => {
                setText(isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
            }, isDeleting ? 35 : 75);
        }
        return () => clearTimeout(t);
    }, [text, isDeleting, roleIndex]);

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Deep space background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(220_30%_8%)_0%,hsl(220_30%_5%)_60%)]" />

            {/* Glowing orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-2/3 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] animate-pulse" style={{ animationDelay: "3s" }} />
            </div>

            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.035]"
                style={{ backgroundImage: "radial-gradient(circle,hsl(var(--foreground)) 1px,transparent 1px)", backgroundSize: "36px 36px" }}
            />

            {/* Horizontal scan lines */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="absolute w-full h-px bg-primary" style={{ top: `${i * 5}%` }} />
                ))}
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
                {/* Profile with orbital rings */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-12"
                >
                    {/* Orbital ring 1 */}
                    <div className="absolute inset-[-20px] rounded-full border border-primary/15 animate-spin" style={{ animationDuration: "12s" }} />
                    {/* Orbital ring 2 */}
                    <div className="absolute inset-[-36px] rounded-full border border-accent/10 animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }} />
                    {/* Orbital dot 1 */}
                    <div className="absolute w-3 h-3 rounded-full bg-primary/70 shadow-[0_0_12px_hsl(180_100%_50%/0.8)] animate-orbit" style={{ top: "calc(50% - 1.5px)", left: "calc(50% - 1.5px)" }} />
                    {/* Orbital dot 2 */}
                    <div className="absolute w-2 h-2 rounded-full bg-accent/70 shadow-[0_0_8px_hsl(265_70%_65%/0.8)] animate-orbit-slow" style={{ top: "calc(50% - 1px)", left: "calc(50% - 1px)" }} />

                    {/* Avatar */}
                    <div className="absolute inset-0 rounded-full glow-primary p-[3px] bg-gradient-to-br from-primary/40 via-transparent to-accent/40">
                        <img
                            src="https://media.base44.com/images/public/69f2116675139d3a9ac41158/65ed1435d_image-profile.png"
                            alt="Shaik Abdul Razak"
                            className="w-full h-full rounded-full object-cover object-center"
                        />
                    </div>

                    {/* Online badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-full px-2.5 py-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] font-medium text-green-400">Available</span>
                    </div>
                </motion.div>

                {/* Name & Role */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60" />
                        <p className="font-mono text-xs text-primary tracking-[0.25em] uppercase">ML Engineer & AI Researcher</p>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60" />
                    </div>

                    <h1 className="font-space text-5xl sm:text-7xl lg:text-8xl font-extrabold leading-none mb-6">
                        <span className="block text-foreground">Shaik Abdul</span>
                        <span className="block text-gradient mt-1">Razak</span>
                    </h1>

                    <div className="h-12 flex items-center justify-center mb-5">
                        <span className="font-space text-lg sm:text-2xl font-medium text-muted-foreground">
                            <span className="text-primary/60 font-mono text-sm mr-2">&gt;</span>
                            {text}
                            <span className="inline-block w-[2px] h-6 bg-primary ml-1 align-middle animate-pulse" />
                        </span>
                    </div>

                    <p className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-10">
                        <MapPin className="w-3.5 h-3.5 text-primary/70" />
                        <span>Kurnool, Andhra Pradesh, India</span>
                        <span className="mx-2 text-border">·</span>
                        <span className="text-primary/80 font-medium">9.90 CGPA · Top 2%</span>
                    </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-12"
                >
                    <a
                        href="#contact"
                        onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                        className="group relative px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm overflow-hidden hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary opacity-100 group-hover:opacity-0 transition-opacity" />
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-primary group-hover:opacity-100 opacity-0 transition-opacity" />
                        <span className="relative">Get In Touch</span>
                    </a>
                    <a
                        href="#projects"
                        onClick={(e) => { e.preventDefault(); document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }); }}
                        className="px-8 py-3.5 rounded-xl border border-primary/30 text-foreground font-semibold text-sm hover:bg-primary/10 hover:border-primary/60 transition-all hover:scale-105 backdrop-blur-sm"
                    >
                        View Projects
                    </a>
                    <a
                        href="https://media.base44.com/files/public/69f2116675139d3a9ac41158/55a8453ee_RAZAK_CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3.5 rounded-xl border border-accent/30 text-accent font-semibold text-sm hover:bg-accent/10 hover:border-accent/60 transition-all hover:scale-105"
                    >
                        Download CV
                    </a>
                </motion.div>

                {/* Quick social links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="flex items-center justify-center gap-4 mb-16"
                >
                    <a href="https://github.com/AbdulRazak5764" target="_blank" rel="noopener noreferrer" title="GitHub"
                        className="p-2.5 rounded-xl glass border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all hover:scale-110">
                        <Github className="w-4 h-4" />
                    </a>
                    <a href="https://www.linkedin.com/in/shaik-abdul-razak-38591b328" target="_blank" rel="noopener noreferrer" title="LinkedIn"
                        className="p-2.5 rounded-xl glass border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all hover:scale-110">
                        <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="mailto:abdulrazakshaik87@gmail.com" title="Email"
                        className="p-2.5 rounded-xl glass border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all hover:scale-110">
                        <Mail className="w-4 h-4" />
                    </a>
                </motion.div>

                {/* Scroll indicator */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
                    className="flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-primary transition-colors mx-auto"
                >
                    <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
                    <div className="w-5 h-8 rounded-full border border-border/50 flex items-start justify-center pt-1.5">
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="w-1 h-1.5 rounded-full bg-primary"
                        />
                    </div>
                </motion.button>
            </div>
        </section>
    );
}