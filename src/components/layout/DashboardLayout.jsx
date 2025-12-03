import { Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import Sidebar from '@/components/dashboard/Sidebar.jsx';
import DashboardHeader from '@/components/dashboard/DashboardHeader.jsx';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          userName={user?.name} 
          userAvatar={user?.avatar}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
