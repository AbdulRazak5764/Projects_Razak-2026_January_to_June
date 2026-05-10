import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const certGroups = [
    {
        category: "Forage Virtual Programs",
        emoji: "🏢",
        certs: [
            { name: "Tata Group — GenAI Data Analytics", issuer: "Tata", link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/ifobHAoMjQs9s6bKS/gMTdCXwDdLYoXZ3wG_ifobHAoMjQs9s6bKS_jvnp4iqRCz7nbCeho_1751782659936_completion_certificate.pdf" },
            { name: "Deloitte — Data Analytics & Technology", issuer: "Deloitte", link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_jvnp4iqRCz7nbCeho_1751780687666_completion_certificate.pdf" },
            { name: "Deloitte — Technology Consulting", issuer: "Deloitte", link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_jvnp4iqRCz7nbCeho_1751644629399_completion_certificate.pdf" },
            { name: "Accenture — Software Engineering", issuer: "Accenture", link: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/xhih9yFWsf6AYfngd/HNpZwZcuYwona2d8Y_xhih9yFWsf6AYfngd_jvnp4iqRCz7nbCeho_1751958861670_completion_certificate.pdf" },
            { name: "AWS — Solutions Architecture", issuer: "Amazon", link: "https://www.theforage.com/completion-certificates/pmnMSL4QiQ9JCgE3W/kkE9HyeNcw6rwCRGw_pmnMSL4QiQ9JCgE3W_jvnp4iqRCz7nbCeho_1763651744125_completion_certificate.pdf" },
        ],
        color: "border-primary/25 bg-primary/5",
        badge: "bg-primary/10 text-primary border-primary/20",
    },
    {
        category: "IBM SkillsBuild",
        emoji: "💻",
        certs: [
            { name: "Java Fundamentals", issuer: "IBM", link: "https://drive.google.com/file/d/1eHIGbQLkK9i6bKYPjyLBBGrvTW_EX_gY/view" },
            { name: "Python Programming", issuer: "IBM", link: "https://drive.google.com/file/d/1SuHZChYKIe3oDKtIc-4iyICUGYJ41g7m/view" },
        ],
        color: "border-chart-2/25 bg-chart-2/5",
        badge: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    },
    {
        category: "Technical Internship Certificates",
        emoji: "📜",
        certs: [
            { name: "InternPro — Machine Learning Internship", issuer: "InternPro", link: "https://drive.google.com/file/d/1SCOTT3yf2WXsuKO9hbppxneqkyn6WIR5/view?usp=sharing" },
            { name: "StaxTech — Front-End Development", issuer: "StaxTech", link: "https://drive.google.com/file/d/1C_iX9hzz9vLfuzCdE42a72PVY6aTqkW7/view?usp=sharing" },
            { name: "GWING — Data Analyst Internship", issuer: "GWING", link: "https://drive.google.com/file/d/1Aq3VQNONAnk6z4RAhrX0HkW0bL7fA_j1/view?usp=sharing" },
            { name: "VaultofCodes — Java Programming", issuer: "VaultofCodes", link: "https://drive.google.com/file/d/1eZAiOOstnef3W8AQTV825J6LBOwVbIhq/view?usp=sharing" },
            { name: "SystemTron — DSA in C++", issuer: "SystemTron", link: "https://drive.google.com/file/d/1cZ_iQISBmSUitcL1jJd67ASHxJckX7sX/view?usp=sharing" },
        ],
        color: "border-accent/25 bg-accent/5",
        badge: "bg-accent/10 text-accent border-accent/20",
    },
];

export default function CertificationsSection() {
    return (
        <SectionWrapper id="certifications">
            <SectionTitle title="Certifications" subtitle="Continuous upskilling from industry leaders" />

            <div className="space-y-8">
                {certGroups.map((group, gi) => (
                    <motion.div
                        key={group.category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: gi * 0.1 }}
                        className={`glass rounded-2xl p-7 border ${group.color}`}
                    >
                        <h3 className="font-space font-bold text-foreground mb-5 flex items-center gap-2 text-lg">
                            <span className="text-2xl">{group.emoji}</span>
                            {group.category}
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {group.certs.map((cert, ci) => (
                                <motion.div
                                    key={cert.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: ci * 0.04 }}
                                    className="glass rounded-xl p-4 flex items-center justify-between gap-3 card-hover"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-foreground leading-snug">{cert.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{cert.issuer}</p>
                                    </div>
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`shrink-0 p-2 rounded-lg border ${group.badge} hover:scale-110 transition-all`}
                                        title="View Certificate"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}