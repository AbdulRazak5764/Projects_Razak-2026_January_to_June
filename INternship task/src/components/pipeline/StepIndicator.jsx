import React from 'react';
import { Upload, Brain, Film, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = [Upload, Brain, Film, Sparkles];

export default function StepIndicator({ steps, currentStep }) {
    return (
        <div className="flex items-center justify-center gap-0">
            {steps.map((step, i) => {
                const Icon = ICONS[i];
                const isCompleted = i < currentStep;
                const isActive = i === currentStep;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500',
                                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                                    isActive && 'bg-primary/10 border-primary text-primary glow-cyan',
                                    !isCompleted && !isActive && 'bg-muted/30 border-border/50 text-muted-foreground'
                                )}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                            </div>
                            <span
                                className={cn(
                                    'text-xs font-medium transition-colors duration-300',
                                    isActive && 'text-primary',
                                    isCompleted && 'text-primary/70',
                                    !isActive && !isCompleted && 'text-muted-foreground'
                                )}
                            >
                                {step}
                            </span>
                        </div>

                        {i < steps.length - 1 && (
                            <div
                                className={cn(
                                    'h-px w-12 sm:w-20 mx-2 mb-5 transition-all duration-700',
                                    i < currentStep ? 'bg-primary' : 'bg-border/50'
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}