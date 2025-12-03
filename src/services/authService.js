import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  login: async (email, password) => {
    try {
      // TODO: Reemplazar con tu endpoint real
      // const response = await axios.post(`${API_URL}/auth/login`, {
      //   email,
      //   password,
      // });

      // Simulación de respuesta con roles
      // En producción, esto vendría de tu API
      let userData;

      if (email === 'admin@studdeo.com') {
        userData = {
          id: 1,
          email: 'admin@studdeo.com',
          name: 'Administrador',
          role: 'admin',
          token: 'fake-admin-token'
        };
      } else if (email === 'teacher@studdeo.com') {
        userData = {
          id: 2,
          email: 'teacher@studdeo.com',
          name: 'Profesor Demo',
          role: 'teacher',
          token: 'fake-teacher-token'
        };
      } else {
        throw new Error('Credenciales inválidas');
      }

      return userData;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  logout: async () => {
    try {
      // TODO: Reemplazar con tu endpoint real si es necesario
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  validateToken: async (token) => {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await axios.get(`${API_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
