// src/hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, isAuthenticated, getCurrentUserId } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación al montar
    if (isAuthenticated()) {
      const userId = getCurrentUserId();
      setUser({
        id: userId,
        // Aquí podrías cargar más datos del usuario si lo necesitas
      });
    }
    setLoading(false);
  }, []);

  const login = async (logon, password) => {
    try {
      const data = await loginService(logon, password);
      setUser({ 
        id: data.userId,
        logon: logon
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.firstErrorMessage || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};