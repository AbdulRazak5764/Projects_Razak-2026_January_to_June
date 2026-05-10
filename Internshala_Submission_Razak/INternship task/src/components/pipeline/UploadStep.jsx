import React, { useState, useRef } from 'react';
import { Upload, Video, FileVideo, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function UploadStep({ onFileUploaded }) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [duration, setDuration] = useState(null);
    const inputRef = useRef(null);

    const [objectUrl, setObjectUrl] = useState(null);

    const readDuration = (f) => {
        const url = URL.createObjectURL(f);
        setObjectUrl(url);
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            setDuration(video.duration);
        };
        video.src = url;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) { setFile(f); readDuration(f); }
    };

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) { setFile(f); readDuration(f); }
    };

    const handleDemo = () => {
        const mockFile = { name: 'zoom_lecture_may2024.mp4', size: 524288000, type: 'video/mp4', _demoDuration: 45 * 60 };
        onFileUploaded(mockFile, 45 * 60);
    };

    const formatDur = (secs) => {
        if (!secs) return '';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}m ${s}s`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="text-center mb-8">
                <h2 className="font-space text-3xl font-bold gradient-text mb-3">Upload Your Lecture</h2>
                <p className="text-muted-foreground">Drop a Zoom/recorded lecture video — our AI will find the best clips automatically.</p>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'relative border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all duration-300 text-center group',
                    dragging
                        ? 'border-primary bg-primary/5 glow-cyan'
                        : file
                            ? 'border-primary/50 bg-primary/5'
                            : 'border-border/60 hover:border-primary/40 hover:bg-muted/20'
                )}
            >
                <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />

                <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                        'w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300',
                        file ? 'bg-primary/20 border border-primary/40' : 'bg-muted/50 border border-border group-hover:bg-primary/10 group-hover:border-primary/30'
                    )}>
                        {file ? (
                            <FileVideo className="w-9 h-9 text-primary" />
                        ) : (
                            <Upload className="w-9 h-9 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                    </div>

                    {file ? (
                        <>
                            <div>
                                <p className="font-semibold text-foreground">{file.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {(file.size / 1024 / 1024).toFixed(0)} MB
                                    {duration ? ` • ${formatDur(duration)}` : ''}
                                    {' '}• Ready to process
                                </p>
                            </div>
                            <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                ✓ File selected
                            </span>
                        </>
                    ) : (
                        <>
                            <div>
                                <p className="font-semibold text-foreground">Drag & drop your lecture video</p>
                                <p className="text-sm text-muted-foreground mt-1">MP4, MOV, AVI — up to 2GB</p>
                            </div>
                            <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                                or click to browse
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {file && (
                    <Button
                        onClick={() => onFileUploaded(file, duration, objectUrl)}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-semibold h-12 glow-cyan"
                    >
                        Start AI Analysis
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
                <Button
                    variant="outline"
                    onClick={handleDemo}
                    className={cn('gap-2 h-12', file ? '' : 'flex-1')}
                >
                    <Video className="w-4 h-4" />
                    Try with Demo Lecture
                </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                    { label: 'Transcription', desc: 'OpenAI Whisper', color: 'text-primary' },
                    { label: 'Smart Scoring', desc: 'Engagement AI', color: 'text-purple-400' },
                    { label: 'Auto Export', desc: '9:16 + 16:9', color: 'text-green-400' },
                ].map((f) => (
                    <div key={f.label} className="card-glass rounded-xl p-4 text-center">
                        <p className={`text-xs font-semibold ${f.color}`}>{f.label}</p>
                        <p className="text-muted-foreground text-xs mt-1">{f.desc}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}