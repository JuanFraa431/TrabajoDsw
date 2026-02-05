// Configuración de la API
// En desarrollo usa el proxy de webpack, en producción usa la URL del backend en Render

const getApiBaseUrl = (): string => {
    // Si hay una variable de entorno configurada, usarla
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    
    // En desarrollo (localhost), usar ruta relativa que usa el proxy de webpack
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return '';
    }
    
    // En producción, usar el backend en Render
    return 'https://trabajodsw.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper para construir URLs de API
export const apiUrl = (endpoint: string): string => {
    const base = API_BASE_URL;
    // Asegurar que el endpoint empiece con /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${normalizedEndpoint}`;
};

export default API_BASE_URL;
