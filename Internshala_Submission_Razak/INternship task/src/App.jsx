import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'

const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
    return (
        <QueryClientProvider client={queryClientInstance}>
            <Router>
                <Suspense fallback={
                    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00e5ff', fontSize: '18px' }}>
                        Loading...
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="*" element={
                            <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <h1 style={{ fontSize: '4rem', opacity: 0.3 }}>404</h1>
                                    <button onClick={() => window.location.href = '/'} style={{ padding: '0.5rem 1.5rem', background: '#00e5ff', color: '#0a0f1e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                                        Go Home
                                    </button>
                                </div>
                            </div>
                        } />
                    </Routes>
                </Suspense>
            </Router>
        </QueryClientProvider>
    )
}

export default App