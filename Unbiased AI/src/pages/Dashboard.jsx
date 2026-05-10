import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
    BarChart2, Database, AlertTriangle,
    ArrowRight, Upload, Activity
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/MetricCard';
import FairnessGauge from '@/components/FairnessGauge';
import AlertBanner from '@/components/AlertBanner';
import StatusBadge from '@/components/StatusBadge';
import { format } from 'date-fns';

const TREND_DATA = [
    { month: 'Oct', fairness: 52, bias: 48 },
    { month: 'Nov', fairness: 58, bias: 42 },
    { month: 'Dec', fairness: 55, bias: 45 },
    { month: 'Jan', fairness: 63, bias: 37 },
    { month: 'Feb', fairness: 71, bias: 29 },
    { month: 'Mar', fairness: 68, bias: 32 },
    { month: 'Apr', fairness: 76, bias: 24 },
];

const COMPARISON_DATA = [
    { metric: 'Stat. Parity', before: 0.34, after: 0.12 },
    { metric: 'Disp. Impact', before: 0.61, after: 0.88 },
    { metric: 'Eq. Odds TPR', before: 0.28, after: 0.09 },
    { metric: 'Eq. Odds FPR', before: 0.19, after: 0.07 },
    { metric: 'Demo. Parity', before: 0.31, after: 0.10 },
];

export default function Dashboard() {
    const { data: datasets = [] } = useQuery({
        queryKey: ['datasets'],
        queryFn: () => base44.entities.Dataset.list('-created_date', 5),
    });

    const { data: analyses = [] } = useQuery({
        queryKey: ['analyses_dashboard'],
        queryFn: () => base44.entities.BiasAnalysis.list('-created_date', 5),
    });

    const { data: reports = [] } = useQuery({
        queryKey: ['reports_dashboard'],
        queryFn: () => base44.entities.Report.list('-created_date', 3),
    });

    const avgFairness = analyses.length
        ? Math.round(analyses.reduce((s, a) => s + (a.fairness_score || 0), 0) / analyses.length)
        : 0;

    const highRiskCount = analyses.filter(a => a.alert_level === 'high').length;
    const topAlert = analyses.find(a => a.alert_level === 'high' || a.alert_level === 'medium');

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">AI Fairness Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')} · Real-time bias monitoring
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/datasets">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="w-3.5 h-3.5" /> Upload Dataset
                        </Button>
                    </Link>
                    <Link to="/bias-analysis">
                        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                            <BarChart2 className="w-3.5 h-3.5" /> New Analysis
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Alert */}
            {topAlert && (
                <AlertBanner
                    level={topAlert.alert_level}
                    message={`Dataset "${topAlert.dataset_name}" shows significant bias on ${topAlert.sensitive_feature}. Fairness score: ${topAlert.fairness_score}`}
                />
            )}
            {!topAlert && analyses.length > 0 && (
                <AlertBanner level="none" message="All analyzed models meet fairness thresholds." />
            )}

            {/* Top KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Avg. Fairness Score"
                    value={avgFairness || '–'}
                    unit=""
                    icon={Activity}
                    status={avgFairness >= 75 ? 'good' : avgFairness >= 60 ? 'warning' : 'bad'}
                    description="Across all analyses"
                    trend={4.2}
                />
                <MetricCard
                    title="Datasets"
                    value={datasets.length}
                    icon={Database}
                    description="Total uploaded"
                    trend={datasets.length > 0 ? 1 : 0}
                />
                <MetricCard
                    title="Analyses Run"
                    value={analyses.length}
                    icon={BarChart2}
                    description="Total bias checks"
                    trend={0}
                />
                <MetricCard
                    title="High Risk Models"
                    value={highRiskCount}
                    icon={AlertTriangle}
                    status={highRiskCount > 0 ? 'bad' : 'good'}
                    description="Need immediate action"
                    trend={highRiskCount > 0 ? -1 : 1}
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fairness Gauge */}
                <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Overall Fairness Score</h3>
                    <FairnessGauge score={avgFairness || 0} />
                    <div className="mt-4 w-full grid grid-cols-3 gap-2 text-center">
                        {[
                            { label: 'Stat. Parity', value: analyses[0]?.statistical_parity?.toFixed(3) || '—' },
                            { label: 'Disp. Impact', value: analyses[0]?.disparate_impact?.toFixed(3) || '—' },
                            { label: 'Eq. Odds', value: analyses[0]?.equalized_odds_tpr?.toFixed(3) || '—' },
                        ].map(m => (
                            <div key={m.label} className="bg-muted/50 rounded-lg p-2">
                                <p className="text-xs font-mono-num font-semibold text-foreground">{m.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fairness Trend */}
                <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground">Fairness Score Trend</h3>
                        <span className="text-xs text-muted-foreground">Last 7 months</span>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={TREND_DATA} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                            <defs>
                                <linearGradient id="fairnessGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(217,91%,60%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Area type="monotone" dataKey="fairness" stroke="hsl(217,91%,60%)" fill="url(#fairnessGrad)" strokeWidth={2} name="Fairness" />
                            <Area type="monotone" dataKey="bias" stroke="hsl(0,84%,60%)" fill="transparent" strokeWidth={2} strokeDasharray="4 2" name="Bias Level" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Model Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground">Before vs After Mitigation</h3>
                        <span className="text-xs text-green-500 font-medium">Reweighing applied</span>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={COMPARISON_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -25 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                            />
                            <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="before" fill="hsl(0,84%,60%)" name="Before" radius={[3, 3, 0, 0]} opacity={0.8} />
                            <Bar dataKey="after" fill="hsl(142,72%,45%)" name="After" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Analyses Table */}
                <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-foreground">Recent Analyses</h3>
                        <Link to="/bias-analysis" className="text-xs text-primary hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {analyses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            No analyses yet. Upload a dataset to get started.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {analyses.slice(0, 4).map(a => (
                                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <BarChart2 className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{a.dataset_name || 'Unknown'}</p>
                                        <p className="text-xs text-muted-foreground">{a.sensitive_feature} · {format(new Date(a.created_date), 'MMM d')}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-mono-num font-bold text-foreground">{a.fairness_score || '–'}</p>
                                        <StatusBadge status={a.alert_level || 'none'} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Datasets */}
            <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Recent Datasets</h3>
                    <Link to="/datasets" className="text-xs text-primary hover:underline flex items-center gap-1">
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                {datasets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        No datasets uploaded yet.{' '}
                        <Link to="/datasets" className="text-primary hover:underline">Upload your first dataset</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Rows</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Columns</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Uploaded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasets.map(d => (
                                    <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                        <td className="py-2.5 px-3 font-medium">{d.name}</td>
                                        <td className="py-2.5 px-3 font-mono-num text-muted-foreground">{d.row_count?.toLocaleString() || '–'}</td>
                                        <td className="py-2.5 px-3 font-mono-num text-muted-foreground">{d.column_count || '–'}</td>
                                        <td className="py-2.5 px-3"><StatusBadge status={d.status} /></td>
                                        <td className="py-2.5 px-3 text-muted-foreground">{format(new Date(d.created_date), 'MMM d, yyyy')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}