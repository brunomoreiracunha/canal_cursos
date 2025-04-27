import { Link } from 'react-router-dom';

export function Footer() {
  
  return (
    <footer className="bg-gray-900 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <Link to="/" className="text-red-600 text-xl font-bold mb-4 block">
              CanalCursos
            </Link>
            <p className="text-gray-400">
              Sua plataforma de educação online de alta qualidade.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h5 className="text-white font-semibold mb-4">Links Úteis</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/sobre" className="hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/politicas" className="hover:text-white transition-colors">
                  Políticas de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h5 className="text-white font-semibold mb-4">Contato</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a 
                  href="mailto:contato@canalcursos.com.br" 
                  className="hover:text-white transition-colors"
                >
                  contato@canalcursos.com.br
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/5511999999999" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: (11) 99999-9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} CanalCursos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
