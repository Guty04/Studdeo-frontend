import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
            © 2025 Studdeo. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Términos de Servicio
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;