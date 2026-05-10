import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Clock, Zap, Smartphone, Monitor, ArrowRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const fmt = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
};

const CLIP_META = [
    {
        id: 1, label: 'Hook Moment', durSec: 37,
        hookScore: 0.89, clarityScore: 0.94, keywordScore: 0.76,
        color: 'from-cyan-500/20 to-primary/10', borderColor: 'border-primary/30',
        badge: '🔥 Best Hook', badgeColor: 'bg-primary/20 text-primary border-primary/30',
    },
    {
        id: 2, label: 'Student Q&A', durSec: 48,
        hookScore: 0.71, clarityScore: 0.91, keywordScore: 0.83,
        color: 'from-purple-500/20 to-purple-400/10', borderColor: 'border-purple-500/30',
        badge: '💬 Q&A Gold', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
        id: 3, label: 'Key Insight', durSec: 38,
        hookScore: 0.81, clarityScore: 0.88, keywordScore: 0.90,
        color: 'from-orange-500/20 to-orange-400/10', borderColor: 'border-orange-500/30',
        badge: '💡 Key Insight', badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    },
];

function ScoreBar({ label, value, color }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className={`font-semibold ${color}`}>{(value * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color.includes('primary') ? 'bg-primary' : color.includes('green') ? 'bg-green-400' : 'bg-purple-400'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

function VideoClipPlayer({ videoUrl, startSec, endSec, isDemo }) {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const clipDur = endSec - startSec;

    useEffect(() => {
        const v = videoRef.current;
        if (!v || !videoUrl) return;
        v.currentTime = startSec;
    }, [startSec, videoUrl]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onTime = () => {
            if (v.currentTime >= endSec) {
                v.pause();
                v.currentTime = startSec;
                setPlaying(false);
                setProgress(0);
                return;
            }
            setProgress(((v.currentTime - startSec) / clipDur) * 100);
        };
        v.addEventListener('timeupdate', onTime);
        return () => v.removeEventListener('timeupdate', onTime);
    }, [startSec, endSec, clipDur]);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (playing) {
            v.pause();
            setPlaying(false);
        } else {
            v.currentTime = startSec;
            v.play();
            setPlaying(true);
        }
    };

    if (isDemo || !videoUrl) {
        return (
            <div className="relative aspect-video bg-muted/30 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
                <Monitor className="w-8 h-8 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center px-4">
                    Upload a real video<br />to preview clips
                </p>
                <div className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded">
                    {fmt(startSec)} – {fmt(endSec)}
                </div>
            </div>
        );
    }

    return (
        <div className="relative rounded-xl overflow-hidden border border-border/50 bg-black group">
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full aspect-video object-cover"
                playsInline
                preload="metadata"
                onLoadedMetadata={() => { if (videoRef.current) videoRef.current.currentTime = startSec; }}
            />
            {/* Overlay controls */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* Progress */}
                <div className="px-3 pb-1">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 pb-2">
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                        {playing
                            ? <Pause className="w-3.5 h-3.5 text-white" />
                            : <Play className="w-3.5 h-3.5 text-white ml-0.5" />}
                    </button>
                    <span className="text-xs text-white/80 font-mono">{fmt(startSec)} – {fmt(endSec)}</span>
                    <Volume2 className="w-3 h-3 text-white/50 ml-auto" />
                </div>
            </div>

            {/* Play button center when not playing */}
            {!playing && (
                <div
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-black/70 transition-colors">
                        <Play className="w-5 h-5 text-white ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ClipsStep({ duration, videoUrl, onViewMetadata, onBack }) {
    const d = duration || 45 * 60;
    const isDemo = !videoUrl || videoUrl.startsWith('demo');

    const clips = useMemo(() => CLIP_META.map((c, i) => {
        const starts = [Math.floor(d * 0.03), Math.floor(d * 0.35), Math.floor(d * 0.71)];
        const s = starts[i];
        return { ...c, startSec: s, endSec: s + c.durSec, timestamp: `${fmt(s)} – ${fmt(s + c.durSec)}`, duration: `${c.durSec}s` };
    }), [d]);

    return (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
                <h2 className="font-space text-3xl font-bold gradient-text mb-2">3 Best Clips Found</h2>
                <p className="text-muted-foreground">Click play on any clip to preview it directly from your video</p>
            </div>

            <div className="flex justify-center gap-3">
                {[{ icon: Monitor, label: '16:9 — YouTube' }, { icon: Smartphone, label: '9:16 — Reels/Shorts' }].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 bg-muted/40 border border-border/60 rounded-full px-4 py-2 text-sm text-muted-foreground">
                        <Icon className="w-4 h-4" /><span>{label}</span>
                    </div>
                ))}
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                {clips.map((clip, i) => (
                    <motion.div
                        key={clip.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className={cn('relative card-glass rounded-2xl p-4 border', clip.borderColor)}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${clip.color} rounded-2xl opacity-60`} />
                        <div className="relative z-10 space-y-3">
                            {/* Badge + label */}
                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${clip.badgeColor}`}>{clip.badge}</span>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />{clip.duration}
                                </div>
                            </div>

                            <h3 className="font-space font-bold text-sm">{clip.label}</h3>

                            {/* VIDEO PLAYER */}
                            <VideoClipPlayer
                                videoUrl={videoUrl}
                                startSec={clip.startSec}
                                endSec={clip.endSec}
                                isDemo={isDemo}
                            />

                            {/* Scores */}
                            <div className="space-y-1.5 pt-1">
                                <ScoreBar label="Hook Score" value={clip.hookScore} color="text-primary" />
                                <ScoreBar label="Clarity" value={clip.clarityScore} color="text-green-400" />
                                <ScoreBar label="Keywords" value={clip.keywordScore} color="text-purple-400" />
                            </div>

                            <Button
                                size="sm"
                                onClick={() => onViewMetadata(i)}
                                className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 gap-2 text-xs"
                                variant="ghost"
                            >
                                Titles & Metadata <ArrowRight className="w-3 h-3" />
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary */}
            <div className="card-glass rounded-2xl p-5 border border-border/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {[
                        { label: 'Clips Found', value: '3', color: 'text-primary' },
                        { label: 'Total Files', value: '6', sub: '(2 formats each)', color: 'text-green-400' },
                        { label: 'Avg. Clarity', value: '91%', color: 'text-purple-400' },
                        { label: 'Best Hook', value: '89%', color: 'text-orange-400' },
                    ].map(({ label, value, sub, color }) => (
                        <div key={label}>
                            <p className={`text-2xl font-bold font-space ${color}`}>{value}</p>
                            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                            <p className="text-xs text-muted-foreground mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}