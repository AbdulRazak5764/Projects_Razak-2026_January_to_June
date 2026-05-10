import { motion } from "framer-motion";
import { FileText, GraduationCap, FolderGit2, Briefcase, Award, Star } from "lucide-react";

const stats = [
    { icon: FileText, value: "4", label: "Research Papers", sublabel: "1 Published · 2 Under Review", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
    { icon: GraduationCap, value: "9.90", label: "CGPA", sublabel: "Top 2% of Department", color: "text-chart-2", bg: "bg-chart-2/10 border-chart-2/20" },
    { icon: FolderGit2, value: "90+", label: "GitHub Repos", sublabel: "Open Source Projects", color: "text-chart-3", bg: "bg-chart-3/10 border-chart-3/20" },
    { icon: Award, value: "13+", label: "Certifications", sublabel: "Google · IBM · AWS · Forage", color: "text-chart-4", bg: "bg-chart-4/10 border-chart-4/20" },
    { icon: Briefcase, value: "5+", label: "Internships", sublabel: "Across ML, Web, Data", color: "text-chart-5", bg: "bg-chart-5/10 border-chart-5/20" },
    { icon: Star, value: "15+", label: "Projects Built", sublabel: "Production & Research", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
];

export default function StatsSection() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className={`glass rounded-2xl p-5 text-center border card-hover`}
                        >
                            <div className={`w-10 h-10 rounded-xl border ${s.bg} flex items-center justify-center mx-auto mb-3`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <p className={`font-space text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                            <p className="text-xs font-semibold text-foreground mt-0.5">{s.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{s.sublabel}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}