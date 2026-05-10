import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from '@/components/StatusBadge';
import FairnessGauge from '@/components/FairnessGauge';
import { format } from 'date-fns';
import { toast } from 'sonner';

const REPORT_TYPES = [
    { value: 'bias_audit', label: 'Bias Audit Report' },
    { value: 'compliance', label: 'Compliance Report' },
    { value: 'executive_summary', label: 'Executive Summary' },
    { value: 'technical', label: 'Technical Deep-Dive' },
];

export default function Reports() {
    const queryClient = useQueryClient();
    const [generating, setGenerating] = useState(false);
    const [viewing, setViewing] = useState(null);
    const [form, setForm] = useState({ title: '', analysisId: '', reportType: 'bias_audit' });

    const { data: analyses = [] } = useQuery({
        queryKey: ['analyses'],
        queryFn: () => base44.entities.BiasAnalysis.list('-created_date', 50),
    });

    const { data: mitigations = [] } = useQuery({
        queryKey: ['mitigations'],
        queryFn: () => base44.entities.Mitigation.list('-created_date', 50),
    });

    const { data: reports = [], isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: () => base44.entities.Report.list('-created_date', 50),
    });

    const deleteMutation = useMutation({
        mutationFn: (/** @type {string} */ id) => base44.entities.Report.delete(id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['reports'] }); setViewing(null); toast.success('Report deleted'); },
    });

    const generateReport = async () => {
        if (!form.title || !form.analysisId) { toast.error('Fill in title and select an analysis'); return; }
        setGenerating(true);

        const analysis = analyses.find(a => a.id === form.analysisId);
        const mitigation = mitigations.find(m => m.analysis_id === form.analysisId);

        const content = {
            generated_at: new Date().toISOString(),
            model_name: analysis?.model_name || 'Unknown Model',
            dataset: analysis?.dataset_name,
            sensitive_feature: analysis?.sensitive_feature,
            target_column: analysis?.target_column,
            fairness_score: analysis?.fairness_score,
            alert_level: analysis?.alert_level,
            metrics: {
                statistical_parity: analysis?.statistical_parity,
                disparate_impact: analysis?.disparate_impact,
                equalized_odds_tpr: analysis?.equalized_odds_tpr,
                equalized_odds_fpr: analysis?.equalized_odds_fpr,
                demographic_parity_diff: analysis?.demographic_parity_diff,
            },
            mitigation: mitigation ? {
                technique: mitigation.technique,
                before_score: mitigation.before_score,
                after_score: mitigation.after_score,
                improvement: mitigation.improvement,
            } : null,
            compliance: {
                eu_ai_act: analysis?.fairness_score >= 75 ? 'Compliant' : 'Non-Compliant',
                equal_credit_opportunity: analysis?.disparate_impact >= 0.8 ? 'Compliant' : 'Non-Compliant',
                fair_housing_act: analysis?.statistical_parity < 0.1 ? 'Compliant' : 'Non-Compliant',
            },
            recommendations: analysis?.fairness_score < 75
                ? ['Apply bias mitigation techniques', 'Review data collection process', 'Audit model outputs regularly']
                : ['Continue monitoring', 'Periodic re-evaluation recommended'],
        };

        const report = await base44.entities.Report.create({
            title: form.title,
            dataset_name: analysis?.dataset_name,
            analysis_id: form.analysisId,
            mitigation_id: mitigation?.id,
            report_type: form.reportType,
            fairness_score: analysis?.fairness_score,
            status: 'final',
            content,
        });

        queryClient.invalidateQueries({ queryKey: ['reports'] });
        queryClient.invalidateQueries({ queryKey: ['reports_dashboard'] });
        setViewing(report);
        toast.success('Report generated successfully');
        setGenerating(false);
    };

    const exportJSON = (report) => {
        const blob = new Blob([JSON.stringify(report.content, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/\s+/g, '_')}_report.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Report exported as JSON');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Generate compliance and audit reports for your AI models</p>
                </div>
            </div>

            {/* Generate Form */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold mb-4">Generate New Report</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label className="text-xs">Report Title *</Label>
                        <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Q1 2026 Bias Audit" className="mt-1 h-9" />
                    </div>
                    <div>
                        <Label className="text-xs">Analysis *</Label>
                        <Select value={form.analysisId} onValueChange={v => setForm(f => ({ ...f, analysisId: v }))}>
                            <SelectTrigger className="mt-1 h-9">
                                <SelectValue placeholder="Select analysis" />
                            </SelectTrigger>
                            <SelectContent>
                                {analyses.map(a => <SelectItem key={a.id} value={a.id}>{a.dataset_name} — {a.sensitive_feature}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-xs">Report Type</Label>
                        <Select value={form.reportType} onValueChange={v => setForm(f => ({ ...f, reportType: v }))}>
                            <SelectTrigger className="mt-1 h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button onClick={generateReport} disabled={generating} className="mt-4 gap-2">
                    {generating ? (
                        <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                    ) : (
                        <><Plus className="w-3.5 h-3.5" /> Generate Report</>
                    )}
                </Button>
            </div>

            {/* Report Detail */}
            {viewing && (
                <div className="bg-card border border-border rounded-xl p-6 animate-slide-in">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold">{viewing.title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Generated {format(new Date(viewing.created_date), 'MMMM d, yyyy')} · {viewing.report_type?.replace(/_/g, ' ')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => exportJSON(viewing)}>
                                <Download className="w-3.5 h-3.5" /> Export JSON
                            </Button>
                            <StatusBadge status={viewing.status} className="" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center bg-muted/30 rounded-xl p-6">
                            <h4 className="text-xs font-medium text-muted-foreground mb-4">Overall Fairness</h4>
                            <FairnessGauge score={viewing.fairness_score || 0} />
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-muted-foreground">Bias Metrics</h4>
                            {viewing.content?.metrics && Object.entries(viewing.content.metrics).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/50">
                                    <span className="text-xs text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</span>
                                    <span className="text-xs font-mono-num font-medium">{typeof v === 'number' ? v.toFixed(4) : '–'}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-muted-foreground">Compliance Status</h4>
                            {viewing.content?.compliance && Object.entries(viewing.content.compliance).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between py-1.5 border-b border-border/50">
                                    <span className="text-xs text-muted-foreground">{k.replace(/_/g, ' ')}</span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${v === 'Compliant' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                                        }`}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {viewing.content?.recommendations?.length > 0 && (
                        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-primary mb-2">Recommendations</h4>
                            <ul className="space-y-1">
                                {viewing.content.recommendations.map((r, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {viewing.content?.mitigation && (
                        <div className="mt-4 bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-green-600 mb-2">Mitigation Applied</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-lg font-bold font-mono-num text-foreground">{viewing.content.mitigation.before_score}</p>
                                    <p className="text-xs text-muted-foreground">Score Before</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold font-mono-num text-green-500">{viewing.content.mitigation.after_score}</p>
                                    <p className="text-xs text-muted-foreground">Score After</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold font-mono-num text-primary">+{viewing.content.mitigation.improvement}</p>
                                    <p className="text-xs text-muted-foreground">Improvement</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Reports List */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-semibold">All Reports ({reports.length})</h3>
                </div>
                {reports.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                        <p className="text-sm text-muted-foreground">No reports yet. Generate your first report above.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/40">
                                {['Title', 'Dataset', 'Type', 'Score', 'Status', 'Date', ''].map(h => (
                                    <th key={h} className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(r => (
                                <tr key={r.id} onClick={() => setViewing(r)} className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors ${viewing?.id === r.id ? 'bg-primary/5' : ''}`}>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <FileText className="w-3.5 h-3.5 text-primary" />
                                            </div>
                                            <span className="font-medium">{r.title}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">{r.dataset_name}</td>
                                    <td className="py-3 px-4 text-muted-foreground capitalize">{r.report_type?.replace(/_/g, ' ')}</td>
                                    <td className="py-3 px-4 font-mono-num font-bold">{r.fairness_score || '–'}</td>
                                    <td className="py-3 px-4"><StatusBadge status={r.status} className="" /></td>
                                    <td className="py-3 px-4 text-muted-foreground">{format(new Date(r.created_date), 'MMM d, yyyy')}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={e => { e.stopPropagation(); exportJSON(r); }}>
                                                <Download className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={e => { e.stopPropagation(); deleteMutation.mutate(r.id); }}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
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