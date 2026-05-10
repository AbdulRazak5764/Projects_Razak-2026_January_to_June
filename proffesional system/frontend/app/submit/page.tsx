"use client";
import { useState } from 'react';

export default function Submit() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setStatus('Uploading...');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('full_name', 'Student Test'); // Hardcoded for demo
        formData.append('roll_number', '123456');
        formData.append('classroom', 'CS-A');
        formData.append('section', 'A');
        formData.append('assessment_id', '1');

        try {
            const res = await fetch('http://localhost:8000/api/v1/submit/direct', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setStatus('Submission Successful! Redirecting...');
                setTimeout(() => window.location.href = '/dashboard', 2000);
            } else {
                setStatus('Upload Failed');
            }
        } catch (err) {
            console.error(err);
            setStatus('Error uploading');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="glass-panel p-10 rounded-xl w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Submit Assessment</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm text-gray-400">Answer Script PDF</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        />
                    </div>

                    <button type="submit" disabled={!file} className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50">
                        {status || 'Upload Submission'}
                    </button>
                </form>
            </div>
        </div>
    );
}
