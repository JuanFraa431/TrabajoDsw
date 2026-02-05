import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './public/global.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';


const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);



root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <HashRouter>
                <App />
            </HashRouter>
        </ErrorBoundary>
    </React.StrictMode>
);