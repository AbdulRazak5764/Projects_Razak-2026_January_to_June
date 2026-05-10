import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";

const skillCategories = [
    {
        title: "Languages",
        icon: "⌨️",
        color: "from-primary/20 to-primary/5",
        border: "border-primary/20",
        badge: "bg-primary/10 text-primary border-primary/20",
        skills: ["Python", "Java", "C/C++", "SQL", "JavaScript", "HTML/CSS"],
    },
    {
        title: "ML / AI",
        icon: "🧠",
        color: "from-accent/20 to-accent/5",
        border: "border-accent/20",
        badge: "bg-accent/10 text-accent border-accent/20",
        skills: ["TensorFlow", "PyTorch", "Scikit-learn", "NLP", "Computer Vision", "Deep Learning", "Ensemble Models", "LSTM"],
    },
    {
        title: "Web Development",
        icon: "🌐",
        color: "from-chart-3/20 to-chart-3/5",
        border: "border-chart-3/20",
        badge: "bg-chart-3/10 text-chart-3 border-chart-3/20",
        skills: ["React", "Django", "Node.js", "REST APIs", "Flask", "Tailwind CSS", "Next.js"],
    },
    {
        title: "Data Engineering",
        icon: "⚙️",
        color: "from-chart-4/20 to-chart-4/5",
        border: "border-chart-4/20",
        badge: "bg-chart-4/10 text-chart-4 border-chart-4/20",
        skills: ["Pandas", "NumPy", "Data Cleaning", "Feature Engineering", "Schema Harmonization", "ETL Pipelines"],
    },
    {
        title: "Tools & Cloud",
        icon: "☁️",
        color: "from-chart-5/20 to-chart-5/5",
        border: "border-chart-5/20",
        badge: "bg-chart-5/10 text-chart-5 border-chart-5/20",
        skills: ["Git", "Docker", "AWS", "Google Colab", "Tableau", "MATLAB", "CI/CD", "Linux"],
    },
    {
        title: "Databases",
        icon: "🗄️",
        color: "from-chart-2/20 to-chart-2/5",
        border: "border-chart-2/20",
        badge: "bg-chart-2/10 text-chart-2 border-chart-2/20",
        skills: ["MySQL", "MongoDB", "PostgreSQL", "Firebase", "SQLite"],
    },
];

export default function SkillsSection() {
    return (
        <SectionWrapper id="skills">
            <SectionTitle title="Technical Skills" subtitle="Technologies and tools I craft with" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {skillCategories.map((cat, i) => (
                    <motion.div
                        key={cat.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className={`relative glass rounded-2xl p-6 border ${cat.border} card-hover overflow-hidden`}
                    >
                        {/* Gradient bg */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} pointer-events-none`} />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-5">
                                <span className="text-2xl">{cat.icon}</span>
                                <h3 className="font-space font-bold text-foreground">{cat.title}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${cat.badge} hover:scale-105 transition-transform cursor-default`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}