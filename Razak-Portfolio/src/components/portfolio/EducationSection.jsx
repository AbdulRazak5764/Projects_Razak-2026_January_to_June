import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";

const education = [
    {
        degree: "B.Tech — Computer Science & Engineering",
        school: "Chaitanya Deemed to be University, Hyderabad",
        period: "2023 – 2027",
        score: "9.90 / 10",
        highlight: "Top 2% of Department",
        icon: "🎓",
        color: "border-primary/30 bg-primary/5",
        badge: "bg-primary/15 text-primary border-primary/30",
    },
    {
        degree: "Intermediate (MPC)",
        school: "Aaditya Junior College, Kurnool · State Board AP",
        period: "2021 – 2023",
        score: "92%",
        highlight: null,
        icon: "📚",
        color: "border-accent/30 bg-accent/5",
        badge: "bg-accent/15 text-accent border-accent/30",
    },
    {
        degree: "Secondary Education (Class X)",
        school: "Government High School · State Board",
        period: "2020 – 2021",
        score: "85%",
        highlight: null,
        icon: "🏫",
        color: "border-chart-3/30 bg-chart-3/5",
        badge: "bg-chart-3/15 text-chart-3 border-chart-3/30",
    },
];

export default function EducationSection() {
    return (
        <SectionWrapper id="education">
            <SectionTitle title="Education" subtitle="Academic foundation of excellence" />

            <div className="max-w-3xl mx-auto space-y-5">
                {education.map((edu, i) => (
                    <motion.div
                        key={edu.degree}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass rounded-2xl p-7 border ${edu.color} card-hover flex items-start gap-5`}
                    >
                        <div className="text-4xl shrink-0">{edu.icon}</div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                                <div>
                                    <h3 className="font-space font-extrabold text-foreground text-lg">{edu.degree}</h3>
                                    <p className="text-sm text-muted-foreground mt-0.5">{edu.school}</p>
                                </div>
                                <span className="font-mono text-xs text-muted-foreground bg-secondary/60 border border-border/40 px-3 py-1.5 rounded-lg shrink-0">
                                    {edu.period}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                <span className={`font-space font-bold text-lg px-3 py-1 rounded-xl border ${edu.badge}`}>
                                    {edu.score}
                                </span>
                                {edu.highlight && (
                                    <span className="text-xs font-medium text-muted-foreground bg-secondary/60 border border-border/40 px-3 py-1 rounded-full">
                                        🏆 {edu.highlight}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}