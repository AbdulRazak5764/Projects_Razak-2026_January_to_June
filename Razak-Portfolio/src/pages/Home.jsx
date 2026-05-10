import React from "react";
import ParticleBackground from "../components/portfolio/ParticleBackground";
import Navbar from "../components/portfolio/Navbar";
import HeroSection from "../components/portfolio/HeroSection";
import StatsSection from "../components/portfolio/StatsSection";
import AboutSection from "../components/portfolio/AboutSection";
import SkillsSection from "../components/portfolio/SkillsSection";
import ExperienceSection from "../components/portfolio/ExperienceSection";
import ProjectsSection from "../components/portfolio/ProjectsSection";
import PublicationsSection from "../components/portfolio/PublicationsSection";
import CertificationsSection from "../components/portfolio/CertificationsSection";
import EducationSection from "../components/portfolio/EducationSection";
import ContactSection from "../components/portfolio/ContactSection";
import FloatingSocial from "../components/portfolio/FloatingSocial";
import BackToTop from "../components/portfolio/BackToTop";
import Footer from "../components/portfolio/Footer";

export default function Home() {
    return (
        <div className="font-inter min-h-screen bg-background text-foreground overflow-x-hidden">
            <ParticleBackground />
            <Navbar />
            <FloatingSocial />
            <HeroSection />
            <StatsSection />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <ProjectsSection />
            <PublicationsSection />
            <CertificationsSection />
            <EducationSection />
            <ContactSection />
            <Footer />
            <BackToTop />
        </div>
    );
}