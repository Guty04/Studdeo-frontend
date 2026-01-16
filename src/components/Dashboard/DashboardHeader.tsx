import React, { useState } from 'react';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
import type { User } from '../../contexts/AuthContext';
import CreateUserModal from './CreateUserModal';

interface DashboardHeaderProps {
  user: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = user?.role_name === 'administrator';

  const handleCreateUser = (email: string, professors: unknown[]) => {
    console.log('Creating user:', { email, professors });
    // Aquí iría la lógica para crear el usuario
    setIsModalOpen(false);
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
