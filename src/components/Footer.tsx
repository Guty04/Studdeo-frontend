import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-studdeo-violet text-white font-montserrat">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:justify-items-center">
          <div className="text-center md:text-center text-base">
            <h3 className="text-lg font-bold text-studdeo-yellow mb-4 font-league-spartan">Acerca de</h3>
            <p className="text-base text-gray-200">
              Plataforma educativa diseñada para conectar estudiantes con profesores expertos.
            </p>
          </div>
          <div className="text-center md:text-center text-base">
            <h3 className="text-lg font-bold text-studdeo-yellow mb-4 font-league-spartan">Enlaces</h3>
            <ul className="space-y-2 text-base">
              <li>
                <a href="#" className="text-gray-200 hover:text-studdeo-yellow transition-colors font-montserrat">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-studdeo-yellow transition-colors font-montserrat">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-studdeo-yellow transition-colors font-montserrat">
                  Ayuda y soporte
                </a>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-center text-base">
            <h3 className="text-lg font-bold text-studdeo-yellow mb-4 font-league-spartan">Contacto</h3>
            <p className="text-base text-gray-200 mb-4">info@ejemplo.com</p>
            <div className="flex items-center justify-center md:justify-center space-x-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 bg-studdeo-yellow text-studdeo-violet rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 bg-studdeo-yellow text-studdeo-violet rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                <i className="fab fa-twitter" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-purple-700 pt-6 text-center text-base text-gray-300">
          <p>© 2025 Studdeo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;