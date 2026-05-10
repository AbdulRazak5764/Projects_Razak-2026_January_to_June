import React from 'react';
import { Zap, RotateCcw, Cpu } from 'lucide-react';

export default function PipelineHeader({ onReset, currentStep }) {
    return (
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-cyan">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <span className="font-space font-bold text-lg gradient-text">ClipForge</span>
                        <span className="text-muted-foreground text-sm ml-1">AI</span>
                    </div>
                    <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted/40 border border-border/50 px-2 py-0.5 rounded-full ml-2">
                        <Cpu className="w-3 h-3" />
                        Lecture Pipeline
                    </span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {currentStep > 0 && (
                        <button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/50"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            New Video
                        </button>
                    )}
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="AI Ready" />
                </div>
            </div>
        </header>
    );
}
