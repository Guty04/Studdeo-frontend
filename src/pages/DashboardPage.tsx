import React from 'react';
import SideBar from '../components/Dashboard/SideBar';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-studdeo-violet font-league-spartan">
            Dashboard
          </h1>
          <p className="mt-4 text-gray-600 font-montserrat">
            Bienvenido a tu panel de control
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;