import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

const rootElement = document.getElementById('root');
if (rootElement) {
    try {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    } catch (e) {
        rootElement.innerHTML = `<div style="color:red; padding: 20px; font-family: monospace;"><h1>Fatal Render Error</h1><pre>${e.stack || e.message || e}</pre></div>`;
    }
}
