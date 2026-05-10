import { cn } from '@/lib/utils';

const configs = {
    completed: { label: 'Completed', classes: 'bg-green-500/15 text-green-600 border-green-500/30' },
    running: { label: 'Running', classes: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
    pending: { label: 'Pending', classes: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30' },
    failed: { label: 'Failed', classes: 'bg-red-500/15 text-red-600 border-red-500/30' },
    uploaded: { label: 'Uploaded', classes: 'bg-green-500/15 text-green-600 border-green-500/30' },
    analyzing: { label: 'Analyzing', classes: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
    analyzed: { label: 'Analyzed', classes: 'bg-primary/15 text-primary border-primary/30' },
    draft: { label: 'Draft', classes: 'bg-muted text-muted-foreground border-border' },
    final: { label: 'Final', classes: 'bg-green-500/15 text-green-600 border-green-500/30' },
    high: { label: 'High Risk', classes: 'bg-red-500/15 text-red-600 border-red-500/30' },
    medium: { label: 'Medium Risk', classes: 'bg-orange-500/15 text-orange-600 border-orange-500/30' },
    low: { label: 'Low Risk', classes: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30' },
    none: { label: 'Fair', classes: 'bg-green-500/15 text-green-600 border-green-500/30' },
};

/**
 * @param {{ status: string, className?: string }} props
 */
export default function StatusBadge({ status, className }) {
    const cfg = configs[status] || { label: status, classes: 'bg-muted text-muted-foreground border-border' };
    return (
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', cfg.classes, className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
            {cfg.label}
        </span>
    );
}