import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

const DashboardHeader = ({ userName, userAvatar }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Crear Usuario
          </Button>
          
          <Avatar className="cursor-pointer" onClick={logout}>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-violet-100 text-violet-700">
              {userName?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
