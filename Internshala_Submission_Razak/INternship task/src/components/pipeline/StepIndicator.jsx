import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StepIndicator({ steps, currentStep }) {
    return (
        <div className="flex items-center justify-center gap-0">
            {steps.map((step, index) => {
                const isDone = index < currentStep;
                const isActive = index === currentStep;

                return (
                    <React.Fragment key={step}>
                        {/* Step circle */}
                        <div className="flex flex-col items-center gap-2">
                            <div className={cn(
                                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500',
                                isDone
                                    ? 'bg-primary border-primary text-primary-foreground glow-cyan'
                                    : isActive
                                        ? 'bg-primary/10 border-primary text-primary glow-cyan'
                                        : 'bg-muted/30 border-border/50 text-muted-foreground'
                            )}>
                                {isDone ? <Check className="w-4 h-4" /> : index + 1}
                            </div>
                            <span className={cn(
                                'text-xs font-medium transition-colors duration-300 hidden sm:block',
                                isActive ? 'text-primary' : isDone ? 'text-foreground' : 'text-muted-foreground'
                            )}>
                                {step}
                            </span>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div className={cn(
                                'h-0.5 w-16 sm:w-24 mx-1 mb-5 transition-all duration-700',
                                index < currentStep ? 'bg-primary glow-cyan' : 'bg-border/40'
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
