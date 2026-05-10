import React, { useState } from 'react';
import { Copy, Check, ArrowLeft, RefreshCw, Hash, Type, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CLIP_METADATA = [
    {
        title: "The One Concept That Changed How I Think About AI Forever",
        description: "Most people think AI is just pattern matching — but there's a deeper truth. In this clip, we break down why neural networks actually 'learn' and what that means for the future of machine intelligence. This is the insight that separates casual observers from real AI practitioners.",
        hashtags: ["#AIExplained", "#MachineLearning", "#NeuralNetworks", "#DeepLearning", "#AIEducation", "#TechInsights", "#DataScience", "#LearnAI"],
        score: 94,
        duration: "0:58",
        hook: "Most people think AI is just pattern matching...",
    },
    {
        title: "Why 90% of Data Scientists Get Feature Engineering Wrong",
        description: "Feature engineering is where the real magic happens in machine learning — yet most tutorials skip right past it. Here's the counterintuitive approach that consistently outperforms raw data models and why it matters for every real-world project.",
        hashtags: ["#DataScience", "#FeatureEngineering", "#MLTips", "#MachineLearning", "#DataEngineering", "#AITips", "#PythonML", "#MLOps"],
        score: 88,
        duration: "1:12",
        hook: "Feature engineering is where the real magic happens...",
    },
    {
        title: "This Simple Trick Cuts Model Training Time by 60%",
        description: "Waiting hours for your model to train? This one optimization technique — used by top ML engineers at Google and Meta — dramatically reduces training time without sacrificing accuracy. Simple to implement, massive impact.",
        hashtags: ["#MLOptimization", "#DeepLearning", "#AITips", "#ModelTraining", "#MachineLearning", "#DataScience", "#TechHacks", "#ProductivityTips"],
        score: 91,
        duration: "0:45",
        hook: "Waiting hours for your model to train?",
    },
];

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className={cn(
                'flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200',
                copied
                    ? 'bg-green-400/10 border-green-400/30 text-green-400'
                    : 'bg-muted/50 border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
            )}
        >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
}

function ScoreBadge({ score }) {
    const color = score >= 90 ? 'text-green-400 bg-green-400/10 border-green-400/30' :
        score >= 80 ? 'text-primary bg-primary/10 border-primary/30' :
            'text-orange-400 bg-orange-400/10 border-orange-400/30';
    return (
        <span className={cn('flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full border', color)}>
            <TrendingUp className="w-3.5 h-3.5" />
            {score}% Score
        </span>
    );
}

export default function MetadataStep({ clipIndex = 0, onBack, onReset }) {
    const [activeTab, setActiveTab] = useState('title');
    const data = CLIP_METADATA[clipIndex] || CLIP_METADATA[0];

    const tabs = [
        { id: 'title', label: 'Title', icon: Type },
        { id: 'description', label: 'Description', icon: FileText },
        { id: 'hashtags', label: 'Hashtags', icon: Hash },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-space text-3xl font-bold gradient-text">AI-Generated Metadata</h2>
                    <p className="text-muted-foreground mt-1">Optimized for maximum engagement & discoverability</p>
                </div>
                <div className="flex items-center gap-3">
                    <ScoreBadge score={data.score} />
                    <span className="text-sm text-muted-foreground bg-muted/30 border border-border/40 px-3 py-1 rounded-full">
                        Clip {clipIndex + 1} • {data.duration}
                    </span>
                </div>
            </div>

            {/* Hook preview */}
            <div className="card-glass rounded-xl p-4 mb-6 border-l-4 border-primary">
                <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">Hook Line</p>
                <p className="text-foreground font-medium italic">"{data.hook}"</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={cn(
                            'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                            activeTab === id
                                ? 'bg-primary/15 text-primary border border-primary/30'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
                        )}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* Content panels */}
            <div className="card-glass rounded-2xl p-6 min-h-[200px]">
                {activeTab === 'title' && (
                    <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Video Title</p>
                                <p className="text-foreground font-semibold text-lg leading-snug">{data.title}</p>
                                <p className="text-xs text-muted-foreground mt-3">{data.title.length} characters</p>
                            </div>
                            <CopyButton text={data.title} />
                        </div>
                    </motion.div>
                )}
                {activeTab === 'description' && (
                    <motion.div key="description" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Video Description</p>
                                <p className="text-foreground leading-relaxed">{data.description}</p>
                                <p className="text-xs text-muted-foreground mt-3">{data.description.length} characters</p>
                            </div>
                            <CopyButton text={data.description} />
                        </div>
                    </motion.div>
                )}
                {activeTab === 'hashtags' && (
                    <motion.div key="hashtags" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Trending Hashtags</p>
                            <CopyButton text={data.hashtags.join(' ')} />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.hashtags.map((tag) => (
                                <span key={tag} className="text-sm text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors cursor-default">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-all text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Clips
                </button>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all text-sm font-medium ml-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Process New Video
                </button>
            </div>
        </motion.div>
    );
}
