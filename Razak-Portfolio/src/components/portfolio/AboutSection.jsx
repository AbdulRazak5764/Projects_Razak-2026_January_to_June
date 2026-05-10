import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { Brain, BookOpen, Code2, Database, Zap, Target } from "lucide-react";

const highlights = [
    { icon: Brain, label: "ML / Deep Learning", desc: "TensorFlow · PyTorch · CNNs · LSTMs", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
    { icon: BookOpen, label: "AI Researcher", desc: "4 papers · Healthcare AI · Medical Imaging", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
    { icon: Code2, label: "Full-Stack Dev", desc: "React · Django · Node.js · REST APIs", color: "text-chart-3", bg: "bg-chart-3/10 border-chart-3/20" },
    { icon: Database, label: "Data Engineer", desc: "ETL Pipelines · 50GB+ Datasets · SQL/NoSQL", color: "text-chart-4", bg: "bg-chart-4/10 border-chart-4/20" },
    { icon: Zap, label: "NLP & Vision", desc: "BERT · Transformers · Object Detection", color: "text-chart-5", bg: "bg-chart-5/10 border-chart-5/20" },
    { icon: Target, label: "Problem Solver", desc: "100+ LeetCode · 3★ CodeChef · DSA", color: "text-chart-2", bg: "bg-chart-2/10 border-chart-2/20" },
];

export default function AboutSection() {
    return (
        <SectionWrapper id="about">
            <SectionTitle title="About Me" subtitle="Bridging research and real-world AI impact" />

            <div className="grid lg:grid-cols-5 gap-12 items-start">
                {/* Left: Text */}
                <div className="lg:col-span-2 space-y-5">
                    <div className="glass rounded-2xl p-6 border-gradient">
                        <p className="font-mono text-xs text-primary mb-3 tracking-widest">// professional_summary</p>
                        <p className="text-muted-foreground leading-relaxed">
                            B.Tech CSE student at <span className="text-foreground font-medium">Chaitanya University</span> with a <span className="text-primary font-bold">9.90/10 CGPA</span> (Top 2%). Aspiring Machine Learning Engineer building innovative AI solutions.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Published <span className="text-foreground font-medium">4 research papers</span> in healthcare AI, developed systems handling <span className="text-foreground font-medium">10,000+ daily requests</span>, and built medical imaging datasets with <span className="text-primary font-medium">71,220+ patient records</span>.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            Passionate about translating cutting-edge AI research into real-world clinical applications that create measurable impact.
                        </p>
                    </div>

                    <div className="glass rounded-2xl p-5">
                        <p className="font-mono text-xs text-primary mb-4 tracking-widest">// quick_facts</p>
                        <div className="space-y-2.5">
                            {[
                                ["📍 Location", "Kurnool, Andhra Pradesh"],
                                ["🎓 Degree", "B.Tech CSE (2023–2027)"],
                                ["🏆 Rank", "Top 2% of Department"],
                                ["💼 Status", "Available for Internships"],
                                ["📧 Email", "abdulrazakshaik87@gmail.com"],
                            ].map(([k, v]) => (
                                <div key={k} className="flex items-center gap-3 text-sm">
                                    <span className="text-muted-foreground w-28 shrink-0">{k}</span>
                                    <span className="text-foreground font-medium">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Highlight Cards */}
                <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {highlights.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`glass rounded-xl p-5 border card-hover cursor-default`}
                        >
                            <div className={`w-10 h-10 rounded-xl border ${item.bg} flex items-center justify-center mb-3`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <h3 className="font-space font-semibold text-sm text-foreground mb-1">{item.label}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}