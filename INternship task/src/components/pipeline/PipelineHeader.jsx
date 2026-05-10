import React from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PipelineHeader({ onReset, currentStep }) {
    return (
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-space font-700 text-lg leading-none gradient-text">ClipForge AI</h1>
                        <p className="text-muted-foreground text-xs mt-0.5">Lecture → Viral Clips Pipeline</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        AI Pipeline Ready
                    </span>
                    {currentStep > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="text-muted-foreground hover:text-foreground gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span className="hidden sm:inline">New Upload</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}