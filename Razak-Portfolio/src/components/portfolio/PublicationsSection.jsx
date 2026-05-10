import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { ExternalLink, Clock, CheckCircle, Mic } from "lucide-react";

const publications = [
    {
        id: "01",
        title: "DR-MERGE: A Large-Scale Multi-Source Retinal Image Dataset for Diabetic Retinopathy via Systematic Integration and Deduplication",
        authors: "K. S. Chunchu, S. A. Razak, S. Saniya, A. K. Morya, R. P. Kumar",
        venue: "IJASIS, pp. 777–792, January 2026",
        doi: "10.29284/mfph5424",
        status: "Published",
        icon: CheckCircle,
        color: "text-chart-3",
        bg: "bg-chart-3/10 border-chart-3/30",
        highlight: "from-chart-3/20 to-transparent",
    },
    {
        id: "02",
        title: "MEGA-HEART: Comprehensive Cardiovascular Dataset through Multi-Source Clinical Data Integration",
        authors: "Shaik Abdul Razak et al.",
        venue: "ICCIC Conference, 12–13 December 2025",
        doi: null,
        status: "Conference",
        icon: Mic,
        color: "text-accent",
        bg: "bg-accent/10 border-accent/30",
        highlight: "from-accent/15 to-transparent",
    },
    {
        id: "03",
        title: "Comprehensive Diabetes Prediction Framework Using Ensemble ML on Multi-Source Healthcare Data",
        authors: "Shaik Abdul Razak et al.",
        venue: "Under Journal Review",
        doi: null,
        status: "Under Review",
        icon: Clock,
        color: "text-chart-4",
        bg: "bg-chart-4/10 border-chart-4/30",
        highlight: "from-chart-4/15 to-transparent",
    },
    {
        id: "04",
        title: "SmartRecruit AI: Intelligent Framework for Automated Talent Acquisition Using Generative AI",
        authors: "Shaik Abdul Razak et al.",
        venue: "Under Journal Review",
        doi: null,
        status: "Under Review",
        icon: Clock,
        color: "text-chart-4",
        bg: "bg-chart-4/10 border-chart-4/30",
        highlight: "from-chart-4/15 to-transparent",
    },
];

export default function PublicationsSection() {
    return (
        <SectionWrapper id="publications">
            <SectionTitle title="Research Publications" subtitle="Contributing to the frontiers of healthcare AI" />

            <div className="space-y-5 max-w-4xl mx-auto">
                {publications.map((pub, i) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative glass rounded-2xl p-7 overflow-hidden card-hover"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${pub.highlight} pointer-events-none`} />
                        <div className="relative z-10 flex items-start gap-5">
                            <div className={`shrink-0 w-12 h-12 rounded-xl border ${pub.bg} flex items-center justify-center`}>
                                <span className={`font-space font-bold text-sm ${pub.color}`}>{pub.id}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground leading-snug mb-2.5 text-base">{pub.title}</h3>
                                <p className="text-sm text-muted-foreground mb-1">{pub.authors}</p>
                                <p className="text-sm text-muted-foreground/70 mb-4 font-mono">{pub.venue}</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${pub.bg} ${pub.color}`}>
                                        <pub.icon className="w-3 h-3" />
                                        {pub.status}
                                    </span>
                                    {pub.doi && (
                                        <a
                                            href={`https://doi.org/${pub.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            doi:{pub.doi}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}