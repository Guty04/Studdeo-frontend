import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, loading, hasAccess } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-violet-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si hay roles requeridos y el usuario no tiene acceso, mostrar error
  if (requiredRoles.length > 0 && !hasAccess(requiredRoles)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-violet-600 to-purple-600">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
