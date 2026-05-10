import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const configs = {
    high: { icon: AlertCircle, bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-500', label: 'Critical Bias Alert' },
    medium: { icon: AlertTriangle, bg: 'bg-orange-500/10 border-orange-500/30', text: 'text-orange-500', label: 'Moderate Bias Detected' },
    low: { icon: Info, bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-500', label: 'Low Fairness Warning' },
    none: { icon: CheckCircle, bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-500', label: 'Model is Fair' },
};

/**
 * @param {{ level?: 'high' | 'medium' | 'low' | 'none', message?: React.ReactNode, dismissible?: boolean }} props
 */
export default function AlertBanner({ level = 'none', message, dismissible = true }) {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;

    const cfg = configs[level] || configs.none;
    const Icon = cfg.icon;

    return (
        <div className={cn('flex items-start gap-3 p-4 rounded-lg border animate-slide-in', cfg.bg)}>
            <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', cfg.text)} />
            <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', cfg.text)}>{cfg.label}</p>
                {message && <p className="text-xs text-muted-foreground mt-0.5">{message}</p>}
            </div>
            {dismissible && (
                <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}