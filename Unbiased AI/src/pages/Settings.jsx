import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function Settings() {
    const [thresholds, setThresholds] = useState({
        spdThreshold: '0.10',
        diThreshold: '0.80',
        eoThreshold: '0.10',
        scoreThreshold: '75',
    });
    const [notifs, setNotifs] = useState({ emailAlerts: true, highRiskOnly: false, weeklyDigest: true });

    const save = () => toast.success('Settings saved');

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Configure fairness thresholds and system preferences</p>
            </div>

            {/* Fairness Thresholds */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Shield className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold">Fairness Thresholds</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { key: 'spdThreshold', label: 'Statistical Parity Diff. (max)', hint: 'Below this is fair' },
                        { key: 'diThreshold', label: 'Disparate Impact Ratio (min)', hint: 'Above this is fair (4/5 rule)' },
                        { key: 'eoThreshold', label: 'Equalized Odds Diff. (max)', hint: 'Below this is fair' },
                        { key: 'scoreThreshold', label: 'Minimum Fairness Score', hint: 'Alert if score falls below' },
                    ].map(({ key, label, hint }) => (
                        <div key={key}>
                            <Label className="text-xs">{label}</Label>
                            <Input
                                value={thresholds[key]}
                                onChange={e => setThresholds(t => ({ ...t, [key]: e.target.value }))}
                                className="mt-1 h-9 font-mono-num"
                            />
                            <p className="text-xs text-muted-foreground mt-1">{hint}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Bell className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <div className="space-y-4">
                    {[
                        { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive email when bias is detected' },
                        { key: 'highRiskOnly', label: 'High Risk Only', desc: 'Only alert for critical bias issues' },
                        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly fairness summary report' },
                    ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                            <div>
                                <p className="text-sm font-medium">{label}</p>
                                <p className="text-xs text-muted-foreground">{desc}</p>
                            </div>
                            <Switch checked={notifs[key]} onCheckedChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
                        </div>
                    ))}
                </div>
            </div>

            {/* System Info */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Database className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold">System Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                    {[
                        { label: 'Platform', value: 'Unbiased AI v1.0.0' },
                        { label: 'Engine', value: 'JS Bias Engine (Statistical)' },
                        { label: 'Metrics', value: 'Statistical Parity, Disparate Impact, Equalized Odds' },
                        { label: 'Mitigation Methods', value: 'Reweighing, Calibrated EO, DI Remover' },
                        { label: 'Explainability', value: 'SHAP-style Feature Importance' },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={save} className="gap-2">
                <SettingsIcon className="w-3.5 h-3.5" /> Save Settings
            </Button>
        </div>
    );
}