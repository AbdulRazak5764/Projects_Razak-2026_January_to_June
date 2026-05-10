import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

/**
 * @param {{ score: number }} props
 */
export default function FairnessGauge({ score }) {
    const clampedScore = Math.max(0, Math.min(100, score || 0));

    const getColor = (s) => {
        if (s >= 75) return '#22c55e';
        if (s >= 60) return '#eab308';
        if (s >= 40) return '#f97316';
        return '#ef4444';
    };

    const getLabel = (s) => {
        if (s >= 75) return { text: 'Fair', color: 'text-green-500' };
        if (s >= 60) return { text: 'Moderate', color: 'text-yellow-500' };
        if (s >= 40) return { text: 'Biased', color: 'text-orange-500' };
        return { text: 'High Risk', color: 'text-red-500' };
    };

    const color = getColor(clampedScore);
    const label = getLabel(clampedScore);

    // Gauge data — semi-circle
    const filled = clampedScore / 100;
    const empty = 1 - filled;
    const data = [
        { value: filled, fill: color },
        { value: empty, fill: 'hsl(var(--muted))' },
    ];

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-24">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <span className={cn('text-3xl font-bold font-mono-num', label.color)}>{clampedScore}</span>
                </div>
            </div>
            <div className="mt-1 text-center">
                <span className={cn('text-sm font-semibold', label.color)}>{label.text}</span>
                <p className="text-xs text-muted-foreground mt-0.5">Fairness Score /100</p>
            </div>
        </div>
    );
}