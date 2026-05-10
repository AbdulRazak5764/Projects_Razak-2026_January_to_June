import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";

const experiences = [
    {
        company: "InternPro",
        role: "Python Developer",
        type: "Remote Internship",
        period: "Aug 2024 – Mar 2025",
        duration: "8 months",
        color: "border-primary/40 bg-primary/5",
        dot: "bg-primary shadow-[0_0_12px_hsl(180_100%_50%/0.8)]",
        bullets: [
            "Developed 5+ microservices using Django, improving API response time by 30%",
            "Built RESTful APIs handling 10,000+ daily requests for enterprise dashboards",
            "Automated ETL pipelines processing 50GB+ datasets, saving 15+ hours/week",
            "Implemented data validation ensuring 99.9% data accuracy",
        ],
    },
    {
        company: "Forage Virtual Internships",
        role: "Multiple Industry Roles",
        type: "Virtual Programs",
        period: "2023 – 2025",
        duration: "Ongoing",
        color: "border-accent/40 bg-accent/5",
        dot: "bg-accent shadow-[0_0_12px_hsl(265_70%_65%/0.8)]",
        bullets: [
            "Tata Group — GenAI Data Analytics: AI-driven analytics dashboards",
            "Deloitte Australia — Data Analytics, Tech Consulting & Cyber Security",
            "Accenture — Software Engineering: Industry-grade dev practices",
            "JPMorgan Chase — Software Engineering: Financial data applications",
            "AWS — Solutions Architecture: Scalable cloud infrastructure design",
        ],
    },
];

export default function ExperienceSection() {
    return (
        <SectionWrapper id="experience">
            <SectionTitle title="Work Experience" subtitle="Professional journey and real-world impact" />

            <div className="relative max-w-4xl mx-auto">
                {/* Timeline spine */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/30 to-transparent" />

                {experiences.map((exp, i) => (
                    <motion.div
                        key={exp.company}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className="relative flex gap-8 mb-10"
                    >
                        {/* Timeline dot */}
                        <div className="relative z-10 mt-6 shrink-0">
                            <div className={`w-3 h-3 rounded-full ${exp.dot}`} />
                        </div>

                        {/* Card */}
                        <div className={`flex-1 glass rounded-2xl p-7 border ${exp.color} card-hover`}>
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                                <div>
                                    <h3 className="font-space font-extrabold text-xl text-foreground">{exp.company}</h3>
                                    <p className="text-primary font-medium mt-0.5">{exp.role}</p>
                                    <span className="inline-block mt-1.5 text-xs font-medium bg-secondary/80 border border-border/50 px-2.5 py-1 rounded-full text-muted-foreground">
                                        {exp.type}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono text-xs font-medium text-muted-foreground bg-secondary/60 border border-border/40 px-3 py-1.5 rounded-lg block">
                                        {exp.period}
                                    </span>
                                    <span className="text-xs text-primary/70 mt-1 block">{exp.duration}</span>
                                </div>
                            </div>
                            <ul className="space-y-2.5">
                                {exp.bullets.map((b, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <span className="text-primary mt-0.5 text-base leading-none shrink-0">▸</span>
                                        <span className="leading-relaxed">{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}