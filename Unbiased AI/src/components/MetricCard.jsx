import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @param {{ title: string, value: string | number, unit?: string, trend?: number, trendLabel?: string, status?: 'good' | 'warning' | 'bad' | string, description?: string, icon?: React.ElementType, large?: boolean }} props
 */
export default function MetricCard({ title, value, unit = '', trend, trendLabel, status, description, icon: Icon, large }) {
    const getStatusColor = () => {
        if (status === 'good') return 'text-green-500';
        if (status === 'warning') return 'text-yellow-500';
        if (status === 'bad') return 'text-destructive';
        return 'text-primary';
    };

    const getStatusBg = () => {
        if (status === 'good') return 'bg-green-500/10 border-green-500/20';
        if (status === 'warning') return 'bg-yellow-500/10 border-yellow-500/20';
        if (status === 'bad') return 'bg-destructive/10 border-destructive/20';
        return 'bg-primary/10 border-primary/20';
    };

    return (
        <div className={cn(
            'bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200 animate-slide-in',
            status && getStatusBg()
        )}>
            <div className="flex items-start justify-between mb-3">
                <div className={cn('p-2 rounded-lg', status ? getStatusBg() : 'bg-muted')}>
                    {Icon && <Icon className={cn('w-4 h-4', getStatusColor())} />}
                </div>
                {trend !== undefined && (
                    <div className={cn('flex items-center gap-1 text-xs font-medium',
                        trend > 0 ? 'text-green-500' : trend < 0 ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                        {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {trendLabel || `${Math.abs(trend)}%`}
                    </div>
                )}
            </div>
            <div className={cn('font-bold font-mono-num mt-1', large ? 'text-4xl' : 'text-2xl', getStatusColor())}>
                {value}{unit}
            </div>
            <p className="text-sm font-medium text-foreground mt-1">{title}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
    );
}