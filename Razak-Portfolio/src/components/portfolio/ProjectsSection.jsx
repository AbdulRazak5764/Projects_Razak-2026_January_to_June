import SectionWrapper from "./SectionWrapper";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

const projects = [
    {
        title: "MEGA-HEART",
        desc: "Comprehensive cardiovascular dataset through multi-source clinical data integration. Integrated 71,220+ patient records.",
        stats: "71,220+ records · 40% fewer inconsistencies · 15% better performance",
        tags: ["Python", "Pandas", "Healthcare AI", "ETL"],
        gradient: "from-rose-600/60 to-rose-900/80",
        github: "https://github.com/AbdulRazak5764/Mega-heart-II",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=700&q=80",
        // ECG / heart monitor image
    },
    {
        title: "Diabetes Prediction Framework",
        desc: "Ensemble ML on 580K+ multi-source healthcare records. Achieved 92.61% accuracy and 96.14% recall.",
        stats: "92.61% accuracy · 96.14% recall · 580K+ records",
        tags: ["Random Forest", "Scikit-learn", "Feature Engineering"],
        gradient: "from-blue-600/60 to-blue-900/80",
        github: "https://github.com/AbdulRazak5764/Machine_learning",
        image: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=700&q=80",
        // Medical lab / blood test image
    },
    {
        title: "DR-MERGE",
        desc: "Large-scale multi-source retinal image dataset for diabetic retinopathy. Published in IJASIS 2026.",
        stats: "17,976 retinal images · MD5 deduplication · Published IJASIS",
        tags: ["Computer Vision", "Medical Imaging", "Data Pipeline"],
        gradient: "from-emerald-600/60 to-emerald-900/80",
        github: "https://github.com/AbdulRazak5764/Braintumor",
        image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=700&q=80",
        // Eye / retina examination image
    },
    {
        title: "BraTumDB-1.0",
        desc: "Unified brain tumor MRI benchmark from 6 public sources. Removed 5,727 duplicates using MD5 hashing.",
        stats: "8,927 MRI scans · 5,727 duplicates removed · 256×256px",
        tags: ["Medical Imaging", "MD5 Hashing", "Data Curation"],
        gradient: "from-violet-600/60 to-violet-900/80",
        github: "https://github.com/AbdulRazak5764/Braintumor",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&q=80",
        // Brain MRI scan image
    },
    {
        title: "SmartRecruit AI",
        desc: "Intelligent talent acquisition using Generative AI — cut screening time by 80%, improved matching by 31%.",
        stats: "80% screening reduction · 31% better matching · 60% response boost",
        tags: ["Google Gemini", "n8n", "Firebase", "Next.js"],
        gradient: "from-amber-600/60 to-amber-900/80",
        github: "https://github.com/AbdulRazak5764/Project_Ai-Resume-Scanner",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=700&q=80",
        // Resume / hiring / recruitment image
    },
    {
        title: "Real-Time DR Detection",
        desc: "CNN-based system detecting diabetic retinopathy stages from retinal images. 94% accuracy.",
        stats: "94% accuracy · 70% faster screening · 1000+ monthly screenings",
        tags: ["CNN", "Flask", "Medical AI", "Web App"],
        gradient: "from-cyan-600/60 to-cyan-900/80",
        github: "https://github.com/AbdulRazak5764/Project_AI_CROP_FOR_DEPLOYMENT",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=80",
        // Doctor / medical imaging / ophthalmology
    },
    {
        title: "t-DNA (LSTM)",
        desc: "Temporal retinal DNA framework predicting 3-year DR progression with LSTM networks.",
        stats: "89% accuracy · 3-year prediction · Journal of Medical AI",
        tags: ["LSTM", "Deep Learning", "Time Series"],
        gradient: "from-indigo-600/60 to-indigo-900/80",
        github: "https://github.com/AbdulRazak5764/Machine_learning",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80",
        // Data visualization / neural network chart
    },
    {
        title: "Speech Emotion Recognition",
        desc: "Real-time emotion recognition classifying 7 emotions from speech audio using MFCC features.",
        stats: "87% accuracy · 7 emotions · Real-time processing",
        tags: ["Librosa", "Signal Processing", "SVM", "Flask"],
        gradient: "from-pink-600/60 to-pink-900/80",
        github: "https://github.com/AbdulRazak5764/SER-PRO",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=700&q=80",
        // Waveform / audio spectrum / microphone
    },
    {
        title: "Fake News Detection",
        desc: "NLP-based classifier using BERT embeddings and attention mechanisms. 92% accuracy on 10,000+ articles.",
        stats: "92% accuracy · 10,000+ articles · BERT embeddings",
        tags: ["BERT", "Transformers", "NLP", "MongoDB"],
        gradient: "from-red-600/60 to-red-900/80",
        github: "https://github.com/AbdulRazak5764/Fake-Email-Detection",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&q=80",
        // News / newspaper / media fact check
    },
    {
        title: "Customer Churn Prediction",
        desc: "Industry-grade XGBoost ensemble predicting customer churn. Improved retention strategies by 25%.",
        stats: "88% precision · 25% retention improvement · XGBoost",
        tags: ["XGBoost", "Random Forest", "Tableau", "Feature Engineering"],
        gradient: "from-teal-600/60 to-teal-900/80",
        github: "https://github.com/AbdulRazak5764/tcs-industry-project-customer-churn",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80",
        // Business analytics / dashboard / data charts
    },
    {
        title: "AI Crop Disease Detection",
        desc: "AI-powered crop disease prediction system for farmers. CNN-based, production deployed.",
        stats: "Production deployed · Farmer-facing · CNN-based",
        tags: ["CNN", "Flask", "React", "Agriculture AI"],
        gradient: "from-green-600/60 to-green-900/80",
        github: "https://github.com/AbdulRazak5764/Project_AI_CROP_FOR_DEPLOYMENT",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&q=80",
        // Agricultural field / crop farming
    },
    {
        title: "Unbiased AI Decision Tool",
        desc: "AI fairness and bias detection toolkit ensuring ethical decision-making in ML models.",
        stats: "Fairness metrics · Bias detection · Ethical AI",
        tags: ["Fairness AI", "Python", "Ethics", "ML"],
        gradient: "from-orange-600/60 to-orange-900/80",
        github: "https://github.com/AbdulRazak5764/Unbiased-AI-Decision-Tool",
        image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=700&q=80",
        // AI / neural network abstract
    },
    {
        title: "Face Recognition Attendance",
        desc: "Automated attendance system using face recognition. 96% accuracy under varying lighting conditions.",
        stats: "96% recognition accuracy · OpenCV · Auto-reporting",
        tags: ["OpenCV", "Face Recognition", "Python", "SQLite"],
        gradient: "from-slate-600/60 to-slate-900/80",
        github: "https://github.com/AbdulRazak5764/TECH-TITANS",
        image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=700&q=80",
        // Facial recognition / biometric / camera
    },
    {
        title: "BhoomiNova SARR",
        desc: "Smart agricultural resource recommendation system using AI for optimal crop yield.",
        stats: "Resource optimization · AI recommendations · Farmer-focused",
        tags: ["Python", "ML", "Agriculture", "Flask"],
        gradient: "from-lime-600/60 to-lime-900/80",
        github: "https://github.com/AbdulRazak5764/BhoomiNova-SARR",
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=700&q=80",
        // Smart farming / agricultural tech
    },
];

