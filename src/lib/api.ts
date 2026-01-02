import { API_BASE_URL } from '../config/api';

/**
 * Obtiene el token de autenticación del storage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

/**
 * Wrapper de fetch que incluye automáticamente el token de autenticación
 * @param endpoint - Endpoint de la API (puede ser una ruta relativa o URL completa)
 * @param options - Opciones de fetch (method, body, etc.)
 * @returns Promise con la respuesta
 */
export const authenticatedFetch = async (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No se encontró token de autenticación');
  }

  // Si el endpoint ya es una URL completa, usarla tal cual, sino agregar la base
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'accept': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Si la respuesta es 401, el token expiró o es inválido
  if (response.status === 401) {
    // Limpiar storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('token_type');
    sessionStorage.removeItem('user_data');
    
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }

  return response;
};

/**
 * Wrapper de authenticatedFetch que parsea automáticamente la respuesta JSON
 * @param endpoint - Endpoint de la API (puede ser una ruta relativa o URL completa)
 * @param options - Opciones de fetch
 * @returns Promise con los datos parseados
 */
export const authenticatedFetchJSON = async <T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const response = await authenticatedFetch(endpoint, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Error en la petición: ${response.statusText}`);
  }

  return response.json();
};
