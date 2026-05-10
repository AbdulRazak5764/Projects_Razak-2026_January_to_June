"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/v1/submissions')
            .then(res => res.json())
            .then(data => {
                setSubmissions(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Faculty Dashboard
                </h1>
                <div className="space-x-4">
                    <button onClick={() => window.open('http://localhost:8000/api/v1/reports/excel')} className="px-6 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg transition-all">
                        Download Excel Report
                    </button>
                    <Link href="/" className="px-6 py-2 glass-button rounded-lg">Logout</Link>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center p-20">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {submissions.map((sub: any) => (
                        <div key={sub.id} className="glass-panel p-6 rounded-xl hover:scale-[1.02] transition-transform">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{sub.student_name}</h3>
                                    <p className="text-sm text-gray-400">Roll: {sub.roll_number}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs ${sub.status === 'evaluated' ? 'bg-green-500/20 text-green-300' :
                                        sub.status === 'processed' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                    {sub.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm text-gray-400">Submitted: {new Date(sub.submitted_at).toLocaleDateString()}</div>
                                <div className="mt-2 text-2xl font-bold text-white">
                                    {sub.marks ? `${sub.marks}/100` : '--/100'}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                {/* Link to detail view would go here */}
                                <button className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 rounded text-sm transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}

                    {submissions.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No submissions found. Waiting for Google Forms data...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
