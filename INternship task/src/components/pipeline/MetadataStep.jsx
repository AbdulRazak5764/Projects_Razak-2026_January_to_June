import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Download, Check, ChevronLeft, Image, FileText, Hash, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CLIP_METADATA = [
    {
        clipLabel: 'Hook Moment (Clip 1)',
        timestamp: '00:01:15 – 00:01:52',
        titles: [
            'The 10-second rule that changed how I teach recursion',
            'Why students fail at recursion (and how to fix it fast)',
            "Your professor won't show you this mental model",
            'Watch this before your next Data Structures exam',
            'The #1 mistake beginners make with recursive functions',
        ],
        description: `Ever stared at a recursive function and felt completely lost? You're not alone — and in this clip, I break down the exact mental model that makes recursion "click" for most students in under 60 seconds.\n\nWe cover:\n✅ The call-stack intuition (no more guessing)\n✅ How to trace recursive calls visually\n✅ A 10-second sanity check before writing any recursive code\n\nThis moment is from a full 45-minute lecture on Data Structures — drop a comment if you want the full video! Perfect for CS students, coding bootcampers, and self-taught developers.\n\n#Recursion #DataStructures #ProgrammingTips #LearnToCode #CodingLecture`,
        thumbnailPrompt: 'A split-screen graphic: left side shows a confused student looking at tangled code on screen (dark background, red error glow); right side shows the same student with a lightbulb moment, clean code on screen with cyan neon glow. Bold text overlay: "RECURSION FINALLY EXPLAINED". Cinematic, high-contrast, modern tech aesthetic.',
    },
    {
        clipLabel: 'Student Q&A (Clip 2)',
        timestamp: '00:15:42 – 00:16:30',
        titles: [
            'DFS vs BFS — the answer most tutorials skip',
            'A student asked THIS and the whole class went quiet',
            'Finally: a clear explanation of graph traversal',
            'The real difference between depth-first and breadth-first',
            'This 48-second answer will save you hours of confusion',
        ],
        description: `One student's question turned into the best moment of the entire lecture. When asked "what's the *real* difference between DFS and BFS?", the answer revealed something most tutorials gloss over.\n\nIn this clip:\n✅ An intuitive analogy (no math needed)\n✅ When to use DFS vs BFS in real problems\n✅ The hidden trade-off nobody talks about\n\nThis is from a live CS lecture — the Q&A format makes complex concepts feel natural and approachable. Save this for your graph theory studies!\n\n#GraphTheory #DFS #BFS #ComputerScience #AlgorithmsExplained`,
        thumbnailPrompt: 'A classroom scene from student perspective: professor at whiteboard with two trees drawn — one going deep (DFS, purple glow) and one going wide (BFS, cyan glow). A hand is raised in the foreground. Bold white text: "DFS vs BFS — FINALLY CLEAR". Dark, dramatic lecture hall lighting with tech overlay elements.',
    },
    {
        clipLabel: 'Key Insight (Clip 3)',
        timestamp: '00:32:10 – 00:32:48',
        titles: [
            'This is the moment everything about stacks "clicked" for me',
            'Think of a call stack like THIS — you\'ll never forget it',
            'The analogy that makes memory management make sense',
            'What textbooks never tell you about the call stack',
            '38 seconds that will change how you debug forever',
        ],
        description: `At the 32-minute mark of this Data Structures lecture, something magical happened — the call stack finally made sense to everyone in the room. This clip captures that "aha!" moment.\n\nKey takeaways:\n✅ A real-world analogy for the call stack (works every time)\n✅ Why stack overflow errors happen (and how to prevent them)\n✅ How to mentally "simulate" a function call in your head\n\nIf you've ever been confused by debugging tools or memory errors, this 38-second insight is worth bookmarking. Drop a 🔥 if this helped!\n\n#CallStack #Debugging #ProgrammingForBeginners #DSA #TechEducation`,
        thumbnailPrompt: 'A dynamic visual of a glowing stack of plates/trays stacked high, each labeled with a function name (main, foo, bar), floating in dark space with purple and cyan neon lighting. A lightbulb explodes from the top. Bold text: "THE CALL STACK — FINALLY MAKES SENSE". Ultra-modern, vibrant, cinematic.',
    },
];

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors p-1">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}

