import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Mic, Brain, Scissors, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES = [
    { id: 'load', icon: Mic, label: 'Loading video file', detail: 'Reading audio stream...', duration: 1200 },
    { id: 'transcribe', icon: Mic, label: 'Transcribing with Whisper', detail: 'Detecting speech segments...', duration: 2800 },
    { id: 'analyze', icon: Brain, label: 'Analyzing engagement scores', detail: 'Hook · Clarity · Keyword density', duration: 2000 },
    { id: 'detect', icon: BarChart3, label: 'Detecting best clip moments', detail: 'Scoring words across timeline...', duration: 1800 },
    { id: 'export', icon: Scissors, label: 'Preparing clip boundaries', detail: 'FFmpeg timestamps calculated', duration: 1200 },
];

const fmt = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
};

const getClips = (duration) => {
    const d = duration || 45 * 60;
    const c1s = Math.floor(d * 0.03);
    const c2s = Math.floor(d * 0.35);
    const c3s = Math.floor(d * 0.71);
    return [
        { start: c1s, end: c1s + 37, label: 'hook' },
        { start: c2s, end: c2s + 48, label: 'question' },
        { start: c3s, end: c3s + 38, label: 'insight' },
    ];
};

const wordCount = (duration) => Math.round((duration || 45 * 60) * 2.4);

export default function AnalyzeStep({ file, duration, onDone }) {
    const [stageIndex, setStageIndex] = useState(0);
    const [completedStages, setCompletedStages] = useState([]);
    const [terminalLines, setTerminalLines] = useState([]);
    const [progress, setProgress] = useState(0);
    const terminalRef = useRef(null);

    const clips = useMemo(() => getClips(duration), [duration]);
    const words = useMemo(() => wordCount(duration), [duration]);

    const terminalData = useMemo(() => [
        { t: 500, text: `🎬 Loading video: input/${file?.name || 'lecture.mp4'}`, color: 'text-primary' },
        { t: 1300, text: '📝 Transcribing with Whisper... (model: base)', color: 'text-muted-foreground' },
        { t: 2500, text: `✅ Transcription complete. Found ${words.toLocaleString()} words.`, color: 'text-green-400' },
        { t: 3200, text: '🧠 Analyzing engagement scores...', color: 'text-purple-400' },
        { t: 3800, text: '   - Hook score (first 15s): 0.89 🔥', color: 'text-muted-foreground' },
        { t: 4200, text: '   - Audio clarity score: 0.94', color: 'text-muted-foreground' },
        { t: 4600, text: '   - Keyword density score: 0.76', color: 'text-muted-foreground' },
        { t: 5200, text: '🎯 Top 3 clips found:', color: 'text-primary' },
        { t: 5600, text: `   ├── Clip 1: ${fmt(clips[0].start)} → ${fmt(clips[0].end)} (hook)`, color: 'text-muted-foreground' },
        { t: 6000, text: `   ├── Clip 2: ${fmt(clips[1].start)} → ${fmt(clips[1].end)} (question)`, color: 'text-muted-foreground' },
        { t: 6400, text: `   └── Clip 3: ${fmt(clips[2].start)} → ${fmt(clips[2].end)} (insight)`, color: 'text-muted-foreground' },
        { t: 7000, text: '✂️  Exporting 16:9 & 9:16 clips via FFmpeg...', color: 'text-orange-400' },
        { t: 8500, text: '✅ 6 clips exported. Timestamps saved to best_clips.json', color: 'text-green-400' },
        { t: 9000, text: '✨ Done! Pipeline complete.', color: 'text-primary' },
    ], [file, words, clips]);

    useEffect(() => {
        let cumulative = 0;
        STAGES.forEach((stage, i) => {
            setTimeout(() => {
                setStageIndex(i);
                setProgress(Math.round((i / STAGES.length) * 100));
            }, cumulative);
            cumulative += stage.duration;
            setTimeout(() => {
                setCompletedStages((prev) => [...prev, stage.id]);
                setProgress(Math.round(((i + 1) / STAGES.length) * 100));
            }, cumulative - 200);
        });

        terminalData.forEach(({ t, text, color }) => {
            setTimeout(() => {
                setTerminalLines((prev) => [...prev, { text, color }]);
            }, t);
        });

        setTimeout(() => {
            setProgress(100);
            onDone();
        }, cumulative + 300);
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLines]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
        >
            <div className="text-center">
                <h2 className="font-space text-3xl font-bold gradient-text mb-2">AI Pipeline Running</h2>
                <p className="text-muted-foreground text-sm">
                    Analyzing <span className="text-foreground font-medium">{file?.name || 'lecture.mp4'}</span>
                    {duration ? <span className="text-muted-foreground"> — {Math.floor(duration / 60)}m {Math.floor(duration % 60)}s</span> : null}
                </p>
            </div>

            {/* Progress bar */}
            <div className="card-glass rounded-2xl p-6">
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground font-medium">Overall Progress</span>
                    <span className="text-primary font-bold">{progress}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full progress-bar-glow"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>

                <div className="mt-5 space-y-3">
                    {STAGES.map((stage, i) => {
                        const Icon = stage.icon;
                        const isDone = completedStages.includes(stage.id);
                        const isActive = stageIndex === i && !isDone;
                        return (
                            <div key={stage.id} className={cn('flex items-center gap-3 transition-opacity duration-300', i > stageIndex ? 'opacity-30' : 'opacity-100')}>
                                <div className={cn(
                                    'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300',
                                    isDone && 'bg-green-500/20 border border-green-500/40',
                                    isActive && 'bg-primary/20 border border-primary/40',
                                    !isDone && !isActive && 'bg-muted/30 border border-border/50'
                                )}>
                                    {isDone
                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                        : isActive
                                            ? <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                                            : <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn('text-sm font-medium', isDone ? 'text-green-400' : isActive ? 'text-primary' : 'text-muted-foreground')}>
                                        {stage.label}
                                    </p>
                                    {isActive && <p className="text-xs text-muted-foreground mt-0.5">{stage.detail}</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Terminal */}
            <div className="card-glass rounded-2xl overflow-hidden border border-border/50">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/70"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500/70"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500/70"></span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 font-mono">terminal — lecture_clipper.py</span>
                </div>
                <div ref={terminalRef} className="p-4 h-52 overflow-y-auto font-mono text-xs space-y-1">
                    <AnimatePresence>
                        {terminalLines.map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={line.color}
                            >
                                {line.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {progress < 100 && (
                        <span className="inline-block w-2 h-3.5 bg-primary animate-pulse ml-0.5" />
                    )}
                </div>
            </div>
        </motion.div>
    );
}