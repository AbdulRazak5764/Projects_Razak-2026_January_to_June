import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Brain, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';
import { generateSHAPValues } from '@/lib/biasEngine';
import { toast } from 'sonner';

export default function Explainability() {
    const [analysisId, setAnalysisId] = useState('');
    const [shapData, setShapData] = useState([]);
    const [loading, setLoading] = useState(false);

    const { data: analyses = [] } = useQuery({
        queryKey: ['analyses'],
        queryFn: () => base44.entities.BiasAnalysis.list('-created_date', 50),
    });

    const selectedAnalysis = analyses.find(a => a.id === analysisId);

    const runExplainability = () => {
        if (!selectedAnalysis) { toast.error('Select an analysis first'); return; }
        setLoading(true);

        const fi = selectedAnalysis.feature_importance || [];
        const fallbackFI = fi.length ? fi : [
            { feature: 'age', importance: 0.34 },
            { feature: 'education', importance: 0.28 },
            { feature: 'gender', importance: 0.22 },
            { feature: 'experience', importance: 0.19 },
            { feature: 'race', importance: 0.15 },
            { feature: 'zip_code', importance: 0.12 },
        ];

        const shap = generateSHAPValues(fallbackFI, 2);
        setShapData(shap);
        setLoading(false);
        toast.success('SHAP values computed');
    };

    const featureBarData = shapData.map(s => ({
        feature: s.feature,
        importance: parseFloat((s.shap_mean_abs * 100).toFixed(2)),
    }));

    const COLORS = ['hsl(217,91%,60%)', 'hsl(142,72%,45%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)', 'hsl(280,65%,60%)', 'hsl(200,80%,55%)'];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Model Explainability</h1>
                <p className="text-sm text-muted-foreground mt-0.5">SHAP-style feature importance and group-level explanations</p>
            </div>

            {/* Theory Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Brain className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold">SHAP Values</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        SHapley Additive exPlanations (SHAP) assigns each feature an importance value for a particular prediction.
                        Features pushing predictions toward a positive outcome are shown positively; those pushing negatively are shown negatively.
                    </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Info className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <h3 className="text-sm font-semibold">LIME Explanations</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Local Interpretable Model-agnostic Explanations (LIME) explains individual predictions by approximating the model locally
                        with a simpler, interpretable surrogate model around the instance of interest.
                    </p>
                </div>
            </div>

            {/* Config */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold mb-4">Generate Explanations</h3>
                <div className="flex gap-4 items-end">
                    <div className="flex-1 max-w-sm">
                        <Label className="text-xs">Select Analysis</Label>
                        <Select value={analysisId} onValueChange={setAnalysisId}>
                            <SelectTrigger className="mt-1 h-9">
                                <SelectValue placeholder="Choose analysis" />
                            </SelectTrigger>
                            <SelectContent>
                                {analyses.map(a => (
                                    <SelectItem key={a.id} value={a.id}>
                                        {a.dataset_name} — {a.sensitive_feature}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={runExplainability} disabled={loading} className="gap-2">
                        {loading ? (
                            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Computing...</>
                        ) : (
                            <><Brain className="w-3.5 h-3.5" /> Compute SHAP</>
                        )}
                    </Button>
                </div>
            </div>

            {shapData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                    {/* Global Feature Importance */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="text-sm font-semibold mb-4">Global Feature Importance (SHAP Mean |value|)</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={featureBarData} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={80} />
                                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                                    {featureBarData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Group-level SHAP */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="text-sm font-semibold mb-4">Group-Level SHAP Contributions</h3>
                        <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
                            {shapData.map((s, i) => {
                                const maxVal = Math.max(...s.shap_values.map(v => Math.abs(v.value)));
                                return (
                                    <div key={s.feature} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-foreground">{s.feature}</span>
                                            <span className="text-xs text-muted-foreground font-mono-num">|{s.shap_mean_abs.toFixed(3)}|</span>
                                        </div>
                                        {s.shap_values.map((sv, j) => (
                                            <div key={j} className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground w-14">{sv.group}</span>
                                                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${Math.abs(sv.value) / (maxVal || 1) * 100}%`,
                                                            backgroundColor: sv.value >= 0 ? 'hsl(142,72%,45%)' : 'hsl(0,84%,60%)',
                                                            marginLeft: sv.value < 0 ? 'auto' : '0',
                                                        }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-mono-num w-14 text-right ${sv.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {sv.value > 0 ? '+' : ''}{sv.value.toFixed(3)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* LIME Explanation Table */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                        <h3 className="text-sm font-semibold mb-4">Feature Contribution Summary</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Feature</th>
                                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">SHAP Importance</th>
                                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Group A</th>
                                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Group B</th>
                                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Bias Risk</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shapData.map((s, i) => {
                                        const [gA, gB] = s.shap_values;
                                        const diff = Math.abs((gA?.value || 0) - (gB?.value || 0));
                                        const risk = diff > 0.2 ? 'high' : diff > 0.1 ? 'medium' : 'none';
                                        return (
                                            <tr key={s.feature} className="border-b border-border/50 hover:bg-muted/20">
                                                <td className="py-2.5 px-3 font-medium">{s.feature}</td>
                                                <td className="py-2.5 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-muted rounded-full h-1.5 overflow-hidden">
                                                            <div className="h-full rounded-full bg-primary" style={{ width: `${s.shap_mean_abs * 100}%` }} />
                                                        </div>
                                                        <span className="text-xs font-mono-num">{(s.shap_mean_abs * 100).toFixed(1)}%</span>
                                                    </div>
                                                </td>
                                                <td className={`py-2.5 px-3 font-mono-num text-xs ${(gA?.value || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {gA?.value > 0 ? '+' : ''}{gA?.value?.toFixed(4) || '—'}
                                                </td>
                                                <td className={`py-2.5 px-3 font-mono-num text-xs ${(gB?.value || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {gB?.value > 0 ? '+' : ''}{gB?.value?.toFixed(4) || '—'}
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md border
                            ${risk === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                            risk === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                                'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                                        {risk === 'high' ? 'High' : risk === 'medium' ? 'Medium' : 'Low'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {shapData.length === 0 && (
                <div className="bg-card border border-border rounded-xl p-16 text-center">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">Select a bias analysis and click "Compute SHAP" to generate explanations.</p>
                </div>
            )}
        </div>
    );
}