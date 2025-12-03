import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/'; // Redirigir al login
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (requiredRoles) => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role);
  };

  // Función para verificar si el usuario tiene permisos para una ruta
  const hasAccess = (routeRoles) => {
    // Si no hay roles requeridos, permitir acceso
    if (!routeRoles || routeRoles.length === 0) return true;
    // Si el usuario no está autenticado, denegar acceso
    if (!user) return false;
    // Verificar si el rol del usuario está en los roles permitidos
    return hasRole(routeRoles);
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    hasAccess,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
