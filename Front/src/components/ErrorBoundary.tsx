import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    fontFamily: 'Arial, sans-serif',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h1>⚠️ Algo salió mal</h1>
                    <p>Ha ocurrido un error en la aplicación.</p>
                    <details style={{ 
                        whiteSpace: 'pre-wrap', 
                        marginTop: '20px',
                        textAlign: 'left',
                        maxWidth: '800px',
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #f5c6cb'
                    }}>
                        <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                            Ver detalles del error
                        </summary>
                        <p><strong>Error:</strong> {this.state.error?.toString()}</p>
                        <p><strong>Stack:</strong></p>
                        <pre style={{ 
                            fontSize: '12px', 
                            overflow: 'auto',
                            backgroundColor: '#f1f1f1',
                            padding: '10px',
                            borderRadius: '4px'
                        }}>
                            {this.state.error?.stack}
                        </pre>
                        {this.state.errorInfo && (
                            <>
                                <p><strong>Component Stack:</strong></p>
                                <pre style={{ 
                                    fontSize: '12px', 
                                    overflow: 'auto',
                                    backgroundColor: '#f1f1f1',
                                    padding: '10px',
                                    borderRadius: '4px'
                                }}>
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </>
                        )}
                    </details>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{
                            marginTop: '20px',
                            padding: '10px 30px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#721c24',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        Recargar página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
