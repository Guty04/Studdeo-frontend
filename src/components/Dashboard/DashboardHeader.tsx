import React, { useState } from 'react';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
import type { User } from '../../contexts/AuthContext';
import CreateUserModal from './CreateUserModal';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';

interface ProfessorData {
  external_reference: number;
  name: string;
  email: string;
  active: boolean;
}

interface DashboardHeaderProps {
  user: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAdmin = user?.role_name === 'administrator';

  // Genera contraseña segura (no se muestra en la UI)
  const generateSecurePassword = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const entropy = crypto.randomUUID() + Date.now().toString(36) + Math.random().toString(36);
    let pwd = upper[Math.floor(Math.random() * upper.length)];
    for (let i = 0; i < 7; i++) {
      const idx = (entropy.charCodeAt(i) * Date.now()) % chars.length;
      pwd += chars[idx];
    }
    return pwd.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleCreateUser = async (professorData: ProfessorData, percentage: number) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      
      // Separar nombre y apellido (asumiendo que el nombre tiene formato "Nombre Apellido")
      const nameParts = professorData.name.split(' ');
      const name = nameParts[0] || professorData.name;
      const lastname = nameParts.slice(1).join(' ') || name; // Si no hay apellido, usar el nombre
      
      // Construir el body según el formato requerido
      const body = {
        name: name,
        lastname: lastname,
        email: professorData.email,
        role_name: 'teacher',
        password: generateSecurePassword(),
        id_role: 2 // ID de rol para teacher (ajustar según tu backend)
      };

      console.log('Creando usuario con datos:', body);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.user.create}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Error al crear el usuario');
      }

      const result = await response.json();
      
      alert(`Usuario creado exitosamente\n\nEl profesor recibirá sus credenciales por correo electrónico a: ${professorData.email}\n\nPorcentaje asignado: ${percentage}% (se configurará próximamente)`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error instanceof Error ? error.message : 'Error al crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-studdeo-violet font-league-spartan">
          Bienvenido, {user?.name} {user?.lastname}
        </h1>
        {isAdmin && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-studdeo-violet hover:bg-purple-700 text-white font-montserrat text-sm sm:text-base w-full sm:w-auto"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Crear Usuario
          </Button>
        )}
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </>
  );
};

export default DashboardHeader;
