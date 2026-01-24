import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, XCircle } from 'lucide-react';
import logo from '../assets/Studdeo.png';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validaciones de contraseña
  const passwordValidations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    passwordsMatch: password === repeatPassword && password.length > 0,
  };

  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError('Por favor cumple con todos los requisitos de la contraseña.');
      return;
    }

    if (!token) {
      setError('Token de recuperación no válido.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.restorePassword(token)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password,
          repeat_password: repeatPassword
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 422) {
          throw new Error(errorData?.detail?.[0]?.msg || 'Error de validación');
        }
        throw new Error(errorData?.detail || 'Error al restablecer la contraseña');
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restablecer la contraseña. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
      {isValid ? (
        <CheckCircle className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      <span className="font-montserrat">{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-studdeo-violet to-purple-800 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white">
        <CardHeader className="text-center pt-6 pb-4">
          <div className="mx-auto ml-[6.1rem]">
            <img src={logo} alt="Studdeo logo and name" className="w-40 h-auto mb-4" />
          </div>
          <CardDescription className="text-2xl text-studdeo-violet font-montserrat font-bold">
            Restablecer Contraseña
          </CardDescription>
          <p className="text-sm text-gray-600 mt-2 font-montserrat">
            {success 
              ? '¡Tu contraseña ha sido actualizada!' 
              : 'Ingresa tu nueva contraseña'}
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-800 font-montserrat">
                    Contraseña actualizada exitosamente
                  </p>
                </div>
                <p className="text-sm text-green-700 font-montserrat">
                  Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-studdeo-yellow text-studdeo-violet hover:bg-yellow-500 font-bold font-montserrat py-2 h-auto"
              >
                Ir al inicio de sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nueva contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-studdeo-violet font-montserrat">
                  Nueva contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 font-montserrat border-gray-300 focus:border-studdeo-violet focus:ring-studdeo-violet"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Repetir contraseña */}
              <div className="space-y-2">
                <Label htmlFor="repeatPassword" className="text-studdeo-violet font-montserrat">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="repeatPassword"
                    type={showRepeatPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 font-montserrat border-gray-300 focus:border-studdeo-violet focus:ring-studdeo-violet"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Validaciones de contraseña */}
              <div className="p-3 bg-gray-50 rounded-md space-y-1.5">
                <p className="text-xs font-semibold text-gray-700 font-montserrat mb-2">
                  La contraseña debe cumplir:
                </p>
                <ValidationItem isValid={passwordValidations.minLength} text="Mínimo 8 caracteres" />
                <ValidationItem isValid={passwordValidations.hasUppercase} text="Al menos una mayúscula" />
                <ValidationItem isValid={passwordValidations.hasLowercase} text="Al menos una minúscula" />
                <ValidationItem isValid={passwordValidations.hasNumber} text="Al menos un número" />
                <ValidationItem isValid={passwordValidations.hasSpecial} text="Al menos un carácter especial (!@#$%...)" />
                <ValidationItem isValid={passwordValidations.passwordsMatch} text="Las contraseñas coinciden" />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700 font-montserrat">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !isPasswordValid}
                className="w-full bg-studdeo-yellow text-studdeo-violet hover:bg-yellow-500 font-bold font-montserrat py-2 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-studdeo-violet border-t-transparent rounded-full animate-spin" />
                    <span>Actualizando...</span>
                  </div>
                ) : (
                  'Restablecer contraseña'
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="w-full text-studdeo-violet hover:text-studdeo-violet hover:bg-studdeo-violet/10 font-montserrat"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
