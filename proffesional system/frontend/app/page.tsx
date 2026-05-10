import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="z-10 text-center glass-panel p-12 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-lg">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
          AI Evaluator
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl">
          Automated Assessment Evaluation System. Upload PDFs, let AI grade them, and generate instant reports.
        </p>

        <div className="flex gap-6 justify-center">
          <Link href="/dashboard" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-md transition-all duration-300 text-lg font-semibold hover:scale-105 active:scale-95">
            Faculty Dashboard
          </Link>
          <Link href="/submit" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 text-lg font-semibold hover:scale-105 active:scale-95">
            Student Submission
          </Link>
        </div>
      </div>
    </main>
  );
}
