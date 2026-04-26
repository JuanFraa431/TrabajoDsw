import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import axios from 'axios';
import './public/global.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { API_BASE_URL } from './config/api';

// Configurar axios globalmente para todas las llamadas
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 90000;

// Interceptor global para inyectar el token JWT en cada request
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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