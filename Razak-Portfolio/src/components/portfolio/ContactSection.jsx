import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Download } from "lucide-react";

const socialLinks = [
    { name: "LinkedIn", emoji: "💼", url: "https://www.linkedin.com/in/shaik-abdul-razak-38591b328" },
    { name: "GitHub", emoji: "🐙", url: "https://github.com/AbdulRazak5764" },
    { name: "Google Scholar", emoji: "📖", url: "https://scholar.google.com/citations?hl=en&user=8ByScWUAAAAJ" },
    { name: "LeetCode", emoji: "⚡", url: "https://leetcode.com/u/Razak_5764/" },
    { name: "Kaggle", emoji: "📊", url: "https://www.kaggle.com/razak5764" },
    { name: "Medium", emoji: "✍️", url: "https://medium.com/@abdulrazakshaik87" },
    { name: "ORCID", emoji: "🔬", url: "https://orcid.org/0009-0003-1557-8366" },
    { name: "CodePen", emoji: "🖌️", url: "https://codepen.io/AbdulRazak5764" },
    { name: "Portfolio", emoji: "🌐", url: "https://razak-portfolio.netlify.app" },
    { name: "GitLab", emoji: "🦊", url: "https://gitlab.com/-/user_settings/profile" },
];

export default function ContactSection() {
    return (
        <SectionWrapper id="contact">
            <SectionTitle title="Get In Touch" subtitle="Open to opportunities, collaborations & research discussions" />

            <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-5">
                    <div className="glass rounded-2xl p-7 border-gradient">
                        <p className="font-mono text-xs text-primary mb-5 tracking-widest">// contact_info</p>
                        <div className="space-y-5">
                            <a href="mailto:abdulrazakshaik87@gmail.com" className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                                        abdulrazakshaik87@gmail.com
                                    </p>
                                </div>
                            </a>

                            <a href="tel:+918919701520" className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                                    <Phone className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="font-medium text-foreground group-hover:text-accent transition-colors text-sm">
                                        +91 8919701520
                                    </p>
                                </div>
                            </a>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-chart-3/10 border border-chart-3/20 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-chart-3" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="font-medium text-foreground text-sm">Kurnool, Andhra Pradesh, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a
                        href="https://media.base44.com/files/public/69f2116675139d3a9ac41158/55a8453ee_RAZAK_CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                    >
                        <Download className="w-5 h-5" />
                        Download Full Resume (PDF)
                    </a>
                </div>

                {/* Social Links Grid */}
                <div>
                    <p className="font-mono text-xs text-primary/70 mb-5 tracking-widest">// online_profiles</p>
                    <div className="grid grid-cols-2 gap-3">
                        {socialLinks.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04 }}
                                className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-2 card-hover group"
                            >
                                <span className="flex items-center gap-2.5">
                                    <span className="text-lg">{link.emoji}</span>
                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.name}</span>
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}