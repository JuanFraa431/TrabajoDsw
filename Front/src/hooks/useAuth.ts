import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Cliente } from '../interface/cliente';

interface AuthState {
  user: Cliente | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

/**
 * Hook de autenticación que obtiene los datos del usuario actual
 * directamente desde el backend usando el JWT token almacenado.
 * 
 * NO usa localStorage para datos del usuario, solo para el token.
 * El rol se valida siempre contra el servidor, evitando manipulación local.
 */
export function useAuth(): AuthState & { logout: () => void; refetch: () => void } {
  const [user, setUser] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/cliente/me');
      setUser(response.data.data);
    } catch (error) {
      // Token inválido o expirado: limpiar
      console.error('Error obteniendo usuario actual:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const tipoUsuario = user ? (user as any).tipo_usuario ?? (user as any).tipoUsuario ?? '' : '';
  const isAdmin = typeof tipoUsuario === 'string' && tipoUsuario.toUpperCase() === 'ADMIN';
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    logout,
    refetch: fetchUser,
  };
}
