import React from 'react';
import LoginCard from '../components/LoginCard';
import Footer from '../components/Footer';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenido a Studdeo
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tu plataforma educativa de confianza
            </p>
          </div>
          <LoginCard />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;