export default function ProjectsSection() {
    return (
        <SectionWrapper id="projects">
            <SectionTitle title="Featured Projects" subtitle="Building solutions that make a real difference" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(i * 0.05, 0.35) }}
                        className="glass rounded-2xl overflow-hidden card-hover group"
                    >
                        {/* Project Image */}
                        <div className="relative h-44 overflow-hidden">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Gradient overlay so text pops */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-75`} />

                            {/* GitHub button */}
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-3 right-3 p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:text-primary hover:bg-black/70 transition-all"
                                title="View on GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>

                            {/* Title overlay on image */}
                            <div className="absolute bottom-3 left-4 right-12">
                                <h3 className="font-space font-bold text-white text-base leading-tight drop-shadow-lg">
                                    {project.title}
                                </h3>
                            </div>
                        </div>

                        {/* Card body */}
                        <div className="p-5">
                            <p className="text-sm text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">{project.desc}</p>
                            <p className="text-xs text-primary/80 font-medium mb-3">{project.stats}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-secondary border border-border/50 text-muted-foreground">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* View All GitHub */}
            <div className="text-center mt-12">
                <a
                    href="https://github.com/AbdulRazak5764"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all font-medium hover:bg-primary/5"
                >
                    <Github className="w-5 h-5" />
                    View All 90+ Repositories on GitHub
                </a>
            </div>
        </SectionWrapper>
    );
}