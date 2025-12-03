import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import MetricsPage from '../pages/dashboard/MetricsPage';
import ClassesPage from '../pages/dashboard/ClassesPage';
import TeachersPage from '../pages/dashboard/TeachersPage';
import StudentsPage from '../pages/dashboard/StudentsPage';

// Definición de roles
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
};

// Definición de rutas con control de acceso por roles
export const routes = [
  {
    path: '/login',
    element: <LoginPage />,
    isPublic: true,
    roles: [], // Ruta pública
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    roles: [ROLES.ADMIN, ROLES.TEACHER], // Solo admin y profesores pueden acceder al dashboard
    children: [
      {
        index: true,
        element: <MetricsPage />,
        roles: [ROLES.ADMIN, ROLES.TEACHER], // Ambos roles ven métricas
      },
      {
        path: 'classes',
        element: <ClassesPage />,
        roles: [ROLES.ADMIN, ROLES.TEACHER], // Ambos roles gestionan clases
      },
      {
        path: 'teachers',
        element: <TeachersPage />,
        roles: [ROLES.ADMIN], // Solo admin gestiona profesores
      },
      {
        path: 'students',
        element: <StudentsPage />,
        roles: [ROLES.ADMIN, ROLES.TEACHER], // Ambos roles gestionan estudiantes
      },
    ],
  },
  {
    path: '/',
    element: <LoginPage />, // Login como página principal
    isPublic: true,
    roles: [],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
    roles: [],
  },
];
