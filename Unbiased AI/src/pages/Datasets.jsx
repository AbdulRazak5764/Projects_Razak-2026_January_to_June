import { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Database, Trash2, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/StatusBadge';
import { parseCSV } from '@/lib/biasEngine';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Datasets() {
    const queryClient = useQueryClient();
    const fileRef = useRef();
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });

    const { data: datasets = [], isLoading } = useQuery({
        queryKey: ['datasets'],
        queryFn: () => base44.entities.Dataset.list('-created_date', 50),
    });

    const deleteMutation = useMutation({
        mutationFn: (/** @type {string} */ id) => base44.entities.Dataset.delete(id),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['datasets'] }); toast.success('Dataset deleted'); },
    });

    const handleFile = async (file) => {
        if (!file) return;
        if (!file.name.endsWith('.csv')) { toast.error('Only CSV files are supported'); return; }

        const text = await file.text();
        const rows = parseCSV(text);
        if (!rows.length) { toast.error('CSV appears to be empty'); return; }
        const columns = Object.keys(rows[0]);

        setPreview({ file, rows, columns, rowCount: rows.length });
        setForm(f => ({ ...f, name: f.name || file.name.replace('.csv', '') }));
    };

    const handleUpload = async () => {
        if (!preview) return;
        setUploading(true);
        const { file, rows, columns } = preview;

        const { file_url } = await base44.integrations.Core.UploadFile({ file });

        await base44.entities.Dataset.create({
            name: form.name || file.name,
            description: form.description,
            file_url,
            file_name: file.name,
            row_count: rows.length,
            column_count: columns.length,
            columns,
            status: 'uploaded',
            size_bytes: file.size,
        });

        queryClient.invalidateQueries({ queryKey: ['datasets'] });
        toast.success('Dataset uploaded successfully');
        setPreview(null);
        setForm({ name: '', description: '' });
        setUploading(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Datasets</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Upload and manage your training data for bias analysis</p>
                </div>
                <Button onClick={() => /** @type {any} */ (fileRef.current)?.click()} className="gap-2">
                    <Upload className="w-4 h-4" /> Upload CSV
                </Button>
            </div>

            {/* Upload Zone */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
          ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => /** @type {any} */ (fileRef.current)?.click()}
            >
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">Drop CSV file here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Supports CSV files up to 50MB. Headers required in first row.</p>
            </div>

            {/* Preview & Form */}
            {preview && (
                <div className="bg-card border border-border rounded-xl p-6 animate-slide-in">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold text-foreground">File Ready: {preview.file.name}</span>
                            <span className="text-xs text-muted-foreground">({preview.rowCount.toLocaleString()} rows · {preview.columns.length} columns)</span>
                        </div>
                        <button onClick={() => setPreview(null)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label className="text-xs">Dataset Name *</Label>
                            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="My Dataset" className="mt-1 h-9" />
                        </div>
                        <div>
                            <Label className="text-xs">Description</Label>
                            <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" className="mt-1 h-9" />
                        </div>
                    </div>

                    {/* Column Preview */}
                    <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Detected columns ({preview.columns.length})</p>
                        <div className="flex flex-wrap gap-1.5">
                            {preview.columns.map(c => (
                                <span key={c} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md font-medium">{c}</span>
                            ))}
                        </div>
                    </div>

                    {/* Data Preview */}
                    <div className="overflow-x-auto max-h-40 overflow-y-auto rounded-lg border border-border scrollbar-thin mb-4">
                        <table className="w-full text-xs">
                            <thead className="sticky top-0 bg-muted">
                                <tr>
                                    {preview.columns.slice(0, 8).map(c => (
                                        <th key={c} className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap">{c}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.rows.slice(0, 5).map((row, i) => (
                                    <tr key={i} className="border-t border-border/50">
                                        {preview.columns.slice(0, 8).map(c => (
                                            <td key={c} className="px-3 py-1.5 text-foreground whitespace-nowrap font-mono-num">{row[c]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Button onClick={handleUpload} disabled={uploading || !form.name} className="gap-2">
                        {uploading ? (
                            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                        ) : (
                            <><Upload className="w-3.5 h-3.5" /> Upload Dataset</>
                        )}
                    </Button>
                </div>
            )}

            {/* Datasets Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-semibold">Uploaded Datasets ({datasets.length})</h3>
                </div>
                {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
                ) : datasets.length === 0 ? (
                    <div className="p-12 text-center">
                        <Database className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                        <p className="text-sm text-muted-foreground">No datasets yet. Upload a CSV to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Name</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Rows</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Columns</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Uploaded</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datasets.map(d => (
                                    <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <Database className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{d.name}</p>
                                                    {d.description && <p className="text-xs text-muted-foreground">{d.description}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-mono-num text-muted-foreground">{d.row_count?.toLocaleString() || '–'}</td>
                                        <td className="py-3 px-4 font-mono-num text-muted-foreground">{d.column_count || '–'}</td>
                                        <td className="py-3 px-4"><StatusBadge status={d.status} /></td>
                                        <td className="py-3 px-4 text-muted-foreground">{format(new Date(d.created_date), 'MMM d, yyyy')}</td>
                                        <td className="py-3 px-4 text-right">
                                            <Button
                                                variant="ghost" size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={() => deleteMutation.mutate(d.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </td>
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