export default function MetadataStep({ clipIndex, onBack, onReset }) {
    const [activeTab, setActiveTab] = useState('titles');
    const [selectedClip, setSelectedClip] = useState(clipIndex);
    const data = CLIP_METADATA[selectedClip];

    const tabs = [
        { id: 'titles', label: 'Titles', icon: Hash },
        { id: 'description', label: 'Description', icon: FileText },
        { id: 'thumbnail', label: 'Thumbnail Prompt', icon: Image },
    ];

    const handleDownload = () => {
        const content = `CLIP ${selectedClip + 1} METADATA
=====================
${data.clipLabel} | ${data.timestamp}

TITLES:
${data.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

DESCRIPTION:
${data.description}

THUMBNAIL PROMPT:
${data.thumbnailPrompt}
`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clip_${selectedClip + 1}_metadata.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
                <h2 className="font-space text-3xl font-bold gradient-text mb-2">AI-Generated Metadata</h2>
                <p className="text-muted-foreground">Titles, description & thumbnail prompts ready to copy</p>
            </div>

            {/* Clip selector */}
            <div className="flex gap-2">
                {CLIP_METADATA.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => setSelectedClip(i)}
                        className={cn(
                            'flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200',
                            selectedClip === i
                                ? 'bg-primary/15 border-primary/40 text-primary'
                                : 'bg-muted/30 border-border/50 text-muted-foreground hover:border-border'
                        )}
                    >
                        Clip {i + 1}
                    </button>
                ))}
            </div>

            {/* Clip label */}
            <div className="flex items-center gap-3 card-glass rounded-xl px-4 py-3 border border-border/50">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-foreground">{data.clipLabel}</p>
                    <p className="text-xs text-muted-foreground">{data.timestamp}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleDownload} className="gap-1.5 text-xs h-8">
                        <Download className="w-3 h-3" /> Export .txt
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200',
                            activeTab === id
                                ? 'bg-card text-primary border border-border/80 shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${selectedClip}-${activeTab}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'titles' && (
                        <div className="card-glass rounded-2xl p-5 border border-border/50 space-y-2">
                            <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                                <Hash className="w-3.5 h-3.5" /> 5 click-worthy title options
                            </p>
                            {data.titles.map((title, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/40 hover:border-primary/20 transition-all duration-200 group"
                                >
                                    <span className="text-xs text-muted-foreground w-4 flex-shrink-0 mt-0.5 font-mono">{i + 1}.</span>
                                    <p className="flex-1 text-sm text-foreground leading-relaxed">{title}</p>
                                    <CopyButton text={title} />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'description' && (
                        <div className="card-glass rounded-2xl p-5 border border-border/50">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5" /> YouTube description (150–200 words)
                                </p>
                                <CopyButton text={data.description} />
                            </div>
                            <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans bg-muted/20 rounded-xl p-4 border border-border/40 max-h-72 overflow-y-auto">
                                {data.description}
                            </pre>
                        </div>
                    )}

                    {activeTab === 'thumbnail' && (
                        <div className="card-glass rounded-2xl p-5 border border-border/50 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Image className="w-3.5 h-3.5" /> DALL-E / Midjourney prompt
                                </p>
                                <CopyButton text={data.thumbnailPrompt} />
                            </div>
                            <div className="bg-muted/20 rounded-xl p-4 border border-border/40 border-dashed">
                                <p className="text-sm text-foreground leading-relaxed italic">{data.thumbnailPrompt}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                <span>Paste this prompt into DALL-E 3, Midjourney, or Ideogram to generate your thumbnail.</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Bottom actions */}
            <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ChevronLeft className="w-4 h-4" /> Back to Clips
                </Button>
                <Button onClick={onReset} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 glow-cyan font-semibold">
                    <RefreshCw className="w-4 h-4" /> Process New Lecture
                </Button>
            </div>
        </motion.div>
    );
}