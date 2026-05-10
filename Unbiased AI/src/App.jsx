import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';

// Page imports
import Dashboard from './pages/Dashboard';
import Datasets from './pages/Datasets';
import BiasAnalysis from './pages/BiasAnalysis';
import Mitigation from './pages/Mitigation';
import Explainability from './pages/Explainability';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

    if (isLoadingPublicSettings || isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-navy">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-white/60 text-sm">Loading Unbiased AI...</p>
                </div>
            </div>
        );
    }

    if (authError) {
        if (authError.type === 'user_not_registered') {
            return <UserNotRegisteredError />;
        } else if (authError.type === 'auth_required') {
            navigateToLogin();
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md">
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
                        <p className="text-slate-600 text-sm mb-4">
                            The application attempted to redirect you to the login page, but the authentication client is not fully configured (missing .env variables or proxy). 
                        </p>
                        <p className="text-slate-500 text-xs font-mono bg-slate-100 p-2 rounded">
                            VITE_BASE44_APP_BASE_URL is not set.
                        </p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200 max-w-md">
                        <h2 className="text-xl font-bold text-red-600 mb-2">Application Load Error</h2>
                        <p className="text-slate-800 text-sm font-mono bg-red-50 p-3 rounded mb-4">
                            {authError.message || 'An unknown error occurred while loading the app state.'}
                        </p>
                        <p className="text-slate-600 text-xs">If running locally, ensure your backend server proxy and .env definitions are configured correctly.</p>
                    </div>
                </div>
            );
        }
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/datasets" element={<Datasets />} />
                <Route path="/bias-analysis" element={<BiasAnalysis />} />
                <Route path="/mitigation" element={<Mitigation />} />
                <Route path="/explainability" element={<Explainability />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Settings />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return <div style={{color:'red', padding:'2rem'}}><h1>React Render Error</h1><pre>{this.state.error?.stack || this.state.error?.message}</pre></div>;
        }
        return this.props.children;
    }
}

function App() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <ErrorBoundary>
                        <AuthenticatedApp />
                    </ErrorBoundary>
                </Router>
                <Toaster />
            </QueryClientProvider>
        </AuthProvider>
    );
}

export default App;