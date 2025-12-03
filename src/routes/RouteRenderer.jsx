import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { routes } from './routes.jsx';

const RouteRenderer = () => {
  const { hasAccess, isAuthenticated } = useAuth();

  // Función para filtrar rutas según permisos del usuario
  const getFilteredRoutes = () => {
    return routes.filter(route => {
      // Si es una ruta pública, siempre mostrar
      if (route.isPublic) return true;

      // Si el usuario no está autenticado, solo mostrar rutas públicas
      if (!isAuthenticated) return route.isPublic;

      // Verificar si el usuario tiene acceso a la ruta
      return hasAccess(route.roles);
    });
  };

  // Función para filtrar rutas hijas
  const getFilteredChildren = (children) => {
    if (!children) return [];

    return children.filter(child => {
      // Si no hay roles definidos para la ruta hija, heredar de la ruta padre
      if (!child.roles || child.roles.length === 0) return true;

      return hasAccess(child.roles);
    });
  };

  const filteredRoutes = getFilteredRoutes();

  return (
    <Routes>
      {filteredRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={route.element}
        >
          {route.children && getFilteredChildren(route.children).map((childRoute, childIndex) => (
            <Route
              key={childIndex}
              index={childRoute.index}
              path={childRoute.path}
              element={childRoute.element}
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
};

export default RouteRenderer;
