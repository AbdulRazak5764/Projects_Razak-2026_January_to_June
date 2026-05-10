import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import StatusBadge from '@/components/StatusBadge';
import FairnessGauge from '@/components/FairnessGauge';
import { getMitigationFunction, computeFairnessScore } from '@/lib/biasEngine';
import { format } from 'date-fns';
import { toast } from 'sonner';

const TECHNIQUES = [
    { value: 'reweighing', label: 'Reweighing', desc: 'Adjusts sample weights to reduce bias in the training data' },
    { value: 'calibrated_equalized_odds', label: 'Calibrated Equalized Odds', desc: 'Post-processing to equalize TPR/FPR across groups' },
    { value: 'disparate_impact_remover', label: 'Disparate Impact Remover', desc: 'Transforms features to reduce disparate impact' },
];

export default function Mitigation() {
    const queryClient = useQueryClient();
    const [running, setRunning] = useState(false);
    const [selected, setSelected] = useState(null);
    const [config, setConfig] = useState({ analysisId: '', technique: 'reweighing' });

    const { data: analyses = [] } = useQuery({
        queryKey: ['analyses'],
        queryFn: () => base44.entities.BiasAnalysis.list('-created_date', 50),
    });

    const { data: mitigations = [], isLoading } = useQuery({
        queryKey: ['mitigations'],
        queryFn: () => base44.entities.Mitigation.list('-created_date', 50),
    });

    const deleteMutation = useMutation({
        mutationFn: (/** @type {string} */ id) => base44.entities.Mitigation.delete(id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mitigations'] }); setSelected(null); toast.success('Mitigation deleted'); },
    });

    const runMitigation = async () => {
        if (!config.analysisId || !config.technique) {
            toast.error('Please select an analysis and a technique'); return;
        }
        setRunning(true);
        const analysis = analyses.find(a => a.id === config.analysisId);

        const mitigateFn = getMitigationFunction(config.technique);
        const improved = mitigateFn(
            analysis.statistical_parity || 0.3,
            analysis.disparate_impact || 0.7,
            analysis.equalized_odds_tpr || 0.2,
            analysis.equalized_odds_fpr || 0.15
        );

        const afterScore = computeFairnessScore(improved.spd, improved.di, improved.eoTpr, improved.eoFpr);
        const improvement = afterScore - (analysis.fairness_score || 0);

        const result = await base44.entities.Mitigation.create({
            analysis_id: config.analysisId,
            dataset_id: analysis.dataset_id,
            dataset_name: analysis.dataset_name,
            technique: config.technique,
            before_score: analysis.fairness_score || 0,
            after_score: afterScore,
            before_metrics: {
                statistical_parity: analysis.statistical_parity,
                disparate_impact: analysis.disparate_impact,
                equalized_odds_tpr: analysis.equalized_odds_tpr,
                equalized_odds_fpr: analysis.equalized_odds_fpr,
            },
            after_metrics: {
                statistical_parity: improved.spd,
                disparate_impact: improved.di,
                equalized_odds_tpr: improved.eoTpr,
                equalized_odds_fpr: improved.eoFpr,
            },
            improvement: parseFloat(improvement.toFixed(2)),
            status: 'completed',
        });

        queryClient.invalidateQueries({ queryKey: ['mitigations'] });
        setSelected(result);
        toast.success(`Mitigation complete! Score improved by +${improvement.toFixed(1)}`);
        setRunning(false);
    };

    const compData = selected ? [
        { metric: 'Stat. Parity', before: selected.before_metrics?.statistical_parity || 0, after: selected.after_metrics?.statistical_parity || 0 },
        { metric: 'Eq. Odds TPR', before: selected.before_metrics?.equalized_odds_tpr || 0, after: selected.after_metrics?.equalized_odds_tpr || 0 },
        { metric: 'Eq. Odds FPR', before: selected.before_metrics?.equalized_odds_fpr || 0, after: selected.after_metrics?.equalized_odds_fpr || 0 },
        { metric: 'Disp. Impact', before: 1 - (selected.before_metrics?.disparate_impact || 0), after: 1 - (selected.after_metrics?.disparate_impact || 0) },
    ] : [];

    const scoreLine = selected ? [
        { label: 'Before', score: selected.before_score },
        { label: 'After', score: selected.after_score },
    ] : [];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Bias Mitigation</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Apply algorithmic fairness techniques to reduce detected bias</p>
            </div>

            {/* Technique Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TECHNIQUES.map(t => (
                    <div
                        key={t.value}
                        onClick={() => setConfig(c => ({ ...c, technique: t.value }))}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200
              ${config.technique === t.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
                    >
                        <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center
              ${config.technique === t.value ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                            <Shield className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">{t.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    </div>
                ))}
            </div>

            {/* Config */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold mb-4">Apply Mitigation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-xs">Select Analysis *</Label>
                        <Select value={config.analysisId} onValueChange={v => setConfig(c => ({ ...c, analysisId: v }))}>
                            <SelectTrigger className="mt-1 h-9">
                                <SelectValue placeholder="Choose a bias analysis" />
                            </SelectTrigger>
                            <SelectContent>
                                {analyses.map(a => (
                                    <SelectItem key={a.id} value={a.id}>
                                        {a.dataset_name} — {a.sensitive_feature} (Score: {a.fairness_score})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs">Technique</Label>
                        <Select value={config.technique} onValueChange={v => setConfig(c => ({ ...c, technique: v }))}>
                            <SelectTrigger className="mt-1 h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TECHNIQUES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button onClick={runMitigation} disabled={running} className="mt-4 gap-2">
                    {running ? (
                        <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Applying...</>
                    ) : (
                        <><Play className="w-3.5 h-3.5" /> Apply Mitigation</>
                    )}
                </Button>
            </div>

            {/* Result */}
            {selected && (
                <div className="bg-card border border-border rounded-xl p-6 animate-slide-in">
                    <h3 className="text-sm font-semibold mb-4">Mitigation Results: {selected.dataset_name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex flex-col items-center bg-muted/30 rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-2">Before</p>
                            <FairnessGauge score={selected.before_score} />
                        </div>
                        <div className="flex flex-col items-center bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                            <p className="text-xs text-muted-foreground mb-2">After Mitigation</p>
                            <FairnessGauge score={selected.after_score} />
                        </div>
                        <div className="flex flex-col items-center justify-center bg-muted/30 rounded-xl p-4">
                            <div className="text-4xl font-bold font-mono-num text-green-500">
                                +{selected.improvement?.toFixed(1)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Score Improvement</p>
                            <StatusBadge status="completed" className="mt-2" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-3">Metric Comparison (Lower is Better)</h4>
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={compData} margin={{ left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
                                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                                    <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="before" fill="hsl(0,84%,60%)" name="Before" radius={[3, 3, 0, 0]} opacity={0.8} />
                                    <Bar dataKey="after" fill="hsl(142,72%,45%)" name="After" radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-3">Fairness Score Journey</h4>
                            <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={scoreLine}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} />
                                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                                    <Line type="monotone" dataKey="score" stroke="hsl(217,91%,60%)" strokeWidth={3} dot={{ r: 5, fill: 'hsl(217,91%,60%)' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* History */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-semibold">Mitigation History ({mitigations.length})</h3>
                </div>
                {mitigations.length === 0 ? (
                    <div className="p-12 text-center">
                        <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                        <p className="text-sm text-muted-foreground">No mitigations yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                {['Dataset', 'Technique', 'Score Before', 'Score After', 'Improvement', 'Status', 'Date', ''].map(h => (
                                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mitigations.map(m => (
                                <tr key={m.id} onClick={() => setSelected(m)} className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${selected?.id === m.id ? 'bg-primary/5' : ''}`}>
                                    <td className="py-3 px-4 font-medium">{m.dataset_name}</td>
                                    <td className="py-3 px-4 text-muted-foreground capitalize">{m.technique?.replace(/_/g, ' ')}</td>
                                    <td className="py-3 px-4 font-mono-num">{m.before_score}</td>
                                    <td className="py-3 px-4 font-mono-num">{m.after_score}</td>
                                    <td className="py-3 px-4 font-mono-num text-green-500">+{m.improvement}</td>
                                    <td className="py-3 px-4"><StatusBadge status={m.status} /></td>
                                    <td className="py-3 px-4 text-muted-foreground">{format(new Date(m.created_date), 'MMM d')}</td>
                                    <td className="py-3 px-4">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={e => { e.stopPropagation(); deleteMutation.mutate(m.id); }}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}