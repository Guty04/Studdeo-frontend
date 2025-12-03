import { useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import icon from '@/assets/StudeoIcon.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authService.login(email, password);
      login(userData);
      navigate('/dashboard'); // Redirigir al dashboard
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-violet-500 to-purple-600 p-4">
      <div className="flex w-full max-w-6xl items-center">
        {/* Icono a la izquierda */}
        <div className="flex-1 flex justify-center items-center">
          <img src={icon} alt="Studdeo Icon" className="max-w-xs max-h-xs" />
        </div>

        {/* Card del Login a la derecha */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
            {/* Logo o Título */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-violet-700">Studdeo</h1>
              <p className="text-gray-500 mt-2">Sistema de Gestión Académica</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                <span className="font-medium">⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="usuario@studdeo.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition duration-200"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Footer opcional */}
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>© 2025 Studdeo. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginForm;
