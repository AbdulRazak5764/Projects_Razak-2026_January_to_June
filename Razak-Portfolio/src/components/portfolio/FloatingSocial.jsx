import { motion } from "framer-motion";
import { Github, Linkedin, BookOpen, BarChart3, Mail } from "lucide-react";

const links = [
    { icon: Linkedin, url: "https://www.linkedin.com/in/shaik-abdul-razak-38591b328", label: "LinkedIn", color: "hover:text-blue-400 hover:border-blue-400/40 hover:shadow-blue-400/10" },
    { icon: Github, url: "https://github.com/AbdulRazak5764", label: "GitHub", color: "hover:text-foreground hover:border-foreground/30 hover:shadow-white/5" },
    { icon: BookOpen, url: "https://scholar.google.com/citations?hl=en&user=8ByScWUAAAAJ", label: "Scholar", color: "hover:text-blue-500 hover:border-blue-500/40 hover:shadow-blue-500/10" },
    { icon: BarChart3, url: "https://www.kaggle.com/razak5764", label: "Kaggle", color: "hover:text-cyan-400 hover:border-cyan-400/40 hover:shadow-cyan-400/10" },
    { icon: Mail, url: "mailto:abdulrazakshaik87@gmail.com", label: "Email", color: "hover:text-primary hover:border-primary/40 hover:shadow-primary/10" },
];

export default function FloatingSocial() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-2.5"
        >
            {links.map((link, i) => (
                <motion.a
                    key={link.name}
                    href={link.url}
                    target={link.label !== "Email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    title={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.2 + i * 0.1 }}
                    className={`w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center text-muted-foreground transition-all duration-200 hover:scale-110 hover:shadow-lg ${link.color}`}
                >
                    <link.icon className="w-4 h-4" />
                </motion.a>
            ))}
            <div className="mt-2 w-px h-16 bg-gradient-to-b from-border to-transparent" />
        </motion.div>
    );
}